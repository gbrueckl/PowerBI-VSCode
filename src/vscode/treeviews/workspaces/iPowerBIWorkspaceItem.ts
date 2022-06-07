import { unique_id } from '../../../helpers/Helper';
import * as types from './_types';

export interface iPowerBIWorkspaceItem {
	name: string;
	group: unique_id;
	itemType: types.WorkspaceItemType;
	uid: unique_id;
}