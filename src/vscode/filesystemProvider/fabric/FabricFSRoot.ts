import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';
import { FabricApiWorkspaceType, iFabricApiWorkspace } from '../../../fabric/_types';
import { FABRIC_FS_ITEM_TYPES, FabricFSSupportedItemType, LoadingState } from './_types';
import { FabricFSItemType } from './FabricFSItemType';
import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricFSUri } from './FabricFSUri';
import { FabricApiService } from '../../../fabric/FabricApiService';



export class FabricFSRoot extends FabricFSCacheItem {
	constructor(uri: FabricFSUri) {
		super(uri);
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
			const apiItems = await FabricApiService.listWorkspaces();
			this._children = [];
			for (let apiItem of apiItems) {
				this._children.push([apiItem.id, vscode.FileType.Directory]);
			}
		}
	}
}