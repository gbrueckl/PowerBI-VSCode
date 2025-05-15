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
import { PowerBIConfiguration } from '../../configuration/PowerBIConfiguration';

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
		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIDatasetTablePartition[] = [];

			try {
				if (PowerBIConfiguration.useFabricStudio) {
					const partitionRegex = /^\s*partition\s*(?<partitionName>[^\s]*)[\s=]/gm;

					const tmdl = await this.table.getTMDLContent();
					const matches = tmdl.matchAll(partitionRegex);
    
					for (const match of matches) {
						const partitionName = match.groups.partitionName;

						const meta: iPowerBIDatasetDMV = {
							"name": partitionName,
							"id": partitionName,
							"properties": {}
						};

						let treeItem = new PowerBIDatasetTablePartition(meta, this.groupId, this);
						children.push(treeItem);
						PowerBICommandBuilder.pushQuickPickItem(treeItem);
					}
				}
				else {
					const items: iPowerBIDatasetDMV[] = await PowerBIApiService.getDMV(this.apiPath, "PARTITIONS", "[TableID] = " + this.table.tableId);

					for (let item of items) {
						let treeItem = new PowerBIDatasetTablePartition(item, this.groupId, this);
						children.push(treeItem);
						PowerBICommandBuilder.pushQuickPickItem(treeItem);
					}
				}
			}
			catch (e) {
				ThisExtension.log("No partitions found for table " + this.table.name);
			}

			return children;
		}
	}
}