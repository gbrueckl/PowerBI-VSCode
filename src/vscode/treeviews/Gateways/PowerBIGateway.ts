import * as vscode from 'vscode';

import { PowerBIGatewayTreeItem } from './PowerBIGatewayTreeItem';
import { iPowerBIDashboard } from '../../../powerbi/DashboardsAPI/_types';
import { UniqueId } from '../../../helpers/Helper';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { iPowerBIGatewayItem } from './iPowerBIGatewayItem';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIGateway extends PowerBIGatewayTreeItem {

	constructor(
		definition: iPowerBIGatewayItem
	) {
		super(definition, undefined, vscode.TreeItemCollapsibleState.None);
	}

	// Dashboard-specific funtions
	public async delete(): Promise<void> {
		//PowerBICommandBuilder.execute<iPowerBIDashboard>(this.apiPath, "DELETE", []);
	}
}