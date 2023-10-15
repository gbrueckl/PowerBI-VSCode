import * as vscode from 'vscode';

import { PowerBIGatewayTreeItem } from './PowerBIGatewayTreeItem';
import { iPowerBIGateway } from '../../../powerbi/GatewayAPI/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIGateway extends PowerBIGatewayTreeItem {

	constructor(
		definition: iPowerBIGateway
	) {
		super(definition, undefined, vscode.TreeItemCollapsibleState.None);
		this.definition = definition;
		
		super.tooltip = this._tooltip;
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

	// Gateway-specific funtions
}