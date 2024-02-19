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