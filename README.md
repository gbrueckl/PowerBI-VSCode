# PowerBI-VSCode
[![Version](https://vsmarketplacebadge.apphb.com/version/GerhardBrueckl.powerbi-vscode.svg?color=orange&style=?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/GerhardBrueckl.powerbi-vscode.svg?color=orange)](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode)
[![Downloads](https://vsmarketplacebadge.apphb.com/downloads/GerhardBrueckl.powerbi-vscode.svg?color=orange)](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode)

![PowerBI-VSCode](/images/PowerBI-VSCode.png?raw=true "PowerBI-VSCode")

A [VSCode](https://code.visualstudio.com/) extension for managing your Power BI tenant using the [Power BI REST API](https://docs.microsoft.com/en-us/rest/api/power-bi/).

# Installation
The extensions can be installed directly from within VSCode by searching for this extension (`GerhardBrueckl.powerbi-vscode`) or downloaded from the official Visual Studio Code extension gallery at [PowerBI VSCode](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode) and installed manually as `VSIX`.

# Features
- GUI to run operations like [rebind](https://learn.microsoft.com/en-us/rest/api/power-bi/reports/rebind-report-in-group), [clone](https://learn.microsoft.com/en-us/rest/api/power-bi/reports/clone-report-in-group), ...
- Supports VSCode and [vscode.dev](https://vscode.dev)
- Run DAX queries in a notebook against your Power BI Datasets
- Drag & Drop to run certain commands (e.g. drop a report on a dataset to rebind it)
- Work-In-Progress: UI for Capacities, Gatways and Pipelines

# Change Log

**v0.2.0**:
- changed authentication to use VSCode authentication (instead of leveraging Azure Extension)
- added support to run as Web Extensions in e.g. [vscode.dev](https://vscode.dev)

**v0.1.0**:
- added Notebook Kernel to execute DAX queries against a dataset
- using Fetch API for calls to PowerBI REST API
- minor fixes for Drag&Drop

**v0.0.5**:
- added dataset parameters
- reworkd API URL builder

**v0.0.3**:
- fix issues with Dataflows and Dashboards
- improve Drag & Drop capabilities
- add new Treeviews for Capacity, Pipelines and Gateways
- add Refresh after most actions to reflect updated objects after changes

**v0.0.2**:
- minor fixes, naming, etc.

**v0.0.1**:
- initial release

# Building Locally
1. Make sure you have installed [NodeJS](https://nodejs.org/en/) on your development workstation
2. Clone this repo to your development workstation, then open the cloned folder in [VSCode](https://code.visualstudio.com/)
3. To install all dependencies, switch to the terminal and run `npm install`
4. To run the extension in debug mode (for using break-points, etc.), press `F5`
5. To generate the `.vsix`, switch to the terminal and run `vsce package`

# VSCode Extension Development Details
Please refer to the [official docs and samples](https://github.com/microsoft/vscode-extension-samples#prerequisites)
