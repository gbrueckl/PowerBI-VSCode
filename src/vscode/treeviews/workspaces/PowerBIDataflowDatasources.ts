import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIDataflow } from './PowerBIDataflow';
import { PowerBIDataflowDatasource } from './PowerBIDataflowDatasource';
import { iPowerBIDataflowDatasource } from '../../../powerbi/DataflowsAPI/_types';
import { PowerBIWorkspaceGenericFolder } from './PowerBIWorkspaceGenericFolder';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataflowDatasources extends PowerBIWorkspaceGenericFolder {

	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super("Datasources", "DATAFLOWDATASOURCES", groupId, parent, "datasources");
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