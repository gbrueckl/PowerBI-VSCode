import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { iPowerBIDatasetParameter, iPowerBIDatasetRefresh } from '../../../powerbi/DatasetsAPI/_types';
import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PowerBIDataset } from './PowerBIDataset';
import { PowerBIDatasetRefreshes } from './PowerBIDatasetRefreshes';
import { iPowerBIDataflowTransaction } from '../../../powerbi/DataflowsAPI/_types';
import { PowerBIDataflowTransactions } from './PowerBIDataflowTransactions';
import { PowerBIDataflow } from './PowerBIDataflow';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDataflowTransaction extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDataflowTransaction,
		group: UniqueId,
		parent: PowerBIDataflowTransactions
	) {
		super(definition.id, group, "DATAFLOWTRANSACTION", definition.id, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;

		this.id = definition.id;
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
		let dateToShow: Date = this.startTime;
		const offset = dateToShow.getTimezoneOffset();
		dateToShow = new Date(dateToShow.getTime() - (offset*60*1000));

		return `${dateToShow.toISOString().substr(0, 19).replace('T', ' ')}`;
	}

	// description is show next to the label
	get _description(): string {

		let duration: number = this.duration;
		let durationText: string = "";
		if (this.duration) {
			durationText = `(${Helper.secondsToHms(duration)})`;
		}
		else {
			if (this.startTime) {
				if(this.definition.status == "InProgress") {
					const runningFor = (new Date().getTime() - this.startTime.getTime()) / 1000;
					durationText = `(${Helper.secondsToHms(runningFor)} ...)`;
				}
				else {
					durationText = `(${this.definition.status})`;
				}
			}
		}

		return `${this.definition.status} ${durationText} - ${this.definition.refreshType}`;
/*
		let duration: number = this.duration;
		let durationText: string = "";
		if(this.duration)
		{
			durationText = `(${Helper.secondsToHms(duration)})`;
		}
	
		return `${this.definition.status} ${durationText} - ${this.definition.refreshType}`;
		*/
	}

	protected getIconPath(theme: string): vscode.Uri {
		let status: string = this.definition.status;

		if(status && status.startsWith("Cancelled"))
		{
			status = "failed";
		}

		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, status + '.png');
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = []

		if(this.definition.status == "InProgress")
		{
			actions.push("CANCEL")
		}

		return orig + actions.join(",") + ",";
	}
	get definition(): iPowerBIDataflowTransaction {
		return super.definition as iPowerBIDataflowTransaction;
	}

	private set definition(value: iPowerBIDataflowTransaction) {
		super.definition = value;
	}

	get dataflow(): PowerBIDataflow {
		return (this.parent as PowerBIDataflowTransactions).dataflow;
	}

	get startTime(): Date {
		if(this.definition.startTime)
		{
			return new Date(this.definition.startTime);
		}
		return undefined;
	}

	get endTime(): Date {
		if(this.definition.endTime)
		{
			return new Date(this.definition.endTime);
		}
		return undefined;
	}

	get duration(): number {
		if(this.startTime && this.endTime)
		{
			return (this.endTime.getTime() - this.startTime.getTime()) / 1000;
		}
		return undefined;
	}

	get apiUrlPart(): string {
		return this.definition.id;
	}

	// DataflowTransaction-specific funtions
	public async cancel(): Promise<void> {
		ThisExtension.setStatusBarRight("Cancelling dataflow-refresh ...", true);
		// dataflows work slightly different and the transaction is not linked to the dataflow
		const apiPath = this.apiPath.replace(`/${this.getPathItemByType<PowerBIDataflow>("DATAFLOW").id}`, "");
		PowerBIApiService.post(apiPath + "cancel", null);
		ThisExtension.setStatusBarRight("Dataflow-refresh cancelled!");
		Helper.showTemporaryInformationMessage("Dataflow-refresh cancelled!", 3000);

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}
}