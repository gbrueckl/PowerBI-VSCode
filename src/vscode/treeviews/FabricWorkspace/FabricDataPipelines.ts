import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { ThisExtension } from '../../../ThisExtension';
import { FabricApiItemType, iFabricApiItem } from '../../../fabric/_types';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { FabricWorkspaceTreeItem } from './FabricWorkspaceTreeItem';
import { FabricLakehouse } from './FabricLakehouse';
import { FabricWorkspaceGenericFolder } from './FabricWorkspaceGenericFolder';
import { FabricDataPipeline } from './FabricDataPipeline';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class FabricDataPipelines extends FabricWorkspaceGenericFolder {
	constructor(
		workspaceId: UniqueId,
		parent: FabricWorkspaceTreeItem
	) {
		super("DataPipelines", FabricApiItemType.DataPipelines, workspaceId, parent, "dataPipelines");

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
			let children: FabricDataPipeline[] = [];

			try {
				const items = await FabricApiService.getList<iFabricApiItem>(this.apiPath);

				for (let item of items.success) {
					let treeItem = new FabricDataPipeline(item, this.workspaceId, this);
					children.push(treeItem);
				}
			}
			catch (e) {
				ThisExtension.log("No data pipelines found for workspace " + this.displayName);
			}

			return children;
		}
	}
}