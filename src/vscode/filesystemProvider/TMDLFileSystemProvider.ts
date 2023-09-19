/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

import { ThisExtension } from '../../ThisExtension';
import { Helper } from '../../helpers/Helper';
import { Buffer } from '@env/buffer';
import { TMDLProxy, TMDLProxyStreamEntry } from '../../helpers/TMDLProxy';
import { PowerBIApiService } from '../../powerbi/PowerBIApiService';

export const TMDL_SCHEME: string = "tmdl";
export const TMDL_EXTENSION: string = ".tmdl";

export class TMDLFSUri {
	uri: vscode.Uri;
	modelId: string;
	serverType: "powerbi" | string;
	workspace: string;
	dataset: string;
	logicalPath: string;

	constructor(uri: vscode.Uri) {
		const pathPattern = /\/(?<serverType>[^\/]*)\/(?<workspace>[^\/]*)\/(?<dataset>[^\/]*)(?<logicalPath>.*)/gm;

		let match = pathPattern.exec(uri.path);
		//let x = uri.toString().match(pathPattern);

		if (!match) {
			throw vscode.FileSystemError.Unavailable("Invalid TMDL URI!");
		}

		this.uri = uri;
		this.serverType = match.groups["serverType"];
		this.workspace = match.groups["workspace"];
		this.dataset = match.groups["dataset"];
		this.modelId = `${this.workspace}/${this.dataset}`;
		this.logicalPath = "." + Helper.cutEnd(match.groups["logicalPath"], TMDL_EXTENSION);
	}

	static async getInstance(uri: vscode.Uri): Promise<TMDLFSUri> {
		const tmdlUri = new TMDLFSUri(uri);

		if (tmdlUri.isVSCodeInternalURI) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}
		await TMDLFileSystemProvider.loadModel(tmdlUri);

		return tmdlUri;
	}

	get isVSCodeInternalURI(): boolean {
		if (this.logicalPath.startsWith("./.vscode")
			|| this.logicalPath.startsWith("./.git")
			|| this.logicalPath == "./pom.xml"
			|| this.logicalPath == "./node_modules"
			|| this.logicalPath.endsWith("AndroidManifest.xml")) {
			return true;
		}
		return false;
	}

	async getStreamEntries(): Promise<TMDLProxyStreamEntry[]> {

		let entries = TMDLFileSystemProvider.loadedModels.get(this.modelId);
		if (!entries) {
			return [];
		}
		return entries;
	}

	async setStreamEntries(value: TMDLProxyStreamEntry[]) {
		TMDLFileSystemProvider.loadedModels.set(this.modelId, value);
	}

	async getStreamEntry(): Promise<TMDLProxyStreamEntry> {
		let entryPath = this.logicalPath;
		if (entryPath.endsWith(TMDL_EXTENSION)) {
			entryPath = entryPath.substring(0, entryPath.length - TMDL_EXTENSION.length);
		}
		return (await this.getStreamEntries()).find((entry) => entry.logicalPath == entryPath);
	}

	get XMLAConnectionString(): string {
		const xmlaServer = PowerBIApiService.getXmlaServer(this.workspace).toString();

		return `Data Source=${xmlaServer};Initial Catalog=${this.dataset};`;
	}

	get TMDLRootUri(): TMDLFSUri {
		return new TMDLFSUri(vscode.Uri.parse(`${TMDL_SCHEME}:/${this.serverType}/${this.workspace}/${this.dataset}`));
	}
}

export class TMDLFileSystemProvider implements vscode.FileSystemProvider {
	static loadedModels: Map<string, TMDLProxyStreamEntry[]> = new Map<string, TMDLProxyStreamEntry[]>();

	constructor() { }

	public static async register(context: vscode.ExtensionContext) {
		const fsp = new TMDLFileSystemProvider()
		context.subscriptions.push(vscode.workspace.registerFileSystemProvider(TMDL_SCHEME, fsp, { isCaseSensitive: false }));

		ThisExtension.TMDLFileSystemProvider = fsp;
	}

/*
	public static isModelLoaded(modelId: string): boolean {
		if (this.modelExists(modelId)) {
			if (TMDLFileSystemProvider.loadedModels.get(modelId) != undefined) {
				return true;
			}
		}
		return false;
	}

	public static modelExists(modelId: string): boolean {
		if (TMDLFileSystemProvider.loadedModels.has(modelId)) {
			return true;
		}
		return false;
	}

	public static async loadModel(tmdlUri: TMDLFSUri): Promise<void> {
		if (this.modelExists(tmdlUri.modelId)) {
			if (!this.isModelLoaded(tmdlUri.modelId)) {
				ThisExtension.logDebug(`Model '${tmdlUri.modelId}' is loading in other process - waiting ... `);
				await Helper.awaitCondition(async () => !this.isModelLoaded(tmdlUri.modelId), 60000, 200);
				ThisExtension.logDebug(`Model '${tmdlUri.modelId}' successfully loaded in other process!`);
			}
		}
		else {
			ThisExtension.log(`Loading TMDL Model '${tmdlUri.modelId}' ... `);
			TMDLFileSystemProvider.loadedModels.set(tmdlUri.modelId, undefined);
			// set the model to an empty array to prevent multiple requests
			let stream = await Helper.awaitWithProgress<TMDLProxyStreamEntry[]>("Loading TMDL model " + tmdlUri.modelId, TMDLProxy.exportStream(tmdlUri), 1000);
			if (stream) {
				TMDLFileSystemProvider.loadedModels.set(tmdlUri.modelId, stream);
				ThisExtension.log(`TMDL Model '${tmdlUri.modelId}' loaded!`);
			}
			else {
				TMDLFileSystemProvider.loadedModels.delete(tmdlUri.modelId);
				ThisExtension.log(`Failed to load TMDL Model '${tmdlUri.modelId}'!`);
			}
		}
	}
*/
	public static isModelLoaded(modelId: string): boolean {
		if(TMDLFileSystemProvider.loadedModels.has(modelId))
		{
			return true;
		}
		return false;
	}

	public static async loadModel(tmdlUri: TMDLFSUri): Promise<void> {
		if (this.isModelLoaded(tmdlUri.modelId)) {
			if(TMDLFileSystemProvider.loadedModels.get(tmdlUri.modelId).length == 0)
			{
				ThisExtension.logDebug(`Model '${tmdlUri.modelId}' is loading in other process - waiting ... `);
				await Helper.awaitCondition(async () => this.isModelLoaded(tmdlUri.modelId) && TMDLFileSystemProvider.loadedModels.get(tmdlUri.modelId).length > 0, 10000, 200);
				ThisExtension.logDebug(`Model '${tmdlUri.modelId}' successfully loaded in other process!`);
			}	
		}
		else {
			ThisExtension.log(`Loading TMDL Model '${tmdlUri.modelId}' ... `);
			TMDLFileSystemProvider.loadedModels.set(tmdlUri.modelId, []);
			// set the model to an empty array to prevent multiple requests
			let stream = await Helper.awaitWithProgress<TMDLProxyStreamEntry[]>("Loading TMDL model " + tmdlUri.modelId, TMDLProxy.exportStream(tmdlUri), 1000);
			if (stream) {
				TMDLFileSystemProvider.loadedModels.set(tmdlUri.modelId, stream);
				ThisExtension.log(`TMDL Model '${tmdlUri.modelId}' loaded!`);
			}
			else {
				TMDLFileSystemProvider.loadedModels.delete(tmdlUri.modelId);
				ThisExtension.log(`Failed to load TMDL Model '${tmdlUri.modelId}'!`);
			}
		}
	}

	public static async unloadModel(tmdlUri: TMDLFSUri): Promise<boolean> {
		if (TMDLFileSystemProvider.isModelLoaded(tmdlUri.modelId)) {
			return TMDLFileSystemProvider.loadedModels.delete(tmdlUri.modelId);
		}
	}

	// --- manage file metadata
	async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
		const tmdlUri: TMDLFSUri = await TMDLFSUri.getInstance(uri);

		if (tmdlUri.logicalPath == ".") {
			return {
				type: vscode.FileType.Directory,
				size: null,
				mtime: null,
				ctime: null
			}
		}

		let entry = await tmdlUri.getStreamEntry();
		if (entry) {
			return {
				type: vscode.FileType.File,
				size: entry.size,
				mtime: null,
				ctime: null
			}
		}

		if ((await tmdlUri.getStreamEntries()).find((entry) => entry.logicalPath.startsWith(tmdlUri.logicalPath))) {
			return {
				type: vscode.FileType.Directory,
				size: null,
				mtime: null,
				ctime: null
			}
		}

		/*
		if(tmdlUri.logicalPath.endsWith(" copy")) {
			return {
				type: vscode.FileType.File,
				size: 0,
				mtime: null,
				ctime: null
			}
		}
		*/

		throw vscode.FileSystemError.FileNotFound(uri);
	}

	async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
		const tmdlUri: TMDLFSUri = await TMDLFSUri.getInstance(uri);

		const entries: TMDLProxyStreamEntry[] = await tmdlUri.getStreamEntries();

		const folders: [string, vscode.FileType][] = [];
		const files: [string, vscode.FileType][] = [];
		const tmdlPathDepth = tmdlUri.logicalPath.split("/").length;
		for (const entry of entries) {
			if (entry.logicalPath.startsWith(tmdlUri.logicalPath)) {
				if (entry.logicalPath.split("/").length == tmdlPathDepth + 1) {
					files.push([entry.logicalPath.substring(tmdlPathDepth + 1) + TMDL_EXTENSION, vscode.FileType.File]);
				}
				else {
					const folderName = entry.logicalPath.split("/")[tmdlPathDepth];
					if (!folders.find((folder) => folder[0] == folderName)) {
						folders.push([folderName, vscode.FileType.Directory]);
					}
				}
			}
		}
		return folders.concat(files);
	}

	// --- manage file contents

	async readFile(uri: vscode.Uri): Promise<Uint8Array> {
		const tmdlUri: TMDLFSUri = await TMDLFSUri.getInstance(uri);

		const entry = await tmdlUri.getStreamEntry();
		if (!entry) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}
		/*if (dbfsItem.is_dir) {
			throw vscode.FileSystemError.FileIsADirectory(uri);
		}
		*/

		return Buffer.from(entry.content, 'latin1');
	}

	async writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean, overwrite: boolean }): Promise<void> {
		const tmdlUri: TMDLFSUri = await TMDLFSUri.getInstance(uri);

		const entry = await tmdlUri.getStreamEntry();
		if (!entry) {
			if (options.create) {
				if (tmdlUri.uri.path.endsWith(TMDL_EXTENSION)) {
					let newEntry: TMDLProxyStreamEntry = {
						logicalPath: tmdlUri.logicalPath,
						content: Buffer.from(content).toString('latin1'),
						size: content.length
					};
					(await tmdlUri.getStreamEntries()).push(newEntry);
				}
				else {
					throw vscode.FileSystemError.NoPermissions(`Only TMDL (*${TMDL_EXTENSION}) files can be created.`);
				}
			}
			else {
				throw vscode.FileSystemError.FileNotFound(uri);
			}
		}
		else {
			entry.content = Buffer.from(content).toString('latin1');
		}

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri });
	}

	// --- manage files/folders

	async rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): Promise<void> {
		const oldTmdlUri: TMDLFSUri = await TMDLFSUri.getInstance(oldUri);
		const newTmdlUri: TMDLFSUri = await TMDLFSUri.getInstance(newUri);

		const oldEntry = await oldTmdlUri.getStreamEntry();
		if (!oldEntry) {
			throw vscode.FileSystemError.FileNotFound(oldUri);
		}

		(await oldTmdlUri.getStreamEntry()).logicalPath = newTmdlUri.logicalPath;

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(oldUri) }, { type: vscode.FileChangeType.Deleted, uri: oldUri });
		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(newUri) }, { type: vscode.FileChangeType.Created, uri: newUri });
	}

	async delete(uri: vscode.Uri): Promise<void> {
		const tmdlUri: TMDLFSUri = await TMDLFSUri.getInstance(uri);

		const entry = await tmdlUri.getStreamEntry();
		if (!entry) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		TMDLFileSystemProvider.loadedModels[tmdlUri.modelId] = (await tmdlUri.getStreamEntries()).filter((entry) => entry.logicalPath != tmdlUri.logicalPath);

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(uri) }, { uri, type: vscode.FileChangeType.Deleted });
	}

	async createDirectory(uri: vscode.Uri): Promise<void> {
		//await DatabricksApiService.createDBFSFolder(uri.path);

		//this._fireSoon({ type: vscode.FileChangeType.Changed, uri: FSHelper.parent(uri) }, { type: vscode.FileChangeType.Created, uri });
	}

	/*
		async copy(source: vscode.Uri, destination: vscode.Uri, options: { readonly overwrite: boolean; }): Promise<void> {
			
		}
		*/

	// --- manage file events
	private _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
	private _bufferedEvents: vscode.FileChangeEvent[] = [];
	private _fireSoonHandle?: NodeJS.Timer;

	readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._emitter.event;

	watch(_resource: vscode.Uri): vscode.Disposable {
		// ignore, fires for all changes...
		return new vscode.Disposable(() => { });
	}

	public _fireSoon(...events: vscode.FileChangeEvent[]): void {
		this._bufferedEvents.push(...events);

		if (this._fireSoonHandle) {
			clearTimeout(this._fireSoonHandle);
		}

		this._fireSoonHandle = setTimeout(() => {
			this._emitter.fire(this._bufferedEvents);
			this._bufferedEvents.length = 0;
		}, 5);
	}
}
