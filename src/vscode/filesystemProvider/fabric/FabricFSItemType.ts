import * as vscode from 'vscode';

import { FabricFSUri } from './FabricFSUri';
import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricFSWorkspace } from './FabricFSWorkspace';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { FabricApiItemType } from '../../../fabric/_types';
import { FABRIC_FS_ITEM_TYPES } from './_types';

export class FabricFSItemType extends FabricFSCacheItem {
	constructor(uri: FabricFSUri) {
		super(uri);
	}

	get itemType(): FabricApiItemType {
		return this.FabricUri.itemType;
	}

	public async loadStatsFromApi<T>(): Promise<void> {
		if (FABRIC_FS_ITEM_TYPES.includes(this.itemType)) {
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
			const apiItems = await FabricApiService.listItems(this.FabricUri.workspaceId, this.FabricUri.itemType);
			this._apiResponse = apiItems;
			this._children = [];
			for (let item of apiItems) {
				FabricFSUri.addItemNameIdMap(`${item.workspaceId}/${item.type}/${item.displayName}`, item.id);
				this._children.push([item.displayName, vscode.FileType.Directory]);
			}
		}
	}
}