import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { Helper, UniqueId } from '../../../helpers/Helper';
import { ThisExtension } from '../../../ThisExtension';
import { iPowerBIDataflowDatasource } from '../../../powerbi/DataflowsAPI/_types';
import { PowerBIDataflowDatasources } from './PowerBIDataflowDatasources';
import { PowerBIDataflow } from './PowerBIDataflow';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataflowDatasource extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDataflowDatasource,
		group: UniqueId,
		parent: PowerBIDataflowDatasources
	) {
		super(definition.datasourceType, group, "DATAFLOWDATASOURCE", definition.datasourceId, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;

		// datasourceId can be used by multiple dataflows hence we make it unique
		this.id = parent.parent.id + "/" + definition.datasourceId;
		this.label = this._label;
		this.description = this._description;
		this.tooltip = this._tooltip;
		this.contextValue = this._contextValue;
		this.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	get _label(): string {
		return this.definition.datasourceType;
	}

	// description is show next to the label
	get _description(): string {
		let ret: string[] = [];
		if (this.definition.connectionDetails) {
			for (const [key, value] of Object.entries(this.definition.connectionDetails)) {
				if (typeof value === "string") {
					ret.push(value);
				}
			}
		}
		return ret.join(", ");
	}

	protected getIconPath(theme: string): vscode.Uri {
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, "gateway" + '.png');
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = []


		return orig + actions.join(",") + ",";
	}
	get definition(): iPowerBIDataflowDatasource {
		return super.definition as iPowerBIDataflowDatasource;
	}

	private set definition(value: iPowerBIDataflowDatasource) {
		super.definition = value;
	}

	get dataflow(): PowerBIDataflow {
		return (this.parent as PowerBIDataflowDatasources).dataflow;
	}

	// DataflowDatasource-specific funtions
}