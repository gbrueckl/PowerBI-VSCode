'use strict';

import * as vscode from 'vscode';
import { PowerBICommandBuilder, PowerBICommandInput } from './powerbi/CommandBuilder';
import { ThisExtension } from './ThisExtension';
import { PowerBICapacitiesTreeProvider } from './vscode/treeviews/Capacities/PowerBICapacitesTreeProvider';
import { PowerBIGatewaysTreeProvider } from './vscode/treeviews/Gateways/PowerBIGatewaysTreeProvider';
import { PowerBIDashboard } from './vscode/treeviews/workspaces/PowerBIDashboard';
import { PowerBIDataflow } from './vscode/treeviews/workspaces/PowerBIDataflow';
import { PowerBIDataset } from './vscode/treeviews/workspaces/PowerBIDataset';
import { PowerBIReport } from './vscode/treeviews/workspaces/PowerBIReport';

import { PowerBIWorkspacesTreeProvider } from './vscode/treeviews/workspaces/PowerBIWorkspacesTreeProvider';
import { PowerBIWorkspaceTreeItem } from './vscode/treeviews/workspaces/PowerBIWorkspaceTreeItem';

export async function activate(context: vscode.ExtensionContext) {

	let isValidated: boolean = await ThisExtension.initialize(context);
	if (!isValidated) {
		ThisExtension.log("Issue initializing extension - Please update PowerBI settings and restart VSCode!");
		vscode.window.showErrorMessage("Issue initializing extension - Please update PowerBI settings and restart VSCode!");
	}

	vscode.commands.registerCommand('PowerBI.updateQuickPickList', (treeItem: PowerBIWorkspaceTreeItem) => PowerBICommandBuilder.pushQuickPickItem(treeItem));

	// register PowerBIWorkspacesTreeProvider
	let pbiWorkspacesTreeProvider = new PowerBIWorkspacesTreeProvider(context);
	//vscode.window.registerTreeDataProvider('PowerBIWorkspaces', pbiWorkspacesTreeProvider); / done in constructor which also adds Drag&Drop Controller
	vscode.commands.registerCommand('PowerBIWorkspaces.refresh', (showInfoMessage: boolean = true) => pbiWorkspacesTreeProvider.refresh(showInfoMessage));
	//vscode.commands.registerCommand('PowerBIWorkspaces.add', () => pbiWorkspacesTreeProvider.add());

	// Dataset commands
	vscode.commands.registerCommand('PowerBIDataset.delete', (dataset: PowerBIDataset) => dataset.delete());
	vscode.commands.registerCommand('PowerBIDataset.refresh', (dataset: PowerBIDataset) => dataset.refresh());
	vscode.commands.registerCommand('PowerBIDataset.takeOver', (dataset: PowerBIDataset) => dataset.takeOver());

	// Report commands
	vscode.commands.registerCommand('PowerBIReport.delete', (report: PowerBIDataset) => report.delete());
	vscode.commands.registerCommand('PowerBIReport.clone', (report: PowerBIReport) => report.clone());
	vscode.commands.registerCommand('PowerBIReport.rebind', (report: PowerBIReport) => report.rebind());
	vscode.commands.registerCommand('PowerBIReport.updateContent', (report: PowerBIReport) => report.updateContent());

	// Dataflow commands
	vscode.commands.registerCommand('PowerBIDataflow.delete', (dataflow: PowerBIDataflow) => dataflow.delete());

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
}


export function deactivate() {
	ThisExtension.cleanUp();
}