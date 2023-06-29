import * as vscode from 'vscode';


import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIPipelineTreeItem } from './PowerBIPipelineTreeItem';
import { PowerBICommandBuilder, PowerBICommandInput } from '../../../powerbi/CommandBuilder';
import { PowerBIPipeline } from './PowerBIPipeline';
import { iPowerBIPipeline, iPowerBIPipelineStageArtifacts, resolveOrderShort } from '../../../powerbi/PipelinesAPI/_types';
import { PowerBIApiDragAndDropController } from '../PowerBIApiDragAndDropController';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { Helper } from '../../../helpers/Helper';
import { PowerBIPipelineStage } from './PowerBIPipelineStage';
import { iPowerBIPipelineDeployableItem } from './iPowerBIPipelineDeployableItem';

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBIPipelinesTreeProvider implements vscode.TreeDataProvider<PowerBIPipelineTreeItem> {

	private _treeView: vscode.TreeView<PowerBIApiTreeItem>;;
	private _previousSelection: { item: PowerBIPipelineTreeItem, time: number };
	private _onDidChangeTreeData: vscode.EventEmitter<PowerBIPipelineTreeItem | undefined> = new vscode.EventEmitter<PowerBIPipelineTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<PowerBIPipelineTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView('PowerBIPipelines', { treeDataProvider: this, showCollapseAll: true, canSelectMany: true, dragAndDropController: new PowerBIApiDragAndDropController() });
		context.subscriptions.push(view);
		this._treeView = view;

		view.onDidChangeSelection((event) => this._onDidChangeSelection(event.selection));

		ThisExtension.TreeViewPipelines = this;
	}

	private async _onDidChangeSelection(items: readonly PowerBIApiTreeItem[]): Promise<void> {
		vscode.commands.executeCommand("PowerBI.updateQuickPickList", items.slice(-1)[0]);

		let allDeployable: boolean = false;
		if (this._treeView.selection.every(item => "artifactIds" in item)) {
			allDeployable = true;
		}

		await vscode.commands.executeCommand(
			"setContext",
			"powerbi.deployablePipelineContentSelected",
			allDeployable
		);
	}

	async refresh(item: PowerBIPipelineTreeItem = null, showInfoMessage: boolean = false): Promise<void> {
		if (showInfoMessage) {
			Helper.showTemporaryInformationMessage('Refreshing Pipelines ...');
		}

		this._onDidChangeTreeData.fire(null);
	}

	getTreeView(): vscode.TreeView<PowerBIApiTreeItem> {
		return this._treeView;
	}

	getTreeItem(element: PowerBIPipelineTreeItem): PowerBIPipelineTreeItem {
		return element;
	}

	getParent(element: PowerBIPipelineTreeItem): vscode.ProviderResult<PowerBIPipelineTreeItem> {
		return element.parent;
	}

	async getChildren(element?: PowerBIPipelineTreeItem): Promise<PowerBIPipelineTreeItem[]> {
		if (!PowerBIApiService.isInitialized) {
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

	async deploySelection(): Promise<void> {
		const itemsSelected = this._treeView.selection;

		// first items defines the pipeline etc.
		const firstItem = itemsSelected[0] as PowerBIPipelineTreeItem;
		const firstStage = firstItem.getPathItemByType<PowerBIPipelineStage>("PIPELINESTAGE");

		if (firstStage.definition.order == 2) {
			const msg = "Cannot deploy from PROD stage!";
			ThisExtension.log(msg);
			vscode.window.showErrorMessage(msg);
			return;
		}

		const apiUrl = firstItem.getPathItemByType("PIPELINE").apiPath + "deploy";

		let body = {
			"sourceStageOrder": firstStage.definition.order,
			"options": {
				"allowCreateArtifact": true,
				"allowOverwriteArtifact": true,
				"allowOverwriteTargetArtifactLabel": true,
				"allowPurgeData": true,
				"allowSkipTilesWithMissingPrerequisites": true,
				"allowTakeOver": true
			}
		}
		let wholeStage: { [key: string]: { sourceId: string }[] } = {};

		let itemsToDeploy: { [key: string]: { sourceId: string }[] } = {};

		for (let item of itemsSelected) {
			if (item.getPathItemByType<PowerBIPipelineStage>("PIPELINESTAGE").id !== firstStage.id) {
				const msg = "All items must be from the same stage";
				ThisExtension.log(msg);
				vscode.window.showErrorMessage(msg);
				return;
			}

			if (!("artifactType" in item) || !("artifactIds" in item)) {
				const msg = "Item " + item.name + " is not deployable!";
				ThisExtension.log(msg);
			}

			let deployableItem: iPowerBIPipelineDeployableItem = item as any as iPowerBIPipelineDeployableItem;
			let artifactType = deployableItem.artifactType;

			if (item.itemType == "PIPELINESTAGE") {
				wholeStage = await (item as PowerBIPipelineStage).getDeployableItems();
			}

			// if a whole folder is selected we need to add all the items in the folder
			if (item.itemType.startsWith("PIPELINESTAGE") && item.itemType.endsWith("S")) {
				body[artifactType] = deployableItem.artifactIds;
			}

			if (!itemsToDeploy.hasOwnProperty(artifactType)) {
				itemsToDeploy[artifactType] = [];
			}

			itemsToDeploy[artifactType] = itemsToDeploy[artifactType].concat(deployableItem.artifactIds);
		}

		// the last item has priority
		// wholeSTage is set if a whole stage is selected
		// body is set directly if an itemtype/folder of a stage is selected
		// itemsToDeploy is set if a single item is selected
		body = {
			...itemsToDeploy,
			...body,
			...wholeStage
		};

		PowerBIApiService.post(apiUrl, body);

		Helper.showTemporaryInformationMessage("Deployment to stage " + (resolveOrderShort(firstStage.definition.order + 1)) + " started ...");

		this.refresh(undefined, false);
	}
}
