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

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetTable extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDatasetDMV,
		group: UniqueId,
		parent: PowerBIDatasetTables
	) {
		super(definition.name, group, "DATASETTABLE", definition.id, parent, vscode.TreeItemCollapsibleState.Collapsed);

		this.definition = definition;

		this.id = definition.id;
		this.description = this._description;
		this.tooltip = this._tooltip;
		this.contextValue = this._contextValue;
		this.iconPath = this.getIcon();
	}


	// description is show next to the label
	get _description(): string {
		return this.definition["properties"]["description"];
	}

	getIcon(): vscode.ThemeIcon {
		return new vscode.ThemeIcon("layout-panel-justify");
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = ["REFRESH"]

		return orig + actions.join(",") + ",";
	}

	get definition(): object {
		return (super.definition as iPowerBIDatasetDMV).properties;
	}

	private set definition(value: iPowerBIDatasetDMV) {
		super.definition = value;
	}

	get apiUrlPart(): string {
		return "";
	}

	get dataset(): PowerBIDataset {
		return (this.parent as PowerBIDatasetTables).dataset;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		let children: PowerBIWorkspaceTreeItem[] = [];

		children.push(new PowerBIDatasetTableColumns(this.groupId, this));
		children.push(new PowerBIDatasetTableMeasures(this.groupId, this));

		return children;
	}

	// DatasetRefresh-specific funtions
	public static async refreshById(workspaceId: string, datasetId: string, isOnDedicatedCapacity: boolean): Promise<void> {
		ThisExtension.setStatusBar("Triggering dataset-refresh ...", true);
		const apiUrl = Helper.joinPath("groups", workspaceId, "datasets", datasetId, "refreshes");

		let body = null;

		// if we are on premium, we can use the Enhanced Refresh API
		if (isOnDedicatedCapacity) {
			const processType: vscode.QuickPickItem = await vscode.window.showQuickPick(PROCESSING_TYPES, {
				//placeHolder: toolTip,
				ignoreFocusOut: true
				/*,
				onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
				*/
			});
			if (processType == undefined || processType == null) {
				return;
			}
			body = {
				"type": processType.label
			}
		}

		PowerBIApiService.post(apiUrl, body);
		ThisExtension.setStatusBar("Dataset-refresh triggered!");
		Helper.showTemporaryInformationMessage("Dataset-refresh triggered!", 3000);
	}
	
	public async refresh(): Promise<void> {
		const isOnDedicatedCapacity = this.dataset.workspace.definition.isOnDedicatedCapacity;
		await PowerBIDataset.refreshById(this.groupId.toString(), this.id, isOnDedicatedCapacity);

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this, false);
	}

	public async showDefinition(): Promise<void> {
		let result = this.definition;

		vscode.workspace.openTextDocument({ language: "json", content: JSON.stringify(result, null, "\t") }).then(
			document => vscode.window.showTextDocument(document)
		);
	}
}