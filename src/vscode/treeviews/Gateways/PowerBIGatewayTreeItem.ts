import * as vscode from 'vscode';

import { ApiItemType } from '../_types';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { iPowerBIGateway } from '../../../powerbi/GatewayAPI/_types';
import { iPowerBIGatewayItem } from './iPowerBIGatewayItem';
import { TreeProviderId } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { UniqueId } from '../../../helpers/Helper';

export class PowerBIGatewayTreeItem extends PowerBIApiTreeItem implements iPowerBIGatewayItem {
	protected _definition: iPowerBIGatewayItem;
	protected _itemType: ApiItemType;

	constructor(
		name: string,
		itemType: ApiItemType,
		id: UniqueId,
		parent: PowerBIGatewayTreeItem,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(id, name, itemType, parent, collapsibleState);

		this.id = this.uid as string;
		this.tooltip = this._tooltip;
		this.description = this._description;
		this.contextValue = this._contextValue;

		this.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	get TreeProvider(): TreeProviderId {
		return "application/vnd.code.tree.powerbigateways";
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		let tooltip: string = "";
		for (const [key, value] of Object.entries(this.definition)) {
			if (typeof value === "string") {
				if (value.length > 100) {
					continue;
				}
			}
			tooltip += `${key}: ${value.toString()}\n`;
		}

		return tooltip.trim();
	}

	public async getChildren(element?: PowerBIGatewayTreeItem): Promise<PowerBIGatewayTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIGatewayItem {
		return super.definition as iPowerBIGatewayItem;
	}

	set definition(value: iPowerBIGatewayItem) {
		super.definition = value;
	}

	get parent(): PowerBIGatewayTreeItem {
		return this._parent as PowerBIGatewayTreeItem;
	}

	public getBrowserLink(): vscode.Uri {
		//https://app.powerbi.com/groups/me/gateways

		return vscode.Uri.joinPath(vscode.Uri.parse(PowerBIApiService.BrowserBaseUrl), 'groups', 'me', 'gateways');
	}

	/* iPowerBIGatewayItem implementation */
}
