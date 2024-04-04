import * as vscode from 'vscode';

import { fetch, FormData, RequestInit, RequestInfo, File, fileFrom, Response, getProxyAgent } from '@env/fetch';

import { Helper } from '../helpers/Helper';
import { ThisExtension } from '../ThisExtension';
import { PowerBIApiService } from '../powerbi/PowerBIApiService';
import { FabricApiItemFormat, FabricApiItemType, iFabricApiItem, iFabricApiItemDefinition, iFabricApiItemPart, iFabricApiResponse, iFabricApiWorkspace, iFabricErrorResponse, iFabricListResponse, iFabricPollingResponse } from './_types';
import { FabricFSCache } from '../vscode/filesystemProvider/fabric/FabricFSCache';

export abstract class FabricApiService {

	private static _apiBaseUrl: string = "https://api.fabric.microsoft.com";
	private static _tenantId: string;
	private static _clientId: string;
	private static _authenticationProvider: string;
	private static _resourceId: string;

	//#region Initialization
	static async initialize(
		// Default settings will be for Azure Global
		apiBaseUrl: string = "https://api.fabric.microsoft.com",
		tenantId: string = undefined,
		clientId: string = undefined,
		authenticationProvider: string = "microsoft",
		resourceId: string = "https://analysis.windows.net/powerbi/api"
	): Promise<boolean> {

		this._tenantId = tenantId;
		this._clientId = clientId;
		this._authenticationProvider = authenticationProvider;
		this._resourceId = resourceId;

		FabricFSCache.initialize()

		return true;
	}

	public static get TenantId(): string {
		return this._tenantId;
	}

	public static get ClientId(): string {
		return this._clientId;
	}

	public static get BrowserBaseUrl(): string {
		return this._apiBaseUrl.replace("api.", "app.");
	}

	public static getHeaders(): HeadersInit {
		return PowerBIApiService.getHeaders();
	}

	static async get<T = any>(endpoint: string, params: object = null, raw: boolean = false): Promise<iFabricApiResponse<T>> {
		const ret = await PowerBIApiService.get<T>(endpoint, params, false, raw);

		if (ret["error"]) {
			return { error: ret["error"] };
		}
		else {
			return { success: ret };
		}
	}

	static async getList<T = any[]>(endpoint: string, params: object = null, listProperty: string = "value"): Promise<iFabricApiResponse<T[]>> {
		let response = await this.get<iFabricListResponse<T>>(endpoint, params, false);

		if (response.error) {
			return { error: response.error };
		}
		let ret: T[] = response.success[listProperty];

		while (response.success.continuationUri) {
			ret = ret.concat(response[listProperty]);
			response = await this.get<iFabricListResponse<T>>(response.success.continuationUri, undefined, false);

			if (response.error) {
				return { error: response.error };
			}
		}

		return { success: ret };
	}

	static async longRunningOperation<TSuccess = any>(response: Response, maxWaitTimeMS: number = 2000): Promise<iFabricApiResponse<TSuccess>> {
		// https://learn.microsoft.com/en-us/rest/api/fabric/articles/long-running-operation
		
		let callback = response.headers.get("location");
		let retryAfter = response.headers.get("retry-after");

		let customWaitMs: number = 250;
		let resultText: string;
		let pollingResult: iFabricPollingResponse;

		while (response.ok && callback) {
			if (callback.endsWith("/result")) {
				// next callback is the result already
				return this.get<TSuccess>(callback);
			}
			else {
				//await Helper.wait(retryAfter ? parseInt(retryAfter) / 10 * 1000 : 1000);
				await Helper.wait(customWaitMs);
				customWaitMs = Math.min(customWaitMs * 2, maxWaitTimeMS);
				let callback_response = await this.get<Response>(callback, undefined, true);

				if (callback_response.error) {
					return { error: callback_response.error };
				}

				callback = callback_response.success.headers.get("location");
				retryAfter = callback_response.success.headers.get("retry-after");

				resultText = await callback_response.success.text();
				pollingResult = JSON.parse(resultText) as any as iFabricPollingResponse;

				if (callback_response.success.ok) {
					if (pollingResult["status"] == "Failed") {
						return { error: pollingResult.error };
					}
				}
			}
		}
		return {
			success: pollingResult as TSuccess
		};
	}

	static async post<TSuccess = any>(endpoint: string, body: object, raw: boolean = false): Promise<iFabricApiResponse<TSuccess>> {
		endpoint = this.getFullUrl(endpoint);
		ThisExtension.log("POST " + endpoint + " --> " + (JSON.stringify(body) ?? "{}"));

		try {
			const config: RequestInit = {
				method: "POST",
				headers: this.getHeaders(),
				body: JSON.stringify(body),
				agent: getProxyAgent()
			};
			let response: Response = await fetch(endpoint, config);

			if (!response.ok) {
				return { error: (await response.json()) as any as iFabricErrorResponse };
			}
			else {
				if (raw) {
					return { success: response as any as TSuccess };
				}
				if (response.status == 202) {
					return this.longRunningOperation<TSuccess>(response, 2000);
				}
				return { success: (await response.json()) as TSuccess };
			}
		} catch (error) {
			this.handleApiException(error, true, false);

			return { "error": error as iFabricErrorResponse };
		}

	}

	static async postOrig<T = any>(endpoint: string, body: object): Promise<iFabricApiResponse<T>> {
		const ret = await PowerBIApiService.post<T>(endpoint, body, false);

		if (ret["error"]) {
			return { error: ret["error"] };
		}
		else {
			return { success: ret };
		}
	}

	static async delete<T = any>(endpoint: string, body: object): Promise<iFabricApiResponse<T>> {
		const ret = await PowerBIApiService.delete<T>(endpoint, body, false);

		if (ret["error"]) {
			return { error: ret["error"] };
		}
		else {
			return { success: ret };
		}
	}

	static async patch<T = any>(endpoint: string, body: object): Promise<iFabricApiResponse<T>> {
		const ret = await PowerBIApiService.patch<T>(endpoint, body, false);

		if (ret["error"]) {
			return { error: JSON.parse(ret["error"]["message"]) || JSON.parse(ret["error"]) };
		}
		else {
			return { success: ret };
		}
	}

	static async put<T = any>(endpoint: string, body: object): Promise<iFabricApiResponse<T>> {
		const ret = await PowerBIApiService.put<T>(endpoint, body, false);

		if (ret["error"]) {
			return { error: ret["error"] };
		}
		else {
			return { success: ret };
		}
	}

	public static get isInitialized(): boolean {
		return PowerBIApiService.isInitialized;
	}

	public static async Initialization(): Promise<boolean> {
		if (PowerBIApiService.isInitialized) {
			return true;
		}
		// wait 5 minutes for the service to initialize
		return Helper.awaitCondition(async () => FabricApiService.isInitialized, 300000, 100);
	}

	public static getFullUrl(endpoint: string, params?: object): string {

		let baseItems = this._apiBaseUrl.split("/");
		baseItems.push("v1.0");
		baseItems.push(PowerBIApiService.Org);
		let pathItems = endpoint.split("/").filter(x => x);

		let index = baseItems.indexOf(pathItems[0]);
		index = index == -1 ? undefined : index; // in case the item was not found, we append it to the baseUrl

		endpoint = (baseItems.slice(undefined, index).concat(pathItems)).join("/");

		let uri = vscode.Uri.parse(endpoint);

		if (params) {
			let urlParams = []
			for (let kvp of Object.entries(params)) {
				urlParams.push(`${kvp[0]}=${kvp[1] as number | string | boolean}`)
			}
			uri = uri.with({ query: urlParams.join('&') })
		}

		return uri.toString(true);
	}

	private static async logResponse(response: any): Promise<void> {
		if (typeof response == "string") {
			ThisExtension.log("Response: " + response);
		}
		else {
			ThisExtension.log("Response: " + JSON.stringify(response));
		}
	}

	private static handleApiException(error: Error, showErrorMessage: boolean = false, raise: boolean = false): void {
		ThisExtension.log("ERROR: " + error.name);
		ThisExtension.log("ERROR: " + error.message);
		if (error.stack) {
			ThisExtension.log("ERROR: " + error.stack);
		}

		if (showErrorMessage) {
			vscode.window.showErrorMessage(error.message);
		}

		if (raise) {
			throw error;
		}
	}

	private static async awaitWithProgress(message: string, promise: Promise<iFabricApiResponse>, showResultMessage: number = 5000): Promise<iFabricApiResponse> {
		let ret: iFabricApiResponse = undefined;

		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: message,
			cancellable: false
		}, async (progress: vscode.Progress<any>) => {
			progress.report({ message: " ..." });
			ThisExtension.log(message + " ...");

			const start = new Date().getTime();
			let result = await promise;
			const end = new Date().getTime();
			const duration = end - start;
			ThisExtension.log(message + " took " + duration + "ms!");

			let resultMessage = `SUCCEEDED after ${Math.round(duration / 1000)}s!`;
			if (result.error) {
				resultMessage = `FAILED after ${Math.round(duration / 1000)}s!`;
				vscode.window.showErrorMessage(JSON.stringify(result.error));
			}
			progress.report({ increment: 100, message: resultMessage });

			Helper.showTemporaryInformationMessage(message + ": " + resultMessage, showResultMessage);

			ret = result;

			return;
		});

		return ret;
	}

	static async listWorkspaces(): Promise<iFabricApiResponse<iFabricApiWorkspace[]>> {
		const endpoint = `${this._apiBaseUrl}/v1/workspaces`;
		return (await FabricApiService.getList<iFabricApiWorkspace>(endpoint));
	}

	static async getWorkspace(id: string): Promise<iFabricApiResponse<iFabricApiWorkspace>> {
		const endpoint = `${this._apiBaseUrl}/v1/workspaces/${id}`;
		return await FabricApiService.get<iFabricApiWorkspace>(endpoint);
	}

	static async listItems(workspaceId: string, itemType?: FabricApiItemType): Promise<iFabricApiResponse<iFabricApiItem[]>> {
		const endpoint = `${this._apiBaseUrl}/v1/workspaces/${workspaceId}/items`;
		const itemTypeFilter = itemType ? { type: FabricApiItemType[itemType] } : undefined;
		return (await FabricApiService.getList<iFabricApiItem>(endpoint, itemTypeFilter));
	}

	static async getItem(workspaceId: string, itemId: string): Promise<iFabricApiResponse<iFabricApiItem>> {
		const endpoint = `${this._apiBaseUrl}/v1/workspaces/${workspaceId}/items/${itemId}`;
		return await FabricApiService.get<iFabricApiItem>(endpoint);
	}

	static async getItemDefinition(workspaceId: string, itemId: string, format?: FabricApiItemFormat): Promise<iFabricApiResponse<iFabricApiItemDefinition>> {
		const endpoint = `${this._apiBaseUrl}/v1/workspaces/${workspaceId}/items/${itemId}/getDefinition`;
		const itemFormat = format && format != FabricApiItemFormat.DEFAULT ? `?format=${format}` : '';

		return await FabricApiService.post<iFabricApiItemDefinition>(endpoint + itemFormat, undefined);
	}

	static async getItemDefinitionParts(workspaceId: string, itemId: string, format?: FabricApiItemFormat): Promise<iFabricApiResponse<iFabricApiItemPart[]>> {
		const ret = await FabricApiService.getItemDefinition(workspaceId, itemId, format)

		if (ret.error) {
			return { error: ret.error };
		}
		else {
			return { success: ret.success.definition.parts };
		}
	}

	static async updateItemDefinition(workspaceId: string, itemId: string, itemDefinition: iFabricApiItemDefinition, progressText: string = "Creating Item"): Promise<iFabricApiResponse> {
		const endpoint = `${this._apiBaseUrl}/v1/workspaces/${workspaceId}/items/${itemId}/updateDefinition`;

		return await FabricApiService.awaitWithProgress(progressText, FabricApiService.post(endpoint, itemDefinition), 3000);
	}

	static async updateItem(workspaceId: string, itemId: string, newName?: string, newDescription?: string): Promise<iFabricApiResponse> {
		const endpoint = `${this._apiBaseUrl}/v1/workspaces/${workspaceId}/items/${itemId}`;

		const body = {};

		if (newName) {
			body["displayName"] = newName;
		}
		if (newDescription) {
			body["description"] = newDescription;
		}

		if (Object.keys(body).length > 0) {
			return FabricApiService.patch<iFabricApiItem>(endpoint, body);
		}
		return { success: "No Changes!" };
	}

	static async createItem(workspaceId: string, name: string, type: FabricApiItemType, definition?: iFabricApiItemDefinition, progressText: string = "Publishing Item"): Promise<iFabricApiResponse> {
		const endpoint = `${this._apiBaseUrl}/v1/workspaces/${workspaceId}/items`;

		const body = Object.assign({}, {
			displayName: name,
			type: FabricApiItemType[type]
		}, definition)

		return await FabricApiService.awaitWithProgress(progressText, FabricApiService.post<iFabricApiItem>(endpoint, body), 3000);
	}

	static async deleteItem(workspaceId: string, itemId: string, progressText: string = "Deleting Item"): Promise<iFabricApiResponse> {
		const endpoint = `${this._apiBaseUrl}/v1/workspaces/${workspaceId}/items/${itemId}`;

		return await FabricApiService.awaitWithProgress(progressText, FabricApiService.delete<any>(endpoint, undefined), 3000);
	}
}