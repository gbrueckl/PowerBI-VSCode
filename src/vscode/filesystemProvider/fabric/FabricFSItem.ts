import * as vscode from 'vscode';


import { FabricFSUri } from './FabricFSUri';
import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricApiItemFormat, FabricApiItemType, iFabricApiItem, iFabricApiItemDefinition, iFabricApiItemPart } from '../../../fabric/_types';
import { FabricFSWorkspace } from './FabricFSWorkspace';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIConfiguration } from '../../configuration/PowerBIConfiguration';

export class FabricFSItem extends FabricFSCacheItem implements iFabricApiItem {
	id: string;
	displayName: string;
	description: string;
	type: FabricApiItemType;
	workspace: FabricFSWorkspace;
	private _format?: FabricApiItemFormat;

	constructor(uri: FabricFSUri) {
		super(uri);
	}

	get workspaceId(): string {
		return this.FabricUri.workspaceId;
	}

	get itemId(): string {
		return this.FabricUri.itemId;
	}

	get format(): FabricApiItemFormat | undefined {
		if (!this._format) {
			const configuredFormats = PowerBIConfiguration.fabricFileFormats;
			this._format = configuredFormats[FabricApiItemType[this.FabricUri.itemType]];
		}
		return this._format;
	}

	getApiResponse<T = iFabricApiItemPart[]>(): T {
		return this._apiResponse as T;
	}

	public async loadStatsFromApi<T>(): Promise<void> {
		const apiItem = await FabricApiService.getItem(this.FabricUri.workspaceId, this.FabricUri.itemId);

		if (apiItem) {
			this.id = apiItem.id;
			this.displayName = apiItem.displayName;
			this.description = apiItem.description;
			this.type = apiItem.type;

			this._stats = {
				type: vscode.FileType.Directory,
				ctime: undefined,
				mtime: undefined,
				size: undefined
			};
		}
		else {
			this._stats = undefined;
		}
	}

	public async loadChildrenFromApi<T>(): Promise<void> {
		if (!this._children) {
			if (!this._apiResponse) {
				const apiItems = await FabricApiService.getItemDefinitionParts(this.FabricUri.workspaceId, this.FabricUri.itemId, this.format);
				this._apiResponse = apiItems;
			}
			this._children = [];

			let folders: [string, vscode.FileType][] = [];
			let files: [string, vscode.FileType][] = [];

			for (let item of this._apiResponse) {
				const partParts = item.path.split("/");
				if (partParts.length == 1) {
					let fileName = item.path;
					files.push([fileName, vscode.FileType.File]);
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

		throw vscode.FileSystemError.FileNotFound(vscode.Uri.joinPath(this.FabricUri.uri, path));
	}

	public getChildrenForSubpath(path: string): [string, vscode.FileType][] | undefined {
		const items = this.getApiResponse().filter((item) => item.path.startsWith(path + "/"));

		let folders: [string, vscode.FileType][] = [];
		let files: [string, vscode.FileType][] = [];

		const pathLength = path.split("/").length;
		for (let item of items) {
			const itemParts = item.path.split("/");
			const itemLength = itemParts.length;

			if (pathLength == itemLength - 1) {
				if (item.payloadType == "VSCodeFolder") {
					if (itemParts[itemParts.length - 1] != '') {
						folders.push([itemParts[pathLength - 1], vscode.FileType.Directory]);
					}
				}
				else {
					let fileName = itemParts.pop();
					files.push([fileName, vscode.FileType.File]);
				}
			}
			else {
				const folderName = itemParts[pathLength];
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

	public async writeContentToSubpath(path: string, content: Uint8Array, options: { create: boolean, overwrite: boolean }): Promise<void> {
		const item = this.getApiResponse().find((item) => item.path == path);
		if (item) {
			if (options.overwrite) {
				if (item.payloadType == "InlineBase64") {
					item.payload = Buffer.from(content).toString("base64");

					return;
				}
			}
			else {
				throw vscode.FileSystemError.FileExists(vscode.Uri.joinPath(this.FabricUri.uri, path));
			}
		}
		else {
			if (options.create) {
				this.addPart(path);
				await this.writeContentToSubpath(path, content, { create: false, overwrite: true });
				return;
			}
		}
		vscode.window.showErrorMessage("Payload type not supported: " + item.payloadType);
		throw vscode.FileSystemError.Unavailable("Payload type not supported: " + item.payloadType);
	}

	public async getItemDefinition(): Promise<iFabricApiItemDefinition> {
		let parts = this.getApiResponse();

		parts = parts.filter((part) => part.payloadType != "VSCodeFolder");

		let definition = { "definition": { "parts": parts } };

		if (this.format) {
			definition["format"] = this.format;
		}

		return definition;
	}

	public async updateItemDefinition(): Promise<void> {
		let definition = await this.getItemDefinition();
		const error = await FabricApiService.updateItemDefinition(this.workspaceId, this.itemId, definition, `Publish ${this.displayName}`);
	}

	public async removePart(partPath: string): Promise<void> {
		let parts = this.getApiResponse();
		let index = parts.findIndex((part) => part.path == partPath);
		if (index >= 0) {
			parts.splice(index, 1);
		}

		// reload children from modified API Response
		this._children = undefined;
		await this.loadChildrenFromApi();
	}

	public async addPart(partPath: string): Promise<void> {
		let parts = this.getApiResponse();
		let index = parts.findIndex((part) => part.path == partPath);
		if (index >= 0) {
			throw vscode.FileSystemError.FileExists(partPath);
		}
		else {
			parts.push({ "path": partPath, "payloadType": "InlineBase64", "payload": "" });
		}

		// reload children from modified API Response
		this._children = undefined;
		await this.loadChildrenFromApi();
	}

	public async createSubFolder(folderPath: string): Promise<void> {
		let parts = this.getApiResponse();
		let index = parts.findIndex((part) => part.path == folderPath);
		if (index >= 0) {
			throw vscode.FileSystemError.FileExists(folderPath);
		}
		else {
			parts.push({ "path": folderPath + "/", "payloadType": "VSCodeFolder", "payload": "" });
		}

		// reload children from modified API Response
		this._children = undefined;
		await this.loadChildrenFromApi();
	}
}