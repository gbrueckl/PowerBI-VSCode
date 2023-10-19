import { UniqueId } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/_types";

export class iPowerBIDataflow {
	name: string;
	id: UniqueId;
	item_type: ApiItemType;
	
	configuredBy: string; //The dataflow owner
	description: string; //The dataflow description
	modelUrl: string; //A URL to the dataflow definition file (model.json)
	modifiedBy: string; //The user that modified the dataflow
	modifiedDateTime: string; //The date and time that the dataflow was last modified
	objectId: string; //The dataflow ID
	//users: DataflowUser[]; //(Empty value) The dataflow user access details. This property will be removed from the payload response in an upcoming release. You can retrieve user information on a Power BI dataflow by using the Get Dataflow Users as Admin API call, or the PostWorkspaceInfo API call with the getArtifactUser parameter.
}

export class iPowerBIDataflowTransaction {
    refreshType: string;
    startTime: string;
    endTime: string;
    status: string;
    id: string;
}

export class iPowerBIDataflowDatasource {
    datasourceType: string;
    datasourceId: string;
    gatewayId: string;
    connectionDetails: any;
}