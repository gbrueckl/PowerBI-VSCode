import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { FabricWorkspaceTreeItem } from './FabricWorkspaceTreeItem';
import { FabricApiItemType, iFabricApiItem, iFabricApiLakehouseProperties } from '../../../fabric/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class FabricDataPipeline extends FabricWorkspaceTreeItem {
	private _properties: iFabricApiLakehouseProperties;

	constructor(
		definition: iFabricApiItem,
		group: UniqueId,
		parent: FabricWorkspaceTreeItem
	) {
		super(definition.displayName, group, FabricApiItemType.DataPipeline, definition.id, parent, definition.description, vscode.TreeItemCollapsibleState.None);

		this.id = definition.id;
		this.definition = definition;

		this.contextValue = this._contextValue;
	}

	async runPipeline(body: any): Promise<void> {
		// https://learn.microsoft.com/en-us/fabric/data-factory/pipeline-rest-api#run-on-demand-item-job

		/*
		POST https://api.fabric.microsoft.com/v1/workspaces/<your WS Id>/items/<pipeline id>/jobs/instances?jobType=Pipeline
		{ 
			"executionData": { 
				"parameters": {
					"param_waitsec": 10" 
				} 
			} 
		}
		*/
	}
}