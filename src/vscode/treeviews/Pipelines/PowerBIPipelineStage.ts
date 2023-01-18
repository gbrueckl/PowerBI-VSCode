import * as vscode from 'vscode';


import { UniqueId } from '../../../helpers/Helper';
import { iPowerBIPipelineStage } from '../../../powerbi/PipelinesAPI/_types';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIPipelineTreeItem } from './PowerBIPipelineTreeItem';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIPipelineStage extends PowerBIPipelineTreeItem {

	constructor(
		definition: iPowerBIPipelineStage,
		pipelineId: UniqueId,
		parent: PowerBIPipelineTreeItem
	) {
		super(definition.order.toString(), "PIPELINESTAGE", pipelineId, parent, vscode.TreeItemCollapsibleState.None);

		super.label = this.getLabel(definition);
		super.id = definition.order.toString() + "/" + definition.workspaceId;
		this.definition = definition;

		super.tooltip = this._tooltip;
		super.description = null;

		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	protected getIconPath(theme: string): vscode.Uri {
		let stage: string;
		switch (this.definition.order) {
			case 0:
				stage = "_dev";
				break;
			case 1:
				stage = "_test";
				break;
			case 2: 
				stage = "_prod";
				break;
			default:
				return;
		}
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, this.itemType.toLowerCase() + stage + '.png');
	}	

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIPipelineStage {
		return super.definition as iPowerBIPipelineStage;
	}

	set definition(value: iPowerBIPipelineStage) {
		super.definition = value;
	}

	// Pipelinestage-specific funtions
	private getLabel(definition: iPowerBIPipelineStage): string {
		let ret: string = "";
		switch (definition.order) {
			case 0:
				ret = "Development";
				break;
			case 1:
				ret = "Test";
				break;
			case 2: 
				ret = "Production";
				break;
			default: 
				ret = "NO_NAME_DEFINED";
		}

		return ret + ": " + definition.workspaceName;
	}
	/*
	public async delete(): Promise<void> {
		await PowerBICommandBuilder.execute<iPowerBIDataflow>(this.apiPath, "DELETE", []);
		
		ThisExtension.TreeViewWorkspaces.refresh(false, this.parent);
	}

	public async refresh(): Promise<void> {
		PowerBIApiService.post(this.apiPath + "/refreshes", null);
	}
	*/
}