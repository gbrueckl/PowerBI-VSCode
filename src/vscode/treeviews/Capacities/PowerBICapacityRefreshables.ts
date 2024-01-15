import * as vscode from 'vscode';

import {  UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBICapacityTreeItem } from './PowerBICapacityTreeItem';
import { PowerBICapacityRefreshable } from './PowerBICapacityRefreshable';
import { iPowerBICapacity, iPowerBICapacityRefreshable } from '../../../powerbi/CapacityAPI/_types';


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBICapacityRefreshables extends PowerBICapacityTreeItem {

	constructor(
		parent: PowerBICapacityTreeItem
	) {
		super("Refreshables", "Refreshables", "CAPACITYREFRESHABLES", parent.capacity, parent);

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
		return "refreshables";
	}

	async getChildren(element?: PowerBICapacityTreeItem): Promise<PowerBICapacityTreeItem[]> {
		if(!PowerBIApiService.isInitialized) { 			
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBICapacityRefreshable[] = [];
			let items: iPowerBICapacityRefreshable[] = await PowerBIApiService.getItemList<iPowerBICapacityRefreshable>(this.apiPath, {}, "name");

			for (let item of items) {
				let treeItem = new PowerBICapacityRefreshable(item, this);
				children.push(treeItem);
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}
			
			return children;
		}
	}
}