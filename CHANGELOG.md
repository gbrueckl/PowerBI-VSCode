# Change Log

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

**v1.0.0**:
- added support for TMDL (see [TMDL requirements](/README.md#tmdl-requirements))
  - Edit, validate and publish directly from VSCode to the PBI Service!
- added Dataflow Transactions and Datasources

**v0.9.9**:
- added new commands for Datast Query Scale Out
- updated icons for Premium and PPU workspaces to easier identify them

**v0.9.8**:
- fixed issue when opening a new PBI notebook ([#10](/../../issues/10))

**v0.9.7**:
- fixed issue with dataseet refreshes and parameters ([#9](/../../issues/9))

**v0.9.6**:
- reworked how to deploy pipeline artifacts
  - added support for selective pipeline deployments
  - conditionally also update the app after the deployment
  - optionally add a note to the deployment

**v0.9.5**:
- fixed issue with dataflow refresh (thanks to [John Kerski](https://github.com/kerski))
- added `Refreshables` and `Workloads` to Capacity treeview
- added commands to context menue to assign/unassign a workspace to/from a capacity

**v0.9.4**:
- fixed issue with configuration for GCC cloud (thanks to [John Kerski](https://github.com/kerski))
- fixed issue with dataflows not being displayed (thanks to [John Kerski](https://github.com/kerski))
- completely reworked Drag & Drop capabilities to also support cross-treeview operations
  - drag a workspace onto a pipeline stage to assign it
  - drag a workspace to a capacity to assign that capacity to the workspace
- added `Add` and `Delete` capabilities for Deployment Pipelines

**v0.9.3**:
- added support for governmental and sovereign clouds via new setting `powerbi.cloud`
- minor improvements for tooltips in treeviews

**v0.9.1**:
- improved `Update Parameter(s)` capailities
- improved completion provider
- some minor bugfixes

**v0.9.0**:
- added better support for deployment pipelines
  - start full and selective deployments
  - show operations
  - show artifacts
- improved completion provider to also support examples

**v0.8.5**:
- added support for [Enhanced Refresh API](https://learn.microsoft.com/en-us/power-bi/connect-data/asynchronous-refresh) via UI

**v0.8.4**:
- fix issue with error handling in notebooks (e.g. invalid endpoint etc.)
- added details for list items display in completion item

**v0.8.2**:
- fix issue with `New PowerBI Notebook`
- fix issues with `Refresh` commands
- fix issue when account token was renewed

**v0.8.0**:
- added new PowerBI Notebook type

**v0.5.0**:
- reworked notebook integration for `%api` magic
  - added generic notebook on root path
  - added support for relative paths using `./<absolute path>`
  - added support for absolute paths using `/<absolute path>`
  - added JSON array table output if the API returns a list of values

**v0.4.1**:
- fixed issue with Pipelines and Stages

**v0.4.0**:
- added support for arbitrary REST API calls in a notebook using `%api` magic

**v0.3.0**:
- changed authentication happen in the background and automatically reuse it without a prompt

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
- initial releas
