import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';

import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricFSUri, FabricUriType } from './FabricFSUri';
import { FabricFSItem } from './FabricFSItem';

export abstract class FabricFSCache {
	private static _cache: Map<string, FabricFSCacheItem> = new Map<string, FabricFSCacheItem>();

	public static async initialize(): Promise<void> {
		if (FabricFSCache._cache) {
			FabricFSCache._cache.clear();
		}
		else {
			FabricFSCache._cache = new Map<string, FabricFSCacheItem>();
		}
	}

	public static async stats(fabricUri: FabricFSUri): Promise<vscode.FileStat | undefined> {
		if(!fabricUri.isValid) {
			ThisExtension.log(`stats() - Fabric URI is not valid: ${fabricUri.uri.toString()}`);
			throw vscode.FileSystemError.FileNotFound(fabricUri.uri);
		}

		let item = FabricFSCache._cache.get(fabricUri.cacheItemKey);
		if (!item) {
			item = await FabricFSCache.addCacheItem(fabricUri);
		}

		if (fabricUri.uriType == FabricUriType.part) {
			return (item as FabricFSItem).getStatsForSubpath(fabricUri.part);
		}
		const stats = await item.stats();

		if(!stats) {
			throw vscode.FileSystemError.FileNotFound(fabricUri.uri);
		}

		return stats;
	}

	public static async readDirectory(fabricUri: FabricFSUri): Promise<[string, vscode.FileType][] | undefined> {
		if(!fabricUri.isValid) {
			ThisExtension.log(`readDirectory() - Fabric URI is not valid: ${fabricUri.uri.toString()}`);
			throw vscode.FileSystemError.FileNotFound(fabricUri.uri);
		}
		
		let item = FabricFSCache._cache.get(fabricUri.cacheItemKey);
		if (!item) {
			item = await FabricFSCache.addCacheItem(fabricUri);
		}

		if (fabricUri.uriType == FabricUriType.part) {
			return (item as FabricFSItem).getChildrenForSubpath(fabricUri.part);
		}

		return item.readDirectory();
	}

	public static async readFile(fabricUri: FabricFSUri): Promise<Uint8Array> {
		let item = FabricFSCache._cache.get(fabricUri.cacheItemKey);
		if (!item) {
			item = await FabricFSCache.addCacheItem(fabricUri);
		}

		if (fabricUri.uriType == FabricUriType.part) {
			return (item as FabricFSItem).getContentForSubpath(fabricUri.part);
		}

		vscode.window.showErrorMessage("Could not read File: " + fabricUri.uri.toString());
		throw vscode.FileSystemError.Unavailable("Could not read File: " + fabricUri.uri.toString());
	}

	public static async writeFile(fabricUri: FabricFSUri, content: Uint8Array, options: { create: boolean, overwrite: boolean }): Promise<void> {
		let item = FabricFSCache._cache.get(fabricUri.cacheItemKey);
		if (!item) {
			item = await FabricFSCache.addCacheItem(fabricUri);
		}

		if (fabricUri.uriType == FabricUriType.part) {
			(item as FabricFSItem).writeContentToSubpath(fabricUri.part, content, options);

			return;
		}

		vscode.window.showErrorMessage("Could not read File: " + fabricUri.uri.toString());
		throw vscode.FileSystemError.Unavailable("Could not read File: " + fabricUri.uri.toString());
	}

	public static async updateItemDefinition(resourceUri: vscode.Uri): Promise<void> {
		const fabricUri: FabricFSUri = await FabricFSUri.getInstance(resourceUri);

		let item = FabricFSCache._cache.get(fabricUri.cacheItemKey) as FabricFSItem;

		item.updateItemDefinition();
	}

	private static async addCacheItem(fabricUri: FabricFSUri): Promise<FabricFSCacheItem> {
		let item = await fabricUri.getCacheItem();
		FabricFSCache._cache.set(fabricUri.cacheItemKey, item);

		return item;
	}

	private static async removeCacheItem(item: FabricFSCacheItem): Promise<boolean> {
		return FabricFSCache._cache.delete(item.FabricUri.cacheItemKey);
	}

	public static async delete(fabricUri: FabricFSUri): Promise<void> {
		let item = FabricFSCache._cache.get(fabricUri.cacheItemKey);
		if (!item) {
			throw vscode.FileSystemError.FileNotFound(fabricUri.uri);
		}

		if (fabricUri.uriType == FabricUriType.part) {
			(item as FabricFSItem).removePart(fabricUri.part);

			return;
		}

		vscode.window.showErrorMessage("Could not read File: " + fabricUri.uri.toString());
		throw vscode.FileSystemError.Unavailable("Could not read File: " + fabricUri.uri.toString());
	}

	public static async createDirectory(fabricUri: FabricFSUri): Promise<void> {
		let item = FabricFSCache._cache.get(fabricUri.cacheItemKey);
		if (!item) {
			throw vscode.FileSystemError.FileNotFound(fabricUri.uri);
		}

		if (fabricUri.uriType == FabricUriType.part) {
			(item as FabricFSItem).createSubFolder(fabricUri.part);

			return;
		}

		vscode.window.showErrorMessage("Directory can not be created: " + fabricUri.uri.toString());
		throw vscode.FileSystemError.NoPermissions("Directory can not be created: " + fabricUri.uri.toString());
	}

	public static async reloadFromFabric(resourceUri: vscode.Uri, reloadFromFabric: boolean = true): Promise<void> {
		const fabricUri: FabricFSUri = await FabricFSUri.getInstance(resourceUri);

		for (let key of FabricFSCache._cache.keys()) {
			if (key.startsWith(fabricUri.cacheItemKey)) {
				FabricFSCache._cache.delete(key);
			}
		}

		// refresh
		if (reloadFromFabric) {
			vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer", resourceUri);
		}
	}
}
