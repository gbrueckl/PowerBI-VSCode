# Change Log

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
