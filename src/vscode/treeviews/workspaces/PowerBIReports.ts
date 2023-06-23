import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';


import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIReport } from './PowerBIReport';
import { iPowerBIReport } from '../../../powerbi/ReportsAPI/_types';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { iHandleDrop } from './PowerBIWorkspacesDragAndDropController';
import { ThisExtension } from '../../../ThisExtension';
import { iHandleBeingDropped } from '../PowerBIApiDragAndDropController';


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIReports extends PowerBIWorkspaceTreeItem  implements iHandleDrop, iHandleBeingDropped {

	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super("Reports", groupId, "REPORTS", groupId, parent);

		// the groupId is not unique for logical folders hence we make it unique
		super.id = groupId + "/" + this.itemType.toString();
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		return undefined;
	}

	// description is show next to the label
	get _description(): string {
		return undefined;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if(!PowerBIApiService.isInitialized) { 			
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIReport[] = [];
			let items: iPowerBIReport[] = await PowerBIApiService.getItemList<iPowerBIReport>(this.apiPath);

			for (let item of items) {
				let treeItem = new PowerBIReport(item, this.groupId, this);
				children.push(treeItem);
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}
			
			return children;
		}
	}

	// #region iHandleBeingDropped implementation
	handleBeingDropped(target: PowerBIApiTreeItem): Promise<void> {
		throw new Error('Method not implemented.');
	}
	// #endregion

	// #region iHandleDrop implementation
	public async handleDrop(dataTransfer: vscode.DataTransfer): Promise<void> {
		const transferItem = dataTransfer.get('application/vnd.code.tree.powerbiworkspaces');
		if (!transferItem) {
			ThisExtension.log("Item dropped on PowerBI Workspace Tree-View - but MimeType 'application/vnd.code.tree.powerbiworkspaces' was not found!");
			return;
		}
		const sourceItems: PowerBIWorkspaceTreeItem[] = transferItem.value;

		const source = sourceItems[0];

		if(source.id == this.id){
			return;
		}

		switch (source.itemType) {
			case "REPORT":
				const action: string = await PowerBICommandBuilder.showQuickPick([new PowerBIQuickPickItem("clone")], "Action", null, null);

				switch (action) {
					case "clone":
							await (source as PowerBIReport).clone({
								name: source.name + " - Clone",
								targetWorkspaceId: !this.groupId ? "00000000-0000-0000-0000-000000000000" : this.groupId
							});
							
							ThisExtension.TreeViewWorkspaces.refresh(this.parent.parent, false);
							break;

					default:
						ThisExtension.setStatusBar("Drag&Drop aborted!");
						ThisExtension.log("Invalid or no action selected!");
				}

				break;

			default:
				ThisExtension.log("No action defined when dropping a " + source.itemType + " on " + this.itemType + "!");
		}
	}
	// #endregion
}