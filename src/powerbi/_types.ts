import { UniqueId } from "../helpers/Helper";
import { ApiItemType } from "../vscode/treeviews/_types";

export type ApiMethod =
	"GET"
	| "POST"
	| "PUT"
	| "DELETE"
	| "PATCH"
	;

// a combination of the item type and its unique id
export interface ApiUrlPair {
	itemType: ApiItemType;
	itemId?: string | UniqueId;
}

export class iPowerBIResponseGeneric<T = any> {
	"odata.context": string;
	value: T[];
}

export class iPowerBIPermission {
	displayName?: string;
	datasetUserAccessRight?: string; 	//The access rights to assign to the user for the dataset (permission level)
	groupUserAccessRight?: string; 	//The access rights to assign to the user for the group (permission level)
	identifier: string;					//For principal type User, provide the UPN. Otherwise provide the object ID of the principal.
	principalType: "App" | "Group" | "User" | "None"; 			//The principal type
}