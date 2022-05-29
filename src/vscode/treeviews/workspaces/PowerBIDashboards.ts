import * as vscode from 'vscode';

import { unique_id } from '../../../helpers/Helper';

import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDashboard } from './PowerBIDashboard';
import { iPowerBIDashboard } from '../../../powerbi/DashboardsAPI/_types';


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDashboards extends PowerBIWorkspaceTreeItem {

	constructor(groupId?: string) {
		super("Dashboards", groupId, "DASHBOARDS", new unique_id(groupId));

		super.tooltip = this._tooltip;
		super.description = this._description;
		super.contextValue = this._contextValue;
		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
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
				children.push(new PowerBIDashboard(item));
			}
			
			return children;
		}
	}
}