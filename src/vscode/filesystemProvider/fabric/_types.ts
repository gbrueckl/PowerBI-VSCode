import { FabricApiItemType } from "../../../fabric/_types";

export type LoadingState =
	"not_loaded" // not loaded yet
	| "loading"  // currently loading
	| "loaded"	// for server only, if only a specific database has been loaded yet
;

export enum FabricFSPublishAction {
	"CREATE"		// create the object
	, "UPDATE"		// update the object
	, "DELETE"		// delete the object
};

// constant list of Fabric Item Types that support GetDefinition and will be shown in the workspace
export const FABRIC_FS_ITEM_TYPES = [
	FabricApiItemType.Notebook
	, FabricApiItemType.SemanticModel
	, FabricApiItemType.Report
	, FabricApiItemType.SparkJobDefinition
]

export const FABRIC_FS_ITEM_TYPE_NAMES = FABRIC_FS_ITEM_TYPES.map((itemType) => FabricApiItemType[itemType]);

