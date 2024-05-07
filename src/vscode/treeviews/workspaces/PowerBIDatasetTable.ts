import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { Helper, UniqueId } from '../../../helpers/Helper';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDatasetColumnStatistics, iPowerBIDatasetDMV, iPowerBIDatasetRefreshableObject } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBIDatasetTables } from './PowerBIDatasetTables';
import { PowerBIDatasetTableColumns } from './PowerBIDatasetTableColumns';
import { PowerBIDatasetTableMeasures } from './PowerBIDatasetTableMeasures';
import { PowerBIDatasetTablePartitions } from './PowerBIDatasetTablePartitions';
import { PowerBIApiDrop, PowerBIDaxDrop, PowerBITmslDrop } from '../../dropProvider/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetTable extends PowerBIWorkspaceTreeItem implements PowerBIDaxDrop, PowerBITmslDrop, PowerBIApiDrop{
	private _columnStatistics: iPowerBIDatasetColumnStatistics[] = [];

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

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		let tooltip: string = "";
		if ("properties" in this.definition) {
			for (const [key, value] of Object.entries(this.definition?.properties)) {
				if (typeof value === "string") {
					if (value.length > 100) {
						continue;
					}
				}
				tooltip += `${key}: ${JSON.stringify(value, null, 4)}\n`;
			}
		}

		return tooltip.trim();
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

		let actions: string[] = ["LOADSTATISTICS"];

		if (this.dataset.workspace.isPremiumCapacity && this.dataset.definition.isRefreshable) {
			actions.push("REFRESH");
		}

		return orig + actions.join(",") + ",";
	}

	get definition(): iPowerBIDatasetDMV {
		return super.definition as iPowerBIDatasetDMV;
	}

	private set definition(value: iPowerBIDatasetDMV) {
		super.definition = value;
	}

	get tableId(): number {
		return this.definition.properties["ID"];
	}

	get apiUrlPart(): string {
		return "";
	}

	get dataset(): PowerBIDataset {
		return (this.parent as PowerBIDatasetTables).dataset;
	}

	get code(): string {
		return JSON.stringify(this.refreshableObject, null, 4)
	}

	getColumnStatistic(columnName: string): iPowerBIDatasetColumnStatistics {
		const stats = this._columnStatistics.find((item) => item.columnName == columnName);

		if (stats) {
			return stats;
		}
		return {} as iPowerBIDatasetColumnStatistics;
	}

	async loadColumnStatistics(): Promise<void> {
		try {
			const columnStats = await PowerBIApiService.getDMV(this.apiPath, "COLUMNSTATISTICS", `[Table Name] = "${this.name}"`, "Column Name");

			this._columnStatistics = [];

			for (let stats of columnStats) {
				this._columnStatistics.push({
					tableName: stats.properties["Table Name"],
					columnName: stats.properties["Column Name"],
					minValue: stats.properties["Min"],
					maxValue: stats.properties["Max"],
					cardinality: stats.properties["Cardinality"],
					maxLength: stats.properties["Max Length"],
				})
			}

			ThisExtension.TreeViewWorkspaces.refresh(this, false);
		}
		catch (error) {
			const msg = `Error loading column statistics for table ${this.name}: ${error.message}`
			vscode.window.showErrorMessage(msg);
			ThisExtension.log(msg);
		}
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		let children: PowerBIWorkspaceTreeItem[] = [];

		children.push(new PowerBIDatasetTableColumns(this.groupId, this));
		children.push(new PowerBIDatasetTableMeasures(this.groupId, this));
		children.push(new PowerBIDatasetTablePartitions(this.groupId, this));

		return children;
	}

	// DAX Drop
	get daxDrop(): string {
		return `'${this.name}'`;
	}

	// TMSL Drop
	get tmslDrop(): string {
		return JSON.stringify(this.refreshableObject, null, 4);
	}

	// API Drop
	get apiDrop(): string {
		return JSON.stringify(this.refreshableObject, null, 4);
	}

	// DatasetTable-specific funtions
	get refreshableObject(): iPowerBIDatasetRefreshableObject {
		return { table: this.name };
	}

	public async refresh(): Promise<void> {
		ThisExtension.TreeViewWorkspaces.doMultiselectAction("REFRESH");
		/*
		const isOnDedicatedCapacity = this.dataset.workspace.isPremiumCapacity;

		await PowerBIDataset.refreshById(this.groupId.toString(), this.dataset.id, isOnDedicatedCapacity, [this.refreshableObject]);

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this.dataset, false);
		*/
	}
}