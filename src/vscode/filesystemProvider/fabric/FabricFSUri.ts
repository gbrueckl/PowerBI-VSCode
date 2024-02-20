import * as vscode from 'vscode';

import { Helper } from '../../../helpers/Helper';
import { FABRIC_SCHEME } from './FabricFileSystemProvider';
import { FabricApiItemType } from '../../../fabric/_types';
import { FabricFSItemPartFile } from './FabricFSItemPartFile';
import { ThisExtension } from '../../../ThisExtension';
import { FabricFSCacheItem } from './FabricFSCacheItem';
import { FabricFSWorkspace } from './FabricFSWorkspace';
import { FabricFSItemType } from './FabricFSItemType';
import { FabricFSItem } from './FabricFSItem';
import { FabricFSRoot } from './FabricFSRoot';
import { FabricFSItemPartFolder } from './FabricFSItemPartFolder';

// regex with a very basic check for valid GUIDs
const REGEX_FABRIC_URI = /fabric:\/\/(?<workspaceId>[0-9a-fA-F-]{36})?(\/(?<itemType>[a-zA-Z]*))?(\/(?<ItemId>[0-9a-fA-F-]{36}))?(\/(?<part>.*))?($|\?)/gm

export enum FabricUriType {
	"root" = 1,
	"workspace" = 2,
	"itemType" = 3,
	"item" = 4,
	"part" = 5
}

export class FabricFSUri {
	uri: vscode.Uri;
	isValid: boolean;
	workspaceId?: string;
	itemType?: FabricApiItemType;
	itemId?: string;
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
			this.workspaceId = paths[0];
			this.itemType = paths[1] as FabricApiItemType;
			this.itemId = paths[2];
			this.part = paths[3];

			return
		}

		ThisExtension.log(`Fabric URI '${uri.toString()}' does not match pattern ${REGEX_FABRIC_URI}!`);

		throw vscode.FileSystemError.Unavailable("Invalid Fabric URI!");
	}
	constructor2(uri: vscode.Uri) {
		let match: RegExpExecArray;

		this.uri = uri;
		this.isValid = false;

		match = REGEX_FABRIC_URI.exec(Helper.trimChar(uri.toString(), "/"));

		if (match) {
			this.isValid = true;
			this.workspaceId = match.groups["workspaceId"];
			this.itemType = match.groups["itemType"] as FabricApiItemType;
			this.itemId = match.groups["itemId"];
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
		if (!this.workspaceId) {
			return FabricUriType.root;
		}
		else if (this.workspaceId && !this.itemType) {
			return FabricUriType.workspace;
		}
		else if (this.itemType && !this.itemId) {
			return FabricUriType.itemType;
		}
		else if (this.itemId && !this.part) {
			return FabricUriType.item;
		}
		else if (this.part) {
			return FabricUriType.part;
		}
		else {
			throw vscode.FileSystemError.Unavailable("Invalid Fabric URI!" + this.uri.toString());
		}
	}

	getCacheItem(): FabricFSCacheItem {
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
				const partParts = this.part.split("/");
				if (partParts.length == 1) {
					return new FabricFSItemPartFile(this);
				}
				else {
					return new FabricFSItemPartFolder(this);
				}
		}
	}

	getCacheItemKey(): string {
		return this.uri.toString();
	}

	get fabricItemUri(): FabricFSUri {
		let uri = this.uri.with({ path: this.uri.path.split("/").filter((path) => path.length > 0).slice(undefined, 4).join("/") });
		return new FabricFSUri(uri);
	}
}