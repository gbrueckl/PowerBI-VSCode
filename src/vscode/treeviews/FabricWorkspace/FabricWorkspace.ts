import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';

import { FabricWorkspaceTreeItem } from './FabricWorkspaceTreeItem';
import { FabricLakehouses } from './FabricLakehouses';
import { FabricApiItemType, FabricApiWorkspaceType, iFabricApiCapacity, iFabricApiWorkspace } from '../../../fabric/_types';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { FABRIC_SCHEME } from '../../filesystemProvider/fabric/FabricFileSystemProvider';
import { FabricFSUri } from '../../filesystemProvider/fabric/FabricFSUri';
import { FabricDataPipelines } from './FabricDataPipelines';

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
			"type": definition.type,
			"workspaceId": definition.id,
		};

		this.contextValue = this._contextValue;
		this.tooltip = this.getToolTip(this._workspaceDefinition);

		this.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	/* Overwritten properties from FabricApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = ["BROWSEONELAKE"];

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

		children.push(new FabricDataPipelines(this.itemId, this));
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

	get oneLakeUri(): vscode.Uri {
	// onelake:/<WorkspaceName>/<ItemName>.<ItemType>
		const workspace = this.getParentByType<FabricWorkspace>(FabricApiItemType.Workspace);
		
		return vscode.Uri.parse(`onelake://${workspace.displayName}`);
	}

	get apiUrlPart(): string {
		return "workspaces/" + this.workspaceId;
	}

	get capacityId(): string {
		return this._workspaceDefinition?.capacityId;
	}

	get workspaceType(): FabricApiWorkspaceType {
		return FabricApiWorkspaceType[this._workspaceDefinition.type];
	}

	// Workspace-specific functions
	async getCapacity(): Promise<iFabricApiCapacity> {
		if (!this.capacityId) {
			return undefined;
		}

		return (await FabricApiService.get<iFabricApiCapacity>(`/v1/capacities/${this.capacityId}`)).success;
	}

	// static get MyWorkspace(): FabricWorkspace {
	// 	return new FabricWorkspace({
	// 		"id": "myorg",
	// 		"displayName": "My Workspace"
	// 	})
	// }

	// Workspace-specific functions
	public async browseFabric(): Promise<void> {
		const fabricUri = new FabricFSUri(vscode.Uri.parse(`${FABRIC_SCHEME}://${this.workspaceId}`))

		await Helper.addToWorkspace(fabricUri.uri, `Fabric - Workspace ${this.displayName}`, true);
	}
}