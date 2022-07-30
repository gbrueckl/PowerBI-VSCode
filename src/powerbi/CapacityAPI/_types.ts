import { UniqueId } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/_types";

export class iPowerBICapacity {
	name: string;
	id: UniqueId; // The dashboard ID
	item_type: ApiItemType;
	
	admins: string[]; //	An array of capacity admins
	capacityUserAccessRight: any; //	The access right a user has on the capacity
	displayName: string; //	The display name of the capacity
	region: string; //	The Azure region where the capacity was provisioned
	sku: string; //	The capacity SKU
	state: any; //	The capacity state
	tenantKey: any; //	Encryption key information (only applies to admin routes)
	tenantKeyId: string; //	The ID of an encryption key (only applicable to the admin route)
}
