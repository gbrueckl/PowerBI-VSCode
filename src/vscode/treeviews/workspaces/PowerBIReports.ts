import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';


import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIReport } from './PowerBIReport';
import { iPowerBIReport } from '../../../powerbi/ReportsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIReports extends PowerBIWorkspaceTreeItem {

	constructor(
		groupId: UniqueId,
		parent: PowerBIApiTreeItem
	) {
		super("Reports", groupId, "REPORTS", groupId, parent);

		// the groupId is not unique for logical folders hence we make it unique
		super.id = groupId + "/" + this.itemType.toString();
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
			let children: PowerBIReport[] = [];
			let items: iPowerBIReport[] = await PowerBIApiService.getReports(this.group);

			for (let item of items) {
				let treeItem = new PowerBIReport(item, this.group, this);
				children.push(treeItem);
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}
			
			return children;
		}
	}
}