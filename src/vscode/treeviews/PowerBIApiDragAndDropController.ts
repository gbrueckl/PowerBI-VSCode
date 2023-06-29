import * as vscode from 'vscode';

import { ThisExtension, TreeProviderId } from '../../ThisExtension';

import { PowerBIApiTreeItem } from './PowerBIApiTreeItem';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../powerbi/CommandBuilder';
import { PowerBIWorkspace } from './workspaces/PowerBIWorkspace';
import { PowerBIPipelineStage } from './Pipelines/PowerBIPipelineStage';
import { PowerBICapacity } from './Capacities/PowerBICapacity';
import { PowerBIReport } from './workspaces/PowerBIReport';
import { Helper } from '../../helpers/Helper';


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
		"powerbiapidragdrop",
		"text/uri-list" // to support drag and drop from the file explorer (not yet working)
	]);
	dragMimeTypes: readonly string[] = ThisExtension.TreeProviderIds.map((x) => x.toString()).concat([
		"powerbiapidragdrop"
	]);

	public async handleDrag?(source: readonly PowerBIApiTreeItem[], dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
		dataTransfer.set(source[0].TreeProvider, new PowerBIObjectTransferItem(source));
		dataTransfer.set("powerbiapidragdrop", new PowerBIObjectTransferItem(source));
	}

	public async handleDrop?(target: PowerBIApiTreeItem, dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
		ThisExtension.log("Dropped item on " + target.itemType + " ...");

		let uriList = await dataTransfer.get("text/uri-list");
		if (uriList != null) {
			ThisExtension.log(await uriList.asString());
		}

		const ws = dataTransfer.get("application/vnd.code.tree.powerbiworkspaces");
		const transferItem = dataTransfer.get('powerbiapidragdrop');

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

		if (source.itemType == "GROUP") {
			if (["CAPACITY"].includes(target.itemType)) {
				const assignCapacity = async () => PowerBIWorkspace.assignToCapacity((source as PowerBIWorkspace), { capacityId: (target as PowerBICapacity).uid });
				actions.set("assign to capacity", assignCapacity);
				treeViewtoRefresh = source.TreeProvider;
			}
			if (["PIPELINESTAGE"].includes(target.itemType)) {
				const assignStage = async () => PowerBIPipelineStage.assignWorkspace(target as PowerBIPipelineStage, { workspaceId: source.uid });
				actions.set("assign to stage", assignStage);
			}
		}
		else if (source.itemType == "REPORT") {
			if (["GROUP", "REPORTS"].includes(target.itemType)) {
				const targetGroup = (target as PowerBIWorkspace).groupId;
				const clone = async () => PowerBIReport.clone(source as PowerBIReport, {
					name: source.name + " - Clone",
					targetWorkspaceId: (target as PowerBIWorkspace).groupId
				});
				actions.set("clone", clone);
			}
			if (target.itemType == "DATASET") {
				const rebind = async () => PowerBIReport.rebind(source as PowerBIReport, { datasetId: target.uid });
				actions.set("rebind", rebind);

				const clone = async () => PowerBIReport.clone(source as PowerBIReport, {
					name: source.name + " - Clone",
					targetModelId: target.uid,
					targetWorkspaceId: (source as PowerBIReport).groupId
				});
				actions.set("clone", clone);
			}
			else if (target.itemType == "REPORT") {
				const updateContent = async () => PowerBIReport.updateContent(target as PowerBIReport, {
					sourceReport: {
						sourceReportId: source.uid,
						sourceWorkspaceId: (source as PowerBIReport).groupId
					},
					sourceType: "ExistingReport"
				});
				actions.set("update content", updateContent);
			}
		}

		if (actions.size > 0) {
			let items: PowerBIQuickPickItem[] = [];
			for (const key of actions.keys()) {
				items.push(new PowerBIQuickPickItem(key));
			}
			const action: string = await PowerBICommandBuilder.showQuickPick(items, "Action", null, null);

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
