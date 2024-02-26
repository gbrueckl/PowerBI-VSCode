// https://learn.microsoft.com/en-us/rest/api/fabric/core/items/get-item?tabs=HTTP#itemtype
export enum FabricApiItemType {
	"Dashboard"				//	PowerBI dashboard.
	, "DataPipeline"			//	A data pipeline.
	, "Datamart"				//	PowerBI datamart.
	, "Eventstream"			//	An eventstream item.
	, "KQLDataConnection"		//	A KQL data connection.
	, "KQLDatabase"			//	A KQL database.
	, "KQLQueryset"			//	A KQL queryset.
	, "Lakehouse"				//	Lakehouse item.
	, "MLExperiment"			//	A machine learning experiment.
	, "MLModel"				//	A machine learning model.
	, "MountedWarehouse"		//	A MountedWarehouse item.
	, "Notebook"				//	A notebook.
	, "PaginatedReport"		//	PowerBI paginated report.
	, "Report"				//	PowerBI report.
	, "SQLEndpoint"			//	An SQL endpoint.
	, "SemanticModel"			//	PowerBI semantic model.
	, "SparkJobDefinition"	//	A spark job definition.
	, "Warehouse"				//	A warehouse item.
};

export namespace FabricApiItemType {
	export function toString(dir: FabricApiItemType): string {
		return FabricApiItemType[dir];
	}

	export function fromString(dir: string): FabricApiItemType {
		return (FabricApiItemType as any)[dir];
	}
}

export enum FabricApiWorkspaceType {
	"Personal"		// A personal workspace
	, "Workspace"		// A collaborative workspace
};

export enum FabricApiItemFormat {
	Notebook = "ipynb"
	, SparkJobDefinitionV1 = "SparkJobDefinitionV1"
}


export interface iFabricApiWorkspace {
	id: string;
	displayName: string;
	description: string;
	type: FabricApiWorkspaceType;
	capacityId: string;
	capacityAssignmentProgress: string;
}

// https://learn.microsoft.com/en-us/rest/api/fabric/core/items/get-item?tabs=HTTP#item
export interface iFabricApiItem {
	displayName: string;
	description: string;
	type: FabricApiItemType;
	workspaceId: string;
	id: string;
}

export type FabricApiPayloadTypes = "InlineBase64" | "VSCodeFolder";

export interface iFabricApiItemPart {
	path: string;
	payload: string;
	payloadType: FabricApiPayloadTypes;
}

export interface iFabricApiItemDefinition {
	definition: {
		format: FabricApiItemFormat;
		parts: iFabricApiItemPart[];
	}
}

export interface iFabricPollingResponse {
	status: "Running" | "Failed" | "Succeeded";
	createdTimeUtc: Date;
	lastUpdatedTimeUtc: Date;
	percentComplete: number;
	error: any;
}

export interface iFabricErrorResponse {
	message: {
		requestId: string;
		errorCode: string;
		message: string;
	},
	status: number;
	statusText: string;
}