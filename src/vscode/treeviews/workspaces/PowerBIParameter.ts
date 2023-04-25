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
		super(definition.name, group, "PARAMETER", definition.name, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;

		super.description = definition.currentValue;

		// the parameter name is not unique hence we make it unique
		super.id = this.dataset.uid + "/" + this.itemType.toString();
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBIDatasetParameter {
		return super.definition as iPowerBIDatasetParameter;
	}

	private set definition(value: iPowerBIDatasetParameter) {
		super.definition = value;
	}

	get dataset(): PowerBIDataset {
		return (this.parent as PowerBIParameters).dataset;
	}

	// Parameter-specific funtions
	public async update(): Promise<void> {
		const apiUrl = this.dataset.apiPath + "Default.UpdateParameters";

		let newValue: string = null;
		if (this.definition.suggestedValues) {
			newValue = await PowerBICommandBuilder.showQuickPick(this.definition.suggestedValues.map(x => new PowerBIQuickPickItem(x)), this.definition.description);
		}
		else {
			newValue = await PowerBICommandBuilder.showInputBox(this.definition.currentValue, this.definition.description);
		}

		if (!newValue) {
			return;
		}

		let settings = {
			"updateDetails": [
				{
					"name": this.definition.name,
					"newValue": newValue
				}
			]
		}

		ThisExtension.setStatusBar("Updating parameter ...", true);
		await PowerBIApiService.post(apiUrl, settings);
		ThisExtension.setStatusBar("Parameter updated!")

		await ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}
}