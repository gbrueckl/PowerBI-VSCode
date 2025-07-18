import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDatasetDMV } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIDatasetTable } from './PowerBIDatasetTable';
import { PowerBIWorkspaceGenericFolder } from './PowerBIWorkspaceGenericFolder';
import { PowerBIDatasetTableColumn } from './PowerBIDatasetTableColumn';
import { PowerBIConfiguration } from '../../configuration/PowerBIConfiguration';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetTableColumns extends PowerBIWorkspaceGenericFolder {
	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super("Columns", "DATASETTABLECOLUMNS", groupId, parent, "");
	}

	get table(): PowerBIDatasetTable {
		return this.parent as PowerBIDatasetTable;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIDatasetTableColumn[] = [];

			try {
				if (PowerBIConfiguration.useFabricStudio) {
					const columnRegex = /^\s*column\s+(?<columnName>'[^']*'|"[^"]*"|[^=\s]*)/gm;

					const tmdl = await this.table.getTMDLContent();
					const matches = tmdl.matchAll(columnRegex);

					for (const match of matches) {
						let columnName = match.groups.columnName;
						columnName = Helper.trimChar(Helper.trimChar(columnName, "'"), '"');

						const meta: iPowerBIDatasetDMV = {
							"name": columnName,
							"id": columnName,
							"properties": {}
						};

						let treeItem = new PowerBIDatasetTableColumn(meta, this.groupId, this);
						children.push(treeItem);
						PowerBICommandBuilder.pushQuickPickItem(treeItem);
					}
				}
				else {
					const items: iPowerBIDatasetDMV[] = await PowerBIApiService.getDMV(this.apiPath, "COLUMNS", "[TableID] = " + this.table.tableId, "ExplicitName");
					//await this.table.loadColumnStatistics();

					for (let item of items) {
						let treeItem = new PowerBIDatasetTableColumn(item, this.groupId, this);
						children.push(treeItem);
						PowerBICommandBuilder.pushQuickPickItem(treeItem);
					}
				}
			}
			catch (e) {
				ThisExtension.log("No columns found for table " + this.table.name);
			}

			Helper.sortArrayByProperty(children, "label");

			return children;
		}
	}
}