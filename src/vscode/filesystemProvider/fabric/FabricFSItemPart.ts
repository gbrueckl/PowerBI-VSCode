import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';
import { iFabricApiItemPart } from '../../../fabric/_types';
import { FabricFSItem } from './FabricFSItem';
import { LoadingState } from './_types';
import { FabricApiService } from '../../../fabric/FabricApiService';
import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricFSUri } from './FabricFSUri';

export class FabricFSItemPart extends FabricFSCacheItem implements iFabricApiItemPart{
	path: string;
	payload: string;
	payloadType: string;

	item: FabricFSItem;

	loadingState: LoadingState;

	constructor(uri: FabricFSUri) {
		super(uri);
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