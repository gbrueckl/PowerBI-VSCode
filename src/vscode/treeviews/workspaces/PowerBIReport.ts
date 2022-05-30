import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIReport } from '../../../powerbi/ReportsAPI/_types';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { unique_id } from '../../../helpers/Helper';
import { PowerBICommandBuilder, PowerBICommandInput } from '../../../powerbi/CommandBuilder';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIReport extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIReport,
		group: unique_id
	) {
		super(definition.name, group, "REPORT", definition.id, vscode.TreeItemCollapsibleState.None);
	}

	// Report-specific funtions
	public async clone(): Promise<void> {

		PowerBICommandBuilder.execute<iPowerBIReport>(this.apiPath + "/Clone",
		[
			new PowerBICommandInput("Name of new report", "FREE_TEXT", "name", false, "The new report name"),
			new PowerBICommandInput("Target Dataset", "DATASET_SELECTOR", "targetModelId", true, "Optional. Parameter for specifying the target associated dataset ID. If not provided, the new report will be associated with the same dataset as the source report."),
			new PowerBICommandInput("Target Workspace", "WORKSPACE_SELECTOR", "targetWorkspaceId", true, "Optional. Parameter for specifying the target workspace ID. An empty GUID (00000000-0000-0000-0000-000000000000) indicates My workspace. If this parameter isn't provided, the new report will be cloned within the same workspace as the source report.")
		]);
	}

	public async rebind(): Promise<void> {

		PowerBICommandBuilder.execute<iPowerBIReport>(this.apiPath + "/Rebind",
		[
			new PowerBICommandInput("Target Dataset", "DATASET_SELECTOR", "datasetId", false, "The new dataset for the rebound report. If the dataset resides in a different workspace than the report, a shared dataset will be created in the report's workspace.")
		]);
	}

	public async updateContent(): Promise<void> {

		PowerBICommandBuilder.execute<iPowerBIReport>(this.apiPath + "/UpdateReportContent",
		[
			new PowerBICommandInput("Source Report", "REPORT_SELECTOR", "sourceReport.sourceReportId", false, "An source report."),
			new PowerBICommandInput("Source Report Workspace", "WORKSPACE_SELECTOR", "sourceReport.sourceWorkspaceId", false, "The source workspace."),
			new PowerBICommandInput("Source Report Workspace", "ExistingReport", "sourceType", false, "Use an existing report as the source of the content used to update a target report.")
		]);
	}
}