import * as vscode from 'vscode';


import { FabricFSUri } from './FabricFSUri';
import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricApiItemFormat, FabricApiPayloadType, iFabricApiItem, iFabricApiItemDefinition, iFabricApiItemPart, iFabricApiResponse } from '../../../fabric/_types';
import { FabricFSWorkspace } from './FabricFSWorkspace';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIConfiguration } from '../../configuration/PowerBIConfiguration';
import { FabricFSPublishAction } from './_types';
import { FabricFSItemType } from './FabricFSItemType';
import { FabricFSCache } from './FabricFSCache';

export class FabricFSItem extends FabricFSCacheItem implements iFabricApiItem {
	id: string;
	displayName: string;
	description: string;
	type: string;
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

	get format(): FabricApiItemFormat {
		if (!this._format) {
			this._format = PowerBIConfiguration.getFabricItemTypeformat(this.FabricUri.itemType);
		}
		return this._format;
	}

	get parent(): FabricFSItemType {
		return super.parent as FabricFSItemType;
	}

	getApiResponse<T = iFabricApiItemPart[]>(): T {
		return this._apiResponse as T;
	}

	public async loadStatsFromApi<T>(): Promise<void> {
		const response = await FabricApiService.getItem(this.FabricUri.workspaceId, this.FabricUri.itemId);

		if (response.success) {
			const apiItem = response.success;

			// we might get an error response so we  also need to check for the id
			if (apiItem && apiItem.id) {
				this.id = apiItem.id;
				this.displayName = apiItem.displayName;
				this.description = apiItem.description?.toString();
				this.type = apiItem.type;

				this.publishAction = FabricFSPublishAction.MODIFIED;

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
		else {
			this._stats = {
				type: vscode.FileType.Directory,
				ctime: undefined,
				mtime: undefined,
				size: undefined
			};
		}
	}

	public async loadChildrenFromApi<T>(): Promise<void> {
		if (!this._children) {
			if (!this._apiResponse) {
				const response = await FabricApiService.getItemDefinitionParts(this.FabricUri.workspaceId, this.FabricUri.itemId, this.format);
				this._apiResponse = response.success;
			}
			this._children = [];

			let folders: [string, vscode.FileType][] = [];
			let files: [string, vscode.FileType][] = [];

			for (let item of this.getApiResponse()) {
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
		const pathDecoded = decodeURIComponent(path);
		const fileItem = this.getApiResponse().find((item) => item.path == pathDecoded);
		if (fileItem) {
			return {
				type: vscode.FileType.File,
				ctime: undefined,
				mtime: undefined,
				size: fileItem.payload.length
			};
		}
		const folderItem = this.getApiResponse().find((item) => item.path.startsWith(pathDecoded + "/"));
		if (folderItem) {
			return {
				type: vscode.FileType.Directory,
				ctime: undefined,
				mtime: undefined,
				size: undefined
			};
		}

		// stats are also used to check existence of a file - so we should not show an error message to the user!
		//vscode.window.showErrorMessage("FILE_NOT_FOUND - " + vscode.Uri.joinPath(this.FabricUri.uri, pathDecoded).toString());
		throw vscode.FileSystemError.FileNotFound(vscode.Uri.joinPath(this.FabricUri.uri, pathDecoded));
	}

	public getChildrenForSubpath(path: string): [string, vscode.FileType][] | undefined {
		const pathDecoded = decodeURIComponent(path);
		const items = this.getApiResponse().filter((item) => item.path.startsWith(pathDecoded + "/"));

		let folders: [string, vscode.FileType][] = [];
		let files: [string, vscode.FileType][] = [];

		const pathLength = pathDecoded.split("/").length;
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
		const pathDecoded = decodeURIComponent(path);
		const item = this.getApiResponse().find((item) => item.path == pathDecoded);
		if (item) {
			if (item.payloadType == "InlineBase64") {
				const payloadBinary = Buffer.from(item.payload, "base64")
				return payloadBinary;
			}
		}

		vscode.window.showErrorMessage("FILE_NOT_FOUND - " + vscode.Uri.joinPath(this.FabricUri.uri, pathDecoded).toString());
		throw vscode.FileSystemError.FileNotFound(vscode.Uri.joinPath(this.FabricUri.uri, pathDecoded));
	}

	public async writeContentToSubpath(path: string, content: Uint8Array, options: { create: boolean, overwrite: boolean }): Promise<boolean> {
		const pathDecoded = decodeURIComponent(path);
		const item = this.getApiResponse().find((item) => item.path == pathDecoded);
		if (item) {
			if (options.overwrite) {
				if (item.payloadType == "InlineBase64") {
					item.payload = Buffer.from(content).toString("base64");

					return false;
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
				return true;
			}
		}

		vscode.window.showErrorMessage("FILE_NOT_FOUND - " + vscode.Uri.joinPath(this.FabricUri.uri, pathDecoded).toString());
		throw vscode.FileSystemError.FileNotFound(vscode.Uri.joinPath(this.FabricUri.uri, pathDecoded));
	}

	public async getItemDefinition(): Promise<iFabricApiItemDefinition> {
		let parts = this.getApiResponse();

		parts = parts.filter((part) => part.payloadType != "VSCodeFolder");

		let definition = { "parts": parts };

		if (this.format && this.format != FabricApiItemFormat.DEFAULT) {
			definition["format"] = this.format;
		}

		return { "definition": definition };
	}

	public async publish(): Promise<iFabricApiResponse> {
		let definition = await this.getItemDefinition();

		let response;
		// if the item was created locally, we need to use CREATE instead of UPDATE
		if (this.publishAction == FabricFSPublishAction.CREATE) {
			response = await FabricApiService.createItem(this.workspaceId, this.displayName, this.FabricUri.itemType, definition, `Creating ${this.FabricUri.itemType} '${this.displayName}'`);
			// add NameIdMap for subsequent calls to the created item
			FabricFSUri.addItemNameIdMap(`${response.success.workspaceId}/${response.success.type}/${response.success.displayName}`, response.success.id);
			this.publishAction = FabricFSPublishAction.MODIFIED;
		}
		else if (this.publishAction == FabricFSPublishAction.MODIFIED) {
			if(["semanticmodels", "reports"].includes(this.FabricUri.itemType.toLowerCase())) {
				ThisExtension.log("Updating items of type '" + this.FabricUri.itemType + "' is not supported yet supported by the APIs!");
			}
			else {
				response = await FabricApiService.updateItem(this.workspaceId, this.itemId, this.displayName, this.description);
			}
			
			if (!response?.error) {
				response = await FabricApiService.updateItemDefinition(this.workspaceId, this.itemId, definition, `Updating ${this.FabricUri.itemType} '${this.displayName}'`);
			}
		}
		else if (this.publishAction == FabricFSPublishAction.DELETE) {
			response = await FabricApiService.deleteItem(this.workspaceId, this.itemId, `Deleting ${this.FabricUri.itemType} '${this.displayName}'`);
			FabricFSCache.removeCacheItem(this);
			this.parent.removeChild(this.displayName)
			ThisExtension.FabricFileSystemProvider.fireDeleted(this.FabricUri.uri);
		}

		return response;
	}

	public async removePart(partPath: string): Promise<void> {
		let parts = this.getApiResponse();
		const partPathDecoded = decodeURIComponent(partPath);
		let index = parts.findIndex((part) => part.path == partPathDecoded);
		if (index >= 0) {
			parts.splice(index, 1);
		}

		// reload children from modified API Response
		this._children = undefined;
		await this.loadChildrenFromApi();
	}

	public async addPart(partPath: string, payload: string = "", payloadType: FabricApiPayloadType = "InlineBase64"): Promise<void> {
		let parts = this.getApiResponse();
		const partPathDecoded = decodeURIComponent(partPath);
		let index = parts.findIndex((part) => part.path == partPathDecoded);
		if (index >= 0) {
			throw vscode.FileSystemError.FileExists(partPathDecoded);
		}
		else {
			parts.push({ "path": partPathDecoded, "payloadType": payloadType, "payload": payload });
		}

		// reload children from modified API Response
		this._children = undefined;
		await this.loadChildrenFromApi();
	}

	public async getPart(partPath: string): Promise<iFabricApiItemPart> {
		let parts = this.getApiResponse();
		const partPathDecoded = decodeURIComponent(partPath);
		const part = parts.find((part) => part.path == partPathDecoded);
		if (part) {
			return part;
		}
		else {
			vscode.window.showErrorMessage("FILE_NOT_FOUND - FabricFSItem.getPart()" + vscode.Uri.joinPath(this.FabricUri.uri, partPathDecoded).toString());
			throw vscode.FileSystemError.FileNotFound(vscode.Uri.joinPath(this.FabricUri.uri, partPathDecoded));
		}
	}

	public async createSubFolder(folderPath: string): Promise<void> {
		let parts = this.getApiResponse();
		const folderPathDecoded = decodeURIComponent(folderPath);
		let index = parts.findIndex((part) => part.path == folderPathDecoded);
		if (index >= 0) {
			throw vscode.FileSystemError.FileExists(folderPathDecoded);
		}
		else {
			parts.push({ "path": folderPathDecoded + "/", "payloadType": "VSCodeFolder", "payload": "" });
		}

		// reload children from modified API Response
		this._children = undefined;
		await this.loadChildrenFromApi();
	}

	public async delete(): Promise<void> {
		// if the item was created locally, we need to remove it locally only
		if (this.publishAction == FabricFSPublishAction.CREATE) {
			// remove it from the cache and from the parent
			FabricFSCache.removeCacheItem(this);
			this.parent.removeChild(this.displayName)
		}
		else {
			this.publishAction = FabricFSPublishAction.DELETE;
		}
	}
}