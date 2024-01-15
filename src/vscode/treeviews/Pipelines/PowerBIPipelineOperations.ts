import * as vscode from 'vscode';

import {  UniqueId } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

import { iPowerBIDataflow } from '../../../powerbi/DataflowsAPI/_types';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { PowerBIPipelineTreeItem } from './PowerBIPipelineTreeItem';
import { PowerBIPipelineStage } from './PowerBIPipelineStage';
import { iPowerBIPipelineOperation, iPowerBIPipelineStage } from '../../../powerbi/PipelinesAPI/_types';
import { PowerBIPipelineOperation } from './PowerBIPipelineOperation';


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIPipelineOperations extends PowerBIPipelineTreeItem {
	private _pipelineId: UniqueId;

	constructor(
		pipelineId: UniqueId,
		parent: PowerBIPipelineTreeItem
	) {
		super("Operations", "PIPELINEOPERATIONS", pipelineId, parent);

		this._pipelineId = pipelineId;

		// the groupId is not unique for logical folders hence we make it unique
		this.id = pipelineId + "/" + this.itemType.toString();
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		return undefined;
	}

	// description is show next to the label
	get _description(): string {
		return undefined;
	}

		get apiUrlPart(): string {
		return "operations";
	}

	async getChildren(element?: PowerBIPipelineTreeItem): Promise<PowerBIPipelineTreeItem[]> {
		if(!PowerBIApiService.isInitialized) { 			
			return Promise.resolve([]);
		}

		if (element != null && element != undefined) {
			return element.getChildren();
		}
		else {
			let children: PowerBIPipelineOperation[] = [];
			let items: iPowerBIPipelineOperation[] = await PowerBIApiService.getPipelineOperations(this._pipelineId);

			for (let item of items) {
				let treeItem = new PowerBIPipelineOperation(item, this._pipelineId, this);
				children.push(treeItem);
				PowerBICommandBuilder.pushQuickPickItem(treeItem);
			}
			
			return children;
		}
	}
}