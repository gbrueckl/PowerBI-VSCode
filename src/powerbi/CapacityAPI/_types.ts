import { UniqueId } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/_types";
import { Capacity, Refresh, RefreshSchedule, RefreshableGroup, WorkloadState } from "../SwaggerAPI";

export class iPowerBICapacity {
	name: string;
	id: string; // The capacity ID
	item_type: ApiItemType;

	admins: string[]; //	An array of capacity admins
	capacityUserAccessRight: any; //	The access right a user has on the capacity
	displayName: string; //	The display name of the capacity
	region: string; //	The Azure region where the capacity was provisioned
	sku: string; //	The capacity SKU
	state: any; //	The capacity state
	tenantKey: any; //	Encryption key information (only applies to admin routes)
	tenantKeyId: string; //	The ID of an encryption key (only applicable to the admin route)
}


export class iPowerBICapacityRefreshable {
	name: string;
	id: string; // The capacity ID
	item_type: ApiItemType;

	/** The refreshable kind */
	kind?: "Dataset";
	/**
	 * The start time of the window for which refresh data exists
	 * @format date-time
	 */
	startTime?: string;
	/**
	 * The end time of the window for which refresh data exists
	 * @format date-time
	 */
	endTime?: string;
	/** The number of refreshes within the time window for which refresh data exists */
	refreshCount?: number;
	/** The number of refresh failures within the time window for which refresh data exists */
	refreshFailures?: number;
	/** The average duration in seconds of a refresh during the time window for which refresh data exists */
	averageDuration?: number;
	/** The median duration in seconds of a refresh within the time window for which refresh data exists */
	medianDuration?: number;
	/** The number of refreshes per day (scheduled and on-demand) within the time window for which refresh data exists */
	refreshesPerDay?: number;
	/** The last Power BI refresh history entry for the refreshable item */
	lastRefresh?: Refresh;
	/** The refresh schedule for the refreshable item */
	refreshSchedule?: RefreshSchedule;
	/** The refreshable owners */
	configuredBy?: string[];
	/** The capacity for the refreshable item */
	capacity?: Capacity;
	/** The associated group for the refreshable item */
	group?: RefreshableGroup;
}

export class iPowerBICapacityWorkload {
	name: string;
	id: string; // The capacity ID
	item_type: ApiItemType;

	/** The capacity workload state */
	state: WorkloadState;
	/** The percentage of the maximum memory that a workload can consume (set by the user) */
	maxMemoryPercentageSetByUser?: number;
}