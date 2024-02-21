import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';
import { FabricFSSupportedItemType, LoadingState } from './_types';
import { FabricFSUri } from './FabricFSUri';
import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricFSWorkspace } from './FabricFSWorkspace';
import { FabricApiService } from '../../../fabric/FabricApiService';

export class FabricFSItemType extends FabricFSCacheItem {
	workspace: FabricFSWorkspace;
	itemType: FabricFSSupportedItemType;

	constructor(uri: FabricFSUri) {
		super(uri);

		this._stats = {
			type: vscode.FileType.Directory,
			ctime: undefined,
			mtime: undefined,
			size: undefined
		};
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
			const apiItems = await FabricApiService.getItems(this.FabricUri.workspaceId, this.FabricUri.itemType);
			this._apiResponse = apiItems;
			this._children = [];
			for (let item of apiItems) {
				FabricFSUri.addItemNameIdMap(item.displayName, item.id);
				this._children.push([item.displayName, vscode.FileType.Directory]);
			}
		}
	}
}