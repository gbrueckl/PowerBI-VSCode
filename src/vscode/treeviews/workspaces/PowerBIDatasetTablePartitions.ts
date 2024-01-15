import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDataset, iPowerBIDatasetDMV, iPowerBIDatasetRefresh } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIDatasetRefresh } from './PowerBIDatasetRefresh';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIDatasetTable } from './PowerBIDatasetTable';
import { PowerBIWorkspaceGenericFolder } from './PowerBIWorkspaceGenericFolder';
import { PowerBIDatasetTableColumn } from './PowerBIDatasetTableColumn';
import { PowerBIDatasetTablePartition } from './PowerBIDatasetTablePartition';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetTablePartitions extends PowerBIWorkspaceGenericFolder {

	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super("Partitions", "DATASETTABLEPARTITIONS", groupId, parent, "");
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
			let children: PowerBIDatasetTablePartition[] = [];

			try {
				const items: iPowerBIDatasetDMV[] = await PowerBIApiService.getDMV(this.apiPath, "PARTITIONS", "[TableID] = " + this.table.tableId);

				for (let item of items) {
					let treeItem = new PowerBIDatasetTablePartition(item, this.groupId, this);
					children.push(treeItem);
					PowerBICommandBuilder.pushQuickPickItem(treeItem);
				}
			}
			catch (e) {
				ThisExtension.log("No partitions found for table " + this.table.name);
			}

			return children;
		}
	}
}