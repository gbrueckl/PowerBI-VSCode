import * as vscode from 'vscode';

import { UniqueId } from '../../helpers/Helper';

import { ApiItemType } from './_types';
import { iPowerBIApiItem } from './iPowerBIApiItem';
import { ThisExtension } from '../../ThisExtension';
import { ApiUrlPair } from '../../powerbi/_types';
import { PowerBIApiService } from '../../powerbi/PowerBIApiService';


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

		super.id = (id as string);
		super.label = this.name;
		super.tooltip = this._tooltip;
		super.description = this._description;
		super.contextValue = this._contextValue;

		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	protected getIconPath(theme: string): vscode.Uri {
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, this.itemType.toLowerCase() + '.png');
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

	// used in package.json to filter commands via viewItem =~ /.*,GROUP,.*/
	get _contextValue(): string {
		return "," + this.itemType + ",";
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

	get apiUrlPart(): string {
		if(this.itemType.endsWith("S"))
		{
			return this.itemType.toLowerCase();
		}
		if(this.uid)
		{
			return this.uid.toString();
		}
		return this.id;
	}

	get apiUrlPair(): ApiUrlPair {
		return {itemType: this.itemType, itemId: this.id};
	}

	get apiPath(): string {

		let urlParts: string[] = [];

		let apiItem: PowerBIApiTreeItem = this;

		while(apiItem)
		{
			if(apiItem.apiUrlPart)
			{
				urlParts.push(apiItem.apiUrlPart)
			}
			apiItem = apiItem.parent;
		}
		urlParts.push(PowerBIApiService.Org)
		urlParts = urlParts.filter(x => x.length > 0)

		return `v1.0/${urlParts.reverse().join("/")}/`;
	}
}