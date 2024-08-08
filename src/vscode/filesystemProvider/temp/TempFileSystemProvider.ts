import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { Buffer } from '@env/buffer';
import { Helper } from '../../../helpers/Helper';


export const TEMP_SCHEME: string = "pbitemp";
export const TEMP_FILE_ENCODING: BufferEncoding = "utf8";


export class TempFileSystemProvider implements vscode.FileSystemProvider, vscode.Disposable {
	private static cache: Map<string, Buffer> = new Map<string, Buffer>();

	constructor() { }

	public static async register(context: vscode.ExtensionContext) {
		const fsp = new TempFileSystemProvider()
		context.subscriptions.push(vscode.workspace.registerFileSystemProvider(TEMP_SCHEME, fsp, { isCaseSensitive: false }));

		ThisExtension.TempFileSystemProvider = fsp;
	}

	public static async createTempFile(path: string, content: string): Promise<vscode.Uri> {
		let uri = vscode.Uri.parse(`${TEMP_SCHEME}:///${Helper.trimChar(path, "/")}`);
		TempFileSystemProvider.cache.set(uri.toString(), Buffer.from(content, TEMP_FILE_ENCODING));

		return uri;
	}

	// -- manage file metadata
	async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
		const item = TempFileSystemProvider.cache.get(uri.toString());

		if (item) {
			return {
				type: vscode.FileType.File,
				size: 0,
				mtime: null,
				ctime: null
			}
		}

		throw vscode.FileSystemError.FileNotFound(uri);
	}

	async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
		return [];
	}

	// --- manage file contents
	async readFile(uri: vscode.Uri): Promise<Uint8Array> {
		const item = TempFileSystemProvider.cache.get(uri.toString());

		return item;
	}

	async writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean, overwrite: boolean }): Promise<void> {
		throw vscode.FileSystemError.NoPermissions(`This file is read-only!`);
	}

	// --- manage files/folders

	async rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): Promise<void> {
		throw vscode.FileSystemError.NoPermissions(`This file is read-only!`);
	}

	async delete(uri: vscode.Uri): Promise<void> {
		throw vscode.FileSystemError.NoPermissions(`This file is read-only!`);
	}

	async createDirectory(uri: vscode.Uri): Promise<void> {
		throw vscode.FileSystemError.NoPermissions(`This file is read-only!`);
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
	}
}
