import * as vscode from 'vscode';


import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIPipelineTreeItem } from './PowerBIPipelineTreeItem';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIPipeline } from './PowerBIPipeline';
import { iPowerBIPipelineItem } from './iPowerBIPipelineItem';
import { PowerBIPipelinesDragAndDropController } from './PowerBIPipelineDragAndDropController';
import { iPowerBIPipeline } from '../../../powerbi/PipelinesAPI/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBIPipelinesTreeProvider implements vscode.TreeDataProvider<PowerBIPipelineTreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<PowerBIPipelineTreeItem | undefined> = new vscode.EventEmitter<PowerBIPipelineTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<PowerBIPipelineTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView('PowerBIPipelines', { treeDataProvider: this, showCollapseAll: true, canSelectMany: true, dragAndDropController: new PowerBIPipelinesDragAndDropController() });
		context.subscriptions.push(view);

		ThisExtension.TreeViewPipelines = this;
	}
	
	refresh(showInfoMessage: boolean = false): void {
		if (showInfoMessage) {
			vscode.window.showInformationMessage('Refreshing Pipelines ...');
		}
		this._onDidChangeTreeData.fire(null);
	}

	getTreeItem(element: PowerBIPipelineTreeItem): PowerBIPipelineTreeItem {
		return element;
	}

	getParent(element: PowerBIPipelineTreeItem): vscode.ProviderResult<PowerBIPipelineTreeItem> {
		return element;
	}

	async getChildren(element?: PowerBIPipelineTreeItem): Promise<PowerBIPipelineTreeItem[]> {
		if(!PowerBIApiService.isInitialized) { 			
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIPipeline[] = [];
			let items: iPowerBIPipeline[] = await PowerBIApiService.getPipelines();

			for (let item of items) {
				let treeItem = new PowerBIPipeline(item);
				children.push(treeItem);
				//PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}
			
			return children;
		}
	}

	// TopLevel Pipeline functions
	add(): void {
		
	}
}
