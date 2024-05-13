import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { ApiItemType } from '../_types';

export interface iPowerBIGatewayItem {
	/* from iPowerBIApiItem */
	itemType: ApiItemType;
	uid: UniqueId;
	id?: string;
	name: string;
}