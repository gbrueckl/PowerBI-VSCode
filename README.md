# PowerBI-VSCode
[![Version](https://img.shields.io/visual-studio-marketplace/v/GerhardBrueckl.powerbi-vscode)](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/GerhardBrueckl.powerbi-vscode)](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/GerhardBrueckl.powerbi-vscode)](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode)
[![Ratings](https://img.shields.io/visual-studio-marketplace/r/GerhardBrueckl.powerbi-vscode)](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode)

![PowerBI-VSCode](/images/PowerBI-VSCode.png?raw=true "PowerBI-VSCode")

A [VSCode](https://code.visualstudio.com/) extension for managing your Power BI tenant using the [Power BI REST API](https://docs.microsoft.com/en-us/rest/api/power-bi/).

# Installation
The extensions can be installed directly from within VSCode by searching for this extension (`GerhardBrueckl.powerbi-vscode`) or downloaded from the official Visual Studio Code extension gallery at [PowerBI VSCode](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode) and installed manually as `VSIX`.

# Features
- GUI to run operations like [rebind](https://learn.microsoft.com/en-us/rest/api/power-bi/reports/rebind-report-in-group), [clone](https://learn.microsoft.com/en-us/rest/api/power-bi/reports/clone-report-in-group), ...
- Supports VSCode and [vscode.dev](https://vscode.dev)
- Connect to remote tenants where you are invited as a guest user - see [Configuration](#configuration)
- Run DAX queries in a notebook against your Power BI Datasets using `%dax` magic
- Run arbitrary REST API calls in a notebook using `%api` magic - see [Notebooks](#notebooks)
- Drag & Drop to run certain commands (e.g. drop a report on a dataset to rebind it)
- UI for Capacities, Gatways and Pipelines

# Configuration
The extension supports the following VSCode settings:

|Setting|Description|Example value|
|-------|-----------|-------------|
|`powerbi.tenantId`|The tenant ID of the remote tenant that you want to connect to.|A GUID, `abcd1234-1234-5678-9abcd-9d1963e4b9f5`|
|`powerbi.clientId`|(Optional) A custom ClientID/Application of an AAD application to use when connecting to Power BI.|A GUID, `99887766-1234-5678-9abcd-e4b9f59d1963`|
|`powerbi.cloud`|(Optional) Only use when you want to connect to a sovereign or governmental cloud!|GlobalCloud|

# Notebooks
You can open a new Power BI notebook via the UI from the header of each treeview or by running the command __Open new PowerBI Notebook__ (command `PowerBI.openNewNotebook`). Power BI notebooks have the file extension `.pbinb` and will automatically open in the notebook editor.

There are two core features of notebooks:
- running arbitrary REST API calls
- executing DAX queries against a dataset

## Run REST API calls
To run a REST API call from the notebook you can simply write the following:

``` rest
METHOD endpoint
{JSON-Body}
```

For example to create a new dashboard in _My Workspace_ you can run the following command:

``` rest
POST /dashboards
{
  "name": "SalesMarketing"
}
```

The JSON-body can also be omitted, e.g. for a GET request.
Supported METHODs are `GET`, `POST`, `PUT`, `PATCH` and `DELETE`. the _endpoint_ can either be relative (e.g. `/dashboards`) or absolute (e.g. `https://api.powerbi.com/v1.0/myorg/dashboards`)

## Execute DAX queries
To run a DAX query from within the notebook, you have to use the cell magic `%dax` in the very first line of your cell. The following lines will contain the actual DAX query:

``` dax
%dax
EVALUATE MyTable
```

For this to work, you first need to set the variable `DATASET` in your notebook before - see [Using Variables](#using-variables) below.

## Using variables
You can also define and use variables within the notebook. To set a variable you can use

``` bash
%cmd
MY_VARIABLE = my_value
```

There are some special variables that must be set in combination with `%dax` magic to identify the dataset. The main variable that needs to be set is the `DATASET` (aliases are also `DATASET_PATH` or `API_ROOT_PATH`) to identify the dataset to which the DAX query is sent. the value has to be an API path pointing to the dataset:

``` bash
%cmd
SET DATASET = /groups/d1f70e51-1234-1234-8e4c-55f35f9fa758/datasets/028d20ca-7777-8888-9999-7a253c7bb6b3
```

Current values of variables can be retrieved by running `SET MY_VARIABLE`.

**Note:** you can also set/get multiple variables within the same notebook cell!

# TMDL requirements
The following prerequisites have to be fulfilled to use all TMDL features:

- make sure that the VSCode Setting `powerbi.clientId` is set to either `058487e5-bde7-4aba-a5dc-2f9ac58cb668` or a custom AAD Application configured as described below:
  - Redirect URIs for Mobile and desktop applications: `https://vscode.dev/redirect`
  - Delegated Permissions: All PowerBI permissions
- [ASP.NET Core Runtime 7.0.10](https://dotnet.microsoft.com/en-us/download/dotnet/7.0) (or higher)

# Building Locally
1. Make sure you have installed [NodeJS](https://nodejs.org/en/) on your development workstation
2. Clone this repo to your development workstation, then open the cloned folder in [VSCode](https://code.visualstudio.com/)
3. Install Visual Studio Code Extension Manager by running `npm install @vscode/vsce -g --force`
4. To install all dependencies, switch to the terminal and run `npm install`
5. To run the extension in debug mode (for using break-points, etc.), press `F5`
6. To generate the `.vsix`, switch to the terminal and run `vsce package`

# VSCode Extension Development Details
Please refer to the [official docs and samples](https://github.com/microsoft/vscode-extension-samples#prerequisites)
