import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIReport } from '../../../powerbi/ReportsAPI/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIReport extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIReport
	) {
		super(definition.name, null, "REPORT", definition.id, vscode.TreeItemCollapsibleState.None);

		super.tooltip = this._tooltip;
		super.description = this._description;
		super.contextValue = this._contextValue;
		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	public static fromInterface(item: iPowerBIReport): PowerBIReport {
		let ret = new PowerBIReport(item);
		return ret;
	}

	public static fromJSON(jsonString: string): PowerBIReport {
		let item: iPowerBIReport = JSON.parse(jsonString);
		return PowerBIReport.fromInterface(item);
	}
}