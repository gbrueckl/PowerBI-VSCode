// https://learn.microsoft.com/en-us/rest/api/fabric/core/items/get-item?tabs=HTTP#itemtype
export type FabricItemType =
	"Dashboard"				//	PowerBI dashboard.
	| "DataPipeline"			//	A data pipeline.
	| "Datamart"				//	PowerBI datamart.
	| "Eventstream"			//	An eventstream item.
	| "KQLDataConnection"		//	A KQL data connection.
	| "KQLDatabase"			//	A KQL database.
	| "KQLQueryset"			//	A KQL queryset.
	| "Lakehouse"				//	Lakehouse item.
	| "MLExperiment"			//	A machine learning experiment.
	| "MLModel"				//	A machine learning model.
	| "MountedWarehouse"		//	A MountedWarehouse item.
	| "Notebook"				//	A notebook.
	| "PaginatedReport"		//	PowerBI paginated report.
	| "Report"				//	PowerBI report.
	| "SQLEndpoint"			//	An SQL endpoint.
	| "SemanticModel"			//	PowerBI semantic model.
	| "SparkJobDefinition"	//	A spark job definition.
	| "Warehouse"				//	A warehouse item.
	;

export type FabricWorkspaceType =
	"Personal"		// A personal workspace
	| "Workspace"		// A collaborative workspace
	;

export type FabricItemFormat = 
	"ipynb"
	| "SparkJobDefinitionV1"


export interface iFabricWorkspace {
	id: string;
	displayName: string;
	description: string;
	type: FabricWorkspaceType;
	capacityId: string;
	capacityAssignmentProgress: string;
}

// https://learn.microsoft.com/en-us/rest/api/fabric/core/items/get-item?tabs=HTTP#item
export interface iFabricItem {
	displayName: string;
	description: string;
	type: FabricItemType;
	workspaceId: string;
	id: string;
}

export interface iFabricItemPart {
	path: string;
	payload: string;
	payloadType: string;
}