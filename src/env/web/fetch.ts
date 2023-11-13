const fetch = globalThis.fetch;
export { fetch, fetch as insecureFetch };
import type { HttpsProxyAgent } from 'https-proxy-agent';

declare global {
	interface RequestInit {
		method?: string;
		agent?: HttpsProxyAgent | undefined;
		body?: BodyInit;
		headers?: HeadersInit;
	}
} 

declare type _BodyInit = BodyInit;
declare type _RequestInit = RequestInit;
declare type _RequestInfo = RequestInfo;
declare type _Response = Response;
declare type _FormData = FormData;
declare type _File = File;
export type { 
	_BodyInit as BodyInit, 
	_RequestInit as RequestInit, 
	_RequestInfo as RequestInfo, 
	_Response as Response, 
	_FormData as FormData,
	_File as File
};

export function getProxyAgent(_strictSSL?: boolean): HttpsProxyAgent | undefined {
	return undefined;
}

export async function wrapForForcedInsecureSSL<T>(
	_ignoreSSLErrors: boolean | 'force',
	fetchFn: () => Promise<T> | Thenable<T>,
): Promise<T> {
	return fetchFn();
}