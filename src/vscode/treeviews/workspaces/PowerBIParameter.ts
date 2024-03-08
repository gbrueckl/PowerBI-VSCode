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

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIParameter extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDatasetParameter,
		group: UniqueId,
		parent: PowerBIParameters
	) {
		super(definition.name, group, "DATASETPARAMETER", definition.name, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;

		this.description = definition.currentValue;

		// the parameter name is not unique hence we make it unique
		this.id = this.dataset.uid + "/" + this.itemType.toString() + "/" + definition.name;
		this.tooltip = this._tooltip;
		this.contextValue = this._contextValue;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIDatasetParameter {
		return super.definition as iPowerBIDatasetParameter;
	}

	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = []

		if (this.dataset.definition.configuredBy == PowerBIApiService.SessionUserEmail) {
			actions.push("UPDATEDATASETPARAMETER")
		}

		return orig + actions.join(",") + ",";
	}

	private set definition(value: iPowerBIDatasetParameter) {
		super.definition = value;
	}

	get dataset(): PowerBIDataset {
		return (this.parent as PowerBIParameters).dataset;
	}

	public static async promptForValue(parameter: iPowerBIDatasetParameter): Promise<{name: string, newValue: string}> {
		let newValue: string = null;
		if (parameter.suggestedValues && parameter.suggestedValues.length > 0) {
			newValue = await PowerBICommandBuilder.showQuickPick(parameter.suggestedValues.map(x => new PowerBIQuickPickItem(x)), parameter.name, parameter.description, parameter.currentValue);
		}
		else if (parameter.type == "Logical") {
			newValue = await PowerBICommandBuilder.showQuickPick([new PowerBIQuickPickItem("TRUE"), new PowerBIQuickPickItem("FALSE")], parameter.name, parameter.description, parameter.currentValue);
		}
		else {
			newValue = await PowerBICommandBuilder.showInputBox(parameter.currentValue, parameter.name, parameter.description);
		}

		if (!newValue) {
			return undefined;
		}

		return	{
					"name": parameter.name,
					"newValue": newValue
				};
	}

	// Parameter-specific funtions
	public async update(): Promise<void> {
		const apiUrl =  Helper.joinPath(this.dataset.apiPath, "Default.UpdateParameters");

		let newValue: {name: string, newValue: string} = await PowerBIParameter.promptForValue(this.definition);

		if (!newValue) {
			return;
		}

		let settings = {
			"updateDetails": [
				newValue
			]
		}

		ThisExtension.setStatusBarRight("Updating parameter ...", true);
		await PowerBIApiService.post(apiUrl, settings);
		ThisExtension.setStatusBarRight("Parameter updated!")

		await ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}
}