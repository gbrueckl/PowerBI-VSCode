import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';

import { ApiItemType } from '../_types';
import { iPowerBIWorkspaceItem } from './iPowerBIWorkspaceItem';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { TreeProviderId } from '../../../ThisExtension';
import { GenericApiTreeItem } from '../GenericApiTreeItem';

export class PowerBIWorkspaceTreeItem extends GenericApiTreeItem implements iPowerBIWorkspaceItem {
	protected _groupId: UniqueId;

	constructor(
		name: string,
		groupId: UniqueId,
		itemType: ApiItemType,
		id: UniqueId,
		parent: GenericApiTreeItem,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super("PowerBI", id, name, itemType, parent, collapsibleState);

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
}