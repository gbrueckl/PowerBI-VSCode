import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { Helper, UniqueId } from '../../../helpers/Helper';
import { ThisExtension } from '../../../ThisExtension';
import {  PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDatasetDMV, iPowerBIDatasetRefreshableObject } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBIDatasetTableColumns } from './PowerBIDatasetTableColumns';
import { PowerBIDatasetTable } from './PowerBIDatasetTable';
import { PowerBIApiDrop, PowerBITmslDrop } from '../../dropProvider/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetTablePartition extends PowerBIWorkspaceTreeItem implements PowerBITmslDrop, PowerBIApiDrop{

	constructor(
		definition: iPowerBIDatasetDMV,
		group: UniqueId,
		parent: PowerBIDatasetTableColumns
	) {
		super(definition.name, group, "DATASETTABLEPARTITION", definition.id, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;

		this.id = this.parent.uid + "/" + definition.id;
		this.description = this._description;
		this.tooltip = this._tooltip;
		this.contextValue = this._contextValue;
		this.iconPath = this.getIcon();
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		let tooltip: string = "";
		if ("properties" in this.definition) {
			for (const [key, value] of Object.entries(this.definition?.properties)) {
				if (typeof value === "string") {
					if (value.length > 100) {
						continue;
					}
				}
				tooltip += `${key}: ${JSON.stringify(value, null, 4)}\n`;
			}
		}

		return tooltip.trim();
	}

	// description is show next to the label
	get _description(): string {
		return this.definition.id;
	}

	getIcon(): vscode.ThemeIcon {
		return new vscode.ThemeIcon("extensions");
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = [];

		if (this.dataset.workspace.isPremiumCapacity && this.dataset.definition.isRefreshable) {
			actions.push("REFRESH");
		}

		return orig + actions.join(",") + ",";
	}

	get definition(): iPowerBIDatasetDMV {
		return super.definition as iPowerBIDatasetDMV;
	}

	private set definition(value: iPowerBIDatasetDMV) {
		super.definition = value;
	}

	get table(): PowerBIDatasetTable {
		return this.parent.parent as PowerBIDatasetTable;
	}

	get dataset(): PowerBIDataset {
		return (this.table as PowerBIDatasetTable).dataset;
	}

	get code(): string {
		return JSON.stringify(this.refreshableObject, null, 4)
	}

	// TMSL Drop
	get tmslDrop(): string {
		return JSON.stringify(this.refreshableObject, null, 4);
	}

	// API Drop
	get apiDrop(): string {
		return JSON.stringify(this.refreshableObject, null, 4);
	}

	// DatasetTablePartition-specific funtions
	get refreshableObject(): iPowerBIDatasetRefreshableObject {
		return { table: this.table.name, partition: this.name };
	}

	public async refresh(): Promise<void> {
		ThisExtension.TreeViewWorkspaces.doMultiselectAction("REFRESH");
		/*
		const isOnDedicatedCapacity = this.dataset.workspace.isPremiumCapacity;

		await PowerBIDataset.refreshById(this.groupId.toString(), this.dataset.id, isOnDedicatedCapacity,[this.refreshableObject]);

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this.dataset, false);
		*/
	}
}