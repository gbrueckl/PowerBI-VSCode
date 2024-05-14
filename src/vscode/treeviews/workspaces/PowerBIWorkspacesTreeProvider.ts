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
import { PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDatasetRefreshableObject } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBIConfiguration } from '../../configuration/PowerBIConfiguration';

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBIWorkspacesTreeProvider implements vscode.TreeDataProvider<PowerBIWorkspaceTreeItem> {

	private _treeView: vscode.TreeView<PowerBIWorkspaceTreeItem>;
	private _previousSelection: { item: PowerBIWorkspaceTreeItem, time: number };
	private _onDidChangeTreeData: vscode.EventEmitter<PowerBIWorkspaceTreeItem | undefined> = new vscode.EventEmitter<PowerBIWorkspaceTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<PowerBIWorkspaceTreeItem | undefined> = this._onDidChangeTreeData.event;

	private _allRefreshableSameDataset: boolean = false;

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView<PowerBIWorkspaceTreeItem>('PowerBIWorkspaces', {
			treeDataProvider: this,
			showCollapseAll: true,
			canSelectMany: true,
			dragAndDropController: new PowerBIApiDragAndDropController()
		});
		this._treeView = view;
		context.subscriptions.push(view);

		view.onDidChangeSelection((event) => this._onDidChangeSelection(event.selection));

		ThisExtension.TreeViewWorkspaces = this;
	}

	private async _onDidChangeSelection(items: readonly PowerBIWorkspaceTreeItem[]): Promise<void> {
		if (items.length > 0) {
			vscode.commands.executeCommand("PowerBI.updateQuickPickList", items.slice(-1)[0]);
		}

		// if multiple different scenarios are needed, we need to create a dictionary and check each possibility
		const ItemsSupportingMultiselect = [
			"DATASETTABLE", "DATASETTABLEPARTITION"
		]
		let multiselectSupported: boolean = true;

		this._allRefreshableSameDataset = true;
		let dataset: PowerBIDataset = null;

		for (const item of items) {
			if (!("refreshableObject" in item)) {
				this._allRefreshableSameDataset = false;
			}
			if (!dataset && "dataset" in item) {
				dataset = item.dataset as PowerBIDataset;
			}
			else if (dataset && "dataset" in item && dataset.id !== (item.dataset as PowerBIDataset).id) {
				this._allRefreshableSameDataset = false;
			}
			if (!ItemsSupportingMultiselect.includes(item.itemType)) {
				multiselectSupported = false;
			}
		}

		if(items.length > 1 && !multiselectSupported) {
			vscode.window.showWarningMessage("Multiselect is only suppoted for Tables or Partitions!");
		}

		await vscode.commands.executeCommand(
			"setContext",
			"powerbi.allRefreshableSameDataset",
			this._allRefreshableSameDataset
		);
	}

	async doMultiselectAction(action: "REFRESH" | "DELETE"): Promise<void> {
		const allSupportedActions = [",REFRESH,"];

		if (action == "REFRESH") {
			if (this._allRefreshableSameDataset) {
				let refreshableObjects: iPowerBIDatasetRefreshableObject[] = [];
				let dataset = (this._treeView.selection[0].getPathItemByType<PowerBIDataset>("DATASET"));

				this._treeView.selection.forEach((item) => {
					if ("refreshableObject" in item) {
						refreshableObjects.push((item as any).refreshableObject);
					}
				}
				)

				const isOnDedicatedCapacity = dataset.workspace.isPremiumCapacity;

				await PowerBIDataset.refreshById(dataset.groupId.toString(), dataset.id, isOnDedicatedCapacity, refreshableObjects);

				await Helper.delay(1000);
				ThisExtension.TreeViewWorkspaces.refresh(dataset, false);
			}
			else {
				vscode.window.showErrorMessage("Please only select Tables or Partitions from the same dataset!");
			}
		}
		else if (action == "DELETE") {
			for(const item of this._treeView.selection) {
				if ("delete" in item) {
					await (item as any).delete();
				}
			}
		}
	}

	async refresh(item: PowerBIWorkspaceTreeItem = null, showInfoMessage: boolean = false): Promise<void> {
		if (showInfoMessage) {
			Helper.showTemporaryInformationMessage('Refreshing PowerBI Workspaces ...');
		}
		// on leaves, we refresh the parent instead
		if (item && item.collapsibleState == vscode.TreeItemCollapsibleState.None) {
			item = item.parent;
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
		if (!PowerBIApiService.isInitialized) {
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIWorkspaceTreeItem[] = [];
			let items: iPowerBIGroup[] = await PowerBIApiService.getItemList<iPowerBIGroup>("/groups");

			children.push(new PowerBIWorkspacePersonal())

			for (let item of items) {
				if(PowerBIConfiguration.workspaceFilter) {
					const match = item.name.match(PowerBIConfiguration.workspaceFilterRegEx);
					if(!match) {
						ThisExtension.log(`Skipping workspace ${item.name} because it does not match the workspace filter.`);
						continue;
					}
				}
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
