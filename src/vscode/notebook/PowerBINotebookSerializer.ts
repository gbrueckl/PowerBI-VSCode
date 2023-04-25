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
		// contents will be ignored
		const cell = new PowerBINotebookCell(vscode.NotebookCellKind.Code, 'GET /' + Helper.trimChar(apiItem.apiPath.split("/").slice(2).join("/"), "/", false, true), PowerBIAPILanguage);
		const notebook = new PowerBINotebook([cell]);

		const doc = await vscode.workspace.openNotebookDocument(PowerBINotebookType, notebook);

		ThisExtension.NotebookKernel.setNotebookContext(doc, new PowerBINotebookContext(apiItem.apiPath));

		return vscode.window.showNotebookDocument(doc);
	}
}