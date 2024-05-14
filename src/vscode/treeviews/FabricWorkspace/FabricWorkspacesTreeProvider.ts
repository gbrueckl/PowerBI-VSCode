import * as vscode from 'vscode';


import { ThisExtension } from '../../../ThisExtension';

import { FabricWorkspaceTreeItem } from './FabricWorkspaceTreeItem';
import { Helper } from '../../../helpers/Helper';
import { iFabricApiWorkspace } from '../../../fabric/_types';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { FabricWorkspace } from './FabricWorkspace';
import { PowerBIConfiguration } from '../../configuration/PowerBIConfiguration';

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class FabricWorkspacesTreeProvider implements vscode.TreeDataProvider<FabricWorkspaceTreeItem> {

	private _treeView: vscode.TreeView<FabricWorkspaceTreeItem>;
	private _previousSelection: { item: FabricWorkspaceTreeItem, time: number };
	private _onDidChangeTreeData: vscode.EventEmitter<FabricWorkspaceTreeItem | undefined> = new vscode.EventEmitter<FabricWorkspaceTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<FabricWorkspaceTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView<FabricWorkspaceTreeItem>('FabricWorkspaces', {
			treeDataProvider: this,
			showCollapseAll: true,
			canSelectMany: false
			//, dragAndDropController: new PowerBIApiDragAndDropController()
		});
		this._treeView = view;
		context.subscriptions.push(view);

		view.onDidChangeSelection((event) => this._onDidChangeSelection(event.selection));

		ThisExtension.TreeViewFabric = this;
	}

	private async _onDidChangeSelection(items: readonly FabricWorkspaceTreeItem[]): Promise<void> {
	}

	async refresh(item: FabricWorkspaceTreeItem = null, showInfoMessage: boolean = false): Promise<void> {
		if (showInfoMessage) {
			Helper.showTemporaryInformationMessage('Refreshing Fabric Workspaces ...');
		}
		// on leaves, we refresh the parent instead
		if (item && item.collapsibleState == vscode.TreeItemCollapsibleState.None) {
			item = item.parent;
		}
		this._onDidChangeTreeData.fire(item);
	}

	getTreeItem(element: FabricWorkspaceTreeItem): FabricWorkspaceTreeItem {
		return element;
	}

	getParent(element: FabricWorkspaceTreeItem): vscode.ProviderResult<FabricWorkspaceTreeItem> {
		return element.parent;
	}

	async getChildren(element?: FabricWorkspaceTreeItem): Promise<FabricWorkspaceTreeItem[]> {
		if (!FabricApiService.isInitialized) {
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: FabricWorkspaceTreeItem[] = [];
			let items = await FabricApiService.getList<iFabricApiWorkspace>("/v1/workspaces");

			if (items.error) {
				vscode.window.showErrorMessage(items.error.message);
				return [];
			}

			for (let item of items.success) {
				if(PowerBIConfiguration.workspaceFilter) {
					const match = item.displayName.match(PowerBIConfiguration.workspaceFilterRegEx);
					if(!match) {
						ThisExtension.log(`Skipping workspace ${item.displayName} because it does not match the workspace filter.`);
						continue;
					}
				}
				if(item.capacityId) {
					let treeItem = new FabricWorkspace(item);
					children.push(treeItem);
				}
				else {
					ThisExtension.log("Skipping workspace '" + item.displayName + "' (" + item.id + ") because it has no capacityId");
				}
			}

			return children;
		}
	}

	// TopLevel workspace functions
	// async newNotebook(workspaceItem: FabricWorkspaceTreeItem): Promise<void> {
	// 	PowerBINotebookSerializer.openNewNotebook(workspaceItem);
	// }
}
