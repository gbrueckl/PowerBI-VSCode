import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';


export interface iHandleDrop {
	handleDrop(dataTransfer: vscode.DataTransfer): Promise<void>;
}

class PowerBIObjectTransferItem extends vscode.DataTransferItem {
	constructor(private _nodes: readonly PowerBIWorkspaceTreeItem[]) {
		super(_nodes);
	}

	asObject(): readonly PowerBIWorkspaceTreeItem[] {
		return this._nodes;
	}

	asString(): Promise<string> {
		return this.value[0].toString();
	}
}

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBIWorkspacesDragAndDropController implements vscode.TreeDragAndDropController<PowerBIWorkspaceTreeItem> {

	dropMimeTypes: readonly string[] = ["application/vnd.code.tree.powerbiworkspaces", "text/uri-list"];
	dragMimeTypes: readonly string[] = ["application/vnd.code.tree.powerbiworkspaces"];

	public async handleDrag?(source: readonly PowerBIWorkspaceTreeItem[], dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
		dataTransfer.set("application/vnd.code.tree.powerbiworkspaces", new PowerBIObjectTransferItem(source));
	}

	public async handleDrop?(target: PowerBIWorkspaceTreeItem, dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
		ThisExtension.log("Dropped item on " + target.itemType + " ...");

		let uriList = await dataTransfer.get("text/uri-list");
		if(uriList != null)
		{
			ThisExtension.log(await uriList.asString());
		}

		// check if target implemnts iHandleDrop interface / has handleDrop function
		if ('handleDrop' in target) {
			(target as any as iHandleDrop).handleDrop(dataTransfer);
		}
		else
		{
			ThisExtension.log("No action defined when dropping an item on a " + target.itemType + " node!");
		}
	}
}
