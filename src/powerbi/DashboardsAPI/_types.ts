import { UniqueId } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/_types";

export class iPowerBIDashboard {
	name: string;
	id: UniqueId; // The dashboard ID
	item_type: ApiItemType;
	
	appId: string; //The app ID, returned only if the dashboard belongs to an app
	displayName: string; //The display name of the dashboard
	embedUrl: string; //The embed URL of the dashboard
	isReadOnly: boolean; //Whether the dashboard is read-only
	//subscriptions: Subscription[]; //(Empty Value) The subscription details for a Power BI item (such as a report or a dashboard). This property will be removed from the payload response in an upcoming release. You can retrieve subscription information for a Power BI report by using the Get Report Subscriptions as Admin API call.
	//users: DashboardUser[];  //(Empty value) The dashboard user access details. This property will be removed from the payload response in an upcoming release. You can retrieve user information on a Power BI dashboard by using the Get Dashboard Users as Admin API call, or the PostWorkspaceInfo API call with the getArtifactUsers parameter.
	webUrl: string; //The web URL of the dashboard
}
