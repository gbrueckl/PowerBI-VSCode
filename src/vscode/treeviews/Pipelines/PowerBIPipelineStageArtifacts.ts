import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { iPowerBIDataflow } from '../../../powerbi/DataflowsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { PowerBIPipelineTreeItem } from './PowerBIPipelineTreeItem';
import { PowerBIPipelineStage } from './PowerBIPipelineStage';
import { PipelineStageArtifact, iPowerBIPipelineStage, iPowerBIPipelineStageArtifact } from '../../../powerbi/PipelinesAPI/_types';
import { PowerBIPipelineStageArtifact } from './PowerBIPipelineStageArtifact';
import { ThisExtension } from '../../../ThisExtension';
import { iPowerBIPipelineDeployableItem } from './iPowerBIPipelineDeployableItem';



// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIPipelineStageArtifacts extends PowerBIPipelineTreeItem implements iPowerBIPipelineDeployableItem {
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
		this.id = pipelineId + "/" + stageOrder.toString() + "/" + artifactType;
		this.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
		this.contextValue = this._contextValue;
	}

	protected getIconPath(theme: string): vscode.Uri {
		let artifactItemType: string = this.itemType.replace("PIPELINESTAGE", "");

		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, artifactItemType.toLowerCase() + '.png');
	}

	async getChildren(element?: PowerBIPipelineTreeItem): Promise<PowerBIPipelineStageArtifact[]> {
		let children: PowerBIPipelineStageArtifact[] = [];

		for (let item of this._items) {
			let treeItem = new PowerBIPipelineStageArtifact(item, this._pipelineId, 0, Helper.trimChar(this.itemType, "S", false, true) as PipelineStageArtifact, this);
			children.push(treeItem);
			PowerBICommandBuilder.pushQuickPickItem(treeItem);
		}

		return children;
	}

	// properties of iPowerBIPipelineDeployableItem
	get artifactIds(): { sourceId: string }[] {
		return this._items.map((item) => { return { "sourceId": item.artifactId } });
	}
	get artifactType(): string {
		return this.itemType.replace("PIPELINESTAGE", "").toLowerCase();
	}

	async getDeployableItems(): Promise<{ [key: string]: { sourceId: string }[] }> {
		let obj = {};
		obj[this.artifactType] = this.artifactIds;
		return obj;
	}
}