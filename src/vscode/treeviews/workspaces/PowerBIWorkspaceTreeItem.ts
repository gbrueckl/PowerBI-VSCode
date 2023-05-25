import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';

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

	getParentByType(type: ApiItemType): PowerBIWorkspaceTreeItem {
		let parent: PowerBIWorkspaceTreeItem = this.parent;

		while (parent !== undefined && parent.itemType !== type) {
			parent = parent.parent;
		}

		return parent;
	}

	/* iDatabrickWorkspaceItem implementation */
	get groupId(): UniqueId {
		return this._groupId;
	}

	async insertCode(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            return;
        }

        const start = editor.selection.start;
        const end = editor.selection.end;
        const range = new vscode.Range(start.line, start.character, end.line, end.character);
        await editor.edit((editBuilder) => {
            editBuilder.replace(range, this.code);
        });
    }

	get code(): string {
		return Helper.trimChar("/" + this.apiPath.split("/").slice(2).join("/"), "/", false);
	}	
}