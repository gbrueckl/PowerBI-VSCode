import { unique_id } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/workspaces/_types";

export class iPowerBIDataset {
	name: string;
	id: unique_id;
	item_type: ApiItemType;
	configuredBy: string;
	isRefreshable: boolean;
}