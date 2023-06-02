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
		super.label = this._label
		super.id = definition.id;
		

		super.tooltip = this._tooltip;
		super.description = this._description;

		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	get _label(): string {
		let dateToShow: Date = this.definition.executionStartTime;

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



	// PipelineOperation-specific funtions

	/*
	public async delete(): Promise<void> {
		await PowerBICommandBuilder.execute<iPowerBIDataflow>(this.apiPath, "DELETE", []);
		
		ThisExtension.TreeViewWorkspaces.refresh(false, this.parent);
	}

	public async refresh(): Promise<void> {
		PowerBIApiService.post(this.apiPath + "/refreshes", null);
	}

	public async deployToNextStage(settings: object = undefined): Promise<void> {
		const apiUrl = this.parent.apiPath + "/deployAll";
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
		
		const body = {
			"sourceStageOrder": this.order,
		}
		PowerBIApiService.post(apiUrl, body);

		ThisExtension.TreeViewPipelines.refresh(this.parent, false);
	}
	*/
}