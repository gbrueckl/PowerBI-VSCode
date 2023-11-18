import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';

import { iPowerBIGroup } from '../../../powerbi/GroupsAPI/_types';
import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDatasets } from './PowerBIDatasets';
import { PowerBIReports } from './PowerBIReports';
import { PowerBIDashboards } from './PowerBIDashboards';
import { PowerBIDataflows } from './PowerBIDataflows';
import { PowerBICommandBuilder, PowerBICommandInput, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { Helper } from '../../../helpers/Helper';
import { iPowerBICapacity } from '../../../powerbi/CapacityAPI/_types';
import { TMDLFSUri } from '../../filesystemProvider/TMDLFSUri';
import { TMDL_SCHEME } from '../../filesystemProvider/TMDLFileSystemProvider';
import { TMDLFSCache } from '../../filesystemProvider/TMDLFSCache';
import { TMDLProxy } from '../../../TMDLVSCode/TMDLProxy';
import { TOMProxyBackup, TOMProxyRestore } from '../../../TMDLVSCode/_typesTOM';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIWorkspace extends PowerBIWorkspaceTreeItem implements TOMProxyRestore {
	constructor(
		definition: iPowerBIGroup
	) {
		super(definition.name, definition.id, "GROUP", definition.id, undefined);

		this.definition = definition;

		super.tooltip = this._tooltip;
		super.contextValue = this._contextValue;

		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = [
			"DELETE"
		]

		if (this.definition.isOnDedicatedCapacity) {
			actions.push("UNASSIGNCAPACITY");
			actions.push("BROWSETMDL");
			actions.push("RESTORE");
		}
		else {
			actions.push("ASSIGNCAPACITY")
		}

		return orig + actions.join(",") + ",";
	}

	get definition(): iPowerBIGroup {
		return super.definition as iPowerBIGroup;
	}

	private set definition(value: iPowerBIGroup) {
		super.definition = value;
	}

	get isPremiumCapacity(): boolean {
		return this.definition.isOnDedicatedCapacity
	}

	get isFabricCapacity(): boolean {
		return false;
		if (!this.isPremiumCapacity) {
			return false;
		}
		return this.definition.sku.startsWith("F");
	}

	async getCapacity(): Promise<iPowerBICapacity> {
		if (!this.isPremiumCapacity) {
			return undefined;
		}

		return await PowerBIApiService.get<iPowerBICapacity>(`v1.0/${PowerBIApiService.Org}/capacities${this.definition.capacityId}`);
	}

	protected getIconPath(theme: string): vscode.Uri {
		let capacityType = "";
		if (this.isPremiumCapacity) {
			capacityType = "_premium";
		}
		if (this.isFabricCapacity) {
			capacityType = "_fabric";
		}
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, this.itemType.toLowerCase() + capacityType + '.png');
	}

	get apiUrlPart(): string {
		return "groups/" + this.uid;
	}

	static get MyWorkspace(): iPowerBIGroup {
		return {
			"id": "myorg",
			"name": "My Workspace",
			"item_type": "GROUP",
			"isOnDedicatedCapacity": false,
			"isReadOnly": false
		}
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		let children: PowerBIWorkspaceTreeItem[] = [];

		children.push(new PowerBIDatasets(this.uid, this));
		children.push(new PowerBIReports(this.uid, this));
		children.push(new PowerBIDashboards(this.uid, this));
		children.push(new PowerBIDataflows(this.uid, this));

		return children;
	}

	// Workspace-specific functions
	public static async assignToCapacity(workspace: PowerBIWorkspace, settings: object = undefined): Promise<void> {
		const apiUrl = Helper.joinPath(workspace.apiPath, "AssignToCapacity");

		let confirm: string = await PowerBICommandBuilder.showInputBox("", "Confirm assignment to capacity by typeing the Workspace name '" + workspace.name + "' again.", undefined, undefined);

		if (!confirm || confirm != workspace.name) {
			ThisExtension.log("Assignment to capacity aborted!")
			return;
		}

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

	public static async unassignFromCapacity(workspace: PowerBIWorkspace): Promise<void> {
		const apiUrl = Helper.joinPath(workspace.apiPath, "AssignToCapacity");

		let confirm: string = await PowerBICommandBuilder.showInputBox("", "Confirm unassignment from capacity by typeing the Workspace name '" + workspace.name + "' again.", undefined, undefined);

		if (!confirm || confirm != workspace.name) {
			ThisExtension.log("Unassignment from capacity aborted!")
			return;
		}

		let settings: object = { "capacityId": "00000000-0000-0000-0000-000000000000" };

		PowerBIApiService.post(apiUrl, settings);

		ThisExtension.TreeViewWorkspaces.refresh(workspace.parent, false);
		ThisExtension.TreeViewCapacities.refresh(null, false);
	}

	public async browseTMDL(): Promise<void> {
		const tmdlUri = new TMDLFSUri(vscode.Uri.parse(`${TMDL_SCHEME}:/powerbi/${this.name}`))

		await Helper.addToWorkspace(tmdlUri.uri, `TMDL - Workspace ${this.name}`);

		await vscode.commands.executeCommand("workbench.files.action.focusFilesExplorer", tmdlUri.uri);
	}

	public async restore(): Promise<void> {
		const backupFileName = await PowerBICommandBuilder.showInputBox(this.name + ".abf", "Enter the name of the backup file", undefined);
		if (!backupFileName) {
			Helper.showTemporaryInformationMessage("Restore aborted!");
			return;
		}

		const targetDatasetName = await PowerBICommandBuilder.showInputBox(backupFileName.replace(".abf", ""), "Enter the name of the target database", undefined);
		if (!backupFileName) {
			Helper.showTemporaryInformationMessage("Restore aborted!");
			return;
		}

		const allowOverwrite = await PowerBICommandBuilder.showQuickPick([new PowerBIQuickPickItem("yes"), new PowerBIQuickPickItem("no")], `Overwrite existing database (if exists)?`, undefined, undefined);
		if (!allowOverwrite) {
			Helper.showTemporaryInformationMessage("Restore aborted!");
			return;
		}
		await TMDLProxy.restore(backupFileName, this.name, targetDatasetName, allowOverwrite == "yes");

		ThisExtension.TreeViewWorkspaces.refresh(this, false);
	}
}