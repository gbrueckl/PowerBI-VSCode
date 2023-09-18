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
import { TMDL_SCHEME, TMDLFileSystemProvider, TMDLFSUri } from '../vscode/filesystemProvider/TMDLFileSystemProvider';

const SETTINGS_FILE = ".pbivscode.settings.json";

interface TMDLProxyDatabase {
	name: string;
	id: string;
}
interface TMDLProxyData {
	connectionString: string;
	accessToken: string;
	datasetName: string;
	localPath?: string;
	streamEntries?: TMDLProxyStreamEntry[];
}

interface TMDLProxyDataValidation {
	localPath?: string;
	streamEntries?: TMDLProxyStreamEntry[];
}

export interface TMDLProxyStreamEntry {
	logicalPath: string;
	content: string;
	size: number;
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

			this._tmdlProxyUri = undefined;

			TMDLProxy._tmdlProxyProcess.stdout.on('data', (data: any) => {
				if (!TMDLProxy._tmdlProxyUri) {

					// for debugging purposes, if TMLDProxy is running via IIS from Visual Studio
					if (false) {
						TMDLProxy.log("USING DEBUG Configuration!");
						this._secret = "MySecret";
						this._tmdlProxyUri = vscode.Uri.parse("http://localhost:19176");
					}
					else {
						TMDLProxy._tmdlProxyUri = vscode.Uri.parse(Helper.getFirstRegexGroup(/Now listening on:\s(.*)/gm, data.toString()));
					}
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

			await Helper.awaitCondition(async () => this._tmdlProxyUri != undefined, 50000, 200);

			this._headers = {
				"X-TMDLProxy-Secret": this._secret,
				"Content-Type": 'application/json',
				"Accept": 'application/json'
			}

			ThisExtension.log(`Communication with TMDLProxy via ${TMDLProxy._tmdlProxyUri} `);
			TMDLProxy.log(`Communication with TMDLProxy via ${TMDLProxy._tmdlProxyUri} `);
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

	static async getDatabases(resourceUri: vscode.Uri): Promise<TMDLProxyDatabase[]> {
		try {
			const accessToken = (await PowerBIApiService.getXmlaSession()).accessToken;

			const xmlaServer = PowerBIApiService.getXmlaServer("PPU").toString();

			const connectionString = `Data Source=${xmlaServer};`;

			let body = {
				"connectionString": connectionString,
				"accessToken": accessToken
			};

			const config: RequestInit = {
				method: "POST",
				headers: TMDLProxy._headers,
				body: JSON.stringify(body),
			};
			const endpoint = vscode.Uri.joinPath(TMDLProxy._tmdlProxyUri, "/tmdl/databases").toString();

			let response = await fetch(endpoint, config);

			if (response.ok) {
				let result = await response.json() as TMDLProxyDatabase[];
				return result;
			}
			else {
				let resultText = await response.text();
				vscode.window.showErrorMessage(resultText);
				return;
			}
		} catch (error) {
			vscode.window.showErrorMessage(error);
		}
	}



	static async validate(resourceUri: vscode.Uri): Promise<boolean> {
		await vscode.window.activeTextEditor.document.save();

		if (resourceUri.scheme == TMDL_SCHEME) {
			return await TMDLProxy.validateStream(resourceUri);
		}
		else {
			return await TMDLProxy.validateFolder(resourceUri);
		}
	}
	static async validateFolder(resourceUri: vscode.Uri): Promise<boolean> {
		try {
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
	static async validateStream(resourceUri: vscode.Uri): Promise<boolean> {
		try {
			ThisExtension.log("Validating TMDL from " + resourceUri.fsPath + " ...");

			const tmdlEntry = new TMDLFSUri(resourceUri);

			let body: TMDLProxyDataValidation = {
				"streamEntries": await tmdlEntry.getStreamEntries()
			};

			const config: RequestInit = {
				method: "POST",
				headers: TMDLProxy._headers,
				body: JSON.stringify(body),
			};
			let endpoint = vscode.Uri.joinPath(TMDLProxy._tmdlProxyUri, "/tmdl/validateStream").toString();

			let success = await Helper.fetchWithProgress("Validate TMDL", fetch(endpoint, config));

			return success;
		} catch (error) {
			vscode.window.showErrorMessage(error);
			return false;
		}
	}


	// not used at the moment!!!
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
	static async exportStream(tmdlUri: TMDLFSUri): Promise<TMDLProxyStreamEntry[]> {
		try {
			//ThisExtension.log("Exporting TMDL Stream from '" + dataset.name + "' ...");
			const accessToken = (await PowerBIApiService.getXmlaSession()).accessToken;

			const xmlaServer = PowerBIApiService.getXmlaServer(tmdlUri.workspace).toString();

			const connectionString = `Data Source=${xmlaServer};Initial Catalog=${tmdlUri.dataset};`;

			let body: TMDLProxyData = {
				"connectionString": connectionString,
				"accessToken": accessToken,
				"datasetName": tmdlUri.dataset
			};

			const config: RequestInit = {
				method: "POST",
				headers: TMDLProxy._headers,
				body: JSON.stringify(body),
			};
			let endpoint = vscode.Uri.joinPath(TMDLProxy._tmdlProxyUri, "/tmdl/exportStream").toString();

			let response = await fetch(endpoint, config);

			if (response.ok) {
				let result = await response.json() as TMDLProxyStreamEntry[];
				return result;
			}
			else {
				let resultText = await response.text();
				vscode.window.showErrorMessage(resultText);
				return;
			}
		} catch (error) {
			vscode.window.showErrorMessage(error);
			return;
		}
	}


	static async publish(resourceUri: vscode.Uri): Promise<boolean> {
		await vscode.window.activeTextEditor.document.save();

		let success: boolean = false;
		let link: vscode.Uri;
		if (resourceUri.scheme == TMDL_SCHEME) {
			success = await TMDLProxy.publishStream(resourceUri);
			const tmdlUri: TMDLFSUri = new TMDLFSUri(resourceUri);
			link = await PowerBIApiService.getDatasetUrl(tmdlUri.workspace, tmdlUri.dataset);
		}
		else {
			success = await TMDLProxy.publishFolder(resourceUri);
		}

		if (success) {
			vscode.window.showInformationMessage("TMDL published successfully!", "Open in PowerBI")
				.then(async (value) => {
					if (value == "Open in PowerBI") {
						Helper.openLink(link.toString());
					}
				});
		}
		else {
			vscode.window.showErrorMessage("TMDL publish failed!");
		}

		return success;
	}
	static async publishFolder(resourceUri: vscode.Uri): Promise<boolean> {
		try {
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

			let success = await Helper.fetchWithProgress("Publish TMDL", fetch(endpoint, config), 0);

			return success;
		} catch (error) {
			vscode.window.showErrorMessage(error);
			return false;
		}
	}
	static async publishStream(resourceUri: vscode.Uri): Promise<boolean> {
		try {
			ThisExtension.log("Publishing TMDL from " + resourceUri.fsPath + " ...");
			const accessToken = (await PowerBIApiService.getXmlaSession()).accessToken;

			const tmdlEntry = new TMDLFSUri(resourceUri);

			let body: TMDLProxyData = {
				"connectionString": PowerBIApiService.getXmlaServer(tmdlEntry.workspace).toString(),
				"accessToken": accessToken,
				"datasetName": tmdlEntry.dataset,
				"streamEntries": await tmdlEntry.getStreamEntries()
			};

			const config: RequestInit = {
				method: "POST",
				headers: TMDLProxy._headers,
				body: JSON.stringify(body),
			};
			let endpoint = vscode.Uri.joinPath(TMDLProxy._tmdlProxyUri, "/tmdl/publishStream").toString();

			let success = await Helper.fetchWithProgress("Publish TMDL", fetch(endpoint, config), 0);

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