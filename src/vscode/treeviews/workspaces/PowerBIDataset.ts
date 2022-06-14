import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDataset } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIReport } from './PowerBIReport';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataset extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDataset,
		group: UniqueId
	) {
		super(definition.name, group, "DATASET", definition.id, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;

		super.tooltip = this._tooltip;
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
				const action: string = await PowerBICommandBuilder.showQuickPick([new PowerBIQuickPickItem("rebind")], "Action");

				switch (action) {
					case "rebind":
						(source as PowerBIReport).rebind({
							datasetId: this.id
						});
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
		PowerBICommandBuilder.execute<iPowerBIDataset>(this.apiPath, "DELETE", []);
	}
	
	public async refresh(): Promise<void> {
		PowerBIApiService.post(this.apiPath + "/refreshes", null);
	}

	public async takeOver(): Promise<void> {
		PowerBIApiService.post(this.apiPath + "/Default.TakeOver", null);
	}
}