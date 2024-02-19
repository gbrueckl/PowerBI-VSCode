export type LoadingState =
	"not_loaded" // not loaded yet
	| "loading"  // currently loading
	| "loaded"	// for server only, if only a specific database has been loaded yet


// constant list of Fabric Item Types that support GetDefinition
export const FabricItemTypes = [
	"notebooks",
	"semanticmodels",
	"reports",
	"sparkjobdefinition"
]