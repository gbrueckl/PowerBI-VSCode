import * as vscode from 'vscode';
import * as fspath from 'path';

import { UniqueId } from '../../helpers/Helper';

import { ApiItemType } from './_types';
import { iPowerBIApiItem } from './iPowerBIApiItem';
import { ThisExtension } from '../../ThisExtension';


export class PowerBIApiTreeItem extends vscode.TreeItem implements iPowerBIApiItem {
	protected _itemType: ApiItemType;
	protected _id: UniqueId;
	protected _name: string;
	protected _definition: object;
	protected _parent?: PowerBIApiTreeItem;

	constructor(
		id: UniqueId,
		name: string,
		itemType: ApiItemType,
		parent: PowerBIApiTreeItem = undefined,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(name, collapsibleState);

		this._name = name;
		this._itemType = itemType;
		this._id = id;
		this._parent = parent;

		this._definition = {
			name: name,
			itemType: itemType,
			uid: id
		};



		super.id = id.toString();
		super.label = this.name;
		super.tooltip = this._tooltip;
		super.description = this._description;
		super.contextValue = this._contextValue;

		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	protected getIconPath(theme: string): string {
		return fspath.join(ThisExtension.rootPath, 'resources', theme, this.itemType.toLowerCase() + '.png');
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
		return this._id.toString();
	}

	// used in package.json to filter commands via viewItem == CANSTART
	get _contextValue(): string {
		return this.itemType;
	}
	
	public async getChildren(element?: PowerBIApiTreeItem): Promise<PowerBIApiTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}

	/* iDatabrickWorkspaceItem implementatin */
	get definition(): object {
		return this._definition;
	}

	set definition(value: object) {
		this._definition = value;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get itemType(): ApiItemType {
		return this._itemType;
	}

	get uid() {
		return this._id;
	}

	get parent(): PowerBIApiTreeItem {
		return this._parent;
	}

	public CopyPathToClipboard(): void {
		vscode.env.clipboard.writeText(this._name);
	}

	get apiPath(): string {
		if (this.uid != null && this.uid != undefined)
		{
			return `v1.0/myorg/${this.itemType.toString().toLowerCase()}s/${this.uid}`;
		}
		else
		{
			return `v1.0/myorg/${this.itemType.toString().toLowerCase()}`;
		}
	}
}