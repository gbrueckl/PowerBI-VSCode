import { UniqueId } from '../../../helpers/Helper';
import { ApiItemType } from '../_types';

export interface iPowerBIPipelineStageItem {
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

export interface iPowerBIPipelineItem {
	/* from iPowerBIApiItem */
	itemType: ApiItemType;
	uid: UniqueId;
	id?: string;
	name: string;
}