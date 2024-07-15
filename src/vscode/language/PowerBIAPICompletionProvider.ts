import * as vscode from 'vscode';

import { Buffer } from '@env/buffer';

import { ThisExtension } from '../../ThisExtension';
import { Helper } from '../../helpers/Helper';
import { ApiEndpointDetails, PowerBIAPILanguage, SwaggerFile } from './_types';
import { PowerBIApiService } from '../../powerbi/PowerBIApiService';

import { iPowerBIResponseGeneric } from '../../powerbi/_types';
import { PowerBINotebookContext } from '../notebook/PowerBINotebookContext';


/** Supported trigger characters */
const TRIGGER_CHARS = ['/', '%'];

/** sometimes the API is not consistent and Swagger-definition is different from whats returned by the API  */
const LIST_ITEM_OVERWRITE = {
	"refreshId": "requestId",
	"stageOrder": "order"
}

/** black list of properties that are not exposed in the details of the popup
 *  by default all strings > 100 chars are not shown anyway
 */
const DETAILS_BLACKLIST = ["webUrl"];


export class PowerBIAPICompletionProvider implements vscode.CompletionItemProvider {

	static swagger: SwaggerFile;

	constructor(context: vscode.ExtensionContext) {

		const completionProvider = vscode.languages.registerCompletionItemProvider([PowerBIAPILanguage],
			this,
			...TRIGGER_CHARS);

		context.subscriptions.push(completionProvider);
	}

	async loadSwaggerFile(): Promise<void> {
		const swaggerPath = vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', 'API', 'swagger.json');
		const swaggerText = Buffer.from(await vscode.workspace.fs.readFile(swaggerPath)).toString();
		PowerBIAPICompletionProvider.swagger = JSON.parse(swaggerText);
	}

	async getAvailableEndpoints(searchPath: string, method: string = undefined): Promise<ApiEndpointDetails[]> {
		if (method) {
			method = method.toLowerCase();
		}
		ThisExtension.log("Searching for API paths starting with '" + searchPath + "' ...");

		const searchParts = searchPath.split("/");
		let matches: ApiEndpointDetails[] = [];
		let matchesDifferentMethod: ApiEndpointDetails[] = [];
		for (let item of Object.getOwnPropertyNames(PowerBIAPICompletionProvider.swagger.paths)) {

			// within the same path as the typed path 
			if (item.startsWith(searchPath)) {
				const parts = item.split("/");
				// all APIs directly below the current path and all dynamic paths
				if (parts.length == searchParts.length + 1
					// special case for Dataset queryScaleOut which has two fixed parts after the searchPath
					|| (parts.length == searchParts.length + 2 && ["queryScaleOut"].includes(parts[searchParts.length]))
					|| (parts.length > searchParts.length && parts[searchParts.length].startsWith("{"))) {
					for (let m of Object.getOwnPropertyNames(PowerBIAPICompletionProvider.swagger.paths[item])) {
						let itemToAdd = { ...PowerBIAPICompletionProvider.swagger.paths[item][m] };
						if (m && m == method) {
							itemToAdd.path = item;
							itemToAdd.sortText = item;

							if (!method) {
								itemToAdd.methodOverwrite = m;
							}
							matches.push(itemToAdd);
						}
						else {
							itemToAdd.path = item;
							itemToAdd.sortText = 'ZZZ' + item;
							itemToAdd.methodOverwrite = m;
							matchesDifferentMethod.push(itemToAdd);
						}
					}
				}
			}
		}
		ThisExtension.log(`Found ${matches.length} direct matches and ${matchesDifferentMethod.length} indirect matches!`);

		return matches.concat(matchesDifferentMethod);
	}

	async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<vscode.CompletionItem[]> {
		if (context.triggerCharacter == "%" && position.line == 0 && position.character == 1) {
			let apiMagic: vscode.CompletionItem = {
				label: "API",
				insertText: "api",
				commitCharacters: [" "],
				detail: "Power BI REST API",
				documentation: "Execute arbitrary Power BI REST API calls"
			};

			let daxMagic: vscode.CompletionItem = {
				label: "DAX",
				insertText: "dax",
				commitCharacters: [" "],
				detail: "Execute DAX Query",
				documentation: "Execute DAX query against the current dataset",
			};

			let cmdMagic: vscode.CompletionItem = {
				label: "CMD",
				insertText: "cmd",
				commitCharacters: [" "],
				detail: "Notebook Commands",
				documentation: "Set variables in the current notebook",
			};

			let tmslMagic: vscode.CompletionItem = {
				label: "TMSL",
				insertText: "tmsl",
				commitCharacters: [" "],
				detail: "Execute a TMSL command against the current dataset",
				documentation: "Execute a TMSL command against the current dataset",
			};

			return [apiMagic, daxMagic, cmdMagic, tmslMagic];
		}
		else if (context.triggerCharacter == ".") {
			// starting with . for relative path 
			// lookup for api root path of current document
			// this kicks in anyway when the user types the next '/'
		}
		else if (context.triggerCharacter == " ") {
			// starting with ' ' after specifying the method
			// lookup only show valid endpoints
		}
		else if (context.triggerCharacter == "/") {
			try {
				ThisExtension.log("CompletionProvider started!");
				let currentLine = document.lineAt(position.line).text;
				let method = currentLine.split(" ")[0];

				if (method.startsWith('%')) { //when overwriting the API for a specific magic, we only show GET methods
					method = 'GET';
				}
				let currentPath = currentLine.split(" ")[1];

				if (currentPath.startsWith('./')) {
					const nbContext = PowerBINotebookContext.getForUri(document.uri);
					currentPath = Helper.joinPath(`/v1.0/${PowerBIApiService.Org}`, nbContext.apiRootPath, currentPath.slice(2));
				}
				else if (currentPath.startsWith('/') && !currentPath.startsWith('/v1.0')) {
					currentPath = Helper.joinPath(`/v1.0/${PowerBIApiService.Org}`, currentPath);
				}

				// replace multiple slashes with one
				currentPath = currentPath.replace(/\/+/gm, "/");

				// replace guids with placeholders from previous path
				let pathSearch = currentPath.replace(/\/([a-z]*?)\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/gm, "/$1/{$1XXXId}").replace(new RegExp("sXXX", "g"), "");

				let matchingApis = await this.getAvailableEndpoints(pathSearch, method);
				let completionItems: vscode.CompletionItem[] = [];

				for (let api of matchingApis) {
					const nextToken = Helper.trimChar(api.path.slice(pathSearch.length), "/", true).split("/")[0];
					let insertText = nextToken;

					// placeholder for ID of resource
					if (nextToken.startsWith("{") && nextToken.endsWith("}")) {
						ThisExtension.log("Found a placeholder: " + nextToken + " - getting available values from API ...");
						const itemType = nextToken.slice(1, nextToken.length - 1);

						const items: iPowerBIResponseGeneric = await PowerBIApiService.get<iPowerBIResponseGeneric>(currentPath);
						for (let item of items.value) {
							completionItems.push(await this.getCompletionItem(itemType, item));
						}
						break;
					}


					let completionItem: vscode.CompletionItem = {
						label: nextToken,
						insertText: insertText,
						commitCharacters: TRIGGER_CHARS,
						detail: api.summary,
						documentation: api.description,
						sortText: api.sortText
					};

					if (api.methodOverwrite) {
						completionItem.label = api.methodOverwrite.toUpperCase() + " " + completionItem.label;
						completionItem.additionalTextEdits = [vscode.TextEdit.replace(new vscode.Range(position.line, 0, position.line, method.length), api.methodOverwrite.toUpperCase())];
					}

					if (!completionItems.find((item) => item.label == completionItem.label) && nextToken != "/" && nextToken != "") {
						ThisExtension.log("Adding '" + nextToken + "' to completion list! (from '" + api.path + "')");
						completionItems.push(completionItem);
					}

					if (api.parameters && this.showExamples(api.path, currentPath) && api["x-ms-examples"]) {
						let examples = Object.getOwnPropertyNames(api["x-ms-examples"]);
						for (let example of examples) {
							let bodyParameter: string = "";
							if (api["x-ms-examples"][example].parameters && Object.keys(api["x-ms-examples"][example].parameters).length > 0) {
								let urlParameters: string[] = [];
								let exampleInsertText: string = insertText;
								for (let parameter of Object.getOwnPropertyNames(api["x-ms-examples"][example].parameters)) {
									const apiParameter = api.parameters.find((p) => p.name == parameter)

									if (!apiParameter) {
										// sometimes invalid parameters are referenced ?!?
										ThisExtension.log(`Parameter '${parameter}' not found in API definition for endpoint ${api.path}`);
										continue;
									}

									if (apiParameter.in == "path") {
										exampleInsertText = exampleInsertText.replace("{" + parameter + "}", api["x-ms-examples"][example].parameters[parameter]);
									}
									if (apiParameter.in == "query") {
										urlParameters.push(parameter + "=" + api["x-ms-examples"][example].parameters[parameter]);
									}
									if (apiParameter.in == "body") {
										bodyParameter = api["x-ms-examples"][example].parameters[parameter];
									}
								}

								if (urlParameters.length > 0) {
									exampleInsertText = exampleInsertText + "?" + urlParameters.join("&");
								}

								if (bodyParameter != "") {
									exampleInsertText = exampleInsertText + "\n" + JSON.stringify(bodyParameter, null, 4)
								}

								let exampleCompletionItem: vscode.CompletionItem = {
									label: completionItem.label + ": " + example,
									kind: vscode.CompletionItemKind.Snippet,
									insertText: exampleInsertText,
									commitCharacters: TRIGGER_CHARS,
									detail: example,
									sortText: api.sortText,
									additionalTextEdits: completionItem.additionalTextEdits
								};

								if (!completionItems.find((item) => item.insertText == exampleCompletionItem.insertText) && nextToken != "/" && nextToken != "") {
									ThisExtension.log("Adding '" + exampleCompletionItem.label + "' to completion list! (from '" + api.path + "')");

									completionItems.push(exampleCompletionItem);
								}
							}
						}
					}
				}
				ThisExtension.log("Found " + completionItems.length + " completions! (filtered duplicates)");

				if (completionItems.length == 0) {
					completionItems.push({
						label: "No completion items found!",
						insertText: ""
					})
				}
				return completionItems;
			}
			catch (error) {
				ThisExtension.log("ERROR: " + error);
			}
		}

		return [];
	}

	resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
		return undefined;
	}

	async getCompletionItem(itemType: string, apiItem: any): Promise<vscode.CompletionItem> {
		let completionItem = new vscode.CompletionItem("Dummy", vscode.CompletionItemKind.Reference);

		// take the overwritten itemtype or ### which will be later replaced via ??
		const itemTypeOverwrite = LIST_ITEM_OVERWRITE[itemType] ?? "###";

		completionItem.label = apiItem.name ?? apiItem.displayName ?? apiItem[itemTypeOverwrite];
		completionItem.detail = await this.getCompletionItemDetail(apiItem)
		completionItem.insertText = apiItem[itemTypeOverwrite] ?? apiItem.id,
			completionItem.commitCharacters = TRIGGER_CHARS;

		return completionItem;
	}

	async getCompletionItemDetail(apiItem: any): Promise<string> {
		let details = {};
		for (let property of Object.getOwnPropertyNames(apiItem)) {
			if (DETAILS_BLACKLIST.includes(property) || apiItem[property].toString().length > 100) {
				continue
			}
			details[property] = apiItem[property];
		}

		return JSON.stringify(details, null, 4);
	}

	showExamples(apiPath: string, currentPath: string): boolean {
		// remove placeholders from apiPath
		apiPath = apiPath.split("/").slice(0, -1).join("/");
		apiPath = apiPath.replace(/{[a-zA-Z]*?}/g, ".*?");
		// remove placeholders from currentPath
		//currentPath = currentPath.replace(/\/[a-zA-Z0-9]*?\//g, "/XXX/");

		return new RegExp(apiPath).test(currentPath);
	}
}