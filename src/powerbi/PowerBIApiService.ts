import * as vscode from 'vscode';
//import * as FormData from 'form-data';

import { Helper, UniqueId } from '../helpers/Helper';
import { ThisExtension } from '../ThisExtension';
import { iPowerBIGroup } from './GroupsAPI/_types';
import { ApiItemType } from '../vscode/treeviews/_types';
import { iPowerBIPipeline, iPowerBIPipelineStage } from './PipelinesAPI/_types';
import { ApiUrlPair } from './_types';
import { iPowerBIDatasetParameter } from './DatasetsAPI/_types';
import { iPowerBICapacity } from './CapacityAPI/_types';
import { iPowerBIGateway } from './GatewayAPI/_types';
import fetch from 'node-fetch';

export abstract class PowerBIApiService {
	private static _apiService: any;
	private static _isInitialized: boolean = false;
	private static _connectionTestRunning: boolean = false;
	private static _org: string = "myorg"
	private static _fetchHeaders: any;
	private static _fetchRootUrl: string;
	private static _fetch: any;

	//#region Initialization
	static async initialize(apiRootUrl: string = "https://api.powerbi.com/"): Promise<boolean> {
		try {
			ThisExtension.log("Initializing PowerBI API Service ...");
			const axios = require('axios');
			const httpsAgent = require('https-agent');

			// Set config defaults when creating the instance
			this._apiService = axios.create({
				httpsAgent: new httpsAgent({
					rejectUnauthorized: ThisExtension.rejectUnauthorizedSSL
				}),
				baseURL: Helper.trimChar(apiRootUrl, '/') + '/',
				proxy: ThisExtension.useProxy
			});

			// https://github.com/microsoft/vscode-azure-account/blob/main/sample/src/extension.ts

			const { useIdentityPlugin, VisualStudioCodeCredential } = require("@azure/identity");

			// The plugin is the package's default export, so you may import and use it
			// as any name you like, and simply pass it to `useIdentityPlugin`.
			const { vsCodePlugin } = require("@azure/identity-vscode");

			useIdentityPlugin(vsCodePlugin);

			let credential = new VisualStudioCodeCredential();

			let accessToken = await credential.getToken("https://analysis.windows.net/powerbi/api/.default");

			this._apiService.defaults.headers.common['Authorization'] = "Bearer " + accessToken.token;
			this._apiService.defaults.headers.common['Content-Type'] = 'application/json';
			this._apiService.defaults.headers.common['Accept'] = 'application/json';

			this._fetch = fetch;
			this._fetchRootUrl = apiRootUrl;
			this._fetchHeaders = {
				"Authorization": 'Bearer ' + accessToken.token,
				"Content-Type": 'application/json',
				"Accept": 'application/json'
			}

			ThisExtension.log(`Testing new PowerBI API (${apiRootUrl}) settings ()...`);
			this._connectionTestRunning = true;
			let workspaceList = await this.getGroups();
			this._connectionTestRunning = false;
			if (workspaceList.length > 0) {
				ThisExtension.log("Power BI API Service initialized!");
				this._isInitialized = true;
				return true;
			}
			else {
				ThisExtension.log(JSON.stringify(workspaceList));
				throw new Error(`Invalid Configuration for PowerBI REST API: Cannot access '${apiRootUrl}' with given credentials'!`);
			}
		} catch (error) {
			this._connectionTestRunning = false;
			ThisExtension.log("ERROR: " + error);
			vscode.window.showErrorMessage(error);
			return false;
		}
	}

	public static get Org(): string {
		return this._org;
	}

	public static get isInitialized(): boolean {
		return this._isInitialized;
	}
	//#endregion

	//#region Helpers
	private static logResponse(response: any): void {
		ThisExtension.log("Response: ");
		ThisExtension.log(JSON.stringify(response.data));
	}

	static async fetch(endpoint: string, options: any): Promise<any>
	{
		return await this._fetch(endpoint, options)
	}

	static async get(endpoint: string, params: object = null): Promise<any> {
		if (!this._isInitialized && !this._connectionTestRunning) {
			ThisExtension.log("API has not yet been initialized! Please connect first!");
		}
		else {
			ThisExtension.log("GET " + endpoint);
			ThisExtension.log("Params:" + JSON.stringify(params));

			let response: any = "Request not yet executed!";
			try {
				//response = await this._apiService.get(endpoint, params);
				response = await this.fetch(this._fetchRootUrl, {
					method: 'get',
					headers: this._fetchHeaders
				});
				this.logResponse(response);
			} catch (error) {
				let errResponse = error.response;

				ThisExtension.log("ERROR: " + error.message);
				ThisExtension.log("ERROR: " + JSON.stringify(errResponse.data));

				vscode.window.showErrorMessage(error.message);

				return undefined;
			}

			return response;
		}
	}

	static async post(endpoint: string, body: object, headers?: object): Promise<any> {
		ThisExtension.log("POST " + endpoint);
		ThisExtension.log("Body:" + JSON.stringify(body));

		let axiosConfig = {};
		if (headers != undefined) {
			axiosConfig = {
				headers: headers
			};
		}

		let response: any = "Request not yet executed!";
		try {
			response = await this._apiService.post(endpoint, body, axiosConfig);
			this.logResponse(response);
		} catch (error) {
			this.handleException(error);

			return undefined;
		}

		return response;
	}

	/*
	static async postFile(endpoint: string, file: string | URL): Promise<any> {
		ThisExtension.log("POST " + endpoint);
		ThisExtension.log("Content:" + "<stream>");

		const contentLength: number = fs.statSync(file).size;

		let fileStream = await fs.createReadStream(file);

		const form = new FormData();
		form.append("Content", fileStream);

		const contentHeaders = {
			"Content-Length": contentLength
			//"Content-Type": "multipart/form-data"
		};

		let axiosConfig = {
			headers: { ...(form.getHeaders()), ...contentHeaders }
		};
		let response: any = "Request not yet executed!";
		try {
			response = await this._apiService.post(endpoint, form, axiosConfig);
			this.logResponse(response);
		} catch (error) {
			this.handleException(error);

			return undefined;
		}

		return response;
	}
	*/

	static async patch(endpoint: string, body: object): Promise<any> {
		ThisExtension.log("PATCH " + endpoint);
		ThisExtension.log("Body:" + JSON.stringify(body));

		let response: any = "Request not yet executed!";
		try {
			response = await this._apiService.patch(endpoint, body);
			this.logResponse(response);
		} catch (error) {
			this.handleException(error);

			return undefined;
		}

		return response;
	}

	static async delete(endpoint: string, body: object): Promise<any> {
		ThisExtension.log("DELETE " + endpoint);
		ThisExtension.log("Body:" + JSON.stringify(body));

		let response: any = "Request not yet executed!";
		try {
			response = await this._apiService.delete(endpoint, body);
			this.logResponse(response);
		} catch (error) {
			this.handleException(error);

			return undefined;
		}

		return response;
	}

	private static handleException(error) {
		let errResponse = error.response;

		ThisExtension.log("ERROR: " + error.message);
		ThisExtension.log("ERROR: " + JSON.stringify(errResponse.data));

		vscode.window.showErrorMessage(error.message);
	}

	private static getUrl(groupId: string | UniqueId = undefined, itemType: ApiItemType = undefined): string {
		let group: string = "";
		if (groupId != null && groupId != undefined) {
			group = `/groups/${groupId.toString()}`;
		}

		let type = "";
		if (itemType != null && itemType != undefined) {
			type = `/${itemType.toString().toLowerCase()}`;
		}

		return `v1.0/${this.Org}${group}${type}`;
	}

	static getUrl2(apiItems: ApiUrlPair[]): string {
		let urlParts: string[] = [];

		for (let apiItem of apiItems) {
			if (apiItem.itemType == "GROUP" && !apiItem.itemId) {
				// skip GROUP item if no ID is specified -> use personal workspace
				continue;
			}
			urlParts.push(apiItem.itemType.toLowerCase());
			if (apiItem.itemId) {
				// can be empty, e.g. if we want to list all datasets of a workspace, we do not have a datasetId 
				urlParts.push(apiItem.itemId.toString())
			}
		}

		return `v1.0/${this.Org}/${urlParts.join("/")}`;
	}

	// legacy, should not be used anymore -> please use getItemList instead!
	static async getWorkspaceItemList<T>(groupId: string | UniqueId = undefined, itemType: ApiItemType = undefined, sortBy: string = "name"): Promise<T[]> {
		let endpoint = this.getUrl(groupId, itemType);

		let body = {};

		let response = await this.get(endpoint, { params: body });

		let result = response.data;
		let items = result.value as T[];

		if (items == undefined) {
			return [];
		}
		Helper.sortArrayByProperty(items, sortBy);
		return items;
	}

	static async getItemList<T>(endpoint: string, body: any = {}, sortBy: string = "name"): Promise<T[]> {
		let response = await this.get(endpoint, { params: body });

		let result = response.data;
		let items = result.value as T[];

		if (items == undefined) {
			return [];
		}
		Helper.sortArrayByProperty(items, sortBy);
		return items;
	}

	static async getItemList2<T>(
		items: ApiUrlPair[],
		sortBy: string = "name"): Promise<T[]> {

		let endpoint = this.getUrl2(items);

		let body = {};

		let response = await this.get(endpoint, { params: body });

		let result = response.data;
		let listItems = result.value as T[];

		if (items == undefined) {
			return [];
		}
		Helper.sortArrayByProperty(listItems, sortBy);
		return listItems;
	}
	//#endregion

	//#region Groups/Workspaces API
	static async getGroups(): Promise<iPowerBIGroup[]> {
		let items: iPowerBIGroup[] = await this.getItemList<iPowerBIGroup>(`v1.0/${PowerBIApiService.Org}/groups`);

		return items;
	}


	//#endregion

	//#region Datasets API
	static async getDatasetParameters(groupId: string | UniqueId, datasetId: string | UniqueId): Promise<iPowerBIDatasetParameter[]> {
		let items: iPowerBIDatasetParameter[] = await this.getItemList2<iPowerBIDatasetParameter>([
			{ itemType: "GROUPS", itemId: groupId },
			{ itemType: "DATASETS", itemId: datasetId },
			{ itemType: "PARAMETERS" }
		]);

		return items;
	}
	//#endregion

	//#region Reports API
	//#endregion

	//#region Dashboards API
	//#endregion

	//#region Dataflows API
	//#endregion


	//#region Capacities API
	static async getCapacities(): Promise<iPowerBICapacity[]> {

		let items: iPowerBICapacity[] = await this.getItemList<iPowerBICapacity>(`v1.0/${PowerBIApiService.Org}/capacities`, {}, "displayName");

		return items;
	}


	//#endregion


	//#region Gateways API
	static async getGateways(): Promise<iPowerBIGateway[]> {
		let items: iPowerBIGateway[] = await this.getItemList<iPowerBIGateway>(`v1.0/${PowerBIApiService.Org}/gateways`);

		return items;
	}


	//#endregion


	//#region Pipelines API
	static async getPipelines(): Promise<iPowerBIPipeline[]> {
		let items: iPowerBIPipeline[] = await this.getItemList<iPowerBIPipeline>(`v1.0/${PowerBIApiService.Org}/pipelines`);

		return items;
	}

	static async getPipelineStages(pipelineId: string | UniqueId): Promise<iPowerBIPipelineStage[]> {
		let items: iPowerBIPipelineStage[] = (await this.get(`v1.0/${this.Org}/pipelines/${pipelineId}/stages`)).data.value;

		return items;
	}
	//#endregion
}
