import * as vscode from 'vscode';


import { UniqueId } from '../../../helpers/Helper';
import { iPowerBIPipelineOperation, iPowerBIPipelineStage, resolveOrderShort } from '../../../powerbi/PipelinesAPI/_types';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIPipelineTreeItem } from './PowerBIPipelineTreeItem';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIPipelineOperation extends PowerBIPipelineTreeItem {

	constructor(
		definition: iPowerBIPipelineOperation,
		pipelineId: UniqueId,
		parent: PowerBIPipelineTreeItem
	) {
		super(definition.id.toString(), "PIPELINEOPERATION", pipelineId, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;
		this.label = this._label
		this.id = definition.id;
		

		this.tooltip = this._tooltip;
		this.description = this._description;

		this.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	get _label(): string {
		let dateToShow: Date = this.definition.executionStartTime ?? this.definition.lastUpdatedTime;

		return `${new Date(dateToShow).toISOString().substr(0, 19).replace('T', ' ')}`;
	}

	get _description(): string {
		let ret: string = `${resolveOrderShort(this.definition.sourceStageOrder)} -> ${resolveOrderShort(this.definition.targetStageOrder)}`;

		if(this.definition.preDeploymentDiffInformation)
		{
			ret += ` (${this.definition.preDeploymentDiffInformation.newArtifactsCount}/${this.definition.preDeploymentDiffInformation.differentArtifactsCount}/${this.definition.preDeploymentDiffInformation.noDifferenceArtifactsCount})`
		}
		
		return ret ;
	}

	protected getIconPath(theme: string): vscode.Uri {
		let status: string = this.definition.status;

		switch(status)
		{
			case "Succeeded":
				status = "completed"
				break;

			case "Executing":
				status = "running"
				break;

			case "NotStarted":
				status = "pending"
				break;
		}

		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, status + '.png');
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIPipelineOperation {
		return super.definition as iPowerBIPipelineOperation;
	}

	set definition(value: iPowerBIPipelineOperation) {
		super.definition = value;
	}

	get status(): string {
		return this.definition.status;
	}

	get success(): boolean {
		return this.definition.status == "Succeeded";
	}
}