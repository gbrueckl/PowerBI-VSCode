import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { Helper, UniqueId } from '../../../helpers/Helper';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PROCESSING_TYPES, PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDatasetColumnStatistics, iPowerBIDatasetDMV } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBIDatasetTables } from './PowerBIDatasetTables';
import { PowerBIDatasetTableColumns } from './PowerBIDatasetTableColumns';
import { PowerBIDatasetTableMeasures } from './PowerBIDatasetTableMeasures';
import { PowerBIDatasetTable } from './PowerBIDatasetTable';
import { PowerBIDaxDrop } from '../../dropProvider/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetTableColumn extends PowerBIWorkspaceTreeItem implements PowerBIDaxDrop {

	constructor(
		definition: iPowerBIDatasetDMV,
		group: UniqueId,
		parent: PowerBIDatasetTableColumns
	) {
		super(definition.name, group, "DATASETTABLECOLUMN", definition.id, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;

		this.id = this.parent.id + "/" + definition.id;
		this.description = this._description;
		this.tooltip = this._tooltip;
		this.contextValue = this._contextValue;
		this.iconPath = this.getIcon();
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		let tooltip: string = "";

		if (this.table) {
			const columnStats = this.table.getColumnStatistic(this.name);
			tooltip += `Column statistics:\n`;
			for (const [key, value] of Object.entries(columnStats)) {
				if (key.endsWith("Name") || value == undefined) { // we dont want to expose names again
					continue;
				}
				if (typeof value === "string") {
					if (value.length > 100) {
						continue;
					}
				}
				tooltip += `${key}: ${JSON.stringify(value, null, 4)}\n`;
			}
			tooltip += `------------------\n`;
		}


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
		if (this.table) {
			const columnStats = this.table.getColumnStatistic(this.name);
			if (columnStats) {
				let desc: string = "";
				if(columnStats.cardinality) {
					desc += `Cnt: ${columnStats.cardinality}`;
				}
				if(columnStats.minValue && columnStats.maxValue) {
					desc += ` | Min: ${columnStats.minValue} | Max: ${columnStats.maxValue}`;
				}
				if(columnStats.maxLength) {
					desc += ` | MaxLength: ${columnStats.maxLength}`;
				}

				return desc;
			}
		}
		return this.definition.id;
	}

	getIcon(): vscode.ThemeIcon {
		return new vscode.ThemeIcon("library");
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIDatasetDMV {
		return super.definition as iPowerBIDatasetDMV;
	}

	private set definition(value: iPowerBIDatasetDMV) {
		super.definition = value;
	}

	get code(): string {
		return `'${this.table.name}'[${this.name}]`;
	}

	get table(): PowerBIDatasetTable {
		return this.parent.parent as PowerBIDatasetTable;
	}

	get dataset(): PowerBIDataset {
		return (this.table as PowerBIDatasetTable).dataset;
	}

	get columnStatistic(): object {
		const colStats: iPowerBIDatasetColumnStatistics = this.table.getColumnStatistic(this.name);

		if (colStats) {
			return colStats;
		}

		return {};
	}

	// DAX Drop
	get daxDrop(): string {
		return `'${this.table.name}'[${this.name}]`;
	}

	// DatasetTableColumn-specific funtions
}