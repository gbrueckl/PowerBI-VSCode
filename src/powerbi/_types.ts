import { UniqueId } from "../helpers/Helper";
import { ApiItemType } from "../vscode/treeviews/_types";

export type ApiMethod = 
	"GET"
|	"POST" 
|	"DELETE"
| 	"PATCH"
;

export interface ApiUrlPair {
	itemType: ApiItemType;
	itemId?: string | UniqueId;
}