import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { LoadingState } from '../TMDLFSDatabase';
import { FabricFSUri, FabricUriType } from './FabricFSUri';
import { Helper } from '../../../helpers/Helper';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { FabricFSCache } from './FabricFSCache';
import { FabricFSPublishAction } from './_types';

export class FabricFSCacheItem {

	protected _uri: FabricFSUri;
	protected _loadingStateStats: LoadingState = "not_loaded";
	protected _loadingStateChildren: LoadingState = "not_loaded";
	protected _stats: vscode.FileStat | undefined;
	protected _children: [string, vscode.FileType][] | undefined;
	protected _content: Uint8Array | undefined;
	protected _apiResponse: any;
	protected _isLocalOnly: boolean = false;
	protected _publishAction: FabricFSPublishAction
	protected _parent: FabricFSCacheItem;

	constructor(uri: FabricFSUri) {
		this._uri = uri;
		this._loadingStateStats = "not_loaded";
		this._loadingStateChildren = "not_loaded";
	}

	public initializeEmpty(apiResponse: any = undefined): void {
		this._loadingStateStats = "loaded";
		this._stats = {
			type: vscode.FileType.Directory,
			ctime: undefined,
			mtime: undefined,
			size: undefined
		};

		this._loadingStateChildren = "loaded";
		this._children = [];

		this._apiResponse = apiResponse;
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

	get publishAction(): FabricFSPublishAction {
		return this._publishAction;
	}

	set publishAction(value: FabricFSPublishAction) {
		this._publishAction = value;
	}

	get parent(): FabricFSCacheItem {
		return FabricFSCache.getCacheItem(new FabricFSUri(Helper.parentUri(this.uri)));
	}

	public async stats(): Promise<vscode.FileStat | undefined> {
		if (this.loadingStateStats == "not_loaded") {
			this.loadingStateStats = "loading";

			ThisExtension.log(`Loading Fabric URI Stats ${this.FabricUri.uri.toString()} ...`);
			const initialized = await FabricApiService.Initialization();
			if (initialized) {
				await this.loadStatsFromApi();
				this.loadingStateStats = "loaded";
			}
			else {
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
			if (initialized) {
				await this.loadChildrenFromApi();
				this.loadingStateChildren = "loaded";
			}
			else {
				this.loadingStateChildren = "not_loaded";
			}
		}
		else if (this.loadingStateChildren == "loading") {
			ThisExtension.logDebug(`Fabric URI Children for ${this.FabricUri.uri.toString()} are loading in other process - waiting ... `);
			await Helper.awaitCondition(async () => this.loadingStateChildren != "loading", 10000, 500);

			// @ts-ignore TS does not know that 'this.loadingStateChildren' is changed by the async call above
			if (this.loadingStateChildren == "loaded") {
				ThisExtension.logDebug(`Fabric URI Children for ${this.FabricUri.uri.toString()} successfully loaded in other process!`);
			}
			else {
				ThisExtension.logDebug(`Fabric URI Children for ${this.FabricUri.uri.toString()} failed to load in other process within 10 secons!`);
				ThisExtension.logDebug(`Resetting loading state to 'not_loaded' ... `);
				this.loadingStateChildren = "not_loaded";
			}
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

	public addChild(name: string, type: vscode.FileType): void {
		if (!this._children) {
			this._children = [];
		}
		this._children.push([name, type]);
	}

	public removeChild(name: string): void {
		if (this._children) {
			this._children = this._children.filter((value) => value[0] != name);
		}
	}
}
