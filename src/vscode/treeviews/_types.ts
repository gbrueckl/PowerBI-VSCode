export type ApiItemType = 
	"GROUP"
|	"GROUPS" 
|	"DATASETS" // container for datasets within workspace
| 	"DATASET"
|	"REPORTS" // container for reports within workspace
| 	"REPORT"
|	"DATAFLOWS" // container for dataflows within workspace
|	"DATAFLOW"
|	"DASHBOARDS" // container for dashboards within workspace
|	"DASHBOARD"
|	"CAPACITIES"
|	"CAPACITY"
|	"GATEWAYS"
|	"GATEWAY"
|	"PIPELINES"
|	"PIPELINE"
|	"PIPELINESTAGES"
|	"PIPELINESTAGE"
|	"PIPELINEOPERATION"
|	"PIPELINEOPERATIONS"
| 	"PIPELINESTAGEDASHBOARDS"
| 	"PIPELINESTAGEDATAFLOWS"
| 	"PIPELINESTAGEDATAMARTS"
|	"PIPELINESTAGEDATASETS"
|	"PIPELINESTAGEREPORTS" 
|	"PARAMETERS"
|	"PARAMETER"
|	"REFRESHES"			// container for Dataset refreshes
|	"REFRESH"			// single Dataset refresh
|	"TRANSACTIONS"		// container for Dataflow refreshes
|	"TRANSACTION"		// single Dataflow refresh
;