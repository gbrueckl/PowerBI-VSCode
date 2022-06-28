import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIReport } from '../../../powerbi/ReportsAPI/_types';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { UniqueId } from '../../../helpers/Helper';
import { PowerBICommandBuilder, PowerBICommandInput, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { ThisExtension } from '../../../ThisExtension';
import { iHandleDrop } from './PowerBIWorkspacesDragAndDropController';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIReport extends PowerBIWorkspaceTreeItem implements iHandleDrop {

	constructor(
		definition: iPowerBIReport,
		group: UniqueId,
		parent: PowerBIApiTreeItem
	) {
		super(definition.name, group, "REPORT", definition.id, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;
		
		super.tooltip = this._tooltip;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIReport {
		return super.definition as iPowerBIReport;
	}

	set definition(value: iPowerBIReport) {
		super.definition = value;
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
				const action: string = await PowerBICommandBuilder.showQuickPick([new PowerBIQuickPickItem("update content")], "Action");

				switch (action) {
					case "update content":
						this.updateContent({
							sourceReport: {
								sourceReportId: source.id,
								sourceWorkspaceId: source.group
							},
							sourceType: "ExistingReport"
						});
						break;

					default:
						ThisExtension.log("Invalid or no action selected!");
				}

				break;

			default:
				ThisExtension.log("No action defined when dropping a " + source.itemType + " on " + this.itemType + "!");
		}
	}
	// #endregion

	// Report-specific funtions
	public async delete(): Promise<void> {
		await PowerBICommandBuilder.execute<iPowerBIReport>(this.apiPath, "DELETE", []);

		ThisExtension.TreeViewWorkspaces.refresh(false, this.parent);
	}

	public async clone(settings: object = undefined): Promise<void> {
		const apiUrl = this.apiPath + "/Clone";
		if (settings == undefined) // prompt user for inputs
		{
			PowerBICommandBuilder.execute<iPowerBIReport>(apiUrl, "POST",
				[
					new PowerBICommandInput("Name of new report", "FREE_TEXT", "name", false, "The new report name"),
					new PowerBICommandInput("Target Dataset", "DATASET_SELECTOR", "targetModelId", true, "Optional. Parameter for specifying the target associated dataset ID. If not provided, the new report will be associated with the same dataset as the source report."),
					new PowerBICommandInput("Target Workspace", "WORKSPACE_SELECTOR", "targetWorkspaceId", true, "Optional. Parameter for specifying the target workspace ID. An empty GUID (00000000-0000-0000-0000-000000000000) indicates My workspace. If this parameter isn't provided, the new report will be cloned within the same workspace as the source report.")
				]);
		}
		else {
			PowerBIApiService.post(apiUrl, settings);
		}
	}

	public async rebind(settings: object = undefined): Promise<void> {
		const apiUrl = this.apiPath + "/Rebind";
		if (settings == undefined) // prompt user for inputs
		{
			PowerBICommandBuilder.execute<iPowerBIReport>(apiUrl, "POST",
				[
					new PowerBICommandInput("Target Dataset", "DATASET_SELECTOR", "datasetId", false, "The new dataset for the rebound report. If the dataset resides in a different workspace than the report, a shared dataset will be created in the report's workspace.")
				]);
		}
		else {
			PowerBIApiService.post(apiUrl, settings);
		}
	}

	public async updateContent(settings: object = undefined): Promise<void> {
		const apiUrl = this.apiPath + "/UpdateReportContent";
		if (settings == undefined) // prompt user for inputs
		{
			PowerBICommandBuilder.execute<iPowerBIReport>(apiUrl, "POST",
				[
					new PowerBICommandInput("Source Report", "REPORT_SELECTOR", "sourceReport.sourceReportId", false, "An source report."),
					new PowerBICommandInput("Source Report Workspace", "WORKSPACE_SELECTOR", "sourceReport.sourceWorkspaceId", false, "The source workspace."),
					new PowerBICommandInput("Source Report Workspace", "ExistingReport", "sourceType", false, "Use an existing report as the source of the content used to update a target report.")
				]);
		}
		else {
			PowerBIApiService.post(apiUrl, settings);
		}
	}
}