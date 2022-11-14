'use strict';

import * as vscode from 'vscode';
import { PowerBICommandBuilder, PowerBICommandInput } from './powerbi/CommandBuilder';
import { ThisExtension } from './ThisExtension';
import { PowerBICapacitiesTreeProvider } from './vscode/treeviews/Capacities/PowerBICapacitesTreeProvider';
import { PowerBIGatewaysTreeProvider } from './vscode/treeviews/Gateways/PowerBIGatewaysTreeProvider';
import { PowerBIPipelinesTreeProvider } from './vscode/treeviews/Pipelines/PowerBIPipelinesTreeProvider';
import { PowerBIApiTreeItem } from './vscode/treeviews/PowerBIApiTreeItem';
import { PowerBIDashboard } from './vscode/treeviews/workspaces/PowerBIDashboard';
import { PowerBIDataflow } from './vscode/treeviews/workspaces/PowerBIDataflow';
import { PowerBIDataset } from './vscode/treeviews/workspaces/PowerBIDataset';
import { PowerBIParameter } from './vscode/treeviews/workspaces/PowerBIParameter';
import { PowerBIReport } from './vscode/treeviews/workspaces/PowerBIReport';
import { PowerBIWorkspace } from './vscode/treeviews/workspaces/PowerBIWorkspace';

import { PowerBIWorkspacesTreeProvider } from './vscode/treeviews/workspaces/PowerBIWorkspacesTreeProvider';

export async function activate(context: vscode.ExtensionContext) {

	// TODO https://github.com/microsoft/vscode-azureresourcegroups/blob/main/src/utils/azureClients.ts#L12
	
	let isValidated: boolean = await ThisExtension.initialize(context);
	if (!isValidated) {
		ThisExtension.log("Issue initializing extension - Please update PowerBI settings and restart VSCode!");
		vscode.window.showErrorMessage("Issue initializing extension - Please update PowerBI settings and restart VSCode!");
	}

	ThisExtension.StatusBar = vscode.window.createStatusBarItem("powerbi-vscode", vscode.StatusBarAlignment.Right);
	ThisExtension.StatusBar.show();
	ThisExtension.setStatusBar("Initialized!");

	vscode.commands.registerCommand('PowerBI.updateQuickPickList', (treeItem: PowerBIApiTreeItem) => PowerBICommandBuilder.pushQuickPickItem(treeItem));

	// register PowerBIWorkspacesTreeProvider
	let pbiWorkspacesTreeProvider = new PowerBIWorkspacesTreeProvider(context);
	//vscode.window.registerTreeDataProvider('PowerBIWorkspaces', pbiWorkspacesTreeProvider); / done in constructor which also adds Drag&Drop Controller
	vscode.commands.registerCommand('PowerBIWorkspaces.refresh', (showInfoMessage: boolean = true) => pbiWorkspacesTreeProvider.refresh(showInfoMessage));
	//vscode.commands.registerCommand('PowerBIWorkspaces.add', () => pbiWorkspacesTreeProvider.add());
	vscode.commands.registerCommand('PowerBIWorkspace.delete', (workspace: PowerBIWorkspace) => workspace.delete());
	

	// Dataset commands
	vscode.commands.registerCommand('PowerBIDataset.delete', (dataset: PowerBIDataset) => dataset.delete());
	vscode.commands.registerCommand('PowerBIDataset.refresh', (dataset: PowerBIDataset) => dataset.refresh());
	vscode.commands.registerCommand('PowerBIDataset.createKernel', (dataset: PowerBIDataset) => dataset.createKernel());
	vscode.commands.registerCommand('PowerBIDataset.removeKernel', (dataset: PowerBIDataset) => dataset.removeKernel());
	vscode.commands.registerCommand('PowerBIDataset.takeOver', (dataset: PowerBIDataset) => dataset.takeOver());
	vscode.commands.registerCommand('PowerBIDataset.updateAllParameters', (dataset: PowerBIDataset) => dataset.updateAllParameters());

	// DatasetParameter commands
	vscode.commands.registerCommand('PowerBIDatasetParameter.update', (parameter: PowerBIParameter) => parameter.update());

	// Report commands
	vscode.commands.registerCommand('PowerBIReport.delete', (report: PowerBIDataset) => report.delete());
	vscode.commands.registerCommand('PowerBIReport.clone', (report: PowerBIReport) => report.clone());
	vscode.commands.registerCommand('PowerBIReport.rebind', (report: PowerBIReport) => report.rebind());
	vscode.commands.registerCommand('PowerBIReport.updateContent', (report: PowerBIReport) => report.updateContent());

	// Dataflow commands
	vscode.commands.registerCommand('PowerBIDataflow.delete', (dataflow: PowerBIDataflow) => dataflow.delete());
	vscode.commands.registerCommand('PowerBIDataflow.refresh', (dataflow: PowerBIDataflow) => dataflow.refresh());

	// Dashboard commands
	vscode.commands.registerCommand('PowerBIDasjbpard.delete', (dashboard: PowerBIDashboard) => dashboard.delete());


	// register PowerBICapacitiesTreeProvider
	let pbiCapacitiesTreeProvider = new PowerBICapacitiesTreeProvider(context);
	//vscode.window.registerTreeDataProvider('PowerBICapacities', pbiCapacitiesTreeProvider); // done in constructor which also adds Drag&Drop Controller
	vscode.commands.registerCommand('PowerBICapacities.refresh', (showInfoMessage: boolean = true) => pbiCapacitiesTreeProvider.refresh(showInfoMessage));


	// register PowerBIGatewaysTreeProvider
	let pbiGatewaysTreeProvider = new PowerBIGatewaysTreeProvider(context);
	//vscode.window.registerTreeDataProvider('PowerBIGateways', pbiGatewaysTreeProvider); // done in constructor which also adds Drag&Drop Controller
	vscode.commands.registerCommand('PowerBIGateways.refresh', (showInfoMessage: boolean = true) => pbiGatewaysTreeProvider.refresh(showInfoMessage));


	// register PowerBIPipelinesTreeProvider
	let pbiPipelinesTreeProvider = new PowerBIPipelinesTreeProvider(context);
	//vscode.window.registerTreeDataProvider('PowerBIPipelines', pbiPipelinesTreeProvider); // done in constructor which also adds Drag&Drop Controller
	vscode.commands.registerCommand('PowerBIPipelines.refresh', (showInfoMessage: boolean = true) => pbiPipelinesTreeProvider.refresh(showInfoMessage));
}


export function deactivate() {
	ThisExtension.cleanUp();
}