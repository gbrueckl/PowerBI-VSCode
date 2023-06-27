import * as vscode from 'vscode';


import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIPipelineTreeItem } from './PowerBIPipelineTreeItem';
import { PowerBICommandBuilder, PowerBICommandInput } from '../../../powerbi/CommandBuilder';
import { PowerBIPipeline } from './PowerBIPipeline';
import { iPowerBIPipeline } from '../../../powerbi/PipelinesAPI/_types';
import { PowerBIApiDragAndDropController } from '../PowerBIApiDragAndDropController';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { Helper } from '../../../helpers/Helper';

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBIPipelinesTreeProvider implements vscode.TreeDataProvider<PowerBIPipelineTreeItem> {

	private _previousSelection: {item: PowerBIPipelineTreeItem, time: number};
	private _onDidChangeTreeData: vscode.EventEmitter<PowerBIPipelineTreeItem | undefined> = new vscode.EventEmitter<PowerBIPipelineTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<PowerBIPipelineTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView('PowerBIPipelines', { treeDataProvider: this, showCollapseAll: true, canSelectMany: true, dragAndDropController: new PowerBIApiDragAndDropController() });
		context.subscriptions.push(view);

		view.onDidChangeSelection((event) => this._onDidChangeSelection(event.selection));

		ThisExtension.TreeViewPipelines = this;
	}

	private async _onDidChangeSelection(items: readonly PowerBIApiTreeItem[]): Promise<void>
	{
		vscode.commands.executeCommand("PowerBI.updateQuickPickList", this);
	}
	
	async refresh(item: PowerBIPipelineTreeItem = null, showInfoMessage: boolean = false): Promise<void> {
		if (showInfoMessage) {
			Helper.showTemporaryInformationMessage('Refreshing Pipelines ...');
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
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}
			
			return children;
		}
	}

	// TopLevel Pipeline functions
	async add(): Promise<void> {
		await PowerBICommandBuilder.execute<iPowerBIPipeline>("/v1.0/myorg/pipelines", "POST",
				[
					new PowerBICommandInput("Name of new pipeline", "FREE_TEXT", "displayName", false, "The name for the new deployment pipeline"),
					new PowerBICommandInput("Description of the new pipeline Dataset", "FREE_TEXT", "description", true, "Optional. The description for the new deployment pipeline")
				]);

		await this.refresh();
	}
}
