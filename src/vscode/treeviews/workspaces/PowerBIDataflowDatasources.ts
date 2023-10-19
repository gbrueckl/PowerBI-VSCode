import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIDataflow } from './PowerBIDataflow';
import { PowerBIDataflowDatasource } from './PowerBIDataflowDatasource';
import { iPowerBIDataflowDatasource } from '../../../powerbi/DataflowsAPI/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataflowDatasources extends PowerBIWorkspaceTreeItem {

	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super("Datasources", groupId, "DATAFLOWDATASOURCES", groupId, parent);

		// the groupId is not unique for logical folders hence we make it unique
		super.id = groupId + "/" + this.parent.uid + "/" + this.itemType.toString();
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		return undefined;
	}

	// description is show next to the label
	get _description(): string {
		return undefined;
	}

	get apiUrlPart(): string {
		return "datasources";
	}

	get dataflow(): PowerBIDataflow {
		return this.parent as PowerBIDataflow;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if (!PowerBIApiService.isInitialized) {
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIDataflowDatasource[] = [];
			let items: iPowerBIDataflowDatasource[] = await PowerBIApiService.getItemList<iPowerBIDataflowDatasource>(this.apiPath, undefined, null);

			for (let item of items) {
				if (children.find(x => x.id == item.datasourceId) == undefined) { // there can be duplicate datasources for whatever reaon
					let treeItem = new PowerBIDataflowDatasource(item, this.groupId, this);
					children.push(treeItem);
					PowerBICommandBuilder.pushQuickPickItem(treeItem);
				}
			}

			return children;
		}
	}
}