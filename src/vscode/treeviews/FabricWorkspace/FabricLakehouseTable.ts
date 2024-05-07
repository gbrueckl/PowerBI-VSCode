import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { FabricWorkspaceTreeItem } from './FabricWorkspaceTreeItem';
import { FabricApiItemType, iFabricApiItem, iFabricApiLakehouseTable } from '../../../fabric/_types';
import { FabricLakehouseTables } from './FabricLakehouseTables';
import { FabricWorkspace } from './FabricWorkspace';
import { FabricApiService } from '../../../fabric/FabricApiService';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class FabricLakehouseTable extends FabricWorkspaceTreeItem {
	private _tableDefinition: iFabricApiLakehouseTable;

	constructor(
		definition: iFabricApiLakehouseTable,
		workspaceId: UniqueId,
		parent: FabricWorkspaceTreeItem
	) {
		super(definition.name, workspaceId, FabricApiItemType.LakehouseTable, definition.name, parent, "", vscode.TreeItemCollapsibleState.None);

		this._tableDefinition = definition;

		this.definition = {
			"description": "",
			"displayName": definition.name,
			"id": parent.parent.itemId + "/" + definition.name,
			"type": FabricApiItemType.LakehouseTable.toString(),
			"workspaceId": workspaceId,
		};

		this.tooltip = this.getToolTip(this._tableDefinition);
		this.description = this._description;

		this.iconPath = this.getIcon();
	}

	/* Overwritten properties from FabricApiTreeItem */
	getIcon(): vscode.ThemeIcon {
		return new vscode.ThemeIcon("layout-panel-justify");
	}

	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = ["BROWSEONELAKE"];

		return orig + actions.join(",") + ",";
	}

	// description is show next to the label
	get _description(): string {
		if (this.tableDefinition) {
			return `${this.tableType} - ${this.tableFormat}`;
		}
	}

	// LakehouseTable-specific funtions
	get tableDefinition(): iFabricApiLakehouseTable {
		return this._tableDefinition;
	}
	get tableType(): string {
		return this.tableDefinition.type;
	}

	get tableFormat(): string {
		return this.tableDefinition.format
	}

	get tableLocation(): string {
		return this.tableDefinition.location
	}

	async runMaintenanceJob(): Promise<void> {
		// https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-api#table-maintenance-api-request

		/*
		POST https://api.fabric.microsoft.com/v1/workspaces/{workspaceId}/items/{lakehouseId}/jobs/instances?jobType=TableMaintenance
		{
			"executionData": {
				"tableName": "{table_name}",
				"optimizeSettings": {
					"vOrder": true,
					"zOrderBy": [
						"tipAmount"
					]
				},
				"vacuumSettings": {
					"retentionPeriod": "7.01:00:00"
				}
			}
		}
		*/
	}

	get oneLakeUri(): vscode.Uri {
		// onelake:/<WorkspaceName>/<ItemName>.<ItemType>
		const workspace = this.getParentByType<FabricWorkspace>(FabricApiItemType.Workspace);
		const lakehouse = this.getParentByType<FabricWorkspace>(FabricApiItemType.Lakehouse);
		
		return vscode.Uri.parse(`onelake://${workspace.displayName}/${lakehouse.displayName}.Lakehouse/Tables/${this.displayName}`);
	}

	async runMaintainanceJob(): Promise<void> {
		/*
		POST https://api.fabric.microsoft.com/v1/workspaces/{workspaceId}/items/{lakehouseId}/jobs/instances?jobType=TableMaintenance
		{
			"executionData": {
				"tableName": "{table_name}",
				"optimizeSettings": {
					"vOrder": true,
					"zOrderBy": [
						"tipAmount"
					]
				},
				"vacuumSettings": {
					"retentionPeriod": "7.01:00:00"
				}
			}
		}
		*/

		const lakehouse = this.getParentByType(FabricApiItemType.Lakehouse);

		const endpoint = lakehouse.apiPath + "/jobs/instances?jobType=TableMaintenance";
		const body = {
			"executionData": {
				"tableName": this.displayName,
				"optimizeSettings": {
					"vOrder": true
				}
			}
		}

		const response = await FabricApiService.post(endpoint, body, false, false );

		if(response.error)
		{
			vscode.window.showErrorMessage(response.error.message);
		}
		else {
			Helper.showTemporaryInformationMessage(`Maintenance job started for table ${this.displayName}. (Tracking: GET ${response.success.url})`, 15000);
		}
	}
}