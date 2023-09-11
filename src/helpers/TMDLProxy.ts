/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ThisExtension } from '../ThisExtension';
import { PowerBIDataset } from '../vscode/treeviews/workspaces/PowerBIDataset';

import { fetch, getProxyAgent, RequestInit, Response } from '@env/fetch';

import { spawn } from 'child_process';
import { PowerBIApiService } from '../powerbi/PowerBIApiService';
import { Helper } from './Helper';

const SETTINGS_FILE = ".pbivscode.settings.json";
interface TMDLProxyData {
	connectionString: string;
	accessToken: string;
	datasetName: string;
	localPath: string;
}

interface TMDLProxyDataValidation {
	localPath: string;
}
export abstract class TMDLProxy {
	private static _secret: string;
	private static _port: number;
	private static _headers;
	private static _tmdlProxyUri: vscode.Uri;

	private static _tmdlProxyProcess: any;

	private static _datasetTmdlPathMapping: Map<PowerBIDataset, vscode.Uri> = new Map<PowerBIDataset, vscode.Uri>();

	static async ensureProxy(context: vscode.ExtensionContext, port: number): Promise<void> {

		this._port = port;
		this._secret = "MySecret";
		this._tmdlProxyUri = vscode.Uri.parse(`http://127.0.0.1:${this._port}`);

		//this._tmdlProxyUri = vscode.Uri.parse("http://localhost:19176");

		this._headers = {
			"X-TMDLProxy-Secret": this._secret,
			"Content-Type": 'application/json',
			"Accept": 'application/json'
		}

		if (!TMDLProxy._tmdlProxyProcess) {

			const proxyDllPath = vscode.Uri.joinPath(context.extensionUri, "resources", "TMDLProxy", "TMDLVSCodeProxy.dll").fsPath;

			ThisExtension.log(`Starting TMDLProxy from ${proxyDllPath} on port ${this._port} with secret ${this._secret}`);
			TMDLProxy._tmdlProxyProcess = spawn("dotnet", [proxyDllPath, this._tmdlProxyUri.toString(), this._secret]);

			/* Test Ports:
			Get-NetTCPConnection -State Listen | where-object {$_.LocalPort -gt 40000 } | sort-object { $_.LocalPort }
			*/

			TMDLProxy._tmdlProxyProcess.stdout.on('data', (data: any) => {
				ThisExtension.log(data.toString());
			});
			TMDLProxy._tmdlProxyProcess.stderr.on('data', (data: any) => {
				ThisExtension.log("ERROR: " + data.toString());
			});

			TMDLProxy._tmdlProxyProcess.on('error', (err) => {
				ThisExtension.log("Error starting TMDLProxy: " + err);
			});
			TMDLProxy._tmdlProxyProcess.on('close', (code) => {
				ThisExtension.log("TMDLProxy closed with code: " + code);
			});
		}
	}

	private static getDataset(localPath: vscode.Uri): PowerBIDataset {
		for (const [dataset, path] of this._datasetTmdlPathMapping) {
			if (path.fsPath.startsWith(localPath.fsPath)) {
				return dataset;
			}
		}
	}

	private static getLocalPath(dataset: PowerBIDataset): vscode.Uri {
		return this._datasetTmdlPathMapping.get(dataset);
	}

	private static async getLocalPathRecursive(localPath: vscode.Uri): Promise<vscode.Uri> {
		for (const [dataset, path] of this._datasetTmdlPathMapping) {
			if (localPath.fsPath.startsWith(path.fsPath)) {
				return path;
			}
		}

		while (localPath.fsPath != "/") {
			localPath = vscode.Uri.joinPath(localPath, "..");
			let files = await vscode.workspace.fs.readDirectory(localPath);
			for (const file of files) {
				if (file[0] == SETTINGS_FILE) {
					return localPath;
				}
			}
		}
	}

	static async test(dataset: PowerBIDataset): Promise<string> {
		try {
			const config: RequestInit = {
				method: "GET",
				headers: TMDLProxy._headers,
			};
			const endpoint = vscode.Uri.joinPath(TMDLProxy._tmdlProxyUri, "/tmdl/test").toString();

			let response = await fetch(endpoint, config);

			let resultText = await response.text();
			vscode.window.showInformationMessage(resultText);

			return resultText;

		} catch (error) {
			vscode.window.showErrorMessage(error);
		}
	}

	static async serialize(dataset: PowerBIDataset): Promise<void> {
		try {
			const accessToken = (await PowerBIApiService.getXmlaSession()).accessToken;
			const localPath = vscode.Uri.file("D:\\Desktop\\TMDL\\" + dataset.name);
			let body: TMDLProxyData = {
				"connectionString": await dataset.getXMLACConnectionString(),
				"accessToken": accessToken,
				"datasetName": dataset.name,
				"localPath": localPath.fsPath,
			};

			TMDLProxy._datasetTmdlPathMapping.set(dataset, localPath);

			const config: RequestInit = {
				method: "POST",
				headers: TMDLProxy._headers,
				body: JSON.stringify(body),
			};
			let endpoint = vscode.Uri.joinPath(TMDLProxy._tmdlProxyUri, "/tmdl/serialize").toString();

			let success = await Helper.fetchWithProgress("TMDL Publish", fetch(endpoint, config));
			
			if (success) {
				let settings = body;
				delete settings.accessToken;
				vscode.workspace.fs.writeFile(vscode.Uri.joinPath(localPath, SETTINGS_FILE), Buffer.from(JSON.stringify(settings)));

				Helper.addToWorkspace(vscode.Uri.file(localPath.fsPath), `PowerBI Dataseet - ${dataset.name}`, true);
			}
		} catch (error) {
			vscode.window.showErrorMessage(error);
		}
	}

	static async validate(resourceUri: vscode.Uri): Promise<void> {
		try {
			const localPath = await TMDLProxy.getLocalPathRecursive(resourceUri);
			if (!localPath) {
				vscode.window.showErrorMessage("Could not find local path for resourceUri: " + resourceUri.fsPath);
				return;
			}

			let body: TMDLProxyDataValidation = {
				"localPath": localPath.fsPath,
			};

			const config: RequestInit = {
				method: "POST",
				headers: TMDLProxy._headers,
				body: JSON.stringify(body),
			};
			let endpoint = vscode.Uri.joinPath(TMDLProxy._tmdlProxyUri, "/tmdl/validate").toString();

			let success = await Helper.fetchWithProgress("Validate TMDL", fetch(endpoint, config));
		} catch (error) {
			vscode.window.showErrorMessage(error);
		}
	}

	static async publish(resourceUri: vscode.Uri): Promise<void> {
		try {
			const accessToken = (await PowerBIApiService.getXmlaSession()).accessToken;
			const localPath = await TMDLProxy.getLocalPathRecursive(resourceUri);
			if (!localPath) {
				vscode.window.showErrorMessage("Could not find local path for resourceUri: " + resourceUri.fsPath);
				return;
			}
			let body: TMDLProxyData;

			const dataset: PowerBIDataset = TMDLProxy.getDataset(localPath);

			// if the export was done in the current session, we can use the dataset object
			if (dataset) {
				body = {
					"connectionString": await dataset.getXMLACConnectionString(),
					"accessToken": accessToken,
					"datasetName": dataset.name,
					"localPath": localPath.fsPath,
				};
			}
			else {
				body = JSON.parse((await vscode.workspace.fs.readFile(vscode.Uri.joinPath(localPath, SETTINGS_FILE))).toString());
				body.accessToken = accessToken;
			}

			const config: RequestInit = {
				method: "POST",
				headers: TMDLProxy._headers,
				body: JSON.stringify(body),
			};
			let endpoint = vscode.Uri.joinPath(TMDLProxy._tmdlProxyUri, "/tmdl/publish").toString();

			let success = await Helper.fetchWithProgress("Publish TMDL", fetch(endpoint, config));
		} catch (error) {
			vscode.window.showErrorMessage(error);
		}
	}
}