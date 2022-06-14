import * as vscode from 'vscode';
import * as fspath from 'path';

import { ThisExtension } from '../../../ThisExtension';
import { UniqueId } from '../../../helpers/Helper';

import { iPowerBIGatewayItem } from './iPowerBIGatewayItem';
import { ApiItemType } from '../_types';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';

export class PowerBIGatewayTreeItem extends PowerBIApiTreeItem implements iPowerBIGatewayItem {
	protected _definition: iPowerBIGatewayItem;
	protected _itemType: ApiItemType;

	constructor(
		definition: iPowerBIGatewayItem,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(definition.id, definition.name, "GATEWAY", collapsibleState);

		this._definition = definition;

		super.id = this.uid as string;
		super.tooltip = this._tooltip;
		super.description = this._description;
		super.contextValue = this._contextValue;

		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		let tooltip: string = "";
		for (const [key, value] of Object.entries(this.definition)) {
			if(typeof value === "string")
			{
				if(value.length > 100)
				{
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
		this._definition = value;
	}

	get apiPath(): string {
		return `v1.0/myorg/gateways`;
	}

	/* iPowerBIGatewayItem implementation */
	get type(): string {
		return this.definition.type;
	}

	get publicKey(): object {
		return this.definition.publicKey;
	}
}
