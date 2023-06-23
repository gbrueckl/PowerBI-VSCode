import * as vscode from 'vscode';

import { ThisExtension } from '../../ThisExtension';

import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../powerbi/CommandBuilder';
import { PowerBIApiTreeItem } from './PowerBIApiTreeItem';


export interface iHandleBeingDropped {
	handleBeingDropped(target: PowerBIApiTreeItem): Promise<void>;
}

class PowerBIObjectTransferItem extends vscode.DataTransferItem {
	constructor(private _nodes: readonly PowerBIApiTreeItem[]) {
		super(_nodes);
	}

	asObject(): readonly PowerBIApiTreeItem[] {
		return this._nodes;
	}

	asString(): Promise<string> {
		return this.value[0].toString();
	}
}

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBIApiDragAndDropController implements vscode.TreeDragAndDropController<PowerBIApiTreeItem> {

	dropMimeTypes: readonly string[] = ThisExtension.TreeProviderIds.map((x) => x.toString()).concat([ 
		"text/uri-list" // to support drag and drop from the file explorer (not yet working)
		]);
	dragMimeTypes: readonly string[] = ThisExtension.TreeProviderIds.map((x) => x.toString());

	public async handleDrag?(source: readonly PowerBIApiTreeItem[], dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
		dataTransfer.set("application/vnd.code.tree.powerbiworkspaces", new PowerBIObjectTransferItem(source));
		dataTransfer.set("powerbiapidragdrop", new PowerBIObjectTransferItem(source));
	}

	public async handleDrop?(target: PowerBIApiTreeItem, dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
		ThisExtension.log("Dropped item on " + target.itemType + " ...");

		let uriList = await dataTransfer.get("text/uri-list");
		if(uriList != null)
		{
			ThisExtension.log(await uriList.asString());
		}

		const transferItem = dataTransfer.get('powerbiapidragdrop');

		if (!transferItem) {
			ThisExtension.log("Item dropped on PowerBI Workspace Tree-View - but MimeType 'application/vnd.code.tree.powerbiworkspaces' was not found!");
			return;
		}

		const sourceItems: PowerBIApiTreeItem[] = transferItem.value;
		const source = sourceItems[0];

		// check if target implemnts iHandleDrop interface / has handleDrop function
		if ('handleBeingDropped' in source) {
			(source as any as iHandleBeingDropped).handleBeingDropped(target);
		}
		else
		{
			ThisExtension.log("No action defined when dropping an '" + source.itemType + "' on a '" + target.itemType + "' node!");
		}
	}
}
