import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';
import { iFabricApiItemPart } from '../../../fabric/_types';
import { FabricFSItem } from './FabricFSItem';
import { LoadingState } from './_types';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricFSUri } from './FabricFSUri';

export class FabricFSItemPartFile extends FabricFSCacheItem implements iFabricApiItemPart{
	path: string;
	payload: string;
	payloadType: string;

	item: FabricFSItem;

	loadingState: LoadingState;

	constructor(uri: FabricFSUri, definition: iFabricApiItemPart) {
		super(uri);

		this.path = definition.path;
		this.payload = definition.payload;
		this.payloadType = definition.payloadType;
	}

	public async loadStatsFromApi<T>(): Promise<void> {
		this._stats = {
			type: vscode.FileType.File,
			ctime: undefined,
			mtime: undefined,
			size: undefined
		};
	}

	setPayload(payload: string, payloadType: string): void {
		this.payload = payload;
		this.payloadType = payloadType;
	}

	forApi(): iFabricApiItemPart {
		return {
			path: this.path,
			payload: this.payload,
			payloadType: this.payloadType
		};
	}
}