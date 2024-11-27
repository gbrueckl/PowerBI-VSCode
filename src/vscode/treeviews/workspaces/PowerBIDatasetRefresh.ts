import * as vscode from 'vscode';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { Helper, UniqueId } from '../../../helpers/Helper';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PowerBIDataset } from './PowerBIDataset';
import { PowerBIDatasetRefreshes } from './PowerBIDatasetRefreshes';
import { iPowerBIDatasetRefresh } from '../../../powerbi/DatasetsAPI/_types';
import { TempFileSystemProvider } from '../../filesystemProvider/temp/TempFileSystemProvider';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetRefresh extends PowerBIWorkspaceTreeItem {

	constructor(
		definition: iPowerBIDatasetRefresh,
		group: UniqueId,
		parent: PowerBIDatasetRefreshes
	) {
		super(definition.requestId, group, "DATASETREFRESH", definition.requestId, parent, vscode.TreeItemCollapsibleState.None);

		this.definition = definition;

		this.id = definition.requestId;
		this.label = this._label;
		this.description = this._description;
		this.tooltip = this._tooltip;
		this.contextValue = this._contextValue;
		this.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
		this.command = this._command;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _label(): string {
		if (this.startTime) {
			let dateToShow: Date = this.startTime;
			const offset = dateToShow.getTimezoneOffset();
			dateToShow = new Date(dateToShow.getTime() - (offset * 60 * 1000));

			return `${dateToShow.toISOString().substr(0, 19).replace('T', ' ')}`;
		}
		return "not started";
	}

	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = []

		if (this.status == "Unknown" || this.status == "InProgress" || this.status == "NotStarted") {
			actions.push("CANCEL")
		}
		else {
			if (this.definition.refreshType == "ViaEnhancedApi") {
				actions.push("RERUN")
			}
		}

		return orig + actions.join(",") + ",";
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
				if (this.definition.extendedStatus == "InProgress") {
					const runningFor = (new Date().getTime() - this.startTime.getTime()) / 1000;
					durationText = `(${Helper.secondsToHms(runningFor)} ...)`;
				}
				else {
					durationText = `(${this.status})`;
				}
			}
		}

		let retries = "";

		if(this.definition.refreshAttempts) {
			const maxAttempts = this.definition.refreshAttempts.reduce((a, b) => Math.max(a, b.attemptId), 0);

			if(maxAttempts > 1) {
				retries = ` - ${maxAttempts - 1} retries`;
				//retries = ` - ${maxAttempts} attempts`;
			}
		}

		return `${this.status} ${durationText}${retries} - ${this.definition.refreshType}`;
	}

	get _tooltip(): string {
		let tooltip = super._tooltip;

		if (this.definition.serviceExceptionJson) {
			const exception = JSON.parse(this.definition.serviceExceptionJson);
			tooltip = "ERROR: " + exception.errorCode + "\n" + exception.errorDescription + "\n" + "-".repeat(80) + "\n" + tooltip;
		}

		return tooltip;
	}

	protected getIconPath(theme: string): vscode.Uri {
		let status: string = this.definition.status;

		if (status == "NotStarted") {
			status = "pending";
		}
		if (status == "Cancelled") {
			status = "failed";
		}

		if (this.definition.extendedStatus == "InProgress") {
			status = "inprogress";
		}

		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, status + '.png');
	}

	get _command(): vscode.Command {
		return {
			command: 'PowerBIDataset.showRefresh', title: "Show Refresh", arguments: [this]
		}
	}

	get definition(): iPowerBIDatasetRefresh {
		return super.definition as iPowerBIDatasetRefresh;
	}

	private set definition(value: iPowerBIDatasetRefresh) {
		super.definition = value;
	}

	// Dataset-specific funtions
	get dataset(): PowerBIDataset {
		return (this.parent as PowerBIDatasetRefreshes).dataset;
	}

	get status(): string {
		if (this.definition.extendedStatus) {
			return this.definition.extendedStatus;
		}
		return this.definition.status;
	}

	get startTime(): Date {
		if (this.definition.startTime) {
			return new Date(this.definition.startTime);
			//return Helper.toLocalDateTime(new Date(this.definition.startTime));
		}
		return undefined;
	}

	get endTime(): Date {
		if (this.definition.endTime) {
			return new Date(this.definition.endTime);
			//return Helper.toLocalDateTime(new Date(this.definition.endTime));
		}
		return undefined;
	}

	get duration(): number {
		if (this.startTime && this.endTime) {
			return (this.endTime.getTime() - this.startTime.getTime()) / 1000;
		}
		return undefined;
	}

	// DatasetRefresh-specific funtions
	public async cancel(): Promise<void> {
		ThisExtension.setStatusBarRight("Cancelling dataset-refresh ...", true);
		await PowerBIApiService.invokeWithProgress(`Cancelling refresh of '${this.dataset.name}'`, PowerBIApiService.delete(this.apiPath, null));
		ThisExtension.setStatusBarRight("Dataset-refresh cancelled!");

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public async rerun(): Promise<void> {
		ThisExtension.setStatusBarRight("Rerunning dataset-refresh ...", true);

		let result = await PowerBIApiService.get<iPowerBIDatasetRefresh>(this.apiPath);

		if (!result) {
			ThisExtension.setStatusBarRight("Dataset-refresh rerun aborted!");
			ThisExtension.log("Dataset-refresh rerun aborted! No refresh found for " + this.apiPath);
			vscode.window.showErrorMessage("Dataset-refresh rerun aborted! No refresh found for " + this.apiPath);
			return;
		}

		let body = {
			"commitMode": result.commitMode,
			"type": result.type,
			"objects": result.objects,
			"applyRefreshPolicy": false
		}

		const isOnDedicatedCapacity = this.dataset.workspace.definition.isOnDedicatedCapacity;
		await PowerBIDataset.refreshById(this.groupId.toString(), this.dataset.id, isOnDedicatedCapacity, undefined, body);
		ThisExtension.setStatusBarRight("Dataset-refresh rerun!");

		await Helper.delay(1000);
		ThisExtension.TreeViewWorkspaces.refresh(this.parent, false);
	}

	public async showDefinition(): Promise<void> {
		let result = this.definition;
		if (this.definition.refreshType == "ViaEnhancedApi") {
			result = await PowerBIApiService.get(this.apiPath);
		}

		let tempPath = Helper.joinPath(
			this.getParentByType("GROUP").label.toString(),
			this.getParentByType("DATASET").label.toString(),
			this.getParentByType("DATASET").label.toString() + " " + this.label + ".json");

		let tempUri = await TempFileSystemProvider.createTempFile(tempPath, JSON.stringify(result, null, "\t"));

		vscode.workspace.openTextDocument(tempUri).then(
			document => vscode.window.showTextDocument(document)
		);
	}
}