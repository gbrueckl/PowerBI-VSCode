import * as vscode from 'vscode';

import { PowerBICapacityTreeItem } from './PowerBICapacityTreeItem';
import { iPowerBICapacityItem } from './iPowerBICapacityItem';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { iPowerBICapacity, iPowerBICapacityRefreshable } from '../../../powerbi/CapacityAPI/_types';
import { ThisExtension } from '../../../ThisExtension';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBICapacityRefreshable extends PowerBICapacityTreeItem {

	constructor(
		definition: iPowerBICapacityRefreshable,
		parent: PowerBICapacityTreeItem,
	) {
		super(definition.id, definition.name, "CAPACITYREFRESHABLE", parent.capacity, parent, vscode.TreeItemCollapsibleState.None);
		this.definition = definition;
		
		this.tooltip = this._tooltip;

		this.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	protected getIconPath(theme: string): vscode.Uri {
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, this.definition.kind + '.png');
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBICapacityRefreshable {
		return super.definition as iPowerBICapacityRefreshable;
	}

	set definition(value: iPowerBICapacityRefreshable) {
		super.definition = value;
	}
}