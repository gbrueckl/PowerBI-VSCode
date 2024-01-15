import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDataset, iPowerBIDatasetRefresh } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIDatasetRefresh } from './PowerBIDatasetRefresh';
import { ThisExtension } from '../../../ThisExtension';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetRefreshes extends PowerBIWorkspaceTreeItem {

	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super("Refreshes", groupId, "DATASETREFRESHES", groupId, parent);

		// the groupId is not unique for logical folders hence we make it unique
		this.id = groupId + "/" + this.parent.uid + "/" + this.itemType.toString();
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		return undefined;
	}

	// description is show next to the label
	get _description(): string {
		return undefined;
	}

	get apiUrlPart(): string {
		return "refreshes";
	}

	get dataset(): PowerBIDataset {
		return this.parent as PowerBIDataset;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if (!PowerBIApiService.isInitialized) {
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIDatasetRefresh[] = [];

			try {


				let items: iPowerBIDatasetRefresh[] = await PowerBIApiService.getItemList<iPowerBIDatasetRefresh>(this.apiPath, undefined, null);

				for (let item of items) {
					let treeItem = new PowerBIDatasetRefresh(item, this.groupId, this);
					children.push(treeItem);
					PowerBICommandBuilder.pushQuickPickItem(treeItem);
				}
			}
			catch (e) {
				ThisExtension.log("No refreshes found for dataset " + this.dataset.name);
			}

			return children;
		}
	}
}