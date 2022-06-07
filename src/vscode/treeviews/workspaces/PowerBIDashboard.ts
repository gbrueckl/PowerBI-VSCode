import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDashboard } from '../../../powerbi/DashboardsAPI/_types';
import { unique_id } from '../../../helpers/Helper';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDashboard extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDashboard,
		group: unique_id
	) {
		super(definition.name, group, "DASHBOARD", definition.id, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;
		
		super.tooltip = this._tooltip;
	}

	// Dashboard-specific funtions
	public async delete(): Promise<void> {
		PowerBICommandBuilder.execute<iPowerBIDashboard>(this.apiPath, "DELETE", []);
	}
}