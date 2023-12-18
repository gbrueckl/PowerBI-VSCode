import * as vscode from 'vscode';

import { ThisExtension } from '../../ThisExtension';
import { Helper } from '../../helpers/Helper';
import { TMDLProxyStreamEntry } from '../../TMDLVSCode/_typesTMDL';
import { TMDLProxy } from '../../TMDLVSCode/TMDLProxy';
import { TMDLFSUri } from './TMDLFSUri';
import { TMDL_EXTENSION, TMDL_SCHEME } from './TMDLFileSystemProvider';
import { TMDLFSServer } from './TMDLFSServer';
import { TMDLFSCache } from './TMDLFSCache';

export type LoadingState =
	"not_loaded" // not loaded yet
	| "loading"  // currently loading
	| "loaded"	//  loaded

export class TMDLFSDatabase {
	databaseName: string;
	streamEntries: TMDLProxyStreamEntry[];
	loadingState: LoadingState;
	server: TMDLFSServer;

	constructor(server: TMDLFSServer, databaseName: string) {
		this.server = server;
		this.databaseName = databaseName;
		this.streamEntries = [];
		this.loadingState = "not_loaded";
	}

	async getStreamEntries(): Promise<TMDLProxyStreamEntry[]> {
		return this.streamEntries;
	}

	async setStreamEntries(value: TMDLProxyStreamEntry[]) {
		this.streamEntries = value;
	}

	async removeStreamEntry(logicalPath: string): Promise<void> {
		this.streamEntries = this.streamEntries.filter((entry) => entry.logicalPath != logicalPath);
	}

	async getStreamEntry(logicalPath: string): Promise<TMDLProxyStreamEntry> {
		if (logicalPath.endsWith(TMDL_EXTENSION)) {
			logicalPath = Helper.cutEnd(logicalPath, TMDL_EXTENSION);
		}
		return (await this.getStreamEntries()).find((entry) => entry.logicalPath == logicalPath);
	}

	async load(): Promise<void> {
		await TMDLProxy.ensureProxy(ThisExtension.extensionContext);

		if (this.loadingState == "not_loaded") {
			this.loadingState = "loading";
			ThisExtension.log(`Loading TMDL database '${this.databaseName}' from server '${this.server.serverName}' ... `);
			
			let stream = await Helper.awaitWithProgress<TMDLProxyStreamEntry[]>(
				`Loading TMDL database '${this.databaseName}' from server '${this.server.serverName}'`,
				TMDLProxy.exportStream(new TMDLFSUri(vscode.Uri.parse(`${TMDL_SCHEME}:/powerbi/${this.server.serverName}/${this.databaseName}`))),
				1000);
			if (stream) {
				this.streamEntries = stream;
				ThisExtension.log(`TMDL database '${this.databaseName}' loaded!`);
				this.loadingState = "loaded";

				vscode.commands.executeCommand(
					"setContext",
					"powerbi.tmdl.loadedDatabases",
					TMDLFSCache.getLoadedDatabaseURIs()
				);
			}
			else {
				this.loadingState = "not_loaded";
				ThisExtension.log(`Failed to load TMDL database '${this.databaseName}'!`);
			}
		}
		else if (this.loadingState == "loading") {
			ThisExtension.logDebug(`TMDL database '${this.databaseName}' is loading in other process - waiting ... `);
			await Helper.awaitCondition(async () => this.loadingState != "loading", 60000, 500);
			ThisExtension.logDebug(`TMDL database '${this.databaseName}' successfully loaded in other process!`);
		}
	}
}
