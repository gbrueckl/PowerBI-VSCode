import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';
import { Buffer } from '@env/buffer';
import { FabricFSUri, FabricUriType } from './FabricFSUri';
import { FabricFSCache } from './FabricFSCache';

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
		const fabricUri: FabricFSUri = await FabricFSUri.getInstance(uri);

		if(!fabricUri.isValid) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}
		const stats = await FabricFSCache.stats(fabricUri);
		return stats;
	}

	async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
		const fabricUri: FabricFSUri = await FabricFSUri.getInstance(uri);

		const results = await FabricFSCache.readDirectory(fabricUri);
		return results;
	}

	// --- manage file contents
	async readFile(uri: vscode.Uri): Promise<Uint8Array> {
		const fabricUri: FabricFSUri = await FabricFSUri.getInstance(uri);

		const content = FabricFSCache.readFile(fabricUri);

		//this._fireSoon({ type: vscode.FileChangeType.Changed, uri });

		return content;
	}

	async writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean, overwrite: boolean }): Promise<void> {
		const fabricUri: FabricFSUri = await FabricFSUri.getInstance(uri);

		await FabricFSCache.writeFile(fabricUri, content, options);

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri });
	}

	// --- manage files/folders
	async rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): Promise<void> {
		// rename is also called when moving files within the fabric scheme!
		const oldFabricUri: FabricFSUri = await FabricFSUri.getInstance(oldUri);
		const newFabricUri: FabricFSUri = await FabricFSUri.getInstance(newUri, true);

		if(oldFabricUri.uriType == FabricUriType.item) {
			await FabricFSCache.rename(oldFabricUri, newFabricUri);
		}
		else if(oldFabricUri.uriType == FabricUriType.part) {
			await FabricFSCache.rename(oldFabricUri, newFabricUri);
		}
		else {
			// we only support renaming of Items or Itemparts
			throw vscode.FileSystemError.FileNotFound("Rename is currently not supported!");
		}

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(oldUri) }, { type: vscode.FileChangeType.Deleted, uri: oldUri });
		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(newUri) }, { type: vscode.FileChangeType.Created, uri: newUri });
	}

	async delete(uri: vscode.Uri): Promise<void> {
		const fabricUri: FabricFSUri = await FabricFSUri.getInstance(uri);

		if(fabricUri.uriType == FabricUriType.part) {
			await FabricFSCache.delete(fabricUri);
		}
		else if(fabricUri.uriType == FabricUriType.item) {
			await FabricFSCache.delete(fabricUri);
		}
		else {
			// we only support renaming of Items or Itemparts
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(uri) }, { uri, type: vscode.FileChangeType.Deleted });
	}

	async fireDeleted(uri: vscode.Uri): Promise<void> {
		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(uri) }, { uri, type: vscode.FileChangeType.Deleted });
	}

	async createDirectory(uri: vscode.Uri): Promise<void> {
		const fabricUri: FabricFSUri = await FabricFSUri.getInstance(uri, true);

		if(fabricUri.uriType == FabricUriType.part) {
			await FabricFSCache.createDirectory(fabricUri);
		}
		else if(fabricUri.uriType == FabricUriType.item) {
			await FabricFSCache.createDirectory(fabricUri);
		}
		else {
			// we only support creation of Items or Itemparts
			throw vscode.FileSystemError.FileNotFound(uri);
		}
		
		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: Helper.parentUri(uri) }, { type: vscode.FileChangeType.Created, uri });
	}

	/*
	// there is no improvements that we could do when copying files
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
