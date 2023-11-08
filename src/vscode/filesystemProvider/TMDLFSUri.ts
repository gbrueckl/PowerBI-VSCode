import * as vscode from 'vscode';

import { Helper } from '../../helpers/Helper';
import { TMDLProxyStreamEntry} from '../../TMDLVSCode/_typesTMDL';
import { PowerBIApiService } from '../../powerbi/PowerBIApiService';
import { TMDL_EXTENSION, TMDL_SCHEME } from './TMDLFileSystemProvider';
import { TMDLFSCache } from './TMDLFSCache';

export class TMDLFSUri {
	uri: vscode.Uri;
	modelId: string;
	serverType: "powerbi" | string;
	workspace: string;
	dataset: string;
	logicalPath: string;

	constructor(uri: vscode.Uri) {
		let match: RegExpExecArray;

		this.uri = uri;

		const databasePattern = /^\/(?<serverType>[^\/]*)\/(?<workspace>[^\/]*)(\/)?$/gm;
		match = databasePattern.exec(uri.path);

		if (match) {
			this.serverType = match.groups["serverType"];
			this.workspace = match.groups["workspace"];

			return
		}

		const pathPattern = /\/(?<serverType>[^\/]*)\/(?<workspace>[^\/]*)(\/(?<dataset>[^\/]*)(?<logicalPath>.*))?/gm;
		match = pathPattern.exec(uri.path);

		if (match) {
			this.serverType = match.groups["serverType"];
			this.workspace = match.groups["workspace"];
			this.dataset = match.groups["dataset"];
			this.modelId = `${this.workspace}/${this.dataset}`;
			this.logicalPath = "." + Helper.cutEnd(match.groups["logicalPath"], TMDL_EXTENSION);

			return;
		}

		throw vscode.FileSystemError.Unavailable("Invalid TMDL URI!");
	}

	static async getInstance(uri: vscode.Uri, awaitModel: boolean = false): Promise<TMDLFSUri> {
		const tmdlUri = new TMDLFSUri(uri);

		if (tmdlUri.isVSCodeInternalURI) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		return tmdlUri;
	}

	get isVSCodeInternalURI(): boolean {
		if (this.uri.path.includes('/.') // any hidden files/folders
			|| this.uri.path.endsWith("/pom.xml")
			|| this.uri.path.endsWith("/node_modules")
			|| this.uri.path.endsWith("AndroidManifest.xml")) {
			return true;
		}
		return false;
	}

	async getStreamEntries(): Promise<TMDLProxyStreamEntry[]> {
		const database = await TMDLFSCache.getDatabase(this.server, this.database);
		let entries = database.getStreamEntries()
		if (!entries) {
			return [];
		}
		return entries;
	}

	async setStreamEntries(value: TMDLProxyStreamEntry[]) {
		const database = await TMDLFSCache.getDatabase(this.server, this.database);
		database.setStreamEntries(value);
	}

	async getStreamEntry(): Promise<TMDLProxyStreamEntry> {
		const database = await TMDLFSCache.getDatabase(this.server, this.database);
		let entryPath = this.logicalPath;
		if (entryPath.endsWith(TMDL_EXTENSION)) {
			entryPath = Helper.cutEnd(entryPath, TMDL_EXTENSION);
		}
		return database.getStreamEntry(entryPath);
	}

	async removeStreamEntry(): Promise<void> {
		const database = await TMDLFSCache.getDatabase(this.server, this.database);
		let entryPath = this.logicalPath;
		if (entryPath.endsWith(TMDL_EXTENSION)) {
			entryPath = Helper.cutEnd(entryPath, TMDL_EXTENSION);
		}
		database.removeStreamEntry(entryPath);
	}

	get XMLAConnectionString(): string {
		const connectionString = PowerBIApiService.getXmlaConnectionString(this.workspace, this.database).toString();

		return connectionString;
	}

	get TMDLRootUri(): TMDLFSUri {
		return new TMDLFSUri(vscode.Uri.parse(`${TMDL_SCHEME}:/${this.serverType}/${this.workspace}/${this.dataset}`));
	}

	get isServerLevel(): boolean {
		return Helper.trimChar(this.uri.path, '/').split('/').length == 2;
	}

	get server(): string {
		return this.workspace;
	}

	get database(): string {
		return this.dataset;
	}
}