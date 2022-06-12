import { stringify } from 'querystring';
import * as vscode from 'vscode';
import { Helper } from '../helpers/Helper';
import { ThisExtension } from '../ThisExtension';
import { PowerBIWorkspaceTreeItem } from '../vscode/treeviews/workspaces/PowerBIWorkspaceTreeItem';
import { ApiItemType } from '../vscode/treeviews/workspaces/_types';
import { PowerBIApiService } from './PowerBIApiService';
import { ApiMethod } from './_types';



export type CommandInputType =
	"FREE_TEXT"
	| "WORKSPACE_SELECTOR"
	| "DATASET_SELECTOR"
	| "REPORT_SELECTOR"
	;

export class PowerBICommandInput {

	private _prompt: string;
	private _inputType: CommandInputType | string;
	private _key: string;
	private _optional: boolean;
	private _description: string;

	constructor(
		prompt: string,
		inputType: CommandInputType | string,
		key: string,
		optional: boolean = false,
		description: string = null
	) {
		this._prompt = prompt;
		this._inputType = inputType;
		this._key = key;
		this._optional = optional;
		this._description = description ?? prompt;
	}

	get Prompt(): string {
		return this._prompt;
	}

	get InputType(): CommandInputType | string {
		return this._inputType;
	}

	get Key(): string {
		return this._key;
	}

	get Optional(): boolean {
		return this._optional;
	}

	get Description(): string {
		return this._description;
	}

	public async getValue(): Promise<string> {
		switch (this.InputType) {
			case "FREE_TEXT":
				return await PowerBICommandBuilder.showInputBox(this.Prompt, this.Description);

			case "WORKSPACE_SELECTOR":
				return await PowerBICommandBuilder.showQuickPick(PowerBICommandBuilder.getQuickPickItems("GROUP"), this.Description);

			case "REPORT_SELECTOR":
				return await PowerBICommandBuilder.showQuickPick(PowerBICommandBuilder.getQuickPickItems("REPORT"), this.Description);

			case "DATASET_SELECTOR":
				return await PowerBICommandBuilder.showQuickPick(PowerBICommandBuilder.getQuickPickItems("DATASET"), this.Description);

			default:
				return this.InputType;
		}
	}
}

export class PowerBIQuickPickItem {
	private _name: string;
	private _value?: string;
	private static SEPARATOR: string = '\t';

	constructor(
		name: string,
		value?: string
	) {
		this._name = name;
		this._value = value;
	}

	get name(): string {
		return this._name;
	}

	get value(): string {
		if (this._value == null || this._value == undefined) {
			return this.name;
		}

		return this._value;
	}

	get label(): string {
		if (this._value == null || this._value == undefined) {
			return this.name;
		}

		return `${this.name}${PowerBIQuickPickItem.SEPARATOR}${this.value}`;
	}

	static GetValueFromLabel(label: string): string {
		let values = label.split(PowerBIQuickPickItem.SEPARATOR);

		// if we reached the last key, we assign the inputValue
		if (values.length == 1) {
			return values[0];
		}
		else {
			return values[1];
		}
	}
}


// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export abstract class PowerBICommandBuilder {
	private static _quickPickLists: Map<ApiItemType, PowerBIQuickPickItem[]>;
	private static _maxQuickPickListItems: number = 10;

	static async execute<T>(
		apiUrl: string,
		method: ApiMethod = "POST",
		inputs: PowerBICommandInput[] = []
	): Promise<T> {
		let body: object = {};

		let inputValue: string = null;
		for (let input of inputs) {
			inputValue = await input.getValue();

			body = this.addProperty(body, input.Key, inputValue);
		}

		switch (method) {
			case "GET":
				return PowerBIApiService.get(apiUrl, body) as Promise<T>;

			case "POST":
				return PowerBIApiService.post(apiUrl, body) as Promise<T>;

			case "PATCH":
				return PowerBIApiService.patch(apiUrl, body) as Promise<T>;

			case "DELETE":
				return PowerBIApiService.delete(apiUrl, body) as Promise<T>;
		
			default:
				break;
		}
		
	}

	static addProperty(body: object, key: string, inputValue: string): object {
		if (inputValue == null || inputValue == undefined) {
			return body;
		}
		let keys = key.split('.');

		// if we reached the last key, we assign the inputValue
		if (keys.length == 1) {
			body[keys[0]] = inputValue;
		}
		else {
			// add the key if it does not exist yet
			if (!(keys[0] in body)) {
				body[keys[0]] = {};
			}
			// recursivly add the existing keys
			body[keys[0]] = this.addProperty(body[keys[0]], keys.slice(1).join('.'), inputValue);
		}
		return body;
	}

	static async showQuickPick(
		items: PowerBIQuickPickItem[],
		toolTip: string,
	): Promise<string> {

		const result = await vscode.window.showQuickPick(items, {
			placeHolder: toolTip
			/*,
			onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
			*/
		});
		if (result == undefined || result == null) {
			return null;
		}
		else {
			return result.value;
		}
	}

	static async showInputBox(
		defaultValue: string,
		toolTip: string,
		valueSelection: [number, number] = undefined,
	): Promise<string> {
		const result = await vscode.window.showInputBox({
			value: defaultValue,
			valueSelection: valueSelection,
			placeHolder: toolTip,
			prompt: toolTip
			/*,
			validateInput: text => {
				window.showInformationMessage(`Validating: ${text}`);
				return text === '123' ? 'Not 123!' : null;
			}*/
		});

		return result;
	}

	static pushQuickPickItem(item: PowerBIWorkspaceTreeItem): void {
		if (this._quickPickLists == undefined) {
			ThisExtension.log(`Initializing QuickPickList ...`);
			this._quickPickLists = new Map<ApiItemType, PowerBIQuickPickItem[]>();
		}

		if (!this._quickPickLists.has(item.itemType)) {
			ThisExtension.log(`Adding item '${item.itemType}' to QuickPickLists ...`);
			this._quickPickLists.set(item.itemType, []);
		}

		let newItem: PowerBIQuickPickItem = new PowerBIQuickPickItem(item.name, item.uid.toString());

		// if the item already exists, pop it and add it to the top again
		let existingItemIndex = this._quickPickLists.get(item.itemType).findIndex(x => x.label == newItem.label);
		if (existingItemIndex >= 0) {
			this._quickPickLists.get(item.itemType).splice(existingItemIndex, 1);
		}

		ThisExtension.log(`Adding item '${item.uid}' to QuickPickList '${item.itemType}'.`);
		this._quickPickLists.get(item.itemType).push(newItem);

		while (this._quickPickLists.get(item.itemType).length > this._maxQuickPickListItems) {
			let removed = this._quickPickLists.get(item.itemType).shift();
			ThisExtension.log(`Removed item '${removed.value}' from QuickPickList '${item.itemType}'.`);
		}
	}

	static getQuickPickItems(itemType: ApiItemType): PowerBIQuickPickItem[] {
		if (this._quickPickLists == undefined) {
			ThisExtension.log(`Initializing QuickPickList ...`);
			this._quickPickLists = new Map<ApiItemType, PowerBIQuickPickItem[]>();
		}

		if (!this._quickPickLists.has(itemType)) {
			ThisExtension.log(`Adding item '${itemType}' to QuickPickLists ...`);
			this._quickPickLists.set(itemType, []);
		}

		return this._quickPickLists.get(itemType);
	}
}

