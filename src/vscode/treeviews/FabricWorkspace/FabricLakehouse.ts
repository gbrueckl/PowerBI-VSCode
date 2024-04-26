import * as vscode from 'vscode';

import { Helper, UniqueId } from '../../../helpers/Helper';
import { FabricWorkspaceTreeItem } from './FabricWorkspaceTreeItem';
import { FabricApiItemType, iFabricApiItem, iFabricApiLakehouseProperties } from '../../../fabric/_types';
import { FabricLakehouseTables } from './FabricLakehouseTables';
import { FabricWorkspace } from './FabricWorkspace';
import { FabricApiService } from '../../../fabric/FabricApiService';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class FabricLakehouse extends FabricWorkspaceTreeItem {
	private _properties: iFabricApiLakehouseProperties;

	constructor(
		definition: iFabricApiItem,
		group: UniqueId,
		parent: FabricWorkspaceTreeItem
	) {
		super(definition.displayName, group, FabricApiItemType.Lakehouse, definition.id, parent, definition.description, vscode.TreeItemCollapsibleState.Collapsed);

		this.id = definition.id;
		this.definition = definition;

		this.contextValue = this._contextValue;
	}

	/* Overwritten properties from FabricApiTreeItem */
	get _contextValue(): string {
		let orig: string = super._contextValue;

		let actions: string[] = ["BROWSEONELAKE"];

		return orig + actions.join(",") + ",";
	}


	async getChildren(element?: FabricWorkspaceTreeItem): Promise<FabricWorkspaceTreeItem[]> {
		let children: FabricWorkspaceTreeItem[] = [];

		children.push(new FabricLakehouseTables(this.workspaceId, this));
		//children.push(new PowerBIDataflowDatasources(this.groupId, this));

		return children;
	}

	public async getProperties(): Promise<iFabricApiLakehouseProperties> {
		if (this._properties == null) {
			this._properties = (await FabricApiService.get(this.apiPath)).success;
		}

		return this._properties["properties"];
	}

	public async getSQLConnectionString(): Promise<string> {
		let properties = await this.getProperties();

		return properties.sqlEndpointProperties.connectionString;
	}

	public async copySQLConnectionString(): Promise<void> {
		vscode.env.clipboard.writeText(await this.getSQLConnectionString());
	}

	public async getOneLakeFilesPath(): Promise<string> {
		let properties = await this.getProperties();

		return properties.oneLakeFilesPath;
	}

	public async copyOneLakeFilesPath(): Promise<void> {
		vscode.env.clipboard.writeText(await this.getOneLakeFilesPath());
	}

	public async getOneLakeTablesPath(): Promise<string> {
		let properties = await this.getProperties();

		return properties.oneLakeTablesPath;
	}

	public async copyOneLakeTablesPath(): Promise<void> {
		vscode.env.clipboard.writeText(await this.getOneLakeTablesPath());
	}

	get oneLakeUri(): vscode.Uri {
	// onelake:/<WorkspaceName>/<ItemName>.<ItemType>
		const workspace = this.getParentByType<FabricWorkspace>(FabricApiItemType.Workspace);
		
		return vscode.Uri.parse(`onelake://${workspace.displayName}/${this.displayName}.Lakehouse`);
	}
}