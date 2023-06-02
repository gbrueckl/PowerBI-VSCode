import * as vscode from 'vscode';

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

	private set definition(value: iPowerBIGroup) {
		super.definition = value;
	}

	get isPremiumCapacity(): boolean {
		return this.definition.isOnDedicatedCapacity
	}

	protected getIconPath(theme: string): vscode.Uri {
		let premium = "";
		if(this.isPremiumCapacity) {
			premium = "_premium";
		}
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, this.itemType.toLowerCase() + premium + '.png');
	}

	get apiUrlPart(): string {
		return "groups/" + this.uid;
	}	

	static get MyWorkspace(): iPowerBIGroup
	{
		return {
			"id": "myorg",
			"name": "My Workspace",
			"item_type": "GROUP",
			"isOnDedicatedCapacity": false,
			"isReadOnly": false
		}
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
			const fileUri = vscode.Uri.parse(await fileItem.asString());// "file:///d:/Desktop/DeltaLake_New.pbix"; //await fileItem.asString();
			const fileName = fileUri.path.split("/").pop().split(".")[0];

			let url = this.apiPath + "imports?datasetDisplayName=" + fileName;
			
			
			let importRequest = await PowerBIApiService.postFile(url, fileUri);
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
								name: source.name + " - Clone",
								targetWorkspaceId: this.id == "myorg" ? "00000000-0000-0000-0000-000000000000" : this.id
							});
							
							ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
							break;

						default:
							ThisExtension.setStatusBar("Drag&Drop aborted!");
							ThisExtension.log("Invalid or no action selected!");
					}

					break;

				default:
					ThisExtension.log("No action defined when dropping a " + source.itemType + " on " + this.itemType + "!");
			}
		}
		
	}
	// #endregion

	// Workspace-specific functions
	public async delete(): Promise<void> {
		/*
		ThisExtension.setStatusBar("Deleting workspace ...");
		await PowerBICommandBuilder.execute<iPowerBIGroup>(this.apiPath, "DELETE", []);
		ThisExtension.setStatusBar("Workspace deleted!");
		
		ThisExtension.TreeViewWorkspaces.refresh(false, this.parent);
		*/
		vscode.window.showWarningMessage("For safety-reasons workspaces cannot be deleted using this extension!");
	}
}