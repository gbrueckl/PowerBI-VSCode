import { iPowerBIDataset } from "../DatasetsAPI/_types";
import { iPowerBIReport } from "../ReportsAPI/_types";

export class iPowerBIImport {
	id: string;
}


export class iPowerBIImportDetails {
	createdDateTime: string; //Import creation date and time
	datasets: iPowerBIDataset[]; //The datasets associated with this import
	id: string; //The import ID
	importState: "Failed" | "Publishing" | "Succeeded"; //The import upload state
	name: string; //The import name
	reports: iPowerBIReport[]; //The reports associated with this import
	updatedDateTime: string; //Import last update date and time
	subscriptions: object[]; //(Empty Value) The subscription details for a Power BI item (such as a report or a dashboard). This property will be removed from the payload response in an upcoming release. You can retrieve subscription information for a Power BI report by using the Get Report Subscriptions as Admin API call.
	users: object[]; //(Empty value) The user access details for a Power BI report. This property will be removed from the payload response in an upcoming release. You can retrieve user information on a Power BI report by using the Get Report Users as Admin API call, or the PostWorkspaceInfo API call with the getArtifactUsers parameter.
	webUrl: string; //The web URL of the report
}