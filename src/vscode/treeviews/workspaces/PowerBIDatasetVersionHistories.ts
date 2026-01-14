import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { ThisExtension } from '../../../ThisExtension';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDatasetRestoreVersionStatus, iPowerBIDatasetVersionHistory } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIWorkspaceGenericFolder } from './PowerBIWorkspaceGenericFolder';
import { PowerBIDatasetVersionHistory } from './PowerBIDatasetVersionHistory';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetVersionHistories extends PowerBIWorkspaceGenericFolder {
	private _baseUrl: string;
	private _restoreStatus: number;

	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem,
		baseUrl: string
	) {
		super("Version History", "DATASETVERSIONHISTORIES", groupId, parent, "");
		this._baseUrl = Helper.trimChar(baseUrl, "/");
	}

	get dataset(): PowerBIDataset {
		return this.parent as PowerBIDataset;
	}

	get fabricFsUri(): vscode.Uri {
		return undefined;
	}

	get apiPath(): string {
		return `${this._baseUrl}/metadata/v202401/semanticModelVersioning/models/${this.dataset.uid}/versions`;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIDatasetVersionHistory[] = [];

			try {
				const items: iPowerBIDatasetVersionHistory = await PowerBIApiService.get<iPowerBIDatasetVersionHistory>(this.apiPath);

				for (let item of items.modelVersions) {
					let treeItem = new PowerBIDatasetVersionHistory(item, this.groupId, this);
					children.push(treeItem);
					PowerBICommandBuilder.pushQuickPickItem(treeItem);
				}
			}
			catch (e) {
				if (e.message.includes("PowerBIFeatureDisabled")) {
					ThisExtension.log(e.message);
					vscode.window.showErrorMessage(e.message);
				}
				ThisExtension.log("No version histories found for dataset " + this.dataset.name);
				return;
			}

			Helper.sortArrayByProperty(children, "label", "DESC");

			return children;
		}
	}

	async updateRestoreStatus(): Promise<void> {
		try {
			const apiPath = `${this.apiPath}/restoreVersionStatus`;
			let status: iPowerBIDatasetRestoreVersionStatus = await PowerBIApiService.get<iPowerBIDatasetRestoreVersionStatus>(apiPath);

			if (status && status.restoreStatus === 1) {
				this.label = `Version History (Restore In Progress...)`;
				this.iconPath = new vscode.ThemeIcon("sync~spin");
				this._restoreStatus = status.restoreStatus;
			}
		}
		catch (e) {
			ThisExtension.log("No restore status found for dataset " + this.dataset.name);
		}
	}
}