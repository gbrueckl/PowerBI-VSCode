import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDataset, iPowerBIDatasetGenericResponse, iPowerBIDatasetParameter } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder, PowerBICommandInput, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIReport } from './PowerBIReport';
import { PowerBIParameters } from './PowerBIParameters';
import { PowerBIDatasetRefreshes } from './PowerBIDatasetRefreshes';
import { iPowerBIGroup } from '../../../powerbi/GroupsAPI/_types';
import { QuickPickItem } from 'vscode';
import { PowerBIWorkspace } from './PowerBIWorkspace';
import { PowerBIParameter } from './PowerBIParameter';
import { TMDLProxy } from '../../../helpers/TMDLProxy';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { TMDLFSUri, TMDLFileSystemProvider } from '../../filesystemProvider/TMDLFileSystemProvider';

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

		if (this.definition.configuredBy != PowerBIApiService.SessionUserEmail) {
			actions.push("TAKEOVER");
		}
		else {
			actions.push("UPDATEDATASETPARAMETERS")
		}

		if (this.getParentByType<PowerBIWorkspace>("GROUP").definition.isOnDedicatedCapacity) {
			actions.push("CONFIGURESCALEOUT");
			actions.push("EDIT_TMDL");

			if (this.definition.queryScaleOutSettings?.maxReadOnlyReplicas != 0) {
				actions.push("SYNCREADONLYREPLICAS");
			}
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

	async getXMLACConnectionString(): Promise<string> {
		const workspace = this.getParentByType<PowerBIWorkspace>("GROUP");
		const xmlaServer = PowerBIApiService.getXmlaServer(workspace.name).toString();

		return `Data Source=${xmlaServer};Initial Catalog=${this.name};`;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		PowerBICommandBuilder.pushQuickPickItem(this);

		let children: PowerBIWorkspaceTreeItem[] = [];

		children.push(new PowerBIParameters(this.groupId, this));
		children.push(new PowerBIDatasetRefreshes(this.groupId, this));

		return children;
	}

	// Dataset-specific funtions
	public async delete(): Promise<void> {
		await PowerBIApiTreeItem.delete(this, "yesNo");
		
		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public async refresh(): Promise<void> {
		ThisExtension.setStatusBar("Triggering dataset-refresh ...", true);
		const apiUrl = Helper.joinPath(this.apiPath, "refreshes");

		let body = null;

		// if we are on premium, we can use the Enhanced Refresh API
		if (this.getParentByType<PowerBIWorkspace>("GROUP").definition.isOnDedicatedCapacity) {
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
		PowerBIApiService.post(apiUrl, body);
		ThisExtension.setStatusBar("Dataset-refresh triggered!");

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this, false);
	}

	public async takeOver(): Promise<void> {
		ThisExtension.setStatusBar("Taking over dataset ...", true);

		const apiUrl = Helper.joinPath(this.apiPath, "Default.TakeOver");
		PowerBIApiService.post(apiUrl, null);
		ThisExtension.setStatusBar("Dataset taken over!");

		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public async configureScaleOut(): Promise<void> {
		ThisExtension.setStatusBar("Configuring Dataset Scale-Out ...", true);

		const apiUrl = this.apiPath;

		let response = await PowerBICommandBuilder.execute<iPowerBIDatasetGenericResponse>(apiUrl, "PATCH",
			[
				new PowerBICommandInput("Max Read-Only Replicas", "FREE_TEXT", "queryScaleOutSettings.maxReadOnlyReplicas", false, "Maximum number of read-only replicas for the dataset (0-64, -1 for automatic number of replicas)", this.definition.queryScaleOutSettings?.maxReadOnlyReplicas.toString()),
				new PowerBICommandInput("Workspace", "CUSTOM_SELECTOR", "queryScaleOutSettings.autoSyncReadOnlyReplicas", false, "Whether the dataset automatically syncs read-only replicas.", this.definition.queryScaleOutSettings?.autoSyncReadOnlyReplicas.toString(), [new PowerBIQuickPickItem("true"), new PowerBIQuickPickItem("false")])
			]);

		if (response.error) {
			vscode.window.showErrorMessage(JSON.stringify(response));
		}

		ThisExtension.setStatusBar("Dataset Scale-Out configured!");

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public async syncReadOnlyReplicas(): Promise<void> {
		ThisExtension.setStatusBar("Starting RO replica sync ...", true);

		const apiUrl = Helper.joinPath(this.apiPath, "queryScaleOut", "sync");
		var response = await PowerBIApiService.post<iPowerBIDatasetGenericResponse>(apiUrl, null);

		if (response.error) {
			vscode.window.showErrorMessage(JSON.stringify(response));
		}

		ThisExtension.setStatusBar("RO replica sync started!");

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public async editTMDL(): Promise<void> {
		const workspace = this.getParentByType<PowerBIWorkspace>("GROUP");
		const tmdlUri = new TMDLFSUri(vscode.Uri.parse(`tmdl:/powerbi/${workspace.name}/${this.name}`))

		//await TMDLFileSystemProvider.loadModel(tmdlUri.uri);
		await Helper.addToWorkspace(tmdlUri.uri, `PowerBI Dataset - ${this.name}`, true);
	}

	public async updateAllParameters(): Promise<void> {
		const apiUrl = Helper.joinPath(this.apiPath, "Default.UpdateParameters");
		let parameters: iPowerBIDatasetParameter[] = await PowerBIApiService.getItemList<iPowerBIDatasetParameter>(this.apiPath + "parameters");

		let updateDetails: { name: string, newValue: string }[] = [];
		for (let parameter of parameters) {
			let newValue: { name: string, newValue: string } = await PowerBIParameter.promptForValue(parameter)

			if (newValue) {
				updateDetails.push(newValue);
			}
		}

		let settings = {
			"updateDetails": updateDetails
		}

		ThisExtension.setStatusBar("Updating parameter ...", true);
		await PowerBIApiService.post(apiUrl, settings);
		ThisExtension.setStatusBar("Parameter updated!")

		await ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
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
