import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { LoadingState } from '../TMDLFSDatabase';
import { FabricFSUri, FabricUriType } from './FabricFSUri';
import { Helper } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { FabricApiService } from '../../../fabric/FabricApiService';

export class FabricFSCacheItem {
	
	protected _uri: FabricFSUri;
	protected _loadingStateStats: LoadingState = "not_loaded";
	protected _loadingStateChildren: LoadingState = "not_loaded";
	protected _stats: vscode.FileStat | undefined;
	protected _children: [string, vscode.FileType][] | undefined;
	protected _content: Uint8Array | undefined;
	protected _apiResponse: any;

	constructor(uri: FabricFSUri) {
		this._uri = uri;
		this._loadingStateStats = "not_loaded";
		this._loadingStateChildren = "not_loaded";
	}

	get UriType(): FabricUriType {
		return this._uri.uriType;
	}

	get FabricUri(): FabricFSUri {
		return this._uri
	}

	get uri(): vscode.Uri {
		return this.FabricUri.uri;
	}
	
	getApiResponse<T>(): T {
		return this._apiResponse as T;
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
			
			ThisExtension.log(`Loading Fabric URI Stats ${this.FabricUri.uri.toString()} ...`);
			const initialized = await FabricApiService.Initialization();
			if(initialized) {
				await this.loadStatsFromApi();
				this.loadingStateStats = "loaded";
			}
			else
			{
				this.loadingStateStats = "not_loaded";
			}
		}
		else if (this.loadingStateStats == "loading") {
			ThisExtension.logDebug(`Fabric URI Stats for ${this.FabricUri.uri.toString()} are loading in other process - waiting ... `);
			await Helper.awaitCondition(async () => this.loadingStateStats != "loading", 10000, 500);
			ThisExtension.logDebug(`Fabric URI Stats for ${this.FabricUri.uri.toString()} successfully loaded in other process!`);
		}
		return this._stats;
	}

	public async readDirectory(): Promise<[string, vscode.FileType][] | undefined> {
		if (this.loadingStateChildren == "not_loaded") {
			this.loadingStateChildren = "loading";
			
			ThisExtension.log(`Loading Fabric URI Children ${this.FabricUri.uri.toString()} ...`);
			const initialized = await FabricApiService.Initialization();
			if(initialized) {
				await this.loadChildrenFromApi();
				this.loadingStateChildren = "loaded";
			}
			else
			{
				this.loadingStateChildren = "not_loaded";
			}
		}
		else if (this.loadingStateChildren == "loading") {
			ThisExtension.logDebug(`Fabric URI Chilrdren for ${this.FabricUri.uri.toString()} are loading in other process - waiting ... `);
			await Helper.awaitCondition(async () => this.loadingStateChildren != "loading", 10000, 500);
			ThisExtension.logDebug(`Fabric URI Children for ${this.FabricUri.uri.toString()} successfully loaded in other process!`);
		}
		return this._children;
	}

	public async readFile(): Promise<Uint8Array | undefined> {
		throw new Error("Method not implemented.");
	}

	async writeFile(content: Uint8Array, options: { create: boolean, overwrite: boolean }): Promise<void> {
		throw new Error("Method not implemented.");
	}

	public async loadChildrenFromApi<T>(): Promise<void> {
		
	}

	public async loadStatsFromApi<T>(): Promise<void> {
		
	}
}
