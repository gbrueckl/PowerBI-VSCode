import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';

import { iPowerBIGroup } from '../../../powerbi/GroupsAPI/_types';
import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDatasets } from './PowerBIDatasets';
import { PowerBIReports } from './PowerBIReports';
import { PowerBIDashboards } from './PowerBIDashboards';
import { PowerBIDataflows } from './PowerBIDataflows';
import { PowerBICommandBuilder, PowerBICommandInput } from '../../../powerbi/CommandBuilder';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIWorkspace extends PowerBIWorkspaceTreeItem {
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

	public static async assignToCapacity(workspace: PowerBIWorkspace, settings: object = undefined): Promise<void> {
		const apiUrl = workspace.apiPath + "/AssignToCapacity";
		if (settings == undefined) // prompt user for inputs
		{
			PowerBICommandBuilder.execute<any>(apiUrl, "POST",
				[
					new PowerBICommandInput("Capacity", "CAPACITY_SELECTOR", "capacityId", true, "The capacity ID. To unassign from a capacity, use an empty GUID (00000000-0000-0000-0000-000000000000).")
				]);
		}
		else {
			PowerBIApiService.post(apiUrl, settings);
		}

		ThisExtension.TreeViewWorkspaces.refresh(workspace.parent, false);
		ThisExtension.TreeViewCapacities.refresh(null, false);
	}
}