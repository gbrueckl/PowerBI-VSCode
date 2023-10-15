import * as vscode from 'vscode';

import { ThisExtension } from '../../ThisExtension';
import { Helper } from '../../helpers/Helper';
import { TMDLProxy } from '../../TMDLVSCode/TMDLProxy';
import { TMDLFSDatabase } from './TMDLFSDatabase';

export type LoadingState =
	"not_loaded" // not loaded yet
	| "loading"  // currently loading
	| "loaded"	// for server only, if only a specific database has been loaded yet

export class TMDLFSServer {
	serverName: string;
	databases: TMDLFSDatabase[];
	loadingState: LoadingState;

	constructor(serverName: string) {
		this.serverName = serverName;
		this.databases = [];
		this.loadingState = "not_loaded";
	}

	public async getDatabase(databaseName: string, autoLoad: boolean = true): Promise<TMDLFSDatabase> {
		let database = this.databases.find((database) => database.databaseName == databaseName);

		if(!database)
		{
			database = new TMDLFSDatabase(this, databaseName);
			this.databases.push(database);
		}

		if(database.loadingState != "loaded" && autoLoad)
		{
			await database.load();
		}

		return database;
	}

	public setDatabase(database: TMDLFSDatabase): void {
		let db = this.getDatabase(database.databaseName);
		if (!db) {
			this.databases.push(database);
		}
	}

	public removeDatabase(databaseName: string): void {
		this.databases = this.databases.filter((database) => database.databaseName != databaseName);
	}

	async load(): Promise<void> {
		await TMDLProxy.ensureProxy(ThisExtension.extensionContext);

		if (this.loadingState == "not_loaded") {
			this.loadingState = "loading";
			ThisExtension.log(`Loading TMDL Server '${this.serverName}' ... `);
			
			const databases = await TMDLProxy.getDatabases(this.serverName);
			if (databases) {
				for (const database of databases) {
					this.setDatabase(new TMDLFSDatabase(this, database.name));
				}
				this.loadingState = "loaded";
				ThisExtension.log(`TMDL Server '${this.serverName}' loaded!`);
			}
			else {
				this.loadingState = "not_loaded";
				ThisExtension.log(`Failed to load TMDL Database '${this.serverName}'!`);
			}
		}
		else if (this.loadingState == "loading") {
			ThisExtension.logDebug(`Server '${this.serverName}' is loading in other process - waiting ... `);
			await Helper.awaitCondition(async () => this.loadingState != "loading", 60000, 500);
			ThisExtension.logDebug(`Server '${this.serverName}' successfully loaded in other process!`);
		}
	}
}