import { UniqueId } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/_types";

export class iPowerBIDataset {
	name: string;
	id: UniqueId;
	item_type: ApiItemType;
	
	contentProviderType: string; //	The content provider type for the dataset
	createReportEmbedURL: string; //	The dataset create report embed URL
	createdDate: string; //	The dataset creation date and time
	//Encryption: Encryption; //	Dataset encryption information. Only applicable when $expand is specified.
	isEffectiveIdentityRequired: boolean; //	Whether the dataset requires an effective identity, which you must send in a GenerateToken API call.
	isEffectiveIdentityRolesRequired: boolean; //	Whether row-level security is defined inside the Power BI .pbix file. If so, you must specify a role.
	isOnPremGatewayRequired: boolean; //	Whether the dataset requires an on-premises data gateway
	isRefreshable: boolean; //	Whether the dataset can be refreshed
	qnaEmbedURL: string; //	The dataset Q&A embed URL
	addRowsAPIEnabled: boolean; //	Whether the dataset allows adding new rows
	configuredBy: string; //	The dataset owner
	description: string; //	The dataset description
	targetStorageMode: string; //	The dataset storage mode
	upstreamDataflows: object; //[]	The upstream dataflows
	//users: DatasetUser; //[]	(Empty value) The dataset user access details. This property will be removed from the payload response in an upcoming release. You can retrieve user information on a Power BI item (such as a report or a dashboard) by using the Get Dataset Users as Admin API, or the PostWorkspaceInfo API with the getArtifactUsers parameter.
	webUrl: string; //	The web URL of the dataset
	queryScaleOutSettings?: {
		autoSyncReadOnlyReplicas: boolean,
		maxReadOnlyReplicas: number
	};
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
    refreshType: "OnDemand" | "ViaXmlaEndpoint" | "ViaEnhancedApi" | "ViaApi" | "Scheduled" | "OnDemandTraining";
    startTime: string;
    endTime: string;
    status: string;
    requestId: string;
	extendedStatus?: string;
}

export class iPowerBIDatasetGenericResponse {
	error?: {
		code: string;
		message: string
	};
}

export class iPowerBIDatasetDMV {
	id: string;
	name: string;
	properties: object;
}

export class iPowerBIDatasetRefreshableObject {
	table: string;
	partition?: string;
}

export class iPowerBIDatasetColumnStatistics {
	tableName: string;
	columnName: string;
	minValue: string;
	maxValue: string;
	cardinality: number;
	maxLength: number;
}
