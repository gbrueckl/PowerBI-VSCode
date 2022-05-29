import * as vscode from 'vscode';

import { Helper } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDataset } from '../../../powerbi/DatasetsAPI/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataset extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDataset
	) {
		super(definition.name, null, "DATASET", definition.id, vscode.TreeItemCollapsibleState.None);

		super.definition = definition;
		super.tooltip = this._tooltip;
		super.description = this._description;
		super.contextValue = this._contextValue;
		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	public static fromInterface(item: iPowerBIDataset): PowerBIDataset {
		let ret = new PowerBIDataset(item);
		return ret;
	}

	public static fromJSON(jsonString: string): PowerBIDataset {
		let item: iPowerBIDataset = JSON.parse(jsonString);
		return PowerBIDataset.fromInterface(item);
	}

	// ItemType-specific funtions
	public async refresh(): Promise<void> {
		PowerBIApiService.post(this.apiPath + "/refreshes", null);
	}
}