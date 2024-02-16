import * as vscode from 'vscode';

import { ThisExtension, TreeProviderId } from '../../ThisExtension';

import { PowerBIApiTreeItem } from './PowerBIApiTreeItem';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../powerbi/CommandBuilder';
import { PowerBIWorkspace } from './workspaces/PowerBIWorkspace';
import { PowerBIPipelineStage } from './Pipelines/PowerBIPipelineStage';
import { PowerBICapacity } from './Capacities/PowerBICapacity';
import { PowerBIReport } from './workspaces/PowerBIReport';
import { Helper } from '../../helpers/Helper';

export const PowerBIDragMIMEType = "powerbiapidragdrop";

export interface iHandleBeingDropped {
	get canBeDropped(): boolean;
	handleBeingDropped(target: PowerBIApiTreeItem): Promise<void>;
}

class PowerBIObjectTransferItem extends vscode.DataTransferItem {
	constructor(private _nodes: readonly PowerBIApiTreeItem[]) {
		super(_nodes);
	}

	asObject(): readonly PowerBIApiTreeItem[] {
		return this._nodes;
	}

	async asString(): Promise<string> {
		return this.jsonifyObject(this.value, 3);
	}

	jsonifyObject(obj: Object, maxLevels: number = 2, currentLevel: number = 0): string {

		if (currentLevel == maxLevels) {
			return "\"MaxRecrusionlevelReached!\"";
		}
		var arrOfKeyVals = [],
			arrVals = [],
			objKeys = [];

		/*********CHECK FOR PRIMITIVE TYPES**********/
		if (typeof obj === 'number' || typeof obj === 'boolean' || obj === null)
			return '' + obj;
		else if (typeof obj === 'string')
			return JSON.stringify(obj);

		/*********CHECK FOR ARRAY**********/
		else if (Array.isArray(obj)) {
			//check for empty array
			if (obj[0] === undefined)
				return '[]';
			else {
				obj.forEach((el) => {
					arrVals.push(this.jsonifyObject(el, maxLevels, currentLevel + 1));
				});
				return '[' + arrVals + ']';
			}
		}
		/*********CHECK FOR OBJECT**********/
		else if (obj instanceof Object) {
			//get object keys
			//objKeys = Object.keys(obj);
			objKeys = this.getAllProperties(obj)
			//set key output;
			objKeys.forEach((key) => {
				var keyOut = JSON.stringify(key) + ':';
				var keyValOut = obj[key];
				//skip functions and undefined properties
				if (keyValOut instanceof Function || typeof keyValOut === undefined)
					arrOfKeyVals.push(keyOut + JSON.stringify("function " + keyValOut + "()"));
				else if (typeof keyValOut === 'string')
					arrOfKeyVals.push(keyOut + JSON.stringify(keyValOut));
				else if (typeof keyValOut === 'boolean' || typeof keyValOut === 'number' || keyValOut === null)
					arrOfKeyVals.push(keyOut + keyValOut);
				//check for nested objects, call recursively until no more objects
				else if (keyValOut instanceof Object) {
					arrOfKeyVals.push(keyOut + this.jsonifyObject(keyValOut, maxLevels, currentLevel + 1));
				}
			});
			return '{' + arrOfKeyVals + '}';
		}
	};

	getAllProperties(obj) {
		let properties = new Set()
		let currentObj = obj
		do {
			Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
		} while ((currentObj = Object.getPrototypeOf(currentObj)))
		return [...properties.keys()].filter((item: string) => !item.startsWith("_"))
	}
}

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export class PowerBIApiDragAndDropController implements vscode.TreeDragAndDropController<PowerBIApiTreeItem> {

	dropMimeTypes: readonly string[] = ThisExtension.TreeProviderIds.map((x) => x.toString()).concat([
		PowerBIDragMIMEType,
		"text/uri-list" // to support drag and drop from the file explorer (not yet working)
	]);
	dragMimeTypes: readonly string[] = ThisExtension.TreeProviderIds.map((x) => x.toString()).concat([
		PowerBIDragMIMEType
	]);

	public async handleDrag?(source: readonly PowerBIApiTreeItem[], dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
		dataTransfer.set(source[0].TreeProvider, new PowerBIObjectTransferItem(source));
		dataTransfer.set(PowerBIDragMIMEType, new PowerBIObjectTransferItem(source));
	}

	public async handleDrop?(target: PowerBIApiTreeItem, dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
		ThisExtension.log("Dropped item on " + target.itemType + " ...");

		// when a PBIX file is dropped on a Group/Workspace or its Datasets folder
		let uriList = await dataTransfer.get("text/uri-list");
		if (uriList != null) {
			if (["GROUP", "DATASETS"].includes(target.itemType)) {
				const uriListString = (await uriList.asString());
				ThisExtension.log("File(s) dropped on PowerBI Group: " + uriListString.toString());
				const fileUris = uriListString.split("\r\n").filter((x) => x.startsWith("file://") && x.endsWith(".pbix")).map((x) => vscode.Uri.parse(x.trim()));

				const targetGroup: PowerBIWorkspace = target.getPathItemByType("GROUP");

				const pbixImport = await PowerBIWorkspace.uploadPbixFiles(targetGroup, fileUris);
				if (pbixImport) {
					ThisExtension.log("Imported PBIX: " + pbixImport[0].name + " (" + pbixImport[0].id + ")");
					ThisExtension.refreshTreeView(target.TreeProvider, targetGroup);
				}
				else {
					ThisExtension.log("ERROR importing PBIX: " + JSON.stringify(pbixImport, null, 4));
					vscode.window.showErrorMessage("Error importing PBIX: " + JSON.stringify(pbixImport, null, 4));
				}
				return;
			}
			else {
				ThisExtension.log("File(s) dropped on PowerBI Item but no drop-handler was defined for " + target.itemType);
			}
		}

		const ws = dataTransfer.get("application/vnd.code.tree.powerbiworkspaces");
		const transferItem = dataTransfer.get(PowerBIDragMIMEType);

		if (!transferItem) {
			ThisExtension.log("Item dropped on PowerBI Workspace Tree-View - but MimeType 'application/vnd.code.tree.powerbiworkspaces' was not found!");
			return;
		}

		let sourceItems: PowerBIApiTreeItem[];
		ThisExtension.log("TransferItem: \n" + transferItem.value);
		if (typeof transferItem.value === 'string' || transferItem.value instanceof String) {
			try {
				let x = transferItem.value as string
				let y = JSON.parse(x)
				sourceItems = y as PowerBIApiTreeItem[];
			}
			catch (e) {
				ThisExtension.log("Error parsing dropped item: " + e);
			}
		}
		else {
			sourceItems = transferItem.value;
		}


		await this.handlePowerBIAPIDrop(sourceItems, target);

		/*// check if target implemnts iHandleDrop interface / has handleDrop function
		if ('handleBeingDropped' in source) {
			const treeView = ThisExtension.getTreeView(source.TreeProvider);
			const treeItem = treeView.getTreeItem(source as PowerBIApiTreeItem) as PowerBIApiTreeItem;
			//treeItem.handleBeingDropped(target);
			// not yet working for cross-treeview drag&drops
			(source as any as iHandleBeingDropped).handleBeingDropped(target);
		}
		else {
			ThisExtension.log("No action defined when dropping an '" + source.itemType + "' on a '" + target.itemType + "' node!");
		}
		*/
	}

	public async handlePowerBIAPIDrop(sourceItems: PowerBIApiTreeItem[], target: PowerBIApiTreeItem): Promise<void> {

		/* 
		// TODO
		Workspace -> PipelineStage
		Report -> Dataset (Clone, Rebind)
		Report -> Reports, Workspace (Clone)
		Dashboard -> Dashboard, Workspace (Clone) ?
		*/
		const source: PowerBIApiTreeItem = sourceItems[0];

		let actions: Map<string, () => Promise<void>> = new Map<string, () => Promise<void>>();

		// by default we refresh the treeview of the target item
		let treeViewtoRefresh: TreeProviderId = target.TreeProvider;
		const targetGroup = (target as PowerBIWorkspace).groupId;
		const sourceGroup = (source as PowerBIReport).groupId;

		if (source.itemType == "GROUP") {
			// dropping a Group/Workspace on a Capacity --> assign to that capacity
			if (["CAPACITY"].includes(target.itemType)) {
				const assignCapacity = async () => PowerBIWorkspace.assignToCapacity((source as PowerBIWorkspace), { capacityId: (target as PowerBICapacity).uid });
				actions.set("Assign to Capacity", assignCapacity);
				treeViewtoRefresh = source.TreeProvider;
			}
			// dropping a Group/Workspace on a Capacity --> assign to that pipeline stage
			if (["PIPELINESTAGE"].includes(target.itemType)) {
				const assignStage = async () => PowerBIPipelineStage.assignWorkspace(target as PowerBIPipelineStage, { workspaceId: source.uid });
				actions.set("Assign to Stage", assignStage);
			}
		}
		else if (source.itemType == "REPORT") {
			
			const clone = async (targetWorkspaceId, targetModelId = undefined) => {
					const defaultName = targetGroup == sourceGroup ? source.name + " - Copy" : source.name;
					const newReportName = await PowerBICommandBuilder.showInputBox(defaultName, "Clone Report", "Enter a name for the cloned report");
					PowerBIReport.clone(source as PowerBIReport, {
						name: newReportName,
						targetModelId: targetModelId,
						targetWorkspaceId: targetWorkspaceId
					})
				};

			// dropping a Report on a Group/Workspace or the Reports folder underneath --> create a copy of the report
			if (["GROUP", "REPORTS"].includes(target.itemType)) {
				actions.set("Clone", () => clone(targetGroup));
			}
			// dropping a Report on Dataset --> rebind or clone with connection to new dataset
			if (target.itemType == "DATASET") {
				const rebind = async () => PowerBIReport.rebind(source as PowerBIReport, { datasetId: target.uid });
				actions.set("Rebind", rebind);

				actions.set("Clone", () => clone(targetGroup, target.uid));
			}
			// dropping a Report on Report --> update content
			else if (target.itemType == "REPORT") {
				const updateContent = async () => PowerBIReport.updateContent(target as PowerBIReport, {
					sourceReport: {
						sourceReportId: source.uid,
						sourceWorkspaceId: (source as PowerBIReport).groupId
					},
					sourceType: "ExistingReport"
				});
				actions.set("Update Content", updateContent);
			}
		}

		if (actions.size > 0) {
			let items: PowerBIQuickPickItem[] = [];
			for (const key of actions.keys()) {
				items.push(new PowerBIQuickPickItem(key));
			}
			const action: string = await PowerBICommandBuilder.showQuickPick(items, "Action", "Which action do you want to perform?", null);

			if (!action) {
				return;
			}

			await actions.get(action)();

			ThisExtension.refreshTreeView(treeViewtoRefresh);
		}
		else {
			const msg: string = "No action defined when dropping a '" + source.itemType + "' on a '" + target.itemType + "'!"
			ThisExtension.log(msg);
			Helper.showTemporaryInformationMessage(msg)
		}
	}
}
