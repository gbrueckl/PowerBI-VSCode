import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';

import { ApiItemType } from '../_types';
import { iPowerBIWorkspaceItem } from './iPowerBIWorkspaceItem';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';

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

		super.definition = {
			name: name,
			group: groupId,
			itemType: itemType,
			id: id
		};
	}

	get parent(): PowerBIWorkspaceTreeItem {
		return this._parent as PowerBIWorkspaceTreeItem;
	}

	public async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}

	/* iDatabrickWorkspaceItem implementation */
	get groupId(): UniqueId {
		return this._groupId;
	}
}