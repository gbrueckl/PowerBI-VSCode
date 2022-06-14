import { UniqueId } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/_types";

export class iPowerBIReport {
	name: string;
	id: UniqueId;
	item_type: ApiItemType;
	datasetId: string;
	webUrl: string;
	embedUrl: string;
}
