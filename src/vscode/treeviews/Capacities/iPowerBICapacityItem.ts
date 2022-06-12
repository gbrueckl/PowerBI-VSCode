import { unique_id } from '../../../helpers/Helper';
import { ApiItemType } from '../workspaces/_types';

export interface iPowerBICapacityItem {
	itemType: ApiItemType;
	uid: unique_id;
	displayName: string;
	admins: string[];
	sku: string;
	state: string;
	region: string;
	capacityUserAccessRight: string;
}