import { ProxyRequest } from "./_types";

export interface TMSLProxyRequest extends ProxyRequest { }

export interface TMSLProxyExecuteRequest extends TMSLProxyRequest {
	command: string;
	analyzeImpactOnly?: boolean;
}

export interface TMSLProxyException {
	message: string;
}

export interface TMSLProxyExecuteResponse {
	message: string;
	exception?: TMSLProxyException;
}