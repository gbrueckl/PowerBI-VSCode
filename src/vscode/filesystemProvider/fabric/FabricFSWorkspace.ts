import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';
import { FabricItemType, FabricWorkspaceType, iFabricWorkspace } from '../../../fabric/_types';
import { FabricFSItem } from './FabricFSItem';
import { LoadingState } from './_types';
import { FabricApiService } from '../../../fabric/FabricAPIService';



export class FabricFSWorkspace implements iFabricWorkspace {
	id: string;
	displayName: string;
	description: string;
	type: FabricWorkspaceType;
	capacityId: string;
	capacityAssignmentProgress: string;
	items: FabricFSItem[];

	loadingState: LoadingState;

	constructor(workspaceId: string) {
		this.id = workspaceId;

		this.items = [];

		this.loadingState = "not_loaded";
	}

	public async getItems(itemType: FabricItemType): Promise<FabricFSItem[]> {
		let items = this.items.filter((item) => item.type == itemType);

		return items;
	}

	public async getItem(itemId: string, autoLoad: boolean = true): Promise<FabricFSItem> {
		let item = this.items.find((item) => item.id == itemId);

		if(!item)
		{
			item = new FabricFSItem(this, itemId);
			this.items.push(item);
		}

		if(item.loadingState != "loaded" && autoLoad)
		{
			await item.load();
		}

		return item;
	}

	async load(): Promise<void> {
		if (this.loadingState == "not_loaded") {
			this.loadingState = "loading";
			ThisExtension.log(`Loading Fabric Workspace '${this.id}' ... `);
			
			const workspace = await FabricApiService.getWorkspace(this.id);
			if (workspace) {
				this.displayName = workspace.displayName;
				this.description = workspace.description;
				this.type = workspace.type;
				this.capacityId = workspace.capacityId;
				this.capacityAssignmentProgress = workspace.capacityAssignmentProgress;

				this.loadingState = "loaded";
				ThisExtension.log(`Fabric Workspace '${this.id}' loaded!`);
			}
			else {
				this.loadingState = "not_loaded";
				ThisExtension.log(`Failed to load Fabric Workspace '${this.id}'!`);
			}
		}
		else if (this.loadingState == "loading") {
			ThisExtension.logDebug(`Fabric Workspace '${this.id}' is loading in other process - waiting ... `);
			await Helper.awaitCondition(async () => this.loadingState != "loading", 60000, 500);
			ThisExtension.logDebug(`Fabric Workspace '${this.id}' successfully loaded in other process!`);
		}
	}
}