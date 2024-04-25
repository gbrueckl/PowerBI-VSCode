export type ApiItemType = 
	"GROUP"
|	"GROUPS" 
|	"DATASETS" // container for datasets within workspace
| 	"DATASET"
| 	"DATASET_XMLA" // only used for QuickPick items to allow to store XMLA information for datasets
|	"REPORTS" // container for reports within workspace
| 	"REPORT"
|	"DATAFLOWS" // container for dataflows within workspace
|	"DATAFLOW"
|	"DASHBOARDS" // container for dashboards within workspace
|	"DASHBOARD"
|	"CAPACITIES"
|	"CAPACITY"
|	"CAPACITYREFRESHABLES"
|	"CAPACITYREFRESHABLE"
|	"CAPACITYWORKLOADS"
|	"CAPACITYWORKLOAD"
|	"GATEWAYS"
|	"GATEWAY"
|	"GATEWAYDATASOURCES"
|	"GATEWAYDATASOURCE"
|	"PIPELINES"
|	"PIPELINE"
|	"PIPELINESTAGES"
|	"PIPELINESTAGE"
|	"PIPELINEOPERATION"
|	"PIPELINEOPERATIONS"
| 	"PIPELINESTAGEDASHBOARD"
| 	"PIPELINESTAGEDATAFLOW"
| 	"PIPELINESTAGEDATAMART"
|	"PIPELINESTAGEDATASET"
|	"PIPELINESTAGEREPORT" 
| 	"PIPELINESTAGEDASHBOARDS"
| 	"PIPELINESTAGEDATAFLOWS"
| 	"PIPELINESTAGEDATAMARTS"
|	"PIPELINESTAGEDATASETS"
|	"PIPELINESTAGEREPORTS" 
|	"DATASETPARAMETERS"
|	"DATASETPARAMETER"
|	"DATASETREFRESHES"			// container for Dataset refreshes
|	"DATASETREFRESH"			// single Dataset refresh
|	"DATASETTABLES"				// container for Dataset tables
|	"DATASETTABLE"				// single Dataset table
|	"DATASETTABLECOLUMNS"		// container for Dataset table columns
|	"DATASETTABLECOLUMN"		// single Dataset table column
|	"DATASETTABLEMEASURES"		// container for Dataset table measures
|	"DATASETTABLEMEASURE"		// single Dataset table measure
|	"DATASETTABLEPARTITIONS"	// container for Dataset table partitions
|	"DATASETTABLEPARTITION"		// single Dataset table partition
|	"DATAFLOWTRANSACTIONS"		// container for Dataflow refreshes
|	"DATAFLOWTRANSACTION"		// single Dataflow refresh
|	"DATAFLOWDATASOURCES"
|	"DATAFLOWDATASOURCE"
// FabricItems
|	"WORKSPACES"
|	"WORKSPACE"
|	"LAKEHOUSES"
|	"LAKEHOUSE"
|	"LAKEHOUSETABLES"
|	"LAKEHOUSETABLE"
;

export interface iPowerBIDesktopExternalToolConfig {
	version: string;
    name: string;
	description: string;
	path: string;
	arguments: string;
	iconData: string;
}