import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDashboard } from '../../../powerbi/DashboardsAPI/_types';
import { UniqueId } from '../../../helpers/Helper';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDashboard extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDashboard,
		group: UniqueId
	) {
		super(definition.name, group, "DASHBOARD", definition.id, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;
		
		super.tooltip = this._tooltip;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIDashboard {
		return super.definition as iPowerBIDashboard;
	}

	set definition(value: iPowerBIDashboard) {
		this.definition = value;
	}

	// Dashboard-specific funtions
	public async delete(): Promise<void> {
		PowerBICommandBuilder.execute<iPowerBIDashboard>(this.apiPath, "DELETE", []);
	}
}