import * as vscode from 'vscode';
import * as fspath from 'path';

import { ThisExtension } from '../../../ThisExtension';
import { UniqueId } from '../../../helpers/Helper';

import { ApiItemType } from '../_types';
import { iPowerBIWorkspaceItem } from './iPowerBIWorkspaceItem';
import { iPowerBIApiItem } from '../iPowerBIApiItem';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';

export class PowerBIWorkspaceTreeItem extends PowerBIApiTreeItem implements iPowerBIApiItem, iPowerBIWorkspaceItem {
	protected _group: UniqueId;

	constructor(
		name: string,
		group: UniqueId,
		itemType: ApiItemType,
		id: UniqueId,
		parent: PowerBIApiTreeItem,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(id, name, itemType, parent, collapsibleState);

		this._group = group;

		super.definition = {
			name: name,
			group: group,
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

	/* Overwritten properties from PowerBIApiTreeItem */
	get apiPath(): string {
		let groupPath: string = "";
		if (this.group != null && this.group != undefined && this.itemType != "GROUP")
		{
			groupPath = `/groups/${this.group}`;
		}

		if (this.uid != null && this.uid != undefined)
		{
			return `v1.0/myorg${groupPath}/${this.itemType.toString().toLowerCase()}s/${this.uid}`;
		}
		else
		{
			return `v1.0/myorg${groupPath}/${this.itemType.toString().toLowerCase()}`;
		}
	}

	/* iDatabrickWorkspaceItem implementatin */
	get group(): UniqueId {
		return this._group;
	}
}