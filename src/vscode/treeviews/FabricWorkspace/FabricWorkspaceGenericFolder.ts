import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';

import { ThisExtension } from '../../../ThisExtension';
import { FabricWorkspaceTreeItem } from './FabricWorkspaceTreeItem';
import { FabricApiItemType } from '../../../fabric/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class FabricWorkspaceGenericFolder extends FabricWorkspaceTreeItem {
	private customApiUrlPart: string;

	constructor(
		name: string,
		type: FabricApiItemType,
		workspaceId: UniqueId,
		parent: FabricWorkspaceTreeItem,
		apiUrlPart: string = undefined

	) {
		super(name, workspaceId, type, workspaceId, parent);

		this.customApiUrlPart = apiUrlPart;
		// the workspaceId is not unique for logical folders hence we make it unique
		this.id = workspaceId + "/" + parent.itemId + "/" + this.type.toString();
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
		return this.apiUrlPart;
	}

	async getChildren(element?: FabricWorkspaceTreeItem): Promise<FabricWorkspaceTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}
}