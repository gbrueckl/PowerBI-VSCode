import * as vscode from 'vscode';
import { PowerBIDragMIMEType } from '../treeviews/PowerBIApiDragAndDropController';

export interface PowerBIDaxDrop {
	daxDrop: string;
}

export interface PowerBIApiDrop {
	apiDrop: string;
}

export interface PowerBITmslDrop {
	tmslDrop: string;
}