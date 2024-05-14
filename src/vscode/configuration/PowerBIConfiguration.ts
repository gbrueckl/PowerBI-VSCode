import * as vscode from 'vscode';
import { FabricApiItemFormat, FabricApiItemType, FabricApiItemTypeWithDefinition } from '../../fabric/_types';

/*
CLOUD_CONFIGS are mainly derived from here:
POST https://api.powerbi.com/powerbi/globalservice/v201606/environments/discover?client=powerbi-msolap
$x = Invoke-WebRequest -method POST -uri 'https://api.powerbi.com/powerbi/globalservice/v201606/environments/discover?client=powerbi-msolap'
Write-host $x
*/

interface iCloudConfig {
	friendlyName: string;
	authenticationEndpoint: string;
	authenticationProvider: string;
	apiEndpoint: string;
	resourceId: string;
	allowedDomains: string[];
}

const CLOUD_CONFIGS: { [key: string]: iCloudConfig } = {
	"GlobalCloud": {
		"friendlyName": "Public Azure Cloud",
		"authenticationProvider": "microsoft",
		"authenticationEndpoint": undefined,
		"apiEndpoint": "https://api.powerbi.com",
		"resourceId": "https://analysis.windows.net/powerbi/api",
		"allowedDomains": ["*.analysis.windows.net"]
	},
	"ChinaCloud": {
		"friendlyName": "China Cloud",
		"authenticationProvider": "microsoft-sovereign-cloud",
		"authenticationEndpoint": "https://login.chinacloudapi.cn/common",
		"apiEndpoint": "https://api.powerbi.cn",
		"resourceId": "https://analysis.chinacloudapi.cn/powerbi/api",
		"allowedDomains": ["*.analysis.chinacloudapi.cn"]
	},
	"GermanyCloud": {
		"friendlyName": "Germay Cloud",
		"authenticationProvider": "microsoft-sovereign-cloud",
		"authenticationEndpoint": "https://login.microsoftonline.de/common",
		"apiEndpoint": "https://api.powerbi.de",
		"resourceId": "https://analysis.cloudapi.de/powerbi/api",
		"allowedDomains": ["*.analysis.cloudapi.de"]
	},
	"USGovCloud": {
		"friendlyName": "US Government Community Cloud (GCC)",
		"authenticationProvider": "microsoft",
		"authenticationEndpoint": "https://login.windows.net/common",
		"apiEndpoint": "https://api.powerbigov.us",
		"resourceId": "https://analysis.usgovcloudapi.net/powerbi/api",
		"allowedDomains": ["*.analysis.usgovcloudapi.net"]
	},
	"USGovDoDL4Cloud": {
		"friendlyName": "US Government Community Cloud High (GCC High)",
		"authenticationProvider": "microsoft-sovereign-cloud",
		"authenticationEndpoint": "https://login.microsoftonline.us/common",
		"apiEndpoint": "https://api.high.powerbigov.us",
		"resourceId": "https://high.analysis.usgovcloudapi.net/powerbi/api",
		"allowedDomains": ["*.high.analysis.usgovcloudapi.net"]
	},
	"USGovDoDL5Cloud": {
		"friendlyName": "US Government DoD",
		"authenticationProvider": "microsoft-sovereign-cloud",
		"authenticationEndpoint": "https://login.microsoftonline.us/common",
		"apiEndpoint": "https://api.mil.powerbigov.us",
		"resourceId": "https://mil.analysis.usgovcloudapi.net/powerbi/api",
		"allowedDomains": ["*.mil.analysis.usgovcloudapi.net"]
	},
	"USNatCloud": {
		"friendlyName": "US Government Top Secret",
		"authenticationProvider": "microsoft-sovereign-cloud",
		"authenticationEndpoint": "https://login.microsoftonline.eaglex.ic.gov/common",
		"apiEndpoint": "https://api.powerbi.eaglex.ic.gov",
		"resourceId": "https://analysis.eaglex.ic.gov/powerbi/api/common",
		"allowedDomains": ["*.analysis.eaglex.ic.gov"]
	},
	"USSecCloud": {
		"friendlyName": "US Government Secret",
		"authenticationProvider": "microsoft-sovereign-cloud",
		"authenticationEndpoint": "https://login.microsoftonline.eaglex.ic.gov/common",
		"apiEndpoint": "https://api.powerbi.microsoft.scloud",
		"resourceId": "https://analysis.microsoft.scloud/powerbi/api",
		"allowedDomains": ["*.analysis.microsoft.scloud"]
	}
}


export abstract class PowerBIConfiguration {
	static get cloud(): string { return this.getValue("cloud"); }
	static set cloud(value: string) { this.setValue("cloud", value); }

	static get tenantId(): string { return this.getValue("tenantId"); }
	static set tenantId(value: string) { this.setValue("tenantId", value); }

	static get clientId(): string { return this.getValue("clientId"); }
	static set clientId(value: string) { this.setValue("clientId", value); }

	static get workspaceFilter(): string { return this.getValue("workspaceFilter"); }
	static set workspaceFilter(value: string) { this.setValue("workspaceFilter", value); }
	static get workspaceFilterRegEx(): RegExp { return new RegExp(this.getValue("workspaceFilter")); }

	static get tmdlClientId(): string { return this.getValue("TMDL.clientId"); }
	static set tmdlClientId(value: string) { this.setValue("TMDL.clientId", value); }

	static get tmdlEnabled(): boolean { return this.getValue("TMDL.enabled"); }
	static set tmdlEnabled(value: boolean) { this.setValue("TMDL.enabled", value); }

	// key must be a string value from FabricApiItemType
	static get fabricItemTypes(): { itemType: FabricApiItemTypeWithDefinition, format: FabricApiItemFormat }[] { 
		let confValues = this.getValue("Fabric.itemTypes") as { itemType: string, format: string }[];
		
		let typedValues = confValues.map((item) => {
			return { 
				itemType: item.itemType as FabricApiItemTypeWithDefinition, // strict cast as the list of itemTypes is static
				format: item.format as FabricApiItemFormat // loose cast as the list of formats may change
			};
		});

		return typedValues;
	}

	static get fabricItemTypeNames(): string[] {
		return this.fabricItemTypes.map((itemType) => itemType.itemType);
	}

	static get fabricItemTypeKeys(): FabricApiItemTypeWithDefinition[] {
		return this.fabricItemTypes.map((itemType) => itemType.itemType);
	}

	static getFabricItemTypeformat(itemType: FabricApiItemTypeWithDefinition): FabricApiItemFormat {
		const item = this.fabricItemTypes.find((item) => item.itemType == itemType);
		if(!item || !item.format)
		{
			return FabricApiItemFormat.DEFAULT;
		}
		return item.format;
	}

	static get apiUrl(): string { return CLOUD_CONFIGS[this.cloud].apiEndpoint; }

	static get authenticationProvider(): string { return CLOUD_CONFIGS[this.cloud].authenticationProvider; }

	static get authenticationEndpoint(): string { return CLOUD_CONFIGS[this.cloud].authenticationEndpoint; }

	static get resourceId(): string { return CLOUD_CONFIGS[this.cloud].resourceId; }

	static get isSovereignCloud(): boolean {
		// If the base URL for the API is not pointed to api.powerbi.com assume 
		// we are pointed to the sovereign tenant
		return this.apiUrl !== "https://api.powerbi.com"
	}

	static get isTMDLEnabled(): boolean {
		// If the base URL for the API is not pointed to api.powerbi.com assume 
		// we are pointed to the sovereign tenant
		return this.tmdlEnabled;
	}

	static get config(): vscode.WorkspaceConfiguration {
		return vscode.workspace.getConfiguration("powerbi");
	}

	static getValue<T>(key: string): T {
		const value: T = this.config.get<T>(key);
		return value;
	}

	static setValue<T>(key: string, value: T, target: boolean | vscode.ConfigurationTarget = null): void {
		this.config.update(key, value, target);
	}

	static unsetValue(key: string, target: boolean | vscode.ConfigurationTarget = null): void {
		this.setValue(key, undefined, target);
	}

	static applySettings(): void {
		if(this.isSovereignCloud)
		{
			vscode.workspace.getConfiguration().update("microsoft-sovereign-cloud.endpoint", this.authenticationEndpoint, vscode.ConfigurationTarget.Workspace)
		}
	}
}