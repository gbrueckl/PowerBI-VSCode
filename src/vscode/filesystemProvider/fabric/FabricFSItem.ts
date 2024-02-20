import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';
import { FabricItemFormat, FabricItemType, iFabricItem, iFabricItemPart } from '../../../fabric/_types';
import { FabricFSItemPart } from './FabricFSItemPart';
import { FabricFSWorkspace } from './FabricFSWorkspace_ARRAY';
import { LoadingState } from './_types';
import { FABRIC_SCHEME } from './FabricFileSystemProvider';
import { FabricFSUri } from './FabricFSUri';
import { FabricApiService } from '../../../fabric/FabricAPIService';
import { FabricFSCacheItem } from './FabricFSCacheItem';

export class FabricFSItem extends FabricFSCacheItem implements iFabricItem {
	id: string;
	displayName: string;
	description: string;
	type: FabricItemType;
	workspace: FabricFSWorkspace;
	parts: FabricFSItemPart[];
	format?: FabricItemFormat;

	loadingState: LoadingState;
	partsLoadingState: LoadingState;

	constructor(uri: FabricFSUri) {
		super(uri);
	}

	get workspaceId(): string {
		return this.workspace.id;
	}

	public async loadStatsFromApi(): Promise<void> {
		this._stats = {
			type: vscode.FileType.Directory,
			ctime: undefined,
			mtime: undefined,
			size: undefined
		};
	}

	public async loadChildrenFromApi<T>(): Promise<void> {
		if (!this._children) {
			const apiItems = await FabricApiService.getItemParts(this.Uri.workspaceId, this.Uri.itemType, this.Uri.itemId);
			this._children = [];
			for (let item of apiItems) {
				this._children.push([item.id, vscode.FileType.Directory]);
			}
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
			
			let item = await Helper.awaitWithProgress<iFabricItem>(
				`Loading Fabric Item '${this.id}' from workspace '${this.workspace.displayName}'`,
				FabricApiService.getItem(this.workspace.id, this.id),
				1000);
			if (item) {
				this.displayName = item.displayName;
				this.description = item.description;
				this.type = item.type;
				this.format = "ipynb"; // TODO: get format from item type

				let itemParts = await Helper.awaitWithProgress<iFabricItemPart[]>(
					`Loading Fabric Item Parts for '${this.id}' from workspace '${this.workspace.displayName}'`,
					FabricApiService.getItemParts(this.workspace.id, this.id),
					1000);
				if (itemParts) {
					this.parts = [];
					
					for (let part of itemParts) {
						let partInstance = new FabricFSItemPart(this, part.path);
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