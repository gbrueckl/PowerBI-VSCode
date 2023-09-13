import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../helpers/Helper';

import { ApiItemType } from './_types';
import { iPowerBIApiItem } from './iPowerBIApiItem';
import { ThisExtension, TreeProviderId } from '../../ThisExtension';
import { ApiUrlPair } from '../../powerbi/_types';
import { PowerBIApiService } from '../../powerbi/PowerBIApiService';
import { iHandleBeingDropped } from './PowerBIApiDragAndDropController';
import { PowerBICommandBuilder, PowerBIQuickPickItem } from '../../powerbi/CommandBuilder';


export class PowerBIApiTreeItem extends vscode.TreeItem implements iPowerBIApiItem {
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

		super.id = (id as string);
		super.label = this.name;
		super.tooltip = this._tooltip;
		super.description = this._description;
		super.contextValue = this._contextValue;

		super.iconPath = {
			light: this.getIconPath("light"),
			dark: this.getIconPath("dark")
		};
	}

	protected getIconPath(theme: string): vscode.Uri {
		return vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', theme, this.itemType.toLowerCase() + '.png');
	}

	// command to execute when clicking the TreeItem
	command: vscode.Command = {
		command: 'PowerBI.updateQuickPickList', title: "Update QuickPick List", arguments: [this]
	};


	// tooltip shown when hovering over the item
	get _tooltip(): string {
		let tooltip: string = "";
		for (const [key, value] of Object.entries(this.definition)) {
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

	public CopyPathToClipboard(): void {
		vscode.env.clipboard.writeText(this._name);
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

	get apiUrlPair(): ApiUrlPair {
		return { itemType: this.itemType, itemId: this.id };
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

		return `v1.0/${urlParts.reverse().join("/")}/`;
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

		ThisExtension.setStatusBar(`Deleting ${apiItem.itemType.toLowerCase()} '${apiItem.name}' ...`, true);
		await PowerBICommandBuilder.execute<any>(apiItem.apiPath, "DELETE", []);
		const successMsg = `${apiItem.itemType.toLowerCase()} '${apiItem.name}' deleted!`
		ThisExtension.setStatusBar(successMsg);
		Helper.showTemporaryInformationMessage(successMsg, 2000);
	}
}