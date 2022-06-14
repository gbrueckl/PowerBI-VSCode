import * as vscode from 'vscode';

import { Helper } from './helpers/Helper';
import { PowerBIApiService } from './powerbi/PowerBIApiService';
import { PowerBICapacitiesTreeProvider } from './vscode/treeviews/Capacities/PowerBICapacitesTreeProvider';
import { PowerBIGatewaysTreeProvider } from './vscode/treeviews/Gateways/PowerBIGatewaysTreeProvider';
import { PowerBIWorkspacesTreeProvider } from './vscode/treeviews/workspaces/PowerBIWorkspacesTreeProvider';

// https://vshaxe.github.io/vscode-extern/vscode/TreeDataProvider.html
export abstract class ThisExtension {

	private static _context: vscode.ExtensionContext;
	private static _extension: vscode.Extension<any>;
	private static _isValidated: boolean = false;
	private static _logger: vscode.OutputChannel;
	private static _settingScope: ConfigSettingSource;
	private static _treeViewWorkspaces: PowerBIWorkspacesTreeProvider;
	private static _treeViewCapacities: PowerBICapacitiesTreeProvider;
	private static _treeViewGateways: PowerBIGatewaysTreeProvider;

	static get rootPath(): string {
		return this._context.extensionPath;
	}

	static get extensionContext(): vscode.ExtensionContext {
		return this._context;
	}

	static get secrets(): vscode.SecretStorage {
		return this._context.secrets;
	}

	static get RefreshAfterUpDownload(): boolean {
		return true;
	}

	static get IsValidated(): boolean {
		return this._isValidated;
	}
	// #region TreeViews
	static set TreeViewWorkspaces(treeView: PowerBIWorkspacesTreeProvider)
	{
		this._treeViewWorkspaces = treeView;
	}

	static get TreeViewWorkspaces(): PowerBIWorkspacesTreeProvider
	{
		return this._treeViewWorkspaces;
	}

	static set TreeViewCapacities(treeView: PowerBICapacitiesTreeProvider)
	{
		this._treeViewCapacities = treeView;
	}

	static get TreeViewCapacities(): PowerBICapacitiesTreeProvider
	{
		return this._treeViewCapacities;
	}

	static set TreeViewGateways(treeView: PowerBIGatewaysTreeProvider)
	{
		this._treeViewGateways = treeView;
	}

	static get TreeViewGateways(): PowerBIGatewaysTreeProvider
	{
		return this._treeViewGateways;
	}
	//#endregion

	static async initialize(context: vscode.ExtensionContext): Promise<boolean> {
		try {
			this._logger = vscode.window.createOutputChannel(context.extension.id);
			this.log("Logger initialized!");

			this._extension = context.extension;
			this.log(`Loading VS Code extension '${context.extension.packageJSON.displayName}' (${context.extension.packageJSON.id}) version ${context.extension.packageJSON.version} ...`);
			this.log(`If you experience issues please open a ticket at ${context.extension.packageJSON.qna}`);
			this._context = context;	

			await PowerBIApiService.initialize();		

		} catch (error) {
			return false;
		}

		return true;
	}

	static cleanUp(): void {
		Helper.removeTempFiles();
	}

	static log(text: string, newLine: boolean = true): void {
		if (newLine) {
			this._logger.appendLine(text);
		}
		else {
			this._logger.append(text);
		}
	}

	static get configuration(): vscode.Extension<any> {
		return this._extension;
	}

	static async getSecureSetting(setting: string): Promise<string> {
		let value = this.secrets.get(setting); // new way to store secrets
		
		return value;
	}

	static async setSecureSetting(setting: string, value: string): Promise<void> {
		// changing the way we store secrets and make sure we are backward compatible
		await this.secrets.store(setting, value);
	}

	static getConfigurationSetting<T = string>(setting: string, source?: ConfigSettingSource, allowDefaultValue: boolean = false): ConfigSetting<T> {
		// usage: ThisExtension.getConfigurationSetting('powerbi.connection.default.displayName')

		let value = vscode.workspace.getConfiguration().get(setting) as T;
		let inspect = vscode.workspace.getConfiguration().inspect(setting);

		if (!source) {
			// if no source was specified we use the most specific value that exists.
			if (inspect.workspaceValue != undefined || inspect.workspaceFolderValue != undefined || inspect.workspaceLanguageValue != undefined || inspect.workspaceFolderLanguageValue != undefined) {
				source = "Workspace";
			}
			else if (inspect.globalValue != undefined || inspect.globalLanguageValue != undefined) {
				source = "Global";
			}
			else {
				source = "Default";
			}
		}

		if (source == "Global") {
			value = (inspect.globalValue ?? inspect.globalLanguageValue) as T;
		}
		else if (source == "Workspace") {
			value = (inspect.workspaceValue ?? inspect.workspaceFolderValue ?? inspect.workspaceLanguageValue ?? inspect.workspaceFolderLanguageValue) as T;
		}

		if (source == "Default" || (allowDefaultValue && !value)) {
			value = (inspect.defaultValue ?? inspect.defaultLanguageValue) as T;
		}

		return {
			setting: inspect.key,
			value: value,
			inspect: inspect,
			source: source
		};
	}

	static async updateConfigurationSetting(setting: string, value: any, target: ConfigSettingSource = this._settingScope): Promise<void> {
		let finalTarget: vscode.ConfigurationTarget = undefined;

		switch (target) {
			case "Workspace":
				finalTarget = vscode.ConfigurationTarget.Workspace;
				break;

			case "Global":
				finalTarget = vscode.ConfigurationTarget.Global;
				break;

			default:
				finalTarget = vscode.ConfigurationTarget.Workspace;
				break;
		}
		vscode.workspace.getConfiguration().update(setting, value, finalTarget);
	}

	static async updateConfigurationSettingByConfigSetting(configSetting: ConfigSetting<any>, target: vscode.ConfigurationTarget): Promise<void> {
		vscode.workspace.getConfiguration().update(configSetting.setting, configSetting.value, target);
	}

	static get useProxy(): boolean {
		let httpProxySupport: ConfigSetting<string> = ThisExtension.getConfigurationSetting<string>("http.proxySupport");

		// only check if proxySupport is explicitly set to "off"
		if (httpProxySupport.value == "off") {
			this.log('Proxy support is disabled due to setting "http.proxySupport": "off"!');
			return false;
		}

		if (httpProxySupport.value == "on") {
			this.log('Proxy support is enabled due to setting "http.proxySupport": "on"!');
			return true;
		}

		return undefined;
	}

	static get rejectUnauthorizedSSL(): boolean {
		let httpProxyStrictSSL: ConfigSetting<boolean> = ThisExtension.getConfigurationSetting<boolean>("http.proxyStrictSSL");

		// check if Strict Proxy SSL is NOT enabled
		if (httpProxyStrictSSL.value) {
			if (httpProxyStrictSSL.source != "Default") {
				this.log('Strict Proxy SSL verification enabled due to setting "http.proxyStrictSSL": true !');
			}
		}
		else
		{
			this.log('Strict Proxy SSL verification disabled due to setting "http.proxyStrictSSL": false !');
		}

		return httpProxyStrictSSL.value;
	}
}

export type ConfigSettingSource =
	"Workspace"
	| "Global"
	| "Default"
	;

export interface ConfigSetting<T> {
	setting: string;
	value: T;
	inspect;
	source: ConfigSettingSource;
}


