import * as vscode from 'vscode';

import { ThisExtension } from '../../ThisExtension';
import { Helper } from '../../helpers/Helper';
import { TMDLProxy, TMDLProxyStreamEntry, TMDLProxyServer } from '../../helpers/TMDLProxy';
import { TMDLFSUri } from './TMDLFSUri';
import { TMDL_EXTENSION, TMDL_SCHEME } from './TMDLFileSystemProvider';

export type LoadingState =
	"not_loaded" // not loaded yet
	| "loading"  // currently loading
	| "fully_loaded"	// fully loaded
	| "partially_loaded"	// for server only, if only a specific database has been loaded yet

export class TMDLFSServer {
	serverName: string;
	databases: TMDLFSDatabase[];
	loadingState: LoadingState;

	constructor(serverName: string) {
		this.serverName = serverName;
		this.databases = [];
		this.loadingState = "not_loaded";
	}

	public getDatabase(databaseName: string): TMDLFSDatabase {
		return this.databases.find((database) => database.databaseName == databaseName);
	}

	public setDatabase(databaseName: string, streamEntries: TMDLProxyStreamEntry[]): TMDLFSDatabase {
		let database = this.getDatabase(databaseName);
		if (!database) {
			database = new TMDLFSDatabase(databaseName);
			this.databases.push(database);
		}

		database.streamEntries = streamEntries;

		return database;
	}

	public removeDatabase(databaseName: string): void {
		this.databases = this.databases.filter((database) => database.databaseName != databaseName);
	}
}

export class TMDLFSDatabase {
	databaseName: string;
	streamEntries: TMDLProxyStreamEntry[];
	loadingState: LoadingState;

	constructor(databaseName: string) {
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
}

export class TMDLFSCache implements vscode.Disposable {
	//static loadedModels: Map<string, TMDLProxyStreamEntry[]> = new Map<string, TMDLProxyStreamEntry[]>();
	public static cachedServers: TMDLFSServer[] = [];

	constructor() {
		TMDLFSCache.cachedServers = [];
	}
	dispose() {
		TMDLFSCache.cachedServers = undefined;
	}

	public static getServer(serverName: string): TMDLFSServer {
		return TMDLFSCache.cachedServers.find((server) => server.serverName == serverName);
	}

	public static setServer(serverName: string, databases: TMDLFSDatabase[]): TMDLFSServer {
		let server = TMDLFSCache.getServer(serverName);
		if (!server) {
			server = new TMDLFSServer(serverName);
			TMDLFSCache.cachedServers.push(server);
		}

		server.databases = databases;

		return server;
	}

	public static getDatabase(serverName: string, databaseName: string): TMDLFSDatabase {
		const server = TMDLFSCache.getServer(serverName);

		return server.getDatabase(databaseName);
	}

	public static async loadDatabase(serverName: string, databaseName: string): Promise<void> {
		let server = TMDLFSCache.getServer(serverName);
		if (!server) {
			server = TMDLFSCache.setServer(serverName, []);
		}

		let database = TMDLFSCache.getDatabase(serverName, databaseName);
		if (!database) {
			database = server.setDatabase(databaseName, []);
		}

		if (database.loadingState == "not_loaded") {
			ThisExtension.log(`Loading TMDL database '${database.databaseName}' ... `);
			database.loadingState = "loading";
			let stream = await Helper.awaitWithProgress<TMDLProxyStreamEntry[]>(
				`Loading TMDL database '${database.databaseName}'`,
				TMDLProxy.exportStream(new TMDLFSUri(vscode.Uri.parse(`${TMDL_SCHEME}:/powerbi/${server.serverName}/${database.databaseName}`))),
				1000);
			if (stream) {
				database.streamEntries = stream;
				ThisExtension.log(`TMDL database '${database.databaseName}' loaded!`);
				database.loadingState = "fully_loaded";

				vscode.commands.executeCommand(
					"setContext",
					"powerbi.tmdl.loadedDatabases",
					TMDLFSCache.getLoadedDatabaseURIs()
				);
			}
			else {
				database.loadingState = "not_loaded";
				ThisExtension.log(`Failed to load TMDL database '${database.databaseName}'!`);
			}
		}
		else if (database.loadingState == "loading") {
			ThisExtension.logDebug(`TMDL database '${database.databaseName}' is loading in other process - waiting ... `);
			await Helper.awaitCondition(async () => database.loadingState != "loading", 60000, 500);
			ThisExtension.logDebug(`TMDL database '${database.databaseName}' successfully loaded in other process!`);
		}

		return;
	}

	public static getLoadedDatabaseURIs(): string[] {
		let dbs: string[] = [];
		for (const server of TMDLFSCache.cachedServers) {
			for (const database of server.databases) {
				dbs.push(`/powerbi/${server.serverName}/${database.databaseName}`);
			}
		}
		return dbs;
	}

	public static unloadDatabase(tmdlUri: TMDLFSUri): void {
		let server = TMDLFSCache.getServer(tmdlUri.server);
		if (!server) {
			// server not yet loaded
			return;
		}

		const database = server.getDatabase(tmdlUri.database);
		if (database) {
			server.removeDatabase(database.databaseName);
		}
	}

	public static async loadServer(serverName: string): Promise<void> {
		let server = TMDLFSCache.getServer(serverName);
		if (!server) {
			server = TMDLFSCache.setServer(serverName, []);
		}

		if (server.loadingState == "not_loaded") {
			ThisExtension.log(`Loading TMDL Server '${server.serverName}' ... `);
			server.loadingState = "loading";
			const databases = await TMDLProxy.getDatabasesXMLA(serverName);
			if (databases) {
				for (const database of databases) {
					server.setDatabase(database.name, []);
				}
				server.loadingState = "fully_loaded";
				ThisExtension.log(`TMDL Server '${server.serverName}' loaded!`);
			}
			else {
				server.loadingState = "not_loaded";
				ThisExtension.log(`Failed to load TMDL Database '${server.serverName}'!`);
			}
		}
		else if (server.loadingState == "loading") {
			ThisExtension.logDebug(`Server '${server.serverName}' is loading in other process - waiting ... `);
			await Helper.awaitCondition(async () => server.loadingState != "loading", 60000, 500);
			ThisExtension.logDebug(`Server '${server.serverName}' successfully loaded in other process!`);
		}
	}
}
