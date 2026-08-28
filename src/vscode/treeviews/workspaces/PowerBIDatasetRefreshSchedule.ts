import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDatasetGenericResponse, iPowerBIDatasetRefreshSchedule, iPowerBIDatasetRefreshScheduleRequest } from '../../../powerbi/DatasetsAPI/_types';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIWorkspaceGenericViewer } from './PowerBIWorkspaceGenericViewer';
import { TempFileSystemProvider } from '../../filesystemProvider/temp/TempFileSystemProvider';

const DEFAULT_REFRESH_SCHEDULE: iPowerBIDatasetRefreshSchedule = {
	days: ["Sunday", "Friday", "Saturday"],
	times: ["05:00", "11:30", "17:30", "23:00"],
	enabled: true,
	localTimeZoneId: "UTC",
	notifyOption: "MailOnFailure"
};

function toRefreshSchedule(value: iPowerBIDatasetRefreshSchedule): iPowerBIDatasetRefreshSchedule {
	const schedule: iPowerBIDatasetRefreshSchedule = {};

	if (value.days !== undefined) {
		schedule.days = value.days;
	}
	if (value.times !== undefined) {
		schedule.times = value.times;
	}
	if (value.enabled !== undefined) {
		schedule.enabled = value.enabled;
	}
	if (value.localTimeZoneId !== undefined) {
		schedule.localTimeZoneId = value.localTimeZoneId;
	}
	if (value.notifyOption !== undefined) {
		schedule.notifyOption = value.notifyOption;
	}

	return schedule;
}

function toRefreshScheduleRequest(schedule: iPowerBIDatasetRefreshSchedule): iPowerBIDatasetRefreshScheduleRequest {
	// The API requires a request that disables a schedule to contain no
	// other schedule changes.
	if (schedule.enabled === false) {
		return { value: { enabled: false } };
	}

	return { value: toRefreshSchedule(schedule) };
}

function isRefreshScheduleDefined(schedule: iPowerBIDatasetRefreshSchedule): boolean {
	const hasDays = (schedule.days?.length ?? 0) > 0;
	const hasTimes = (schedule.times?.length ?? 0) > 0;

	// Power BI represents a dataset without a configured refresh schedule as
	// a disabled schedule with empty day and time arrays.
	return schedule.enabled !== false || hasDays || hasTimes;
}

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasetRefreshSchedule extends PowerBIWorkspaceTreeItem {

	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super("Refresh Schedule", groupId, "DATASETREFRESHSCHEDULE", groupId, parent);

		// the groupId is not unique for logical folders hence we make it unique
		this.id = groupId + "/" + this.parent.uid + "/" + this.itemType.toString();
	}

	// description is show next to the label
	get _description(): string {
		return undefined;
	}

	get apiUrlPart(): string {
		return "refreshSchedule";
	}

	get dataset(): PowerBIDataset {
		return this.parent as PowerBIDataset;
	}

	private get noScheduleItem(): PowerBIWorkspaceGenericViewer {
		return new PowerBIWorkspaceGenericViewer(
			"No refresh schedule has been defined yet. Use 'Set Refresh Schedule' on the parent node.",
			this,
			"GENERICVIEWER",
			"info"
		);
	}

	public async disableRefreshSchedule(): Promise<void> {
		await this.setRefreshScheduleEnabled(false);
	}

	public async enableRefreshSchedule(): Promise<void> {
		await this.setRefreshScheduleEnabled(true);
	}

	private async setRefreshScheduleEnabled(enabled: boolean): Promise<void> {
		const verb = enabled ? "enable" : "disable";
		const actionTitle = enabled ? "Enable" : "Disable";
		const action = await vscode.window.showWarningMessage(
			`Do you want to ${verb} the refresh schedule for '${this.dataset.name}'?`,
			{ modal: true },
			actionTitle
		);
		if (action !== actionTitle) {
			return;
		}

		const request = toRefreshScheduleRequest({ enabled: enabled });
		const response = await PowerBIApiService.patch<iPowerBIDatasetGenericResponse>(this.apiPath, request);
		if (!response) {
			vscode.window.showErrorMessage(`Could not ${verb} the refresh schedule because the API returned no response.`);
			return;
		}
		if (response.error) {
			vscode.window.showErrorMessage(`Could not ${verb} the refresh schedule: ${response.error.message}`);
			return;
		}

		const result = enabled ? "enabled" : "disabled";
		vscode.window.showInformationMessage(`Refresh schedule for '${this.dataset.name}' ${result}.`);
		ThisExtension.TreeViewWorkspaces.refresh(this, false);
	}

	public async setRefreshSchedule(): Promise<void> {
		const apiResponse = await PowerBIApiService.get<iPowerBIDatasetRefreshSchedule & iPowerBIDatasetGenericResponse>(this.apiPath);
		const currentSchedule = apiResponse && !apiResponse.error ? toRefreshSchedule(apiResponse) : undefined;
		const schedule = currentSchedule && isRefreshScheduleDefined(currentSchedule) ? currentSchedule : DEFAULT_REFRESH_SCHEDULE;
		const tempPath = Helper.joinPath(
			this.getParentByType("GROUP").label.toString(),
			this.dataset.label.toString(),
			"Refresh Schedule.json"
		);
		const tempUri = await TempFileSystemProvider.createTempFile(tempPath, JSON.stringify(schedule, null, "\t"), true, true);
		const document = await vscode.workspace.openTextDocument(tempUri);
		await vscode.window.showTextDocument(document);

		const saveSubscription = vscode.workspace.onDidSaveTextDocument(async (savedDocument) => {
			if (savedDocument.uri.toString() !== tempUri.toString()) {
				return;
			}

			let updatedSchedule: iPowerBIDatasetRefreshSchedule;
			try {
				updatedSchedule = JSON.parse(savedDocument.getText()) as iPowerBIDatasetRefreshSchedule;
				if (!updatedSchedule || Array.isArray(updatedSchedule) || typeof updatedSchedule !== "object") {
					throw new Error("The root value must be a refresh schedule object.");
				}
			}
			catch (error) {
				vscode.window.showErrorMessage(`The refresh schedule contains invalid JSON: ${error.message}`);
				return;
			}

			const action = await vscode.window.showWarningMessage(
				`Do you want to update the refresh schedule for '${this.dataset.name}'?`,
				{ modal: true },
				"Update"
			);
			if (action !== "Update") {
				return;
			}

			const request = toRefreshScheduleRequest(updatedSchedule);
			const response = await PowerBIApiService.patch<iPowerBIDatasetGenericResponse>(this.apiPath, request);
			if (!response) {
				vscode.window.showErrorMessage("Could not update the refresh schedule because the API returned no response.");
				return;
			}
			if (response.error) {
				vscode.window.showErrorMessage(`Could not update the refresh schedule: ${response.error.message}`);
				return;
			}

			vscode.window.showInformationMessage(`Refresh schedule for '${this.dataset.name}' updated.`);
			ThisExtension.TreeViewWorkspaces.refresh(this, false);
		});

		const closeSubscription = vscode.workspace.onDidCloseTextDocument((closedDocument) => {
			if (closedDocument.uri.toString() === tempUri.toString()) {
				saveSubscription.dispose();
				closeSubscription.dispose();
			}
		});
		ThisExtension.extensionContext.subscriptions.push(saveSubscription, closeSubscription);
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			const children: PowerBIWorkspaceTreeItem[] = [];

			try {
				const apiResponse = await PowerBIApiService.get<iPowerBIDatasetRefreshSchedule & iPowerBIDatasetGenericResponse>(this.apiPath);
				if (!apiResponse || apiResponse.error) {
					children.push(this.noScheduleItem);
					return children;
				}

				const schedule = toRefreshSchedule(apiResponse);
				if (!isRefreshScheduleDefined(schedule)) {
					children.push(this.noScheduleItem);
					return children;
				}

				// Retain the API response on the schedule item so its tooltip and
				// "Copy Properties" action represent the resource returned by Power BI.
				this.definition = schedule;
				this.tooltip = this._tooltip;

				if (schedule.enabled !== undefined) {
					const iconId = schedule.enabled ? "pass-filled" : "circle-slash";
					const enabledItem = new PowerBIWorkspaceGenericViewer(`Enabled: ${schedule.enabled}`, this, "DATASETREFRESHSCHEDULEENABLED", iconId);
					enabledItem.contextValue += schedule.enabled ? "REFRESHSCHEDULE_ENABLED," : "REFRESHSCHEDULE_DISABLED,";
					children.push(enabledItem);
				}
				if (schedule.localTimeZoneId !== undefined) {
					children.push(new PowerBIWorkspaceGenericViewer(`Local time zone: ${schedule.localTimeZoneId}`, this, "DATASETREFRESHSCHEDULETIMEZONE", "globe"));
				}
				if (schedule.days !== undefined) {
					children.push(new PowerBIWorkspaceGenericViewer(`Days: ${schedule.days.join(", ")}`, this, "DATASETREFRESHSCHEDULEDAYS", "calendar"));
				}
				if (schedule.times !== undefined) {
					children.push(new PowerBIWorkspaceGenericViewer(`Times: ${schedule.times.join(", ")}`, this, "DATASETREFRESHSCHEDULETIMES", "clock"));
				}
				if (schedule.notifyOption !== undefined) {
					const iconId = schedule.notifyOption === "NoNotification" ? "bell-slash" : "mail";
					children.push(new PowerBIWorkspaceGenericViewer(`Notify option: ${schedule.notifyOption}`, this, "DATASETREFRESHSCHEDULENOTIFY", iconId));
				}
			}
			catch (e) {
				ThisExtension.log("No refresh schedules found for dataset " + this.dataset.name);
				ThisExtension.log(e);
				children.push(this.noScheduleItem);
			}

			return children;
		}
	}
}
