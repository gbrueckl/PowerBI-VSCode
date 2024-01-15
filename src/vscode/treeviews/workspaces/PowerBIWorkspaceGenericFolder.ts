import * as vscode from 'vscode';

import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDataset, iPowerBIDatasetDMV, iPowerBIDatasetRefresh } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIDatasetRefresh } from './PowerBIDatasetRefresh';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIDatasetTable } from './PowerBIDatasetTable';
import { ApiItemType } from '../_types';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';

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
		this.id = groupId + "/" + this.parent.uid + "/" + this.itemType.toString();
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

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}
}