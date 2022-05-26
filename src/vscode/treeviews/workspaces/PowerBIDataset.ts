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
import { iPowerBIDataset } from '../../../powerbi/DatasetsAPI/_types';


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataset extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDataset
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

	public static fromInterface(item: iPowerBIDataset): PowerBIDataset {
		let ret = new PowerBIDataset(item);
		return ret;
	}

	public static fromJSON(jsonString: string): PowerBIDataset {
		let item: iPowerBIDataset = JSON.parse(jsonString);
		return PowerBIDataset.fromInterface(item);
	}
}