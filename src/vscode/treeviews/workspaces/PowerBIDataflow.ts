import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDataflow } from '../../../powerbi/DataflowsAPI/_types';
import { UniqueId } from '../../../helpers/Helper';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataflow extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDataflow,
		group: UniqueId
	) {
		super(definition.name, group, "DATAFLOW", definition.id, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;

		super.tooltip = this._tooltip;
	}

	// Dataflow-specific funtions
	public async delete(): Promise<void> {
		PowerBICommandBuilder.execute<iPowerBIDataflow>(this.apiPath, "DELETE", []);
	}
}