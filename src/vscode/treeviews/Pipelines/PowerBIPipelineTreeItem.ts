import * as vscode from 'vscode';
import * as fspath from 'path';

import { ThisExtension } from '../../../ThisExtension';
import { UniqueId } from '../../../helpers/Helper';

import { iPowerBIPipelineItem, iPowerBIPipelineStageItem } from './iPowerBIPipelineItem';
import { ApiItemType } from '../_types';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { iPowerBIPipeline, iPowerBIPipelineStage } from '../../../powerbi/PipelinesAPI/_types';

export class PowerBIPipelineTreeItem extends PowerBIApiTreeItem implements iPowerBIPipelineItem {

	constructor(
		name: string,
		itemType: ApiItemType,
		id: UniqueId,
		parent: PowerBIPipelineTreeItem,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(id, name, itemType, parent, collapsibleState);

		super.definition = {
			name: name,
			itemType: itemType,
			id: id
		};

		super.id = this.uid as string;
		super.tooltip = this._tooltip;
		super.description = this._description;
		super.contextValue = this._contextValue;

		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		let tooltip: string = "";
		for (const [key, value] of Object.entries(this.definition)) {
			if(typeof value === "string")
			{
				if(value.length > 100)
				{
					continue;
				}
			}
			tooltip += `${key}: ${value.toString()}\n`;
		}

		return tooltip.trim();
	}

	public async getChildren(element?: PowerBIPipelineTreeItem): Promise<PowerBIPipelineTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}

	get apiPath(): string {
		return `v1.0/myorg/pipelines`;
	}

	/* iPowerBIPipelineItem implementation */
	get stages(): iPowerBIPipelineStage[] {
		return (this.definition as iPowerBIPipeline).stages;
	}

	get displayName(): string {
		return this.name;
	}
}
