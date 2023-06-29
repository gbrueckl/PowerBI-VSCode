import * as vscode from 'vscode';

import {  Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { iPowerBIDataflow } from '../../../powerbi/DataflowsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { PowerBIPipelineTreeItem } from './PowerBIPipelineTreeItem';
import { PowerBIPipelineStage } from './PowerBIPipelineStage';
import { PipelineStageArtifact, iPowerBIPipelineStage, iPowerBIPipelineStageArtifact } from '../../../powerbi/PipelinesAPI/_types';
import { PowerBIPipelineStageArtifact } from './PowerBIPipelineStageArtifact';
import { ThisExtension } from '../../../ThisExtension';



// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIPipelineStageArtifacts extends PowerBIPipelineTreeItem {
	private _pipelineId: UniqueId;
	private _stageOrder: number;
	private _items: iPowerBIPipelineStageArtifact[];

	constructor(
		pipelineId: UniqueId,
		stageOrder: number,
		artifactType: PipelineStageArtifact,
		items: iPowerBIPipelineStageArtifact[] = [],
		parent: PowerBIPipelineTreeItem
	) {
		super(Helper.toPascalCase(artifactType.replace("PIPELINESTAGE", "")), artifactType, pipelineId, parent);

		this._pipelineId = pipelineId;
		this._stageOrder = stageOrder;
		this._items = items;
		this.description = null;

		// the groupId is not unique for logical folders hence we make it unique
		super.id = pipelineId + "/" + stageOrder.toString() + "/" + artifactType;
		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
		super.contextValue = this._contextValue;
	}

	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = [
			"DEPLOYARTIFACTS"
		]

		return orig + actions.join(",") + ",";
	}

	protected getIconPath(theme: string): vscode.Uri {
		let artifactItemType: string = this.itemType.replace("PIPELINESTAGE", "");

		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, artifactItemType.toLowerCase() + '.png');
	}

	async getChildren(element?: PowerBIPipelineTreeItem): Promise<PowerBIPipelineStageArtifact[]> {
		let children: PowerBIPipelineStageArtifact[] = [];

		for (let item of this._items) {
			let treeItem = new PowerBIPipelineStageArtifact(item, this._pipelineId, 0, this.itemType as PipelineStageArtifact, this);
			children.push(treeItem);
			PowerBICommandBuilder.pushQuickPickItem(treeItem);
		}
		
		return children;
	}


	public async deployToNextStage(settings: object = undefined): Promise<void> {
		const apiUrl = this.getParentByType("PIPELINE").apiPath + "deploy";
		/*
		if (settings == undefined) // prompt user for inputs
		{
			PowerBICommandBuilder.execute<iPowerBIReport>(apiUrl, "POST",
				[
					new PowerBICommandInput("Target Dataset", "DATASET_SELECTOR", "datasetId", false, "The new dataset for the rebound report. If the dataset resides in a different workspace than the report, a shared dataset will be created in the report's workspace.")
				]);
		}
		else {
			PowerBIApiService.post(apiUrl, settings);
		}
		*/
		let body = {
			"sourceStageOrder": this.getParentByType<PowerBIPipelineStage>("PIPELINESTAGE").definition.order,
			"options": {
				"allowCreateArtifact": true,
				"allowOverwriteArtifact": true,
				"allowOverwriteTargetArtifactLabel": true,
				"allowPurgeData": true,
				"allowSkipTilesWithMissingPrerequisites": true,
				"allowTakeOver": true
			}
		}
		body[this.itemType.replace("PIPELINESTAGE", "").toLowerCase()] = this._items.map(item => ({"sourceId": item.artifactId}));
		PowerBIApiService.post(apiUrl, body);

		ThisExtension.TreeViewPipelines.refresh(this.parent, false);
	}
}