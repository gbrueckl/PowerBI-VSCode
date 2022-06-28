import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBICapacityTreeItem } from './PowerBICapacityTreeItem';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBICapacity } from './PowerBICapacity';
import { iPowerBICapacityItem } from './iPowerBICapacityItem';
import { PowerBICapacitiesDragAndDropController } from './PowerBICapacitiesDragAndDropController';

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBICapacitiesTreeProvider implements vscode.TreeDataProvider<PowerBICapacityTreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<PowerBICapacityTreeItem | undefined> = new vscode.EventEmitter<PowerBICapacityTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<PowerBICapacityTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView('PowerBICapacities', { treeDataProvider: this, showCollapseAll: true, canSelectMany: true, dragAndDropController: new PowerBICapacitiesDragAndDropController() });
		context.subscriptions.push(view);

		ThisExtension.TreeViewCapacities = this;
	}
	
	refresh(showInfoMessage: boolean = false): void {
		if (showInfoMessage) {
			vscode.window.showInformationMessage('Refreshing Capacities ...');
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
		if(!PowerBIApiService.isInitialized) { 			
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBICapacity[] = [];
			let items: iPowerBICapacityItem[] = await PowerBIApiService.getCapacities();

			for (let item of items) {
				let treeItem = new PowerBICapacity(item, undefined);
				children.push(treeItem);
				//PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}
			
			return children;
		}
	}

	// TopLevel Capacity functions
	add(): void {
		
	}
}
