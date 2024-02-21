import * as vscode from 'vscode';

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
			this._apiResponse = apiItems;
			this._children = [];
			for (let apiItem of apiItems) {
				FabricFSUri.addWorkspaceNameIdMap(apiItem.displayName, apiItem.id);
				this._children.push([apiItem.displayName, vscode.FileType.Directory]);
			}
		}
	}
}