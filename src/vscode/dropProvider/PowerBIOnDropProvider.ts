import * as vscode from 'vscode';
import { PowerBIDragMIMEType } from '../treeviews/PowerBIApiDragAndDropController';
import { ThisExtension } from '../../ThisExtension';
import { PowerBIApiTreeItem } from '../treeviews/PowerBIApiTreeItem';
import { PowerBIDaxDrop, PowerBITmslDrop } from './_types';

export class PowerBIOnDropProvider implements vscode.DocumentDropEditProvider {
	async provideDocumentDropEdits(
		_document: vscode.TextDocument,
		position: vscode.Position,
		dataTransfer: vscode.DataTransfer,
		token: vscode.CancellationToken
	): Promise<vscode.DocumentDropEdit> {

		const fullText = _document.getText();
		const language = _document.languageId;

		const dataTransferItem = dataTransfer.get(PowerBIDragMIMEType);
		if (!dataTransferItem) {
			return;
		}

		const itemsString = await dataTransferItem.asString();
		const items = JSON.parse(itemsString) as PowerBIApiTreeItem[];

		let inserts: string[] = [];
		let separator = ",\n";

		if (fullText.startsWith("%dax")
			|| fullText.startsWith("EVALUATE")
			|| fullText.startsWith("DEFINE")
			|| language === "dax") {
			// DAX Drop
			for (const item of items) {
				if ('daxDrop' in item) {
					inserts.push((item as PowerBIDaxDrop).daxDrop);
				}
				else {
					ThisExtension.log(`API Item '${item.name}' does not have an daxDrop property`)
				}
			}
		}
		else if (fullText.startsWith("%tmsl")
			|| (fullText.startsWith("{") && fullText.endsWith("}"))
			|| language === "tmsl") {
			// TMSL Drop
			for (const item of items) {
				if ('tmslDrop' in item) {
					inserts.push((item as PowerBITmslDrop).tmslDrop);
				}
				else {
					ThisExtension.log(`API Item '${item.name}' does not have an tmslDrop property`)
				}
			}
		}
		else if (fullText.startsWith("%cmd")
			|| fullText.startsWith("SET")
			|| language === "pbinb-cmd") {
			// CMD Drop
			for (const item of items) {
				inserts.push(item.id);
			}
		}
		else if (fullText.startsWith("%api") || language === "powerbi-api") {
			// API Drop
			for (const item of items) {
				if (item.apiDrop) {
					inserts.push(item.apiDrop);
				}
				else {
					ThisExtension.log(`API Item '${item.name}' does not have an apiDrop property`)
				}
			}
		}
		else {
			ThisExtension.log(`Unknown item dropped: ${itemsString}`)
		}

		const snippet = inserts.join(separator);


		return { insertText: snippet };
	}
}

