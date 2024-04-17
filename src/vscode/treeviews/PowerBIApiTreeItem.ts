import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../helpers/Helper';

import { ApiItemType } from './_types';
import { iPowerBIApiItem } from './iPowerBIApiItem';
import { ThisExtension, TreeProviderId } from '../../ThisExtension';
import { ApiUrlPair } from '../../powerbi/_types';
import { PowerBIApiService } from '../../powerbi/PowerBIApiService';
import { iHandleBeingDropped } from './PowerBIApiDragAndDropController';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../powerbi/CommandBuilder';
import { PowerBIApiDrop } from '../dropProvider/_types';


export class PowerBIApiTreeItem extends vscode.TreeItem implements iPowerBIApiItem, PowerBIApiDrop {
	protected _itemType: ApiItemType;
	protected _id: UniqueId;
	protected _name: string;
	protected _definition: object;
	protected _parent?: PowerBIApiTreeItem;

	constructor(
		id: UniqueId,
		name: string,
		itemType: ApiItemType,
		parent: PowerBIApiTreeItem = undefined,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(name, collapsibleState);

		this._name = name;
		this._itemType = itemType;
		this._id = id;
		this._parent = parent;

		this._definition = {
			name: name,
			itemType: itemType,
			uid: id
		};

		this.id = (id as string);
		this.label = this.name;
		this.tooltip = this._tooltip;
		this.description = this._description;
		this.contextValue = this._contextValue;

		this.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	protected getIconPath(theme: string): string | vscode.Uri {
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, this.itemType.toLowerCase() + '.png');
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		let tooltip: string = "";
		for (const [key, value] of Object.entries(this._definition)) {
			if (typeof value === "string") {
				if (value.length > 100 || value.length < 1) {
					continue;
				}
			}
			tooltip += `${key}: ${JSON.stringify(value, null, 4)}\n`;
		}

		return tooltip.trim();
	}

	// description is show next to the label
	get _description(): string {
		return this._id.toString();
	}

	// used in package.json to filter commands via viewItem =~ /.*,GROUP,.*/
	get _contextValue(): string {
		return "," + this.itemType + ",";
	}

	public async getChildren(element?: PowerBIApiTreeItem): Promise<PowerBIApiTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}

	/* iDatabrickWorkspaceItem implementatin */
	get definition(): object {
		return this._definition;
	}

	set definition(value: object) {
		this._definition = value;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get itemType(): ApiItemType {
		return this._itemType;
	}

	get uid() {
		return this._id;
	}

	get parent(): PowerBIApiTreeItem {
		return this._parent;
	}

	getParentByType<T = PowerBIApiTreeItem>(type: ApiItemType): T {
		let parent: PowerBIApiTreeItem = this.parent;

		while (parent !== undefined && parent.itemType !== type) {
			parent = parent.parent;
		}

		return parent as T;
	}

	getPathItemByType<T = PowerBIApiTreeItem>(type: ApiItemType): T {
		let parent: PowerBIApiTreeItem = this;

		while (parent !== undefined && parent.itemType !== type) {
			parent = parent.parent;
		}

		return parent as T;
	}

	get TreeProvider(): TreeProviderId {
		throw new Error("Method not implemented.");
	}

	public copyIdToClipboard(): void {
		vscode.env.clipboard.writeText(this._id.toString());
	}

	public copyNameToClipboard(): void {
		vscode.env.clipboard.writeText(this._name);
	}

	public copyPathToClipboard(): void {
		vscode.env.clipboard.writeText(this.apiPath);
	}

	public getBrowserLink(): vscode.Uri {
		//https://app.powerbi.com/groups/ccce57d1-10af-1234-1234-665f8bbd8458/datasets/7cdff921-9999-8888-b0c8-34be20567742

		return vscode.Uri.joinPath(vscode.Uri.parse(PowerBIApiService.BrowserBaseUrl), this.itemPath);
	}

	public openInBrowser(): void {
		const tenantParam = PowerBIApiService.TenantId ? `?ctid=${PowerBIApiService.TenantId}` : "";
		const fullLink = `${this.getBrowserLink()}${tenantParam}`;
		
		Helper.openLink(fullLink);
	}

	get apiUrlPart(): string {
		if (this.itemType.endsWith("S")) {
			return this.itemType.toLowerCase();
		}
		if (this.uid) {
			return this.uid.toString();
		}
		return this.id;
	}

	get itemPath(): string {

		let urlParts: string[] = [];

		let apiItem: PowerBIApiTreeItem = this;

		while (apiItem) {
			if (apiItem.apiUrlPart) {
				urlParts.push(apiItem.apiUrlPart)
			}
			apiItem = apiItem.parent;
		}
		urlParts = urlParts.filter(x => x.length > 0);

		return `${urlParts.reverse().join("/")}`;
	}

	get apiPath(): string {

		let urlParts: string[] = [];

		let apiItem: PowerBIApiTreeItem = this;

		while (apiItem) {
			if (apiItem.apiUrlPart) {
				urlParts.push(apiItem.apiUrlPart)
			}
			apiItem = apiItem.parent;
		}
		urlParts.push(PowerBIApiService.Org)
		urlParts = urlParts.filter(x => x.length > 0)

		return `v1.0/${PowerBIApiService.Org}/${this.itemPath}/`;
	}

	get asQuickPickItem(): PowerBIQuickPickItem {
		let qpItem = new PowerBIQuickPickItem(this.name, this.uid.toString(), this.uid.toString());
		qpItem.apiItem = this;

		return qpItem;
	}

	async insertCode(): Promise<void> {
		const editor = vscode.window.activeTextEditor;
		if (editor === undefined) {
			return;
		}

		const start = editor.selection.start;
		const end = editor.selection.end;
		const range = new vscode.Range(start.line, start.character, end.line, end.character);
		await editor.edit((editBuilder) => {
			editBuilder.replace(range, this.code);
		});
	}

	get code(): string {
		return Helper.trimChar("/" + this.apiPath.split("/").slice(2).join("/"), "/", false);
	}

	// API Drop
	get apiDrop(): string {
		return Helper.trimChar("/" + this.apiPath.split("/").slice(2).join("/"), "/", false);
	}

	public static async delete(apiItem: PowerBIApiTreeItem, confirmation: "yesNo" | "name" | undefined = undefined): Promise<void> {
		if (confirmation) {
			let confirm: string;
			switch (confirmation) {
				case "yesNo":
					confirm = await PowerBICommandBuilder.showQuickPick([new PowerBIQuickPickItem("yes"), new PowerBIQuickPickItem("no")], `Do you really want to delete ${apiItem.itemType.toLowerCase()} '${apiItem.name}'?`, undefined, undefined);
					break;
				case "name":
					confirm = await PowerBICommandBuilder.showInputBox("", `Confirm deletion by typeing the ${apiItem.itemType.toLowerCase()} name '${apiItem.name}' again.`, undefined, undefined);
					break;
			}

			if (!confirm
				|| (confirmation == "name" && confirm != apiItem.name)
				|| (confirmation == "yesNo" && confirm != "yes")) {
				const abortMsg = `Deletion of ${apiItem.itemType.toLowerCase()} '${apiItem.name}' aborted!`
				ThisExtension.log(abortMsg);
				Helper.showTemporaryInformationMessage(abortMsg, 2000)
				return;
			}
		}

		ThisExtension.setStatusBarRight(`Deleting ${apiItem.itemType.toLowerCase()} '${apiItem.name}' ...`, true);
		const response = await PowerBICommandBuilder.execute<any>(apiItem.apiPath, "DELETE", []);
		if (response.error) {
			const errorMsg = response.error.message;
			vscode.window.showErrorMessage(errorMsg);
			ThisExtension.setStatusBarRight("Deletion failed!");
		}
		else {
			const successMsg = `${apiItem.itemType.toLowerCase()} '${apiItem.name}' deleted!`
			ThisExtension.setStatusBarRight(successMsg);
			Helper.showTemporaryInformationMessage(successMsg, 2000);

			if (apiItem.parent) {
				ThisExtension.refreshTreeView(apiItem.TreeProvider, apiItem.parent);
			}
		}
	}
}