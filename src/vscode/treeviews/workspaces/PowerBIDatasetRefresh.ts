import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { UniqueId } from '../../../helpers/Helper';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PowerBIDataset } from './PowerBIDataset';
import { PowerBIDatasetRefreshes } from './PowerBIDatasetRefreshes';
import { iPowerBIDatasetRefresh } from '../../../powerbi/DatasetsAPI/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetRefresh extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDatasetRefresh,
		group: UniqueId,
		parent: PowerBIDatasetRefreshes
	) {
		super(definition.requestId, group, "REFRESH", definition.requestId, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;

		super.id = definition.requestId;
		super.label = this._label;
		super.description = this._description;
		super.tooltip = this._tooltip;
		super.contextValue = this._contextValue;
		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
		super.command = this._command;
	}

	get _label(): string {
		let dateToShow: Date = this.definition.startTime;

		return `${new Date(dateToShow).toISOString().substr(0, 19).replace('T', ' ')}`;
	}

	// description is show next to the label
	get _description(): string {
		return this.definition.status + " - " + this.definition.refreshType;
	}

	protected getIconPath(theme: string): vscode.Uri {
		let status: string = this.definition.status;

		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, status + '.png');
	}

	get _command(): vscode.Command {
		return {
			command: 'PowerBIDataset.showRefresh', title: "Show Refresh", arguments: [this]
		}
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = []

		if (this.definition.status == "Unknown") {
			actions.push("CANCEL")
		}

		return orig + actions.join(",") + ",";
	}

	get definition(): iPowerBIDatasetRefresh {
		return super.definition as iPowerBIDatasetRefresh;
	}

	private set definition(value: iPowerBIDatasetRefresh) {
		super.definition = value;
	}

	get dataset(): PowerBIDataset {
		return (this.parent as PowerBIDatasetRefreshes).dataset;
	}

	// DatasetRefresh-specific funtions
	public async cancel(): Promise<void> {
		ThisExtension.setStatusBar("Cancelling dataset-refresh ...", true);
		PowerBIApiService.delete(this.apiPath, null);
		ThisExtension.setStatusBar("Dataset-refresh cancelled!");
	}

	public async showDefinition(): Promise<void> {
		let result = this.definition;
		if (this.definition.refreshType == "ViaEnhancedApi") {
			result = await PowerBIApiService.get(this.apiPath);
		}

		vscode.workspace.openTextDocument({ language: "json", content: JSON.stringify(result, null, "\t") }).then(
			document => vscode.window.showTextDocument(document)
		);
	}
}