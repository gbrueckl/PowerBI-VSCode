import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { Helper, UniqueId } from '../../../helpers/Helper';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PROCESSING_TYPES, PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDatasetDMV, iPowerBIDatasetRefreshableObject } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBIDatasetTables } from './PowerBIDatasetTables';
import { PowerBIDatasetTableColumns } from './PowerBIDatasetTableColumns';
import { PowerBIDatasetTableMeasures } from './PowerBIDatasetTableMeasures';
import { PowerBIDatasetTablePartitions } from './PowerBIDatasetTablePartitions';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetTable extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDatasetDMV,
		groupId: UniqueId,
		parent: PowerBIDatasetTables
	) {
		super(definition.name, groupId, "DATASETTABLE", definition.id, parent, vscode.TreeItemCollapsibleState.Collapsed);

		this.definition = definition;

		// the groupId is not unique for logical folders hence we make it unique
		this.id = this.parent.id + "/" + definition.id;
		this.description = this._description;
		this.tooltip = this._tooltip;
		this.contextValue = this._contextValue;
		this.iconPath = this.getIcon();
	}


	// description is show next to the label
	get _description(): string {
		if ('properties' in this.definition) {
			return this.definition["properties"]["description"];
		}
		return undefined;
	}

	getIcon(): vscode.ThemeIcon {
		return new vscode.ThemeIcon("layout-panel-justify");
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = ["REFRESH"]

		return orig + actions.join(",") + ",";
	}

	get definition(): iPowerBIDatasetDMV {
		return super.definition as iPowerBIDatasetDMV;
	}

	private set definition(value: iPowerBIDatasetDMV) {
		super.definition = value;
	}

	get tableId(): number {
		return this.definition.properties["[ID]"];
	}

	get apiUrlPart(): string {
		return "";
	}

	get dataset(): PowerBIDataset {
		return (this.parent as PowerBIDatasetTables).dataset;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		let children: PowerBIWorkspaceTreeItem[] = [];

		children.push(new PowerBIDatasetTableColumns(this.groupId, this));
		children.push(new PowerBIDatasetTableMeasures(this.groupId, this));
		children.push(new PowerBIDatasetTablePartitions(this.groupId, this));

		return children;
	}

	// DatasetTable-specific funtions
	public async refresh(): Promise<void> {
		const isOnDedicatedCapacity = this.dataset.workspace.isPremiumCapacity;
		const objectToRefresh: iPowerBIDatasetRefreshableObject = { table: this.name };
		await PowerBIDataset.refreshById(this.groupId.toString(), this.dataset.id, isOnDedicatedCapacity, [objectToRefresh]);

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this.dataset, false);
	}
}