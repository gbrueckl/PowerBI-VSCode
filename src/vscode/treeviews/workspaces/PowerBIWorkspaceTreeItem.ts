import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';

import { ApiItemType } from '../_types';
import { iPowerBIWorkspaceItem } from './iPowerBIWorkspaceItem';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { TreeProviderId } from '../../../ThisExtension';

export class PowerBIWorkspaceTreeItem extends PowerBIApiTreeItem implements iPowerBIWorkspaceItem {
	protected _groupId: UniqueId;

	constructor(
		name: string,
		groupId: UniqueId,
		itemType: ApiItemType,
		id: UniqueId,
		parent: PowerBIWorkspaceTreeItem,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(id, name, itemType, parent, collapsibleState);

		this._groupId = groupId;

		this.definition = {
			name: name,
			group: groupId,
			itemType: itemType,
			id: id
		};
	}

	get TreeProvider(): TreeProviderId {
		return "application/vnd.code.tree.powerbiworkspaces";
	}

	get parent(): PowerBIWorkspaceTreeItem {
		return super.parent as PowerBIWorkspaceTreeItem;
	}

	public async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}

	/* iPowerBIWorkspaceItem implementation */
	get groupId(): UniqueId {
		return this._groupId;
	}

	public static get NO_ITEMS(): PowerBIWorkspaceTreeItem {
		let item = new PowerBIWorkspaceTreeItem("NO_ITEMS", Helper.newGuid(), "DUMMY_ITEM", Helper.newGuid(), undefined, vscode.TreeItemCollapsibleState.None);
		item.contextValue = "";
		item.description = "No workspaces found!";
		return item;
	}

	public static handleEmptyItems<PowerBIWorkspaceTreeItem>(items: PowerBIWorkspaceTreeItem[], filter: RegExp = undefined): PowerBIWorkspaceTreeItem[] {
		return super.handleEmptyItems<PowerBIWorkspaceTreeItem>(items, filter, "items");
	}
}