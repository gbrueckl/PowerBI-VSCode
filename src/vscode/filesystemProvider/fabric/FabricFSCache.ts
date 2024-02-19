import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { FabricFSWorkspace } from './FabricFSWorkspace';
import { FabricFSItem } from './FabricFSItem';
import { FabricFSItemPart } from './FabricFSItemPart';
import { LoadingState } from '../TMDLFSDatabase';
import { Helper } from '../../../helpers/Helper';
import { FabricApiService } from '../../../fabric/FabricAPIService';
import { FabricItemType } from '../../../fabric/_types';

export abstract class FabricFSCache {
	static loadingState: LoadingState = "not_loaded";
	private static cachedWorkspaces: FabricFSWorkspace[] = [];

	public static async load(): Promise<void> {
		if (FabricFSCache.loadingState == "not_loaded") {
			FabricFSCache.loadingState = "loading";
			ThisExtension.log("################### Awaiting API initialization ... ")
			await Helper.awaitCondition(async () => FabricApiService.isInitialized, 60000, 500);
			ThisExtension.log(`Loading Fabric Workspace Root ... `);
			
			const workspaces = await FabricApiService.listWorkspaces();
			if (workspaces) {
				for(let workspace of workspaces)
				{
					let ws = new FabricFSWorkspace(workspace.id);
					FabricFSCache.cachedWorkspaces.push(ws);
				}

				FabricFSCache.loadingState = "loaded";
				ThisExtension.log(`Fabric Workspace Root loaded!`);
			}
			else {
				FabricFSCache.loadingState = "not_loaded";
				ThisExtension.log(`Failed to load Fabric Workspace Root!`);
			}
		}
		else if (FabricFSCache.loadingState == "loading") {
			ThisExtension.logDebug(`Fabric Workspace Root is loading in other process - waiting ... `);
			await Helper.awaitCondition(async () => FabricFSCache.loadingState != "loading", 60000, 500);
			ThisExtension.logDebug(`Fabric Workspace Root successfully loaded in other process!`);
		}
	}

	public static async getWorkspaces(autoLoad: boolean = true): Promise<FabricFSWorkspace[]> {
		if(FabricFSCache.loadingState != "loaded" && autoLoad)
		{
			await FabricFSCache.load();
		}

		return FabricFSCache.cachedWorkspaces;
	}

	public static async getWorkspace(workspaceId: string, autoLoad: boolean = true): Promise<FabricFSWorkspace> {
		let workspace = (await FabricFSCache.getWorkspaces()).find((ws) => ws.id == workspaceId);

		if(!workspace)
		{
			workspace = new FabricFSWorkspace(workspaceId);
			FabricFSCache.cachedWorkspaces.push(workspace);
		}

		if(workspace.loadingState != "loaded" && autoLoad)
		{
			await workspace.load();
		}

		return workspace;
	}

	public static async getItems(workspaceId: string, itemType: FabricItemType): Promise<FabricFSItem[]> {
		const workspace = await FabricFSCache.getWorkspace(workspaceId);

		return await workspace.getItems(itemType);
	}

	public static async getItem(workspaceId: string, itemId: string): Promise<FabricFSItem> {
		const workspace = await FabricFSCache.getWorkspace(workspaceId);

		return await workspace.getItem(itemId);
	}

	public static async getItemPart(workspaceId: string, itemId: string, part: string): Promise<FabricFSItemPart> {
		const workspace = await FabricFSCache.getWorkspace(workspaceId);

		const item = await workspace.getItem(itemId);

		return await item.getPart(part);
	}

	public static async getItemParts(workspaceId: string, itemId: string): Promise<FabricFSItemPart[]> {
		const workspace = await FabricFSCache.getWorkspace(workspaceId);

		const item = await workspace.getItem(itemId);

		return await item.parts;
	}



	public static async loadWorkspace(workspaceId: string): Promise<FabricFSWorkspace> {
		let ws: FabricFSWorkspace = await FabricFSCache.getWorkspace(workspaceId);
		return ws;
	}

	public static async loadItem(workspaceId: string, itemId: string): Promise<FabricFSItem> {
		let item = await FabricFSCache.getItem(workspaceId, itemId);
		return item;
	}
}
