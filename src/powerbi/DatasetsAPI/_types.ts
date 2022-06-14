import { UniqueId } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/_types";

export class iPowerBIDataset {
	name: string;
	id: UniqueId;
	item_type: ApiItemType;
	configuredBy: string;
	isRefreshable: boolean;
}