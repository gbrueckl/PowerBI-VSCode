import * as vscode from 'vscode';
import { Helper } from '../../helpers/Helper';

export const PowerBINotebookType: string = 'powerbi-notebook';



export class PowerBINotebook extends vscode.NotebookData {
	// empty for now, might be extended in the future if new features are added
}

export class PowerBINotebookCell extends vscode.NotebookCellData {

}

