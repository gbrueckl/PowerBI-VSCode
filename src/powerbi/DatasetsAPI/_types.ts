import { UniqueId } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/_types";

export class iPowerBIDataset {
	name: string;
	id: UniqueId;
	item_type: ApiItemType;
	
	ContentProviderType: string; //	The content provider type for the dataset
	CreateReportEmbedURL: string; //	The dataset create report embed URL
	CreatedDate: string; //	The dataset creation date and time
	//Encryption: Encryption; //	Dataset encryption information. Only applicable when $expand is specified.
	IsEffectiveIdentityRequired: boolean; //	Whether the dataset requires an effective identity, which you must send in a GenerateToken API call.
	IsEffectiveIdentityRolesRequired: boolean; //	Whether row-level security is defined inside the Power BI .pbix file. If so, you must specify a role.
	IsOnPremGatewayRequired: boolean; //	Whether the dataset requires an on-premises data gateway
	IsRefreshable: boolean; //	Whether the dataset can be refreshed
	QnaEmbedURL: string; //	The dataset Q&A embed URL
	addRowsAPIEnabled: boolean; //	Whether the dataset allows adding new rows
	configuredBy: string; //	The dataset owner
	description: string; //	The dataset description
	targetStorageMode: string; //	The dataset storage mode
	upstreamDataflows: object; //[]	The upstream dataflows
	//users: DatasetUser; //[]	(Empty value) The dataset user access details. This property will be removed from the payload response in an upcoming release. You can retrieve user information on a Power BI item (such as a report or a dashboard) by using the Get Dataset Users as Admin API, or the PostWorkspaceInfo API with the getArtifactUsers parameter.
	webUrl: string; //	The web URL of the dataset

}

export class iPowerBIDatasetParameter {
	name: string;
	type: string;
	description: string;
	isRequired: boolean;
	currentValue: string;
	suggestedValues?: string[];
}

export class iPowerBIDatasetExecuteQueries {
	error?: {
		code: string;
		message: string
	};
	informationProtectionLabel?: {
		id: string;
		name: string;
	};
	results?: {
		error?: string;
		tables: {
			error?: string;
			rows: object[];
		}[];
	}[];
}

export class iPowerBIDatasetRefresh {
    refreshType: string;
    startTime: Date;
    endTime: Date;
    status: string;
    requestId: string;
}