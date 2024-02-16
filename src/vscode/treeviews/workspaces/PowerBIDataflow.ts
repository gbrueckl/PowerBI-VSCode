import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDataflow } from '../../../powerbi/DataflowsAPI/_types';
import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PowerBIDataflowTransactions } from './PowerBIDataflowTransactions';
import { PowerBIDataflowDatasources } from './PowerBIDataflowDatasources';
import { PowerBIWorkspace } from './PowerBIWorkspace';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataflow extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDataflow,
		group: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super(definition.name, group, "DATAFLOW", definition.objectId, parent, vscode.TreeItemCollapsibleState.Collapsed);

		this.id = definition.objectId;
		this.definition = definition;
		
		this.tooltip = this._tooltip;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIDataflow {
		return super.definition as iPowerBIDataflow;
	}

	private set definition(value: iPowerBIDataflow) {
		super.definition = value;
	}

	get asQuickPickItem(): PowerBIQuickPickItem {
		const qpItem = new PowerBIQuickPickItem(this.name, this.uid.toString(), this.uid.toString(), `Workspace: ${this.workspace.name} (ID: ${this.workspace.uid})`);
		qpItem.apiItem = this;

		return qpItem;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		let children: PowerBIWorkspaceTreeItem[] = [];

		children.push(new PowerBIDataflowTransactions(this.groupId, this));
		children.push(new PowerBIDataflowDatasources(this.groupId, this));

		return children;
	}

	// Dataflow-specific funtions
	get workspace(): PowerBIWorkspace {
		return this.getParentByType<PowerBIWorkspace>("GROUP");
	}

	public async delete(): Promise<void> {
		await PowerBIApiTreeItem.delete(this, "yesNo");
		
		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public async refresh(): Promise<void> {
		ThisExtension.setStatusBarRight("Triggering dataflow-refresh ...", true);
		// Provide required notifyOption 
		let body = {
			"notifyOption": "MailOnFailure"
		}
		PowerBIApiService.post(this.apiPath + "refreshes", body);
		ThisExtension.setStatusBarRight("Dataflow-refresh triggered");
		Helper.showTemporaryInformationMessage("Dataflow-refresh triggered!", 3000);

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this, false);
	}

}