import { FabricApiItemType } from "../../../fabric/_types";

export type LoadingState =
	"not_loaded" // not loaded yet
	| "loading"  // currently loading
	| "loaded"	// for server only, if only a specific database has been loaded yet
;

// constant list of Fabric Item Types that support GetDefinition and will be shown in the workspace
export const FABRIC_FS_ITEM_TYPES = [
	FabricApiItemType.Notebook
	, FabricApiItemType.SemanticModel
	, FabricApiItemType.Report
	, FabricApiItemType.SparkJobDefinition
]

