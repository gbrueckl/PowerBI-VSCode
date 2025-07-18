import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { ThisExtension } from '../../../ThisExtension';
import { ApiItemType } from '../_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIWorkspaceGenericFolder extends PowerBIWorkspaceTreeItem {
	private customApiUrlPart: string;

	constructor(
		name: string,
		itemType: ApiItemType,
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem,
		apiUrlPart: string = undefined

	) {
		super(name, groupId, itemType, groupId, parent);

		this.customApiUrlPart = apiUrlPart;
		// the groupId is not unique for logical folders hence we make it unique
		this.id = parent.id + "/" + this.itemType.toString();
		this.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	protected getIconPath(theme: string): string | vscode.Uri {
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, 'genericfolder.png');
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
		if(this.customApiUrlPart != undefined) {
			return this.customApiUrlPart;
		}
		return super.apiUrlPart;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}
}