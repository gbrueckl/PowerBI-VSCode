import { UniqueId } from "../helpers/Helper";

// https://learn.microsoft.com/en-us/rest/api/fabric/core/items/get-item?tabs=HTTP#item
export interface iFabricApiItem {
	displayName: string;
	description?: string | boolean; // to be compatible with TreeItem property "description"
	type: string;
	workspaceId?: UniqueId;
	id?: string;
}



export interface iFabricListResponse<T> {
	value: T[];
	continuationToken?: string;
	continuationUri?: string;
}


export interface iFabricPollingResponse {
	status: "Running" | "Failed" | "Succeeded";
	createdTimeUtc: Date;
	lastUpdatedTimeUtc: Date;
	percentComplete: number;
	error: any;
}

export interface iFabricErrorRelatedResource {
	resourceId: string;  	// The resource ID that's involved in the error.
	resourceType: string; 	// The type of the resource that's involved in the error.
}
export interface iFabricErrorResponseDetails {
	errorCode: string; 	// A specific identifier that provides information about an error condition, allowing for standardized communication between our service and its users.
	message: string; 	// A human readable representation of the error.
	relatedResource: iFabricErrorRelatedResource; //The error related resource details.
}
export interface iFabricErrorResponse {
	errorCode: string; 	// A specific identifier that provides information about an error condition, allowing for standardized communication between our service and its users.
	message: string; 	// human readable representation of the error.
	moreDetails?: iFabricErrorResponseDetails[] 		// List of additional error details.
	relatedResource?: iFabricErrorRelatedResource 	// The error related resource details.
	requestId?: string 	// ID of the request associated with the error.
}

export interface iFabricApiResponse<TSucces = any, TError = iFabricErrorResponse> {
	success?: TSucces;
	error?: TError;
}