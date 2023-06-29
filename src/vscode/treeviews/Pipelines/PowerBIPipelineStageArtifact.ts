import * as vscode from 'vscode';


import { Helper, UniqueId } from '../../../helpers/Helper';
import { PipelineStageArtifact, iPowerBIPipelineStage, iPowerBIPipelineStageArtifact, resolveOrder, resolveOrderShort } from '../../../powerbi/PipelinesAPI/_types';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIPipelineTreeItem } from './PowerBIPipelineTreeItem';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PipelineStage } from '../../../powerbi/SwaggerAPI';
import { PowerBIPipelineStage } from './PowerBIPipelineStage';
import { iPowerBIPipelineDeployableItem } from './iPowerBIPipelineDeployableItem';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIPipelineStageArtifact extends PowerBIPipelineTreeItem implements iPowerBIPipelineDeployableItem {
	private _artifactType: PipelineStageArtifact;

	constructor(
		definition: iPowerBIPipelineStageArtifact,
		pipelineId: UniqueId,
		stageOrder: number,
		artifactType: PipelineStageArtifact,
		parent: PowerBIPipelineTreeItem
	) {
		super(definition.artifactName ?? definition.artifactDisplayName, artifactType, pipelineId, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;
		this._artifactType = artifactType;
		super.id = definition.artifactId;

		super.tooltip = this._tooltip;
		super.description = this.definition.artifactId;

		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
		super.contextValue = this._contextValue;
	}

	protected getIconPath(theme: string): vscode.Uri {
		let artifactItemType: string = Helper.trimChar(this.itemType.replace("PIPELINESTAGE", ""), "S", false, true);

		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, artifactItemType.toLowerCase() + '.png');
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = [
			"DEPLOYARTIFACT"
		]

		return orig + actions.join(",") + ",";
	}

	get definition(): iPowerBIPipelineStageArtifact {
		return super.definition as iPowerBIPipelineStageArtifact;
	}

	set definition(value: iPowerBIPipelineStageArtifact) {
		super.definition = value;
	}

	// properties of iPowerBIPipelineDeployableItem
	get artifactIds(): { sourceId: string }[] {
		return [{ "sourceId": this.id }];
	}
	get artifactType(): string {
		return this.itemType.replace("PIPELINESTAGE", "").toLowerCase() + "s";
	}

	async getDeployableItems(): Promise<{ [key: string]: { sourceId: string }[] }> {
		let obj = {};
		obj[this.artifactType] = this.artifactIds;
		return obj;
	}

	// Pipelinestage-specific funtions

	/*
	public async delete(): Promise<void> {
		await PowerBICommandBuilder.execute<iPowerBIDataflow>(this.apiPath, "DELETE", []);
		
		ThisExtension.TreeViewWorkspaces.refresh(false, this.parent);
	}

	public async refresh(): Promise<void> {
		PowerBIApiService.post(this.apiPath + "/refreshes", null);
	}
	*/

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
		body[this.itemType.replace("PIPELINESTAGE", "").toLowerCase()] = [{ "sourceId": this.definition.artifactId }];
		PowerBIApiService.post(apiUrl, body);

		ThisExtension.TreeViewPipelines.refresh(this.parent, false);
	}
}