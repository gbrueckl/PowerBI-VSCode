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

	public static async stats(uri: FabricFSUri): Promise<vscode.FileStat | undefined> {
		let item = FabricFSCache._cache.get(uri.cacheItemKey);
		if (!item) {
			item = await FabricFSCache.addCacheItem(uri);
		}

		if (uri.uriType == FabricUriType.part) {
			return (item as FabricFSItem).getStatsForSubpath(uri.part);
		}
		return item.stats();
	}

	public static async readDirectory(uri: FabricFSUri): Promise<[string, vscode.FileType][] | undefined> {
		let item = FabricFSCache._cache.get(uri.cacheItemKey);
		if (!item) {
			item = await FabricFSCache.addCacheItem(uri);
		}

		if (uri.uriType == FabricUriType.part) {
			return (item as FabricFSItem).getChildrenForSubpath(uri.part);
		}

		return item.readDirectory();
	}

	public static async readFile(uri: FabricFSUri): Promise<Uint8Array> {
		let item = FabricFSCache._cache.get(uri.cacheItemKey);
		if (!item) {
			item = await FabricFSCache.addCacheItem(uri);
		}

		if (uri.uriType == FabricUriType.part) {
			return (item as FabricFSItem).getContentForSubpath(uri.part);
		}

		vscode.window.showErrorMessage("Could not read File: " + uri.uri.toString());
		throw vscode.FileSystemError.Unavailable("Could not read File: " + uri.uri.toString());
	}

	public static async writeFile(uri: FabricFSUri, content: Uint8Array, options: { create: boolean, overwrite: boolean }): Promise<void> {
		let item = FabricFSCache._cache.get(uri.cacheItemKey);
		if (!item) {
			item = await FabricFSCache.addCacheItem(uri);
		}

		if (uri.uriType == FabricUriType.part) {
			(item as FabricFSItem).writeContentToSubpath(uri.part, content, options);

			return;
		}

		vscode.window.showErrorMessage("Could not read File: " + uri.uri.toString());
		throw vscode.FileSystemError.Unavailable("Could not read File: " + uri.uri.toString());
	}

	public static async updateItemDefinition(resourceUri: vscode.Uri): Promise<void> {
		const fabricUri: FabricFSUri = await FabricFSUri.getInstance(resourceUri);

		let item = FabricFSCache._cache.get(fabricUri.cacheItemKey) as FabricFSItem;

		item.updateItemDefinition();
	}

	private static async addCacheItem(uri: FabricFSUri): Promise<FabricFSCacheItem> {
		let item = await uri.getCacheItem();
		FabricFSCache._cache.set(uri.cacheItemKey, item);

		return item;
	}

	private static removeCacheItem(item: FabricFSCacheItem): boolean {
		return FabricFSCache._cache.delete(item.FabricUri.cacheItemKey);
	}
}
