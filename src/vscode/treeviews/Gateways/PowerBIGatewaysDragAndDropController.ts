import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';

import { PowerBIGatewayTreeItem } from './PowerBIGatewayTreeItem';


export interface iHandleDrop {
	handleDrop(dataTransfer: vscode.DataTransfer): Promise<void>;
}

class PowerBIObjectTransferItem extends vscode.DataTransferItem {
	constructor(private _nodes: readonly PowerBIGatewayTreeItem[]) {
		super(_nodes);
	}

	asObject(): readonly PowerBIGatewayTreeItem[] {
		return this._nodes;
	}

	asString(): Promise<string> {
		return this.value[0].toString();
	}
}

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBIGatewaysDragAndDropController implements vscode.TreeDragAndDropController<PowerBIGatewayTreeItem> {

	dropMimeTypes: readonly string[] = ["application/vnd.code.tree.powerbigateways", "text/uri-list"];
	dragMimeTypes: readonly string[] = ["application/vnd.code.tree.powerbigateways"];


	public async handleDrag?(source: readonly PowerBIGatewayTreeItem[], dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
		//dataTransfer.set("application/vnd.code.tree.powerbiGateways", new PowerBIObjectTransferItem(source));
	}

	public async handleDrop?(target: PowerBIGatewayTreeItem, dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
		ThisExtension.log("Dropped item on " + target.itemType + " ...");

		ThisExtension.log(await dataTransfer.get("text/uri-list").asString());

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
