import * as vscode from 'vscode';
import { ThisExtension } from '../../ThisExtension';
import { Helper } from '../../helpers/Helper';
import { ApiEndpointDetails, PowerBIAPILanguage, SwaggerFile } from './_types';
import { PowerBIApiService } from '../../powerbi/PowerBIApiService';

import { iPowerResponseGeneric } from '../../powerbi/_types';


/** Supported language type */
const triggers = ['/'];

// TODO implement swagger.json
// https://raw.githubusercontent.com/microsoft/PowerBI-CSharp/master/sdk/swaggers/swagger.json

export class PowerBIAPICompletionProvider implements vscode.CompletionItemProvider {

	static swagger: SwaggerFile;

	constructor(context: vscode.ExtensionContext) {

		const completionProvider = vscode.languages.registerCompletionItemProvider([PowerBIAPILanguage],
			this,
			...triggers);

		context.subscriptions.push(completionProvider);
	}

	async loadSwaggerFile(): Promise<void> {
		const swaggerPath = vscode.Uri.joinPath(ThisExtension.rootUri, 'resources', 'API', 'swagger.json');
		const swaggerText = Buffer.from(await vscode.workspace.fs.readFile(swaggerPath)).toString();
		PowerBIAPICompletionProvider.swagger = JSON.parse(swaggerText);
	}

	async getAvailableEndpoints(searchPath: string, method?: string): Promise<ApiEndpointDetails[]> {
		if(method)
		{
			method = method.toLowerCase();
		}
		ThisExtension.log("Searching for API paths starting with '" + searchPath + "' ...");

		let matches: ApiEndpointDetails[] = [];
		for(let item of Object.getOwnPropertyNames(PowerBIAPICompletionProvider.swagger.paths))
		{
			if(item.startsWith(searchPath))
			{
				for(let m of Object.getOwnPropertyNames(PowerBIAPICompletionProvider.swagger.paths[item]))
				{
					if(!method || m == method )
					{
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
				
				// placeholder for ID of resource
				if(nextToken.startsWith("{") && nextToken.endsWith("}")) {
					const items: iPowerResponseGeneric = await PowerBIApiService.get<iPowerResponseGeneric>(currentPath);
					for(let item of items.value) {
						completionItems.push({
							label: item.name,
							detail: item.id,
							insertText: item.id,
							commitCharacters: triggers,
						});
					}
					break;
				}
				let completionItem: vscode.CompletionItem = {
					label: nextToken,
					insertText: nextToken,
					commitCharacters: triggers,
					detail: api.summary,
					documentation: api.description
				};

				if(!completionItems.find((item) => item.label == completionItem.label) && nextToken != "/" && nextToken != "")
				{
					ThisExtension.log("Adding '" + nextToken + "' to completion list! (from '" + api.path + "')");
					completionItems.push(completionItem);
				}
			}
			ThisExtension.log("Found " + completionItems.length + " completions! (filtered duplicates)");

			return completionItems;
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


}