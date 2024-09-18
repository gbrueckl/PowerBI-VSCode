import * as vscode from 'vscode';

import { ENVIRONMENT } from '@env/env';

import { PowerBIApiService } from './powerbi/PowerBIApiService';
import { PowerBINotebookKernel } from './vscode/notebook/PowerBINotebookKernel';
import { PowerBICapacitiesTreeProvider } from './vscode/treeviews/Capacities/PowerBICapacitesTreeProvider';
import { PowerBIGatewaysTreeProvider } from './vscode/treeviews/Gateways/PowerBIGatewaysTreeProvider';
import { PowerBIPipelinesTreeProvider } from './vscode/treeviews/Pipelines/PowerBIPipelinesTreeProvider';
import { PowerBIWorkspacesTreeProvider } from './vscode/treeviews/workspaces/PowerBIWorkspacesTreeProvider';
import { PowerBIApiTreeItem } from './vscode/treeviews/PowerBIApiTreeItem';
import { PowerBIConfiguration } from './vscode/configuration/PowerBIConfiguration';
import { TMDLFileSystemProvider, TMDL_EXTENSION, TMDL_SCHEME } from './vscode/filesystemProvider/TMDLFileSystemProvider';
import { TMDLFSUri } from './vscode/filesystemProvider/TMDLFSUri';
import { TMDLProxy } from './TMDLVSCode/TMDLProxy';
import { PowerBINotebookContext } from './vscode/notebook/PowerBINotebookContext';
import { TMDLFSCache } from './vscode/filesystemProvider/TMDLFSCache';


export abstract class EventHandlers {

	static init(context: vscode.ExtensionContext): void {
		vscode.workspace.onDidChangeWorkspaceFolders(async (event) => {
			if(event.added.length == 0)
			{
				return;
			}
			if (event.added[0].uri.scheme == TMDL_SCHEME) {
				const tmdlUri = new TMDLFSUri(event.added[0].uri);

				if(tmdlUri.isServerLevel)
				{
					await TMDLFSCache.loadServer(tmdlUri.server);
				}
				else
				{
					await TMDLFSCache.loadDatabase(tmdlUri.server, tmdlUri.database);
				}
				await vscode.commands.executeCommand("workbench.files.action.focusFilesExplorer", tmdlUri.uri);

				TMDLFileSystemProvider.openModelFile(tmdlUri);
			}
		});

		vscode.workspace.onDidOpenNotebookDocument((e) => {
			const metadata = PowerBINotebookContext.get(e.metadata.guid.toString());

			metadata.uri = e.uri;

			PowerBINotebookContext.set(e.metadata.guid, metadata);
		});

		vscode.workspace.onDidOpenTextDocument((e) => {
			if (e.uri.scheme == TMDL_SCHEME && e.uri.fsPath.endsWith(TMDL_EXTENSION)) {
				TMDLProxy.ensureProxy(context);
			}
		});
	}
}


