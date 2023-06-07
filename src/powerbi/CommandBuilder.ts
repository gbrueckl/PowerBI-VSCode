import { stringify } from 'querystring';
import * as vscode from 'vscode';
import { Helper } from '../helpers/Helper';
import { ThisExtension } from '../ThisExtension';
import { PowerBIApiTreeItem } from '../vscode/treeviews/PowerBIApiTreeItem';
import { PowerBIWorkspaceTreeItem } from '../vscode/treeviews/workspaces/PowerBIWorkspaceTreeItem';
import { ApiItemType } from '../vscode/treeviews/_types';
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
	private _currentValue: string;

	constructor(
		prompt: string,
		inputType: CommandInputType | string,
		key: string,
		optional: boolean = false,
		description: string = null,
		currentValue?: string
	) {
		this._prompt = prompt;
		this._inputType = inputType;
		this._key = key;
		this._optional = optional;
		this._description = description ?? prompt;
		this._currentValue = currentValue;
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

	get CurrentValue(): string {
		return this._currentValue;
	}

	public async getValue(): Promise<string> {
		switch (this.InputType) {
			case "FREE_TEXT":
				return await PowerBICommandBuilder.showInputBox(this.CurrentValue, this.Prompt, this.Description);

			case "WORKSPACE_SELECTOR":
				return await PowerBICommandBuilder.showQuickPick(PowerBICommandBuilder.getQuickPickItems("GROUP"), this.Prompt, this.Description, this._currentValue);

			case "REPORT_SELECTOR":
				return await PowerBICommandBuilder.showQuickPick(PowerBICommandBuilder.getQuickPickItems("REPORT"), this.Prompt, this.Description, this._currentValue);

			case "DATASET_SELECTOR":
				return await PowerBICommandBuilder.showQuickPick(PowerBICommandBuilder.getQuickPickItems("DATASET"), this.Prompt, this.Description, this._currentValue);

			case "DATAFLOW_SELECTOR":
				return await PowerBICommandBuilder.showQuickPick(PowerBICommandBuilder.getQuickPickItems("DATAFLOW"), this.Prompt, this.Description, this._currentValue);

			default:
				return this.InputType;
		}
	}
}

export class PowerBIQuickPickItem {
	private _name: string;
	private _value?: string;
	private _picked?: boolean;
	private static SEPARATOR: string = '\t';

	constructor(
		name: string,
		value?: string,
		picked?: boolean
	) {
		this._name = name;
		this._value = value;
		this._picked = picked;
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

	get picked(): boolean { 
		return this._picked ?? false;
	}

	set picked(value: boolean) {
		this._picked = value;
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
		title: string,
		description: string,
		currentValue: string		
	): Promise<string> {

		const result = await vscode.window.showQuickPick(items, {
			title: title + (description ? (" - " + description) : ""),
			placeHolder: currentValue,
			ignoreFocusOut: true,
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
		title: string,
		description: string,
		valueSelection: [number, number] = undefined,
	): Promise<string> {
		const result = await vscode.window.showInputBox({
			title: title + (description ? (" - " + description) : ""),
			ignoreFocusOut: true,
			value: defaultValue,
			valueSelection: valueSelection,
			placeHolder: defaultValue,
			prompt: description
			/*,
			validateInput: text => {
				window.showInformationMessage(`Validating: ${text}`);
				return text === '123' ? 'Not 123!' : null;
			}*/
		});

		return result;
	}

	static pushQuickPickItem(item: PowerBIApiTreeItem): void {
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

