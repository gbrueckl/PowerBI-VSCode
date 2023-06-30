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
}