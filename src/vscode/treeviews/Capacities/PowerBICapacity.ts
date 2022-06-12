import * as vscode from 'vscode';

import { PowerBICapacityTreeItem } from './PowerBICapacityTreeItem';
import { iPowerBIDashboard } from '../../../powerbi/DashboardsAPI/_types';
import { unique_id } from '../../../helpers/Helper';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { iPowerBICapacityItem } from './iPowerBICapacityItem';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBICapacity extends PowerBICapacityTreeItem {

	constructor(
		definition: iPowerBICapacityItem
	) {
		super(definition, vscode.TreeItemCollapsibleState.None);
	}

	// Dashboard-specific funtions
	public async delete(): Promise<void> {
		//PowerBICommandBuilder.execute<iPowerBIDashboard>(this.apiPath, "DELETE", []);
	}
}