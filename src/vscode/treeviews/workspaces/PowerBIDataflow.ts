import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDataflow } from '../../../powerbi/DataflowsAPI/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataflow extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDataflow
	) {
		super(definition.name, null, "DATAFLOW", definition.id, vscode.TreeItemCollapsibleState.None);

		super.tooltip = this._tooltip;
		super.description = this._description;
		super.contextValue = this._contextValue;
		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	public static fromInterface(item: iPowerBIDataflow): PowerBIDataflow {
		let ret = new PowerBIDataflow(item);
		return ret;
	}

	public static fromJSON(jsonString: string): PowerBIDataflow {
		let item: iPowerBIDataflow = JSON.parse(jsonString);
		return PowerBIDataflow.fromInterface(item);
	}
}