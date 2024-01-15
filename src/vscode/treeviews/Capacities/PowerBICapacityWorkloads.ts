import * as vscode from 'vscode';

import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBICapacityTreeItem } from './PowerBICapacityTreeItem';
import { iPowerBICapacityWorkload } from '../../../powerbi/CapacityAPI/_types';
import { PowerBICapacityWorkload } from './PowerBICapacityWorkload';


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBICapacityWorkloads extends PowerBICapacityTreeItem {

	constructor(
		parent: PowerBICapacityTreeItem
	) {
		super("Workloads", "Workloads", "CAPACITYWORKLOADS", parent.capacity, parent);

		// the groupId is not unique for logical folders hence we make it unique
		this.id = parent.id + "/" + this.itemType.toString();
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
		return "workloads";
	}

	async getChildren(element?: PowerBICapacityTreeItem): Promise<PowerBICapacityTreeItem[]> {
		if(!PowerBIApiService.isInitialized) { 			
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBICapacityWorkload[] = [];
			let items: iPowerBICapacityWorkload[] = await PowerBIApiService.getItemList<iPowerBICapacityWorkload>(this.apiPath, {}, "name");

			for (let item of items) {
				let treeItem = new PowerBICapacityWorkload(item, this);
				children.push(treeItem);
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}
			
			return children;
		}
	}
}