import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../helpers/Helper';

import { ApiItemType } from './_types';
import { iPowerBIApiItem } from './iPowerBIApiItem';
import { ThisExtension, TreeProviderId } from '../../ThisExtension';
import { PowerBIApiService } from '../../powerbi/PowerBIApiService';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../powerbi/CommandBuilder';
import { PowerBIApiDrop } from '../dropProvider/_types';
import { FabricApiItemType, iFabricApiItem } from '../../fabric/_types';



export class GenericApiTreeItem extends vscode.TreeItem implements iPowerBIApiItem, iFabricApiItem, PowerBIApiDrop {
	protected _apiType: "PowerBI" | "Fabric";
	protected _itemType: ApiItemType | FabricApiItemType;
	protected _itemId: UniqueId;
	protected _itemName: string;
	protected _itemDescription: string;
	protected _itemDefinition: object;
	protected _parent?: GenericApiTreeItem;

	constructor(
		apiType: "PowerBI" | "Fabric",
		id: UniqueId,
		name: string,
		itemType: ApiItemType | FabricApiItemType,
		parent: GenericApiTreeItem = undefined,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(name, collapsibleState);

		this._apiType = apiType;
		this._itemName = name;
		this._itemType = itemType;
		this._itemId = id;
		this._parent = parent;

		this._itemDefinition = {
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

	//#region TreeItem
	protected getIconPath(theme: string): string | vscode.Uri {
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, this.itemType.toLowerCase() + '.png');
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		let tooltip: string = "";
		for (const [key, value] of Object.entries(this._itemDefinition)) {
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
		return this._itemId.toString();
	}

	// used in package.json to filter commands via viewItem =~ /.*,GROUP,.*/
	get _contextValue(): string {
		return "," + this.itemType + ",";
	}

	public async getChildren(element?: GenericApiTreeItem): Promise<GenericApiTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}
	//#endregion

	get apiType(): "PowerBI" | "Fabric" {
		return this._apiType;
	}

	//#region iPowerBIApiItem
	get definition(): object {
		return this._itemDefinition;
	}

	set definition(value: object) {
		this._itemDefinition = value;
	}

	get name(): string {
		return this._itemName;
	}

	set name(value: string) {
		this._itemName = value;
	}

	get itemType(): ApiItemType {
		return this._itemType as ApiItemType;
	}

	get uid() {
		return this._itemId;
	}
	//#endregion

	//#region iFabricApiItem
	get displayName(): string {
		return this._itemName;
	}

	get itemDescription(): string {
		return this._itemDescription;

	}
	get type(): FabricApiItemType {
		return this._itemType as FabricApiItemType;
	}

	get workspaceId(): UniqueId {
		return this.getParentByType("WORKSPACE").uid;
	}

	get parent(): GenericApiTreeItem {
		return this._parent;
	}

	getParentByType<T = GenericApiTreeItem>(type: ApiItemType): T {
		let parent: GenericApiTreeItem = this.parent;

		while (parent !== undefined && parent.itemType !== type) {
			parent = parent.parent;
		}

		return parent as T;
	}

	getPathItemByType<T = GenericApiTreeItem>(type: ApiItemType): T {
		let parent: GenericApiTreeItem = this;

		while (parent !== undefined && parent.itemType !== type) {
			parent = parent.parent;
		}

		return parent as T;
	}

	get TreeProvider(): TreeProviderId {
		throw new Error("Method not implemented.");
	}

	public copyIdToClipboard(): void {
		vscode.env.clipboard.writeText(this._itemId.toString());
	}

	public copyNameToClipboard(): void {
		vscode.env.clipboard.writeText(this._itemName);
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

		let apiItem: GenericApiTreeItem = this;

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

		let apiItem: GenericApiTreeItem = this;

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

	public static async delete(apiItem: GenericApiTreeItem, confirmation: "yesNo" | "name" | undefined = undefined): Promise<void> {
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