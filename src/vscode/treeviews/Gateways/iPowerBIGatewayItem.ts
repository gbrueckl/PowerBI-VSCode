import { UniqueId } from '../../../helpers/Helper';
import { ApiItemType } from '../_types';

export interface iPowerBIGatewayItem {
	/* from iPowerBIApiItem */
	itemType: ApiItemType;
	uid: UniqueId;
	id?: string;
	name: string;

	/* new properties */
	type: string;
	publicKey: object;
}