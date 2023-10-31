import { UniqueId } from '../../../helpers/Helper';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { ApiItemType } from '../_types';

export interface iPowerBIGatewayItem extends PowerBIApiTreeItem {
	/* from iPowerBIApiItem */
	itemType: ApiItemType;
	uid: UniqueId;
	id?: string;
	name: string;
}