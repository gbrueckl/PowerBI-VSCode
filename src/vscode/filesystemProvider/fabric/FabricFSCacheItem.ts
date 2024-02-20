import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { FabricFSWorkspace } from './FabricFSWorkspace_ARRAY';
import { FabricFSItem } from './FabricFSItem';
import { FabricFSItemPart } from './FabricFSItemPart';
import { LoadingState } from '../TMDLFSDatabase';
import { FabricFSUri, FabricUriType } from './FabricFSUri';
import { FabricApiService } from '../../../fabric/FabricAPIService';
import { Helper } from '../../../helpers/Helper';

export class FabricFSCacheItem {
	
	protected _uri: FabricFSUri;
	protected _loadingStateStats: LoadingState = "not_loaded";
	protected _loadingStateChildren: LoadingState = "not_loaded";
	protected _stats: vscode.FileStat | undefined;
	protected _children: [string, vscode.FileType][] | undefined;

	constructor(uri: FabricFSUri) {
		this._uri = uri;
		this._loadingStateStats = "not_loaded";
		this._loadingStateChildren = "not_loaded";
	}

	get UriType(): FabricUriType {
		return this._uri.uriType;
	}

	get Uri(): FabricFSUri {
		return this._uri
	}

	get loadingStateStats(): LoadingState {
		return this._loadingStateStats;
	}	

	set loadingStateStats(value: LoadingState) {
		this._loadingStateStats = value;
	}

	get loadingStateChildren(): LoadingState {
		return this._loadingStateChildren;
	}	

	set loadingStateChildren(value: LoadingState) {
		this._loadingStateChildren = value;
	}

	public async stats(): Promise<vscode.FileStat | undefined> {
		if (this.loadingStateStats == "not_loaded") {
			this.loadingStateStats = "loading";
			
			ThisExtension.log(`Loading Fabric URI Stats ${this.Uri} ...`);
			await this.loadStatsFromApi();

			return this._stats;
		}
		else if (this.loadingStateStats == "loading") {
			ThisExtension.logDebug(`Fabric URI Stats for ${this.Uri} are loading in other process - waiting ... `);
			await Helper.awaitCondition(async () => this.loadingStateStats != "loading", 60000, 500);
			ThisExtension.logDebug(`Fabric URI Stats for ${this.Uri} successfully loaded in other process!`);
		}
	}

	public async readDirectory(): Promise<[string, vscode.FileType][] | undefined> {
		if (this.loadingStateChildren == "not_loaded") {
			this.loadingStateChildren = "loading";
			
			ThisExtension.log(`Loading Fabric URI Children ${this.Uri} ...`);
			await this.loadChildrenFromApi();

			return this._children;
		}
		else if (this.loadingStateChildren == "loading") {
			ThisExtension.logDebug(`Fabric URI Chilrdren for ${this.Uri} are loading in other process - waiting ... `);
			await Helper.awaitCondition(async () => this.loadingStateChildren != "loading", 60000, 500);
			ThisExtension.logDebug(`Fabric URI Children for ${this.Uri} successfully loaded in other process!`);
		}
	}

	public async loadChildrenFromApi<T>(): Promise<void> {
		
	}

	public async loadStatsFromApi<T>(): Promise<void> {
		
	}
}
