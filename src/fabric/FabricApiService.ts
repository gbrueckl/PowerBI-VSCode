import * as vscode from 'vscode';

import { fetch, FormData, RequestInit, RequestInfo, File, fileFrom, Response, getProxyAgent } from '@env/fetch';

import { Helper } from '../helpers/Helper';
import { ThisExtension } from '../ThisExtension';
import { PowerBIApiService } from '../powerbi/PowerBIApiService';
import { FabricApiItemFormat, FabricApiItemType, iFabricApiItem, iFabricApiItemDefinition, iFabricApiItemPart, iFabricApiWorkspace, iFabricErrorResponse, iFabricPollingResponse } from './_types';
import { FabricFSCache } from '../vscode/filesystemProvider/fabric/FabricFSCache';

export abstract class FabricApiService {

	//#region Initialization
	static async initialize(
		// Default settings will be for Azure Global
		apiBaseUrl: string = "https://api.powerbi.com/",
		tenantId: string = undefined,
		clientId: string = undefined,
		tmdlClientId: string = undefined,
		authenticationProvider: string = "microsoft",
		resourceId: string = "https://analysis.windows.net/powerbi/api"
	): Promise<boolean> {

		FabricFSCache.initialize()

		return true;
	}
	static async get<T = any>(endpoint: string, params: object = null, raiseError: boolean = false, raw: boolean = false): Promise<T> {
		return PowerBIApiService.get<T>(endpoint, params, raiseError, raw);
	}

	static async getList<T = any[]>(endpoint: string, params: object = null, raiseError: boolean = false, raw: boolean = false): Promise<T[]> {
		let x = PowerBIApiService.get<T>(endpoint, params, raiseError, true);

		let ret: T[] = [];
		//do while conituationToken



		throw new Error("Method not implemented.");

		return ret;
	}

	static async post<T = any>(endpoint: string, body: object, raiseError: boolean = false, raw: boolean = false): Promise<T> {
		endpoint = this.getFullUrl(endpoint);
		ThisExtension.log("POST " + endpoint + " --> " + (JSON.stringify(body) ?? "{}"));

		try {
			const config: RequestInit = {
				method: "POST",
				headers: PowerBIApiService.getHeaders(),
				body: JSON.stringify(body),
				agent: getProxyAgent()
			};
			let response: Response = await fetch(endpoint, config);

			if (raw) {
				return response as any as T;
			}

			let resultText = await response.text();
			let ret: T;

			let callback = response.headers.get("location");
			let retryAfter = response.headers.get("retry-after");
			let requestFinished: boolean = false;

			while (response.ok && callback && !requestFinished) {
				if (callback.endsWith("/result")) {
					// next callback is the result already
					const result = await this.get<T>(callback);
					return result;
				}
				else {
					await Helper.wait(retryAfter ? parseInt(retryAfter) / 10 * 1000 : 1000);
					response = await this.get<Response>(callback, undefined, false, true);

					callback = response.headers.get("location");
					retryAfter = response.headers.get("retry-after");

					resultText = await response.text();
					let pollingResult = JSON.parse(resultText) as any as iFabricPollingResponse;

					if (response.ok){
						if (pollingResult["status"] == "Failed") {
							return { "error": { "status": 999, "statusText": pollingResult.error } } as T;
						}
					}
				}
			}
			if (response.ok) {
				if (!resultText || resultText == "") {
					ret = { "value": { "status": response.status, "statusText": response.statusText } } as T;
				}
				else {
					ret = JSON.parse(resultText) as T;
				}
			}
			else {
				if (!resultText || resultText == "") {
					ret = { "error": { "status": response.status, "statusText": response.statusText } } as T;
				}
				if (raiseError) {
					throw new Error(resultText);
				}
				else {
					return JSON.parse(resultText) as T;
				}
			}

			await this.logResponse(ret);
			return ret;
		} catch (error) {
			this.handleApiException(error, false, raiseError);

			return undefined;
		}

	}

	static async postOrig<T = any>(endpoint: string, body: object, raiseError: boolean = false): Promise<T> {
		return PowerBIApiService.post<T>(endpoint, body, raiseError);
	}

	static async delete<T = any>(endpoint: string, body: object, raiseError: boolean = false): Promise<T> {
		return PowerBIApiService.delete<T>(endpoint, body, raiseError);
	}

	static async patch<T = any>(endpoint: string, body: object, raiseError: boolean = false): Promise<T> {
		return PowerBIApiService.patch<T>(endpoint, body, raiseError);
	}

	static async put<T = any>(endpoint: string, body: object, raiseError: boolean = false): Promise<T> {
		return PowerBIApiService.put<T>(endpoint, body, raiseError);
	}

	public static get isInitialized(): boolean {
		return PowerBIApiService.isInitialized;
	}

	public static async Initialization(): Promise<boolean> {
		// wait 5 minutes for the service to initialize
		return Helper.awaitCondition(async () => FabricApiService.isInitialized, 300000, 500);
	}

	public static getFullUrl(endpoint: string, params?: object): string {

		let baseItems = "https://api.fabric.microsoft.com".split("/");
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

	static async listWorkspaces(): Promise<iFabricApiWorkspace[]> {
		const endpoint = `https://api.fabric.microsoft.com/v1/workspaces`;
		return (await FabricApiService.get<iFabricApiWorkspace[]>(endpoint))["value"];
	}

	static async getWorkspace(id: string): Promise<iFabricApiWorkspace> {
		const endpoint = `https://api.fabric.microsoft.com/v1/workspaces/${id}`;
		return FabricApiService.get<iFabricApiWorkspace>(endpoint);
	}

	static async getItems(workspaceId: string, itemType?: FabricApiItemType): Promise<iFabricApiItem[]> {
		const endpoint = `https://api.fabric.microsoft.com/v1/workspaces/${workspaceId}/items`;
		const itemTypeFilter = itemType ? `?type=${FabricApiItemType[itemType]}` : '';
		return (await FabricApiService.get<iFabricApiItem[]>(endpoint + itemTypeFilter))["value"];
	}

	static async getItem(workspaceId: string, itemId: string): Promise<iFabricApiItem> {
		const endpoint = `https://api.fabric.microsoft.com/v1/workspaces/${workspaceId}/items/${itemId}`;
		return FabricApiService.get<iFabricApiItem>(endpoint);
	}

	static async getItemDefinition(workspaceId: string, itemId: string, format?: FabricApiItemFormat): Promise<iFabricApiItemDefinition> {
		const endpoint = `https://api.fabric.microsoft.com/v1/workspaces/${workspaceId}/items/${itemId}/getDefinition`;
		const itemFormat = format ? `?format=${format}` : '';
		return (await FabricApiService.post<iFabricApiItemDefinition>(endpoint + itemFormat, undefined));
		
	}

	static async getItemDefinitionParts(workspaceId: string, itemId: string, format?: FabricApiItemFormat): Promise<iFabricApiItemPart[]> {
		return (await FabricApiService.getItemDefinition(workspaceId, itemId, format)).definition.parts;
	}

	static async updateItemDefinition(workspaceId: string, itemId: string, itemDefinition: iFabricApiItemDefinition): Promise<undefined | iFabricErrorResponse> {
		const endpoint = `https://api.fabric.microsoft.com/v1/workspaces/${workspaceId}/items/${itemId}/updateDefinition`;

		const result = await FabricApiService.post<iFabricErrorResponse>(endpoint, itemDefinition);

		if (result.message) {
			return result;
		}
		return undefined;
	}
}