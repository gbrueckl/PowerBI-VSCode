import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { FabricWorkspaceTreeItem } from './FabricWorkspaceTreeItem';
import { FabricApiItemType, iFabricApiItem, iFabricApiLakehouseTable } from '../../../fabric/_types';
import { FabricLakehouseTables } from './FabricLakehouseTables';
import { FabricWorkspace } from './FabricWorkspace';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class FabricLakehouseTable extends FabricWorkspaceTreeItem {
	private _tableDefinition: iFabricApiLakehouseTable;

	constructor(
		definition: iFabricApiLakehouseTable,
		workspaceId: UniqueId,
		parent: FabricWorkspaceTreeItem
	) {
		super(definition.name, workspaceId, FabricApiItemType.LakehouseTable, definition.name, parent, "", vscode.TreeItemCollapsibleState.None);

		this._tableDefinition = definition;

		this.definition = {
			"description": "",
			"displayName": definition.name,
			"id": parent.parent.itemId + "/" + definition.name,
			"type": FabricApiItemType.LakehouseTable.toString(),
			"workspaceId": workspaceId,
		};

		this.tooltip = this.getToolTip(this._tableDefinition);
		this.description = this._description;

		this.iconPath = this.getIcon();
	}

	/* Overwritten properties from FabricApiTreeItem */
	getIcon(): vscode.ThemeIcon {
		return new vscode.ThemeIcon("layout-panel-justify");
	}

	// description is show next to the label
	get _description(): string {
		if (this.tableDefinition) {
			return `${this.tableType} - ${this.tableFormat}`;
		}
	}

	// LakehouseTable-specific funtions
	get tableDefinition(): iFabricApiLakehouseTable {
		return this._tableDefinition;
	}
	get tableType(): string {
		return this.tableDefinition.type;
	}

	get tableFormat(): string {
		return this.tableDefinition.format
	}

	get tableLocation(): string {
		return this.tableDefinition.location
	}
}