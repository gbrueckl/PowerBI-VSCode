import * as vscode from 'vscode';
import * as fspath from 'path';

import { ThisExtension } from '../../../ThisExtension';
import { unique_id } from '../../../helpers/Helper';

import { WorkspaceItemType } from './_types';
import { iPowerBIWorkspaceItem } from './iPowerBIWorkspaceItem';

export class PowerBIWorkspaceTreeItem extends vscode.TreeItem implements iPowerBIWorkspaceItem {
	protected _name: string;
	protected _group: unique_id;
	protected _item_type: WorkspaceItemType;
	protected _id: unique_id;
	protected _definition: object;

	constructor(
		name: string,
		group: unique_id,
		item_type: WorkspaceItemType,
		id: unique_id,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(name, collapsibleState);

		this._name = name;
		this._group = group;
		this._item_type = item_type;
		this._id = id;
		this._definition = {
			name: name,
			group: group,
			item_type: item_type,
			id: id
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
		return fspath.join(ThisExtension.rootPath, 'resources', theme, this.item_type.toLowerCase() + '.png');
	}	

	// command to execute when clicking the TreeItem
	readonly command = {
		command: 'PowerBI.updateQuickPickList', title: "Update QuickPick List", arguments: [this]
	};

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		let tooltip: string = "";
		for (const [key, value] of Object.entries(this.definition)) {
			if(value.length < 50)
			{
				tooltip += `${key}: ${value}\n`;
			}
		}

		return tooltip.trim();
	}

	

	// description is show next to the label
	get _description(): string {
		return this._id.toString();
	}

	// used in package.json to filter commands via viewItem == CANSTART
	get _contextValue(): string {
		return this.item_type;
	}
	
	public async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}

	/* iDatabrickWorkspaceItem implementatin */
	get name(): string {
		return this._name;
	}

	get group(): unique_id {
		return this._group;
	}

	get item_type(): WorkspaceItemType {
		return this._item_type;
	}

	get uid(): unique_id {
		return this._id;
	}

	get definition(): object {
		return this._definition;
	}

	set definition(value: object) {
		this._definition = value;
	}

	public CopyPathToClipboard(): void {
		vscode.env.clipboard.writeText(this._name);
	}

	get apiPath(): string {
		let groupPath: string = "";
		if (this.group != null && this.group != undefined)
		{
			groupPath = `/groups/${this.group}`;
		}

		if (this.uid != null && this.uid != undefined)
		{
			return `v1.0/myorg${groupPath}/${this.item_type.toString().toLowerCase()}s/${this.uid}`;
		}
		else
		{
			return `v1.0/myorg${groupPath}/${this.item_type.toString().toLowerCase()}`;
		}
	}
}