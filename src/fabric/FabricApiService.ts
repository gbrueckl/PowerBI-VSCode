import * as vscode from 'vscode';

import { fetch, FormData, RequestInit, RequestInfo, File, fileFrom, Response, getProxyAgent } from '@env/fetch';

import { Helper } from '../helpers/Helper';
import { ThisExtension } from '../ThisExtension';
import { PowerBIApiService } from '../powerbi/PowerBIApiService';
import { FabricApiItemFormat, FabricApiItemType, iFabricApiItem, iFabricApiItemDefinition, iFabricApiItemPart, iFabricApiResponse, iFabricApiWorkspace, iFabricErrorResponse, iFabricListResponse, iFabricPollingResponse } from './_types';
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

	static async getList<T = any[]>(endpoint: string, params: object = null, listProperty: string = "value", raiseError: boolean = false): Promise<T[]> {
		let response = await PowerBIApiService.get<iFabricListResponse<T>>(endpoint, params, raiseError, false);

		let ret: T[] = response[listProperty];
		
		while(response.continuationUri)
		{
			ret = ret.concat(response[listProperty]);
			response = await PowerBIApiService.get<iFabricListResponse<T>>(response.continuationUri, undefined, raiseError, false);
		}

		return ret;
	}

	static async post<TSuccess = any>(endpoint: string, body: object, raiseError: boolean = false, raw: boolean = false): Promise<iFabricApiResponse<TSuccess>> {
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

			if (raw && response.ok) {
				return { success: response as any as TSuccess };
			}

			let resultText = await response.text();
			let ret: iFabricApiResponse<TSuccess>;

			let callback = response.headers.get("location");
			let retryAfter = response.headers.get("retry-after");
			let requestFinished: boolean = false;

			while (response.ok && callback && !requestFinished) {
				if (callback.endsWith("/result")) {
					// next callback is the result already
					const result = await this.get<TSuccess>(callback);
					return { success: result };
				}
				else {
					await Helper.wait(retryAfter ? parseInt(retryAfter) / 10 * 1000 : 1000);
					response = await this.get<Response>(callback, undefined, false, true);

					callback = response.headers.get("location");
					retryAfter = response.headers.get("retry-after");

					resultText = await response.text();
					let pollingResult = JSON.parse(resultText) as any as iFabricPollingResponse;

					if (response.ok) {
						if (pollingResult["status"] == "Failed") {
							return { error: pollingResult.error };
						}
					}
				}
			}
			if (response.ok) {
				ret = { success: JSON.parse(resultText) as TSuccess };
			}
			else {
				if (!resultText || resultText == "") {
					ret = { error: { errorCode: `${response.status}`, message: response.statusText } as iFabricErrorResponse };
				}
				else {
					return { error: JSON.parse(resultText) as iFabricErrorResponse };
				}
			}

			await this.logResponse(ret);
			return ret;
		} catch (error) {
			this.handleApiException(error, true, raiseError);

			return { "error": error as iFabricErrorResponse };
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
			if(result.error) {
				resultMessage = `FAILED after ${Math.round(duration / 1000)}s!`;
				vscode.window.showErrorMessage(JSON.stringify(result.error));
			}
			progress.report({ increment: 100, message: resultMessage});
			ret = result;

			const p = await new Promise<void>(resolve => {
				setTimeout(() => {
					resolve();
				}, showResultMessage);
			});

			return p;
		});

		return ret;
	}

	static async listWorkspaces(): Promise<iFabricApiWorkspace[]> {
		const endpoint = `https://api.fabric.microsoft.com/v1/workspaces`;
		return (await FabricApiService.getList<iFabricApiWorkspace>(endpoint));
	}

	static async getWorkspace(id: string): Promise<iFabricApiWorkspace> {
		const endpoint = `https://api.fabric.microsoft.com/v1/workspaces/${id}`;
		return FabricApiService.get<iFabricApiWorkspace>(endpoint);
	}

	static async listItems(workspaceId: string, itemType?: FabricApiItemType): Promise<iFabricApiItem[]> {
		const endpoint = `https://api.fabric.microsoft.com/v1/workspaces/${workspaceId}/items`;
		const itemTypeFilter = itemType ? {type: FabricApiItemType[itemType]} : undefined;
		return (await FabricApiService.getList<iFabricApiItem>(endpoint, itemTypeFilter));
	}

	static async getItem(workspaceId: string, itemId: string): Promise<iFabricApiItem> {
		const endpoint = `https://api.fabric.microsoft.com/v1/workspaces/${workspaceId}/items/${itemId}`;
		return FabricApiService.get<iFabricApiItem>(endpoint);
	}

	static async getItemDefinition(workspaceId: string, itemId: string, format?: FabricApiItemFormat): Promise<iFabricApiItemDefinition> {
		const endpoint = `https://api.fabric.microsoft.com/v1/workspaces/${workspaceId}/items/${itemId}/getDefinition`;
		const itemFormat = format ? `?format=${format}` : '';

		const result = await FabricApiService.post<iFabricApiItemDefinition>(endpoint + itemFormat, undefined);

		if (result.error) {
			throw new Error(result.error.message);
		}
		else {
			return result.success;
		}
	}

	static async getItemDefinitionParts(workspaceId: string, itemId: string, format?: FabricApiItemFormat): Promise<iFabricApiItemPart[]> {
		return (await FabricApiService.getItemDefinition(workspaceId, itemId, format)).definition.parts;
	}

	static async updateItemDefinition(workspaceId: string, itemId: string, itemDefinition: iFabricApiItemDefinition, progressText: string = "Publish Item"): Promise<iFabricApiResponse> {
		const endpoint = `https://api.fabric.microsoft.com/v1/workspaces/${workspaceId}/items/${itemId}/updateDefinition`;

		const result = await FabricApiService.awaitWithProgress(progressText, FabricApiService.post<any>(endpoint, itemDefinition), 3000); 

		return result;
	}
}