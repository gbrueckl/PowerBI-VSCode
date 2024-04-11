import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { ThisExtension } from '../../../ThisExtension';
import { iFabricApiItem } from '../../../fabric/_types';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { FabricWorkspaceTreeItem } from './FabricWorkspaceTreeItem';
import { FabricLakehouse } from './FabricLakehouse';
import { FabricWorkspaceGenericFolder } from './FabricWorkspaceGenericFolder';
import { FabricLakehouseTable } from './FabricLakehouseTable';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class FabricLakehouseTables extends FabricWorkspaceGenericFolder {
	constructor(
		groupId: UniqueId,
		parent: FabricWorkspaceTreeItem
	) {
		super("Tables", "LAKEHOUSETABLES", groupId, parent, "tables");
	}

	async getChildren(element?: FabricWorkspaceTreeItem): Promise<FabricWorkspaceTreeItem[]> {
		if (!PowerBIApiService.isInitialized) {
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: FabricLakehouse[] = [];

			try {
				const items = await FabricApiService.getList<iFabricApiItem>(this.apiPath, {"itemType": "lakehouse"});

				for (let item of items.success) {
					let treeItem = new FabricLakehouseTable(item, this.workspaceId, this);
					children.push(treeItem);
				}
			}
			catch (e) {
				ThisExtension.log("No tables found for lakehouse " + this.displayName);
			}

			return children;
		}
	}
}