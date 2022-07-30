import * as vscode from 'vscode';

import { PowerBIPipelineTreeItem } from './PowerBIPipelineTreeItem';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIPipelineStages } from './PowerBIPipelineStages';
import { iPowerBIPipeline } from '../../../powerbi/PipelinesAPI/_types';

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

	async getChildren(element?: PowerBIPipelineTreeItem): Promise<PowerBIPipelineTreeItem[]> {
		PowerBICommandBuilder.pushQuickPickItem(this);

		let children: PowerBIPipelineTreeItem[] = [];
		
		children.push(new PowerBIPipelineStages(this.uid, this));

		return children;
	}

	// Dashboard-specific funtions
	public async delete(): Promise<void> {
		//PowerBICommandBuilder.execute<iPowerBIGatewayItem>(this.apiPath, "DELETE", []);
	}
}