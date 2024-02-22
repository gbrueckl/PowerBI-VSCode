import * as vscode from 'vscode';

import { Helper } from '../../../helpers/Helper';
import { FABRIC_SCHEME } from './FabricFileSystemProvider';
import { FabricApiItemType } from '../../../fabric/_types';
import { ThisExtension } from '../../../ThisExtension';
import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricFSWorkspace } from './FabricFSWorkspace';
import { FabricFSItemType } from './FabricFSItemType';
import { FabricFSItem } from './FabricFSItem';
import { FabricFSRoot } from './FabricFSRoot';

// regex with a very basic check for valid GUIDs
const REGEX_FABRIC_URI = /fabric:\/\/(?<workspace>[0-9a-fA-F-]{36})?(\/(?<itemType>[a-zA-Z]*))?(\/(?<Item>[0-9a-fA-F-]{36}))?(\/(?<part>.*))?($|\?)/gm

export enum FabricUriType {
	root = 1,
	workspace = 2,
	itemType = 3,
	item = 4,
	part = 5
}

export class FabricFSUri {
	private static _workspaceNameIdMap: Map<string, string> = new Map<string, string>();
	private static _itemNameIdMap: Map<string, string> = new Map<string, string>();

	uri: vscode.Uri;
	isValid: boolean;
	workspace?: string;
	itemType?: FabricApiItemType;
	item?: string;
	part: string;

	/*
	fabric:/<workspace-id>/<itemType>/<item-id>/<partFolder/partfolder/partFile>
	*/
	constructor(uri: vscode.Uri) {
		let match: RegExpExecArray;

		this.uri = uri;
		this.isValid = false;

		let uriString = uri.toString();

		if (uriString.startsWith(FABRIC_SCHEME + ":/")) {
			let paths = uriString.split("/").filter((path) => path.length > 0).slice(1);
			this.isValid = true;
			this.workspace = paths[0];
			this.itemType = FabricApiItemType.fromString(paths[1]);
			this.item = paths[2];
			this.part = paths.slice(3).join("/");

			return
		}

		ThisExtension.log(`Fabric URI '${uri.toString()}' does not match pattern ${REGEX_FABRIC_URI}!`);

		throw vscode.FileSystemError.Unavailable("Invalid Fabric URI!");
	}

	get workspaceId(): string {
		if(Helper.isGuid(this.workspace)) return this.workspace;

		return FabricFSUri._workspaceNameIdMap.get(this.workspace);
	}

	get itemId(): string {
		if(Helper.isGuid(this.item)) return this.item;

		const itemName = `${this.workspaceId}/${this.itemTypeText}/${this.item}`
		return FabricFSUri._itemNameIdMap.get(itemName);
	}

	get itemTypeText(): string {
		return FabricApiItemType[this.itemType];
	}

	public static addWorkspaceNameIdMap(workspaceName: string, workspaceId: string): void {
		FabricFSUri._workspaceNameIdMap.set(workspaceName, workspaceId);
	}

	public static addItemNameIdMap(itemName: string, itemId: string): void {
		FabricFSUri._itemNameIdMap.set(itemName, itemId);
	}
	
	private constructor_regex(uri: vscode.Uri) {
		let match: RegExpExecArray;

		this.uri = uri;
		this.isValid = false;

		match = REGEX_FABRIC_URI.exec(Helper.trimChar(uri.toString(), "/"));

		if (match) {
			this.isValid = true;
			this.workspace = match.groups["workspace"];
			this.itemType = FabricApiItemType.fromString(match.groups["itemType"]);
			this.item = match.groups["item"];
			this.part = match.groups["part"];

			return
		}

		ThisExtension.log(`Fabric URI '${uri.toString()}' does not match pattern ${REGEX_FABRIC_URI}!`);

		throw vscode.FileSystemError.Unavailable("Invalid Fabric URI!");
	}

	static async getInstance(uri: vscode.Uri): Promise<FabricFSUri> {
		if (FabricFSUri.isVSCodeInternalURI(uri)) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		const fabricUri = new FabricFSUri(uri);

		return fabricUri;
	}

	static isVSCodeInternalURI(uri: vscode.Uri = undefined): boolean {
		if (uri.path.includes('/.') // any hidden files/folders
			|| uri.path.endsWith("/pom.xml")
			|| uri.path.endsWith("/node_modules")
			|| uri.path.endsWith("AndroidManifest.xml")) {
			return true;
		}
		return false;
	}

	get uriType(): FabricUriType {
		if (!this.workspace) {
			return FabricUriType.root;
		}
		else if (this.workspace && !this.itemType) {
			return FabricUriType.workspace;
		}
		else if (this.itemType && !this.item) {
			return FabricUriType.itemType;
		}
		else if (this.item && !this.part) {
			return FabricUriType.item;
		}
		else if (this.part) {
			return FabricUriType.part;
		}
		else {
			throw vscode.FileSystemError.Unavailable("Invalid Fabric URI!" + this.uri.toString());
		}
	}

	async getCacheItem(): Promise<FabricFSCacheItem> {
		switch (this.uriType) {
			case FabricUriType.root:
				return new FabricFSRoot(this);
			case FabricUriType.workspace:
				return new FabricFSWorkspace(this);
			case FabricUriType.itemType:
				return new FabricFSItemType(this);
			case FabricUriType.item:
				return new FabricFSItem(this);
			case FabricUriType.part:
				return new FabricFSItem(this.fabricItemUri);
		}
	}

	get cacheItemKey(): string {
		if(this.uriType == FabricUriType.part)
		{
			return this.fabricItemUri.cacheItemKey;
		}
		return this.uri.toString().replace("//", "/");
	}

	get fabricItemUri(): FabricFSUri {
		// fabric://<workspace-id>/<itemType>/<item-id>/<part1/part2/part3> to fabric://<workspace-id>/<itemType>/<item-id>
		let uri = vscode.Uri.parse(this.uri.toString().split("/").filter((path) => path.length > 0).slice(undefined, 4).join("/"));
		return new FabricFSUri(uri);
	}
}