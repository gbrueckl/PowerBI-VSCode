import * as vscode from 'vscode';

import { unique_id } from '../../../helpers/Helper';

import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDashboard } from './PowerBIDashboard';
import { iPowerBIDashboard } from '../../../powerbi/DashboardsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDashboards extends PowerBIWorkspaceTreeItem {

	constructor(groupId?: unique_id) {
		super("Dashboards", groupId, "DASHBOARDS", groupId);

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
			let children: PowerBIDashboard[] = [];
			let items: iPowerBIDashboard[] = await PowerBIApiService.getDashboards(this._group);

			for (let item of items) {
				let treeItem = new PowerBIDashboard(item, this.group);
				children.push(treeItem);
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}
			
			return children;
		}
	}
}