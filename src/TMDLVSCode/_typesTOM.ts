import { ProxyRequest } from "./_types";

export interface TOMProxyRequest extends ProxyRequest { }

export interface TOMProxyBackupLocation {
	file: string;
	dataSourceID: string;
}

export interface TOMProxyBackupRequest extends TOMProxyRequest {
	fileName: string;
	allowOverwrite?: boolean;
	backupRemotePartitions?: boolean;
	locations?: TOMProxyBackupLocation[];
	applyCompression?: boolean;
	password?: string;
}

export interface TOMProxyRestoreRequest extends TOMProxyRequest {
	fileName: string;
	allowOverwrite?: boolean;
	databaseName?: string;
	password?: string;
}

export interface TOMProxyException {
	message: string;
}

export interface TOMProxyBackup {
	backup(): Promise<void>;
}

export interface TOMProxyRestore {
	restore(): Promise<void>;
}