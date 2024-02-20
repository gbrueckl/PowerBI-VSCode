import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';

import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricFSUri } from './FabricFSUri';

export abstract class FabricFSCache {
	private static _cache: Map<string, FabricFSCacheItem> = new Map<string, FabricFSCacheItem>();

	public static async stats(uri: FabricFSUri): Promise<vscode.FileStat | undefined> {
		let item = FabricFSCache._cache.get(uri.getCacheItemKey());
		if(!item)
		{
			item = FabricFSCache.addCacheItem(uri);
		}
		
		return item.stats();
	}

	public static async readDirectory(uri: FabricFSUri): Promise<[string, vscode.FileType][] | undefined> {
		let item = FabricFSCache._cache.get(uri.getCacheItemKey());
		if(!item)
		{
			item = FabricFSCache.addCacheItem(uri);
		}
		
		return item.readDirectory();
	}

	private static addCacheItem(uri: FabricFSUri): FabricFSCacheItem {
		let item  = uri.getCacheItem();
		FabricFSCache._cache.set(uri.getCacheItemKey(), item);

		return item;
	}

	private static removeCacheItem(item: FabricFSCacheItem): boolean {
		return FabricFSCache._cache.delete(item.FabricUri.getCacheItemKey());
	}
}
