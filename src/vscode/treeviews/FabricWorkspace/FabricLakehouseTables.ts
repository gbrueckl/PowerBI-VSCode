import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { ThisExtension } from '../../../ThisExtension';
import { FabricApiItemType,  iFabricApiLakehouseTable } from '../../../fabric/_types';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { FabricWorkspaceTreeItem } from './FabricWorkspaceTreeItem';
import { FabricWorkspaceGenericFolder } from './FabricWorkspaceGenericFolder';
import { FabricLakehouseTable } from './FabricLakehouseTable';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class FabricLakehouseTables extends FabricWorkspaceGenericFolder {
	constructor(
		workspaceId: UniqueId,
		parent: FabricWorkspaceTreeItem
	) {
		super("Tables", FabricApiItemType.LakehouseTables, workspaceId, parent, "tables");
	}

	async getChildren(element?: FabricWorkspaceTreeItem): Promise<FabricWorkspaceTreeItem[]> {
		if (!PowerBIApiService.isInitialized) {
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: FabricLakehouseTable[] = [];

			try {
				const items = await FabricApiService.getList<iFabricApiLakehouseTable>(this.apiPath, undefined, "data");

				for (let item of items.success) {
					let treeItem = new FabricLakehouseTable(item, this.workspaceId, this);
					children.push(treeItem);
				}
			}
			catch (e) {
				ThisExtension.log("No tables found for lakehouse " + this.parent.displayName);
			}

			return children;
		}
	}
}