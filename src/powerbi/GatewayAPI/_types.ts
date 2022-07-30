import { UniqueId } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/_types";

export class iPowerBIGateway {
	name: string;
	id: UniqueId; // The dashboard ID
	item_type: ApiItemType;
	
	gatewayAnnotation: string; //	Gateway metadata in JSON format
	gatewayStatus: string; //	The gateway connectivity status
	publicKey: any; //	The gateway public key
	type: string; //	The gateway type

}
