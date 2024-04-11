/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ThisExtension } from '../ThisExtension';

export class UniqueId extends String {
	// placeholder class for unique-ids in Power BI
	constructor(
		value?: string
	) {
		super(value);
	}
}

export namespace UniqueId {
	export function toString(dir: UniqueId): string {
		return dir.toString();
	}

	export function fromString(dir: string): UniqueId {
		return new UniqueId(dir);
	}
}

export abstract class Helper {
	private static _doubleClickTimer: any;

	static SEPARATOR: string = '/';


	static async delay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	static async wait(ms: number): Promise<void> {
		return this.delay(ms);
	}

	static async showTemporaryInformationMessage(message: string, timeout: number = 2000): Promise<void> {
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: message,
			cancellable: false
		}, (progress) => {
			return new Promise<void>(resolve => {
				setTimeout(() => {
					resolve();
				}, timeout);
			});
		});
	}

	static async fetchWithProgress(message: string, fetchPromise: Promise<any>, keepResultMessage: number = 5000): Promise<boolean> {
		let success: boolean = false;
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: message,
			cancellable: false
		}, async (progress: vscode.Progress<any>) => {
			progress.report({ message: "running ..." });
			let response = await fetchPromise;

			let resultText = await response.text();

			if (!response.ok) {
				vscode.window.showErrorMessage(resultText);
				progress.report({ increment: 100, message: "ERROR!" });
				success = false;
			}
			else {
				progress.report({ increment: 100, message: "Success!" });
				success = true;
			}

			if (keepResultMessage > 0) {
				const p = await new Promise<void>(resolve => {
					setTimeout(() => {
						resolve();
					}, keepResultMessage);
				});

				return p;
			}
		});

		return success;
	}

	static async awaitWithProgress<T>(message: string, promise: Promise<any>, showResultMessage: number = 5000): Promise<T> {
		let ret: T = undefined;

		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: message,
			cancellable: false
		}, async (progress: vscode.Progress<any>) => {
			progress.report({ message: " ..." });
			ThisExtension.log(message + " ...");

			const start = new Date().getTime();
			let result = await promise;
			const end = new Date().getTime();
			const duration = end - start;
			ThisExtension.log(message + " took " + duration + "ms!");

			progress.report({ increment: 100, message: `Finished after ${Math.round(duration / 1000)}s!` });
			ret = result;

			const p = await new Promise<void>(resolve => {
				setTimeout(() => {
					resolve();
				}, showResultMessage);
			});

			return p;
		});

		return ret;
	}

	static mapToObject<T>(map: Map<string, any>): T {
		const obj = {};
		for (let [key, value] of map) {
			obj[key] = value;
		}
		return obj as T;
	}

	static sortArrayByProperty<T>(unsortedArray: Array<T>, property: string = "label", direction: "ASC" | "DESC" = "ASC") {
		let direction_num: number = (direction == "ASC" ? 1 : -1);

		unsortedArray.sort((t1, t2) => {
			if (!t1.hasOwnProperty(property) || !t2.hasOwnProperty(property)) {
				ThisExtension.log("WARNING: sortArrayByProperty: property '" + property + "' does not exist on one of the items.\n" + JSON.stringify(t1) + "\n" + JSON.stringify(t2));
				return 0;
			}
			if( t1[property] == undefined ||  t2[property] == undefined){
				return 0;
			}
			const name1 = t1[property].toString().toLowerCase();
			const name2 = t2[property].toString().toLowerCase();
			if (name1 > name2) { return 1 * direction_num; }
			if (name1 < name2) { return -1 * direction_num; }
			return 0;
		});
	}

	static joinPath(...paths: string[]) {
		let items: string[] = [];

		for (let path of paths) {
			items.push(Helper.trimChar(path, this.SEPARATOR))
		}

		items = items.filter(x => x); // filters out items that would be undefined/null/empty etc.

		return this.SEPARATOR + items.join(this.SEPARATOR);
	}

	static trimChar(text: string, charToRemove: string, fromLeft: boolean = true, fromRight: boolean = true) {
		if (text == undefined) { return undefined; }
		if (text.length == 0) { return text; }
		while (text.charAt(0) == charToRemove && fromLeft) {
			text = text.substring(1);
		}

		while (text.charAt(text.length - 1) == charToRemove && fromRight) {
			text = text.substring(0, text.length - 1);
		}

		return text;
	}

	static async showDiff(filePath1: string, filePath2: string): Promise<void> {
		let localFileUri = vscode.Uri.file(filePath1);
		let onlnieFileUri = vscode.Uri.file(filePath2);

		let options: vscode.TextDocumentShowOptions = {
			"preserveFocus": true,
			"preview": false
		};

		vscode.commands.executeCommand("vscode.diff", localFileUri, onlnieFileUri, "Online <-> Local", options);
	}


	static openLink(link: string | vscode.Uri): void {
		ThisExtension.log(`Opening link in Brwoser: ${link.toString()}`);
		if(typeof link === "string")
		{
			vscode.env.openExternal(vscode.Uri.parse(link));
		}
		else {
			vscode.env.openExternal(link);
		}
	}

	static bytesToSize(bytes: number): string {
		let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes == 0) return '0 Byte';

		let i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
	}

	static async singleVsDoubleClick(
		sourceObject: any,
		singleClickFunction: Function,
		doubleClickFunction: Function,
		timeout: number = 250): Promise<void> {
		if (!Helper._doubleClickTimer) {
			//if timer still exists, it's a double-click
			Helper._doubleClickTimer = setTimeout(await sourceObject[singleClickFunction.name], timeout); //do single-click once timer has elapsed
			setTimeout(this.resetDoubleClickTimer, timeout + 1);
		}
		else {
			await Helper.resetDoubleClickTimer();

			await sourceObject[doubleClickFunction.name]();
		}
	}

	private static async resetDoubleClickTimer(): Promise<void> {
		clearTimeout(Helper._doubleClickTimer); //cancel timer
		Helper._doubleClickTimer = undefined;
	}

	public static localUserFolder(): string {
		return "";
	}

	static newGuid() {
		return 'xxxxxxxx-xxxx-1908-2120-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	static secondsToHms(seconds: number) {
		var h = Math.floor(seconds / 3600);
		var m = Math.floor(seconds % 3600 / 60);
		var s = Math.floor(seconds % 3600 % 60);

		var hDisplay = h > 0 ? h + ":" : "";
		var mDisplay = m > 0 ? m + ":" : "";
		var sDisplay = s > 0 ? s + ":" : "";

		var hDisplay = h > 0 ? `${h.toString().length > 1 ? `${h}` : `0${h}`}` : '00';
		var mDisplay = m > 0 ? `${m.toString().length > 1 ? `${m}` : `0${m}`}` : '00';
		var sDisplay = s > 0 ? `${s.toString().length > 1 ? `${s}` : `0${s}`}` : '00';

		return `${hDisplay}:${mDisplay}:${sDisplay}`;
	}

	static getFirstRegexGroup(regexp: RegExp, text: string): string {
		const array = [...text.matchAll(regexp)];
		if (array.length >= 1) {
			return array[0][1];
		}
		return null;
	}

	static parseBoolean(value: string): boolean {
		return value === 'false' || value === 'undefined' || value === 'null' || value === '0' ? false : !!value;
	}

	static isGuid(value: string): boolean {
		const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
		return guidRegex.test(value);
	}

	static toPascalCase(value: string): string {
		return value[0].toUpperCase() + value.substring(1).toLowerCase();
	}

	static async addToWorkspace(uri: vscode.Uri, name: string): Promise<void> {
		await vscode.workspace.updateWorkspaceFolders(
			vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0,
			0,
			{ uri: uri, name: name });
	}

	static parentUri(uri: vscode.Uri): vscode.Uri {
		let parentPaths = uri.path.split(this.SEPARATOR).slice(0, -1);
		let parentPath: string = "/";

		if (parentPaths.length > 1) {
			parentPath = parentPaths.join(this.SEPARATOR)
		}
		return uri.with({ path: parentPath });
	}

	static cutEnd(text: string, cutOffText: string): string {
		if (text.endsWith(cutOffText)) {
			return text.substring(0, text.length - cutOffText.length);
		}
		return text;
	}

	static async awaitCondition(
		condition: () => Promise<boolean>,
		timeout: number,
		interval: number
	): Promise<boolean> {
		// Set a timer that will resolve with null
		return new Promise<boolean>((resolve) => {
			let finish: (result: boolean) => void;
			const timer = setTimeout(() => finish(false), timeout);
			const intervalId = setInterval(() => {
				condition()
					.then((result) => {
						if (result) {
							finish(true);
						}
					})
					.catch((_e) => finish(false));
			}, interval);
			finish = (result: boolean) => {
				clearTimeout(timer);
				clearInterval(intervalId);
				resolve(result);
			};
		});
	}

	static toLocalDateTime(dateTime: Date): Date {
		const offset = new Date().getTimezoneOffset() * 60 * 1000;
		let localDateTime = new Date(dateTime.getTime() - offset);
		return localDateTime;
	}
}