import * as vscode from 'vscode';
import * as fspath from 'path';

import { ThisExtension } from '../../../ThisExtension';
import { UniqueId } from '../../../helpers/Helper';

import { iPowerBICapacityItem } from './iPowerBICapacityItem';
import { ApiItemType } from '../_types';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { iPowerBICapacity } from '../../../powerbi/CapacityAPI/_types';

export class PowerBICapacityTreeItem extends PowerBIApiTreeItem implements iPowerBICapacityItem {
	protected _definition: iPowerBICapacity;
	protected _itemType: ApiItemType;

	constructor(
		definition: iPowerBICapacity,
		parent: PowerBIApiTreeItem,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(definition.id, definition.displayName, "CAPACITY", parent, collapsibleState);

		this._definition = definition;

		super.id = this.uid as string;
		super.label = definition.displayName;
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

	public async getChildren(element?: PowerBICapacityTreeItem): Promise<PowerBICapacityTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBICapacity {
		return super.definition as iPowerBICapacity;
	}

	set definition(value: iPowerBICapacity) {
		this._definition = value;
	}

	get apiPath(): string {
		return `v1.0/myorg/capacities`;
	}

	/* iPowerBICapacityItem implementation */
	get displayName(): string {
		return this.definition.displayName;
	}

	get sku(): string {
		return this.definition.sku;
	}

	get region(): string {
		return this.definition.region;
	}

	get state(): string {
		return this.definition.state;
	}

	get admins(): string[] {
		return this.definition.admins;
	}

	get capacityUserAccessRight(): string {
		return this.definition.capacityUserAccessRight;
	}
}
