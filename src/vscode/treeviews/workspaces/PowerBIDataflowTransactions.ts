import * as vscode from 'vscode';

import {  UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIDataflow } from './PowerBIDataflow';
import { PowerBIDataflowTransaction } from './PowerBIDataflowTransaction';
import { iPowerBIDataflowTransaction } from '../../../powerbi/DataflowsAPI/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataflowTransactions extends PowerBIWorkspaceTreeItem {

	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super("Transactions", groupId, "DATAFLOWTRANSACTIONS", groupId, parent);

		// the groupId is not unique for logical folders hence we make it unique
		this.id = groupId + "/" + this.parent.uid + "/" + this.itemType.toString();
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
		return "transactions";
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