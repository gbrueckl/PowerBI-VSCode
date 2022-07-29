# PowerBI-VSCode
A [VSCode](https://code.visualstudio.com/) extension for managing your Power BI tenant using the [Power BI REST API](https://docs.microsoft.com/en-us/rest/api/power-bi/).

# Installation
> **Note: Due to a current bug in some of the Azure Extension/VSCode integration, this extension currently has a dependency to the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) `v0.9.11`. If you have installed the latest version of Azure Account extension, you will need to downgrade temporarily to `v0.9.11` and login to Azure from there.**
> 
> Once you are logged in with the older version of the Azure Account extension, you can simply open the Power BI VSCode extension from the Activity Bar.
1. Download [the latest published VSIX directly from the VSCode Gallery](https://marketplace.visualstudio.com/items?itemName=GerhardBrueckl.powerbi-vscode) -- just click the "Download Extension" link under the Resources heading on the right side of the page
2. In [VSCode](https://code.visualstudio.com/), open the Command Palette (`Ctrl+Shift+P`) and type `Install from VSIX`, then select the menu option that appears below.
![image](https://user-images.githubusercontent.com/37491308/181848291-e956cca0-40f0-4ce6-86a5-06b76f548cef.png)
3. Browse to your Downloads folder and select the `.vsix` file you just downloaded

# Building Locally
1. Make sure you have installed [NodeJS](https://nodejs.org/en/) on your development workstation
2. Clone this repo to your development workstation, then open the cloned folder in [VSCode](https://code.visualstudio.com/)
3. To install all dependencies, switch to the terminal and run `npm install`
4. To run the extension in debug mode (for using break-points, etc.), press `F5`
5. To generate the `.vsix`, switch to the terminal and run `vsce package`

# VSCode Extension Development Details
Please refer to the [official docs and samples](https://github.com/microsoft/vscode-extension-samples#prerequisites)
