import * as vscode from 'vscode';
import { ThisExtension } from '../ThisExtension';
import { PowerBIDataset } from '../vscode/treeviews/workspaces/PowerBIDataset';

import { fetch, RequestInit, Response } from '@env/fetch';
import * as portfinder from '@env/portfinder';
import { Buffer } from '@env/buffer';

import { PowerBIApiService } from '../powerbi/PowerBIApiService';
import { Helper } from '../helpers/Helper';
import { TMDL_EXTENSION, TMDL_SCHEME } from '../vscode/filesystemProvider/TMDLFileSystemProvider';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../powerbi/CommandBuilder';
import { TMDLFSUri } from '../vscode/filesystemProvider/TMDLFSUri';
import { TMDLFSCache } from '../vscode/filesystemProvider/TMDLFSCache';
import { TMDLProxyData, TMDLProxyDataException, TMDLProxyDataValidation, TMDLProxyServer, TMDLProxyStreamEntry } from '../TMDLVSCode/_typesTMDL'
import { PowerBIConfiguration } from '../vscode/configuration/PowerBIConfiguration';
import { iPowerBIGroup } from '../powerbi/GroupsAPI/_types';
import { TOMProxyBackupRequest, TOMProxyRestoreRequest } from './_typesTOM';
import { PowerBIWorkspace } from '../vscode/treeviews/workspaces/PowerBIWorkspace';

const DEBUG: boolean = true;
const DEBUG_PORT: number = 51000;

export const SETTINGS_FILE = ".publishsettings.json";

const TAGS_TO_REMOVE: string[] = []; //["lineageTag:", "ordinal:"]; those are mandatory for the model to work so we cannot remove them atm

const errorDecoration = vscode.window.createTextEditorDecorationType({
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: 'red',
});

type ProxyState =
	"stopped" // not loaded yet
	| "starting"  // currently loading
	| "started"	// fully loaded
	;

export abstract class TMDLProxy {
	private static _secret: string;
	private static _port: number;
	private static _headers;
	private static _tmdlProxyUri: vscode.Uri;

	private static _terminal: vscode.Terminal;
	private static _loadingState: ProxyState = "stopped";

	private static _datasetTmdlPathMapping: Map<PowerBIDataset, vscode.Uri> = new Map<PowerBIDataset, vscode.Uri>();

	static log(text: string, newLine: boolean = true): void {
		ThisExtension.log("TMDLProxy: " + text, newLine);
	}

	static async ensureProxy(context: vscode.ExtensionContext): Promise<void> {
		if (TMDLProxy._loadingState == "stopped") {
			try {
				TMDLProxy._loadingState = "starting";

				TMDLProxy.log(`TMDLProxy is currently stopped! Starting new instance ...`);

				this._secret = this.generateSecret(64);

				// find the next free port to start our Proxy on
				this._port = await portfinder.getPort(55000);

				const proxyDllPath = vscode.Uri.joinPath(context.extensionUri, "resources", "TMDLProxy", "TMDLVSCodeConsoleProxy.dll").fsPath;

				TMDLProxy.log(`Starting TMDLProxy from ${proxyDllPath} with secret ${this._secret.substring(0, 10)}...`);
				TMDLProxy.log(`CMD> dotnet "${proxyDllPath}" ${this._secret.substring(0, 10)}...`);

				TMDLProxy._terminal = vscode.window.createTerminal("TMDLProxy", "dotnet", [proxyDllPath, this._port.toString(), this._secret]);
				context.subscriptions.push(TMDLProxy._terminal);

				vscode.window.onDidCloseTerminal(async (terminal) => {
					if (terminal.name == TMDLProxy._terminal.name) {
						TMDLProxy._terminal.dispose();
						TMDLProxy._terminal = undefined;
						TMDLProxy._tmdlProxyUri = undefined;

						vscode.commands.executeCommand(
							"setContext",
							"powerbi.isTMDLProxyRunning",
							false
						);

						const action = await vscode.window.showWarningMessage(
							"TMDLProxy was closed! Please start a new instance to continue working with TMDL!", "Restart TMDL Proxy");

						if (action == "Restart TMDL Proxy") {
							vscode.commands.executeCommand(
								"PowerBI.TMDL.ensureProxy"
							);
						}
					}
				});

				const pid = await TMDLProxy._terminal.processId;
				TMDLProxy.log(`TMDLProxy started with PID ${pid}!`);

				// there is no way to wait for the process within the terminal to be ready so we simply wait 500ms
				await Helper.delay(500);

				if (DEBUG) {
					TMDLProxy._port = DEBUG_PORT;
					TMDLProxy._secret = "MySecret";
				}

				TMDLProxy._tmdlProxyUri = vscode.Uri.parse(`http://localhost:${this._port}`);
				vscode.commands.executeCommand(
					"setContext",
					"powerbi.isTMDLProxyRunning",
					true
				);

				this._headers = {
					"X-Proxy-Secret": this._secret,
					"Content-Type": 'application/json',
					"Accept": 'application/json'
				}

				TMDLProxy.log(`TMDLProxy started! Communicating at ${TMDLProxy._tmdlProxyUri} `);

				TMDLProxy._loadingState = "started";
			} catch (error) {
				TMDLProxy._terminal.dispose();
				TMDLProxy._terminal = undefined;
				TMDLProxy._tmdlProxyUri = undefined;
				TMDLProxy._loadingState = "stopped";
				vscode.window.showErrorMessage(error);
			}
		}
		else if (TMDLProxy._loadingState == "starting") {
			TMDLProxy.log(`TMDLProxy is starting in other process - waiting ... `);
			await Helper.awaitCondition(async () => TMDLProxy._loadingState != "starting", 5000, 100);
			TMDLProxy.log(`TMDLProxy finished starting in other process!`);
		}
		else if (TMDLProxy._loadingState == "started") {
			TMDLProxy.log(`TMDLProxy: TMDLProxy already running at ${TMDLProxy._tmdlProxyUri} `);
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

	static async setAccessToken(body: TMDLProxyData): Promise<void> {
		if (PowerBIConfiguration.tmdlClientId) {
			const accessToken = (await PowerBIApiService.getXmlaSession()).accessToken;
			body.vscodeAccessToken = accessToken;
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
			const connectionString = PowerBIApiService.getXmlaConnectionString(server);

			let body = {
				"connectionString": connectionString
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

	static async saveCurrentTMDLDocument(): Promise<void> {
		if (vscode.window.activeTextEditor.document.uri.scheme == TMDL_SCHEME || vscode.window.activeTextEditor.document.uri.fsPath.endsWith(TMDL_EXTENSION)) {
			await vscode.window.activeTextEditor.document.save();
		}
	}

	static async validate(resourceUri: vscode.Uri): Promise<boolean> {
		await TMDLProxy.saveCurrentTMDLDocument();

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
			TMDLProxy.log("Validating TMDL from " + resourceUri.fsPath + " ...");
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

			TMDLProxy.log("Validating TMDL from " + resourceUri.fsPath + " ...");

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


	// not used at the moment!!!
	static async export(dataset: PowerBIDataset): Promise<boolean> {
		try {
			TMDLProxy.log("Exporting TMDL from '" + dataset.name + "' ...");
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

			TMDLProxy.log("Saving TMDL definitions to " + localPath.fsPath + " ...");

			let body: TMDLProxyData = {
				"connectionString": await dataset.getXMLACConnectionString(),
				"localPath": localPath.fsPath,
			};

			await TMDLProxy.setAccessToken(body)

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
			TMDLProxy.log("Exporting TMDL Stream from '" + tmdlUri.dataset + "' ...");

			const connectionString = PowerBIApiService.getXmlaConnectionString(tmdlUri.workspace) + `Initial Catalog=${tmdlUri.dataset};`;

			let body: TMDLProxyData = {
				"connectionString": connectionString
			};

			await TMDLProxy.setAccessToken(body)

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
		await TMDLProxy.saveCurrentTMDLDocument();

		let workspaceName: string;
		let datasetName: string;

		let success: boolean = false;
		let link: vscode.Uri;
		if (resourceUri.scheme == TMDL_SCHEME) {
			success = await TMDLProxy.publishStream(resourceUri);

			if (success) {
				const tmdlUri: TMDLFSUri = new TMDLFSUri(resourceUri);
				workspaceName = tmdlUri.workspace;
				datasetName = tmdlUri.dataset;
			}
		}
		else {
			success = await TMDLProxy.publishFolder(resourceUri);

			if (success) {
				const localPath = await TMDLProxy.getLocalPathRecursive(resourceUri);
				const publishConfig: TMDLProxyData = JSON.parse((await vscode.workspace.fs.readFile(vscode.Uri.joinPath(localPath, SETTINGS_FILE))).toString());

				workspaceName = decodeURI(Helper.getFirstRegexGroup(/\/v1.0\/.*?\/(.*?)[;\"]/gi, publishConfig.connectionString));
				datasetName = decodeURI(Helper.getFirstRegexGroup(/Initial Catalog=(.*?)(;|$)/gi, publishConfig.connectionString));
			}
		}

		link = await PowerBIApiService.getDatasetUrl(workspaceName, datasetName);

		if (success) {
			const action = await vscode.window.showInformationMessage("TMDL published successfully!", "Process", "Open in PowerBI")
			if (action == "Open in PowerBI") {
				Helper.openLink(link.toString());
			}
			if (action == "Process") {
				const workspace = (await PowerBIApiService.getItemList<iPowerBIGroup>("/groups")).find((workspace) => workspace.name == workspaceName);
				const workspaceId = workspace.id.toString();
				const datasetId = (await PowerBIApiService.getItemList<iPowerBIGroup>(`/groups/${workspaceId}/datasets`)).find((dataset) => dataset.name == datasetName).id.toString();

				// we can only publish to a premium workspace
				await PowerBIDataset.refreshById(workspaceId, datasetId, true)
			}
		}

		return success;
	}
	static async publishFolder(resourceUri: vscode.Uri): Promise<boolean> {
		try {
			let success: boolean = false;

			TMDLProxy.log("Publishing TMDL from " + resourceUri.fsPath + " ...");
			const localPath = await TMDLProxy.getLocalPathRecursive(resourceUri);
			if (!localPath) {
				// this should never happen as we also check for model.tmdl
				vscode.window.showErrorMessage("Could not find .publishsettings.json for " + resourceUri.fsPath + "!");
				return;
			}
			let body: TMDLProxyData;

			const dataset: PowerBIDataset = TMDLProxy.getDataset(localPath);

			// if the export was done in the current session, we can use the dataset object
			if (dataset) {
				body = {
					"connectionString": await dataset.getXMLACConnectionString(),
					"localPath": localPath.fsPath,
				};
			}
			else {
				body = JSON.parse((await vscode.workspace.fs.readFile(vscode.Uri.joinPath(localPath, SETTINGS_FILE))).toString());
				body.localPath = localPath.fsPath;
				body.connectionString = decodeURI(body.connectionString);
			}

			await TMDLProxy.setAccessToken(body)

			const config: RequestInit = {
				method: "POST",
				headers: TMDLProxy._headers,
				body: JSON.stringify(body),
			};
			let endpoint = vscode.Uri.joinPath(TMDLProxy._tmdlProxyUri, "/tmdl/publish").toString();

			let response = await Helper.awaitWithProgress<Response>("Publish TMDL", fetch(endpoint, config), 0);

			let resultText = await response.text();

			if (!response.ok) {
				this.handleException(resultText, resourceUri);
				success = false;
			}
			else {
				//vscode.window.showInformationMessage(resultText);
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
			TMDLProxy.log("Publishing TMDL from " + resourceUri.fsPath + " ...");
			const tmdlEntry = new TMDLFSUri(resourceUri);

			let body: TMDLProxyData = {
				"connectionString": PowerBIApiService.getXmlaConnectionString(tmdlEntry.workspace, tmdlEntry.dataset),
				"streamEntries": await tmdlEntry.getStreamEntries()
			};

			await TMDLProxy.setAccessToken(body)

			const config: RequestInit = {
				method: "POST",
				headers: TMDLProxy._headers,
				body: JSON.stringify(body),
			};
			let endpoint = vscode.Uri.joinPath(TMDLProxy._tmdlProxyUri, "/tmdl/publishStream").toString();

			let response = await Helper.awaitWithProgress<Response>("Publish TMDL", fetch(endpoint, config), 0);

			let resultText = await response.text();

			if (!response.ok) {
				this.handleException(resultText, resourceUri);
				success = false;
			}
			else {
				//vscode.window.showInformationMessage(resultText);
				success = true;
			}

			return success;
		} catch (error) {
			vscode.window.showErrorMessage(error);
			return false;
		}
	}

	static async backup(serverName: string, databaseName: string, backupFileName: string, allowOverwrite: boolean = false): Promise<void> {
		try {
			let success: boolean = false;
			TMDLProxy.log("Starting backup of Database " + databaseName + " ...");

			let body: TOMProxyBackupRequest = {
				"connectionString": PowerBIApiService.getXmlaConnectionString(serverName, databaseName),
				"fileName": backupFileName,
				"allowOverwrite": allowOverwrite,
			};

			await TMDLProxy.setAccessToken(body)

			const config: RequestInit = {
				method: "POST",
				headers: TMDLProxy._headers,
				body: JSON.stringify(body),
			};
			let endpoint = vscode.Uri.joinPath(TMDLProxy._tmdlProxyUri, "/tom/backup").toString();

			let response = await Helper.awaitWithProgress<Response>("Backup Dataset", fetch(endpoint, config), 0);

			let resultText = await response.text();

			if (!response.ok) {
				this.handleException(resultText, vscode.Uri.parse("https://error"));
				success = false;
			}
			else {
				//vscode.window.showInformationMessage(resultText);
				success = true;
			}
		} catch (error) {
			vscode.window.showErrorMessage(error);
		}
	}

	static async restore(backupFileName: string, targetServerName: string, targetDatabaseName: string, allowOverwrite: boolean = false): Promise<void> {
		try {
			let success: boolean = false;
			TMDLProxy.log("Starting Database restore from " + backupFileName + " ...");

			let body: TOMProxyRestoreRequest = {
				"connectionString": PowerBIApiService.getXmlaConnectionString(targetServerName, targetDatabaseName),
				"databaseName": targetDatabaseName,
				"fileName": backupFileName,
				"allowOverwrite": allowOverwrite
				};

			await TMDLProxy.setAccessToken(body)

			const config: RequestInit = {
				method: "POST",
				headers: TMDLProxy._headers,
				body: JSON.stringify(body),
			};
			let endpoint = vscode.Uri.joinPath(TMDLProxy._tmdlProxyUri, "/tom/restore").toString();

			let response = await Helper.awaitWithProgress<Response>("Restoring Database", fetch(endpoint, config), 0);

			let resultText = await response.text();

			if (!response.ok) {
				this.handleException(resultText, vscode.Uri.parse("https://error"));
				success = false;
			}
			else {
				//vscode.window.showInformationMessage(resultText);
				success = true;
			}
		} catch (error) {
			vscode.window.showErrorMessage(error);
		}
	}


	static async load(resourceUri: vscode.Uri): Promise<void> {
		if (resourceUri.scheme == TMDL_SCHEME) {

			const tmdlEntry = new TMDLFSUri(resourceUri);

			const database = await TMDLFSCache.getDatabase(tmdlEntry.server, tmdlEntry.database);

			if (database.loadingState == "loaded") {
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

	static async saveLocally(resourceUri: vscode.Uri): Promise<void> {
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
			vscode.workspace.fs.writeFile(
				vscode.Uri.joinPath(savePath, SETTINGS_FILE), 
				Buffer.from(JSON.stringify({ "connectionString": tmdlEntry.XMLAConnectionString }, null, 4)));

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

	static async cleanUp(): Promise<void> {
		TMDLProxy._loadingState = "stopped";
		if (TMDLProxy._terminal) {
			TMDLProxy._terminal.dispose();
		}
	}
}