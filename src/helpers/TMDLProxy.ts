import * as vscode from 'vscode';
import { ThisExtension } from '../ThisExtension';
import { PowerBIDataset } from '../vscode/treeviews/workspaces/PowerBIDataset';

import { fetch, getProxyAgent, RequestInit, Response } from '@env/fetch';

import { spawn } from 'child_process';
import { PowerBIApiService } from '../powerbi/PowerBIApiService';
import { Helper } from './Helper';
import { TMDL_EXTENSION, TMDL_SCHEME, TMDLFileSystemProvider } from '../vscode/filesystemProvider/TMDLFileSystemProvider';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../powerbi/CommandBuilder';
import { TMDLFSUri } from '../vscode/filesystemProvider/TMDLFSUri';
import { TMDLFSCache } from '../vscode/filesystemProvider/TMDLFSCache';

const DEBUG: boolean = false;
const DEBUG_PORT: number = 59941;

export const SETTINGS_FILE = ".publishsettings.json";

const TAGS_TO_REMOVE: string[] = ["lineageTag:", "ordinal:"];

const errorDecoration = vscode.window.createTextEditorDecorationType({
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: 'red',
});
export interface TMDLProxyServer {
	name: string;
	id?: string;
	databases: Map<string, TMDLProxyStreamEntry[]>;
}

interface TMDLProxyData {
	connectionString: string;
	accessToken: string;
	datasetName: string;
	localPath?: string;
	streamEntries?: TMDLProxyStreamEntry[];
}

export interface TMDLProxyDataException {
	success: boolean;
	path?: string;
	lineNumber?: number;
	lineText?: string;
	message: string;
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

		if (!TMDLProxy._tmdlProxyProcess) {

			const proxyDllPath = vscode.Uri.joinPath(context.extensionUri, "resources", "TMDLProxy", "TMDLVSCodeConsoleProxy.dll").fsPath;

			ThisExtension.log(`Starting TMDLProxy from ${proxyDllPath} with secret ${this._secret.substring(0, 10)}...`);
			ThisExtension.log(`CMD> dotnet "${proxyDllPath}" ${this._secret.substring(0, 10)}...`);

			TMDLProxy._tmdlProxyProcess = spawn("dotnet", [proxyDllPath, this._secret], { shell: true , windowsHide: true, detached: true});

			this._tmdlProxyUri = undefined;

			TMDLProxy._tmdlProxyProcess.stdout.on('data', (data: any) => {
				if (!TMDLProxy._tmdlProxyUri) {

					// for debugging purposes, if TMLDProxy is running via IIS from Visual Studio
					if (DEBUG) {
						TMDLProxy.log("USING DEBUG Configuration!");
						TMDLProxy._secret = "MySecret";
						TMDLProxy._tmdlProxyUri = vscode.Uri.parse(`http://localhost:${DEBUG_PORT}`);
						Helper.showTemporaryInformationMessage("DEVELOPER MODE IS ON!");
					}
					else {
						var connectionInfo = Helper.getFirstRegexGroup(/Now listening on:\s(.*)/gm, data.toString());
						if (connectionInfo) {
							TMDLProxy._tmdlProxyUri = vscode.Uri.parse(connectionInfo);
						}
					}

					vscode.commands.executeCommand(
						"setContext",
						"powerbi.isTMDLProxyRunning",
						true
					);
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

	private static isRunning(): boolean {
		return TMDLProxy._tmdlProxyProcess != undefined;
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
				if (file[0] == SETTINGS_FILE || file[0] == "model.tmdl") {
					return localPath;
				}
			}
		}
	}

	private static async handleException(resultText: string, source: vscode.Uri): Promise<void> {
		let error = JSON.parse(resultText) as TMDLProxyDataException;
		if (error.path) {
			let tmdlRootPath: vscode.Uri = await TMDLProxy.getLocalPathRecursive(source);
			let errorFileUri = vscode.Uri.joinPath(tmdlRootPath, error.path + TMDL_EXTENSION);

			const action = await vscode.window.showErrorMessage(error.message, "Go to Error");
			if (action == "Go to Error") {
				const editor = await vscode.workspace
					.openTextDocument(errorFileUri)
					.then(vscode.window.showTextDocument);

				const errorRange = new vscode.Range(error.lineNumber - 1, 0, error.lineNumber - 1, error.lineText.length)
				editor.revealRange(errorRange);
				editor.setDecorations(errorDecoration, [errorRange]);

				await Helper.delay(10000);
				editor.setDecorations(errorDecoration, [])
			}
		}
		else {
			vscode.window.showErrorMessage(error.message);
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

	static async getDatabases(server: string): Promise<TMDLProxyServer[]> {
		try {
			const accessToken = (await PowerBIApiService.getXmlaSession()).accessToken;

			const xmlaServer = PowerBIApiService.getXmlaServer(server).toString();

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
				let result = await response.json() as TMDLProxyServer[];
				return result.map((server) => {
					server.databases = new Map<string, TMDLProxyStreamEntry[]>();
					return server;
				});
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
			let success: boolean = false;
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

			let response = await Helper.awaitWithProgress<Response>("Validate TMDL", fetch(endpoint, config), 0);

			let resultText = await response.text();

			if (!response.ok) {
				this.handleException(resultText, resourceUri);
				success = false;
			}
			else {
				vscode.window.showInformationMessage(resultText);
				success = true;
			}

			return success;
		} catch (error) {
			vscode.window.showErrorMessage(error);
			return false;
		}
	}
	static async validateStream(resourceUri: vscode.Uri): Promise<boolean> {
		try {
			let success: boolean = false;

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

			let response = await Helper.awaitWithProgress<Response>("Validate TMDL", fetch(endpoint, config), 0);

			let resultText = await response.text();

			if (!response.ok) {
				this.handleException(resultText, resourceUri);
				success = false;
			}
			else {
				vscode.window.showInformationMessage(resultText);
				success = true;
			}

			return success;
		} catch (error) {
			vscode.window.showErrorMessage(error);
			return false;
		}
	}

	static async load(resourceUri: vscode.Uri): Promise<void> {
		if (resourceUri.scheme == TMDL_SCHEME) {

			const tmdlEntry = new TMDLFSUri(resourceUri);

			if (TMDLFSCache.getDatabase(tmdlEntry.server, tmdlEntry.database).loadingState == "fully_loaded") {
				const confirm = await PowerBICommandBuilder.showQuickPick([new PowerBIQuickPickItem("yes"), new PowerBIQuickPickItem("no")], `Do you really want to reload TMDL for ${tmdlEntry.modelId}? This will overwrite any local changes.`, undefined, undefined);

				if (confirm == "yes") {
					// we unload the model to force a reload the next time it is queried
					await TMDLFSCache.unloadDatabase(tmdlEntry);
				}
				else {
					return;
				}
			}
			await TMDLFSCache.loadDatabase(tmdlEntry.server, tmdlEntry.database);

			vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer");

			vscode.workspace.textDocuments.forEach((document) => {
				if (document.uri.toString().startsWith(tmdlEntry.TMDLRootUri.uri.toString())) {
					vscode.commands.executeCommand("workbench.action.files.revert", document.uri);
				}
			});
		}
	}

	static async saveLocally(resourceUri: vscode.Uri): Promise<boolean> {
		await vscode.window.activeTextEditor.document.save();

		if (resourceUri.scheme == TMDL_SCHEME) {
			const tmdlEntry = new TMDLFSUri(resourceUri);

			const savePaths = (await vscode.window.showOpenDialog({
				title: `Save TMDL definitions to local folder`,
				openLabel: "Export",
				canSelectMany: false,
				canSelectFiles: false,
				canSelectFolders: true
			}));

			if (!savePaths) {
				Helper.showTemporaryInformationMessage("TMDL Export aborted!");
				return;
			}
			const savePath = savePaths[0];

			await vscode.workspace.fs.copy(tmdlEntry.TMDLRootUri.uri, savePath, { overwrite: true });
			vscode.workspace.fs.writeFile(vscode.Uri.joinPath(savePath, SETTINGS_FILE), Buffer.from(JSON.stringify({ "connectionString": tmdlEntry.XMLAConnectionString })));

			vscode.window.showInformationMessage(`TMDL saved to ${savePath.fsPath}!`, "Add to Workspace", "Open Folder").then(
				(value) => {
					if (value == "Add to Workspace") {
						Helper.addToWorkspace(savePath, `${tmdlEntry.dataset}`)
					}
					if (value == "Open Folder") {
						vscode.commands.executeCommand("revealFileInOS", savePath.with({ path: savePath.path + "/model" + TMDL_EXTENSION }));
					}
				}
			);
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
				for (let entry of result) {
					for (let replaceTag of TAGS_TO_REMOVE) {
						const regEx: RegExp = new RegExp(`\\s*${replaceTag}.*`, "g");
						entry.content = entry.content.replace(regEx, "");
					}
				}
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
			const action = await vscode.window.showInformationMessage("TMDL published successfully!", "Open in PowerBI")
			if (action == "Open in PowerBI") {
				Helper.openLink(link.toString());
			}
		}

		return success;
	}
	static async publishFolder(resourceUri: vscode.Uri): Promise<boolean> {
		try {
			let success: boolean = false;

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

			let response = await Helper.awaitWithProgress<Response>("Validate TMDL", fetch(endpoint, config), 0);

			let resultText = await response.text();

			if (!response.ok) {
				this.handleException(resultText, resourceUri);
				success = false;
			}
			else {
				vscode.window.showInformationMessage(resultText);
				success = true;
			}

			return success;
		} catch (error) {
			vscode.window.showErrorMessage(error);
			return false;
		}
	}
	static async publishStream(resourceUri: vscode.Uri): Promise<boolean> {
		try {
			let success: boolean = false;
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

			let response = await Helper.awaitWithProgress<Response>("Validate TMDL", fetch(endpoint, config), 0);

			let resultText = await response.text();

			if (!response.ok) {
				this.handleException(resultText, resourceUri);
				success = false;
			}
			else {
				vscode.window.showInformationMessage(resultText);
				success = true;
			}

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