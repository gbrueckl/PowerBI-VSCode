export interface TMDLProxyServer {
	name: string;
	id?: string;
	databases: Map<string, TMDLProxyStreamEntry[]>;
}

export interface TMDLProxyData {
	connectionString: string;
	vscodeAccessToken?: string;
	localPath?: string;
	streamEntries?: TMDLProxyStreamEntry[];
}

export interface TMDLProxyDataException {
	success: boolean;
	path?: string;
	lineNumber?: number;
	lineText?: string;
	message: string;
}

export interface TMDLProxyDataValidation {
	localPath?: string;
	streamEntries?: TMDLProxyStreamEntry[];
}

export interface TMDLProxyStreamEntry {
	logicalPath: string;
	content: string;
	size: number;
}