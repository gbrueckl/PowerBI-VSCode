import * as vscode from 'vscode';
import * as fspath from 'path';
import * as fs from 'fs';
import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PowerBIWorkspace } from './PowerBIWorkspace';
import { iPowerBIGroup } from '../../../powerbi/GroupsAPI/_types';


// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBIWorkspacesTreeProvider implements vscode.TreeDataProvider<PowerBIWorkspaceTreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<PowerBIWorkspaceTreeItem | undefined> = new vscode.EventEmitter<PowerBIWorkspaceTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<PowerBIWorkspaceTreeItem | undefined> = this._onDidChangeTreeData.event;

	constructor() { }

	refresh(showInfoMessage: boolean = false): void {
		if (showInfoMessage) {
			vscode.window.showInformationMessage('Refreshing Workspaces ...');
		}
		this._onDidChangeTreeData.fire(null);
	}

	getTreeItem(element: PowerBIWorkspaceTreeItem): PowerBIWorkspaceTreeItem {
		return element;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if(!PowerBIApiService.isInitialized) { 			
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIWorkspace[] = [];
			let items: iPowerBIGroup[] = await PowerBIApiService.getGroups();

			for (let item of items) {
				children.push(new PowerBIWorkspace(item));
			}
			
			return children;
		}
	}

	add(): void {
		
	}
}
