import { UniqueId } from '../../../helpers/Helper';
import { iPowerBICapacity } from '../../../powerbi/CapacityAPI/_types';
import { ApiItemType } from '../_types';

export interface iPowerBICapacityItem {
	/* from iPowerBIApiItem */
	itemType: ApiItemType;
	uid: UniqueId;
	id?: string;
	name: string;

	/* new properties */
	capacity: iPowerBICapacity;
}