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
	private static _headers;
	private static _tmdlProxyUri: vscode.Uri;
	private static _logger: vscode.OutputChannel;

	private static _tmdlProxyProcess: any;

	private static _datasetTmdlPathMapping: Map<PowerBIDataset, vscode.Uri> = new Map<PowerBIDataset, vscode.Uri>();

	static async initializeLogger(context: vscode.ExtensionContext): Promise<void> {
		if (!this._logger) {
			this._logger = vscode.window.createOutputChannel("PowerBI.TMDLProxy");
			this.log("Logger initialized!");

			context.subscriptions.push(this._logger);
		}
	}

	static log(text: string, newLine: boolean = true): void {
		if (!this._logger) {
			vscode.window.showErrorMessage(text);
		}
		if (newLine) {
			this._logger.appendLine(text);
		}
		else {
			this._logger.append(text);
		}
	}

	static async ensureProxy(context: vscode.ExtensionContext): Promise<void> {

		await this.initializeLogger(context);

		this._secret = this.generateSecret(64);
		this._secret = "ZwzCF1Zysal9NcK5lfmlDPnbtJmTw4TOltpHhjkWzDDiamOjpUVvMoblUsdQXzLw";

		if (!TMDLProxy._tmdlProxyProcess) {

			const proxyDllPath = vscode.Uri.joinPath(context.extensionUri, "resources", "TMDLProxy", "TMDLVSCodeProxy.dll").fsPath;

			ThisExtension.log(`Starting TMDLProxy from ${proxyDllPath} with secret ${this._secret}`);
			ThisExtension.log(`CMD> dotnet "${proxyDllPath}" ${this._secret}`);

			TMDLProxy._tmdlProxyProcess = spawn("dotnet", [proxyDllPath, this._secret]);

			TMDLProxy._tmdlProxyProcess.stdout.on('data', (data: any) => {
				if (!TMDLProxy._tmdlProxyUri) {
					TMDLProxy._tmdlProxyUri = vscode.Uri.parse(Helper.getFirstRegexGroup(/Now listening on:\s(.*)/gm, data.toString()));
				}
				TMDLProxy.log(data.toString());
			});
			TMDLProxy._tmdlProxyProcess.stderr.on('data', (data: any) => {
				TMDLProxy.log("ERROR: " + data.toString());
			});

			TMDLProxy._tmdlProxyProcess.on('error', (err) => {
				TMDLProxy.log("Error with TMDLProxy: " + err);
			});
			TMDLProxy._tmdlProxyProcess.on('close', (code) => {
				TMDLProxy.log("TMDLProxy closed with code: " + code);
			});

			if (false) {
				this._secret = "MySecret";
				this._tmdlProxyUri = vscode.Uri.parse("http://localhost:19176");
			}

			this._headers = {
				"X-TMDLProxy-Secret": this._secret,
				"Content-Type": 'application/json',
				"Accept": 'application/json'
			}
		}
	}

	private static generateSecret(length: number): string {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		return result;
	}

	private static getDataset(localPath: vscode.Uri): PowerBIDataset {
		for (const [dataset, path] of this._datasetTmdlPathMapping) {
			if (path.fsPath.startsWith(localPath.fsPath)) {
				return dataset;
			}
		}
	}

	public static getLocalPath(dataset: PowerBIDataset): vscode.Uri {
		return this._datasetTmdlPathMapping.get(dataset);
	}

	private static async getLocalPathRecursive(localPath: vscode.Uri): Promise<vscode.Uri> {
		// check if we have an entry in our current mapping
		for (const [dataset, path] of this._datasetTmdlPathMapping) {
			if (localPath.fsPath.startsWith(path.fsPath)) {
				return path;
			}
		}
		// check if any of the parent folder contains our settings-file
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

	static async export(dataset: PowerBIDataset): Promise<boolean> {
		try {
			ThisExtension.log("Exporting TMDL from '" + dataset.name + "' ...");
			const accessToken = (await PowerBIApiService.getXmlaSession()).accessToken;

			const savePaths = (await vscode.window.showOpenDialog({
				title: `Export TMDL of '${dataset.name}' to local folder`,
				openLabel: "Export",
				canSelectMany: false,
				canSelectFiles: false,
				canSelectFolders: true
			}));

			if (!savePaths) {
				Helper.showTemporaryInformationMessage("TMDL Export aborted!");
				return;
			}
			const localPath = savePaths[0];

			ThisExtension.log("Saving TMDL definitions to " + localPath.fsPath + " ...");

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
			let endpoint = vscode.Uri.joinPath(TMDLProxy._tmdlProxyUri, "/tmdl/export").toString();

			let success = await Helper.fetchWithProgress("Export TMDL", fetch(endpoint, config));

			if (success) {
				let settings = body;
				delete settings.accessToken;
				delete settings.localPath;
				await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(localPath, SETTINGS_FILE), Buffer.from(JSON.stringify(settings)));
			}

			return success;
		} catch (error) {
			vscode.window.showErrorMessage(error);
			return false;
		}
	}

	static async validate(resourceUri: vscode.Uri): Promise<boolean> {
		try {
			vscode.window.activeTextEditor.document.save();

			ThisExtension.log("Validating TMDL from " + resourceUri.fsPath + " ...");
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

			return success;
		} catch (error) {
			vscode.window.showErrorMessage(error);
			return false;
		}
	}

	static async publish(resourceUri: vscode.Uri): Promise<boolean> {
		try {
			vscode.window.activeTextEditor.document.save();
			
			ThisExtension.log("Publishing TMDL from " + resourceUri.fsPath + " ...");
			const accessToken = (await PowerBIApiService.getXmlaSession()).accessToken;
			const localPath = await TMDLProxy.getLocalPathRecursive(resourceUri);
			if (!localPath) {
				vscode.window.showErrorMessage("Could not publish settings for " + resourceUri.fsPath + "!");
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
				body.localPath = localPath.fsPath;
			}

			const config: RequestInit = {
				method: "POST",
				headers: TMDLProxy._headers,
				body: JSON.stringify(body),
			};
			let endpoint = vscode.Uri.joinPath(TMDLProxy._tmdlProxyUri, "/tmdl/publish").toString();

			let success = await Helper.fetchWithProgress("Publish TMDL", fetch(endpoint, config));

			return success;
		} catch (error) {
			vscode.window.showErrorMessage(error);
			return false;
		}
	}

	static async cleanUp(): Promise<void> {
		if (TMDLProxy._tmdlProxyProcess) {
			TMDLProxy._tmdlProxyProcess.kill();
		}

		if (TMDLProxy._logger) {
			TMDLProxy._logger.dispose();
		}
	}
}