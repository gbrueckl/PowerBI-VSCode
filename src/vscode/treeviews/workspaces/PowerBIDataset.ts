import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDataset } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIReport } from './PowerBIReport';
import { PowerBIParameters } from './PowerBIParameters';
import { PowerBIDatasetRefreshes } from './PowerBIDatasetRefreshes';
import { iPowerBIGroup } from '../../../powerbi/GroupsAPI/_types';
import { QuickPickItem } from 'vscode';
import { PowerBIWorkspace } from './PowerBIWorkspace';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataset extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDataset,
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super(definition.name, groupId, "DATASET", definition.id, parent, vscode.TreeItemCollapsibleState.Collapsed);

		this.definition = definition;
		
		super.tooltip = this._tooltip;
		super.contextValue = this._contextValue;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = [
			"REFRESH",
			"DELETE"
		]

		if(this.definition.configuredBy != PowerBIApiService.SessionUserEmail)
		{
			actions.push("TAKEOVER");
		}
		else
		{
			actions.push("UPDATEPARAMETERS")
		}

		return orig + actions.join(",") + ",";
	}

	get definition(): iPowerBIDataset {
		return super.definition as iPowerBIDataset;
	}

	private set definition(value: iPowerBIDataset) {
		super.definition = value;
	}

	get canDoChanges(): boolean {
		return "" == this.definition.configuredBy;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		PowerBICommandBuilder.pushQuickPickItem(this);

		let children: PowerBIWorkspaceTreeItem[] = [];
		
		children.push(new PowerBIParameters(this.groupId, this));
		children.push(new PowerBIDatasetRefreshes(this.groupId, this));

		return children;
	}

	// #region iHandleDrop implementation
	public async handleDrop(dataTransfer: vscode.DataTransfer): Promise<void> {
		const transferItem = dataTransfer.get('application/vnd.code.tree.powerbiworkspaces');
		if (!transferItem) {
			ThisExtension.log("Item dropped on PowerBI Workspace Tree-View - but MimeType 'application/vnd.code.tree.powerbiworkspaces' was not found!");
			return;
		}
		const sourceItems: PowerBIWorkspaceTreeItem[] = transferItem.value;

		const source = sourceItems[0];

		switch (source.itemType) {
			case "REPORT":
				const action: string = await PowerBICommandBuilder.showQuickPick([new PowerBIQuickPickItem("rebind"), new PowerBIQuickPickItem("clone")], "Action");

				switch (action) {
					case "rebind":
						(source as PowerBIReport).rebind({
							datasetId: this.id
						});
						break;

					case "clone":
							await (source as PowerBIReport).clone({
								name: source.name,
								targetModelId: this.id,
								targetWorkspaceId: this.groupId
							});
							
							ThisExtension.TreeViewWorkspaces.refresh(this.parent.parent, false);
							break;

					default:
						ThisExtension.setStatusBar("Drag&Drop aborted!");
						ThisExtension.log("Invalid or no action selected!");
				}

				break;

			default:
				ThisExtension.log("No action defined when dropping a " + source.itemType + " on " + this.itemType + "!");
		}
	}
	// #endregion

	// Dataset-specific funtions
	public async delete(): Promise<void> {
		ThisExtension.setStatusBar("Deleting dataset ...", true);
		await PowerBICommandBuilder.execute<iPowerBIDataset>(this.apiPath, "DELETE", []);
		ThisExtension.setStatusBar("Dataset deleted!");

		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}
	
	public async refresh(): Promise<void> {
		ThisExtension.setStatusBar("Triggering dataset-refresh ...", true);

		let body = null;

		// if we are on premium, we can use the Enhanced Refresh API
		if(this.getParentByType<PowerBIWorkspace>("GROUP").definition.isOnDedicatedCapacity)
		{
			const processType: QuickPickItem = await vscode.window.showQuickPick(PROCESSING_TYPES, {
				//placeHolder: toolTip,
				ignoreFocusOut: true
				/*,
				onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
				*/
			});
			if (processType == undefined || processType == null) {
				return;
			}
			body = {
				"type": processType.label
			}
		}
		PowerBIApiService.post(this.apiPath + "/refreshes", body);
		ThisExtension.setStatusBar("Dataset-refresh triggered!");

		ThisExtension.TreeViewWorkspaces.refresh(this, false);
	}

	public async takeOver(): Promise<void> {
		ThisExtension.setStatusBar("Taking over dataset ...", true);
		PowerBIApiService.post(this.apiPath + "/Default.TakeOver", null);
		ThisExtension.setStatusBar("Dataset taken over!");

		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public async updateAllParameters(): Promise<void> {
		// TODO
	}
}

const PROCESSING_TYPES: vscode.QuickPickItem[] = [
	{
		"label": "full",
		"detail": "Processes an SQL Server Analysis Services object and all the objects that it contains. When Process Full is executed against an object that has already been processed, SQL Server Analysis Services drops all data in the object, and then processes the object. This kind of processing is required when a structural change has been made to an object, for example, when an attribute hierarchy is added, deleted, or renamed."
	},
	{
		"label": "clearValues",
		"detail": "Drops the data in the object specified and any lower-level constituent objects. After the data is dropped, it is not reloaded."
	},
	{
		"label": "calculate",
		"detail": "Updates and recalculates hierarchies, relationships, and calculated columns."
	},
	{
		"label": "dataOnly",
		"detail": "Processes data only without building aggregations or indexes. If there is data is in the partitions, it will be dropped before re-populating the partition with source data."
	},
	{
		"label": "automatic",
		"detail": "Detects the process state of database objects, and performs processing necessary to deliver unprocessed or partially processed objects to a fully processed state. If you change a data binding, Process Default will do a Process Full on the affected object."
	},
	{
		"label": "defragment",
		"detail": "Creates or rebuilds indexes and aggregations for all processed partitions. For unprocessed objects, this option generates an error. Processing with this option is needed if you turn off Lazy Processing."
	}
];
