import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';

import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIDataset } from './PowerBIDataset';
import { PowerBIParameter } from './PowerBIParameter';
import { iPowerBIDatasetParameter } from '../../../powerbi/DatasetsAPI/_types';
import { ThisExtension } from '../../../ThisExtension';


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIParameters extends PowerBIWorkspaceTreeItem {

	constructor(
		groupId: UniqueId,
		parent: PowerBIDataset
	) {
		super("Parameters", groupId, "DATASETPARAMETERS", parent.uid, parent);

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
		return "parameters";
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
			let children: PowerBIParameter[] = [];
			try {
				let items: iPowerBIDatasetParameter[] = await PowerBIApiService.getItemList<iPowerBIDatasetParameter>(this.apiPath);
				for (let item of items) {
					let treeItem = new PowerBIParameter(item, this.parent.id, this);
					children.push(treeItem);
					PowerBICommandBuilder.pushQuickPickItem(treeItem);
				}
			}
			catch (e) {
				ThisExtension.log("No parameters found for dataset: " + this.dataset.name);
			}

			return children;
		}
	}
}