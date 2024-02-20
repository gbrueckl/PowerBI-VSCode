export type LoadingState =
	"not_loaded" // not loaded yet
	| "loading"  // currently loading
	| "loaded"	// for server only, if only a specific database has been loaded yet
;

export type FabricFSSupportedItemType = 
	"notebooks"
	| "semanticmodels"
	| "reports"
	| "sparkjobdefinition"
;

// constant list of Fabric Item Types that support GetDefinition - same as enum above!
export const FABRIC_FS_ITEM_TYPES = [
	"notebook"
	, "semanticmodel"
	, "report"
	, "sparkjobdefinition"
]

