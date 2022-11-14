import { UniqueId } from '../../../helpers/Helper';
import { iPowerBIApiItem } from '../iPowerBIApiItem';
import * as types from '../_types';

export interface iPowerBIWorkspaceItem {
	/* from iPowerBIApiItem */
	itemType: types.ApiItemType;
	uid: UniqueId;
	name: string;

	/* new properties */
	groupId: UniqueId;
}