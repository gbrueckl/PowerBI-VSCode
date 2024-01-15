import * as vscode from 'vscode';

import { iPowerBICapacityItem } from './iPowerBICapacityItem';
import { ApiItemType } from '../_types';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { iPowerBICapacity } from '../../../powerbi/CapacityAPI/_types';
import { TreeProviderId } from '../../../ThisExtension';
import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

export class PowerBICapacityTreeItem extends PowerBIApiTreeItem implements iPowerBICapacityItem {
	protected _capacity: iPowerBICapacity;

	constructor(
		id: string | UniqueId,
		name: string,
		itemType: ApiItemType,
		capacity: iPowerBICapacity,
		parent: PowerBIApiTreeItem,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(id, name, itemType, parent, collapsibleState);

		this._capacity = capacity;
		
		this.tooltip = this._tooltip;
		this.description = this._description;
		this.contextValue = this._contextValue;

		this.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	get TreeProvider(): TreeProviderId {
		return "application/vnd.code.tree.powerbicapacities";
	}

	public async getChildren(element?: PowerBICapacityTreeItem): Promise<PowerBICapacityTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}

	public getBrowserLink(): vscode.Uri {
		//https://app.powerbi.com/admin-portal/capacities

		return vscode.Uri.joinPath(vscode.Uri.parse(PowerBIApiService.BrowserBaseUrl), 'admin-portal', 'capacities');
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get parent(): PowerBICapacityTreeItem {
		return super.parent as PowerBICapacityTreeItem;
	}

	/* iPowerBICapacityItem implementation */
	get capacity(): iPowerBICapacity {
		return this._capacity;
	}
}
