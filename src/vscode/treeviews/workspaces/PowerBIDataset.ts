import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDataset } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIReport } from './PowerBIReport';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataset extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDataset,
		group: UniqueId,
		parent: PowerBIApiTreeItem
	) {
		super(definition.name, group, "DATASET", definition.id, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;
		
		super.tooltip = this._tooltip;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIDataset {
		return super.definition as iPowerBIDataset;
	}

	set definition(value: iPowerBIDataset) {
		super.definition = value;
	}

	// #region iHandleDrop implementation
	public async handleDrop(dataTransfer: vscode.DataTransfer): Promise<void> {
		const transferItem = dataTransfer.get('application/vnd.code.tree.powerbiworkspaces');
		if (!transferItem) {
			ThisExtension.log("Item dropped on PowerBI Workspace Tree-View - but MimeType 'application/vnd.code.tree.powerbiworkspaces' was not found!");
			return;
		}
		const sourceItems: PowerBIWorkspaceTreeItem[] = transferItem.value;

		const source = sourceItems[0];

		switch (source.itemType) {
			case "REPORT":
				const action: string = await PowerBICommandBuilder.showQuickPick([new PowerBIQuickPickItem("rebind"), new PowerBIQuickPickItem("clone")], "Action");

				switch (action) {
					case "rebind":
						(source as PowerBIReport).rebind({
							datasetId: this.id
						});
						break;

					case "clone":
							await (source as PowerBIReport).clone({
								name: source.name,
								targetModelId: this.id,
								targetWorkspaceId: this.group
							});
							
							ThisExtension.TreeViewWorkspaces.refresh(false, this.parent.parent);
							break;

					default:
						ThisExtension.log("Invalid or no action selected!");
				}

				break;

			default:
				ThisExtension.log("No action defined when dropping a " + source.itemType + " on " + this.itemType + "!");
		}
	}
	// #endregion

	// Dataset-specific funtions
	public async delete(): Promise<void> {
		await PowerBICommandBuilder.execute<iPowerBIDataset>(this.apiPath, "DELETE", []);

		ThisExtension.TreeViewWorkspaces.refresh(false, this.parent);
	}
	
	public async refresh(): Promise<void> {
		PowerBIApiService.post(this.apiPath + "/refreshes", null);
	}

	public async takeOver(): Promise<void> {
		PowerBIApiService.post(this.apiPath + "/Default.TakeOver", null);

		ThisExtension.TreeViewWorkspaces.refresh(false, this.parent);
	}
}