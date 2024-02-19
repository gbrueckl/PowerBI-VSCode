import * as vscode from 'vscode';

import { ThisExtension } from '../../../ThisExtension';
import { Helper } from '../../../helpers/Helper';
import { iFabricItemPart } from '../../../fabric/_types';
import { FabricFSItem } from './FabricFSItem';
import { LoadingState } from './_types';
import { FabricApiService } from '../../../fabric/FabricAPIService';

export class FabricFSItemPart implements iFabricItemPart{
	path: string;
	payload: string;
	payloadType: string;

	item: FabricFSItem;

	loadingState: LoadingState;

	constructor(item: FabricFSItem, path: string) {
		this.item = item;
		this.path = path;

		this.loadingState = "not_loaded";
	}

	setPayload(payload: string, payloadType: string): void {
		this.payload = payload;
		this.payloadType = payloadType;
	}

	forApi(): iFabricItemPart {
		return {
			path: this.path,
			payload: this.payload,
			payloadType: this.payloadType
		};
	}
}