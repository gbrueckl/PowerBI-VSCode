import * as vscode from 'vscode';
import { Helper } from '../../helpers/Helper';
import { ThisExtension } from '../../ThisExtension';
import { PowerBIAPILanguage } from '../language/_types';
import { PowerBIApiTreeItem } from '../treeviews/PowerBIApiTreeItem';
import { PowerBINotebook, PowerBINotebookCell, PowerBINotebookType } from './PowerBINotebook';
import { PowerBINotebookContext } from './PowerBINotebookContext';

export class PowerBINotebookSerializer implements vscode.NotebookSerializer {
	public readonly label: string = 'Power BI Notebook  Serializer';

	public async deserializeNotebook(data: Uint8Array, token: vscode.CancellationToken): Promise<PowerBINotebook> {
		var contents = Buffer.from(data).toString();

		// Read file contents
		let notebook: PowerBINotebook;
		try {
			notebook = <PowerBINotebook>JSON.parse(contents);
		} catch {
			ThisExtension.log("Error parsing Notebook file. Creating new Notebook.");
			notebook = { cells: [] };
		}

		// read metadata into interactive object and return guid as reference
		notebook.metadata = PowerBINotebookContext.loadFromMetadata(notebook.metadata);

		// Pass read and formatted Notebook Data to VS Code to display Notebook with saved cells
		return notebook;
	}

	public async serializeNotebook(data: PowerBINotebook, token: vscode.CancellationToken): Promise<Uint8Array> {
		// Map the Notebook data into the format we want to save the Notebook data as
		let notebook: PowerBINotebook = data;

		notebook.metadata = PowerBINotebookContext.saveToMetadata(notebook.metadata);

		// Give a string of all the data to save and VS Code will handle the rest
		return await Buffer.from(JSON.stringify(notebook));
	}

	static async openNewNotebook(apiItem: PowerBIApiTreeItem): Promise<vscode.NotebookEditor> {
		let apiPath = "/groups";

		if (apiItem) {
			apiPath = '/' + Helper.trimChar(apiItem.apiPath.split("/").slice(2).join("/"), "/", false, true);
		}

		let defaultCells = [
			new PowerBINotebookCell(vscode.NotebookCellKind.Markup, "Set API path for relative paths (already executed in the background for you)", "markdown"),
			new PowerBINotebookCell(vscode.NotebookCellKind.Code, '%cmd\nSET API_PATH = ' + apiPath, PowerBIAPILanguage),
			new PowerBINotebookCell(vscode.NotebookCellKind.Markup, "Type `./` to start autocomplete from relative API path. \n\n Type `/` for absolute API paths", "markdown"),
			new PowerBINotebookCell(vscode.NotebookCellKind.Code, 'GET ./', PowerBIAPILanguage)
		];
		let notebook = new PowerBINotebook(defaultCells);
		notebook.metadata = PowerBINotebookContext.loadFromMetadata(notebook.metadata);

		const doc = await vscode.workspace.openNotebookDocument(PowerBINotebookType, notebook);
		let context: PowerBINotebookContext = new PowerBINotebookContext(apiPath);
		context.apiRootPath = apiPath;
		context.uri = doc.uri;
		PowerBINotebookContext.set(notebook.metadata.guid, context)

		ThisExtension.NotebookKernel.setNotebookContext(doc, context);

		return vscode.window.showNotebookDocument(doc);
	}
}