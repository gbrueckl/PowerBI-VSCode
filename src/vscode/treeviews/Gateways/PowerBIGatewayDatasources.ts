import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';


import { PowerBIGatewayTreeItem } from './PowerBIGatewayTreeItem';
import { PowerBIGateway } from './PowerBIGateway';
import { iPowerBIGatewayDatasource } from '../../../powerbi/GatewayAPI/_types';
import { PowerBIGatewayDatasource } from './PowerBIGatewayDatasource';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIGatewayDatasources extends PowerBIGatewayTreeItem {
	private _gatewayId: UniqueId;

	constructor(
		parent: PowerBIGateway
	) {
		super("Data Sources", "GATEWAYDATASOURCES", parent.id + "/datasources", parent, vscode.TreeItemCollapsibleState.Collapsed);

		this._gatewayId = parent.id;
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		return undefined;
	}

	// description is show next to the label
	get _description(): string {
		return undefined;
	}

	get apiUrlPart(): string {
		return "datasources";
	}

	async getChildren(element?: PowerBIGatewayTreeItem): Promise<PowerBIGatewayTreeItem[]> {
		if (!PowerBIApiService.isInitialized) {
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIGatewayTreeItem[] = [];
			let items: iPowerBIGatewayDatasource[] = await PowerBIApiService.getItemList<iPowerBIGatewayDatasource>(this.apiPath, null, "datasourceName");

			for (let item of items) {
				let treeItem = new PowerBIGatewayDatasource(item, this);
				children.push(treeItem);
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}

			return children;
		}
	}
}