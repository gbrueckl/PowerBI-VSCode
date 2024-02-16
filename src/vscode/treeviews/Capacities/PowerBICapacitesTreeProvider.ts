import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBICapacityTreeItem } from './PowerBICapacityTreeItem';
import { PowerBICapacity } from './PowerBICapacity';
import { iPowerBICapacity } from '../../../powerbi/CapacityAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { Helper } from '../../../helpers/Helper';
import { PowerBIApiDragAndDropController } from '../PowerBIApiDragAndDropController';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBICapacitiesTreeProvider implements vscode.TreeDataProvider<PowerBICapacityTreeItem> {

	private _treeView: vscode.TreeView<PowerBICapacityTreeItem>;
	private _onDidChangeTreeData: vscode.EventEmitter<PowerBICapacityTreeItem | undefined> = new vscode.EventEmitter<PowerBICapacityTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<PowerBICapacityTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView<PowerBICapacityTreeItem>('PowerBICapacities', {
			treeDataProvider: this,
			showCollapseAll: true,
			canSelectMany: false,
			dragAndDropController: new PowerBIApiDragAndDropController()
		});
		this._treeView = view;
		context.subscriptions.push(view);

		view.onDidChangeSelection((event) => this._onDidChangeSelection(event.selection));

		ThisExtension.TreeViewCapacities = this;
	}

	private async _onDidChangeSelection(items: readonly PowerBIApiTreeItem[]): Promise<void> {
		if (items.length > 0) {
			vscode.commands.executeCommand("PowerBI.updateQuickPickList", items.slice(-1)[0]);
		}
	}

	async refresh(item: PowerBICapacityTreeItem = null, showInfoMessage: boolean = false): Promise<void> {
		if (showInfoMessage) {
			Helper.showTemporaryInformationMessage('Refreshing PowerBI Capacities ...');
		}
		// on leaves, we refresh the parent instead
		if (item && item.collapsibleState == vscode.TreeItemCollapsibleState.None) {
			item = item.parent;
		}
		this._onDidChangeTreeData.fire(null);
	}

	getTreeItem(element: PowerBICapacityTreeItem): PowerBICapacityTreeItem {
		return element;
	}

	getParent(element: PowerBICapacityTreeItem): vscode.ProviderResult<PowerBICapacityTreeItem> {
		return element;
	}

	async getChildren(element?: PowerBICapacityTreeItem): Promise<PowerBICapacityTreeItem[]> {
		if (!PowerBIApiService.isInitialized) {
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBICapacityTreeItem[] = [];
			let items: iPowerBICapacity[] = await PowerBIApiService.getCapacities();

			for (let item of items) {
				let treeItem = new PowerBICapacity(item, undefined);
				children.push(treeItem);
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}

			if (children.length == 0) {
				children.push(new PowerBICapacityTreeItem("NO_CAPACITIES_FOUND", "No Capacities found!", "CAPACITY", undefined, undefined, vscode.TreeItemCollapsibleState.None))
			}

			return children;
		}
	}

	// TopLevel Capacity functions
	add(): void {

	}
}
