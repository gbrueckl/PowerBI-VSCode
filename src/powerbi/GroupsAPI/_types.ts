import { unique_id } from "../../helpers/Helper";
import { WorkspaceItemType } from "../../vscode/treeviews/workspaces/_types";

export class iPowerBIGroup {
	name: string;
	id: unique_id;
	item_type: WorkspaceItemType;
	isReadOnly: boolean;
	isOnDedicatedCapacity: boolean;
	dataflowStorageId?: string;
}