import * as vscode from 'vscode';

import { ThisExtension } from '../../ThisExtension';
import { Helper } from '../../helpers/Helper';
import { Buffer } from '@env/buffer';
import { TMDLProxy, TMDLProxyStreamEntry, TMDLProxyServer } from '../../helpers/TMDLProxy';
import { TMDLFSUri } from './TMDLFSUri';
import { TMDLFSCache } from './TMDLFSCache';

export const TMDL_SCHEME: string = "tmdl";
export const TMDL_EXTENSION: string = ".tmdl";
export const TMLD_FILE_ENCODING: BufferEncoding = "utf8";


export class TMDLFileSystemProvider implements vscode.FileSystemProvider, vscode.Disposable {
	//static loadedModels: Map<string, TMDLProxyStreamEntry[]> = new Map<string, TMDLProxyStreamEntry[]>();
	public cachedServers: TMDLFSCache;

	constructor() {
		this.cachedServers = new TMDLFSCache();
	}

	public static async register(context: vscode.ExtensionContext) {
		const fsp = new TMDLFileSystemProvider()
		context.subscriptions.push(vscode.workspace.registerFileSystemProvider(TMDL_SCHEME, fsp, { isCaseSensitive: false }));

		ThisExtension.TMDLFileSystemProvider = fsp;
	}

	
	public static async closeOpenTMDLFiles(): Promise<void> {
		// close all existing TMDL files
		const tabs: vscode.Tab[] = vscode.window.tabGroups.all.map(tg => tg.tabs).flat();
		const tmdlTabs: vscode.Tab[] = tabs.filter(tab => tab.input instanceof vscode.TabInputText && tab.input.uri.scheme === TMDL_SCHEME);
		for (let tab of tmdlTabs) {
			ThisExtension.log("Closing TMDL file: " + (tab.input as vscode.TabInputText).uri.toString());
			await vscode.window.tabGroups.close(tab);
		}
	}

	// -- manage file metadata
	async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
		const tmdlUri: TMDLFSUri = await TMDLFSUri.getInstance(uri);

		if (tmdlUri.isServerLevel || tmdlUri.logicalPath == ".") {
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
		const tmdlUri: TMDLFSUri = await TMDLFSUri.getInstance(uri, true);

		if (tmdlUri.isServerLevel) {
			await TMDLFSCache.loadServer(tmdlUri.server);

			let dbEntries: [string, vscode.FileType][] = [];
			for (const db of TMDLFSCache.getServer(tmdlUri.server).databases) {
				dbEntries.push([db.databaseName, vscode.FileType.Directory]);
			}
			return dbEntries;
		}

		else {
			await TMDLFSCache.loadDatabase(tmdlUri.server, tmdlUri.database);
			const entries: TMDLProxyStreamEntry[] = await tmdlUri.getStreamEntries();

			let folders: [string, vscode.FileType][] = [];
			let files: [string, vscode.FileType][] = [];
			const tmdlPathDepth = tmdlUri.logicalPath.split("/").length;
			for (const entry of entries) {
				if (entry.logicalPath.startsWith(tmdlUri.logicalPath)) {
					if (entry.logicalPath.split("/").length == tmdlPathDepth + 1) {
						files.push([entry.logicalPath.split("/")[tmdlPathDepth] + TMDL_EXTENSION, vscode.FileType.File]);
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
	}

	// --- manage file contents

	async readFile(uri: vscode.Uri): Promise<Uint8Array> {
		const tmdlUri: TMDLFSUri = await TMDLFSUri.getInstance(uri);

		const entry = await tmdlUri.getStreamEntry();
		if (!entry) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri });

		return Buffer.from(entry.content, TMLD_FILE_ENCODING);
	}

	async writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean, overwrite: boolean }): Promise<void> {
		const tmdlUri: TMDLFSUri = await TMDLFSUri.getInstance(uri);

		const entry = await tmdlUri.getStreamEntry();
		if (!entry) {
			if (options.create) {
				if (tmdlUri.uri.path.endsWith(TMDL_EXTENSION)) {
					let newEntry: TMDLProxyStreamEntry = {
						logicalPath: tmdlUri.logicalPath,
						content: Buffer.from(content).toString(TMLD_FILE_ENCODING),
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
			entry.content = Buffer.from(content).toString(TMLD_FILE_ENCODING);
		}

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri });
	}

	// --- manage files/folders

	async rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): Promise<void> {
		const oldTmdlUri: TMDLFSUri = await TMDLFSUri.getInstance(oldUri);
		const newTmdlUri: TMDLFSUri = await TMDLFSUri.getInstance(newUri);

		let oldEntry = await oldTmdlUri.getStreamEntry();
		if (!oldEntry) {
			throw vscode.FileSystemError.FileNotFound(oldUri);
		}

		oldEntry.logicalPath = newTmdlUri.logicalPath;

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(oldUri) }, { type: vscode.FileChangeType.Deleted, uri: oldUri });
		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(newUri) }, { type: vscode.FileChangeType.Created, uri: newUri });
	}

	async delete(uri: vscode.Uri): Promise<void> {
		const tmdlUri: TMDLFSUri = await TMDLFSUri.getInstance(uri);

		const entry = tmdlUri.getStreamEntry();
		if (!entry) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		await tmdlUri.removeStreamEntry();
		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(uri) }, { uri, type: vscode.FileChangeType.Deleted });
	}

	async createDirectory(uri: vscode.Uri): Promise<void> {
		throw vscode.FileSystemError.Unavailable("Creating directories in TMDL is not supported! Consider creating/copying a file at any location and do your changes there.");
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

		await TMDLFileSystemProvider.closeOpenTMDLFiles();
	}
}
