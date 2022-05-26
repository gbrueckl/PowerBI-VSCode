import * as vscode from 'vscode';
import * as fspath from 'path';
import * as fs from 'fs';

import { Helper } from '../../../helpers/Helper';
import { ThisExtension } from '../../../ThisExtension';

import { WorkspaceItemType } from './_types';
import { iPowerBIWorkspaceItem } from './iPowerBIWorkspaceItem';

import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { iPowerBIGroup } from '../../../powerbi/GroupsAPI/_types';


import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDataset } from './PowerBIDataset';
import { PowerBIDatasets } from './PowerBIDatasets';


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIWorkspace extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIGroup
	) {
		super(definition.name, null, "WORKSPACE", definition.id);

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
		return this.name;
	}

	protected getIconPath(theme: string): string {
		return fspath.join(ThisExtension.rootPath, 'resources', theme, 'directory.png');
	}

	public static fromInterface(item: iPowerBIGroup): PowerBIWorkspace {
		let ret = new PowerBIWorkspace(item);
		return ret;
	}

	public static fromJSON(jsonString: string): PowerBIWorkspace {
		let item: iPowerBIGroup = JSON.parse(jsonString);
		return PowerBIWorkspace.fromInterface(item);
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		let children: PowerBIWorkspaceTreeItem[] = [];
		
		children.push(new PowerBIDatasets(this._id));

		return children;
	}
}