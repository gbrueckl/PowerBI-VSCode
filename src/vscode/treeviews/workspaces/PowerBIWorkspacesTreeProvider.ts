import * as vscode from 'vscode';


import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIWorkspace } from './PowerBIWorkspace';
import { iPowerBIGroup } from '../../../powerbi/GroupsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIWorkspacePersonal } from './PowerBIWorkspacePersonal';
import { PowerBINotebookSerializer } from '../../notebook/PowerBINotebookSerializer';
import { PowerBIApiDragAndDropController } from '../PowerBIApiDragAndDropController';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { Helper } from '../../../helpers/Helper';

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBIWorkspacesTreeProvider implements vscode.TreeDataProvider<PowerBIWorkspaceTreeItem> {

	private _previousSelection: {item: PowerBIWorkspaceTreeItem, time: number};
	private _onDidChangeTreeData: vscode.EventEmitter<PowerBIWorkspaceTreeItem | undefined> = new vscode.EventEmitter<PowerBIWorkspaceTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<PowerBIWorkspaceTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView('PowerBIWorkspaces', { treeDataProvider: this, showCollapseAll: true, canSelectMany: true, dragAndDropController: new PowerBIApiDragAndDropController() });
		context.subscriptions.push(view);

		view.onDidChangeSelection((event) => this._onDidChangeSelection(event.selection));

		ThisExtension.TreeViewWorkspaces = this;
	}

	private async _onDidChangeSelection(items: readonly PowerBIApiTreeItem[]): Promise<void>
	{
		vscode.commands.executeCommand("PowerBI.updateQuickPickList", this);
	}
	
	async refresh(item: PowerBIWorkspaceTreeItem = null, showInfoMessage: boolean = false): Promise<void> {
		if (showInfoMessage) {
			Helper.showTemporaryInformationMessage('Refreshing Workspaces ...');
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
