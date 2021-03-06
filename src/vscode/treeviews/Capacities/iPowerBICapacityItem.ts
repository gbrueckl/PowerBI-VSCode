import { UniqueId } from '../../../helpers/Helper';
import { ApiItemType } from '../_types';

export interface iPowerBICapacityItem {
	/* from iPowerBIApiItem */
	itemType: ApiItemType;
	uid: UniqueId;
	id?: string;
	name: string;

	/* new properties */
	displayName: string;
	admins: string[];
	sku: string;
	state: string;
	region: string;
	capacityUserAccessRight: string;
}