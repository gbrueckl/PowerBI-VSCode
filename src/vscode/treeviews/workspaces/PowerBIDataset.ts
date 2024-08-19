import * as vscode from 'vscode';

import { startExternalProcess } from '@env/process';
import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDataset, iPowerBIDatasetGenericResponse, iPowerBIDatasetParameter, iPowerBIDatasetRefresh, iPowerBIDatasetRefreshableObject } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder, PowerBICommandInput, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIParameters } from './PowerBIParameters';
import { PowerBIDatasetRefreshes } from './PowerBIDatasetRefreshes';
import { PowerBIWorkspace } from './PowerBIWorkspace';
import { PowerBIParameter } from './PowerBIParameter';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { TMDL_SCHEME } from '../../filesystemProvider/TMDLFileSystemProvider';
import { TMDLFSUri } from '../../filesystemProvider/TMDLFSUri';
import { TMDLProxy } from '../../../TMDLVSCode/TMDLProxy';
import { TOMProxyBackup, TOMProxyRestore } from '../../../TMDLVSCode/_typesTOM';
import { PowerBIDatasetTables } from './PowerBIDatasetTables';
import { PowerBIConfiguration } from '../../configuration/PowerBIConfiguration';
import { iPowerBIDesktopExternalToolConfig } from '../_types';
import { PowerBINotebookType } from '../../notebook/PowerBINotebook';
import { PowerBINotebookContext } from '../../notebook/PowerBINotebookContext';
import { PowerBINotebookSerializer } from '../../notebook/PowerBINotebookSerializer';
import { PowerBIDatasetPermissions } from './PowerBIDatasetPermissions';
import { PowerBIDatasetRefresh } from './PowerBIDatasetRefresh';
import { PowerBIDatasets } from './PowerBIDatasets';


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataset extends PowerBIWorkspaceTreeItem implements TOMProxyBackup, TOMProxyRestore {

	constructor(
		definition: iPowerBIDataset,
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super(definition.name, groupId, "DATASET", definition.id, parent, vscode.TreeItemCollapsibleState.Collapsed);

		this.definition = definition;

		this.tooltip = this._tooltip;
		this.contextValue = this._contextValue;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = [
			"DELETE",
			"SHOWMEMORYSTATS"
		]

		if (this.definition.isRefreshable) {
			actions.push("REFRESH");
		}

		if (this.definition.configuredBy != PowerBIApiService.SessionUserEmail) {
			actions.push("TAKEOVER");
		}
		else {
			actions.push("UPDATEDATASETPARAMETERS")
		}

		if (this.workspace.definition.isOnDedicatedCapacity) {
			actions.push("CONFIGURESCALEOUT");
			actions.push("EDIT_TMDL");
			actions.push("BACKUP");
			actions.push("RESTORE");
			actions.push("COPY_CONNECTIONSTRING");

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
		return PowerBIApiService.getXmlaConnectionString(this.workspace.name, this.name);
	}

	get asQuickPickItem(): PowerBIQuickPickItem {
		const qpItem = new PowerBIQuickPickItem(this.name, this.uid.toString(), this.uid.toString(), `Workspace: ${this.workspace.name} (ID: ${this.workspace.uid})`);
		qpItem.apiItem = this;

		return qpItem;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		let children: PowerBIWorkspaceTreeItem[] = [];

		children.push(new PowerBIParameters(this.groupId, this));
		children.push(new PowerBIDatasetRefreshes(this.groupId, this));
		children.push(new PowerBIDatasetTables(this.groupId, this));
		children.push(new PowerBIDatasetPermissions(this.groupId, this));

		return children;
	}

	// Dataset-specific funtions
	get workspace(): PowerBIWorkspace {
		return this.getParentByType<PowerBIWorkspace>("GROUP");
	}

	public async delete(): Promise<void> {
		await PowerBIApiTreeItem.delete(this, "yesNo");

		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public static async refreshById(workspaceId: string, datasetId: string, isOnDedicatedCapacity: boolean, objectsToRefresh?: iPowerBIDatasetRefreshableObject[]): Promise<iPowerBIDatasetRefresh> {
		ThisExtension.setStatusBarRight("Triggering dataset-refresh ...", true);
		const apiUrl = Helper.joinPath("groups", workspaceId, "datasets", datasetId, "refreshes");

		let body = null;

		// if we are on premium, we can use the Enhanced Refresh API
		if (isOnDedicatedCapacity) {
			const processType: ProcessTypeQuickPickItem = await vscode.window.showQuickPick(PROCESSING_TYPES, {
				//placeHolder: toolTip,
				ignoreFocusOut: true
				/*,
				onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
				*/
			});
			if (processType == undefined || processType == null) {
				ThisExtension.setStatusBarRight("Dataset-refresh aborted!");
				Helper.showTemporaryInformationMessage("Dataset-refresh aborted!", 3000);
				return;
			}
			body = Object.assign(
				{}, 
				{
					"type": processType.label,
					"applyRefreshPolicy": true
				},
				processType.customProperties);

			if (objectsToRefresh) {
				body["objects"] = objectsToRefresh;

				// it is not supported to apply the refresh policy when processing individual partitions
				if (objectsToRefresh.find((obj) => obj.partition)) {
					body["applyRefreshPolicy"] = false;
					Helper.showTemporaryInformationMessage("Refresh policy will not be applied when processing individual partitions!", 3000);
				}
			}
		}

		await PowerBIApiService.post(apiUrl, body);
		ThisExtension.setStatusBarRight("Dataset-refresh triggered!");
		Helper.showTemporaryInformationMessage("Dataset-refresh triggered!", 3000);

		PowerBIDatasets.startRunningRefreshTimer(apiUrl);
	}

	public async refresh(): Promise<void> {
		const isOnDedicatedCapacity = this.workspace.definition.isOnDedicatedCapacity;
		const newRefresh = await PowerBIDataset.refreshById(this.groupId.toString(), this.id, isOnDedicatedCapacity);

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this, false);
	}

	public async takeOver(): Promise<void> {
		ThisExtension.setStatusBarRight("Taking over dataset ...", true);

		const apiUrl = Helper.joinPath(this.apiPath, "Default.TakeOver");
		PowerBIApiService.post(apiUrl, null);
		ThisExtension.setStatusBarRight("Dataset taken over!");

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public async configureScaleOut(): Promise<void> {
		ThisExtension.setStatusBarRight("Configuring Dataset Scale-Out ...", true);

		const apiUrl = this.apiPath;

		let response = await PowerBICommandBuilder.execute<iPowerBIDatasetGenericResponse>(apiUrl, "PATCH",
			[
				new PowerBICommandInput("Max Read-Only Replicas", "FREE_TEXT", "queryScaleOutSettings.maxReadOnlyReplicas", false, "Maximum number of read-only replicas for the dataset (0-64, -1 for automatic number of replicas)", this.definition.queryScaleOutSettings?.maxReadOnlyReplicas.toString()),
				new PowerBICommandInput("Workspace", "CUSTOM_SELECTOR", "queryScaleOutSettings.autoSyncReadOnlyReplicas", false, "Whether the dataset automatically syncs read-only replicas.", this.definition.queryScaleOutSettings?.autoSyncReadOnlyReplicas.toString(), [new PowerBIQuickPickItem("true"), new PowerBIQuickPickItem("false")])
			]);

		if (response.error) {
			vscode.window.showErrorMessage(JSON.stringify(response));
		}

		ThisExtension.setStatusBarRight("Dataset Scale-Out configured!");

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public async syncReadOnlyReplicas(): Promise<void> {
		ThisExtension.setStatusBarRight("Starting RO replica sync ...", true);

		const apiUrl = Helper.joinPath(this.apiPath, "queryScaleOut", "sync");
		var response = await PowerBIApiService.post<iPowerBIDatasetGenericResponse>(apiUrl, null);

		if (response.error) {
			vscode.window.showErrorMessage(JSON.stringify(response));
		}

		ThisExtension.setStatusBarRight("RO replica sync started!");

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public async backup(): Promise<void> {
		const backupFileName = await PowerBICommandBuilder.showInputBox(this.name + ".abf", "Enter the name of the backup file", undefined);
		if (!backupFileName) {
			Helper.showTemporaryInformationMessage("Backup aborted!");
			return;
		}

		const allowOverwrite = await PowerBICommandBuilder.showQuickPick([new PowerBIQuickPickItem("yes"), new PowerBIQuickPickItem("no")], `Overwrite existing backup (if exists)?`, undefined, undefined);
		if (!allowOverwrite) {
			Helper.showTemporaryInformationMessage("Backup aborted!");
			return;
		}

		await TMDLProxy.backup(this.workspace.name, this.name, backupFileName, allowOverwrite == "yes");
	}

	public async restore(): Promise<void> {
		const backupFileName = await PowerBICommandBuilder.showInputBox(this.name + ".abf", "Enter the name of the backup file", undefined);
		if (!backupFileName) {
			Helper.showTemporaryInformationMessage("Restore aborted!");
			return;
		}

		const allowOverwrite = await PowerBICommandBuilder.showQuickPick([new PowerBIQuickPickItem("yes"), new PowerBIQuickPickItem("no")], `Overwrite existing database?`, `Database ${this.name} will be overwritten with the contents of ${backupFileName}.`, undefined);
		if (!allowOverwrite) {
			Helper.showTemporaryInformationMessage("Restore aborted!");
			return;
		}
		await TMDLProxy.restore(backupFileName, this.workspace.name, this.name, allowOverwrite == "yes");
	}

	public async editTMDL(): Promise<void> {
		const tmdlUri = new TMDLFSUri(vscode.Uri.parse(`${TMDL_SCHEME}:/powerbi/${this.workspace.name}/${this.name}`));

		await Helper.addToWorkspace(tmdlUri.uri, `TMDL - ${this.name}`, true);
		// if the workspace does not exist, the folder is opened in a new workspace where the TMDL folder would be reloaded again
		// so we only load the model if we already have a workspace
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

		ThisExtension.setStatusBarRight("Updating parameter ...", true);
		await PowerBIApiService.post(apiUrl, settings);
		ThisExtension.setStatusBarRight("Parameter updated!")

		await ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public async copyConnectionString(): Promise<void> {
		vscode.env.clipboard.writeText(await this.getXMLACConnectionString());
	}

	public static async openPowerBIDesktopExternalTool(dataset: PowerBIDataset): Promise<void> {
		const paths = [
			vscode.Uri.file(process.env["CommonProgramFiles(x86)"]),
			vscode.Uri.file(process.env["CommonProgramFiles"])
		]

		let extToolPaths: vscode.Uri[] = []
		for (let path of paths) {
			try {
				ThisExtension.log("Searching for Power BI Desktop External Tools in " + path.fsPath + " ...");
				let dirs = await vscode.workspace.fs.readDirectory(vscode.Uri.joinPath(path, "Microsoft Shared", "Power BI Desktop", "External Tools"));
				for (let dir of dirs) {
					extToolPaths.push(vscode.Uri.joinPath(path, "Microsoft Shared", "Power BI Desktop", "External Tools", dir[0]));
				}
			}
			catch {
				ThisExtension.log("Error checking for Power BI Desktop External Tools in " + path.fsPath + "! Folder will be skipped!")
			}
		}

		if (extToolPaths.length == 0) {
			vscode.window.showErrorMessage("No Power BI Desktop External Tools found!");
			return;
		}

		let extToolConfigs: iPowerBIDesktopExternalToolConfig[] = []
		let qpItems: vscode.QuickPickItem[] = []
		for (let extToolPath of extToolPaths) {
			let extToolConfig: iPowerBIDesktopExternalToolConfig = JSON.parse(Buffer.from(await vscode.workspace.fs.readFile(extToolPath)).toString());
			extToolConfigs.push(extToolConfig);
			let qpItem: vscode.QuickPickItem = {
				"label": extToolConfig.name,
				"detail": extToolConfig.description,
				"description": extToolConfig.version,
				"iconPath": vscode.Uri.parse("data:" + extToolConfig.iconData)
			};
			qpItems.push(qpItem);
		}

		let selectedTool = await vscode.window.showQuickPick(qpItems, { ignoreFocusOut: true })

		if (!selectedTool) {
			Helper.showTemporaryInformationMessage("No tool selected - aborting... !");
			return;
		}

		let selectedToolConfig = extToolConfigs.find((config) => config.name == selectedTool.label);
		if (!selectedToolConfig) {
			return;
		}

		let args = [];
		if (dataset) {
			const xmlaEndpoint = PowerBIApiService.getXmlaEndpoint(dataset.workspace.name);
			args = selectedToolConfig.arguments.split(" ").map((arg) => arg.replace("%server%", xmlaEndpoint.toString()).replace("%database%", dataset.name));
			//args = [selectedToolConfig.arguments.replace("%server%", xmlaEndpoint.toString()).replace("%database%", dataset.name)]
		}

		let extProcess = await startExternalProcess(selectedToolConfig.path, args);
		if (dataset) {
			extProcess.on('exit', () => {
				ThisExtension.TreeViewWorkspaces.refresh(dataset, true)
			});
		}
	}

	public async showMemoryStats() {
		const notebookContent = await vscode.workspace.fs.readFile(
			vscode.Uri.joinPath(
				ThisExtension.extensionContext.extensionUri, "resources", "Files", "VertipaqAnalyzerDAX.pbinb"));

		let notebook = await (new PowerBINotebookSerializer).deserializeNotebook(notebookContent, undefined);

		let apiPath = '/' + Helper.trimChar(this.apiPath.split("/").slice(2).join("/"), "/", false, true);

		notebook.cells[1].value = '%cmd\nSET API_PATH = ' + apiPath;

		notebook.metadata = PowerBINotebookContext.loadFromMetadata(notebook.metadata);

		const doc = await vscode.workspace.openNotebookDocument(PowerBINotebookType, notebook);
		let context: PowerBINotebookContext = new PowerBINotebookContext(apiPath);
		context.apiRootPath = apiPath;
		context.uri = doc.uri;
		PowerBINotebookContext.set(notebook.metadata.guid, context)

		ThisExtension.NotebookKernel.setNotebookContext(doc, context);

		const editor = await vscode.window.showNotebookDocument(doc);

		vscode.commands.executeCommand('editorScroll', {
			to: 'up',
			by: 'editor',
			revealCursor: true,
		});
	}
}

class ProcessTypeQuickPickItem implements vscode.QuickPickItem {
	label: string;
	detail?: string | undefined;
	customProperties?: object | undefined;
}

export const PROCESSING_TYPES: ProcessTypeQuickPickItem[] = [
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
	},
	{
		"label": "full (without refresh policy)",
		"detail": "Full refresh without applying the Incremental Refresh Policy. Processes an SQL Server Analysis Services object and all the objects that it contains. When Process Full is executed against an object that has already been processed, SQL Server Analysis Services drops all data in the object, and then processes the object. This kind of processing is required when a structural change has been made to an object, for example, when an attribute hierarchy is added, deleted, or renamed.",
		"customProperties": { "applyRefreshPolicy": false, "type": "full" }
	},
];
