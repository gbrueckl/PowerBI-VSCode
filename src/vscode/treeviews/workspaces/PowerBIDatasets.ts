import * as vscode from 'vscode';

import {  UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDataset } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasets extends PowerBIWorkspaceTreeItem {

	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super("Datasets", groupId, "DATASETS", groupId, parent);

		// the groupId is not unique for logical folders hence we make it unique
		this.id = groupId + "/" + this.itemType.toString();
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		return undefined;
	}

	// description is show next to the label
	get _description(): string {
		return undefined;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if(!PowerBIApiService.isInitialized) { 			
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIDataset[] = [];
			let items: iPowerBIDataset[] = await PowerBIApiService.getItemList<iPowerBIDataset>(this.apiPath);

			for (let item of items) {
				let treeItem = new PowerBIDataset(item, this.groupId, this);
				children.push(treeItem);
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}
			
			return children;
		}
	}
}