import { unique_id } from "../../helpers/Helper";
import { WorkspaceItemType } from "../../vscode/treeviews/workspaces/_types";

export class iPowerBIReport {
	name: string;
	id: unique_id;
	item_type: WorkspaceItemType;
	datasetId: string;
	webUrl: string;
	embedUrl: string;
}
