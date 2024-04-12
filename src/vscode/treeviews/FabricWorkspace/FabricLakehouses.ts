import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from '../workspaces/PowerBIWorkspaceTreeItem';
import { iPowerBIDatasetDMV } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIDatasetTable } from '../workspaces/PowerBIDatasetTable';
import { PowerBIWorkspaceGenericFolder } from '../workspaces/PowerBIWorkspaceGenericFolder';
import { PowerBIDatasetTableColumn } from '../workspaces/PowerBIDatasetTableColumn';
import { FabricApiItemType, iFabricApiItem } from '../../../fabric/_types';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { FabricWorkspaceTreeItem } from './FabricWorkspaceTreeItem';
import { FabricLakehouse } from './FabricLakehouse';
import { FabricWorkspaceGenericFolder } from './FabricWorkspaceGenericFolder';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class FabricLakehouses extends FabricWorkspaceGenericFolder {
	constructor(
		workspaceId: UniqueId,
		parent: FabricWorkspaceTreeItem
	) {
		super("Lakehouses", FabricApiItemType.Lakehouses, workspaceId, parent, "lakehouses");

		this.id = workspaceId + "/" + parent.itemId + "/" + this.type.toString();
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
				const items = await FabricApiService.getList<iFabricApiItem>(this.apiPath);

				for (let item of items.success) {
					let treeItem = new FabricLakehouse(item, this.workspaceId, this);
					children.push(treeItem);
				}
			}
			catch (e) {
				ThisExtension.log("No lakehouses found for workspace " + this.displayName);
			}

			return children;
		}
	}
}