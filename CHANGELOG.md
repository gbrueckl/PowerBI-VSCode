# Change Log

**v2.0.0**:
- added Fabric Workspace Browser`
- added feature to `Open PowerBI External Tool` configured in PowerBI Desktop with connection to online dataset preconfigured
- added new config setting `powerni.workspaceFilter` to define RegEx filters on workspace names
- added `Show Memory Statistics` for Datasets
- added support for [Long Running Operation (LRO)](https://learn.microsoft.com/en-us/rest/api/fabric/articles/long-running-operation) when calling Fabric APIs from notebooks
- added check for Dataset refreshes and whether `isRefreshable = true`

**v1.8.1**:
- fix issue with Processing of individual partitions if Incremental Refresh is configured ([#27](/../../issues/27))
- propate change decoration of Fabric items to parents

**v1.8.0**:
- reworked [Long Running Operation (LRO)](https://learn.microsoft.com/en-us/rest/api/fabric/articles/long-running-operation) in Fabric
- added support to publish changes to multiple Fabric items at once
- reworked API respnose structure

**v1.7.2**:
- removed Table name and square brackets from DAX query results in notebooks

**v1.7.1**:
- added configuration `powerbi.Fabric.itemTypes` to control which Fabric Items are downloaded with an optional format
- fixed an issue with publishing of modified items

**v1.7.0**:
- added support for creating items by creating a folder under the specific `Item Type`
- improved `Publish to Fabric` to also handle `Create Item` and `Delete Item`
- improved custom `FileDecorationProvider` to also highlight added and deleted items

**v1.6.5**:
- changed Dataset actions from hidden to disabled if they are not available (e.g. a `TakeOver` needs to be done first)
- fixed issue with `Update Parameter` if the user is not the Owner of the dataset

**v1.6.4**:
- added custom `FileDecorationProvider` to highlight changed but unpublished files in the `fabric:/` scheme

**v1.6.3**:
- added `Open in Fabric` for `fabric:/` scheme

**v1.6.2**:
- fixed issue with special characters in file and folder names when using the `fabric:/` scheme

**v1.6.1**:
- added new configiguration `powerbi.Fabric.fileFormats` to control how notebooks are exported (`.py`(default) vs. `ipynb`)

**v1.6.0**:
- added support for `Publish to Fabric` in the context-menu of the Fabric Item
- added support for `(Re)load from Fabric` in the context-menu
- fixed issue with internal files being searched in the `fabric:/` scheme

**v1.5.3**:
- fixed issue with Fabric FileSystemProvider Cachen when changing user
- fixed issue with error messages for internal files that cannot be found on the `fabric:/` scheme

**v1.5.2**:
- fixed issue with Fabric FileSystemProvider caused by special characters in the name

**v1.5.1**:
- fixed issue with Fabric FileSystemProvider caused by duplicate item names

**v1.5.0**:
- Support for Fabric via FileSystemProvider `fabric://<workspaceId>`
  - load all items with their definition
  - update and publish definition of existing items
- added support for multiselect of `Tables` and `Partitions` to process multiple at the same time
- added support to deploy local TMDL folders directly without `.publishsettings.json`
- added Drag & Drop to Power BI notebooks supporting `DAX` (tables, columns and measures)
- added dedicated languages `DAX`, `TMSL` and Power BI Notebook Command (`pbinb-cmd`) to the notebooks

**v1.4.1**:
- fixed issue with unassigned pipeline stages
- fixed issue with `Download Report`
- improved left StatusBar to show the email. The remote tenant is now only displayed in the tooltip

**v1.4.0**:
- added support to drill down into individual tables, columns, measures and partitions of a dataset from the workspace browser
- added ability to process individual tables/partitions from the UI
- improved usability of dropdowns when selecting items for various actions (e.g. Cloning a report, etc.)
- added column statistics based on DAX [`COLUMNSTATISTICS()`](https://learn.microsoft.com/en-us/dax/columnstatistics-function-dax)
- enabled `Insert Path` for all treeviews
- added `Copy ConnectionString` for datasets in Premium workspaces
- added duration for running refreshes
- added `Insert Code` for new workspace objects (`Tables`(Refreshable Object), `Partitions`(Refreshable Object), `Columns`(DAX), `Measures`(DAX))
- added support for custom API endpoints for every cell (`%dax /groups/....`)
- improved Completion Provider for API endpoints to also start when `.` is typed
- fixed issue so `%dax` also works with API sub-paths of a dataset
- added support for using variables in notebooks for all magics
- added a Statusbar at the bottom left to show the currently logged in User (+Tenant)
- fixed issue with `Open in Power BI Service` and remote tenants

**v1.3.2**:
- fixed issue with TMDL/TOM features and guest accounts

**v1.3.1**:
- fixed issue with TMDL Proxy ([#16](/../../issues/16), [#22](/../../issues/22))
- upgraded TMLD Proxy version to .NET Framework 7
- updated [TMDL Prerequisites](/README.md/#prerequisites) in README

**v1.3.0**:
- added support for `TMSL` in PBI notebooks using `%tmsl` magic
- fixed issue with `POST` in notebooks
- added autocompletion for notebook magics

**v1.2.0**:
- added support to `Download` reports via the context menu
- added support to `Upload PBIX` on a workspace
- added support for Drag & Drop of local `.pbix` files on a workspace to upload it

**v1.1.2**:
- fixed issue with delete in notebooks
- fixed issue with relative path references in notebooks
- reworked concatination of relative URLs
- fixed issue with automatically added QuickPick items

**v1.1.1**:
- Added support for Backup and Restore of datasets ([#19](/../../issues/19))
- Fixed issue with Buffer in web extension

**v1.0.1**:
- Remove Fabric internal dataflows without a name ([#13](/../../issues/13))
- Added `Copy ... to Clibpoard` commands to the context menu ([#14](/../../issues/14))
- Added `Open in Power BI Service` command to the context menu
- Added Gateway Data Sources to Gateway treeview
- Fixed issue with Web Extension and TMDLProxy
- Fixed issue when no pipelines/gateways/capacities are accessible/available

