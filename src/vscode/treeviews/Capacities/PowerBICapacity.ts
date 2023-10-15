import * as vscode from 'vscode';

import { PowerBICapacityTreeItem } from './PowerBICapacityTreeItem';
import { PowerBIApiTreeItem } from '../PowerBIApiTreeItem';
import { iPowerBICapacity } from '../../../powerbi/CapacityAPI/_types';
import { PowerBICapacityRefreshables } from './PowerBICapacityRefreshables';
import { PowerBICommandBuilder } from '../../../powerbi/CommandBuilder';
import { PowerBICapacityWorkloads } from './PowerBICapacityWorkloads';
import { PowerBIApiService } from '../../../powerbi/PowerBIApiService';

// https://vshaxe.github.io/vscode-extern/vscode/TreeItem.html
export class PowerBICapacity extends PowerBICapacityTreeItem {

	constructor(
		definition: iPowerBICapacity,
		parent: PowerBIApiTreeItem,
	) {
		super(definition.id.toString(), definition.displayName, "CAPACITY", definition, parent);
		this.definition = definition;

		super.tooltip = this._tooltip;
	}

	/* Overwritten properties from PowerBIApiTreeItem */
	get definition(): iPowerBICapacity {
		return super.definition as iPowerBICapacity;
	}

	set definition(value: iPowerBICapacity) {
		super.definition = value;
	}

	get displayName(): string {
		return this.definition.displayName;
	}

	get sku(): string {
		return this.definition.sku;
	}

	get region(): string {
		return this.definition.region;
	}

	get state(): string {
		return this.definition.state;
	}

	get admins(): string[] {
		return this.definition.admins;
	}

	get capacityUserAccessRight(): string {
		return this.definition.capacityUserAccessRight;
	}

	get apiUrlPart(): string {
		return "capacities/" + this.uid.toLocaleLowerCase();
	}

	async getChildren(element?: PowerBICapacityTreeItem): Promise<PowerBICapacityTreeItem[]> {
		PowerBICommandBuilder.pushQuickPickItem(this);

		let children: PowerBICapacityTreeItem[] = [];

		children.push(new PowerBICapacityRefreshables(this));
		if (this.admins.includes(PowerBIApiService.SessionUserEmail)) {
			children.push(new PowerBICapacityWorkloads(this));
		}

		return children;
	}

	// Capacity-specific funtions
}