import * as vscode from 'vscode';

import { ThisExtension } from '../../ThisExtension';
import { Helper } from '../../helpers/Helper';
import { iPowerBIDataset, iPowerBIDatasetExecuteQueries } from '../../powerbi/DatasetsAPI/_types';
import { PowerBIApiService } from '../../powerbi/PowerBIApiService';
import { QueryLanguage } from './_types';
import { PowerBIDataset } from '../treeviews/workspaces/PowerBIDataset';


export type NotebookMagic =
	"dax"
;

export type KernelType =
	"jupyter-notebook"
	| "interactive"

// https://code.visualstudio.com/blogs/2021/11/08/custom-notebooks
export class PowerBIKernel implements vscode.NotebookController {
	private static baseId: string = 'powerbi-';
	private static baseLabel: string = 'PowerBI: ';
	public id: string;
	public label: string;
	readonly notebookType: KernelType;
	readonly description: string = 'Execute queires against a PowerBI Dataset';
	readonly supportedLanguages = []; // any for now, should be DAX, M, ... in the future
	readonly supportsExecutionOrder: boolean = true;

	private _controller: vscode.NotebookController;
	private _executionOrder: number;
	private _executionContexts: Map<string, PowerBIDataset>;
	private _dataset: PowerBIDataset;

	constructor(dataset: PowerBIDataset, notebookType: KernelType = 'jupyter-notebook') {
		this.notebookType = notebookType;
		this._dataset = dataset;
		this.id = PowerBIKernel.getId(dataset, notebookType);
		this.label = PowerBIKernel.getLabel(dataset);

		this._executionOrder = 0;
		this._executionContexts = new Map<string, PowerBIDataset>;

		ThisExtension.log("Creating new " + this.notebookType + " kernel '" + this.id + "'");
		this._controller = vscode.notebooks.createNotebookController(this.id,
			this.notebookType,
			this.label);

		this._controller.supportedLanguages = this.supportedLanguages;
		this._controller.description = this._dataset.id;
		this._controller.detail = this.DatasetDetails;
		this._controller.supportsExecutionOrder = this.supportsExecutionOrder;
		this._controller.executeHandler = this.executeHandler.bind(this);
		this._controller.dispose = this.disposeController.bind(this);

		vscode.workspace.onDidOpenNotebookDocument((event) => this._onDidOpenNotebookDocument(event));

		ThisExtension.PushDisposable(this);
	}

	async _onDidOpenNotebookDocument(notebook: vscode.NotebookDocument) {
		// set this controller as recommended Kernel for notebooks opened via dbws:/ file system or from or local sync folder
	}

	// #region Cluster-properties
	static getId(dataset: PowerBIDataset, kernelType: KernelType) {
		return this.baseId + dataset.id + "-" + kernelType;
	}

	static getLabel(dataset: PowerBIDataset) {
		return this.baseLabel + dataset.name;
	}

	get Controller(): vscode.NotebookController {
		return this._controller;
	}

	get DatasetDetails(): string {
		let details: string = undefined;

		return details;
	}

	// #endregion

	async disposeController(): Promise<void> {
		for (let context of this._executionContexts.entries()) {
			try {
				// nothing to do at the moment as the connection is stateless
			}
			catch (e) { };
		}

		this._executionContexts.clear();
	}

	async dispose(): Promise<void> {
		this.Controller.dispose(); // bound to disposeController() above
	}

	setNotebookContext(notebookUri: vscode.Uri, dataset: PowerBIDataset): void {
		this._executionContexts.set(notebookUri.toString(), dataset);
	}

	getNotebookContext(notebookUri: vscode.Uri): PowerBIDataset {
		let path = notebookUri.toString();
		if (this._executionContexts.has(path)) {
			return this._executionContexts.get(path);
		}
		return undefined;
	}

	

	createNotebookCellExecution(cell: vscode.NotebookCell): vscode.NotebookCellExecution {
		//throw new Error('Method not implemented.');
		return null;
	}
	interruptHandler?: (notebook: vscode.NotebookDocument) => void | Thenable<void>;
	readonly onDidChangeSelectedNotebooks: vscode.Event<{ readonly notebook: vscode.NotebookDocument; readonly selected: boolean; }>;
	updateNotebookAffinity(notebook: vscode.NotebookDocument, affinity: vscode.NotebookControllerAffinity): void { }



	async executeHandler(cells: vscode.NotebookCell[], _notebook: vscode.NotebookDocument, _controller: vscode.NotebookController): Promise<void> {
		let dataset: PowerBIDataset = this.getNotebookContext(_notebook.uri);
		if (!dataset) {
			ThisExtension.setStatusBar("Initializing Kernel ...", true);
			dataset = this._dataset
			this.setNotebookContext(_notebook.uri, dataset);
			ThisExtension.setStatusBar("Kernel initialized!");
		}
		for (let cell of cells) {
			await this._doExecution(cell, dataset);
			await Helper.wait(10); // Force some delay before executing/queueing the next cell
		}
	}

	private parseCommand(cell: vscode.NotebookCell): [QueryLanguage, string, NotebookMagic] {
		let cmd: string = cell.document.getText();
		let magicText: string = undefined;
		let commandText: string = cmd;
		let language: QueryLanguage = "DAX";
		if (cmd[0] == "%") {
			let lines = cmd.split('\n');
			magicText = lines[0].split(" ")[0].slice(1).trim();
			commandText = lines.slice(1).join('\n');
			if (["dax"].includes(magicText)) {
				language = magicText as QueryLanguage;
			}
			else {
				// we can run %pip commands "as-is" using the Python language
				language = "DAX";
				commandText = cmd;
			}
		}
		else
		{
			magicText = "dax";
		}

		return [language, commandText, magicText as NotebookMagic];
	}

	private async _doExecution(cell: vscode.NotebookCell, dataset: PowerBIDataset): Promise<void> {
		const execution = this.Controller.createNotebookCellExecution(cell);
		execution.executionOrder = ++this._executionOrder;
		execution.start(Date.now());
		execution.clearOutput();

		// wrap a try/catch around the whole execution to make sure we never get stuck
		try {
			let commandText: string = cell.document.getText();
			let magic: NotebookMagic = null;
			let language: QueryLanguage = null;

			[language, commandText, magic] = this.parseCommand(cell);

			ThisExtension.log("Executing " + language + ":\n" + commandText);

			let result: iPowerBIDatasetExecuteQueries = undefined;
			switch (magic) {
				case "dax":
					result = await PowerBIApiService.executeQueries(dataset.groupId, dataset.uid, commandText);
					break;
			}

			execution.token.onCancellationRequested(() => {
				execution.appendOutput(new vscode.NotebookCellOutput([
					vscode.NotebookCellOutputItem.text("Execution cancelled!", 'text/plain'),
				]));

				execution.end(false, Date.now());
				return;
			});

			if(result.error)
			{
				execution.appendOutput(new vscode.NotebookCellOutput([
					vscode.NotebookCellOutputItem.error(new Error(JSON.stringify(result, undefined, 4))),
				]));

				execution.end(false, Date.now());
				return;
			}
			if (result.results) {
				let output: vscode.NotebookCellOutput = new vscode.NotebookCellOutput([
					vscode.NotebookCellOutputItem.json(result.results[0].tables[0].rows, 'application/json'), // to be used by proper JSON/table renderers
					vscode.NotebookCellOutputItem.json(result.results, 'application/powerbi-results') // the original result from databricks including schema and datatypes for more advanced renderers
				])

				let rowcount: number = result.results[0].tables[0].rows.length;
				output.metadata = { row_count: rowcount, truncated: rowcount > 100000 };
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
