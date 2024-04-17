import * as vscode from 'vscode';
import { FabricApiItemType, FabricApiItemTypeWithDefinition } from './_types';


export class FabricItemType {
	private _itemType: FabricApiItemType;
	private _itemTypeWithDefinition?: FabricApiItemTypeWithDefinition;

	public static fromString(itemType: string): FabricItemType {
		let itemTypeWithDefinition = itemType;
		if(itemType.endsWith("s")){
			itemType = itemType.slice(0, -1);
		}
		else {
			itemTypeWithDefinition = itemType + "s";
		}

		let result: FabricItemType = new FabricItemType();
		result._itemType = FabricApiItemType[itemType];
		result._itemTypeWithDefinition = itemTypeWithDefinition as FabricApiItemTypeWithDefinition;

		return result;
	}

	public get itemType(): FabricApiItemType {
		return this._itemType;
	}

	public get itemTypeWithDefinition(): FabricApiItemTypeWithDefinition {
		return this._itemTypeWithDefinition;
	}

	public get forBrowserUrl(): string {
		const customMapping : Map<FabricApiItemType,string> = new Map<FabricApiItemType, string> ([
			[FabricApiItemType.Notebook, "synapsenotebooks"]
		]);

		let result = customMapping.get(this._itemType);
			
		return result ?? this.forApiUrl;
	}

	public get forApiUrl(): string {
		
		return this._itemTypeWithDefinition.toString();
	}

	public get forApiItemType(): string {	
		return this._itemType.toString();
	}
}