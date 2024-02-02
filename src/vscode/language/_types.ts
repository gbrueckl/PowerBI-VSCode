import * as vscode from 'vscode';

export const PowerBIAPILanguage: string = 'powerbi-api';

interface KeyValuePair<T> {
	[key: string]: T;
}

export interface ApiEndpointDetails {
	path: string;
	tags: string[];
	summary: string;
	description: string;
	operationId: string;
	consumes: string[];
	produces: string[];
	parameters: any[];
	responses: any;
	deprecated: boolean;
	sortText: string;
	methodOverwrite: string;
}

export interface ApiEndpointParameter {
	name: string;
	in: "body" | "path";
	description: string;
	required: boolean;
}

export interface SwaggerFile {
	swagger: string;
	info: { 
		version: string;
		title: string;
	};
	host: string;
	schemes: string[];
	consumes: string[];
	produces: string[];
	paths: KeyValuePair<KeyValuePair<ApiEndpointDetails>>;
	definitions: {[key: string]: any};
	parameters: {[key: string]: any};
	responses: {[key: string]: any};
	security: any[];
	tags: any[];
}

