import * as vscode from 'vscode';
import * as fspath from 'path';

import { ThisExtension } from '../../../ThisExtension';
import { unique_id } from '../../../helpers/Helper';

import { iPowerBICapacityItem } from './iPowerBICapacityItem';
import { ApiItemType } from '../workspaces/_types';

export class PowerBICapacityTreeItem extends vscode.TreeItem implements iPowerBICapacityItem {
	protected _definition: iPowerBICapacityItem;
	protected _itemType: ApiItemType;

	constructor(
		definition: iPowerBICapacityItem,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(definition.displayName, collapsibleState);

		this._definition = definition;
		this._itemType = "CAPACITY";

		super.id = definition.uid.toString();
		super.label = definition.displayName;
		super.tooltip = this._tooltip;
		super.description = this._description;
		super.contextValue = this._contextValue;

		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	protected getIconPath(theme: string): string {
		return fspath.join(ThisExtension.rootPath, 'resources', theme, "capacity" + '.png');
	}	

	// command to execute when clicking the TreeItem
	readonly command = {
		command: 'PowerBI.updateQuickPickList', title: "Update QuickPick List", arguments: [this]
	};

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

	

	// description is show next to the label
	get _description(): string {
		return this.definition.uid.toString();
	}

	// used in package.json to filter commands via viewItem == CANSTART
	get _contextValue(): string {
		return "CAPACITY";
	}
	
	public async getChildren(element?: PowerBICapacityTreeItem): Promise<PowerBICapacityTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}


	/* iPowerBICapacityItem implementatin */
	get name(): string {
		return this.definition.displayName;
	}

	get displayName(): string {
		return this.definition.displayName;
	}

	get itemType(): ApiItemType {
		return this._itemType;
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

	get uid(): unique_id {
		return this.definition.uid;
	}

	get definition(): iPowerBICapacityItem {
		return this._definition;
	}

	set definition(value: iPowerBICapacityItem) {
		this._definition = value;
	}



	public CopyPathToClipboard(): void {
		vscode.env.clipboard.writeText(this.definition.displayName);
	}

	get apiPath(): string {
		return `v1.0/myorg/capacities`;
	}
}
