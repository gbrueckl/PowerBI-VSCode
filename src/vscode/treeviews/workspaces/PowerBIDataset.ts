import * as vscode from 'vscode';

import { Helper, unique_id } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDataset } from '../../../powerbi/DatasetsAPI/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataset extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDataset,
		group: unique_id
	) {
		super(definition.name, group, "DATASET", definition.id, vscode.TreeItemCollapsibleState.None);
	}

	// Dataset-specific funtions
	public async refresh(): Promise<void> {
		PowerBIApiService.post(this.apiPath + "/refreshes", null);
	}

	public async takeOver(): Promise<void> {
		PowerBIApiService.post(this.apiPath + "/Default.TakeOver", null);
	}
}