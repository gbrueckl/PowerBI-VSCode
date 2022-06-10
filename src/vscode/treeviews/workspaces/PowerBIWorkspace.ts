import * as vscode from 'vscode';
import * as fspath from 'path';
import * as fs from 'fs';

import { Helper } from '../../../helpers/Helper';
import { ThisExtension } from '../../../ThisExtension';

import { iPowerBIGroup } from '../../../powerbi/GroupsAPI/_types';
import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDatasets } from './PowerBIDatasets';
import { PowerBIReports } from './PowerBIReports';
import { PowerBIDashboards } from './PowerBIDashboards';
import { PowerBIDataflows } from './PowerBIDataflows';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { iHandleDrop } from './PowerBIWorkspacesDragAndDropController';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIWorkspace extends PowerBIWorkspaceTreeItem implements iHandleDrop {
	constructor(
		definition: iPowerBIGroup
	) {
		super(definition.name, definition.id, "GROUP", definition.id);
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		PowerBICommandBuilder.pushQuickPickItem(this);

		let children: PowerBIWorkspaceTreeItem[] = [];
		
		children.push(new PowerBIDatasets(this.uid));
		children.push(new PowerBIReports(this.uid));
		children.push(new PowerBIDashboards(this.uid));
		children.push(new PowerBIDataflows(this.uid));

		return children;
	}
	
	// #region iHandleDrop implementation
	public async handleDrop(dataTransfer: vscode.DataTransfer): Promise<void> {
		const transferItem = dataTransfer.get('application/vnd.code.tree.powerbiworkspaces');
		const fileItem = dataTransfer.get('text/uri-list');
		if (!transferItem && !fileItem) {
			ThisExtension.log("Item dropped on PowerBI Workspace Tree-View - but MimeType 'application/vnd.code.tree.powerbiworkspaces' was not found!");
			return;
		}

		if(fileItem)
		{
			const fileUri = await fileItem.asString();
			const fileName = fileUri.split("/").pop().split(".")[0];

			let url = this.apiPath + "/imports?datasetDisplayName=" + fileName;
			
			let importRequest = PowerBIApiService.post(url, fs.createReadStream(fileUri), {'Content-Type': 'multipart/form-data'});

			importRequest.then(function (body) {
				ThisExtension.log('success! ', body);
			})
				.catch(function (err) {
				ThisExtension.log('error', err);
			});
		}
		
	}
	// #endregion

	// Workspace-specific funtions
	public async delete(): Promise<void> {
		PowerBICommandBuilder.execute<iPowerBIGroup>(this.apiPath, "DELETE", []);
	}
}