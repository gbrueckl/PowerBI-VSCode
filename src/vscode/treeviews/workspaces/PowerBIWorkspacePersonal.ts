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

	protected getIconPath(theme: string): string {
		return fspath.join(ThisExtension.rootPath, 'resources', theme, this.itemType.toLowerCase() + '.png');
	}

	get apiUrlPart(): string {
		return null;
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