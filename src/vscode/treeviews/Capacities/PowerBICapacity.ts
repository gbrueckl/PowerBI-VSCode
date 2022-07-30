import * as vscode from 'vscode';

import { PowerBICapacityTreeItem } from './PowerBICapacityTreeItem';
import { iPowerBICapacityItem } from './iPowerBICapacityItem';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { iPowerBICapacity } from '../../../powerbi/CapacityAPI/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBICapacity extends PowerBICapacityTreeItem {

	constructor(
		definition: iPowerBICapacity,
		parent: PowerBIApiTreeItem,
	) {
		super(definition, parent, vscode.TreeItemCollapsibleState.None);
		this.definition = definition;
		
		super.tooltip = this._tooltip;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBICapacity {
		return super.definition as iPowerBICapacity;
	}

	set definition(value: iPowerBICapacity) {
		super.definition = value;
	}

	// Dashboard-specific funtions
	public async delete(): Promise<void> {
		//PowerBICommandBuilder.execute<iPowerBIDashboard>(this.apiPath, "DELETE", []);
	}
}