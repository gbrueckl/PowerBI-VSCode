import * as vscode from 'vscode';


import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIWorkspace } from './PowerBIWorkspace';
import { iPowerBIGroup } from '../../../powerbi/GroupsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIWorkspacesDragAndDropController } from './PowerBIWorkspacesDragAndDropController';

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBIWorkspacesTreeProvider implements vscode.TreeDataProvider<PowerBIWorkspaceTreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<PowerBIWorkspaceTreeItem | undefined> = new vscode.EventEmitter<PowerBIWorkspaceTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<PowerBIWorkspaceTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView('PowerBIWorkspaces', { treeDataProvider: this, showCollapseAll: true, canSelectMany: true, dragAndDropController: new PowerBIWorkspacesDragAndDropController() });
		context.subscriptions.push(view);

		ThisExtension.TreeViewWorkspaces = view;
	}
	
	refresh(showInfoMessage: boolean = false): void {
		if (showInfoMessage) {
			vscode.window.showInformationMessage('Refreshing Workspaces ...');
		}
		this._onDidChangeTreeData.fire(null);
	}

	getTreeItem(element: PowerBIWorkspaceTreeItem): PowerBIWorkspaceTreeItem {
		return element;
	}

	getParent(element: PowerBIWorkspaceTreeItem): vscode.ProviderResult<PowerBIWorkspaceTreeItem> {
		return element;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if(!PowerBIApiService.isInitialized) { 			
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIWorkspace[] = [];
			let items: iPowerBIGroup[] = await PowerBIApiService.getGroups();

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
}
