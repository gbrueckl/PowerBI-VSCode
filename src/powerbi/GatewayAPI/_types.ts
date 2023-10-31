import { UniqueId } from "../../helpers/Helper";
import { iPowerBIGatewayItem } from "../../vscode/treeviews/Gateways/iPowerBIGatewayItem";
import { ApiItemType } from "../../vscode/treeviews/_types";

export interface iPowerBIGateway extends iPowerBIGatewayItem {
	name: string;
	uid: UniqueId;
	id: string; // The gateway ID
	item_type: ApiItemType;

	gatewayAnnotation: string; //	Gateway metadata in JSON format
	gatewayStatus: string; //	The gateway connectivity status
	publicKey: any; //	The gateway public key
	type: string; //	The gateway type

}


export interface iPowerBIGatewayDatasource extends iPowerBIGatewayItem {
	name: string;
	uid: UniqueId;
	id: string; // The gateway ID
	item_type: ApiItemType;

	connectionDetails: any; 	// Connection details in JSON formatstring
	credentialDetails: any; 	// The connection details for the data source that needs update. The connection details are mandatory when the dataset has more than one data source.
	credentialType: any; // The type of data source credential

	datasourceName: string; // The name of the data source
	datasourceType: string; // The type of data source
	gatewayId: string; // The associated gateway ID. When using a gateway cluster, the gateway ID refers to the primary (first) gateway in the cluster and is similar to the gateway cluster ID.
	
}
