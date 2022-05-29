import * as vscode from 'vscode';

import { Helper, unique_id } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';


import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIReport } from './PowerBIReport';
import { iPowerBIReport } from '../../../powerbi/ReportsAPI/_types';


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIReports extends PowerBIWorkspaceTreeItem {

	constructor(groupId?: string) {
		super("Reports", groupId, "REPORTS", new unique_id(groupId));

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
			let children: PowerBIReport[] = [];
			let items: iPowerBIReport[] = await PowerBIApiService.getReports(this.group);

			for (let item of items) {
				children.push(new PowerBIReport(item));
			}
			
			return children;
		}
	}
}