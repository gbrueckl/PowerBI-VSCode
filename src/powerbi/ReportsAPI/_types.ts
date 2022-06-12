import { unique_id } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/workspaces/_types";

export class iPowerBIReport {
	name: string;
	id: unique_id;
	item_type: ApiItemType;
	datasetId: string;
	webUrl: string;
	embedUrl: string;
}
