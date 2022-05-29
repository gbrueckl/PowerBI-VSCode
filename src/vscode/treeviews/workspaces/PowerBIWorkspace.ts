import * as vscode from 'vscode';
import * as fspath from 'path';

import { Helper } from '../../../helpers/Helper';
import { ThisExtension } from '../../../ThisExtension';

import { iPowerBIGroup } from '../../../powerbi/GroupsAPI/_types';
import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDatasets } from './PowerBIDatasets';
import { PowerBIReports } from './PowerBIReports';
import { PowerBIDashboards } from './PowerBIDashboards';
import { PowerBIDataflows } from './PowerBIDataflows';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIWorkspace extends PowerBIWorkspaceTreeItem {
	constructor(
		definition: iPowerBIGroup
	) {
		super(definition.name, null, "GROUP", definition.id);

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
		
		children.push(new PowerBIDatasets(this._id.toString()));
		children.push(new PowerBIReports(this._id.toString()));
		children.push(new PowerBIDashboards(this._id.toString()));
		children.push(new PowerBIDataflows(this._id.toString()));

		return children;
	}
}