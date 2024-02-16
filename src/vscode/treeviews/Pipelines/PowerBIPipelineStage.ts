import * as vscode from 'vscode';


import { Helper, UniqueId } from '../../../helpers/Helper';
import { iPowerBIPipelineStage, iPowerBIPipelineStageArtifacts, resolveOrder, resolveOrderShort } from '../../../powerbi/PipelinesAPI/_types';
import { ThisExtension } from '../../../ThisExtension';
import { PowerBIPipelineTreeItem } from './PowerBIPipelineTreeItem';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { PowerBICommandBuilder, PowerBICommandInput, PowerBIQuickPickItem } from '../../../powerbi/CommandBuilder';
import { PowerBIPipelineStageArtifacts } from './PowerBIPipelineStageArtifacts';
import { PowerBIPipeline } from './PowerBIPipeline';
import { iPowerBIPipelineDeployableItem } from './iPowerBIPipelineDeployableItem';
import { pipeline } from 'stream';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBIPipelineStage extends PowerBIPipelineTreeItem implements iPowerBIPipelineDeployableItem {

	constructor(
		definition: iPowerBIPipelineStage,
		pipelineId: UniqueId,
		parent: PowerBIPipelineTreeItem
	) {
		super(definition.order.toString(), "PIPELINESTAGE", pipelineId, parent, vscode.TreeItemCollapsibleState.Collapsed);

		this.definition = definition;
		this.label = this._label;
		this.id = `${pipelineId.toString()}/${definition.order.toString()}`;

		this.tooltip = this._tooltip;
		this.description = null;

		this.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
		this.contextValue = this._contextValue;
	}

	protected getIconPath(theme: string): vscode.Uri {
		let stage: string = `_${resolveOrderShort(this.definition.order)}`;

		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, this.itemType.toLowerCase() + stage + '.png');
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get _label(): string {
		let ret: string = resolveOrder(this.definition.order);

		return ret + ": " + this.definition.workspaceName;
	}

	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = [];

		if (this.definition.workspaceId) {
			actions.push("UNASSIGN");
		}
		else
		{
			actions.push("ASSIGN");
		}

		return orig + actions.join(",") + ",";
	}

	get definition(): iPowerBIPipelineStage {
		return super.definition as iPowerBIPipelineStage;
	}

	set definition(value: iPowerBIPipelineStage) {
		super.definition = value;
	}

	get apiUrlPart(): string {
		return this.definition.order.toString();
	}

	get asQuickPickItem(): PowerBIQuickPickItem {
		const qpItem = new PowerBIQuickPickItem(this.name, this.uid.toString(), this.uid.toString(), `Order: ${this.definition.order}`);
		qpItem.apiItem = this;

		return qpItem;
	}

	async getChildren(element?: PowerBIPipelineTreeItem): Promise<PowerBIPipelineTreeItem[]> {
		let children: PowerBIPipelineTreeItem[] = [];
		let artifacts: iPowerBIPipelineStageArtifacts = await PowerBIApiService.getPipelineStageArtifacts(this.getParentByType<PowerBIPipeline>("PIPELINE").uid, this.definition.order);

		// if there is no stage assigned, artifacts will contain an error
		if(!("error" in artifacts)) {
			if (artifacts.datasets.length > 0) {
				children.push(new PowerBIPipelineStageArtifacts(this.uid, this.definition.order, "PIPELINESTAGEDATASETS", artifacts.datasets, this));
			}
			if (artifacts.reports.length > 0) {
				children.push(new PowerBIPipelineStageArtifacts(this.uid, this.definition.order, "PIPELINESTAGEREPORTS", artifacts.reports, this));
			}
			if (artifacts.dashboards.length > 0) {
				children.push(new PowerBIPipelineStageArtifacts(this.uid, this.definition.order, "PIPELINESTAGEDASHBOARDS", artifacts.dashboards, this));
			}
			if (artifacts.dataflows.length > 0) {
				children.push(new PowerBIPipelineStageArtifacts(this.uid, this.definition.order, "PIPELINESTAGEDATAFLOWS", artifacts.dataflows, this));
			}
			if (artifacts.datamarts.length > 0) {
				children.push(new PowerBIPipelineStageArtifacts(this.uid, this.definition.order, "PIPELINESTAGEDATAMARTS", artifacts.datamarts, this));
			}
		}

		return children;
	}

	// properties of iPowerBIPipelineDeployableItem
	get artifactIds(): {sourceId: string}[] {
		return [];
	}
	get artifactType(): string
	{
		return this.itemType;
	}

	async getDeployableItems(): Promise<{[key: string]: {sourceId: string}[]}>
	{
		const allArtifacts = await this.getChildren() as PowerBIPipelineStageArtifacts[];
		let obj = {};
		for(let stageArtifacts  of allArtifacts) {
			obj[stageArtifacts.itemType.replace("PIPELINESTAGE", "").toLowerCase()] = stageArtifacts.artifactIds;
		}

		return obj;
	}

	// Pipelinestage-specific funtions
	public static async assignWorkspace(stage: PowerBIPipelineStage, settings: object = undefined): Promise<void> {
		const apiUrl = Helper.joinPath(stage.apiPath, "assignWorkspace");

		let confirm: string = await PowerBICommandBuilder.showInputBox("", "Confirm assignment of workspace by typeing the stage name '" + stage.name + "' again.", undefined, undefined);
		
		if (!confirm || confirm != stage.name) {
			ThisExtension.log("Assignment to stage aborted!")
			return;
		}

		if (settings == undefined) // prompt user for inputs
		{
			PowerBICommandBuilder.execute<any>(apiUrl, "POST",
				[
					new PowerBICommandInput("Workspace", "WORKSPACE_SELECTOR", "workspaceId", false, "The workspace ID.")
				]);
		}
		else {
			PowerBIApiService.post(apiUrl, settings);
		}

		ThisExtension.TreeViewPipelines.refresh(stage.parent, false);
	}

	public static async unassignWorkspace(stage: PowerBIPipelineStage): Promise<void> {
		const apiUrl =  Helper.joinPath(stage.apiPath, "unassignWorkspace");

		let confirm: string = await PowerBICommandBuilder.showInputBox("", "Confirm ufassignment of workspace by typeing the stage name '" + stage.name + "' again.", undefined, undefined);
		
		if (!confirm || confirm != stage.name) {
			ThisExtension.log("Unassignment to stage aborted!")
			return;
		}

		PowerBIApiService.post(apiUrl, null);

		ThisExtension.TreeViewPipelines.refresh(stage.parent, false);
	}
}