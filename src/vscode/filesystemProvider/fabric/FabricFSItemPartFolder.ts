import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';
import { iFabricApiItemPart } from '../../../fabric/_types';
import { FabricFSItem } from './FabricFSItem';
import { LoadingState } from './_types';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricFSUri } from './FabricFSUri';
import { FabricFSCache } from './FabricFSCache';

export class FabricFSItemPartFolder extends FabricFSCacheItem implements iFabricApiItemPart{
	path: string;
	payload: string;
	payloadType: string;

	item: FabricFSItem;

	loadingState: LoadingState;

	constructor(uri: FabricFSUri) {
		super(uri);
	}

	public async loadStatsFromApi<T>(): Promise<void> {
		this._stats = {
			type: vscode.FileType.Directory,
			ctime: undefined,
			mtime: undefined,
			size: undefined
		};
	}

	public async loadChildrenFromApi<T>(): Promise<void> {
		/*
		if (!this._children) {
			const fabricItem = await FabricFSCache.readDirectory(this.FabricUri.fabricItemUri);
			this._children = [];

			let folders: [string, vscode.FileType][] = [];
			let files: [string, vscode.FileType][] = [];

			for (let item of apiItems) {
				const partParts = item.path.split("/");
				if (partParts.length == 1) {
					files.push([item.path, vscode.FileType.File]);
				}
				else {
					const folderName = partParts[0];
					if (!folders.find((folder) => folder[0] == folderName)) {
						folders.push([folderName, vscode.FileType.Directory]);
					}
				}
			}
			this._children = folders.concat(files);
		}
		*/
	}
}