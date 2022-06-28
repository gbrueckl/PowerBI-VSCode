import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDataflow } from '../../../powerbi/DataflowsAPI/_types';
import { UniqueId } from '../../../helpers/Helper';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { ThisExtension } from '../../../ThisExtension';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataflow extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDataflow,
		group: UniqueId,
		parent: PowerBIApiTreeItem
	) {
		super(definition.name, group, "DATAFLOW", definition.objectId, parent, vscode.TreeItemCollapsibleState.None);

		this.id = definition.objectId;
		this.definition = definition;
		
		super.tooltip = this._tooltip;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIDataflow {
		return super.definition as iPowerBIDataflow;
	}

	set definition(value: iPowerBIDataflow) {
		super.definition = value;
	}
	// Dataflow-specific funtions
	public async delete(): Promise<void> {
		await PowerBICommandBuilder.execute<iPowerBIDataflow>(this.apiPath, "DELETE", []);
		
		ThisExtension.TreeViewWorkspaces.refresh(false, this.parent);
	}
}