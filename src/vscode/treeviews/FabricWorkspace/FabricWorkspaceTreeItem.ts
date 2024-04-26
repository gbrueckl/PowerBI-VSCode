import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';

import { ThisExtension, TreeProviderId } from '../../../ThisExtension';
import { FabricApiItemType, FabricApiWorkspaceType, iFabricApiItem } from '../../../fabric/_types';
import { FabricFSUri } from '../../filesystemProvider/fabric/FabricFSUri';
import { FABRIC_SCHEME } from '../../filesystemProvider/fabric/FabricFileSystemProvider';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { FabricWorkspace } from './FabricWorkspace';

export class FabricWorkspaceTreeItem extends vscode.TreeItem  implements iFabricApiItem {
	protected _displayName: string;
	protected _workspaceId: UniqueId;
	protected _type: string;
	protected _itemId: UniqueId;
	protected _parent: FabricWorkspaceTreeItem;
	protected _itemDescription?: string;

	protected _definition: object;

	constructor(
		displayName: string,
		workspaceId: UniqueId,
		type: FabricApiItemType | FabricApiWorkspaceType,
		id: UniqueId,
		parent: FabricWorkspaceTreeItem,
		description?: string | boolean,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(displayName, collapsibleState);

		this._parent = parent;
		this._displayName = displayName;
		this._itemId = id;
		this._type = type.toString();
		this._workspaceId = workspaceId;
		if(description !== undefined && typeof description === "string")
		{
			this._itemDescription = description;
		}

		this.definition = {
			displayName: displayName,
			workspaceId: workspaceId.toString(),
			type: FabricApiItemType[type],
			id: id.toString(),
			description: description
		};

		this.id = (id as string);
		this.label = this._displayName;
		this.tooltip = this.getToolTip(this.definition);
		this.description = this._description;
		this.contextValue = this._contextValue;
		
		this.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	protected getIconPath(theme: string): string | vscode.Uri {
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, 'Fabric', FabricApiItemType[this.type] + '.svg');
	}

	// tooltip shown when hovering over the item
	protected getToolTip(definition: any) {
		let tooltip: string = "";
		for (const [key, value] of Object.entries(definition)) {
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
		const actions = [FabricApiItemType[this.type].toUpperCase(), "FABRIC"]
		return "," + actions.join(",") + ",";
	}
	
	get itemId(): UniqueId {
		return this._itemId;
	}
	
	get displayName(): string {
		return this._displayName;
	}

	get workspaceId(): UniqueId {
		return this._workspaceId;
	}

	get type(): string {
		return this._type;
	}

	get typeKey(): FabricApiItemType {
		return Number(this._type) as FabricApiItemType;
	}

	/* Overwritten properties from FabricApiTreeItem */
	get definition(): iFabricApiItem {
		return this._definition as iFabricApiItem;
	}

	protected set definition(value: iFabricApiItem) {
		this._definition = value;
	}

	get TreeProvider(): TreeProviderId {
		return "application/vnd.code.tree.fabricworkspaces";
	}
	
	get parent(): FabricWorkspaceTreeItem {
		return this._parent;
	}

	public async getChildren(element?: FabricWorkspaceTreeItem): Promise<FabricWorkspaceTreeItem[]> {
		await vscode.window.showErrorMessage("getChildren is not implemented! Please overwrite in derived class!");
		return undefined;
	}

	getParentByType<T = FabricWorkspaceTreeItem>(type: FabricApiItemType): T {
		let parent: FabricWorkspaceTreeItem = this.parent;

		while (parent !== undefined && parent.typeKey !== type) {
			parent = parent.parent;
		}

		return parent as T;
	}

	getPathItemByType<T = FabricWorkspaceTreeItem>(type: FabricApiItemType): T {
		let parent: FabricWorkspaceTreeItem = this;

		while (parent !== undefined && parent.typeKey !== type) {
			parent = parent.parent;
		}

		return parent as T;
	}

	public copyIdToClipboard(): void {
		vscode.env.clipboard.writeText(this.itemId.toString());
	}

	public copyNameToClipboard(): void {
		vscode.env.clipboard.writeText(this.displayName);
	}

	public copyPathToClipboard(): void {
		vscode.env.clipboard.writeText(this.apiPath);
	}

	public getBrowserLink(): vscode.Uri {
		//https://app.powerbi.com/groups/ccce57d1-10af-1234-1234-665f8bbd8458/datasets/7cdff921-9999-8888-b0c8-34be20567742

		return vscode.Uri.joinPath(vscode.Uri.parse(FabricApiService.BrowserBaseUrl), this.itemPath);
	}

	public openInBrowser(): void {
		const tenantParam = FabricApiService.TenantId ? `?ctid=${FabricApiService.TenantId}` : "";
		const fullLink = `${this.getBrowserLink()}${tenantParam}`;
		
		Helper.openLink(fullLink);
	}

	get apiUrlPart(): string {
		if (this.type.toString().endsWith("s")) {
			return this.type.toString().toLowerCase();
		}
		if (this.itemId) {
			return this.itemId.toString();
		}
		return this.id;
	}

	get itemPath(): string {

		let urlParts: string[] = [];

		let apiItem: FabricWorkspaceTreeItem = this;

		while (apiItem) {
			if (apiItem.apiUrlPart) {
				urlParts.push(apiItem.apiUrlPart)
			}
			apiItem = apiItem.parent;
		}
		urlParts = urlParts.filter(x => x.length > 0);

		return `${urlParts.reverse().join("/")}`;
	}

	get oneLakeUri(): vscode.Uri {
		return undefined;
	}

	get apiPath(): string {
		return `/v1/${this.itemPath}`;
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

	
	public async editItems(): Promise<void> {
		const fabricUri = new FabricFSUri(vscode.Uri.parse(`${FABRIC_SCHEME}://${this.itemPath}`));

		await Helper.addToWorkspace(fabricUri.uri, `Fabric - ${this.displayName}`, true);
		// if the workspace does not exist, the folder is opened in a new workspace where the Fabric folder would be reloaded again
		// so we only load the URI if we already have a workspace
	}
}