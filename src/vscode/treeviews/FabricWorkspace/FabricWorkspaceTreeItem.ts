import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';

import { ThisExtension, TreeProviderId } from '../../../ThisExtension';
import { FabricApiItemType, iFabricApiItem } from '../../../fabric/_types';

export class FabricWorkspaceTreeItem extends vscode.TreeItem  implements iFabricApiItem {
	protected _displayName: string;
	protected _workspaceId: UniqueId;
	protected _type: FabricApiItemType;
	protected _itemId: UniqueId;
	protected _parent: FabricWorkspaceTreeItem;
	protected _itemDescription?: string;

	protected _definition: object;

	constructor(
		displayName: string,
		workspaceId: UniqueId,
		type: FabricApiItemType,
		id: UniqueId,
		parent: FabricWorkspaceTreeItem,
		description?: string,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		super(displayName, collapsibleState);

		this._parent = parent;
		this._displayName = displayName;
		this._itemId = id;
		this._type = type;
		this._workspaceId = workspaceId;
		this._itemDescription = description;

		this.definition = {
			displayName: displayName,
			workspaceId: workspaceId.toString(),
			type: type,
			id: id.toString(),
			description: description
		};
	}

	protected getIconPath(theme: string): string | vscode.Uri {
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, this.type.toString().toLowerCase() + '.png');
	}

	// tooltip shown when hovering over the item
	get _tooltip(): string {
		let tooltip: string = "";
		for (const [key, value] of Object.entries(this._definition)) {
			if (typeof value === "string") {
				if (value.length > 100) {
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
		return "," + this.type + ",";
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

	get type(): FabricApiItemType {
		return this._type;
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

		while (parent !== undefined && parent.type !== type) {
			parent = parent.parent;
		}

		return parent as T;
	}

	getPathItemByType<T = FabricWorkspaceTreeItem>(type: FabricApiItemType): T {
		let parent: FabricWorkspaceTreeItem = this;

		while (parent !== undefined && parent.type !== type) {
			parent = parent.parent;
		}

		return parent as T;
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
}