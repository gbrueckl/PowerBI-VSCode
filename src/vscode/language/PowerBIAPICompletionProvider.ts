import * as vscode from 'vscode';
import { ThisExtension } from '../../ThisExtension';
import { Helper } from '../../helpers/Helper';
import { ApiEndpointDetails, PowerBIAPILanguage, SwaggerFile } from './_types';
import { PowerBIApiService } from '../../powerbi/PowerBIApiService';

import { iPowerResponseGeneric } from '../../powerbi/_types';


/** Supported trigger characters */
const TRIGGER_CHARS = ['/'];

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

	async getAvailableEndpoints(searchPath: string, method?: string): Promise<ApiEndpointDetails[]> {
		if (method) {
			method = method.toLowerCase();
		}
		ThisExtension.log("Searching for API paths starting with '" + searchPath + "' ...");

		let matches: ApiEndpointDetails[] = [];
		for (let item of Object.getOwnPropertyNames(PowerBIAPICompletionProvider.swagger.paths)) {
			if (item.startsWith(searchPath)) {
				for (let m of Object.getOwnPropertyNames(PowerBIAPICompletionProvider.swagger.paths[item])) {
					if (!method || m == method) {
						let itemToAdd = PowerBIAPICompletionProvider.swagger.paths[item][m];
						itemToAdd.path = item;
						matches.push(itemToAdd);
					}
				}
			}
		}
		ThisExtension.log("Found " + matches.length + " matches!");

		return matches;
	}

	async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<vscode.CompletionItem[]> {
		if (context.triggerCharacter == "/") {
			try {
				ThisExtension.log("CompletionProvider started!");
				let currentLine = document.lineAt(position.line).text;
				const method = currentLine.split(" ")[0];
				let currentPath = currentLine.split(" ")[1];

				if (currentPath.startsWith('./')) {
					// TODO not yet working as we dont know the relative path - maybe get it from document?
					currentPath = Helper.joinPath("", currentPath.slice(2));
				}
				else if (currentPath.startsWith('/') && !currentPath.startsWith('/v1.0')) {
					currentPath = Helper.joinPath(`/v1.0/${PowerBIApiService.Org}`, currentPath);
				}

				// replace guids with placeholders from previous path
				let pathSearch = currentPath.replace(/\/([a-z]*?)\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/gm, "/$1/{$1XXXId}").replace(new RegExp("sXXX", "g"), "");

				let matchingApis = await this.getAvailableEndpoints(pathSearch, method);
				let completionItems: vscode.CompletionItem[] = [];

				for (let api of matchingApis) {
					const nextToken = Helper.trimChar(api.path.slice(pathSearch.length), "/", true).split("/")[0];
					let insertText = nextToken;

					// placeholder for ID of resource
					if (nextToken.startsWith("{") && nextToken.endsWith("}")) {
						const itemType = nextToken.slice(1, nextToken.length - 1);

						const items: iPowerResponseGeneric = await PowerBIApiService.get<iPowerResponseGeneric>(currentPath);
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
						documentation: api.description
					};

					if (!completionItems.find((item) => item.label == completionItem.label) && nextToken != "/" && nextToken != "") {
						ThisExtension.log("Adding '" + nextToken + "' to completion list! (from '" + api.path + "')");
						completionItems.push(completionItem);
					}

					if (api.parameters && this.showExamples(api.path, currentPath)) {
						let bodyParameter = api.parameters?.find((p) => p.in == "body");
						if (bodyParameter) {
							let examples = Object.getOwnPropertyNames(api["x-ms-examples"]);
							for (let example of examples) {
								let exampleBody = api["x-ms-examples"][example].parameters[bodyParameter.name];

								let completionItem: vscode.CompletionItem = {
									label: nextToken + ": " + example,
									kind: vscode.CompletionItemKind.Snippet,
									insertText: insertText + "\n" + JSON.stringify(exampleBody, null, 4),
									commitCharacters: TRIGGER_CHARS,
									detail: example
								};

								completionItems.push(completionItem);
							}
						}
					}
				}
				ThisExtension.log("Found " + completionItems.length + " completions! (filtered duplicates)");

				return completionItems;
			}
			catch (error) {
				ThisExtension.log("ERROR: " + error);
			}
		}
		else if (context.triggerCharacter == ".") {
			// starting with . for relative path 
			// lookup for api root path of current document
		}
		else if (context.triggerCharacter == " ") {
			// starting with ' ' after specifying the method
			// lookup only show valid endpoints
		}
		return [];
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