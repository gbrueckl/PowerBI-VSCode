import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';

import { ApiItemType } from '../_types';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { iPowerBIPipeline, iPowerBIPipelineStage } from '../../../powerbi/PipelinesAPI/_types';
import { TreeProviderId } from '../../../ThisExtension';

export class PowerBIPipelineTreeItem extends PowerBIApiTreeItem implements iPowerBIPipeline {

	constructor(
		name: string,
		itemType: ApiItemType,
		id: UniqueId,
		parent: PowerBIPipelineTreeItem,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(id, name, itemType, parent, collapsibleState);

		this.definition = {
			name: name,
			itemType: itemType,
			id: id
		};

		this.id = this.uid as string;
		this.tooltip = this._tooltip;
		this.description = this._description;
		this.contextValue = this._contextValue;

		this.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	get TreeProvider(): TreeProviderId {
		return "application/vnd.code.tree.powerbipipelines";
	}

	public async getChildren(element?: PowerBIPipelineTreeItem): Promise<PowerBIPipelineTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}

	get parent(): PowerBIPipelineTreeItem {
		return super.parent as PowerBIPipelineTreeItem;
	}


	/* iPowerBIPipelineItem implementation */
	get stages(): iPowerBIPipelineStage[] {
		return (this.definition as iPowerBIPipeline).stages;
	}

	get displayName(): string {
		return this.name;
	}
}
