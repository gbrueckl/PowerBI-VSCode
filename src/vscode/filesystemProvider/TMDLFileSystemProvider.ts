/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

import { ThisExtension } from '../../ThisExtension';
import { Helper } from '../../helpers/Helper';
import { Buffer } from '@env/buffer';
import { TMDLProxy, TMDLProxyStreamEntry } from '../../helpers/TMDLProxy';

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
		const pattern = /\/(?<serverType>[^\/]*)\/(?<workspace>[^\/]*)\/(?<dataset>[^\/]*)(?<logicalPath>.*)/gm;

		let match = pattern.exec(uri.path);
		//let x = uri.toString().match(pattern);

		if (!match) {
			throw vscode.FileSystemError.Unavailable("Invalid TMDL URI!");
		}

		this.uri = uri;
		this.modelId = `${match.groups["workspace"]}/${match.groups["dataset"]}`;
		this.workspace = match.groups["workspace"];
		this.dataset = match.groups["dataset"];
		this.logicalPath = "." + Helper.cutEnd(match.groups["logicalPath"], TMDL_EXTENSION);
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
}

export class TMDLFileSystemProvider implements vscode.FileSystemProvider {
	static loadedModels: Map<string, TMDLProxyStreamEntry[]> = new Map<string, TMDLProxyStreamEntry[]>();

	constructor() {	}

	public static async register(context: vscode.ExtensionContext) {
		context.subscriptions.push(vscode.workspace.registerFileSystemProvider(TMDL_SCHEME, new TMDLFileSystemProvider(), { isCaseSensitive: false }));
	}

	public static async loadModel(uri: vscode.Uri): Promise<void> {
		const tmdlUri: TMDLFSUri = new TMDLFSUri(uri);

		ThisExtension.log("Loading TMDL model " + tmdlUri.modelId);
		// set the model to an empty array to prevent multiple requests
		let stream = await Helper.awaitWithProgress<TMDLProxyStreamEntry[]>("Loading TMDL model " + tmdlUri.modelId, TMDLProxy.exportStream(tmdlUri), 1000);

		TMDLFileSystemProvider.loadedModels.set(tmdlUri.modelId, stream);
	}

	public static isVSCodeInternalURI(tmdlUri: TMDLFSUri): boolean {
		if (tmdlUri.logicalPath.startsWith("./.vscode")
			|| tmdlUri.logicalPath.startsWith("./.git")
			|| tmdlUri.logicalPath == "./pom.xml"
			|| tmdlUri.logicalPath == "./node_modules"
			|| tmdlUri.logicalPath.endsWith("AndroidManifest.xml")) {
			return true;
		}
		return false;
	}

	// --- manage file metadata
	async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
		const tmdlUri: TMDLFSUri = new TMDLFSUri(uri);

		if (TMDLFileSystemProvider.isVSCodeInternalURI(tmdlUri)) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

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

		throw vscode.FileSystemError.FileNotFound(uri);
	}

	async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
		const tmdlUri: TMDLFSUri = new TMDLFSUri(uri);

		if(!TMDLFileSystemProvider.loadedModels.has(tmdlUri.modelId)) {
			await TMDLFileSystemProvider.loadModel(uri);
		}
		const entries: TMDLProxyStreamEntry[] = await tmdlUri.getStreamEntries();

		const folders: [string, vscode.FileType][] = [];
		const files: [string, vscode.FileType][] = [];
		const tmdlPathDepth = tmdlUri.logicalPath.split("/").length;
		for (const entry of entries) {
			if (entry.logicalPath.startsWith(tmdlUri.logicalPath)) {
				if (entry.logicalPath.split("/").length == tmdlPathDepth + 1) {
					files.push([entry.logicalPath.substring(tmdlUri.logicalPath.length + 1) + TMDL_EXTENSION, vscode.FileType.File]);
				}
				else {
					folders.push([entry.logicalPath.split("/")[tmdlPathDepth], vscode.FileType.Directory]);
				}
			}
		}
		return folders.concat(files);
	}

	// --- manage file contents

	async readFile(uri: vscode.Uri): Promise<Uint8Array> {
		const tmdlUri: TMDLFSUri = new TMDLFSUri(uri);

		if (TMDLFileSystemProvider.isVSCodeInternalURI(tmdlUri)) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

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
		const tmdlUri: TMDLFSUri = new TMDLFSUri(uri);

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
		const oldTmdlUri: TMDLFSUri = new TMDLFSUri(oldUri);
		const newTmdlUri: TMDLFSUri = new TMDLFSUri(oldUri);

		const oldEntry = await oldTmdlUri.getStreamEntry();
		if (!oldEntry) {
			throw vscode.FileSystemError.FileNotFound(oldUri);
		}

		(await oldTmdlUri.getStreamEntry()).logicalPath = newTmdlUri.logicalPath;

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(oldUri) }, { type: vscode.FileChangeType.Deleted, uri: oldUri });
		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(newUri) }, { type: vscode.FileChangeType.Created, uri: newUri });
	}

	async delete(uri: vscode.Uri): Promise<void> {
		const tmdlUri: TMDLFSUri = new TMDLFSUri(uri);

		const entry = await tmdlUri.getStreamEntry();
		if (!entry) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		TMDLFileSystemProvider.loadedModels[tmdlUri.modelId] = (await tmdlUri.getStreamEntries()).filter((entry) => entry.logicalPath != tmdlUri.logicalPath);

		//this._fireSoon({ type: vscode.FileChangeType.Changed, uri: FSHelper.parent(uri) }, { uri, type: vscode.FileChangeType.Deleted });
	}

	async createDirectory(uri: vscode.Uri): Promise<void> {
		//await DatabricksApiService.createDBFSFolder(uri.path);

		//this._fireSoon({ type: vscode.FileChangeType.Changed, uri: FSHelper.parent(uri) }, { type: vscode.FileChangeType.Created, uri });
	}


	// --- manage file events

	private _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
	private _bufferedEvents: vscode.FileChangeEvent[] = [];
	private _fireSoonHandle?: NodeJS.Timer;

	readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._emitter.event;

	watch(_resource: vscode.Uri): vscode.Disposable {
		// ignore, fires for all changes...
		return new vscode.Disposable(() => { });
	}

	private _fireSoon(...events: vscode.FileChangeEvent[]): void {
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
