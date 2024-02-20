import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';
import { FabricFSItemPart } from './FabricFSItemPart';
import { LoadingState } from './_types';
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
	parts: FabricFSItemPart[];
	format?: FabricApiItemFormat;

	loadingState: LoadingState;
	partsLoadingState: LoadingState;

	constructor(uri: FabricFSUri) {
		super(uri);
	}

	get workspaceId(): string {
		return this.workspace.id;
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



	public async getPart(path: string, autoLoad: boolean = true): Promise<FabricFSItemPart> {
		let part = this.parts.find((part) => part.path == path);

		return part;
	}

	async load(): Promise<void> {
		if (this.loadingState == "not_loaded") {
			this.loadingState = "loading";
			ThisExtension.log(`Loading '${this.id}' from workspace '${this.workspace.displayName}' ... `);

			let item = await Helper.awaitWithProgress<iFabricApiItem>(
				`Loading Fabric Item '${this.id}' from workspace '${this.workspace.displayName}'`,
				FabricApiService.getItem(this.workspace.id, this.id),
				1000);
			if (item) {
				this.displayName = item.displayName;
				this.description = item.description;
				this.type = item.type;
				this.format = "ipynb"; // TODO: get format from item type

				let itemParts = await Helper.awaitWithProgress<iFabricApiItemPart[]>(
					`Loading Fabric Item Parts for '${this.id}' from workspace '${this.workspace.displayName}'`,
					FabricApiService.getItemParts(this.workspace.id, this.id),
					1000);
				if (itemParts) {
					this.parts = [];

					for (let part of itemParts) {
						let partInstance = new FabricFSItemPart(await FabricFSUri.getInstance(vscode.Uri.joinPath(this.FabricUri.uri, part.path)));
						partInstance.payload = part.payload;
						partInstance.payloadType = part.payloadType;
						this.parts.push(partInstance);
					}

					ThisExtension.log(`Fabric Item Parts for '${this.id}' loaded!`);
					this.partsLoadingState = "loaded";
				}
				else {
					this.partsLoadingState = "not_loaded";
					ThisExtension.log(`Failed to load Fabric Item Parts for '${this.id}'!`);
				}


				ThisExtension.log(`Fabric Item '${this.id}' loaded!`);
				this.loadingState = "loaded";
			}
			else {
				this.loadingState = "not_loaded";
				ThisExtension.log(`Failed to load Fabric Item '${this.id}'!`);
			}
		}
		else if (this.loadingState == "loading") {
			ThisExtension.logDebug(`Fabric Item '${this.id}' is loading in other process - waiting ... `);
			await Helper.awaitCondition(async () => this.loadingState != "loading", 60000, 500);
			ThisExtension.logDebug(`Fabric Item '${this.id}' successfully loaded in other process!`);
		}
	}
}