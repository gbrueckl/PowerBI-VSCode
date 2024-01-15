import * as vscode from 'vscode';

import { PowerBIGatewayTreeItem } from './PowerBIGatewayTreeItem';
import { iPowerBIGateway, iPowerBIGatewayDatasource } from '../../../powerbi/GatewayAPI/_types';
import { PowerBIGateway } from './PowerBIGateway';
import { PowerBIGatewayDatasources } from './PowerBIGatewayDatasources';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIGatewayDatasource extends PowerBIGatewayTreeItem {

	constructor(
		definition: iPowerBIGatewayDatasource,
		parent: PowerBIGatewayDatasources
	) {
		super(definition.datasourceName, "GATEWAY", definition.id, parent, vscode.TreeItemCollapsibleState.None);
		this.definition = definition;
		
		this.tooltip = this._tooltip;
		this.iconPath = new vscode.ThemeIcon("database");
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIGatewayDatasource {
		return super.definition as iPowerBIGatewayDatasource;
	}

	set definition(value: iPowerBIGatewayDatasource) {
		super.definition = value;
	}

	// Gateway-specific funtions
}