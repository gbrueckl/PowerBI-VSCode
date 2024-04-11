import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';

import { PowerBICommandBuilder, PowerBICommandInput } from '../../../powerbi/CommandBuilder';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { Helper } from '../../../helpers/Helper';
import { TMDLFSUri } from '../../filesystemProvider/TMDLFSUri';
import { TMDL_SCHEME } from '../../filesystemProvider/TMDLFileSystemProvider';

import { FabricWorkspaceTreeItem } from './FabricWorkspaceTreeItem';
import { FabricLakehouses } from './FabricLakehouses';
import { FabricApiItemType, FabricApiWorkspaceType, iFabricApiCapacity, iFabricApiWorkspace } from '../../../fabric/_types';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { FABRIC_SCHEME } from '../../filesystemProvider/fabric/FabricFileSystemProvider';
import { FabricFSUri } from '../../filesystemProvider/fabric/FabricFSUri';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class FabricWorkspace extends FabricWorkspaceTreeItem {
	private _workspaceDefinition: iFabricApiWorkspace;
	constructor(
		definition: iFabricApiWorkspace
	) {
		super(definition.displayName, definition.id, FabricApiItemType.Workspace, definition.id, undefined, definition.description);

		this._workspaceDefinition = definition;
		this.definition = {
			"description": definition.description,
			"displayName": definition.displayName,
			"id": definition.id,	
			"type": FabricApiItemType.Workspace,
			"workspaceId": definition.id,
		};

		this.contextValue = this._contextValue;

		this.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	/* Overwritten properties from FabricApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = []

		if (this.capacityId) {
			actions.push("UNASSIGNCAPACITY");
		}
		else {
			actions.push("ASSIGNCAPACITY")
		}

		return orig + actions.join(",") + ",";
	}

	async getChildren(element?: FabricWorkspaceTreeItem): Promise<FabricWorkspaceTreeItem[]> {
		let children: FabricWorkspaceTreeItem[] = [];

		children.push(new FabricLakehouses(this.itemId, this));

		return children;
	}

	protected getIconPath(theme: string): vscode.Uri {
		let capacityType = "";
		if (this.capacityId) {
			capacityType = "_premium";
		}
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, "group" + capacityType + '.png');
	}

	get apiUrlPart(): string {
		return "workspaces/" + this.workspaceId;
	}

	get capacityId(): string {
		return this._workspaceDefinition.capacityId;
	}

	get workspaceType(): FabricApiWorkspaceType {
		return this._workspaceDefinition.type as FabricApiWorkspaceType;
	}

	// Workspace-specific functions
	async getCapacity(): Promise<iFabricApiCapacity> {
		if (!this.capacityId) {
			return undefined;
		}

		return (await FabricApiService.get<iFabricApiCapacity>(`/v1/capacities${this.capacityId}`)).success;
	}

	// static get MyWorkspace(): FabricWorkspace {
	// 	return new FabricWorkspace({
	// 		"id": "myorg",
	// 		"displayName": "My Workspace"
	// 	})
	// }

	// Workspace-specific functions
	public static async assignToCapacity(workspace: FabricWorkspace, settings: object = undefined): Promise<void> {
		const apiUrl = Helper.joinPath(workspace.apiPath, "AssignToCapacity");

		let confirm: string = await PowerBICommandBuilder.showInputBox("", "Confirm assignment to capacity by typeing the Workspace name '" + workspace.displayName + "' again.", undefined, undefined);

		if (!confirm || confirm != workspace.displayName) {
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

		ThisExtension.TreeViewFabric.refresh(workspace.parent, false);
		ThisExtension.TreeViewCapacities.refresh(null, false);
	}

	public static async unassignFromCapacity(workspace: FabricWorkspace): Promise<void> {
		const apiUrl = Helper.joinPath(workspace.apiPath, "AssignToCapacity");

		let confirm: string = await PowerBICommandBuilder.showInputBox("", "Confirm unassignment from capacity by typeing the Workspace name '" + workspace.displayName + "' again.", undefined, undefined);

		if (!confirm || confirm != workspace.displayName) {
			ThisExtension.log("Unassignment from capacity aborted!")
			return;
		}

		let settings: object = { "capacityId": "00000000-0000-0000-0000-000000000000" };

		PowerBIApiService.post(apiUrl, settings);

		ThisExtension.TreeViewFabric.refresh(workspace.parent, false);
		ThisExtension.TreeViewCapacities.refresh(null, false);
	}

	public async browseFabric(): Promise<void> {
		const fabricUri = new FabricFSUri(vscode.Uri.parse(`${FABRIC_SCHEME}://${this.workspaceId}`))

		await Helper.addToWorkspace(fabricUri.uri, `Fabric - Workspace ${this.displayName}`);

		await vscode.commands.executeCommand("workbench.files.action.focusFilesExplorer", fabricUri.uri);
	}
}