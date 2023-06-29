import * as vscode from 'vscode';


import { ThisExtension } from '../../../ThisExtension';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDatasets } from './PowerBIDatasets';
import { PowerBIReports } from './PowerBIReports';
import { PowerBIDashboards } from './PowerBIDashboards';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { PowerBIWorkspace } from './PowerBIWorkspace';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIWorkspacePersonal extends PowerBIWorkspace {
	constructor(
	) {
		super(PowerBIWorkspace.MyWorkspace)

		super.description = null;
		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	/* Overwritten properties from PowerBIApiTreeItem */

	get _contextValue(): string {
		let actions: string[] = [
			"MYWORKSPACE"
		]

		if(this.definition.isOnDedicatedCapacity)
		{
			actions.push("UNASSIGNCAPACITY");
		}
		else
		{
			actions.push("ASSIGNCAPACITY")
		}

		return actions.join(",") + ",";
	}
	protected getIconPath(theme: string): vscode.Uri {
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, this.itemType.toLowerCase() + '.png');
	}

	get apiUrlPart(): string {
		return null;
	}	

	get groupId(): string {
		return "00000000-0000-0000-0000-000000000000";
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		PowerBICommandBuilder.pushQuickPickItem(this);

		let children: PowerBIWorkspaceTreeItem[] = [];
		
		children.push(new PowerBIDatasets(null, this));
		children.push(new PowerBIReports(null, this));
		children.push(new PowerBIDashboards(null, this));
		//children.push(new PowerBIDataflows(null, this)); // there are no dataflows in personal workspaces

		return children;
	}

	// Workspace-specific functions
	public async delete(): Promise<void> {
		vscode.window.showErrorMessage("'" + this.name + "' cannot be deleted!");
	}
}