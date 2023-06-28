import * as vscode from 'vscode';

import { PowerBICapacityTreeItem } from './PowerBICapacityTreeItem';
import { iPowerBICapacityItem } from './iPowerBICapacityItem';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { iPowerBICapacity, iPowerBICapacityRefreshable, iPowerBICapacityWorkload } from '../../../powerbi/CapacityAPI/_types';
import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBICapacityWorkload extends PowerBICapacityTreeItem {

	constructor(
		definition: iPowerBICapacityWorkload,
		parent: PowerBICapacityTreeItem,
	) {
		super(definition.name, definition.name, "CAPACITYWORKLOAD", parent.capacity, parent, vscode.TreeItemCollapsibleState.None);
		this.definition = definition;

		super.id = Helper.joinPath(parent.capacity.id, "workload", definition.name);
		
		super.tooltip = this._tooltip;
		super.description = this._description;
		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	protected getIconPath(theme: string): vscode.Uri {
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, 'workload' + '.png');
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBICapacityWorkload {
		return super.definition as iPowerBICapacityWorkload;
	}

	set definition(value: iPowerBICapacityWorkload) {
		super.definition = value;
	}

	// description is show next to the label
	get _description(): string {
		return this.definition.state + " - MaxMem %: " + this.definition.maxMemoryPercentageSetByUser;
	}
}