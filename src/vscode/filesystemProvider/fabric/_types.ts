export type LoadingState =
	"not_loaded" // not loaded yet
	| "loading"  // currently loading
	| "loaded"	// for server only, if only a specific database has been loaded yet
;

export enum FabricFSPublishAction {
	"CREATE" = 10		// create the object
	, "MODIFIED" = 20		// update the object
	, "DELETE" = 30		// delete the object
};
