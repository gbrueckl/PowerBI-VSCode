import * as vscode from 'vscode';
import * as fspath from 'path';

import { Helper } from '../../../helpers/Helper';
import { ThisExtension } from '../../../ThisExtension';

import { iPowerBIGroup } from '../../../powerbi/GroupsAPI/_types';
import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDatasets } from './PowerBIDatasets';
import { PowerBIReports } from './PowerBIReports';
import { PowerBIDashboards } from './PowerBIDashboards';
import { PowerBIDataflows } from './PowerBIDataflows';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIWorkspace extends PowerBIWorkspaceTreeItem {
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
}