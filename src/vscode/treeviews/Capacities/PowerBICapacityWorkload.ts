import * as vscode from 'vscode';

import { PowerBICapacityTreeItem } from './PowerBICapacityTreeItem';
import { iPowerBICapacityWorkload } from '../../../powerbi/CapacityAPI/_types';
import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';
import { PowerBICommandBuilder, PowerBICommandInput, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { iPowerBIDatasetGenericResponse } from '../../../powerbi/DatasetsAPI/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBICapacityWorkload extends PowerBICapacityTreeItem {

	constructor(
		definition: iPowerBICapacityWorkload,
		parent: PowerBICapacityTreeItem,
	) {
		super(definition.name, definition.name, "CAPACITYWORKLOAD", parent.capacity, parent, vscode.TreeItemCollapsibleState.None);
		this.definition = definition;

		this.id = Helper.joinPath(parent.capacity.id, "workload", definition.name);
		
		this.tooltip = this._tooltip;
		this.description = this._description;
		this.contextValue = this._contextValue;
		this.iconPath = this.getIcon();
	}

	getIcon(): vscode.ThemeIcon {
		if(this.definition.state == "Enabled")
		{
			return new vscode.ThemeIcon("pass-filled");
		}
		return new vscode.ThemeIcon("circle-large-outline");
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = [];

		if (this.definition.state != "Unsupported") {
			actions.push("UPDATE");
		}

		return orig + actions.join(",") + ",";
	}
	
	get definition(): iPowerBICapacityWorkload {
		return super.definition as iPowerBICapacityWorkload;
	}

	set definition(value: iPowerBICapacityWorkload) {
		super.definition = value;
	}

	// description is show next to the label
	get _description(): string {
		return this.definition.state + " - MaxMem %: " + this.definition.maxMemoryPercentageSetByUser;
	}

	// Workload-specific funtions
	public async update(): Promise<void> {
		const apiUrl = this.apiPath;

		let response = await PowerBICommandBuilder.execute<iPowerBIDatasetGenericResponse>(apiUrl, "PATCH",
			[
				new PowerBICommandInput(
					"Enabled", 
					"CUSTOM_SELECTOR", 
					"state", 
					false, 
					"The capacity workload state.", 
					this.definition.state,
					[new PowerBIQuickPickItem("Enabled"), new PowerBIQuickPickItem("Disabled")]),
				new PowerBICommandInput(
					"Maximum Memory", 
					"FREE_TEXT", 
					"maxMemoryPercentageSetByUser", 
					true, 
					"Whether the dataset automatically syncs read-only replicas.", 
					this.definition.maxMemoryPercentageSetByUser.toString())
			]);

		if (response.error) {
			vscode.window.showErrorMessage(JSON.stringify(response));
		}

		ThisExtension.setStatusBarRight("Workload configured!");

		await Helper.delay(1000);
		ThisExtension.TreeViewCapacities.refresh(this.parent, false);
	}
}