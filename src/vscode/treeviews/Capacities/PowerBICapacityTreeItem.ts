import * as vscode from 'vscode';

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

	get parent(): PowerBICapacityTreeItem {
		return this._parent as PowerBICapacityTreeItem;
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
