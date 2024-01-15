import * as vscode from 'vscode';

import { PowerBIGatewayTreeItem } from './PowerBIGatewayTreeItem';
import { iPowerBIGateway } from '../../../powerbi/GatewayAPI/_types';
import { PowerBIGatewayDatasources } from './PowerBIGatewayDatasources';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIGateway extends PowerBIGatewayTreeItem {

	constructor(
		definition: iPowerBIGateway,
		parent: PowerBIGatewayTreeItem
	) {
		super(definition.name, "GATEWAY", definition.id, parent, vscode.TreeItemCollapsibleState.Collapsed);
		this.definition = definition;
		
		this.tooltip = this._tooltip;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIGateway {
		return super.definition as iPowerBIGateway;
	}

	set definition(value: iPowerBIGateway) {
		super.definition = value;
	}

	get apiUrlPart(): string {
		return "gateways/" + this.uid;
	}

	async getChildren(element?: PowerBIGatewayTreeItem): Promise<PowerBIGatewayTreeItem[]> {
		let children: PowerBIGatewayTreeItem[] = [];
		
		children.push(new PowerBIGatewayDatasources(this));

		return children;
	}

	// Gateway-specific funtions
}