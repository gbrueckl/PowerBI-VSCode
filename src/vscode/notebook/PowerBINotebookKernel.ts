import * as vscode from 'vscode';

import { ThisExtension } from '../../ThisExtension';
import { Helper } from '../../helpers/Helper';
import { iPowerBIDatasetExecuteQueries } from '../../powerbi/DatasetsAPI/_types';
import { PowerBIApiService } from '../../powerbi/PowerBIApiService';
import { QueryLanguage } from './_types';
import { iPowerBIResponseGeneric } from '../../powerbi/_types';
import { PowerBINotebookContext } from './PowerBINotebookContext';
import { TMDLProxy } from '../../TMDLVSCode/TMDLProxy';
import { TMSLProxyExecuteResponse } from '../../TMDLVSCode/_typesTMSL';
import { FabricApiService } from '../../fabric/FabricApiService';
import { iFabricApiResponse } from '../../fabric/_types';


export type NotebookMagic =
	"dax"
	| "api"
	| "cmd"
	| "tmsl"
	;

// https://code.visualstudio.com/blogs/2021/11/08/custom-notebooks
export class PowerBINotebookKernel implements vscode.NotebookController {
	private static baseId: string = 'powerbi-';
	private static _instance: PowerBINotebookKernel;

	readonly notebookType: string = 'powerbi-notebook';
	readonly label: string;
	readonly supportedLanguages = ["powerbi-api", "dax", "tmsl"]; // any for now, should be DAX, M, ... in the future
	readonly supportsExecutionOrder: boolean = true;

	private _controller: vscode.NotebookController;
	private _executionOrder: number;

	constructor() {
		//this._apiRootPath = `v1.0/${PowerBIApiService.Org}/`;
		this.label = "Power BI REST API";

		this._executionOrder = 0;
	}

	static async getInstance(): Promise<PowerBINotebookKernel> {
		if (PowerBINotebookKernel._instance) {
			return PowerBINotebookKernel._instance;
		}

		let kernel = new PowerBINotebookKernel();

		ThisExtension.log("Creating new Power BI kernel '" + kernel.id + "'");
		kernel._controller = vscode.notebooks.createNotebookController(kernel.id, kernel.notebookType, kernel.label);

		kernel._controller.label = kernel.label;
		kernel._controller.supportedLanguages = kernel.supportedLanguages;
		kernel._controller.description = kernel.description;
		kernel._controller.detail = kernel.detail;
		kernel._controller.supportsExecutionOrder = kernel.supportsExecutionOrder;
		kernel._controller.executeHandler = kernel.executeHandler.bind(kernel);
		kernel._controller.dispose = kernel.disposeController.bind(kernel);

		vscode.workspace.onDidOpenNotebookDocument((event) => kernel._onDidOpenNotebookDocument(event));

		ThisExtension.PushDisposable(kernel);

		this._instance = kernel;

		return this._instance;
	}

	async _onDidOpenNotebookDocument(notebook: vscode.NotebookDocument) {
		// set this controller as recommended Kernel for notebooks opened via dbws:/ file system or from or local sync folder
	}

	// #region Cluster-properties
	get id(): string {
		return PowerBINotebookKernel.baseId + "generic";
	}

	// appears next to the label
	get description(): string {
		return "Generic Power BI REST API Kernel";
	}

	// appears below the label
	get detail(): string {
		return undefined;
	}

	get Controller(): vscode.NotebookController {
		return this._controller;
	}

	// #endregion

	async disposeController(): Promise<void> {
	}

	async dispose(): Promise<void> {
		this.Controller.dispose(); // bound to disposeController() above
	}

	public setNotebookContext(notebook: vscode.NotebookDocument, context: PowerBINotebookContext): void {
		PowerBINotebookContext.set(notebook.metadata.guid, context);
	}

	public getNotebookContext(notebook: vscode.NotebookDocument): PowerBINotebookContext {
		return PowerBINotebookContext.get(notebook.metadata.guid);
	}

	createNotebookCellExecution(cell: vscode.NotebookCell): vscode.NotebookCellExecution {
		//throw new Error('Method not implemented.');
		return null;
	}
	interruptHandler?: (notebook: vscode.NotebookDocument) => void | Thenable<void>;
	readonly onDidChangeSelectedNotebooks: vscode.Event<{ readonly notebook: vscode.NotebookDocument; readonly selected: boolean; }>;
	updateNotebookAffinity(notebook: vscode.NotebookDocument, affinity: vscode.NotebookControllerAffinity): void { }

	async executeHandler(cells: vscode.NotebookCell[], notebook: vscode.NotebookDocument, controller: vscode.NotebookController): Promise<void> {
		let context: PowerBINotebookContext = this.getNotebookContext(notebook);

		for (let cell of cells) {
			await this._doExecution(cell, context);
			await Helper.delay(10); // Force some delay before executing/queueing the next cell
		}
	}

	private parseCell(cell: vscode.NotebookCell): [QueryLanguage, string, NotebookMagic, string] {
		let cmd: string = cell.document.getText();
		let commandText: string = cmd;

		// default is API
		let language: QueryLanguage = "API";
		let magicText: string = "api";
		let customApi: string = undefined;

		if (cmd[0] == "%") {
			let lines = cmd.split('\n');
			const firstLineTokens = lines[0].split(" ").map(t => t.trim()).filter(t => t != "");
			magicText = firstLineTokens[0].slice(1).toLowerCase();
			customApi = firstLineTokens[1];
			commandText = lines.slice(1).join('\n');
			if (["dax"].includes(magicText)) {
				language = magicText as QueryLanguage;
			}
			else if (["api"].includes(magicText)) {
				language = magicText as QueryLanguage;
			}
			else if (["cmd"].includes(magicText)) {
				language = magicText as QueryLanguage;
			}
			else if (["tmsl"].includes(magicText)) {
				language = magicText as QueryLanguage;
			}
			else {
				throw new Error("Invalid magic! only %dax, %api and %cmd are supported");
			}
		}
		else {
			const cmdCompare = cmd.toUpperCase().trim();
			if (cmdCompare.startsWith("EVALUATE") || cmdCompare.startsWith("DEFINE")) {
				magicText = "dax";
				language = "DAX";
			}
			if (cmdCompare.startsWith("SET")) {
				magicText = "cmd";
				language = "CMD";
			}
			if (cmdCompare.startsWith("{") && cmdCompare.endsWith("}")) {
				magicText = "tmsl";
				language = "TMSL";
			}
		}

		return [language, commandText, magicText as NotebookMagic, customApi];
	}

	private resolveRelativePath(endpoint: string, apiRootPath: string): string {
		if (!endpoint) {
			return apiRootPath;
		}
		if (endpoint.startsWith('./')) {
			endpoint = Helper.trimChar(Helper.joinPath(apiRootPath, endpoint.slice(2)), "/");
		}

		return endpoint;
	}

	private parseCommandText(commandText: string, context: PowerBINotebookContext): string {
		let lines = commandText.split("\n");
		let linesWithoutComments = lines.filter(l => !l.trim().startsWith("#") && !l.trim().startsWith("//") && !l.trim().startsWith("--/"));
		let commandTextClean = linesWithoutComments.join("\n");

		for (let variable in context.variables) {
			commandTextClean = commandTextClean.replace(new RegExp(`\\$\\(${variable}\\)`, "gi"), context.variables[variable]);
		}

		return commandTextClean;
	}

	private async _doExecution(cell: vscode.NotebookCell, context: PowerBINotebookContext): Promise<void> {
		const execution = this.Controller.createNotebookCellExecution(cell);
		execution.executionOrder = ++this._executionOrder;
		execution.start(Date.now());
		execution.clearOutput();

		// wrap a try/catch around the whole execution to make sure we never get stuck
		try {
			let commandText: string = cell.document.getText();
			let magic: NotebookMagic = null;
			let language: QueryLanguage = null;
			let customApi: string = null;

			[language, commandText, magic, customApi] = this.parseCell(cell);

			ThisExtension.log("Executing " + language + ":\n" + commandText);

			const commandTextClean = this.parseCommandText(commandText, context);
			customApi = this.resolveRelativePath(customApi, context.apiRootPath);

			let result: iPowerBIDatasetExecuteQueries | iPowerBIResponseGeneric | TMSLProxyExecuteResponse = undefined;
			switch (magic) {
				case "tmsl":
					result = await TMDLProxy.executeTMSL(await TMDLProxy.getServerNameFromAPI(customApi), commandTextClean);
					break;
				case "dax":
					result = await PowerBIApiService.executeQueries(customApi, commandTextClean);
					break;
				case "api":

					const parseRegEx = /(?<method>.+?)\s+(?<endpoint>.+?)\s*(?<body>{.*})?\s*$/s;
					const match = commandTextClean.match(parseRegEx);
					let method = match.groups["method"].trim().toUpperCase();
					let endpoint = match.groups["endpoint"].trim();
					let bodyString = match.groups["body"];

					let body = undefined;
					if (bodyString) {
						body = JSON.parse(bodyString);
					}

					endpoint = this.resolveRelativePath(endpoint, customApi);

					const useFabricApi = endpoint.includes("api.fabric.microsoft.com") || endpoint.includes("/workspaces/");
					let fabricResult: iFabricApiResponse<any>;

					switch (method) {
						case "GET":
							if (useFabricApi) {
								fabricResult = (await FabricApiService.get<any>(endpoint, body));
							}
							else {
								result = await PowerBIApiService.get<any>(endpoint, body, true);
							}
							break;

						case "POST":
							if (useFabricApi) {
								fabricResult = (await FabricApiService.post<any>(endpoint, body));
							}
							else {
								result = await PowerBIApiService.post<any>(endpoint, body, true);
							}
							break;

						case "PUT":
							if (useFabricApi) {
								fabricResult = (await FabricApiService.put<any>(endpoint, body));
							}
							else {
								result = await PowerBIApiService.put<any>(endpoint, body, true);
							}
							break;

						case "PATCH":
							if (useFabricApi) {
								fabricResult = (await FabricApiService.patch<any>(endpoint, body));
							}
							else {
								result = await PowerBIApiService.patch<any>(endpoint, body, true);
							}
							break;

						case "DELETE":
							if (useFabricApi) {
								fabricResult = (await FabricApiService.delete<any>(endpoint, body));
							}
							else {
								result = await PowerBIApiService.delete<any>(endpoint, body, true);
							}
							break;

						default:
							execution.appendOutput(new vscode.NotebookCellOutput([
								vscode.NotebookCellOutputItem.text("Only GET, POST, PUT, PATCH and DELETE are supported.")
							]));

							execution.end(false, Date.now());
							return;
					}

					if(useFabricApi) {
						if(fabricResult.error) {
						throw new Error(fabricResult.error.message);
						}
						else {
							// mimic a Power BI Response structure
							result = {
								"odata.context": "FabricAPI",
								"value": fabricResult.success
							};
						}
					}
					break;
				case "cmd":
					const regex = /SET\s*(?<variable>[^=]*)(\s*=\s*(?<value>.*))?/i;
					let lines = commandTextClean.split("\n")
					for (let line of lines) {
						let match = regex.exec(line.trim());

						if (!match || !match.groups || !match.groups.variable) {
							execution.appendOutput(new vscode.NotebookCellOutput([
								vscode.NotebookCellOutputItem.text(`Invalid format for %cmd magic in line '${line}'. \nPlease use format \nSET variable=value.`)
							]));

							execution.end(false, Date.now());
							return;
						}
						const varName = match.groups.variable.trim().toUpperCase();
						if (match.groups.variable && match.groups.value) {
							const varValue = match.groups.value.trim();
							context.setVariable(varName, varValue);

							execution.appendOutput(new vscode.NotebookCellOutput([
								vscode.NotebookCellOutputItem.text(`Set variable ${varName} to '${varValue}'`),
							]));
						}
						else {
							const value = context.getVariable(varName);

							execution.appendOutput(new vscode.NotebookCellOutput([
								vscode.NotebookCellOutputItem.text(`${varName} = ${value}`),
							]));
						}
					}

					execution.end(true, Date.now());
					return;
				default:
					execution.appendOutput(new vscode.NotebookCellOutput([
						vscode.NotebookCellOutputItem.text("Only %dax, %api and %cmd magics are supported."),
					]));

					execution.end(false, Date.now());
					return;
			}

			execution.token.onCancellationRequested(() => {
				execution.appendOutput(new vscode.NotebookCellOutput([
					vscode.NotebookCellOutputItem.text("Execution cancelled!", 'text/plain'),
				]));

				execution.end(false, Date.now());
				return;
			});

			if (magic == "tmsl") {
				result = result as TMSLProxyExecuteResponse;
				if (result.exception) {
					execution.appendOutput(new vscode.NotebookCellOutput([
						vscode.NotebookCellOutputItem.text(result.exception.message, 'text/plain'),
					]));

					execution.end(false, Date.now());
					return;
				}
				else if (result.message) {
					execution.appendOutput(new vscode.NotebookCellOutput([
						vscode.NotebookCellOutputItem.text(result.message, 'text/plain'),
					]));

					execution.end(true, Date.now());
				}
			}
			else if (magic == "dax") {
				result = result as iPowerBIDatasetExecuteQueries;
				if (result.error) {
					execution.appendOutput(new vscode.NotebookCellOutput([
						vscode.NotebookCellOutputItem.text(JSON.stringify(result, undefined, 4)),
					]));

					execution.end(false, Date.now());
					return;
				}
				if (result.results) {
					let rows = result.results[0].tables[0].rows;

					// remove table name and square brackets from final result
					for (let row of rows) {
						for (const old_key of Object.keys(row)) {
							const new_key = old_key.replace(/.*?\[(.*?)\]/, "$1")
							if (old_key !== new_key) {
								Object.defineProperty(row, new_key,
									Object.getOwnPropertyDescriptor(row, old_key));
								delete row[old_key];
							}
						}
					}
					let output: vscode.NotebookCellOutput = new vscode.NotebookCellOutput([
						vscode.NotebookCellOutputItem.json(rows, 'application/json'), // to be used by proper JSON/table renderers
						vscode.NotebookCellOutputItem.json(result.results, 'application/powerbi-results') // the original result from databricks including schema and datatypes for more advanced renderers
					])

					let rowcount: number = result.results[0].tables[0].rows.length;
					output.metadata = { row_count: rowcount, truncated: rowcount > 100000 };
					execution.appendOutput(output);

					execution.end(true, Date.now());
				}
			}
			else if (magic == "api") {
				result = result as iPowerBIResponseGeneric;

				let output: vscode.NotebookCellOutput;

				if (result.value) {
					output = new vscode.NotebookCellOutput([
						vscode.NotebookCellOutputItem.json(result.value, 'application/json') // to be used by proper JSON/table renderers
					])
				}
				else {
					output = new vscode.NotebookCellOutput([
						vscode.NotebookCellOutputItem.json(result, 'application/json'), // to be used by proper JSON/table renderers,
						vscode.NotebookCellOutputItem.text(result as any as string, 'text/plain') // to be used by proper JSON/table renderers
					])
				}

				execution.appendOutput(output);
				execution.end(true, Date.now());
			}
		} catch (error) {
			execution.appendOutput(new vscode.NotebookCellOutput([
				vscode.NotebookCellOutputItem.text(error, 'text/plain')
			]));

			execution.end(false, Date.now());
			return;
		}
	}
}
