import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIWorkspaceGenericFolder } from './PowerBIWorkspaceGenericFolder';
import { iPowerBIWorkspaceItem } from './iPowerBIWorkspaceItem';
import { iPowerBIPermission } from '../../../powerbi/_types';
import { PowerBIPermission } from './PowerBIPermission';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetPermissions extends PowerBIWorkspaceGenericFolder {

	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super("Permissions", "DATASETPERMISSIONS", groupId, parent, "users");
	}


	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIWorkspaceTreeItem[] = [];
			let items: iPowerBIPermission[] = await PowerBIApiService.getItemList<iPowerBIPermission>(this.apiPath, undefined, null);

			for (let item of items) {
				let treeItem = new PowerBIPermission(item, this.groupId, this);
				children.push(treeItem);
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}

			return children;
		}
	}
}