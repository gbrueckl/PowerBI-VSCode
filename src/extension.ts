'use strict';

import * as vscode from 'vscode';

import { PowerBICommandBuilder } from './powerbi/CommandBuilder';
import { ThisExtension } from './ThisExtension';
import { TMDLProxy } from './TMDLVSCode/TMDLProxy';

import { PowerBICapacitiesTreeProvider } from './vscode/treeviews/Capacities/PowerBICapacitesTreeProvider';
import { PowerBIGatewaysTreeProvider } from './vscode/treeviews/Gateways/PowerBIGatewaysTreeProvider';
import { PowerBIPipelinesTreeProvider } from './vscode/treeviews/Pipelines/PowerBIPipelinesTreeProvider';
import { PowerBIApiTreeItem } from './vscode/treeviews/PowerBIApiTreeItem';
import { PowerBIDashboard } from './vscode/treeviews/workspaces/PowerBIDashboard';
import { PowerBIDataflow } from './vscode/treeviews/workspaces/PowerBIDataflow';
import { PowerBIDataset } from './vscode/treeviews/workspaces/PowerBIDataset';
import { PowerBIParameter } from './vscode/treeviews/workspaces/PowerBIParameter';
import { PowerBIDatasetRefresh } from './vscode/treeviews/workspaces/PowerBIDatasetRefresh';
import { PowerBIReport } from './vscode/treeviews/workspaces/PowerBIReport';
import { PowerBIWorkspace } from './vscode/treeviews/workspaces/PowerBIWorkspace';
import { PowerBIWorkspacesTreeProvider } from './vscode/treeviews/workspaces/PowerBIWorkspacesTreeProvider';
import { PowerBIWorkspaceTreeItem } from './vscode/treeviews/workspaces/PowerBIWorkspaceTreeItem';
import { PowerBINotebookSerializer } from './vscode/notebook/PowerBINotebookSerializer';
import { PowerBIAPICompletionProvider } from './vscode/language/PowerBIAPICompletionProvider';
import { PowerBICapacityTreeItem } from './vscode/treeviews/Capacities/PowerBICapacityTreeItem';
import { PowerBIGatewayTreeItem } from './vscode/treeviews/Gateways/PowerBIGatewayTreeItem';
import { PowerBIPipelineTreeItem } from './vscode/treeviews/Pipelines/PowerBIPipelineTreeItem';
import { PowerBIPipelineStage } from './vscode/treeviews/Pipelines/PowerBIPipelineStage';
import { PowerBIPipeline } from './vscode/treeviews/Pipelines/PowerBIPipeline';
import { PowerBIConfiguration } from './vscode/configuration/PowerBIConfiguration';
import { TMDL_SCHEME, TMDLFileSystemProvider } from './vscode/filesystemProvider/TMDLFileSystemProvider';
import { TMDLFSUri } from './vscode/filesystemProvider/TMDLFSUri';
import { EventHandlers } from './EventHandlers';
import { TMDLFSCache } from './vscode/filesystemProvider/TMDLFSCache';
import { PowerBIDataflowTransaction } from './vscode/treeviews/workspaces/PowerBIDataflowTransaction';
import { PowerBICapacityWorkload } from './vscode/treeviews/Capacities/PowerBICapacityWorkload';
import { TOMProxyBackup, TOMProxyRestore } from './TMDLVSCode/_typesTOM';


export async function activate(context: vscode.ExtensionContext) {

	await ThisExtension.initializeLogger(context);

	// some of the following code needs the context before the initialization already
	ThisExtension.extensionContext = context;

	ThisExtension.StatusBar = vscode.window.createStatusBarItem("powerbi-vscode", vscode.StatusBarAlignment.Right);
	ThisExtension.StatusBar.show();
	ThisExtension.setStatusBar("Initialized!");

	context.subscriptions.push(
		vscode.workspace.registerNotebookSerializer(
			'powerbi-notebook', new PowerBINotebookSerializer(), { transientOutputs: true }
		)
	);

	const completionProvider = new PowerBIAPICompletionProvider(context);
	completionProvider.loadSwaggerFile();

	vscode.commands.registerCommand('PowerBI.updateQuickPickList', (treeItem: PowerBIApiTreeItem) => PowerBICommandBuilder.pushQuickPickItem(treeItem));
	vscode.commands.registerCommand('PowerBI.openNewNotebook', (treeItem: PowerBIApiTreeItem) => PowerBINotebookSerializer.openNewNotebook(treeItem));

	// generic commands all Treeviews
	vscode.commands.registerCommand('PowerBIItem.openInBrowser', (treeItem: PowerBIApiTreeItem) => treeItem.openInBrowser());
	vscode.commands.registerCommand('PowerBIItem.copyIdToClipboard', (treeItem: PowerBIApiTreeItem) => treeItem.copyIdToClipboard());
	vscode.commands.registerCommand('PowerBIItem.copyNameToClipboard', (treeItem: PowerBIApiTreeItem) => treeItem.copyNameToClipboard());
	vscode.commands.registerCommand('PowerBIItem.copyPathToClipboard', (treeItem: PowerBIApiTreeItem) => treeItem.copyPathToClipboard());

	// register PowerBIWorkspacesTreeProvider
	let pbiWorkspacesTreeProvider = new PowerBIWorkspacesTreeProvider(context);
	//vscode.window.registerTreeDataProvider('PowerBIWorkspaces', pbiWorkspacesTreeProvider); / done in constructor which also adds Drag&Drop Controller
	vscode.commands.registerCommand('PowerBIWorkspaces.refresh', (item: PowerBIWorkspaceTreeItem = undefined, showInfoMessage: boolean = true) => pbiWorkspacesTreeProvider.refresh(item, showInfoMessage));

	vscode.commands.registerCommand('PowerBI.TOM.backup', (item:  TOMProxyBackup ) => item.backup()); 
	vscode.commands.registerCommand('PowerBI.TOM.restore', (item: TOMProxyRestore) => item.restore()); 

	vscode.commands.registerCommand('PowerBIWorkspace.assignToCapacity', (workspace: PowerBIWorkspace) => PowerBIWorkspace.assignToCapacity(workspace));
	vscode.commands.registerCommand('PowerBIWorkspace.unassignFromCapacity', (workspace: PowerBIWorkspace) => PowerBIWorkspace.unassignFromCapacity(workspace));
	vscode.commands.registerCommand('PowerBIWorkspace.browseTMDL', (workspace: PowerBIWorkspace) => workspace.browseTMDL());
	// generic commands
	vscode.commands.registerCommand('PowerBIWorkspace.insertPath', (workspaceItem: PowerBIWorkspaceTreeItem) => workspaceItem.insertCode());

	// Dataset commands
	vscode.commands.registerCommand('PowerBIDataset.takeOver', (dataset: PowerBIDataset) => dataset.takeOver());
	vscode.commands.registerCommand('PowerBIDataset.delete', (dataset: PowerBIDataset) => dataset.delete());
	vscode.commands.registerCommand('PowerBIDataset.refresh', (dataset: PowerBIDataset) => dataset.refresh());
	vscode.commands.registerCommand('PowerBIDatasetRefresh.cancel', (refresh: PowerBIDatasetRefresh) => refresh.cancel());
	vscode.commands.registerCommand('PowerBIDataset.showRefresh', async (refresh: PowerBIDatasetRefresh) => refresh.showDefinition());
	vscode.commands.registerCommand('PowerBIDataset.updateAllParameters', (dataset: PowerBIDataset) => dataset.updateAllParameters());
	vscode.commands.registerCommand('PowerBIDataset.configureScaleOut', (dataset: PowerBIDataset) => dataset.configureScaleOut());
	vscode.commands.registerCommand('PowerBIDataset.syncReadOnlyReplicas', (dataset: PowerBIDataset) => dataset.syncReadOnlyReplicas());
	vscode.commands.registerCommand('PowerBIDataset.editTMDL', (dataset: PowerBIDataset) => dataset.editTMDL());
	// DatasetParameter commands
	vscode.commands.registerCommand('PowerBIDatasetParameter.update', (parameter: PowerBIParameter) => parameter.update());



	// Report commands
	vscode.commands.registerCommand('PowerBIReport.takeOver', (report: PowerBIReport) => report.takeOver());
	vscode.commands.registerCommand('PowerBIReport.delete', (report: PowerBIReport) => report.delete());
	vscode.commands.registerCommand('PowerBIReport.clone', (report: PowerBIReport) => PowerBIReport.clone(report));
	vscode.commands.registerCommand('PowerBIReport.rebind', (report: PowerBIReport) => PowerBIReport.rebind(report));
	vscode.commands.registerCommand('PowerBIReport.updateContent', (report: PowerBIReport) => PowerBIReport.updateContent(report));

	// Dataflow commands
	vscode.commands.registerCommand('PowerBIDataflow.delete', (dataflow: PowerBIDataflow) => dataflow.delete());
	vscode.commands.registerCommand('PowerBIDataflow.refresh', (dataflow: PowerBIDataflow) => dataflow.refresh());
	vscode.commands.registerCommand('PowerBIDataflowTransaction.cancel', (transaction: PowerBIDataflowTransaction) => transaction.cancel());

	// Dashboard commands
	vscode.commands.registerCommand('PowerBIDashboard.delete', (dashboard: PowerBIDashboard) => dashboard.delete());


	// register PowerBICapacitiesTreeProvider
	let pbiCapacitiesTreeProvider = new PowerBICapacitiesTreeProvider(context);
	//vscode.window.registerTreeDataProvider('PowerBICapacities', pbiCapacitiesTreeProvider); // done in constructor which also adds Drag&Drop Controller
	vscode.commands.registerCommand('PowerBICapacities.refresh', (item: PowerBICapacityTreeItem = undefined, showInfoMessage: boolean = true) => pbiCapacitiesTreeProvider.refresh(item, showInfoMessage));
	
	vscode.commands.registerCommand('PowerBICapacityWorkload.update', (workload: PowerBICapacityWorkload) => workload.update());
	

	// register PowerBIGatewaysTreeProvider
	let pbiGatewaysTreeProvider = new PowerBIGatewaysTreeProvider(context);
	//vscode.window.registerTreeDataProvider('PowerBIGateways', pbiGatewaysTreeProvider); // done in constructor which also adds Drag&Drop Controller
	vscode.commands.registerCommand('PowerBIGateways.refresh', (item: PowerBIGatewayTreeItem = undefined, showInfoMessage: boolean = true) => pbiGatewaysTreeProvider.refresh(item, showInfoMessage));


	// register PowerBIPipelinesTreeProvider
	let pbiPipelinesTreeProvider = new PowerBIPipelinesTreeProvider(context);
	//vscode.window.registerTreeDataProvider('PowerBIPipelines', pbiPipelinesTreeProvider); // done in constructor which also adds Drag&Drop Controller
	vscode.commands.registerCommand('PowerBIPipelines.refresh', (item: PowerBIPipelineTreeItem = undefined, showInfoMessage: boolean = true) => pbiPipelinesTreeProvider.refresh(item, showInfoMessage));
	vscode.commands.registerCommand('PowerBIPipelines.add', (item: PowerBIPipelineTreeItem = undefined) => pbiPipelinesTreeProvider.add());
	vscode.commands.registerCommand('PowerBIPipelines.deploySelection', () => pbiPipelinesTreeProvider.deploySelection());

	vscode.commands.registerCommand('PowerBIPipeline.delete', async (item: PowerBIPipeline) => await item.delete());
	vscode.commands.registerCommand('PowerBIPipelineStage.assignWorkspace', (item: PowerBIPipelineStage) => PowerBIPipelineStage.assignWorkspace(item));
	vscode.commands.registerCommand('PowerBIPipelineStage.unassignWorkspace', (item: PowerBIPipelineStage) => PowerBIPipelineStage.unassignWorkspace(item));

	vscode.commands.registerCommand('PowerBI.initialize', async () => {
		let isValidated: boolean = await ThisExtension.initialize(context)
		if (!isValidated) {
			ThisExtension.log("Issue initializing extension - Please update PowerBI settings and restart VSCode!");
			vscode.window.showErrorMessage("Issue initializing extension - Please update PowerBI settings and restart VSCode!");
		}
		return isValidated;
	}
	);

	vscode.commands.executeCommand('PowerBI.initialize');

	// Workspace File System Provider
	if (!ThisExtension.isInBrowser && PowerBIConfiguration.isTMDLEnabled) {
		// if there is exactly one workspace folder with the TMDL scheme, preload the associated database and open the model-file
		let tmdlUri: TMDLFSUri;
		let openModelFile: boolean = false;

		if (vscode.workspace.workspaceFolders) {
			let firstTmdlFolder = vscode.workspace.workspaceFolders.find((folder) => folder.uri.scheme == TMDL_SCHEME);

			if (firstTmdlFolder && vscode.workspace.workspaceFolders.length == 1) {
				tmdlUri = new TMDLFSUri(firstTmdlFolder.uri);
				await TMDLFSCache.loadDatabase(tmdlUri.server, tmdlUri.database); // also calls ensureProxy()
				openModelFile = true;
			}
		}

		//vscode.commands.registerCommand('PowerBI.TMDL.test', () => TMDLProxy.test(undefined));
		TMDLFileSystemProvider.register(context);

		if (openModelFile && tmdlUri) {
			TMDLFileSystemProvider.openModelFile(tmdlUri);
		}
	}
	else {
		ThisExtension.log("TMDL is not enabled! Please use the setting `powerbi.TMDL.enabled` to configure it and use TMDL features");
	}

	// new editor commands for TMDL files
	vscode.commands.registerCommand('PowerBI.TMDL.validate',
		TMDLProxy.validate
	);
	vscode.commands.registerCommand('PowerBI.TMDL.publish',
		TMDLProxy.publish
	);
	vscode.commands.registerCommand('PowerBI.TMDL.load',
		TMDLProxy.load
	);
	vscode.commands.registerCommand('PowerBI.TMDL.saveLocally',
		TMDLProxy.saveLocally
	);

	vscode.commands.registerCommand('PowerBI.TMDL.ensureProxy',
		() => TMDLProxy.ensureProxy(context)
	);

	EventHandlers.init(context);
}


export function deactivate() {
	ThisExtension.cleanUp();
	TMDLProxy.cleanUp();
	TMDLFileSystemProvider.closeOpenTMDLFiles();
}