import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';

import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricFSUri, FabricUriType } from './FabricFSUri';
import { FabricFSItem } from './FabricFSItem';
import { FabricFileDecorationProvider } from '../../fileDecoration/FabricFileDecorationProvider';
import { FABRIC_FS_ITEM_TYPE_NAMES } from './_types';
import { FabricFSItemType } from './FabricFSItemType';

export abstract class FabricFSCache {
	private static _localItems: string[] = [];
	private static _cache: Map<string, FabricFSCacheItem> = new Map<string, FabricFSCacheItem>();

	public static async initialize(): Promise<void> {
		if (FabricFSCache._cache) {
			FabricFSCache._cache.clear();
		}
		else {
			FabricFSCache._cache = new Map<string, FabricFSCacheItem>();
			
		}
		FabricFSCache._localItems = [];
	}

	public static async stats(fabricUri: FabricFSUri): Promise<vscode.FileStat | undefined> {
		if (!fabricUri.isValid) {
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

		if (!stats) {
			throw vscode.FileSystemError.FileNotFound(fabricUri.uri);
		}

		return stats;
	}

	public static async readDirectory(fabricUri: FabricFSUri): Promise<[string, vscode.FileType][] | undefined> {
		if (!fabricUri.isValid) {
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

			await FabricFileDecorationProvider.uriModifed(item.FabricUri);

			return;
		}

		vscode.window.showErrorMessage("Could not read File: " + fabricUri.uri.toString());
		throw vscode.FileSystemError.Unavailable("Could not read File: " + fabricUri.uri.toString());
	}

	public static async publish(resourceUri: vscode.Uri): Promise<void> {
		const fabricUri: FabricFSUri = await FabricFSUri.getInstance(resourceUri);

		let item = FabricFSCache._cache.get(fabricUri.cacheItemKey) as FabricFSItem;

		await item.publish();
		await FabricFileDecorationProvider.uriPublished(fabricUri);
	}

	public static async addCacheItem(fabricUri: FabricFSUri): Promise<FabricFSCacheItem> {
		let item = await fabricUri.getCacheItem();
		FabricFSCache._cache.set(fabricUri.cacheItemKey, item);

		return item;
	}

	private static removeCacheItem(item: FabricFSCacheItem): boolean {
		return FabricFSCache._cache.delete(item.FabricUri.cacheItemKey);
	}

	public static hasCacheItem(item: FabricFSUri): boolean {
		return FabricFSCache._cache.has(item.cacheItemKey);
	}

	public static async delete(fabricUri: FabricFSUri): Promise<void> {
		let item = FabricFSCache._cache.get(fabricUri.cacheItemKey);
		if (!item) {
			throw vscode.FileSystemError.FileNotFound(fabricUri.uri);
		}

		if (fabricUri.uriType == FabricUriType.part) {
			(item as FabricFSItem).removePart(fabricUri.part);

			return;
		}else if (fabricUri.uriType == FabricUriType.item) {
			(item as FabricFSItem).delete();
			await FabricFileDecorationProvider.uriDeleted(fabricUri);

			vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer", fabricUri.uri);

			return;
		}

		vscode.window.showErrorMessage("Could not read File: " + fabricUri.uri.toString());
		throw vscode.FileSystemError.Unavailable("Could not read File: " + fabricUri.uri.toString());
	}

	public static async createDirectory(fabricUri: FabricFSUri): Promise<void> {
		let item = FabricFSCache._cache.get(fabricUri.cacheItemKey);
		if (!item) {
			if (fabricUri.uriType == FabricUriType.item) {
				let itemType = FabricFSCache._cache.get((await fabricUri.getParent()).cacheItemKey) as FabricFSItemType;

				await itemType.createItem(decodeURIComponent(fabricUri.item));
				await FabricFileDecorationProvider.uriAdded(fabricUri);

				return;
			}
			else if (fabricUri.uriType == FabricUriType.workspace) {

			}
			else if (fabricUri.uriType == FabricUriType.itemType) {
				const newFolderName = fabricUri.uri.path.split("/").pop();

				const newItemType = newFolderName.split(".").pop();

				if (!FABRIC_FS_ITEM_TYPE_NAMES.includes(newItemType)) {
					(item as FabricFSItem).createSubFolder(newItemType);

					return;
				}

				return;
			}
		}
		if (item) {
			if (fabricUri.uriType == FabricUriType.part) {
				(item as FabricFSItem).createSubFolder(fabricUri.part);

				return;
			}
		}

		vscode.window.showErrorMessage("Directory can not be created: " + fabricUri.uri.toString());
		throw vscode.FileSystemError.NoPermissions("Directory can not be created: " + fabricUri.uri.toString());
	}

	public static async reloadFromFabric(resourceUri: vscode.Uri): Promise<void> {
		const fabricUri: FabricFSUri = await FabricFSUri.getInstance(resourceUri);

		for (let key of FabricFSCache._cache.keys()) {
			if (key.startsWith(fabricUri.cacheItemKey)) {
				FabricFSCache._cache.delete(key);
			}
		}

		await FabricFileDecorationProvider.uriReloaded(fabricUri)

		vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer", resourceUri);

	}

	public static addLocalItem(fabricUri: FabricFSUri): void {
		if (!FabricFSCache._localItems.includes(fabricUri.cacheItemKey)) {
			FabricFSCache._localItems.push(fabricUri.cacheItemKey);
		}
	}

	public static removeLocalItem(fabricUri: FabricFSUri): void {
		const index = FabricFSCache._localItems.indexOf(fabricUri.cacheItemKey, 0);
		if (index > -1) {
			FabricFSCache._localItems.splice(index, 1);
		}
	}

	public static hasLocalItem(fabricUri: FabricFSUri): boolean {
		return FabricFSCache._localItems.includes(fabricUri.cacheItemKey);
	}
}
