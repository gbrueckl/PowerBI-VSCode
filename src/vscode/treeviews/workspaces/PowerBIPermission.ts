import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDatasetParameter } from '../../../powerbi/DatasetsAPI/_types';
import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIParameters } from './PowerBIParameters';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PowerBIDataset } from './PowerBIDataset';
import { PowerBIWorkspacePermissions } from './PowerBIWorkspacePermissions';
import { iPowerBIPermission } from '../../../powerbi/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIPermission extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIPermission,
		group: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super(definition.identifier, group, "PERMISSION", definition.identifier, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;

		this.description = definition.groupUserAccessRight || definition.datasetUserAccessRight;

		// the parameter name is not unique hence we make it unique
		this.id = parent.id + "/" + definition.identifier;
		this.label = definition.displayName ? `${definition.displayName} (${definition.identifier})` : definition.identifier;
		this.tooltip = this._tooltip;
		this.contextValue = this._contextValue;
		this.iconPath = {
			light: this.getIconPathCustom("light"),
			dark: this.getIconPathCustom("dark")
		};
	}

	protected getIconPathCustom(theme: string): string | vscode.Uri {
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, "permission" + this.principalType.toLowerCase() + '.png');
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIPermission {
		return super.definition as iPowerBIPermission;
	}

	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = []

		return orig + actions.join(",") + ",";
	}

	private set definition(value: iPowerBIPermission) {
		super.definition = value;
	}

	get principalType(): string { 
		return this.definition.principalType;
	}
}