import * as vscode from 'vscode';

import {  UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIDataflow } from './PowerBIDataflow';
import { PowerBIDataflowTransaction } from './PowerBIDataflowTransaction';
import { iPowerBIDataflowTransaction } from '../../../powerbi/DataflowsAPI/_types';
import { PowerBIWorkspaceGenericFolder } from './PowerBIWorkspaceGenericFolder';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataflowTransactions extends PowerBIWorkspaceGenericFolder {

	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super("Refreshes", "DATAFLOWTRANSACTIONS", groupId, parent, "transactions");
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
			let children: PowerBIDataflowTransaction[] = [];
			let items: iPowerBIDataflowTransaction[] = await PowerBIApiService.getItemList<iPowerBIDataflowTransaction>(this.apiPath, undefined, null);

			for (let item of items) {
				let treeItem = new PowerBIDataflowTransaction(item, this.groupId, this);
				children.push(treeItem);
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}

			return children;
		}
	}
}