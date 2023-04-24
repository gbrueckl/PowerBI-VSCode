import * as vscode from 'vscode';


import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIWorkspace } from './PowerBIWorkspace';
import { iPowerBIGroup } from '../../../powerbi/GroupsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIWorkspacesDragAndDropController } from './PowerBIWorkspacesDragAndDropController';
import { PowerBIWorkspacePersonal } from './PowerBIWorkspacePersonal';
import { PowerBINotebookSerializer } from '../../notebook/PowerBINotebookSerializer';

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBIWorkspacesTreeProvider implements vscode.TreeDataProvider<PowerBIWorkspaceTreeItem> {

	private _previousSelection: {item: PowerBIWorkspaceTreeItem, time: number};
	private _onDidChangeTreeData: vscode.EventEmitter<PowerBIWorkspaceTreeItem | undefined> = new vscode.EventEmitter<PowerBIWorkspaceTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<PowerBIWorkspaceTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView('PowerBIWorkspaces', { treeDataProvider: this, showCollapseAll: true, canSelectMany: true, dragAndDropController: new PowerBIWorkspacesDragAndDropController() });
		context.subscriptions.push(view);

		view.onDidChangeSelection((event) => this._onDidChangeSelection(event.selection));

		ThisExtension.TreeViewWorkspaces = this;
	}

	private async _onDidChangeSelection(items: readonly PowerBIWorkspaceTreeItem[]): Promise<void>
	{
		/*vscode.window.showInformationMessage("Preview: " + items[0].label.toString())

		let currentTime = Date.now();
		let doubleClickTime = 500;
		let preview = this._previousSelection == null || this._previousSelection == undefined
			|| this._previousSelection.item != items[0]
			|| (currentTime - this._previousSelection.time) >= doubleClickTime;
		
		if(preview)
		{
			vscode.window.showInformationMessage("Preview: " + items[0].label.toString())
		}
		else
		{
			vscode.window.showWarningMessage("Open: " + items[0].label.toString())
		}

		this._previousSelection = {item: items[0], time: currentTime};
		*/
	}
	
	refresh(showInfoMessage: boolean = false, item: PowerBIWorkspaceTreeItem = null): void {
		if (showInfoMessage) {
			vscode.window.showInformationMessage('Refreshing Workspaces ...');
		}
		this._onDidChangeTreeData.fire(item);
	}

	getTreeItem(element: PowerBIWorkspaceTreeItem): PowerBIWorkspaceTreeItem {
		return element;
	}

	getParent(element: PowerBIWorkspaceTreeItem): vscode.ProviderResult<PowerBIWorkspaceTreeItem> {
		return element.parent;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if(!PowerBIApiService.isInitialized) { 			
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIWorkspaceTreeItem[] = [];
			let items: iPowerBIGroup[] = await PowerBIApiService.getGroups();

			children.push(new PowerBIWorkspacePersonal())

			for (let item of items) {
				let treeItem = new PowerBIWorkspace(item);
				children.push(treeItem);
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}
			
			return children;
		}
	}

	// TopLevel workspace functions
	add(): void {
		
	}

	async newNotebook(workspaceItem: PowerBIWorkspaceTreeItem): Promise<void> {
		PowerBINotebookSerializer.openNewNotebook(workspaceItem);
	}
}
