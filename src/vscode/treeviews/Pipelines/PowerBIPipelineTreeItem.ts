import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';

import { ApiItemType } from '../_types';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { iPowerBIPipeline, iPowerBIPipelineStage } from '../../../powerbi/PipelinesAPI/_types';

export class PowerBIPipelineTreeItem extends PowerBIApiTreeItem implements iPowerBIPipeline {

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

	public async getChildren(element?: PowerBIPipelineTreeItem): Promise<PowerBIPipelineTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}

	get parent(): PowerBIPipelineTreeItem {
		return this._parent as PowerBIPipelineTreeItem;
	}


	/* iPowerBIPipelineItem implementation */
	get stages(): iPowerBIPipelineStage[] {
		return (this.definition as iPowerBIPipeline).stages;
	}

	get displayName(): string {
		return this.name;
	}
}
