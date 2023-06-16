import * as vscode from 'vscode';

export class iPowerBIConfiguration {
	apiUrl: string;
	tenantId?: string;
	clientId?: string;
	authenticationProvider?: string;
	resourceId?: string;
	cloud: string;
}

const ENDPOINT_TO_RESOURCEID = {
	"https://api.powerbi.com": "https://analysis.windows.net/powerbi/api",
	"https://api.powerbi.cn": "https://analysis.chinacloudapi.cn/powerbi/api",
	"https://api.powerbi.de": "https://analysis.cloudapi.de/powerbi/api",
	"https://api.powerbigov.us": "https://analysis.usgovcloudapi.net/powerbi/api",
	"https://api.high.powerbigov.us": "https://high.analysis.usgovcloudapi.net/powerbi/api",
	"https://api.mil.powerbigov.us": "https://mil.analysis.usgovcloudapi.net/powerbi/api",
	"https://api.powerbi.eaglex.ic.gov": "https://analysis.eaglex.ic.gov/powerbi/api",
	"https://api.powerbi.microsoft.scloud": "https://analysis.microsoft.scloud/powerbi/api"
}

/*
POST https://api.powerbi.com/powerbi/globalservice/v201606/environments/discover?client=powerbi-msolap

$x = Invoke-WebRequest -method POST -uri 'https://api.powerbi.com/powerbi/globalservice/v201606/environments/discover?client=powerbi-msolap'
Write-host $x
*/



const CLOUT_CONFIGS = {
	"GlobalCloud":
	{
		"authenticationProvider": "microsoft",
		"endpoint": "https://api.powerbi.com",
		"resourceId": "https://analysis.windows.net/powerbi/api",
		"allowedDomains": ["*.analysis.windows.net"]
	},
	"ChinaCloud":
	{
		"authenticationProvider": "microsoft-sovereign-cloud",
		"endpoint": "https://api.powerbi.cn",
		"resourceId": "https://analysis.chinacloudapi.cn/powerbi/api",
		"allowedDomains": ["*.analysis.chinacloudapi.cn"]
	},
	"GermanyCloud":
	{
		"authenticationProvider": "microsoft-sovereign-cloud",
		"endpoint": "https://api.powerbi.de",
		"resourceId": "https://analysis.cloudapi.de/powerbi/api",
		"allowedDomains": ["*.analysis.cloudapi.de"]
	},
	"USGovCloud":
	{
		"authenticationProvider": "microsoft-sovereign-cloud",
		"endpoint": "https://api.powerbigov.us",
		"resourceId": "https://analysis.usgovcloudapi.net/powerbi/api",
		"allowedDomains": ["*.analysis.usgovcloudapi.net"]
	}, 
	"USGovDoDL4Cloud":
	{
		"authenticationProvider": "microsoft-sovereign-cloud",
		"endpoint": "https://api.high.powerbigov.us",
		"resourceId": "https://high.analysis.usgovcloudapi.net/powerbi/api",
		"allowedDomains": ["*.high.analysis.usgovcloudapi.net"]
	},
	"USGovDoDL5Cloud":
	{
		"authenticationProvider": "microsoft-sovereign-cloud",
		"endpoint": "https://api.mil.powerbigov.us",
		"resourceId": "https://mil.analysis.usgovcloudapi.net/powerbi/api",
		"allowedDomains": ["*.mil.analysis.usgovcloudapi.net"]
	},
	"USNatCloud":
	{
		"authenticationProvider": "microsoft-sovereign-cloud",
		"endpoint": "https://api.powerbi.eaglex.ic.gov",
		"resourceId": "https://analysis.eaglex.ic.gov/powerbi/api",
		"allowedDomains": ["*.analysis.eaglex.ic.gov"]
	}, "USSecCloud":
	{
		"authenticationProvider": "microsoft-sovereign-cloud",
		"endpoint": "https://api.powerbi.microsoft.scloud",
		"resourceId": "https://analysis.microsoft.scloud/powerbi/api",
		"allowedDomains": ["*.analysis.microsoft.scloud"]
	}
}


export class PowerBIConfiugration implements iPowerBIConfiguration {
	get apiUrl(): string { return this.getValue("apiUrl"); }
	set apiUrl(value: string) { this.setValue("apiUrl", value); }

	get tenantId(): string { return this.getValue("tenantId"); }
	set tenantId(value: string) { this.setValue("tenantId", value); }

	get clientId(): string { return this.getValue("clientId"); }
	set clientId(value: string) { this.setValue("clientId", value); }

	get authenticationProvider(): string { return this.getValue("authenticationProvider"); }
	set authenticationProvider(value: string) { this.setValue("authenticationProvider", value); }

	get resourceId(): string { return this.getValue("resourceId"); }
	set resourceId(value: string) { this.setValue("resourceId", value); }

	get cloud(): string { return this.getValue("cloud"); }
	set cloud(value: string) { this.setValue("cloud", value); }

	get config(): vscode.WorkspaceConfiguration {
		return vscode.workspace.getConfiguration("powerbi");
	}

	getValue(key: string): any {
		return this.config.get(key);
	}

	setValue(key: string, value: any, target: boolean | vscode.ConfigurationTarget = null): void {
		this.config.update(key, value, target);
	}

	unsetValue(key: string, target: boolean | vscode.ConfigurationTarget = null): void {
		this.setValue(key, undefined, target);
	}
}