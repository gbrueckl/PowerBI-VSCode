import { UniqueId } from '../../helpers/Helper';
import * as types from './_types';

export interface iPowerBIApiItem {
	itemType: types.ApiItemType;
	uid: UniqueId;
	name: string;
	parent?: iPowerBIApiItem;
}