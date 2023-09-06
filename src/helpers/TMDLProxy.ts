/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ThisExtension } from '../ThisExtension';
import { PowerBIDataset } from '../vscode/treeviews/workspaces/PowerBIDataset';

import { fetch, getProxyAgent, RequestInit, Response } from '@env/fetch';

import { spawn } from 'child_process';


export abstract class TMDLProxy {
	private static _secret: string;
	private static _port: number;
	private static _headers;

	private static _tmdlProxyProcess: any;

	static async ensureProxy(context: vscode.ExtensionContext, port: number): Promise<void> {

		this._port = port;
		this._secret = "123";

		this._headers = {
			"X-TMDL-Proxy-Secret": this._secret,
			"Content-Type": 'application/json',
			"Accept": 'application/json'
		}

		if (!TMDLProxy._tmdlProxyProcess) {

			const proxyDllPath = vscode.Uri.joinPath(context.extensionUri, "resources", "TMDLProxy", "TMDLVSCodeProxy.dll").fsPath;

			ThisExtension.log(`Starting TMDLProxy from ${proxyDllPath} on port ${this._port} with secret ${this._secret}`);
			TMDLProxy._tmdlProxyProcess = spawn("dotnet", [proxyDllPath, this._port.toString(), this._secret]);

			/* Test Ports:
			Get-NetTCPConnection -State Listen | where-object {$_.LocalPort -gt 40000 } | sort-object { $_.LocalPort }
			*/

			TMDLProxy._tmdlProxyProcess.stdout.on('data', (data: any) => {
				ThisExtension.log(data.toString());
			});
			TMDLProxy._tmdlProxyProcess.stderr.on('data', (data: any) => {
				ThisExtension.log("ERROR: " + data.toString());
			});

			TMDLProxy._tmdlProxyProcess.on('error', (err) => {
				ThisExtension.log("Error starting TMDLProxy: " + err);
			});
			TMDLProxy._tmdlProxyProcess.on('close', (code) => {
				ThisExtension.log("TMDLProxy closed with code: " + code);
			});
		}
	}

	static async test(dataset: PowerBIDataset): Promise<string> {
		try {
			const config: RequestInit = {
				method: "GET",
				headers: this._headers,
				agent: getProxyAgent(false)
			};
			const endpoint = `https://127.0.0.1:${this._port}/tmdl/test`;

			fetch(endpoint, config)
				.catch(err => {
					vscode.window.showErrorMessage(err);
				})
				.then(res => {
					vscode.window.showErrorMessage("then");
				}).finally(() => {
					vscode.window.showErrorMessage("finally")
				});

			let response: Response = await fetch(endpoint, config);

			let resultText = await response.text();
			vscode.window.showInformationMessage(resultText);

			return resultText;

		} catch (error) {
			vscode.window.showErrorMessage(error);
		}
	}

	static async serialize(dataset: PowerBIDataset): Promise<void> {
	}

	static async deserialize(dataset: PowerBIDataset): Promise<void> {

	}
}