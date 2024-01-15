import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { Helper, UniqueId } from '../../../helpers/Helper';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PROCESSING_TYPES, PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDatasetDMV } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBIDatasetTables } from './PowerBIDatasetTables';
import { PowerBIDatasetTableColumns } from './PowerBIDatasetTableColumns';
import { PowerBIDatasetTableMeasures } from './PowerBIDatasetTableMeasures';
import { PowerBIDatasetTable } from './PowerBIDatasetTable';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetTableMeasure extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDatasetDMV,
		group: UniqueId,
		parent: PowerBIDatasetTableColumns
	) {
		super(definition.name, group, "DATASETTABLEMEASURE", definition.id, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;

		this.id = this.parent.id + "/" + definition.id;
		this.description = this._description;
		this.tooltip = this._tooltip;
		this.contextValue = this._contextValue;
		this.iconPath = this.getIcon();
	}


	// description is show next to the label
	get _description(): string {
		return this.definition.id;
	}

	getIcon(): vscode.ThemeIcon {
		return new vscode.ThemeIcon("symbol-operator");
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIDatasetDMV {
		return super.definition as iPowerBIDatasetDMV;
	}

	private set definition(value: iPowerBIDatasetDMV) {
		super.definition = value;
	}

	get table(): PowerBIDatasetTable {
		return this.parent as PowerBIDatasetTable;
	}

	get dataset(): PowerBIDataset {
		return (this.table as PowerBIDatasetTable).dataset;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		let children: PowerBIWorkspaceTreeItem[] = [];

		children.push(new PowerBIDatasetTableColumns(this.groupId, this));
		children.push(new PowerBIDatasetTableMeasures(this.groupId, this));

		return children;
	}

	// DatasetTableColumn-specific funtions
		public async showDefinition(): Promise<void> {
		let result = this.definition;
		if (this.definition.id == "ViaEnhancedApi") {
			result = await PowerBIApiService.get(this.apiPath);
		}

		vscode.workspace.openTextDocument({ language: "json", content: JSON.stringify(result, null, "\t") }).then(
			document => vscode.window.showTextDocument(document)
		);
	}
}