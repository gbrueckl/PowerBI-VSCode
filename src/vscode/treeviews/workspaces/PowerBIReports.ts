import * as vscode from 'vscode';

import { Helper, unique_id } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';


import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIReport } from './PowerBIReport';
import { iPowerBIReport } from '../../../powerbi/ReportsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIReports extends PowerBIWorkspaceTreeItem {

	constructor(groupId?: unique_id) {
		super("Reports", groupId, "REPORTS", groupId);

		// the groupId is not unique for logical folders hence we make it unique
		super.id = groupId + this.item_type.toString();
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
				let treeItem = new PowerBIReport(item, this.group);
				children.push(treeItem);
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}
			
			return children;
		}
	}
}