import { UniqueId } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/_types";

export interface iPowerBIPipelineStage {
	/* from iPowerBIApiItem */
	itemType: ApiItemType;
	uid: UniqueId;
	id?: string;
	name: string;

	/* new properties */
	order: number;
	workspaceId: string;
	workspaceName: string;
}

export interface iPowerBIPipeline {
	/* from iPowerBIApiItem */
	itemType: ApiItemType;
	uid: UniqueId;
	id?: string;
	name: string;

	/* new properties */
	displayName: string;
	stages: iPowerBIPipelineStage[];
}