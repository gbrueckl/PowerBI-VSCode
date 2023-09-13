import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDataflow } from '../../../powerbi/DataflowsAPI/_types';
import { UniqueId } from '../../../helpers/Helper';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataflow extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDataflow,
		group: UniqueId,
		parent: PowerBIWorkspaceTreeItem
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

	private set definition(value: iPowerBIDataflow) {
		super.definition = value;
	}
	// Dataflow-specific funtions
	public async delete(): Promise<void> {
		await PowerBIApiTreeItem.delete(this, "yesNo");
		
		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public async refresh(): Promise<void> {
		ThisExtension.setStatusBar("Triggering dataflow-refresh ...", true);
		// Provide required notifyOption 
		let body = {
			"notifyOption": "MailOnFailure"
		}
		PowerBIApiService.post(this.apiPath + "refreshes", body);
		ThisExtension.setStatusBar("Dataflow-refresh triggered");
	}

}