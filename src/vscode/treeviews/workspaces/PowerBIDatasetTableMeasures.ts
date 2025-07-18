import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDataset, iPowerBIDatasetDMV, iPowerBIDatasetRefresh } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIDatasetRefresh } from './PowerBIDatasetRefresh';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIDatasetTable } from './PowerBIDatasetTable';
import { PowerBIWorkspaceGenericFolder } from './PowerBIWorkspaceGenericFolder';
import { PowerBIDatasetTableMeasure } from './PowerBIDatasetTableMeasure';
import { PowerBIConfiguration } from '../../configuration/PowerBIConfiguration';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetTableMeasures extends PowerBIWorkspaceGenericFolder {

	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super("Measures", "DATASETTABLEMEASURES", groupId, parent, "");
	}

	get table(): PowerBIDatasetTable {
		return this.parent as PowerBIDatasetTable;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIDatasetTableMeasure[] = [];

			try {
				if (PowerBIConfiguration.useFabricStudio) {
					const measureRegex = /^\s*measure\s+(?<measureName>'[^']*'|"[^"]*"|[^=\s]*)/gm;

					const tmdl = await this.table.getTMDLContent();
					const matches = tmdl.matchAll(measureRegex);

					for (const match of matches) {
						let measureName = match.groups.measureName;
						measureName = Helper.trimChar(Helper.trimChar(measureName, "'"), '"');

						const meta: iPowerBIDatasetDMV = {
							"name": measureName,
							"id": measureName,
							"properties": {}
						};

						let treeItem = new PowerBIDatasetTableMeasure(meta, this.groupId, this);
						children.push(treeItem);
						PowerBICommandBuilder.pushQuickPickItem(treeItem);
					}
				}
				else {
					const items: iPowerBIDatasetDMV[] = await PowerBIApiService.getDMV(this.apiPath, "MEASURES", "[TableID] = " + this.table.tableId);

					for (let item of items) {
						let treeItem = new PowerBIDatasetTableMeasure(item, this.groupId, this);
						children.push(treeItem);
						PowerBICommandBuilder.pushQuickPickItem(treeItem);
					}
				}
			}
			catch (e) {
				ThisExtension.log("No measures found for table " + this.table.name);
			}

			Helper.sortArrayByProperty(children, "label");
			
			return children;
		}
	}
}