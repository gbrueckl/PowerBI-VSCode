import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { FabricWorkspaceTreeItem } from './FabricWorkspaceTreeItem';
import { FabricApiItemType, iFabricApiItem } from '../../../fabric/_types';
import { FabricLakehouseTables } from './FabricLakehouseTables';
import { FabricWorkspace } from './FabricWorkspace';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class FabricLakehouseTable extends FabricWorkspaceTreeItem {

	constructor(
		definition: iFabricApiItem,
		group: UniqueId,
		parent: FabricWorkspaceTreeItem
	) {
		super(definition.displayName, group, FabricApiItemType.Lakehouse, definition.id, parent, definition.description.toString(), vscode.TreeItemCollapsibleState.Collapsed);

		this.id = definition.id;
		this.definition = definition;
	}

	/* Overwritten properties from FabricApiTreeItem */
	get definition(): iFabricApiItem {
		return super.definition as iFabricApiItem;
	}

	private set definition(value: iFabricApiItem) {
		super.definition = value;
	}

	async getChildren(element?: FabricWorkspaceTreeItem): Promise<FabricWorkspaceTreeItem[]> {
		let children: FabricWorkspaceTreeItem[] = [];

		children.push(new FabricLakehouseTables(this.workspaceId, this));
		//children.push(new PowerBIDataflowDatasources(this.groupId, this));

		return children;
	}

	// Dataflow-specific funtions
	get workspace(): FabricWorkspace {
		return this.getParentByType<FabricWorkspace>(FabricApiItemType.Workspace);
	}
}