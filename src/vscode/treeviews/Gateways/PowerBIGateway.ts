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
		this.definition = definition;
		
		super.tooltip = this._tooltip;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIGatewayItem {
		return super.definition as iPowerBIGatewayItem;
	}

	set definition(value: iPowerBIGatewayItem) {
		super.definition = value;
	}

	// Dashboard-specific funtions
	public async delete(): Promise<void> {
		//PowerBICommandBuilder.execute<iPowerBIGatewayItem>(this.apiPath, "DELETE", []);
	}
}