# PowerBI-VSCode
A VSCode extension to manage your Power BI tenant using the Power BI REST API.

# Installation
Due to a current bug in some of the Azure Extension/VSCode integration, this extension currently has a dependency to the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) `v0.9.11`. If you have installed the latest version of Azure Account extension you need to downgrade temporary to `v0.9.11` and login to Azure.

Once you are logged in with the older version, you can simply open this Power BI extension from the Activity Bar.

# Change Log

**v0.0.3**:
- fix issues with Dataflows and Dashboards
- improve Drag & Drop capabilities
- add new Treeviews for Capacity, Pipelines and Gateways
- add Refresh after most actions to reflect updated objects after changes

**v0.0.2**:
- minor fixes, naming, etc.

**v0.0.1**:
- initial release