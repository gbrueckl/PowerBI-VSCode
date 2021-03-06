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
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { iHandleDrop } from './PowerBIWorkspacesDragAndDropController';
import { URL } from 'url';
import { PowerBIReport } from './PowerBIReport';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIWorkspace extends PowerBIWorkspaceTreeItem implements iHandleDrop {
	constructor(
		definition: iPowerBIGroup
	) {
		super(definition.name, definition.id, "GROUP", definition.id, undefined);

		this.definition = definition;
		
		super.tooltip = this._tooltip;

		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIGroup {
		return super.definition as iPowerBIGroup;
	}

	set definition(value: iPowerBIGroup) {
		super.definition = value;
	}

	get isPremiumCapacity(): boolean {
		return this.definition.isOnDedicatedCapacity
	}

	protected getIconPath(theme: string): string {
		let premium = "";
		if(this.isPremiumCapacity) {
			premium = "_premium";
		}
		return fspath.join(ThisExtension.rootPath, 'resources', theme, this.itemType.toLowerCase() + premium + '.png');
	}	

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		PowerBICommandBuilder.pushQuickPickItem(this);

		let children: PowerBIWorkspaceTreeItem[] = [];
		
		children.push(new PowerBIDatasets(this.uid, this));
		children.push(new PowerBIReports(this.uid, this));
		children.push(new PowerBIDashboards(this.uid, this));
		children.push(new PowerBIDataflows(this.uid, this));

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
			const fileUri = new URL(await fileItem.asString());// "file:///d:/Desktop/DeltaLake_New.pbix"; //await fileItem.asString();
			const fileName = fileUri.pathname.split("/").pop().split(".")[0];

			let url = this.apiPath + "/imports?datasetDisplayName=" + fileName;
			
			let importRequest = await PowerBIApiService.postFile(url, fileUri);

			importRequest.then(function (body) {
				ThisExtension.log('success! ', body);
			})
				.catch(function (err) {
				ThisExtension.log('error', err);
			});
		}

		if(transferItem)
		{
			const sourceItems: PowerBIWorkspaceTreeItem[] = transferItem.value;

			const source = sourceItems[0];

			switch (source.itemType) {
				case "REPORT":
					const action: string = await PowerBICommandBuilder.showQuickPick([new PowerBIQuickPickItem("clone")], "Action");

					switch (action) {
						case "clone":
							await (source as PowerBIReport).clone({
								name: source.name,
								targetWorkspaceId: this.id
							});
							
							ThisExtension.TreeViewWorkspaces.refresh(false, this);
							break;

						default:
							ThisExtension.log("Invalid or no action selected!");
					}

					break;

				default:
					ThisExtension.log("No action defined when dropping a " + source.itemType + " on " + this.itemType + "!");
			}
		}
		
	}
	// #endregion

	// Workspace-specific funtions
	public async delete(): Promise<void> {
		await PowerBICommandBuilder.execute<iPowerBIGroup>(this.apiPath, "DELETE", []);
		
		ThisExtension.TreeViewWorkspaces.refresh(false, this.parent);
	}
}