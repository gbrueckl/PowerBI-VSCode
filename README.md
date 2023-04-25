# PowerBI-VSCode
[![Version](https://vsmarketplacebadges.dev/version/GerhardBrueckl.powerbi-vscode.svg?color=blue&style=?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode)
[![Installs](https://vsmarketplacebadges.dev/installs/GerhardBrueckl.powerbi-vscode.svg?color=yellow)](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode)
[![Downloads](https://vsmarketplacebadges.dev/downloads/GerhardBrueckl.powerbi-vscode.svg?color=yellow)](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode)
[![Ratings](https://vsmarketplacebadges.dev/rating/GerhardBrueckl.powerbi-vscode.svg?color=green)](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode)

![PowerBI-VSCode](/images/PowerBI-VSCode.png?raw=true "PowerBI-VSCode")

A [VSCode](https://code.visualstudio.com/) extension for managing your Power BI tenant using the [Power BI REST API](https://docs.microsoft.com/en-us/rest/api/power-bi/).

# Installation
The extensions can be installed directly from within VSCode by searching for this extension (`GerhardBrueckl.powerbi-vscode`) or downloaded from the official Visual Studio Code extension gallery at [PowerBI VSCode](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode) and installed manually as `VSIX`.

# Features
- GUI to run operations like [rebind](https://learn.microsoft.com/en-us/rest/api/power-bi/reports/rebind-report-in-group), [clone](https://learn.microsoft.com/en-us/rest/api/power-bi/reports/clone-report-in-group), ...
- Supports VSCode and [vscode.dev](https://vscode.dev)
- Connect to remote tenants where you are invited as a guest user - see [Configuration](#configuration)
- Run DAX queries in a notebook against your Power BI Datasets using `%dax` magic
- Run arbitrary REST API calls in a notebook using `%api` magic
- Drag & Drop to run certain commands (e.g. drop a report on a dataset to rebind it)
- Work-In-Progress: UI for Capacities, Gatways and Pipelines

# Configuration
The extension supports the following VSCode settings:
|Setting|Description|Example value|
|-------|-----------|-------------|
|`powerbi.tenantId`|The tenant ID of the remote tenant that you want to connect to.|A GUID, `93519689-1234-5678-9abcd-e4b9f59d1963`|
|`powerbi.apiUrl`|The Power BI API URL, default is `https://api.powerbi.com/`|`https://api.powerbi.com/`|

# Building Locally
1. Make sure you have installed [NodeJS](https://nodejs.org/en/) on your development workstation
2. Clone this repo to your development workstation, then open the cloned folder in [VSCode](https://code.visualstudio.com/)
3. To install all dependencies, switch to the terminal and run `npm install`
4. To run the extension in debug mode (for using break-points, etc.), press `F5`
5. To generate the `.vsix`, switch to the terminal and run `vsce package`

# VSCode Extension Development Details
Please refer to the [official docs and samples](https://github.com/microsoft/vscode-extension-samples#prerequisites)
