import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { ApiItemType } from '../_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIWorkspaceGenericViewer extends PowerBIWorkspaceTreeItem {
	constructor(
		name: string,
		parent: PowerBIWorkspaceTreeItem,
		itemType: ApiItemType = "GENERICVIEWER",
		iconId: string = "json"
	) {
		super(name, parent.groupId, itemType, parent.id + "/" + name, parent, vscode.TreeItemCollapsibleState.None);

		// the workspaceId is not unique for logical folders hence we make it unique
		//this.id = this.workspaceId + "/" + parent.itemId + "/" + this.itemType.toString();
		this.iconPath = this.getIcon(iconId);
	}

	getIcon(iconId: string = "json"): vscode.ThemeIcon {
		return new vscode.ThemeIcon(iconId);
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		return undefined;
	}

	// description is show next to the label
	get _description(): string {
		return undefined;
	}
}
