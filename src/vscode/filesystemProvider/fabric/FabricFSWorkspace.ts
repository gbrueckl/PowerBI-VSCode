import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';
import { FabricApiItemType, FabricApiWorkspaceType, iFabricApiWorkspace } from '../../../fabric/_types';
import { FABRIC_FS_ITEM_TYPES } from './_types';
import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricFSUri } from './FabricFSUri';
import { FabricApiService } from '../../../fabric/FabricApiService';



export class FabricFSWorkspace extends FabricFSCacheItem implements iFabricApiWorkspace {
	id: string;
	displayName: string;
	description: string;
	type: FabricApiWorkspaceType;
	capacityId: string;
	capacityAssignmentProgress: string;

	constructor(uri: FabricFSUri) {
		super(uri);
	}

	public async loadStatsFromApi<T>(): Promise<void> {
		const apiItem = await FabricApiService.getWorkspace(this.FabricUri.workspaceId);

		if(apiItem) {	
			this.id = apiItem.id;
			this.displayName = apiItem.displayName;
			this.description = apiItem.description;
			this.type = apiItem.type;
			this.capacityId = apiItem.capacityId;
			this.capacityAssignmentProgress = apiItem.capacityAssignmentProgress;

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
			this._children = [];
			this._apiResponse = FABRIC_FS_ITEM_TYPES;
			for (let itemType of FABRIC_FS_ITEM_TYPES) {
				this._children.push([FabricApiItemType[itemType], vscode.FileType.Directory]);
			}
		}
	}
}