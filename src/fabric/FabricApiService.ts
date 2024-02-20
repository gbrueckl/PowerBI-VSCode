import * as vscode from 'vscode';

import { fetch, FormData, RequestInit, RequestInfo, File, fileFrom, Response, getProxyAgent } from '@env/fetch';

import { Helper, UniqueId } from '../helpers/Helper';
import { ThisExtension } from '../ThisExtension';
import { PowerBIApiService } from '../powerbi/PowerBIApiService';
import { FabricApiItemFormat, FabricApiItemType, iFabricApiItem, iFabricApiItemPart, iFabricApiWorkspace } from './_types';

export abstract class FabricApiService {

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

	static async post<T = any>(endpoint: string, body: object, raiseError: boolean = false): Promise<T> {
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

	public static getFullUrl(endpoint: string, params?: object): string {

		let baseItems = "https://api.fabric.microsoft.com".split("/");
		baseItems.push("v1.0");
		baseItems.push(PowerBIApiService.Org);
		let pathItems = endpoint.split("/").filter(x => x);

		let index = pathItems.indexOf(baseItems.slice(-1)[0]);

		endpoint = (baseItems.concat(pathItems.slice(index + 1))).join("/");

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
		const itemTypeFilter = itemType ? `?type=${itemType}` : '';
		return FabricApiService.get<iFabricApiItem[]>(endpoint + itemTypeFilter);
	}

	static async getItem(workspaceId: string, itemId: string): Promise<iFabricApiItem> {
		const endpoint = `https://api.fabric.microsoft.com/v1/workspaces/${workspaceId}/items/${itemId}`;
		return FabricApiService.get<iFabricApiItem>(endpoint);
	}

	static async getItemParts(workspaceId: string, itemId: string, format?: FabricApiItemFormat): Promise<iFabricApiItemPart[]> {
		const endpoint = `https://api.fabric.microsoft.com/v1/workspaces/${workspaceId}/items/${itemId}/getDefinition`;
		const itemFormat = format ? `?format=${format}` : '';
		return FabricApiService.get<iFabricApiItemPart[]>(endpoint + itemFormat);
	}
}