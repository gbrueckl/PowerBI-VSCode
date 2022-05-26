import { unique_id } from "../../helpers/Helper";
import { WorkspaceItemType } from "../../vscode/treeviews/workspaces/_types";

export class iPowerBIDataset {
	name: string;
	id: unique_id;
	item_type: WorkspaceItemType;
	configuredBy: string;
	isRefreshable: boolean;
}