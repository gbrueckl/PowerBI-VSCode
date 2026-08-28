import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDatasetRefreshSchedule } from '../../../powerbi/DatasetsAPI/_types';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIWorkspaceGenericViewer } from './PowerBIWorkspaceGenericViewer';

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

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			const children: PowerBIWorkspaceTreeItem[] = [];

			try {
				const schedule = await PowerBIApiService.get<iPowerBIDatasetRefreshSchedule>(this.apiPath);

				// Retain the API response on the schedule item so its tooltip and
				// "Copy Properties" action represent the resource returned by Power BI.
				this.definition = schedule;
				this.tooltip = this._tooltip;

				if (schedule.enabled !== undefined) {
					const iconId = schedule.enabled ? "pass-filled" : "circle-slash";
					children.push(new PowerBIWorkspaceGenericViewer(`Enabled: ${schedule.enabled}`, this, "DATASETREFRESHSCHEDULEENABLED", iconId));
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
			}

			return children;
		}
	}
}
