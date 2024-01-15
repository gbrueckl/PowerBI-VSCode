import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDashboard } from '../../../powerbi/DashboardsAPI/_types';
import { UniqueId } from '../../../helpers/Helper';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { ThisExtension } from '../../../ThisExtension';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDashboard extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDashboard,
		group: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super(definition.displayName, group, "DASHBOARD", definition.id, parent, vscode.TreeItemCollapsibleState.None);

		this.name = definition.displayName;
		this.definition = definition;
		
		this.tooltip = this._tooltip;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIDashboard {
		return super.definition as iPowerBIDashboard;
	}

	private set definition(value: iPowerBIDashboard) {
		super.definition = value;
	}

	// Dashboard-specific funtions
	public async delete(): Promise<void> {
		await PowerBIApiTreeItem.delete(this, "yesNo");
		
		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}
}