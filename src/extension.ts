'use strict';

import * as vscode from 'vscode';
import { ThisExtension } from './ThisExtension';

import { PowerBIWorkspacesTreeProvider } from './vscode/treeviews/workspaces/PowerBIWorkspacesTreeProvider';

export async function activate(context: vscode.ExtensionContext) {

	let isValidated: boolean = await ThisExtension.initialize(context);
	if (!isValidated) {
		ThisExtension.log("Issue initializing extension - Please update PowerBI settings and restart VSCode!");
		vscode.window.showErrorMessage("Issue initializing extension - Please update PowerBI settings and restart VSCode!");
	}

	// register PowerBIWorkspacesTreeProvider
	let pbiWorkspacesTreeProvider = new PowerBIWorkspacesTreeProvider();
	vscode.window.registerTreeDataProvider('PowerBIWorkspaces', pbiWorkspacesTreeProvider);
	vscode.commands.registerCommand('PowerBIWorkspaces.refresh', (showInfoMessage: boolean = true) => pbiWorkspacesTreeProvider.refresh(showInfoMessage));
	//vscode.commands.registerCommand('PowerBIWorkspaces.delete', () => pbiWorkspacesTreeProvider.add());
}


export function deactivate() {
	ThisExtension.cleanUp();
}