import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';
import { Buffer } from '@env/buffer';
import { FabricFSUri, FabricUriType } from './FabricFSUri';
import { FabricFSCache } from './FabricFSCache';
import { FabricItemTypes } from './_types';

export const FABRIC_SCHEME: string = "fabric";
export const FABRIC_FILE_ENCODING: BufferEncoding = "utf8";


export class FabricFileSystemProvider implements vscode.FileSystemProvider, vscode.Disposable {
	constructor() {	}

	public static async register(context: vscode.ExtensionContext) {
		const fsp = new FabricFileSystemProvider()
		context.subscriptions.push(vscode.workspace.registerFileSystemProvider(FABRIC_SCHEME, fsp, { isCaseSensitive: false }));

		ThisExtension.FabricFileSystemProvider = fsp;
	}


	public static async closeOpenFabricFiles(): Promise<void> {
		// close all existing Fabric files
		const tabs: vscode.Tab[] = vscode.window.tabGroups.all.map(tg => tg.tabs).flat();
		const FabricTabs: vscode.Tab[] = tabs.filter(tab => tab.input instanceof vscode.TabInputText && tab.input.uri.scheme === FABRIC_SCHEME);
		for (let tab of FabricTabs) {
			ThisExtension.log("Closing Fabric file: " + (tab.input as vscode.TabInputText).uri.toString());
			await vscode.window.tabGroups.close(tab);
		}
	}

	// -- manage file metadata
	async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
		const FabricUri: FabricFSUri = await FabricFSUri.getInstance(uri);

		// there are only folders above the part-Level
		if (FabricUri.uriType < FabricUriType.part) {
			return {
				type: vscode.FileType.Directory,
				size: null,
				mtime: null,
				ctime: null
			}
		}

		let entry = await FabricFSCache.getItemPart(FabricUri.workspaceId, FabricUri.itemId, FabricUri.part);
		if (entry) {
			return {
				type: vscode.FileType.File,
				size: null,
				mtime: null,
				ctime: null
			}
		}

		if ((await FabricFSCache.getItemParts(FabricUri.workspaceId, FabricUri.itemId)).find((entry) => entry.path.startsWith(FabricUri.part))) {
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
		const fabricUri: FabricFSUri = await FabricFSUri.getInstance(uri, true);

		if (fabricUri.uriType == FabricUriType.root) {
			let entries: [string, vscode.FileType][] = [];
			const workspaces = await FabricFSCache.getWorkspaces();
			for (const ws of workspaces) {
				entries.push([ws.displayName ?? ws.id, vscode.FileType.Directory]);
			}
			return entries;
		}

		if (fabricUri.uriType == FabricUriType.workspace) {
			let entries: [string, vscode.FileType][] = [];
			for (const itemType of FabricItemTypes) {
				entries.push([itemType, vscode.FileType.Directory]);
			}
			return entries;
		}

		if (fabricUri.uriType == FabricUriType.itemType) {
			let entries: [string, vscode.FileType][] = [];
			const items = await FabricFSCache.getItems(fabricUri.workspaceId, fabricUri.itemType);
			for (const item of items) {
				entries.push([item.displayName ?? item.id, vscode.FileType.Directory]);
			}
			return entries;
		}

		if (fabricUri.uriType == FabricUriType.item) {
			let entries: [string, vscode.FileType][] = [];
			const parts = await FabricFSCache.getItemParts(fabricUri.workspaceId, fabricUri.itemId);
			for (const part of parts) {
				entries.push([part.path, vscode.FileType.Directory]);
			}
			return entries;
		}
/*
		else {
			const entries: FabricProxyStreamEntry[] = await FabricUri.getStreamEntries();

			let folders: [string, vscode.FileType][] = [];
			let files: [string, vscode.FileType][] = [];
			const FabricPathDepth = FabricUri.logicalPath.split("/").length;
			for (const entry of entries) {
				if (entry.logicalPath.startsWith(FabricUri.logicalPath)) {
					if (entry.logicalPath.split("/").length == FabricPathDepth + 1) {
						files.push([entry.logicalPath.split("/")[FabricPathDepth] + Fabric_EXTENSION, vscode.FileType.File]);
					}
					else {
						const folderName = entry.logicalPath.split("/")[FabricPathDepth];
						if (!folders.find((folder) => folder[0] == folderName)) {
							folders.push([folderName, vscode.FileType.Directory]);
						}
					}
				}
			}
			return folders.concat(files);
		}
*/
	}

	// --- manage file contents
	async readFile(uri: vscode.Uri): Promise<Uint8Array> {
		/*const FabricUri: FabricFSUri = await FabricFSUri.getInstance(uri);

		const entry = await FabricUri.getStreamEntry();
		if (!entry) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri });

		return Buffer.from(entry.content, Fabric_FILE_ENCODING);*/

		return undefined;
	}

	async writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean, overwrite: boolean }): Promise<void> {
		/*const FabricUri: FabricFSUri = await FabricFSUri.getInstance(uri);

		const entry = await FabricUri.getStreamEntry();
		if (!entry) {
			if (options.create) {
				if (FabricUri.uri.path.endsWith(Fabric_EXTENSION)) {
					let newEntry: FabricProxyStreamEntry = {
						logicalPath: FabricUri.logicalPath,
						content: Buffer.from(content).toString(Fabric_FILE_ENCODING),
						size: content.length
					};
					(await FabricUri.getStreamEntries()).push(newEntry);
				}
				else {
					throw vscode.FileSystemError.NoPermissions(`Only Fabric (*${Fabric_EXTENSION}) files can be created.`);
				}
			}
			else {
				throw vscode.FileSystemError.FileNotFound(uri);
			}
		}
		else {
			entry.content = Buffer.from(content).toString(Fabric_FILE_ENCODING);
		}

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri });
		*/
	}

	// --- manage files/folders

	async rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): Promise<void> {
		/*const oldFabricUri: FabricFSUri = await FabricFSUri.getInstance(oldUri);
		const newFabricUri: FabricFSUri = await FabricFSUri.getInstance(newUri);

		let oldEntry = await oldFabricUri.getStreamEntry();
		if (!oldEntry) {
			throw vscode.FileSystemError.FileNotFound(oldUri);
		}

		oldEntry.logicalPath = newFabricUri.logicalPath;

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(oldUri) }, { type: vscode.FileChangeType.Deleted, uri: oldUri });
		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(newUri) }, { type: vscode.FileChangeType.Created, uri: newUri });
		*/
	}

	async delete(uri: vscode.Uri): Promise<void> {
		/*const FabricUri: FabricFSUri = await FabricFSUri.getInstance(uri);

		const entry = FabricUri.getStreamEntry();
		if (!entry) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		await FabricUri.removeStreamEntry();
		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(uri) }, { uri, type: vscode.FileChangeType.Deleted });
		*/
	}

	async createDirectory(uri: vscode.Uri): Promise<void> {
		throw vscode.FileSystemError.Unavailable("Creating directories in Fabric is not supported! Consider creating/copying a file at any location and do your changes there.");
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

	public async dispose(): Promise<void> {
		this._emitter.dispose();

		await FabricFileSystemProvider.closeOpenFabricFiles();
	}
}
