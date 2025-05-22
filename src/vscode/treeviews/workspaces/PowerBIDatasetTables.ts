import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDatasetDMV } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIDatasetTable } from './PowerBIDatasetTable';
import { PowerBIWorkspaceGenericFolder } from './PowerBIWorkspaceGenericFolder';
import { PowerBIConfiguration } from '../../configuration/PowerBIConfiguration';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetTables extends PowerBIWorkspaceGenericFolder {

	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super("Tables", "DATASETTABLES", groupId, parent, "");
	}

	get dataset(): PowerBIDataset {
		return this.parent as PowerBIDataset;
	}

	get fabricFsUri(): vscode.Uri {
		const fabricUri = vscode.Uri.joinPath(this.dataset.fabricFsUri, "definition", "tables");

		return fabricUri;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIDatasetTable[] = [];

			try {

				if (PowerBIConfiguration.useFabricStudio) {
					await ThisExtension.ensureFabricStudio();
					const fabricUri = this.dataset.fabricFsUri;

					// we need to read the root folder first to ensure the child folders are loaded 
					const initFolder = await vscode.workspace.fs.readDirectory(fabricUri);
					const folders = await vscode.workspace.fs.readDirectory(this.fabricFsUri);

					for (let item of folders) {
						if (item[1] != vscode.FileType.File) {
							ThisExtension.log("Item is not a TMDL File: Skipping " + item[0]);
							continue;
						}
						const tableName = item[0].replace("\.tmdl", "")
						const meta: iPowerBIDatasetDMV = {
							"name": tableName,
							"id": tableName,
							"properties": {}
						};
						let treeItem = new PowerBIDatasetTable(meta, this.groupId, this);
						children.push(treeItem);
						PowerBICommandBuilder.pushQuickPickItem(treeItem);
					}
				}
				else {
					const items: iPowerBIDatasetDMV[] = await PowerBIApiService.getDMV(this.apiPath, "TABLES");

					for (let item of items) {
						let treeItem = new PowerBIDatasetTable(item, this.groupId, this);
						children.push(treeItem);
						PowerBICommandBuilder.pushQuickPickItem(treeItem);
					}
				}
			}
			catch (e) {
				if (e.message.includes("PowerBIFeatureDisabled")) {
					ThisExtension.log(e.message);
					vscode.window.showErrorMessage(e.message);
				}
				ThisExtension.log("No tables found for dataset " + this.dataset.name);
				return;
			}

			Helper.sortArrayByProperty(children, "label");

			return children;
		}
	}
}