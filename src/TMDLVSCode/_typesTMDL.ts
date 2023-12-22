import { ProxyRequest } from "./_types";

export interface TMDLProxyRequest extends ProxyRequest { }

export interface TMDLProxyData extends TMDLProxyRequest, TMDLProxyDataValidation { }

export interface TMDLProxyDataException {
	path?: string;
	lineNumber?: number;
	lineText?: string;
	message: string;
}

export interface TMDLProxyDataValidation {
	localPath?: string;
	streamEntries?: TMDLProxyStreamEntry[];
}

export interface TMDLProxyServer {
	name: string;
	id?: string;
	databases: Map<string, TMDLProxyStreamEntry[]>;
}

export interface TMDLProxyStreamEntry {
	logicalPath: string;
	content: string;
	size: number;
}