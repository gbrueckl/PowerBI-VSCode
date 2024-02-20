import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { LoadingState } from '../TMDLFSDatabase';
import { FabricFSUri, FabricUriType } from './FabricFSUri';
import { Helper } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

export class FabricFSCacheItem {
	
	protected _uri: FabricFSUri;
	protected _loadingStateStats: LoadingState = "not_loaded";
	protected _loadingStateChildren: LoadingState = "not_loaded";
	protected _stats: vscode.FileStat | undefined;
	protected _children: [string, vscode.FileType][] | undefined;
	protected _content: Uint8Array | undefined;

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
			let result = await Helper.awaitCondition(async () => PowerBIApiService.isInitialized, 10000, 500);
			await this.loadStatsFromApi();
			this.loadingStateStats = "loaded";
			
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
			let result = await Helper.awaitCondition(async () => PowerBIApiService.isInitialized, 10000, 500);
			await this.loadChildrenFromApi();
			this.loadingStateChildren = "loaded";
			
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
