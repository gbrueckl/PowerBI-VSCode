import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDatasetDMV } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIDatasetTable } from './PowerBIDatasetTable';
import { PowerBIWorkspaceGenericFolder } from './PowerBIWorkspaceGenericFolder';
import { PowerBIDatasetTableColumn } from './PowerBIDatasetTableColumn';

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
		if (!PowerBIApiService.isInitialized) {
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIDatasetTableColumn[] = [];

			try {
				const items: iPowerBIDatasetDMV[] = await PowerBIApiService.getDMV(this.apiPath, "COLUMNS", "[TableID] = " + this.table.tableId, "ExplicitName");
				//await this.table.loadColumnStatistics();

				for (let item of items) {
					let treeItem = new PowerBIDatasetTableColumn(item, this.groupId, this);
					children.push(treeItem);
					PowerBICommandBuilder.pushQuickPickItem(treeItem);
				}
			}
			catch (e) {
				ThisExtension.log("No columns found for table " + this.table.name);
			}

			return children;
		}
	}
}