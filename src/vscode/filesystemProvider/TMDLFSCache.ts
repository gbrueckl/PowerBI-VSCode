import * as vscode from 'vscode';

import { ThisExtension } from '../../ThisExtension';
import { TMDLProxy } from '../../TMDLVSCode/TMDLProxy';
import { TMDLFSUri } from './TMDLFSUri';
import { TMDLFSServer } from './TMDLFSServer';
import { TMDLFSDatabase } from './TMDLFSDatabase';

export abstract class TMDLFSCache {
	//static loadedModels: Map<string, TMDLProxyStreamEntry[]> = new Map<string, TMDLProxyStreamEntry[]>();
	public static cachedServers: TMDLFSServer[] = [];

	public static async getServer(serverName: string, autoLoad: boolean = true): Promise<TMDLFSServer> {
		let server = TMDLFSCache.cachedServers.find((server) => server.serverName == serverName);

		if(!server)
		{
			server = new TMDLFSServer(serverName);
			TMDLFSCache.cachedServers.push(server);
		}

		if(!["fully_loaded", "partially_loaded"].includes(server.loadingState) && autoLoad)
		{
			await server.load();
		}

		return server;
	}

	public static asyncsetServer(server: TMDLFSServer): void {
		let srv = TMDLFSCache.getServer(server.serverName);
		if (!srv) {
			TMDLFSCache.cachedServers.push(new TMDLFSServer(server.serverName));
		}
	}

	public static async getDatabase(serverName: string, databaseName: string): Promise<TMDLFSDatabase> {
		const server = await TMDLFSCache.getServer(serverName, false);

		return await server.getDatabase(databaseName);
	}

	public static async loadDatabase(serverName: string, databaseName: string): Promise<TMDLFSDatabase> {
		await TMDLProxy.ensureProxy(ThisExtension.extensionContext);
		let database = await TMDLFSCache.getDatabase(serverName, databaseName);
		return database;
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

	public static async unloadDatabase(tmdlUri: TMDLFSUri): Promise<void> {
		let server = await TMDLFSCache.getServer(tmdlUri.server, false);
		if (!server) {
			// server not yet loaded
			return;
		}

		const database = await server.getDatabase(tmdlUri.database, false);
		if (database) {
			server.removeDatabase(database.databaseName);
		}
	}

	public static async loadServer(serverName: string): Promise<TMDLFSServer> {
		await TMDLProxy.ensureProxy(ThisExtension.extensionContext);
		let server: TMDLFSServer = await TMDLFSCache.getServer(serverName);
		return server;
	}
}
