import { UniqueId } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/_types";

export class iPowerBIReport {
	name: string;
	id: UniqueId;
	item_type: ApiItemType;
	datasetId: string;
	datasetWorkspaceId: string;
	webUrl: string;
	embedUrl: string;
	isOwnedByMe: boolean;
	isFromPbix: boolean;
	reportType: "PaginatedReport" | "PowerBIReport";
}
