import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { Helper, UniqueId } from '../../../helpers/Helper';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDatasetColumnStatistics, iPowerBIDatasetDMV, iPowerBIDatasetRefreshableObject, iPowerBIDatasetVersion } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBIDatasetTables } from './PowerBIDatasetTables';
import { PowerBIDatasetTableColumns } from './PowerBIDatasetTableColumns';
import { PowerBIDatasetTableMeasures } from './PowerBIDatasetTableMeasures';
import { PowerBIDatasetTablePartitions } from './PowerBIDatasetTablePartitions';
import { PowerBIApiDrop, PowerBIDaxDrop, PowerBITmslDrop } from '../../dropProvider/_types';
import { PowerBIDatasetVersionHistories } from './PowerBIDatasetVersionHistories';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetVersionHistory extends PowerBIWorkspaceTreeItem {
	constructor(
		definition: iPowerBIDatasetVersion,
		groupId: UniqueId,
		parent: PowerBIDatasetVersionHistories
	) {
		super(definition.versionTimestamp.toString(), groupId, "DATASETVERSIONHISTORY", definition.versionTimestamp.toString(), parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;

		// the groupId is not unique for logical folders hence we make it unique
		this.id = this.parent.id + "/" + definition.versionTimestamp.toString();
		this.description = this._description;
		this.tooltip = this._tooltip;
		this.contextValue = this._contextValue;
		this.iconPath = this.getIcon();
	}

	// description is show next to the label
	get _description(): string {
		if(this.definition) {
			return this.definition.description;
		}
		return undefined;
	}

	getIcon(): vscode.ThemeIcon {
		return new vscode.ThemeIcon("history");
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = ["RESTORE_VERSION"];

		return orig + actions.join(",") + ",";
	}

	get definition(): iPowerBIDatasetVersion {
		return super.definition as iPowerBIDatasetVersion;
	}

	private set definition(value: iPowerBIDatasetVersion) {
		super.definition = value;
	}

	get apiUrlPart(): string {
		return undefined;
	}

	get apiPath(): string {
		return this.parent.apiPath;
	}

	get dataset(): PowerBIDataset {
		return (this.parent as PowerBIDatasetVersionHistories).dataset;
	}

	get fabricFsUri(): vscode.Uri {
		return undefined;
	}

	async restoreVersion(): Promise<void> {
		const apiPath = `${this.parent.apiPath}/restoreVersion`;	
		const body = {
			"versionTimestamp": this.definition.versionTimestamp
		};

		const restore = await PowerBIApiService.post<void>(apiPath, body);

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this, false);

		Helper.showTemporaryInformationMessage("Restore of Dataset version triggered!", 5000);
	}
}