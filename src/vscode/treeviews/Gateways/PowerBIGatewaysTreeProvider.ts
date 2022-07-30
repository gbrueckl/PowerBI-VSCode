import * as vscode from 'vscode';


import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIGatewayTreeItem } from './PowerBIGatewayTreeItem';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIGateway } from './PowerBIGateway';
import { PowerBIGatewaysDragAndDropController } from './PowerBIGatewaysDragAndDropController';
import { iPowerBIGateway } from '../../../powerbi/GatewayAPI/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBIGatewaysTreeProvider implements vscode.TreeDataProvider<PowerBIGatewayTreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<PowerBIGatewayTreeItem | undefined> = new vscode.EventEmitter<PowerBIGatewayTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<PowerBIGatewayTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView('PowerBIGateways', { treeDataProvider: this, showCollapseAll: true, canSelectMany: true, dragAndDropController: new PowerBIGatewaysDragAndDropController() });
		context.subscriptions.push(view);

		ThisExtension.TreeViewGateways = this;
	}
	
	refresh(showInfoMessage: boolean = false): void {
		if (showInfoMessage) {
			vscode.window.showInformationMessage('Refreshing Gateways ...');
		}
		this._onDidChangeTreeData.fire(null);
	}

	getTreeItem(element: PowerBIGatewayTreeItem): PowerBIGatewayTreeItem {
		return element;
	}

	getParent(element: PowerBIGatewayTreeItem): vscode.ProviderResult<PowerBIGatewayTreeItem> {
		return element;
	}

	async getChildren(element?: PowerBIGatewayTreeItem): Promise<PowerBIGatewayTreeItem[]> {
		if(!PowerBIApiService.isInitialized) { 			
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIGateway[] = [];
			let items: iPowerBIGateway[] = await PowerBIApiService.getGateways();

			for (let item of items) {
				let treeItem = new PowerBIGateway(item);
				children.push(treeItem);
				//PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}
			
			return children;
		}
	}

	// TopLevel Gateway functions
	add(): void {
		
	}
}
