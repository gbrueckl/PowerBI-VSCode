import * as vscode from 'vscode';


import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIGatewayTreeItem } from './PowerBIGatewayTreeItem';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIGateway } from './PowerBIGateway';
import { iPowerBIGateway } from '../../../powerbi/GatewayAPI/_types';
import { Helper } from '../../../helpers/Helper';
import { PowerBIApiDragAndDropController } from '../PowerBIApiDragAndDropController';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBIGatewaysTreeProvider implements vscode.TreeDataProvider<PowerBIGatewayTreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<PowerBIGatewayTreeItem | undefined> = new vscode.EventEmitter<PowerBIGatewayTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<PowerBIGatewayTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView('PowerBIGateways', { treeDataProvider: this, showCollapseAll: true, canSelectMany: false, dragAndDropController: new PowerBIApiDragAndDropController() });
		context.subscriptions.push(view);

		view.onDidChangeSelection((event) => this._onDidChangeSelection(event.selection));

		ThisExtension.TreeViewGateways = this;
	}

	private async _onDidChangeSelection(items: readonly PowerBIApiTreeItem[]): Promise<void> {
		if (items.length > 0) {
			vscode.commands.executeCommand("PowerBI.updateQuickPickList", items.slice(-1)[0]);
		}
	}

	async refresh(item: PowerBIGatewayTreeItem = null, showInfoMessage: boolean = false): Promise<void> {
		if (showInfoMessage) {
			Helper.showTemporaryInformationMessage('Refreshing Gateways ...');
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
		if (!PowerBIApiService.isInitialized) {
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
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}

			return children;
		}
	}

	// TopLevel Gateway functions
	add(): void {

	}
}
