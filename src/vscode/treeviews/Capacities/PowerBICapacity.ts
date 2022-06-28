import * as vscode from 'vscode';

import { PowerBICapacityTreeItem } from './PowerBICapacityTreeItem';
import { iPowerBIDashboard } from '../../../powerbi/DashboardsAPI/_types';
import { UniqueId } from '../../../helpers/Helper';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { iPowerBICapacityItem } from './iPowerBICapacityItem';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBICapacity extends PowerBICapacityTreeItem {

	constructor(
		definition: iPowerBICapacityItem,
		parent: PowerBIApiTreeItem,
	) {
		super(definition, parent, vscode.TreeItemCollapsibleState.None);
	}

	// Dashboard-specific funtions
	public async delete(): Promise<void> {
		//PowerBICommandBuilder.execute<iPowerBIDashboard>(this.apiPath, "DELETE", []);
	}
}