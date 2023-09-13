import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIReport } from '../../../powerbi/ReportsAPI/_types';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBICommandBuilder, PowerBICommandInput, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIReport extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIReport,
		group: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super(definition.name, group, "REPORT", definition.id, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;

		super.tooltip = this._tooltip;
		super.contextValue = this._contextValue;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = [
			"DELETE"
		]

		if (this.definition.reportType == "PaginatedReport") {
			if(!this.definition.isOwnedByMe)
			{
				actions.push("TAKEOVER")
			}
		}
		if (this.definition.reportType == "PowerBIReport") {
			actions.push("CLONE")
			actions.push("REBIND")
			actions.push("UPDATECONTENT")
		}

		return orig + actions.join(",") + ",";
	}

	get definition(): iPowerBIReport {
		return super.definition as iPowerBIReport;
	}

	private set definition(value: iPowerBIReport) {
		super.definition = value;
	}

	// Report-specific funtions
	public async takeOver(): Promise<void> {
		ThisExtension.setStatusBar("Taking over report ...", true);
		const apiUrl =  Helper.joinPath(this.apiPath, "Default.TakeOver");

		PowerBIApiService.post(apiUrl, null);
		ThisExtension.setStatusBar("Report taken over!");

		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public async delete(): Promise<void> {
		await PowerBIApiTreeItem.delete(this, "yesNo");
		
		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public static async clone(report: PowerBIReport, settings: object = undefined): Promise<void> {
		const apiUrl =  Helper.joinPath(report.apiPath, "Clone");
		
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

		ThisExtension.TreeViewWorkspaces.refresh(report.parent, false);
	}

	public static async rebind(report: PowerBIReport, settings: object = undefined): Promise<void> {
		const apiUrl =  Helper.joinPath(report.apiPath, "Rebind");

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

		ThisExtension.TreeViewWorkspaces.refresh(report.parent, false);
	}

	public static async updateContent(report: PowerBIReport, settings: object = undefined): Promise<void> {
		const apiUrl =  Helper.joinPath(report.apiPath, "UpdateReportContent");

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

		ThisExtension.TreeViewWorkspaces.refresh(report.parent, false);
	}
}