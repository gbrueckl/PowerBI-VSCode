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
|	"CAPACITYREFRESHABLES"
|	"CAPACITYREFRESHABLE"
|	"CAPACITYWORKLOADS"
|	"CAPACITYWORKLOAD"
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
|	"DATASETPARAMETERS"
|	"DATASETPARAMETER"
|	"DATASETREFRESHES"			// container for Dataset refreshes
|	"DATASETREFRESH"			// single Dataset refresh
|	"TRANSACTIONS"		// container for Dataflow refreshes
|	"TRANSACTION"		// single Dataflow refresh
;