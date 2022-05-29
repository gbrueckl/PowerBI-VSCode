import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDashboard } from '../../../powerbi/DashboardsAPI/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDashboard extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDashboard
	) {
		super(definition.name, null, "DASHBOARD", definition.id, vscode.TreeItemCollapsibleState.None);

		super.tooltip = this._tooltip;
		super.description = this._description;
		super.contextValue = this._contextValue;
		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	public static fromInterface(item: iPowerBIDashboard): PowerBIDashboard {
		let ret = new PowerBIDashboard(item);
		return ret;
	}

	public static fromJSON(jsonString: string): PowerBIDashboard {
		let item: iPowerBIDashboard = JSON.parse(jsonString);
		return PowerBIDashboard.fromInterface(item);
	}
}