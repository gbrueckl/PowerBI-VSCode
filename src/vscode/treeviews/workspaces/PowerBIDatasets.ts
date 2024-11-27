import * as vscode from 'vscode';

import {  Helper, UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { PowerBIWorkspaceTreeItem } from './PowerBIWorkspaceTreeItem';
import { PowerBIDataset } from './PowerBIDataset';
import { iPowerBIDataset, iPowerBIDatasetRefresh } from '../../../powerbi/DatasetsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIWorkspaceGenericFolder } from './PowerBIWorkspaceGenericFolder';
import { PowerBIDatasetRefresh } from './PowerBIDatasetRefresh';
import { PowerBIConfiguration } from '../../configuration/PowerBIConfiguration';
import { ThisExtension } from '../../../ThisExtension';
import { iPowerBIGroup } from '../../../powerbi/GroupsAPI/_types';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIDatasets extends PowerBIWorkspaceGenericFolder {

	private static refreshTimers: Map<UniqueId, any> = new Map<UniqueId, any>();

	constructor(
		groupId: UniqueId,
		parent: PowerBIWorkspaceTreeItem
	) {
		super("Datasets", "DATASETS", groupId, parent);

		// the groupId is not unique for logical folders hence we make it unique
		this.id = groupId + "/" + this.itemType.toString();
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		return undefined;
	}

	// description is show next to the label
	get _description(): string {
		return undefined;
	}

	async getChildren(element?: PowerBIWorkspaceTreeItem): Promise<PowerBIWorkspaceTreeItem[]> {
		if(!PowerBIApiService.isInitialized) { 			
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIDataset[] = [];
			let items: iPowerBIDataset[] = await PowerBIApiService.getItemList<iPowerBIDataset>(this.apiPath);

			for (let item of items) {
				let treeItem = new PowerBIDataset(item, this.groupId, this);
				children.push(treeItem);
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}
			
			return children;
		}
	}

	public static async startRunningRefreshTimer(apiUrl: string): Promise<void>
	{
		apiUrl = Helper.trimChar(apiUrl, "/", false, true);
		const currentRefresh = PowerBIDatasets.refreshTimers.get(apiUrl);

		if (currentRefresh) {
			ThisExtension.log("Refresh is already monitored: " + apiUrl);
			return;
		}
		else {
			const newTimer = this.startAwaitRunningRefreshTimer(apiUrl);
			PowerBIDatasets.refreshTimers.set(apiUrl, newTimer);
		}
	}

	private static async startAwaitRunningRefreshTimer(apiUrl: string): Promise<void> {
		if (!PowerBIConfiguration.datasetRefreshCheckInterval || PowerBIConfiguration.datasetRefreshCheckInterval <= 0) {
			ThisExtension.log("No dataset refresh check interval configured. Aborting polling of running Power BI refresh ...");
			return;
		}

		const timeoutSeconds = PowerBIConfiguration.datasetRefreshCheckInterval;
		let refreshTimer;
		let isFirstCheck = true;

		let lastRefresh: iPowerBIDatasetRefresh[] = await PowerBIApiService.getItemList<iPowerBIDatasetRefresh>(apiUrl, { "$top": 1 }, null);

		if (lastRefresh.length == 0) {
			ThisExtension.log("No refreshes found yet ...");
			clearInterval(refreshTimer); // abort the polling

			return;
		}

		let pollingUrl = Helper.joinPath(apiUrl, lastRefresh[0].requestId);
		if(lastRefresh[0].refreshType != "ViaEnhancedApi") {
			pollingUrl = apiUrl + "?$top=1";
		}

		const workspace = await PowerBIApiService.get<iPowerBIGroup>(apiUrl.split("/").slice(0, 3).join("/"));
		const dataset = await PowerBIApiService.get<iPowerBIGroup>(apiUrl.split("/").slice(0, 5).join("/"));

		ThisExtension.log(`Starting polling of running Power BI refresh for dataset '${dataset.name}' every ${timeoutSeconds} seconds ...`);

		refreshTimer = setInterval(async () => {
			ThisExtension.log(`Checking refresh status for dataset '${dataset.name}' ...`)

			let lastRefresh: iPowerBIDatasetRefresh = await PowerBIApiService.get<iPowerBIDatasetRefresh>(pollingUrl, null);

			if("value" in lastRefresh) {
				lastRefresh = lastRefresh.value[0];
			}

			if (!["Unknown", "NotStarted"].includes(lastRefresh.status)) {
				const maxAttempts = lastRefresh.refreshAttempts.reduce((a, b) => Math.max(a, b.attemptId), 0);
				let retries = ".";
				if(maxAttempts > 1) {
					retries = ` after ${maxAttempts - 1} retries!`;
					//retries = ` - ${maxAttempts} attempts`;
				}
				const msg = `Refresh of Power BI dataset '${dataset.name}' in workspace '${workspace.name}' completed with status '${lastRefresh.status}'${retries}`;
				ThisExtension.log(msg);
				vscode.window.showInformationMessage(msg, "OK");

				ThisExtension.TreeViewWorkspaces.refresh(undefined, false);

				clearInterval(refreshTimer); // abort the polling
				this.refreshTimers.delete(apiUrl);
			}
			isFirstCheck = false;
		}, timeoutSeconds * 1000);

		return refreshTimer;
	}
}