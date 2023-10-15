import { UniqueId } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/_types";

export class iPowerBIGroup {
	name: string;
	id: UniqueId;
	item_type: ApiItemType;
	isReadOnly: boolean;
	isOnDedicatedCapacity: boolean;
	dataflowStorageId?: string;
	sku?: string;
	capacityId?: string;
}