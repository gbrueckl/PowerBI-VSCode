import * as vscode from 'vscode';


import { FabricFSUri } from './FabricFSUri';
import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricApiItemFormat, FabricApiItemType, iFabricApiItem, iFabricApiItemPart } from '../../../fabric/_types';
import { FabricFSWorkspace } from './FabricFSWorkspace';
import { FabricApiService } from '../../../fabric/FabricApiService';

export class FabricFSItem extends FabricFSCacheItem implements iFabricApiItem {
	id: string;
	displayName: string;
	description: string;
	type: FabricApiItemType;
	workspace: FabricFSWorkspace;
	format?: FabricApiItemFormat;

	constructor(uri: FabricFSUri) {
		super(uri);
	}

	get workspaceId(): string {
		return this.workspace.id;
	}

	getApiResponse<T = iFabricApiItemPart[]>(): T {
		return this._apiResponse as T;
	}

	public async loadStatsFromApi<T>(): Promise<void> {
		this._stats = {
			type: vscode.FileType.Directory,
			ctime: undefined,
			mtime: undefined,
			size: undefined
		};
	}

	public async loadChildrenFromApi<T>(): Promise<void> {
		if (!this._children) {
			const apiItems = await FabricApiService.getItemParts(this.FabricUri.workspaceId, this.FabricUri.itemId);
			this._apiResponse = apiItems;
			this._children = [];

			let folders: [string, vscode.FileType][] = [];
			let files: [string, vscode.FileType][] = [];

			for (let item of apiItems) {
				const partParts = item.path.split("/");
				if (partParts.length == 1) {
					files.push([item.path, vscode.FileType.File]);
				}
				else {
					const folderName = partParts[0];
					if (!folders.find((folder) => folder[0] == folderName)) {
						folders.push([folderName, vscode.FileType.Directory]);
					}
				}
			}
			this._children = folders.concat(files);
		}
	}

	public getStatsForSubpath(path: string): vscode.FileStat | undefined {
		const fileItem = this.getApiResponse().find((item) => item.path == path);
		if (fileItem) {
			return {
				type: vscode.FileType.File,
				ctime: undefined,
				mtime: undefined,
				size: fileItem.payload.length
			};
		}
		const folderItem = this.getApiResponse().find((item) => item.path.startsWith(path + "/"));
		if (folderItem) {
			return {
				type: vscode.FileType.Directory,
				ctime: undefined,
				mtime: undefined,
				size: undefined
			};
		}
		return undefined;
	}

	public getChildrenForSubpath(path: string): [string, vscode.FileType][] | undefined {
		const items = this.getApiResponse().filter((item) => item.path.startsWith(path + "/"));

		let folders: [string, vscode.FileType][] = [];
		let files: [string, vscode.FileType][] = [];

		const pathLenght = path.split("/").length;
		for (let item of items) {
			const itemParts = item.path.split("/");
			const itemLength = itemParts.length;
			if (pathLenght == itemLength - 1) {
				files.push([itemParts.pop(), vscode.FileType.File]);
			}
			else {
				const folderName = itemParts[pathLenght];
				if (!folders.find((folder) => folder[0] == folderName)) {
					folders.push([folderName, vscode.FileType.Directory]);
				}
			}
		}
		return folders.concat(files);
	}

	public async getContentForSubpath(path: string): Promise<Uint8Array> {
		const item = this.getApiResponse().find((item) => item.path == path);
		if (item) {
			if (item.payloadType == "InlineBase64") {
				const payloadBinary = Buffer.from(item.payload, "base64")
				return payloadBinary;
			}
		}
		vscode.window.showErrorMessage("Payload type not supported: " + item.payloadType);
		throw vscode.FileSystemError.Unavailable("Payload type not supported: " + item.payloadType);
	}
}