import * as vscode from 'vscode';

import { PowerBIPipelineTreeItem } from './PowerBIPipelineTreeItem';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIPipelineStages } from './PowerBIPipelineStages';
import { iPowerBIPipeline } from '../../../powerbi/PipelinesAPI/_types';
import { PowerBIPipelineOperations } from './PowerBIPipelineOperations';
import { Helper } from '../../../helpers/Helper';
import { ThisExtension } from '../../../ThisExtension';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIPipeline extends PowerBIPipelineTreeItem {

	constructor(
		definition: iPowerBIPipeline
	) {
		super(definition.displayName, "PIPELINE", definition.id, undefined, vscode.TreeItemCollapsibleState.Collapsed);
		this.definition = definition;
		
		super.tooltip = this._tooltip;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIPipeline {
		return super.definition as iPowerBIPipeline;
	}

	set definition(value: iPowerBIPipeline) {
		super.definition = value;
	}

	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = [
			"DELETE"
		];

		return orig + actions.join(",") + ",";
	}

	async getChildren(element?: PowerBIPipelineTreeItem): Promise<PowerBIPipelineTreeItem[]> {
		PowerBICommandBuilder.pushQuickPickItem(this);

		let children: PowerBIPipelineTreeItem[] = [];
		
		children.push(new PowerBIPipelineStages(this.uid, this));
		children.push(new PowerBIPipelineOperations(this.uid, this));

		return children;
	}

	get apiUrlPart(): string {
		return "pipelines/" + (this.id ?? this.uid);
	}

	// Pipeline-specific funtions
	public async delete(): Promise<void> {
		let confirm: string = await PowerBICommandBuilder.showInputBox("", "Confirm deletion by typeing the Pipeline name '" + this.name + "' again.", undefined, undefined);
		
		if (!confirm || confirm != this.name) {
			ThisExtension.log("Deletion of Pipeline '" + this.name + "' aborted!")
			return;
		}

		await PowerBICommandBuilder.execute(this.apiPath, "DELETE", []);

		setTimeout(() => vscode.commands.executeCommand("PowerBIPipelines.refresh", undefined, false), 1000);
	}
}