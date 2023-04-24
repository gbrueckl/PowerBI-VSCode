/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

type UtilRequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Power BI endorsement details */
export interface EndorsementDetails {
  /** The endorsement status */
  endorsement?: string;
  /** The user that certified the Power BI item (such as a report or a dashboard) */
  certifiedBy?: string;
}

/** Data source usage */
export interface DatasourceUsage {
  /**
   * The data source instance ID
   * @format uuid
   */
  datasourceInstanceId: string;
}

/** Sensitivity label info for a Power BI item (such as a report or a dashboard) */
export interface SensitivityLabel {
  /**
   * The sensitivity label ID
   * @format uuid
   */
  labelId: string;
}

/** A modified workspace */
export interface ModifiedWorkspace {
  /**
   * The workspace object ID
   * @format uuid
   */
  Id: string;
}

/** A scan request */
export interface ScanRequest {
  /**
   * The scan ID
   * @format uuid
   */
  id?: string;
  /**
   * The scan creation date and time
   * @format date-time
   */
  createdDateTime?: string;
  /** The scan state */
  status?: string;
  /** The scan error (if any) */
  error?: PowerBIApiErrorResponseDetail;
}

/** Detailed information about a Power BI error response */
export interface PowerBIApiErrorResponseDetail {
  /** The error code */
  code?: string;
  /** The error message */
  message?: string;
  /** The error target */
  target?: string;
}

/** A required workspaces request */
export interface RequiredWorkspaces {
  /** The required workspace IDs to be scanned (supports 1 to 100 workspace IDs) */
  workspaces?: string[];
}

/** Workspace info response */
export interface WorkspaceInfoResponse {
  /** The workspace info associated with this scan */
  workspaces?: WorkspaceInfo[];
  /** The data source instances associated with this scan */
  datasourceInstances?: Datasource[];
  /** The data source misconfigured instances associated with this scan */
  misconfiguredDatasourceInstances?: Datasource[];
}

/** Workspace info details */
export interface WorkspaceInfo {
  /**
   * The workspace object ID
   * @format uuid
   */
  id: string;
  /** The workspace name */
  name?: string;
  /** The workspace description */
  description?: string;
  /** The workspace type */
  type?: string;
  /** The workspace state */
  state?: string;
  /** The workspace data retrieval state */
  dataRetrievalState?: string;
  /** Whether the workspace is assigned to a dedicated capacity */
  isOnDedicatedCapacity?: boolean;
  /** The workspace capacity ID */
  capacityId?: string;
  /** The reports associated with this workspace. The list of report properties returned varies for different API calls, so you might not see all report properties in an API response. */
  reports?: WorkspaceInfoReport[];
  /** The dashboards associated with this workspace. The list of dashboard properties returned varies for different API calls, so you might not see all dashboard properties in an API response. */
  dashboards?: WorkspaceInfoDashboard[];
  /** The datasets associated with this workspace. The list of dataset properties returned varies for different API calls, so you might not see all dataset properties in an API response. */
  datasets?: WorkspaceInfoDataset[];
  /** The dataflows associated with this workspace. The list of dataflow properties returned varies for different API calls, so you might not see all dataflow properties in an API response. */
  dataflows?: WorkspaceInfoDataflow[];
  /** The datamarts associated with this workspace. The list of datamart properties returned varies for different API calls, so you might not see all datamart properties in an API response. */
  datamarts?: WorkspaceInfoDatamart[];
  /** The users with access to the workspace. The list is returned only when explicitly requested. To retrieve a list of users for a classic workspace, use the Azure Active Directory Graph API. */
  users?: GroupUser[];
}

/** The import object */
export interface Import {
  /**
   * The import ID
   * @format uuid
   */
  id: string;
  /** The import name */
  name?: string;
  /** The import upload state */
  importState?: "Publishing" | "Succeeded" | "Failed";
  /** The reports associated with this import */
  reports?: Report[];
  /** The datasets associated with this import */
  datasets?: Dataset[];
  /**
   * Import creation date and time
   * @format date-time
   */
  createdDateTime?: string;
  /**
   * Import last update date and time
   * @format date-time
   */
  updatedDateTime?: string;
}

/** The information about the import */
export interface ImportInfo {
  /** The path of the OneDrive for Business Excel (.xlsx) file to import, which can be absolute or relative. Power BI .pbix files aren't supported. */
  filePath?: string;
  /** The import connection type for a OneDrive for Business file */
  connectionType?: "import" | "connect";
  /** The shared access signature URL of the temporary blob storage used to import large Power BI .pbix files between 1 GB and 10 GB in size. */
  fileUrl?: string;
}

/** A dataset OData list wrapper */
export interface Datasets {
  /** OData context */
  "odata.context"?: string;
  /** The datasets */
  value?: Dataset[];
}

/** A dataset odata list wrapper */
export interface AdminDatasets {
  /** OData context */
  "odata.context"?: string;
  /** The datasets */
  value?: AdminDataset[];
}

/** A list of navigation related properties of a dataset. */
export interface DatasetNavigationProperties {
  /** The dataset create report embed URL */
  CreateReportEmbedURL?: string;
  /** The dataset Q&A embed URL */
  QnaEmbedURL?: string;
  /** The web URL of the dataset */
  webUrl?: string;
}

/** A Power BI dataset. The API returns a subset of the following list of dataset properties. The subset depends on the API called, caller permissions, and the availability of the data in the Power BI database. */
export interface DatasetBaseProperties {
  /** The dataset ID */
  id: string;
  /** The dataset name */
  name?: string;
  /** The dataset owner */
  configuredBy?: string;
  /**
   * The dataset creation date and time
   * @format date-time
   */
  CreatedDate?: string;
  /** The content provider type for the dataset */
  ContentProviderType?: string;
  /** The dataset description */
  description?: string;
  /** The list of all the dataflows this item depends on */
  upstreamDataflows?: DependentDataflow[];
}

/** A list of miscellaneous properties returned for a dataset. Returned by User and Admin APIs. */
export interface DatasetMiscProperties {
  /** Whether the dataset allows adding new rows */
  addRowsAPIEnabled?: boolean;
  /** Whether the dataset is refreshable or not. A Power BI refreshable dataset is a dataset that has been refreshed at least once, or for which a valid refresh schedule exists. */
  IsRefreshable?: boolean;
  /** Whether the dataset can be shared with external users to be consumed in their own tenant */
  IsInPlaceSharingEnabled?: boolean;
}

/** A list of security related properties of a Power BI dataset. */
export interface DatasetSecurityProperties {
  /** Whether the dataset requires an effective identity, which you must send in a [GenerateToken](/rest/api/power-bi/embed-token/generate-token) API call. */
  IsEffectiveIdentityRequired?: boolean;
  /** Whether row-level security is defined inside the Power BI .pbix file. If so, you must specify a role. */
  IsEffectiveIdentityRolesRequired?: boolean;
  /** Whether the dataset requires an on-premises data gateway */
  IsOnPremGatewayRequired?: boolean;
  /** Dataset encryption information. Only applicable when `$expand` is specified. */
  Encryption?: Encryption;
}

export interface DatasetUserProperties {
  /** (Empty value) The dataset user access details. This property will be removed from the payload response in an upcoming release. You can retrieve user information on a Power BI item (such as a report or a dashboard) by using the [Get Dataset Users as Admin](/rest/api/power-bi/admin/datasets-get-dataset-users-as-admin) API, or the [PostWorkspaceInfo](/rest/api/power-bi/admin/workspace-info-post-workspace-info) API with the `getArtifactUsers` parameter. */
  users?: DatasetUser[];
}

/** A list of properties related to the schema of the dataset. */
export interface DatasetSchemaProperties {
  /** The dataset tables */
  tables?: Table[];
  /** The dataset schema retrieval error */
  schemaRetrievalError?: string;
  /** Whether the dataset schema might not be up to date */
  schemaMayNotBeUpToDate?: boolean;
  /** The dataset expressions */
  expressions?: Expression[];
}

export interface DatasetStorageMode {
  /** The dataset storage mode */
  targetStorageMode?: string;
}

export interface DatasetWorkspaceIdProperty {
  /**
   * The dataset workspace ID. This property will be returned only in GetDatasetsAsAdmin.
   * @format uuid
   */
  workspaceId?: string;
}

/** Update dataset request */
export type UpdateDatasetRequest = DatasetStorageMode;

export interface UpstreamDatasetsProperties {
  /** The upstream datasets */
  upstreamDatasets?: DependentDataset[];
  /** The list of all the datamarts this item depends on */
  upstreamDatamarts?: DependentDatamart[];
}

/** A Power BI dataset. The API returns a subset of the following list of dataset properties. The subset depends on the API called, caller permissions, and the availability of the data in the Power BI database. */
export type Dataset = DatasetBaseProperties &
  DatasetNavigationProperties &
  DatasetSecurityProperties &
  DatasetUserProperties &
  DatasetMiscProperties &
  DatasetStorageMode;

/** A Power BI dataset returned by Admin APIs. The API returns a subset of the following list of dataset properties. The subset depends on the API called, caller permissions, and the availability of the data in the Power BI database. */
export type AdminDataset = DatasetBaseProperties &
  DatasetNavigationProperties &
  DatasetSecurityProperties &
  DatasetUserProperties &
  DatasetMiscProperties &
  DatasetStorageMode &
  DatasetWorkspaceIdProperty;

/** A Power BI dataset returned by WorkspaceInfo APIs. The API returns a subset of the following list of dataset properties. The subset depends on the API called, caller permissions, and the availability of the data in the Power BI database. */
export type WorkspaceInfoDataset = DatasetBaseProperties &
  DatasetSchemaProperties &
  EndorsmentProperties &
  SensitivityProperties &
  DatasetStorageMode &
  WorkspaceInfoDataflowProperties &
  UpstreamDatasetsProperties &
  DatasetUserProperties;

/** Encryption information for a dataset */
export interface Encryption {
  /** Dataset encryption status */
  EncryptionStatus?: "Unknown" | "NotSupported" | "InSyncWithWorkspace" | "NotInSyncWithWorkspace";
}

/** A Power BI dataset */
export interface CreateDatasetRequest {
  /** The dataset name */
  name: string;
  /** The dataset tables */
  tables: Table[];
  /** The dataset relationships */
  relationships?: Relationship[];
  /** The data sources associated with this dataset */
  datasources?: Datasource[];
  /** The dataset mode or type */
  defaultMode?: "AsAzure" | "AsOnPrem" | "Push" | "Streaming" | "PushStreaming";
}

/** A dataset table */
export interface Table {
  /**
   * The table name
   * @pattern ^[\x09\x0A\x0D\x20\x23\x2D\x30-\x39\x40-\x5A\x5E-\x5F\x61-\x7A\x7E-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]{1,100}$
   */
  name: string;
  /** The column schema for this table */
  columns: Column[];
  /** The data rows within this table */
  rows?: Row[];
  /** The measures within this table */
  measures?: Measure[];
  /** Optional. Whether this dataset table is hidden. */
  isHidden?: boolean;
  /** The table description */
  description?: string;
  /** The table source */
  source?: ASMashupExpression[];
}

/** A dataset expression */
export interface Expression {
  /** A dataset table source */
  expression: ASMashupExpression;
  /** The expression name */
  name?: string;
  /** The expression description */
  description?: string;
}

/** A dataset table source */
export interface ASMashupExpression {
  /** The source expression */
  expression: string;
}

export interface PostRowsRequest {
  /** An array of data rows pushed to a dataset table. Each element is a collection of properties represented using key-value format. */
  rows?: object[];
}

/** The OData response wrapper for a list of Power BI dependent dataflows */
export interface DependentDataflows {
  "odata.context"?: string;
  /** The dependent dataflows */
  value?: DependentDataflow[];
}

/** The OData response wrapper for a list of Power BI dependent datasets */
export interface DependentDatasets {
  "odata.context"?: string;
  /** The dependent datasets */
  value?: DependentDataset[];
}

/** The OData response wrapper for a list of Power BI dataset to dataflow links */
export interface DatasetToDataflowLinksResponse {
  "odata.context"?: string;
  /** The dataset to dataflow links  */
  value?: DatasetToDataflowLinkResponse[];
}

/** A relationship between tables in a dataset */
export interface Relationship {
  /**
   * The relationship name and identifier
   * @pattern ^[\x09\x0A\x0D\x20\x23\x2D\x30-\x39\x40-\x5A\x5E-\x5F\x61-\x7A\x7E-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]{1,100}$
   */
  name: string;
  /**
   * The filter direction of the relationship
   * @default "OneDirection"
   */
  crossFilteringBehavior?: "OneDirection" | "BothDirections" | "Automatic";
  /**
   * The name of the foreign key table
   * @pattern ^[\x09\x0A\x0D\x20\x23\x2D\x30-\x39\x40-\x5A\x5E-\x5F\x61-\x7A\x7E-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]{1,100}$
   */
  fromTable: string;
  /**
   * The name of the foreign key column
   * @pattern ^[\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]+$
   */
  fromColumn: string;
  /**
   * The name of the primary key table
   * @pattern ^[\x09\x0A\x0D\x20\x23\x2D\x30-\x39\x40-\x5A\x5E-\x5F\x61-\x7A\x7E-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]{1,100}$
   */
  toTable: string;
  /**
   * The name of the primary key column
   * @pattern ^[\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]+$
   */
  toColumn: string;
}

/** A Power BI data source */
export interface Datasource {
  /** (Deprecated) The data source name. Available only for DirectQuery. */
  name?: string;
  /** (Deprecated) The data source connection string. Available only for DirectQuery. */
  connectionString?: string;
  /** The data source type */
  datasourceType?: string;
  /** The data source connection details */
  connectionDetails?: DatasourceConnectionDetails;
  /**
   * The bound gateway ID, which is empty when not bound to a gateway. When using a gateway cluster, the gateway ID refers to the primary (first) gateway in the cluster and is similar to the gateway cluster ID.
   * @format uuid
   */
  gatewayId?: string;
  /**
   * The bound data source ID, which is empty when not bound to a gateway
   * @format uuid
   */
  datasourceId?: string;
}

/** The Power BI data source connection details. See examples in [Get Datasources](/rest/api/power-bi/datasets/get-datasources#examples) or [Get Datasources In Group](/rest/api/power-bi/datasets/get-datasources-in-group#examples). */
export interface DatasourceConnectionDetails {
  /** The connection server */
  server?: string;
  /** The connection database */
  database?: string;
  /** The connection URL */
  url?: string;
  /** The connection path */
  path?: string;
  /** The connection kind */
  kind?: string;
  /** The connection account */
  account?: string;
  /** The connection domain */
  domain?: string;
  /** The connection email address */
  emailAddress?: string;
  /** The connection login server */
  loginServer?: string;
  /** The connection class information */
  classInfo?: string;
}

/** Power BI dataset data sources update request */
export interface UpdateDatasourcesRequest {
  /** An array of data source connection update requests */
  updateDetails: UpdateDatasourceConnectionRequest[];
}

/** Power BI dataset data source connection update request */
export interface UpdateDatasourceConnectionRequest {
  /** The target connection details of the updated data source */
  connectionDetails: DatasourceConnectionDetails;
  /** The connection details of the data source that needs update. This is mandatory when a dataset has more than one data source. */
  datasourceSelector?: Datasource;
}

/** A dataset column */
export interface Column {
  /**
   * The column name
   * @pattern ^[\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]+$
   */
  name: string;
  /** The column data type */
  dataType: string;
  /** Optional. The format of the column as specified in [FORMAT_STRING](https://docs.microsoft.com/analysis-services/multidimensional-models/mdx/mdx-cell-properties-format-string-contents). */
  formatString?: string;
  /** Optional. String name of a column in the same table to be used to order the current column. */
  sortByColumn?: string;
  /** Optional. The string value to be used for the data category which describes the data within this column. */
  dataCategory?: string;
  /** Optional. Whether the column is hidden. The default is `false`. */
  isHidden?: boolean;
  /** Optional. The aggregate function to use for summarizing this column. */
  summarizeBy?: string;
}

/** A data row in a dataset */
export interface Row {
  /** The unique row ID */
  id?: string;
}

/** A Power BI measure */
export interface Measure {
  /**
   * The measure name
   * @pattern ^[\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]+$
   */
  name: string;
  /** A valid DAX expression */
  expression: string;
  /** Optional. A string describing how the value should be formatted when it's displayed as specified in [FORMAT_STRING](https://docs.microsoft.com/analysis-services/multidimensional-models/mdx/mdx-cell-properties-format-string-contents). */
  formatString?: string;
  /** Optional. The measure description. */
  description?: string;
  /** Optional. Whether the measure is hidden. */
  isHidden?: boolean;
}

/** The OData response wrapper for a Power BI table collection */
export interface Tables {
  /** OData context */
  "odata.context"?: string;
  /** The Power BI tables */
  value?: Table[];
}

/** The OData response wrapper for a Power BI gateway data source collection */
export interface GatewayDatasources {
  /** OData context */
  "odata.context"?: string;
  /** The list of gateway data sources */
  value?: GatewayDatasource[];
}

/** A Power BI gateway data source */
export interface GatewayDatasource {
  /**
   * The unique ID for the data source
   * @format uuid
   */
  id: string;
  /**
   * The associated gateway ID. When using a gateway cluster, the gateway ID refers to the primary (first) gateway in the cluster and is similar to the gateway cluster ID.
   * @format uuid
   */
  gatewayId: string;
  /** The name of the data source */
  datasourceName?: string;
  /**
   * The type of [data source](/power-bi/connect-data/power-bi-data-sources).
   *
   *
   * | API name for the data source | | |
   * |-|-|-|
   * | ActiveDirectory | AdobeAnalytics | AdoDotNet |
   * | AnalysisServices | AzureBlobs | AzureDataLakeStorage |
   * | AzureMarketplace | AzureTables | BizTalk |
   * | CDPA | CustomConnector | CustomHttpApi |
   * | DB2 | Essbase | EventHub |
   * | Excel | Exchange | Extension |
   * | Facebook | File | Folder |
   * | GoogleAnalytics | Hdfs | HDInsight |
   * | Informix | MQ | MySql |
   * | OData | ODBC | OleDb |
   * | Oracle | PostgreSql | PowerQueryMashup
   * | PubNub | Salesforce | SAPBW |
   * | SAPBWMessageServer | SapErp | SAPHana |
   * | SharePoint | SharePointDocLib | SharePointList |
   * | Sql | Sybase | Teradata |
   * | UIFlow | Web |
   */
  datasourceType?: string;
  /** Connection details in JSON format */
  connectionDetails?: string;
  /** The type of data source [credential](/power-bi/developer/embedded/configure-credentials) */
  credentialType: "Basic" | "Windows" | "Anonymous" | "OAuth2" | "Key" | "SAS";
  /** The connection details for the data source that needs update. The connection details are mandatory when the dataset has more than one data source. */
  credentialDetails?: GatewayDatasourceCredentialDetails;
}

/** A Power BI dependent dataflow */
export interface DependentDataflow {
  /** The target dataflow ID */
  targetDataflowId?: string;
  /** The target group ID */
  groupId?: string;
}

/** A Power BI dependent datamart */
export interface DependentDatamart {
  /** The target datamart ID */
  targetDatamartId?: string;
  /** The target group ID */
  groupId?: string;
}

/** A Power BI dependent dataset */
export interface DependentDataset {
  /** The target dataset ID */
  targetDatasetId?: string;
  /** The target group ID */
  groupId?: string;
}

/** A Power BI dataset to dataflow link */
export interface DatasetToDataflowLinkResponse {
  /** The dataset object ID */
  datasetObjectId?: string;
  /** The dataflow object ID */
  dataflowObjectId?: string;
  /** The workspace object ID */
  workspaceObjectId?: string;
}

/** The OData response wrapper for a Power BI data source collection */
export interface Datasources {
  /** OData context */
  "odata.context"?: string;
  /** The data source collection */
  value?: Datasource[];
}

/** The OData response wrapper for a Power BI report collection */
export interface Reports {
  /** OData context */
  "odata.context"?: string;
  /** The report collection */
  value?: Report[];
}

/** OData response wrapper for a Power BI Admin report collection */
export interface AdminReports {
  /** OData context */
  "odata.context"?: string;
  /** The report collection */
  value?: AdminReport[];
}

/** The OData response wrapper for a Power BI page collection */
export interface Pages {
  /** OData context */
  "odata.context"?: string;
  /** The page collection */
  value?: Page[];
}

/** The OData response wrapper for a Power BI dashboard collection */
export interface Dashboards {
  /** OData context */
  "odata.context"?: string;
  /** The dashboard collection */
  value?: Dashboard[];
}

/** The OData response wrapper for a Power BI dashboard collection */
export interface AdminDashboards {
  /** OData context */
  "odata.context"?: string;
  /** The dashboard collection */
  value?: AdminDashboard[];
}

/** The OData response wrapper for a Power BI dashboard collection */
export interface WorkspaceInfoDashboards {
  /** OData context */
  "odata.context"?: string;
  /** The dashboard collection */
  value?: WorkspaceInfoDashboard[];
}

/** The OData response wrapper for a Power BI tile collection */
export interface Tiles {
  /** OData context */
  "odata.context"?: string;
  /** The tile collection */
  value?: Tile[];
}

/** The OData response wrapper for a Power BI tile collection */
export interface AdminTiles {
  /** OData context */
  "odata.context"?: string;
  /** The tile collection */
  value?: AdminTile[];
}

/** The OData response wrapper for a Power BI tile collection */
export interface WorkspaceInfoTiles {
  /** OData context */
  "odata.context"?: string;
  /** The tile collection */
  value?: WorkspaceInfoTile[];
}

/** The OData response wrapper for a Power BI import collection */
export interface Imports {
  /** OData context */
  "odata.context"?: string;
  /** The import collection */
  value?: Import[];
}

/** The OData response wrapper for a list of Power BI groups */
export interface Groups {
  /** OData context */
  "odata.context"?: string;
  /** The list of groups */
  value?: Group[];
}

/** The OData response wrapper for a list of Power BI groups returned by Admin APIs */
export interface AdminGroups {
  /** OData context */
  "odata.context"?: string;
  /** The list of groups */
  value?: AdminGroup[];
}

/** The OData response wrapper for a list of Power BI installed apps */
export interface Apps {
  /** OData context */
  "odata.context"?: string;
  /** The list of installed apps */
  value?: App[];
}

/** The OData response wrapper for a list of Power BI installed apps for Admin APIs */
export interface AdminApps {
  /** OData context */
  "odata.context"?: string;
  /** The list of installed apps */
  value?: AdminApp[];
}

/** The OData response wrapper for a list of Power BI gateways */
export interface Gateways {
  "odata.context"?: string;
  /** The list of gateways */
  value?: Gateway[];
}

/** The OData response wrapper for a Power BI refresh history list */
export interface Refreshes {
  "odata.context"?: string;
  /** The refresh history list */
  value?: Refresh[];
}

/** The OData response wrapper for a list of Power BI users with access to a data source */
export interface DatasourceUsers {
  "odata.context"?: string;
  /** The list of users with access to a data source */
  value?: DatasourceUser[];
}

/** The OData response wrapper for a list of Power BI users with access to a workspace */
export interface GroupUsers {
  "odata.context"?: string;
  /** The list of users with access to a workspace */
  value?: GroupUser[];
}

/** The OData response wrapper for a list of Power BI users with access to an app */
export interface AppUsers {
  "odata.context"?: string;
  /** The list of users with access to an app */
  value?: AppUser[];
}

/** The OData response wrapper for a list of Power BI users with access to a capacity */
export interface CapacityUsers {
  "odata.context"?: string;
  /** The list of users with access to a capacity */
  value?: CapacityUser[];
}

/** The OData response wrapper for a list of Power BI users with access to a report */
export interface ReportUsers {
  "odata.context"?: string;
  /** The list of users with access to a report */
  value?: ReportUser[];
}

/** The OData response wrapper for a list of Power BI users with access to a dashboard */
export interface DashboardUsers {
  "odata.context"?: string;
  /** The list of users with access to a dashboard */
  value?: DashboardUser[];
}

/** The OData response wrapper for a list of Power BI users with access to a dataset */
export interface DatasetUsers {
  "odata.context"?: string;
  /** The list of users with access to a dataset */
  value?: DatasetUser[];
}

/** The OData response wrapper for a list of Power BI principals with access to a dataset */
export interface DatasetUsersAccess {
  "odata.context"?: string;
  /** The list of users with access to a dataset */
  value?: DatasetUserAccess[];
}

/** The OData response wrapper for a list of Power BI users with access to a dataflow */
export interface DataflowUsers {
  "odata.context"?: string;
  /** The list of users with access to a dataflow */
  value?: DataflowUser[];
}

/** The OData response wrapper for a list of Power BI items (such as reports or dashboards) that a user can access */
export interface ArtifactAccessResponse {
  "odata.context"?: string;
  /** The list of Power BI items that a user can access */
  artifactAccessEntities?: ArtifactAccessEntry[];
  /** The URI of the next chunk in the result set */
  continuationUri?: string;
  /** The token for the next chunk in the result set */
  continuationToken?: string;
}

/** A list of properties returned for a Power BI item (such as a report or a dashboard) by WorkspaceInfo APIs */
export interface EndorsmentProperties {
  /** The endorsement details */
  endorsementDetails?: EndorsementDetails;
}

/** A list of properties returned for a Power BI item (such as a report or a dashboard) by WorkspaceInfo APIs */
export interface SensitivityProperties {
  /** The sensitivity label */
  sensitivityLabel?: SensitivityLabel;
}

/** OData response wrapper for a Power BI subscriptions for user */
export interface SubscriptionsByUserResponse {
  "odata.context"?: string;
  /** The subscriptions for user */
  subscriptionEntities?: Subscription[];
  /** The URI for the next chunk in the result set */
  continuationUri?: string;
  /** Token to get the next chunk of the result set */
  continuationToken?: string;
}

/** Power BI report common properties. The API returns a subset of the following list of report properties. The subset depends on the API called, caller permissions, and the availability of data in the Power BI database. */
export interface ReportBaseProperties {
  /**
   * The report ID
   * @format uuid
   */
  id: string;
  /** The name of the report */
  name?: string;
  /** The dataset ID of the report */
  datasetId?: string;
  /** The app ID, returned only if the report belongs to an app */
  appId?: string;
  /** The report description */
  description?: string;
  /** The report type */
  reportType?: "PaginatedReport";
}

/** A list of navigation related properties of a report. */
export interface ReportNavigationProperties {
  /** The web URL of the report */
  webUrl?: string;
  /** The embed URL of the report */
  embedUrl?: string;
}

export interface ReportAuthoringProperties {
  /** The report owner. Available only for reports created after June 2019. */
  createdBy?: string;
  /** The last user that modified the report */
  modifiedBy?: string;
  /**
   * The report creation date and time
   * @format date-time
   */
  createdDateTime?: string;
  /**
   * The date and time that the report was last modified
   * @format date-time
   */
  modifiedDateTime?: string;
}

export interface ReportAuthoringPropertiesById {
  /** The ID of the report owner. Available only for reports created after June 2019. */
  createdById?: string;
  /** The ID of the last user that modified the report */
  modifiedById?: string;
}

export interface ReportUserProperties {
  /** (Empty value) The user access details for a Power BI report. This property will be removed from the payload response in an upcoming release. You can retrieve user information on a Power BI report by using the [Get Report Users as Admin](/rest/api/power-bi/admin/reports-get-report-users-as-admin) API call, or the [PostWorkspaceInfo](/rest/api/power-bi/admin/workspace-info-post-workspace-info) API call with the `getArtifactUsers` parameter. */
  users?: ReportUser[];
}

export interface ReportWorkspaceIdProperty {
  /**
   * The report workspace ID. This property will be returned only in GetReportsAsAdmin.
   * @format uuid
   */
  workspaceId?: string;
}

/** Power BI datamart common properties. The API returns a subset of the following list of datamart properties. The subset depends on the API called, caller permissions, and the availability of data in the Power BI database. */
export interface DatamartBaseProperties {
  /**
   * The datamart ID
   * @format uuid
   */
  id: string;
  /** The datamart name */
  name?: string;
  /** The datamart description */
  description?: string;
  /** The datamart type */
  type?: "Unset" | "Ignore" | "Sql" | "Lakehouse" | "Dataverse" | "Datawarehouse";
  /** The datamart status */
  status?: "Invalid" | "Available" | "SuspendedInCriticalPhase" | "InProgress" | "Error" | "OutOfRegion" | "NoCapacity";
  /** The datamart current state */
  state?: "Invalid" | "Initialized" | "Active" | "Migrating" | "Evicted" | "Deleted";
  /** datamart suspended batch id */
  suspendedBatchId?: string;
}

export interface DatamartAuthoringProperties {
  /** The last user that modified the datamart */
  modifiedBy?: string;
  /**
   * The date and time that the datamart was last modified
   * @format date-time
   */
  modifiedDateTime?: string;
  /** The name of the datamart owner */
  configuredBy?: string;
}

export interface DatamartAuthoringPropertiesById {
  /** The ID of the last user that modified the datamart */
  modifiedById?: string;
  /** The ID of the datamart owner */
  configuredById?: string;
}

export interface DatamartUpstreamProperties {
  /** The list of all the dataflows this item depends on */
  upstreamDataflows?: DependentDataflow[];
  /** The list of all the datamarts this item depends on */
  upstreamDatamarts?: DependentDatamart[];
}

export interface DatamartDatasourceUsagesProperties {
  /** The data source usages */
  datasourceUsages?: DatasourceUsage[];
}

export interface DatamartEndorsmentProperties {
  /** The datamart endorsement details */
  endorsementDetails?: EndorsementDetails;
}

export interface DatamartSensitivityLabelProperties {
  /** The datamart sensitivity label */
  sensitivityLabel?: SensitivityLabel;
}

export interface DatamartUserProperties {
  /** The user access details for a Power BI datamart. */
  users?: DatamartUser[];
}

export interface SubscriptionProperties {
  /** (Empty Value) The subscription details for a Power BI item (such as a report or a dashboard). This property will be removed from the payload response in an upcoming release. You can retrieve subscription information for a Power BI report by using the [Get Report Subscriptions as Admin](/rest/api/power-bi/admin/reports-get-report-subscriptions-as-admin) API call. */
  subscriptions?: Subscription[];
}

export interface RelatedDatasetProperties {
  /**
   * The workspace ID of the related dataset, returned only if the related dataset belongs to a different workspace
   * @format uuid
   */
  datasetWorkspaceId?: string;
}

/** A Power BI report. The API returns a subset of the following list of report properties. The subset depends on the API called, caller permissions, and the availability of data in the Power BI database. */
export type Report = ReportBaseProperties & ReportNavigationProperties & ReportUserProperties & SubscriptionProperties;

/** A Power BI report returned by Admin APIs. The API returns a subset of the following list of report properties. The subset depends on the API called, caller permissions, and the availability of data in the Power BI database. */
export type AdminReport = ReportBaseProperties &
  ReportNavigationProperties &
  ReportAuthoringProperties &
  ReportUserProperties &
  SubscriptionProperties &
  ReportWorkspaceIdProperty;

/** A Power BI report returned by Workspace Info APIs. The API returns a subset of the following list of report properties. The subset depends on the API called, caller permissions, and the availability of data in the Power BI database. */
export type WorkspaceInfoReport = ReportBaseProperties &
  ReportAuthoringProperties &
  ReportAuthoringPropertiesById &
  EndorsmentProperties &
  SensitivityProperties &
  ReportUserProperties &
  RelatedDatasetProperties;

/** A Power BI datamart returned by Workspace Info APIs. The API returns a subset of the following list of datamart properties. The subset depends on the API called, caller permissions, and the availability of data in the Power BI database. */
export type WorkspaceInfoDatamart = DatamartBaseProperties &
  DatamartEndorsmentProperties &
  DatamartSensitivityLabelProperties &
  DatamartAuthoringProperties &
  DatamartAuthoringPropertiesById &
  DatamartUpstreamProperties &
  DatamartDatasourceUsagesProperties &
  DatamartUserProperties;

/** A Power BI report page */
export interface Page {
  /** The name of the report page */
  name?: string;
  /** The display name of the report page */
  displayName?: string;
  /**
   * The order of the report page
   * @format int32
   */
  order?: number;
}

/** Power BI dashboard common properties. The API returns a subset of the following list of report properties. The subset depends on the API called, caller permissions, and the availability of data in the Power BI database. */
export interface DashboardBaseProperties {
  /**
   * The dashboard ID
   * @format uuid
   */
  id: string;
  /** The display name of the dashboard */
  displayName?: string;
  /** Whether the dashboard is read-only */
  isReadOnly?: boolean;
  /** The app ID, returned only if the dashboard belongs to an app */
  appId?: string;
}

/** A list of navigation related properties of a Dashboard. */
export interface DashboardNavigationProperties {
  /** The web URL of the dashboard */
  webUrl?: string;
  /** The embed URL of the dashboard */
  embedUrl?: string;
}

export interface DashboardUserProperties {
  /** (Empty value) The dashboard user access details. This property will be removed from the payload response in an upcoming release. You can retrieve user information on a Power BI dashboard by using the [Get Dashboard Users as Admin](/rest/api/power-bi/admin/dashboards-get-dashboard-users-as-admin) API call, or the [PostWorkspaceInfo](/rest/api/power-bi/admin/workspace-info-post-workspace-info) API call with the `getArtifactUsers` parameter. */
  users?: DashboardUser[];
}

export interface DataClassificationProperties {
  /** The data classification tag of a Power BI item (such as a report or a dashboard) */
  dataClassification?: string;
}

export interface AdminDashboardTilesProperties {
  /** The tiles that belong to the dashboard */
  tiles?: AdminTile[];
}

export interface WorkspaceInfoDashboardTilesProperties {
  /** The tiles that belong to the dashboard */
  tiles?: WorkspaceInfoTile[];
}

export interface DashboardWorkspaceIdProperty {
  /**
   * The dashboard workspace ID. This property will be returned only in GetDashboardsAsAdmin.
   * @format uuid
   */
  workspaceId?: string;
}

/** A Power BI dashboard. The API returns a subset of the following list of dashboard properties. The subset depends on the API called, caller permissions, and the availability of data in the Power BI database. */
export type Dashboard = UtilRequiredKeys<DashboardBaseProperties, "id"> &
  DashboardNavigationProperties &
  DashboardUserProperties &
  SubscriptionProperties;

/** A Power BI dashboard returned by Admin APIs. The API returns a subset of the following list of dashboard properties. The subset depends on the API called, caller permissions, and the availability of data in the Power BI database. */
export type AdminDashboard = UtilRequiredKeys<DashboardBaseProperties, "id"> &
  DashboardNavigationProperties &
  DashboardWorkspaceIdProperty &
  AdminDashboardTilesProperties &
  DashboardUserProperties &
  SubscriptionProperties;

/** A Power BI dashboard returned by WorkspaceInfo APIs. The API returns a subset of the following list of dashboard properties. The subset depends on the API called, caller permissions, and the availability of data in the Power BI database. */
export type WorkspaceInfoDashboard = UtilRequiredKeys<DashboardBaseProperties, "id"> &
  DataClassificationProperties &
  SensitivityProperties &
  WorkspaceInfoDashboardTilesProperties &
  DashboardUserProperties;

export interface TileBaseProperties {
  /**
   * The tile ID
   * @format uuid
   */
  id: string;
  /** The display name of the tile  */
  title?: string;
  /**
   * The report ID. Available only for tiles created from a report.
   * @format uuid
   */
  reportId?: string;
  /** The dataset ID. Available only for tiles created from a report or by using a dataset, such as Q&A tiles. */
  datasetId?: string;
}

export interface TileLayoutProperties {
  /** The number of tile span rows */
  rowSpan?: number;
  /** The number of tile span columns */
  colSpan?: number;
}

export interface TileEmbedProperties {
  /** The embed URL of the tile */
  embedUrl?: string;
  /** The embed data for the tile */
  embedData?: string;
}

/** A Power BI tile */
export type Tile = TileBaseProperties & TileLayoutProperties & TileEmbedProperties;

/** A Power BI tile returned by Admin APIs. */
export type AdminTile = TileBaseProperties & TileLayoutProperties & TileEmbedProperties;

/** A Power BI tile returned by WorkspaceInfo APIs */
export type WorkspaceInfoTile = TileBaseProperties & RelatedDatasetProperties;

export interface GroupBaseProperties {
  /**
   * The workspace ID
   * @format uuid
   */
  id: string;
  /** The group name */
  name?: string;
}

export interface GroupExtendedProperties {
  /** Whether the group is read-only */
  isReadOnly?: boolean;
  /** Whether the group is assigned to a dedicated capacity */
  isOnDedicatedCapacity?: boolean;
  /**
   * The capacity ID
   * @format uuid
   */
  capacityId?: string;
  /**
   * The Power BI dataflow storage account ID
   * @format uuid
   */
  dataflowStorageId?: string;
}

export interface GroupAdminProperties {
  /** The group description */
  description?: string;
  /** The type of group being returned. */
  type?: GroupType;
  /** The group state */
  state?: string;
  /** (Empty value) The users that belong to the group and their access rights. This property will be removed from the payload response in an upcoming release. You can retrieve user information on a Power BI item (such as a report or a dashboard) by using the [Get Group Users As Admin](/rest/api/power-bi/admin/groups-get-group-users-as-admin) API call, or the [PostWorkspaceInfo](/rest/api/power-bi/admin/workspace-info-post-workspace-info) API call with the `getArtifactUsers` parameter. */
  users?: GroupUser[];
  /** The reports that belong to the group */
  reports?: AdminReport[];
  /** The dashboards that belong to the group */
  dashboards?: AdminDashboard[];
  /** The datasets that belong to the group */
  datasets?: AdminDataset[];
  /** The dataflows that belong to the group */
  dataflows?: AdminDataflow[];
  /** The workbooks that belong to the group */
  workbooks?: Workbook[];
  /**
   * The deployment pipeline ID that the workspace is assigned to.
   * @format uuid
   */
  pipelineId?: string;
  /** Whether the workspace has custom settings */
  hasWorkspaceLevelSettings?: boolean;
}

/** A Power BI group associated to a Refreshable item */
export type RefreshableGroup = GroupBaseProperties;

/** A Power BI group */
export type Group = GroupBaseProperties & GroupExtendedProperties;

/** A Power BI group returned by admin APIs */
export type AdminGroup = GroupBaseProperties & GroupExtendedProperties & GroupAdminProperties;

/** A Power BI installed app */
export interface App {
  /**
   * The app ID
   * @format uuid
   */
  id: string;
  /** The app name */
  name?: string;
  /** The app description */
  description?: string;
  /**
   * The date and time the app was last updated
   * @format date-time
   */
  lastUpdate?: string;
  /** The app publisher */
  publishedBy?: string;
}

export type AdminApp = App & {
  /** Associated workspace for the app */
  workspaceId?: string;
};

/** An email subscription for a Power BI item (such as a report or a dashboard) */
export interface Subscription {
  /**
   * The subscription ID
   * @format uuid
   */
  id: string;
  /** The app name */
  title?: string;
  /**
   * The ID of the subscribed Power BI item (such as a report or a dashboard)
   * @format uuid
   */
  artifactId?: string;
  /** The name of the subscribed Power BI item (such as a report or a dashboard) */
  artifactDisplayName?: string;
  /** The page name of the subscribed Power BI item, if it's a report. */
  subArtifactDisplayName?: string;
  /** The type of Power BI item (for example a `Report`, `Dashboard`, or `Dataset`) */
  artifactType?: string;
  /** Whether the email subscription is enabled */
  isEnabled?: boolean;
  /** The frequency of the email subscription */
  frequency?: string;
  /**
   * The start date and time of the email subscription
   * @format date-time
   */
  startDate?: string;
  /**
   * The end date and time of the email subscription
   * @format date-time
   */
  endDate?: string;
  /** Whether a subscription link exists in the email subscription */
  linkToContent?: boolean;
  /** Whether a screenshot of the report exists in the email subscription */
  previewImage?: boolean;
  /** Format of the report attached in the email subscription */
  attachmentFormat?: string;
  /** The details of each email subscriber. When using the [Get User Subscriptions As Admin](/rest/api/power-bi/admin/users-get-user-subscriptions-as-admin) API call, the returned value is an empty array (null). This property will be removed from the payload response in an upcoming release. You can retrieve subscription information on a Power BI report or dashboard by using the [Get Report Subscriptions As Admin](/rest/api/power-bi/admin/reports-get-report-subscriptions-as-admin) or [Get Dashboard Subscriptions As Admin](/rest/api/power-bi/admin/dashboards-get-dashboard-subscriptions-as-admin) API calls. */
  users?: SubscriptionUser[];
}

/** OData response wrapper for a Power BI subscriptions */
export interface Subscriptions {
  "odata.context"?: string;
  /** powerBI email subscription */
  value?: Subscription[];
}

/** A Power BI gateway public key */
export interface GatewayPublicKey {
  /** The public key exponent */
  exponent?: string;
  /** The public key modulus */
  modulus?: string;
}

/** A Power BI gateway */
export interface Gateway {
  /**
   * The gateway ID. When using a gateway cluster, the gateway ID refers to the primary (first) gateway in the cluster and is similar to the gateway cluster ID.
   * @format uuid
   */
  id: string;
  /** The gateway name */
  name?: string;
  /** The gateway type */
  type?: string;
  /** Gateway metadata in JSON format */
  gatewayAnnotation?: string;
  /** The gateway public key */
  publicKey?: GatewayPublicKey;
  /** The gateway connectivity status */
  gatewayStatus?: string;
}

/** A publish data source to gateway request */
export interface PublishDatasourceToGatewayRequest {
  /** The data source type */
  dataSourceType: string;
  /** The connection details */
  connectionDetails: string;
  /** The credential details */
  credentialDetails: CredentialDetails;
  /** The data source name */
  dataSourceName: string;
}

/** The credential details */
export interface CredentialDetails {
  /** The credentials, which depend on the 'credentialType' value. For more information, see [Update Datasource](/rest/api/power-bi/gateways/update-datasource#examples) examples. */
  credentials: string;
  /** The credential type */
  credentialType: "Basic" | "Windows" | "Anonymous" | "OAuth2" | "Key" | "SAS";
  /** Whether to encrypt the data source connection. The API call will fail if you select encryption and Power BI is unable to establish an encrypted connection with the data source. */
  encryptedConnection: "Encrypted" | "NotEncrypted";
  /** The encryption algorithm. For a cloud data source, specify `None`. For an on-premises data source, specify `RSA-OAEP` and use the gateway public key to encrypt the credentials. */
  encryptionAlgorithm: "None" | "RSA-OAEP";
  /** The privacy level, which is relevant when combining data from multiple sources. */
  privacyLevel: "None" | "Public" | "Organizational" | "Private";
  /** Whether the Azure AD identity (OAuth 2.0 credentials) of the API caller (which must be the data source owner) will be used to configure data source credentials (the owner OAuth access token). Typically, you would either use this flag or `useEndUserOAuth2Credentials`. */
  useCallerAADIdentity?: boolean;
  /** Whether the end-user Azure AD identity (OAuth 2.0 credentials) is used when connecting to the data source in DirectQuery mode. Use with data sources that support [single sign-on (SSO)](/power-bi/connect-data/power-bi-data-sources#single-sign-on-sso-for-directquery-sources). Typically, you would either use this flag or `useCallerAADIdentity`. */
  useEndUserOAuth2Credentials?: boolean;
}

/** The data source credential details */
export interface GatewayDatasourceCredentialDetails {
  /** Whether the end-user Azure AD identity (OAuth 2.0 credentials) is used when connecting to the data source in DirectQuery mode. Use with data sources that support [single sign-on (SSO)](/power-bi/connect-data/power-bi-data-sources#single-sign-on-sso-for-directquery-sources). */
  useEndUserOAuth2Credentials?: boolean;
}

/** An update data source to gateway request */
export interface UpdateDatasourceRequest {
  /** The credential details */
  credentialDetails: CredentialDetails;
}

/** The bind dataset to gateway request */
export interface BindToGatewayRequest {
  /**
   * The gateway ID. When using a gateway cluster, the gateway ID refers to the primary (first) gateway in the cluster and is similar to the gateway cluster ID.
   * @format uuid
   */
  gatewayObjectId: string;
  /** The unique identifiers for the data sources in the gateway */
  datasourceObjectIds?: string[];
}

/** A connection string wrapper */
export interface ConnectionDetails {
  /** A dataset connection string */
  connectionString: string;
}

/** A Power BI refresh history entry */
export interface Refresh {
  /** The type of refresh request */
  refreshType?: "Scheduled" | "OnDemand" | "ViaApi" | "ViaXmlaEndpoint" | "ViaEnhancedApi" | "OnDemandTraining";
  /**
   * The start date and time of the refresh
   * @format date-time
   */
  startTime?: string;
  /**
   * The end date and time of the refresh (may be empty if a refresh is in progress)
   * @format date-time
   */
  endTime?: string;
  /** Failure error code in JSON format (empty if no error) */
  serviceExceptionJson?: string;
  /**
   * - `Unknown` if the completion state is unknown or a refresh is in progress.
   * - `Completed` for a successfully completed refresh.
   * - `Failed` for an unsuccessful refresh (`serviceExceptionJson` will contain the error code).
   * - `Disabled` if the refresh is disabled by a selective refresh.
   */
  status?: string;
  /** The identifier of the refresh request. Provide this identifier in all service requests. */
  requestId?: string;
}

/** Power BI refresh request */
export interface RefreshRequest {
  /** Mail notification options */
  notifyOption: "NoNotification" | "MailOnFailure" | "MailOnCompletion";
}

/** Power BI dataset refresh request */
export interface DatasetRefreshRequest {
  /** Mail notification options. This parameter is not applicable to enhanced refreshes or API operations with a service principal. */
  notifyOption: "NoNotification" | "MailOnFailure" | "MailOnCompletion";
  /** The type of processing to perform */
  type?: "Full" | "ClearValues" | "Calculate" | "DataOnly" | "Automatic" | "Defragment";
  /** Determines if objects will be committed in batches or only when complete */
  commitMode?: "Transactional" | "PartialBatch";
  /** The maximum number of threads on which to run parallel processing commands */
  maxParallelism?: number;
  /** Number of times the operation will retry before failing */
  retryCount?: number;
  /** An array of objects to be processed */
  objects?: DatasetRefreshObjects[];
  /** Determine if the policy is applied or not */
  applyRefreshPolicy?: boolean;
  /**
   * If an incremental refresh policy is applied, the `effectiveDate` parameter overrides the current date.
   * @format date-time
   */
  effectiveDate?: string;
}

/** Power BI dataset refresh target */
export interface DatasetRefreshObjects {
  /** Table to refresh */
  table?: string;
  /** Partition to refresh */
  partition?: string;
}

/** A Power BI refresh detail entry */
export interface DatasetRefreshDetail {
  /**
   * The start date and time of the refresh
   * @format date-time
   */
  startTime?: string;
  /**
   * The end date and time of the refresh (may be empty if a refresh is in progress)
   * @format date-time
   */
  endTime?: string;
  /** The type of processing to perform */
  type?: "Full" | "ClearValues" | "Calculate" | "DataOnly" | "Automatic" | "Defragment";
  /** Determines if objects will be committed in batches or only when complete */
  commitMode?: "Transactional" | "PartialBatch";
  /**
   * - `Unknown` if the completion state is unknown or a refresh is in progress.
   * - `Completed` for a successfully completed refresh.
   * - `Failed` for an unsuccessful refresh.
   * - `Disabled` if the refresh is disabled by a selective refresh.
   */
  status?: string;
  /**
   * - `Unknown` if the completion state is unknown.
   * - `NotStarted` if the refresh operation isn't started.
   * - `InProgress` if the refresh operation is in progress.
   * - `Completed` for a successfully completed refresh.
   * - `TimedOut` if the refresh operation is timed out.
   * - `Failed` for an unsuccessful refresh.
   * - `Disabled` if the refresh is disabled by a selective refresh.
   * - `Cancelled` if the refresh operation has been cancelled by customer.
   */
  extendedStatus?: string;
}

/** Power BI refresh schedule request */
export interface RefreshScheduleRequest {
  /** An object that contains the details of a refresh schedule */
  value: RefreshSchedule;
}

/** A Power BI refresh schedule for [imported model](/power-bi/connect-data/refresh-data#datasets-in-import-mode) */
export interface RefreshSchedule {
  /** The days on which to execute the refresh */
  days?: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[];
  /** The times of day to execute the refresh */
  times?: string[];
  /** Whether the refresh is enabled */
  enabled?: boolean;
  /** The ID of the time zone to use. For more information, see [Time zone info](/dotnet/api/system.timezoneinfo.id). */
  localTimeZoneId?: string;
  /** The notification option on termination of a scheduled refresh. Service principals only support the `NoNotification` value. */
  NotifyOption?: "NoNotification" | "MailOnFailure";
}

/** Power BI refresh schedule request for DirectQuery or LiveConnection  */
export interface DirectQueryRefreshScheduleRequest {
  /** An object containing the refresh schedule details for DirectQuery or LiveConnection */
  value: DirectQueryRefreshSchedule;
}

/** A Power BI refresh schedule for DirectQuery or LiveConnection, specifying either the frequency or a combination of days and times. */
export interface DirectQueryRefreshSchedule {
  /** The interval in minutes between successive refreshes. Supported values are *15*, *30*, *60*, *120*, and *180*. */
  frequency?: number;
  /** The days on which to execute the refresh */
  days?: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[];
  /** The times of day to execute the refresh */
  times?: string[];
  /** The ID of the time zone to use. For more information, see [Time zone info](/dotnet/api/system.timezoneinfo.id) */
  localTimeZoneId?: string;
}

/** A Power BI dataset parameter */
export interface MashupParameter {
  /** The parameter name */
  name: string;
  /** The parameter type */
  type: string;
  /** The current value of the parameter */
  currentValue?: string;
  /** Whether the dataset parameter is required */
  isRequired: boolean;
  /** A list of suggested parameter values */
  suggestedValues?: string[];
}

/** The update details for a Power BI dataset parameter */
export interface UpdateMashupParameterDetails {
  /** The parameter name */
  name: string;
  /** The new value for the parameter */
  newValue?: string;
}

/** An update request for a Power BI dataset parameter */
export interface UpdateMashupParametersRequest {
  /** A list of dataset parameters to update */
  updateDetails: UpdateMashupParameterDetails[];
}

/** The OData response wrapper for a list of Power BI dataset parameters */
export interface MashupParameters {
  "odata.context"?: string;
  /** A list of dataset parameters */
  value?: MashupParameter[];
}

/** A Power BI user */
export interface User {
  /** Email address of the user */
  emailAddress?: string;
  /** Display name of the principal */
  displayName?: string;
  /** Identifier of the principal */
  identifier: string;
  /** Identifier of the principal in Microsoft Graph. Only available for admin APIs. */
  graphId?: string;
  /** Type of the user. */
  userType?: string;
  /** The principal type */
  principalType: PrincipalType;
  /** A Power BI service principal profile. Only relevant for [Power BI Embedded multi-tenancy solution](/power-bi/developer/embedded/embed-multi-tenancy). */
  profile?: ServicePrincipalProfile;
}

/** A Power BI principal with access to the artifact */
export interface Principal {
  /** For principal type `User`, provide the *UPN*. Otherwise provide the [object ID](/power-bi/developer/embedded/embedded-troubleshoot#what-is-the-difference-between-application-object-id-and-principal-object-id) of the principal. */
  identifier: string;
  /** The principal type */
  principalType: PrincipalType;
}

/** A Power BI user with access to the data source */
export interface DatasourceUser {
  /** The access right (permission level) that a user has on the data source */
  datasourceAccessRight: "None" | "Read" | "ReadOverrideEffectiveIdentity";
  /** The email address of the user */
  emailAddress?: string;
  /** The display name of the principal */
  displayName?: string;
  /** The [object ID](/power-bi/developer/embedded/embedded-troubleshoot#what-is-the-difference-between-application-object-id-and-principal-object-id) of the principal */
  identifier?: string;
  /** The principal type */
  principalType?: PrincipalType;
  /** A Power BI service principal profile. Only relevant for [Power BI Embedded multi-tenancy solution](/power-bi/developer/embedded/embed-multi-tenancy). */
  profile?: ServicePrincipalProfile;
}

/** Odata response wrapper for a Power BI service principal profile collection. */
export interface ServicePrincipalProfiles {
  /** OData context */
  "odata.context"?: string;
  /** The service principal profile collection */
  value?: ServicePrincipalProfile[];
}

/** Odata response wrapper for a Power BI service principal profile collection. */
export interface AdminServicePrincipalProfiles {
  /** OData context */
  "odata.context"?: string;
  /** The service principal profile collection */
  value?: AdminServicePrincipalProfile[];
}

/** A Power BI service principal profile. Only relevant for [Power BI Embedded multi-tenancy solution](/power-bi/developer/embedded/embed-multi-tenancy). */
export interface ServicePrincipalProfile {
  /**
   * The service principal profile ID
   * @format uuid
   */
  id: string;
  /** The service principal profile name */
  displayName?: string;
}

/** A Power BI service principal profile. Only relevant for [Power BI Embedded multi-tenancy solution](/power-bi/developer/embedded/embed-multi-tenancy). */
export type AdminServicePrincipalProfile = UtilRequiredKeys<ServicePrincipalProfile, "id"> & {
  /**
   * The service principal ID
   * @format uuid
   */
  servicePrincipalId?: string;
};

/** A Power BI service principal profile create or update request */
export interface CreateOrUpdateProfileRequest {
  /** The service principal profile name */
  displayName?: string;
}

/** A Power BI user with access to the workspace */
export type GroupUser = User & {
  /** The access right (permission level) that a user has on the workspace */
  groupUserAccessRight: "None" | "Member" | "Admin" | "Contributor" | "Viewer";
};

/** A Power BI user access right entry for an app */
export interface AppUser {
  /** The access right that the user has for the app */
  appUserAccessRight:
    | "None"
    | "Read"
    | "ReadWrite"
    | "ReadReshare"
    | "ReadWriteReshare"
    | "ReadExplore"
    | "ReadCopy"
    | "ReadExploreCopy"
    | "ReadReshareExplore"
    | "ReadReshareExploreCopy"
    | "ReadWriteExplore"
    | "ReadWriteReshareExplore"
    | "ReadWriteExploreCopy"
    | "ReadReshareCopy"
    | "All";
  /** Email address of the user */
  emailAddress?: string;
  /** Display name of the principal */
  displayName?: string;
  /** Identifier of the principal */
  identifier?: string;
  /** Identifier of the principal in Microsoft Graph. Only available for admin APIs. */
  graphId?: string;
  /** The principal type */
  principalType?: PrincipalType;
}

/** A Power BI user access right entry for a capacity */
export type CapacityUser = User & {
  /** The access right that the user has on the capacity */
  capacityUserAccessRight: "None" | "Assign" | "Admin";
};

/** A Power BI user access right entry for a report */
export type ReportUser = User & {
  /** The access right that the user has for the report (permission level) */
  reportUserAccessRight: "None" | "Read" | "ReadWrite" | "ReadReshare" | "ReadCopy" | "Owner";
};

/** A Power BI user access right entry for a report */
export type DatamartUser = User & {
  /** The access right that the user has for the datamart (permission level) */
  datamartUserAccessRight:
    | "None"
    | "Read"
    | "Write"
    | "Reshare"
    | "Explore"
    | "ReadWrite"
    | "ReadReshare"
    | "ReadWriteReshare"
    | "ReadExplore"
    | "ReadReshareExplore"
    | "ReadWriteExplore"
    | "ReadWriteReshareExplore";
};

/** A Power BI user access right entry for a dashboard */
export type DashboardUser = User & {
  /** The access right that the user has for the dashboard (permission level) */
  dashboardUserAccessRight: "None" | "Read" | "ReadWrite" | "ReadReshare" | "ReadCopy" | "Owner";
};

/** A Power BI user access right entry for a dataset */
export type DatasetUser = User & {
  /** The access right that the user has for the dataset (permission level) */
  datasetUserAccessRight:
    | "None"
    | "Read"
    | "ReadWrite"
    | "ReadReshare"
    | "ReadWriteReshare"
    | "ReadExplore"
    | "ReadReshareExplore"
    | "ReadWriteExplore"
    | "ReadWriteReshareExplore";
};

/** A Power BI user access right entry for a dataset */
export type PostDatasetUserAccess = UtilRequiredKeys<Principal, "identifier" | "principalType"> & {
  /** Required. The access right to grant to the user for the dataset. */
  datasetUserAccessRight: "Read" | "ReadReshare" | "ReadExplore" | "ReadReshareExplore";
};

/** A Power BI principal access right entry for a dataset */
export type DatasetUserAccess = UtilRequiredKeys<Principal, "identifier" | "principalType"> & {
  /** The access rights to assign to the user for the dataset (permission level) */
  datasetUserAccessRight:
    | "None"
    | "Read"
    | "ReadWrite"
    | "ReadReshare"
    | "ReadWriteReshare"
    | "ReadExplore"
    | "ReadReshareExplore"
    | "ReadWriteExplore"
    | "ReadWriteReshareExplore";
};

/** A Power BI user access right entry for a dataflow */
export type DataflowUser = User & {
  /** The access right that a user has for the dataflow (permission level) */
  DataflowUserAccessRight?: "None" | "Read" | "ReadWrite" | "ReadReshare" | "Owner";
};

/** A Power BI email subscription user */
export type SubscriptionUser = UtilRequiredKeys<User, "emailAddress" | "identifier" | "principalType">;

/** A user access entry for a Power BI item */
export interface ArtifactAccessEntry {
  /** The Power BI item ID */
  artifactId: string;
  /** The display name of the Power BI item */
  displayName: string;
  /** The type of Power BI item */
  artifactType: ArtifactType;
  /** The access right that the user has for the Power BI item */
  accessRight: string;
  /** The type of how the access is given to the Power BI item. Only available for widely shared artifacts APIs. */
  shareType?: string;
  /** The user who shared the PowerBI item. Only available for widely shared artifacts APIs. */
  sharer?: User;
}

/** The artifact type */
export enum ArtifactType {
  Report = "Report",
  PaginatedReport = "PaginatedReport",
  Dashboard = "Dashboard",
  Dataset = "Dataset",
  Dataflow = "Dataflow",
  PersonalGroup = "PersonalGroup",
  Group = "Group",
  Workspace = "Workspace",
  Capacity = "Capacity",
  App = "App",
}

/** The principal type */
export enum PrincipalType {
  None = "None",
  User = "User",
  Group = "Group",
  App = "App",
}

/** The group type */
export enum GroupType {
  PersonalGroup = "PersonalGroup",
  Personal = "Personal",
  Group = "Group",
  Workspace = "Workspace",
}

/** Power BI clone report request */
export interface CloneReportRequest {
  /** The new report name */
  name: string;
  /**
   * Optional. Parameter for specifying the target workspace ID. An empty GUID (`00000000-0000-0000-0000-000000000000`) indicates **My workspace**. If this parameter isn't provided, the new report will be cloned within the same workspace as the source report.
   * @format uuid
   */
  targetWorkspaceId?: string;
  /** Optional. Parameter for specifying the target associated dataset ID. If not provided, the new report will be associated with the same dataset as the source report. */
  targetModelId?: string;
}

/** Power BI rebind report request */
export interface RebindReportRequest {
  /** The new dataset for the rebound report. If the dataset resides in a different workspace than the report, a shared dataset will be created in the report's workspace. */
  datasetId: string;
}

/** The export to file request */
export interface ExportReportRequest {
  /** The requested format for the exported file */
  format: "PPTX" | "PDF" | "PNG" | "IMAGE" | "XLSX" | "DOCX" | "CSV" | "XML" | "MHTML" | "ACCESSIBLEPDF";
  /** The configuration used to export a Power BI report */
  powerBIReportConfiguration?: PowerBIReportExportConfiguration;
  /** The configuration used to export a paginated report */
  paginatedReportConfiguration?: PaginatedReportExportConfiguration;
}

/** The export to file configuration for a Power BI report */
export interface PowerBIReportExportConfiguration {
  /** The settings to be applied for the export to file job */
  settings?: ExportReportSettings;
  /** The dataset ID to export the report with. Only needed if exporting with a dataset other than the report's default dataset. */
  datasetToBind?: string;
  /** A default bookmark to apply on all pages that don't have a specific bookmark */
  defaultBookmark?: PageBookmark;
  /** A list of report level filters to apply. Currently, only one filter is supported. */
  reportLevelFilters?: ExportFilter[];
  /** A list of pages to export and their properties. The same page may appear more than once with different visuals. */
  pages?: ExportReportPage[];
  /** A list of identities to use for row-level security rules */
  identities?: EffectiveIdentity[];
}

/** The export to file configuration for a paginated report  */
export interface PaginatedReportExportConfiguration {
  /** The single identity to use when exporting a report. Required when a report uses a Power BI dataset or an Azure Analysis Services data source. */
  identities?: EffectiveIdentity[];
  /** A dictionary of format settings. The keys are the device information property names for the requested file format. */
  formatSettings?: Record<string, string>;
  /** A list of report parameters */
  parameterValues?: ParameterValue[];
}

/** Export to file request settings */
export interface ExportReportSettings {
  /** The locale to apply */
  locale?: string;
  /** Whether to include hidden pages when exporting an entire report. If not provided, the default behavior is to exclude hidden pages. This property will be ignored when specific pages are exported. */
  includeHiddenPages?: boolean;
}

/** A single page configuration for the export request */
export interface ExportReportPage {
  /** The page name */
  pageName: string;
  /** The name of the visual to export. Specify a name, in case only a single visual from this page is exported. */
  visualName?: string;
  /** The bookmark to apply on the page */
  bookmark?: PageBookmark;
}

/** The bookmark to apply on a single page. Provide name or state, but not both. */
export interface PageBookmark {
  /** The bookmark name */
  name?: string;
  /** The bookmark state */
  state?: string;
}

/** A filter to be applied during the export operation */
export interface ExportFilter {
  /** The filter to apply. For information about the filter syntax, see [Filter a report](/power-bi/collaborate-share/service-url-filters). */
  filter?: string;
}

/** Data contract for paginated report parameters */
export interface ParameterValue {
  /** The parameter name */
  name?: string;
  /** The parameter value */
  value?: string;
}

/** A Power BI request to create a new group */
export interface GroupCreationRequest {
  /** The name of the newly created group */
  name: string;
}

/** A Power BI request to restore a deleted group */
export interface GroupRestoreRequest {
  /** The name of the group to be restored */
  name?: string;
  /** The email address of the owner of the group to be restored */
  emailAddress: string;
}

/** A blob for specifying an identity. Only supported for datasets with a DirectQuery connection to Azure SQL */
export interface IdentityBlob {
  /** An OAuth 2.0 access token for Azure SQL */
  value: string;
}

/** Defines the user identity and roles. For more information, see [Row-level security with Power BI Embedded](/power-bi/developer/embedded/embedded-row-level-security). */
export interface EffectiveIdentity {
  /** The effective username within a token that applies row-level security rules. For an on-premises model, the username can contain alphanumeric or any of the following characters `.`, `-`, `_`, `!`, `#`, `^`, `~`, `\\`, `@`. For cloud models, the username can contain any ASCII character. For either model, the username length must not exceed 256 characters, and the username shouldn't contain spaces. */
  username: string;
  /** An array of datasets for which this identity applies */
  datasets?: string[];
  /** An array of row-level security (RLS) roles within a token that applies RLS rules. An identity can contain up to 50 roles. A role can contain any character except `,`, and its length must not exceed 50 characters. */
  roles?: string[];
  /** [Custom data](/power-bi/developer/embedded/embedded-row-level-security#using-the-customdata-feature) that's used to apply row-level security rules. Supported for live connection to Azure Analysis Services models and cloud models only. */
  customData?: string;
  /** A blob that specifies an [identity](/power-bi/developer/embedded/embedded-row-level-security#token-based-identity-sdk-additions). Only supported for datasets with a DirectQuery connection to Azure SQL. */
  identityBlob?: IdentityBlob;
  /** An array of reports for which this identity applies. Only supported for paginated reports. */
  reports?: string[];
}

/** Effective identity for connecting DirectQuery data sources with single sign-on (SSO) enabled. */
export interface DatasourceIdentity {
  /** A blob for specifying the identity. */
  identityBlob: string;
  /** An array of data sources that this identity applies to. */
  datasources: DatasourceSelector[];
}

/** An object that uniquely identifies a single data source by its connection details. */
export interface DatasourceSelector {
  /**
   * The type of the [data source](/power-bi/connect-data/power-bi-data-sources).
   *
   *
   * | API name for the data source | | |
   * |-|-|-|
   * | ActiveDirectory | AdobeAnalytics | AdoDotNet |
   * | AnalysisServices | AzureBlobs | AzureDataLakeStorage |
   * | AzureMarketplace | AzureTables | BizTalk |
   * | CDPA | CustomConnector | CustomHttpApi |
   * | DB2 | Essbase | EventHub |
   * | Excel | Exchange | Extension |
   * | Facebook | File | Folder |
   * | GoogleAnalytics | Hdfs | HDInsight |
   * | Informix | MQ | MySql |
   * | OData | ODBC | OleDb |
   * | Oracle | PostgreSql | PowerQueryMashup
   * | PubNub | Salesforce | SAPBW |
   * | SAPBWMessageServer | SapErp | SAPHana |
   * | SharePoint | SharePointDocLib | SharePointList |
   * | Sql | Sybase | Teradata |
   * | UIFlow | Web |
   */
  datasourceType: string;
  /**
   * The data source connection details.
   * You can obtain the connection details using [Get Datasources for paginated reports](/rest/api/power-bi/reports/get-datasources-in-group) and [Get Datasources for powerbi reports](/rest/api/power-bi/datasets/get-datasources-in-group) APIs.
   */
  connectionDetails: DatasourceConnectionDetails;
}

/** A dataset object in [GenerateTokenRequestV2](#generatetokenrequestv2) */
export interface GenerateTokenRequestV2Dataset {
  /** The dataset ID */
  id: string;
  /** XMLA Permissions */
  xmlaPermissions?: "Off" | "ReadOnly";
}

/** A workspace object in [GenerateTokenRequestV2](#generatetokenrequestv2) */
export interface GenerateTokenRequestV2TargetWorkspace {
  /**
   * The workspace ID
   * @format uuid
   */
  id: string;
}

/** A report object in [GenerateTokenRequestV2](#generatetokenrequestv2) */
export interface GenerateTokenRequestV2Report {
  /** Whether the generated embed token supports report editing */
  allowEdit?: boolean;
  /**
   * The report ID
   * @format uuid
   */
  id: string;
}

/** Power BI Generate Token Request */
export interface GenerateTokenRequest {
  /** The required access level for embed token generation */
  accessLevel?: "View" | "Edit" | "Create";
  /** The dataset ID used for report creation. Only applies when you generate an embed token for report creation. */
  datasetId?: string;
  /** Whether an embedded report can be saved as a new report. The default value is `false`. Only applies when you generate an embed token for report embedding. */
  allowSaveAs?: boolean;
  /** A list of identities to use for row-level security rules */
  identities?: EffectiveIdentity[];
  /** The maximum lifetime of the token in minutes, starting from the time it was generated. Can be used to shorten the expiration time of a token, but not to extend it. The value must be a positive integer. Zero (0) is equivalent to null and will be ignored, resulting in the default expiration time. */
  lifetimeInMinutes?: number;
}

/** Power BI Generate Token Request V2 */
export interface GenerateTokenRequestV2 {
  /** A list of datasets */
  datasets?: GenerateTokenRequestV2Dataset[];
  /** A list of reports */
  reports?: GenerateTokenRequestV2Report[];
  /** The list of workspaces that the embed token will allow saving to */
  targetWorkspaces?: GenerateTokenRequestV2TargetWorkspace[];
  /** The list of identities to use for row-level security rules */
  identities?: EffectiveIdentity[];
  /** The maximum lifetime of the token in minutes, starting from the time it was generated. Can be used to shorten the token's expiration time, but not to extend it. The value must be a positive integer. Zero (`0`) is equivalent to `null`, and will set the default expiration time. */
  lifetimeInMinutes?: number;
  /** List of identities to use when connecting to data sources with Single Sign-On (SSO) enabled. */
  datasourceIdentities?: DatasourceIdentity[];
}

/** A Power BI embed token */
export interface EmbedToken {
  /** The embed token */
  token: string;
  /**
   * The unique token ID. Through audit logs, the token ID can be used to correlate operations that use the token with the generate operation.
   * @format uuid
   */
  tokenId: string;
  /**
   * The date and time (UTC) of token expiration
   * @format date-time
   */
  expiration: string;
}

/**  A Power BI request to clone a tile */
export interface CloneTileRequest {
  /**
   * The target dashboard ID
   * @format uuid
   */
  targetDashboardId: string;
  /**
   * Optional. A parameter for specifying a target workspace ID. An empty GUID (`00000000-0000-0000-0000-000000000000`) indicates **My workspace**. If this parameter isn't provided, the tile will be cloned within the same workspace as the source tile.
   * @format uuid
   */
  targetWorkspaceId?: string;
  /**
   * Optional. A parameter for specifying a target report ID. When cloning a tile linked to a report, pass the target report ID to rebind the new tile to a different report.
   * @format uuid
   */
  targetReportId?: string;
  /** Optional. A parameter for specifying a target model ID. When cloning a tile linked to a dataset, pass the target model ID to rebind the new tile to a different dataset. */
  targetModelId?: string;
  /** Optional. A parameter for specifying an action in case of a position conflict. If there's a conflict and this parameter isn't provided, then the default value `Tail` will be applied. If there's no conflict, then the cloned tile will have the same position as in the source. */
  positionConflictAction?: "Tail" | "Abort";
}

/** A Power BI request to add a dashboard */
export interface AddDashboardRequest {
  /** The name of the new dashboard */
  name: string;
}

/** An existing source report */
export interface SourceReport {
  /**
   * The source report ID
   * @format uuid
   */
  sourceReportId: string;
  /**
   * The source workspace ID
   * @format uuid
   */
  sourceWorkspaceId?: string;
}

/** A Power BI request to update the content of a report */
export interface UpdateReportContentRequest {
  /** The source type of the content update */
  sourceType: "ExistingReport";
  /** An existing source report */
  sourceReport: SourceReport;
}

/** A Power BI capacity */
export interface Capacity {
  /**
   * The capacity ID
   * @format uuid
   */
  id: string;
  /** The display name of the capacity */
  displayName?: string;
  /** An array of capacity admins */
  admins?: string[];
  /** The capacity SKU */
  sku?: string;
  /** The capacity state */
  state:
    | "NotActivated"
    | "Active"
    | "Provisioning"
    | "ProvisionFailed"
    | "PreSuspended"
    | "Suspended"
    | "Deleting"
    | "Deleted"
    | "Invalid"
    | "UpdatingSku";
  /** The access right a user has on the capacity */
  capacityUserAccessRight: "None" | "Assign" | "Admin";
  /** The Azure region where the capacity was provisioned */
  region?: string;
  /**
   * The ID of an encryption key (only applicable to the admin route)
   * @format uuid
   */
  tenantKeyId?: string;
  /** Encryption key information (only applies to admin routes) */
  tenantKey?: TenantKey;
}

/** OData response wrapper for a Power BI capacity list */
export interface Capacities {
  "odata.context"?: string;
  /** The capacity list */
  value?: Capacity[];
}

/** OData response wrapper for a Power BI available features list */
export interface AvailableFeatures {
  "odata.context"?: string;
  /** The available features list */
  features?: AvailableFeature[];
}

/** A Power BI available feature */
export interface AvailableFeature {
  /** The feature name */
  name: string;
  /** The feature state */
  state: "Enabled" | "Disabled";
  /** The feature extended state */
  extendedState: "Enabled" | "DisabledByAdmin" | "UserNotLicensed";
  /** Additional feature information */
  additionalInfo?: AdditionalFeatureInfo;
}

/** Additional feature information */
export interface AdditionalFeatureInfo {
  /** Workspaces that aren't assigned to a capacity get a limited amount of [embed tokens](/power-bi/developer/embedded/embed-tokens#embed-token), to allow experimenting with the APIs. The `Usage` value represents the percentage of embed tokens that have been consumed. The `Usage` value only applies to the **embed trial** feature. For more information, see [Development testing](/power-bi/developer/embedded/move-to-production#development-testing). */
  Usage?: number;
}

/** A Power BI assign-to-capacity request */
export interface AssignToCapacityRequest {
  /**
   * The capacity ID. To unassign from a capacity, use an empty GUID (`00000000-0000-0000-0000-000000000000`).
   * @format uuid
   */
  capacityId: string;
}

/** A Power BI response with the status of a workspace assign-to-capacity operation */
export interface WorkspaceCapacityAssignmentStatus {
  /** The status of a workspace assign-to-capacity operation */
  status: "Pending" | "InProgress" | "CompletedSuccessfully" | "AssignmentFailed";
  /**
   * The start date and time of a workspace assignment operation
   * @format date-time
   */
  startTime?: string;
  /**
   * The end date and time of a workspace assignment operation
   * @format date-time
   */
  endTime?: string;
  /**
   * The capacity ID
   * @format uuid
   */
  capacityId?: string;
  /**
   * The activity ID of the assignment operation (provided in case of an assignment failure).
   * @format uuid
   */
  activityId?: string;
}

/** A Power BI update report content request */
export interface TemporaryUploadLocation {
  /** The shared access signature URL for the temporary blob storage */
  Url: string;
  /**
   * The expiration date and time of the shared access signature URL
   * @format date-time
   */
  ExpirationTime: string;
}

/** OData response wrapper for capacity workload settings list */
export interface Workloads {
  "odata.context"?: string;
  /** The list of capacity workload settings */
  value?: Workload[];
}

/** The capacity workload state */
export enum WorkloadState {
  Disabled = "Disabled",
  Enabled = "Enabled",
  Unsupported = "Unsupported",
}

/** A capacity workload setting */
export interface Workload {
  /** The workload name */
  name?: string;
  /** The capacity workload state */
  state: WorkloadState;
  /** The percentage of the maximum memory that a workload can consume (set by the user) */
  maxMemoryPercentageSetByUser?: number;
}

/** Patch workload setting request */
export interface PatchWorkloadRequest {
  /** The capacity workload state */
  state: WorkloadState;
  /** The percentage of the maximum memory that a workload can consume (set by the user) */
  maxMemoryPercentageSetByUser?: number;
}

/** The metadata of a dataflow. The API returns a subset of the following list of dataflow properties. The subset depends on the API called, caller permissions, and the availability of data in the Power BI database. */
export interface DataflowBaseProperties {
  /**
   * The dataflow ID
   * @format uuid
   */
  objectId: string;
  /** The dataflow name */
  name?: string;
  /** The dataflow description */
  description?: string;
  /** A URL to the dataflow definition file (model.json) */
  modelUrl?: string;
  /** The dataflow owner */
  configuredBy?: string;
  /** The user that modified the dataflow */
  modifiedBy?: string;
  /**
   * The date and time that the dataflow was last modified
   * @format date-time
   */
  modifiedDateTime?: string;
  /** (Empty value) The dataflow user access details. This property will be removed from the payload response in an upcoming release. You can retrieve user information on a Power BI dataflow by using the [Get Dataflow Users as Admin](/rest/api/power-bi/admin/dataflows-get-dataflow-users-as-admin) API call, or the [PostWorkspaceInfo](/rest/api/power-bi/admin/workspace-info-post-workspace-info) API call with the `getArtifactUser` parameter. */
  users?: DataflowUser[];
}

export interface WorkspaceInfoDataflowProperties {
  /** The data source usages */
  datasourceUsages?: DatasourceUsage[];
  /** The data source misconfigured usages */
  misconfiguredDatasourceUsages?: DatasourceUsage[];
  /** The list of all the dataflows this item depends on */
  upstreamDataflows?: DependentDataflow[];
  /** The list of all the datamarts this item depends on */
  upstreamDatamarts?: DependentDatamart[];
}

export interface DataflowWorkspaceIdProperty {
  /**
   * The dataflow workspace ID.
   * @format uuid
   */
  workspaceId?: string;
}

/** The metadata of a dataflow. Below is a list of properties that may be returned for a dataflow. Only a subset of the properties will be returned depending on the API called, the caller permissions and the availability of the data in the Power BI database. */
export type Dataflow = DataflowBaseProperties;

/** The metadata of a dataflow returned by Admin APIs. Below is a list of properties that may be returned for a dataflow. Only a subset of the properties will be returned depending on the API called, the caller permissions and the availability of the data in the Power BI database. */
export type AdminDataflow = DataflowBaseProperties & DataflowWorkspaceIdProperty;

/** The metadata of a dataflow returned by Workspace Info APIs. Below is a list of properties that may be returned for a dataflow. Only a subset of the properties will be returned depending on the API called, the caller permissions and the availability of the data in the Power BI database. */
export type WorkspaceInfoDataflow = DataflowBaseProperties &
  WorkspaceInfoDataflowProperties &
  EndorsmentProperties &
  SensitivityProperties;

/** OData response wrapper for a dataflow metadata list */
export interface Dataflows {
  "odata.context"?: string;
  /** The dataflow metadata list */
  value?: Dataflow[];
}

/** OData response wrapper for a Power BI Admin dataflow collection */
export interface AdminDataflows {
  /** OData context */
  "odata.context"?: string;
  /** The report collection */
  value?: AdminDataflow[];
}

/** A Power BI dataflow storage account */
export interface DataflowStorageAccount {
  /**
   * The Power BI dataflow storage account ID
   * @format uuid
   */
  id: string;
  /** The Power BI dataflow storage account name */
  name?: string;
  /** Whether workspaces can be assigned to this storage account */
  isEnabled: boolean;
}

/** OData response wrapper for Power BI dataflow storage account list */
export interface DataflowStorageAccounts {
  "odata.context"?: string;
  /** The Power BI dataflow storage account list */
  value?: DataflowStorageAccount[];
}

/** A Power BI assign to dataflow storage account request */
export interface AssignToDataflowStorageRequest {
  /**
   * The Power BI dataflow storage account ID. To unassign the specified workspace from a Power BI dataflow storage account, use an empty GUID (`00000000-0000-0000-0000-000000000000`).
   * @format uuid
   */
  dataflowStorageId: string;
}

/** An object describing the details and current state of an export to file job */
export interface Export {
  /** The export to file job ID */
  id?: string;
  /**
   * The start date and time of the export to file job
   * @format date-time
   */
  createdDateTime?: string;
  /**
   * The date and time of the last change to the export to file job
   * @format date-time
   */
  lastActionDateTime?: string;
  /**
   * The ID of the exported report
   * @format uuid
   */
  reportId?: string;
  /** The name of the exported report */
  reportName?: string;
  /** The current state of the export to file job */
  status?: "Undefined" | "NotStarted" | "Running" | "Succeeded" | "Failed";
  /**
   * Job progress as a percentage
   * @format int32
   * @min 0
   * @max 100
   */
  percentComplete?: number;
  /** The retrieval URL for the exported file */
  resourceLocation?: string;
  /** The extension of the exported file */
  ResourceFileExtension?: string;
  /**
   * The expiration date and time of the retrieval URL
   * @format date-time
   */
  expirationTime?: string;
}

/** Add encryption key request */
export interface TenantKeyCreationRequest {
  /** The name of the encryption key */
  name?: string;
  /** The URI that uniquely specifies an encryption key in Azure Key Vault */
  keyVaultKeyIdentifier?: string;
  /** Whether an encryption key is the default key for the entire tenant. Any newly created capacity inherits the default key. */
  isDefault?: boolean;
  /** Whether to activate any inactivated capacities and to use this key for its encryption */
  activate?: boolean;
}

/** Encryption keys information */
export interface TenantKeys {
  "odata.context"?: string;
  /** Encryption keys */
  value?: TenantKey[];
}

/** Encryption key information */
export interface TenantKey {
  /**
   * The ID of the encryption key
   * @format uuid
   */
  id?: string;
  /** The name of the encryption key */
  name?: string;
  /** The URI that uniquely specifies the encryption key in Azure Key Vault */
  keyVaultKeyIdentifier?: string;
  /** Whether the encryption key is the default key for the entire tenant. Any newly created capacity inherits the default key. */
  isDefault?: boolean;
  /**
   * The creation date and time of the encryption key
   * @format date-time
   */
  createdAt?: string;
  /**
   * The last update date and time of the encryption key
   * @format date-time
   */
  updatedAt?: string;
}

/** A request to rotate an encryption key */
export interface TenantKeyRotationRequest {
  /** The URI that uniquely specifies the encryption key in Azure Key Vault */
  keyVaultKeyIdentifier?: string;
}

/** A patch capacity request */
export interface CapacityPatchRequest {
  /**
   * The ID of the encryption key
   * @format uuid
   */
  tenantKeyId?: string;
}

/** A request to assign workspaces to a premium capacity */
export interface AssignWorkspacesToCapacityRequest {
  capacityMigrationAssignments?: CapacityMigrationAssignment[];
}

/** Assignment contract for migrating workspaces to a premium capacity as tenant admin */
export interface CapacityMigrationAssignment {
  /** The workspace IDs to migrate to a premium capacity */
  workspacesToAssign: string[];
  /** The premium capacity ID */
  targetCapacityObjectId: string;
}

/** A request for migrating workspaces to a shared capacity as tenant admin */
export interface UnassignWorkspacesCapacityRequest {
  /** The workspaces to migrate to a shared capacity */
  workspacesToUnassign: string[];
}

/** OData response wrapper for audit activity events list */
export interface ActivityEventResponse {
  /** An array of activity event objects. To learn more about an activity event (which is a collection of event properties) refer to [Microsoft 365 Management Activity schema](https://learn.microsoft.com/en-us/office/office-365-management-api/office-365-management-activity-api-schema#power-bi-schema). */
  activityEventEntities?: object[];
  /** The URI for the next chunk in the result set */
  continuationUri?: string;
  /** Token to get the next chunk of the result set */
  continuationToken?: string;
}

/** OData response wrapper for unused Power BI item (such as a report or a dashboard) entities */
export interface UnusedArtifactsResponse {
  /** The unused Power BI item entities */
  unusedArtifactEntities?: UnusedArtifactEntity[];
  /** The URI for the next chunk in the result set */
  continuationUri?: string;
  /** Token to get the next chunk of the result set */
  continuationToken?: string;
}

/** The unused Power BI item entity */
export interface UnusedArtifactEntity {
  /** The ID of the Power BI item */
  artifactId: string;
  /** The display name of the Power BI item */
  displayName: string;
  /** The Power BI item type */
  artifactType: string;
  /** The size of the Power BI item in megabytes (if applicable) */
  artifactSizeInMB?: number;
  /**
   * The creation time of the Power BI item (if applicable)
   * @format date-time
   */
  createdDateTime?: string;
  /**
   * The last access time of the Power BI item (if applicable)
   * @format date-time
   */
  lastAccessedDateTime?: string;
}

/** A Power BI workbook list */
export interface Workbooks {
  /** OData context */
  "odata.context"?: string;
  /** The workbooks */
  value?: Workbook[];
}

/** A Power BI workbook */
export interface Workbook {
  /** The workbook name */
  name?: string;
  /** The ID of the dataset associated with a workbook. Only applies if the workbook has an associated dataset. */
  datasetId?: string;
}

/** A Power BI refreshables list */
export interface Refreshables {
  /** OData context */
  "odata.context"?: string;
  /** The refreshables */
  value?: Refreshable[];
}

/** A Power BI refreshable is a dataset that's been refreshed at least once, or for which a valid refresh schedule exists. If a dataset doesn't meet either of these conditions, then it won't show up in the API response. Power BI retains a seven-day refresh history for each dataset, up to a maximum of sixty refreshes. */
export interface Refreshable {
  /** The object ID of the refreshable */
  id?: string;
  /** The display name of the refreshable */
  name?: string;
  /** The refreshable kind */
  kind?: "Dataset";
  /**
   * The start time of the window for which refresh data exists
   * @format date-time
   */
  startTime?: string;
  /**
   * The end time of the window for which refresh data exists
   * @format date-time
   */
  endTime?: string;
  /** The number of refreshes within the time window for which refresh data exists */
  refreshCount?: number;
  /** The number of refresh failures within the time window for which refresh data exists */
  refreshFailures?: number;
  /** The average duration in seconds of a refresh during the time window for which refresh data exists */
  averageDuration?: number;
  /** The median duration in seconds of a refresh within the time window for which refresh data exists */
  medianDuration?: number;
  /** The number of refreshes per day (scheduled and on-demand) within the time window for which refresh data exists */
  refreshesPerDay?: number;
  /** The last Power BI refresh history entry for the refreshable item */
  lastRefresh?: Refresh;
  /** The refresh schedule for the refreshable item */
  refreshSchedule?: RefreshSchedule;
  /** The refreshable owners */
  configuredBy?: string[];
  /** The capacity for the refreshable item */
  capacity?: Capacity;
  /** The associated group for the refreshable item */
  group?: RefreshableGroup;
}

/** A request to update the data sources of a paginated report */
export interface UpdateRdlDatasourcesRequest {
  /** The update details for the data sources of the paginated report */
  updateDetails: UpdateRdlDatasourceDetails[];
}

/** Update details for a paginated report data source */
export interface UpdateRdlDatasourceDetails {
  /** The new connection details for the paginated report data source */
  connectionDetails: RdlDatasourceConnectionDetails;
  /** The name of the paginated report data source */
  datasourceName: string;
}

/** The connection details for a paginated report data source */
export interface RdlDatasourceConnectionDetails {
  /** The connection server */
  server?: string;
  /** The connection database */
  database?: string;
}

/** Odata response wrapper for dataflow transactions */
export interface DataflowTransactions {
  /** OData context */
  "odata.context"?: string;
  /** The dataflow transactions */
  value?: DataflowTransaction[];
}

/** A Power BI dataflow transaction */
export interface DataflowTransaction {
  /** The transaction ID */
  id: string;
  /** The type of refresh transaction */
  refreshType?: string;
  /** The start time of the transaction */
  startTime?: string;
  /** The end time of the transaction */
  endTime?: string;
  /** The status of the transaction */
  status?: string;
}

/** The status of a dataflow refresh transaction */
export interface DataflowTransactionStatus {
  /** The transaction ID */
  transactionId?: string;
  /** The transaction status */
  status?: "invalid" | "successfullyMarked" | "alreadyConcluded" | "notFound";
}

/** A request to update dataflow information */
export interface DataflowUpdateRequestMessage {
  /** The new name for the dataflow */
  name?: string;
  /** The new description for the dataflow */
  description?: string;
  /** Whether to allow native queries */
  allowNativeQueries?: boolean;
  /** The behavior of the compute engine */
  computeEngineBehavior?: "computeOptimized" | "computeOn" | "computeDisabled";
}

/** A request to create a Power BI install ticket */
export interface CreateInstallTicketRequest {
  /** List of install details */
  installDetails?: TemplateAppInstallDetails[];
}

/** The install details for a Power BI template app */
export interface TemplateAppInstallDetails {
  /**
   * The unique ID of the Power BI template app
   * @format uuid
   */
  appId: string;
  /** The secure key for the Power BI template app version */
  packageKey: string;
  /**
   * The tenant ID of the Power BI template app owner
   * @format uuid
   */
  ownerTenantId: string;
  /** The automated install configuration */
  config?: TemplateAppConfigurationRequest;
}

/** An automated install configuration for a Power BI template app (dictionary of name-value pairs) */
export interface TemplateAppConfigurationRequest {
  /** @example {"param1":"value1","param2":"value2"} */
  configuration?: Record<string, string>;
}

/** An automated install ticket for a Power BI template app */
export interface InstallTicket {
  /** Install ticket */
  ticket: string;
  /**
   * The unique ID of an install ticket. Audit logs can be used to correlate operations that use this ticket with the generate ticket operation.
   * @format uuid
   */
  ticketId: string;
  /**
   * The expiration date and time (UTC) of the ticket
   * @format date-time
   */
  expiration: string;
}

/** The unique ID of a Power BI item in UUID format. Dashboard, report, and dataflow IDs are in UUID format, and dataset IDs can be in UUID or string format. */
export interface ArtifactId {
  /**
   * An ID in UUID format
   * @format uuid
   */
  id: string;
}

/** The unique ID of a Power BI item in string or UUID format. Dashboard, report, and dataflow IDs are in UUID format, and dataset IDs can be in UUID or string format. */
export interface ArtifactStringId {
  /** An ID in string or UUID format */
  id: string;
}

/** A composite of Power BI item IDs for each item type. The IDs specify which Power BI items require an information protection label update. */
export interface InformationProtectionArtifactsChangeLabel {
  /** A list of unique dashboard IDs */
  dashboards?: ArtifactId[];
  /** A list of unique report IDs */
  reports?: ArtifactId[];
  /** A list of unique dataset IDs */
  datasets?: ArtifactStringId[];
  /** A list of unique dataflow IDs */
  dataflows?: ArtifactId[];
}

/** A composite of the ID and information protection label change status for one or more Power BI items organized by type */
export interface InformationProtectionChangeLabelResponse {
  /** A list containing the unique ID and information protection label change status of one or more dashboards */
  dashboards?: ChangeLabelStatus[];
  /** A list containing the unique ID and information protection label change status of one or more reports */
  reports?: ChangeLabelStatus[];
  /** A list containing the unique ID and information protection label change status of one or more dataflows */
  dataflows?: ChangeLabelStatus[];
  /** A list containing the unique ID and information protection label change status of one or more datasets */
  datasets?: ChangeLabelStatus[];
}

/** The unique ID and information protection label change status of a Power BI item */
export interface ChangeLabelStatus {
  /** The unique ID of a Power BI item. The ID is in UUID format for dashboards, reports, and dataflows; and in UUID or string format for datasets. */
  id: string;
  /** The status of an information protection label change operation */
  status: "Failed" | "FailedToGetUsageRights" | "InsufficientUsageRights" | "NotFound" | "Succeeded";
}

/** A composite of label information required to update an information protection label */
export interface InformationProtectionChangeLabelDetails {
  /** A composite of Power BI item IDs for each item type */
  artifacts: InformationProtectionArtifactsChangeLabel;
  /**
   * The label ID, which must be in the user's label policy.
   * @format uuid
   */
  labelId: string;
  /** Delegated user details. A delegated user is a user within an organization whose admin sets a label on behalf of the user. Although the admin sets the label, the delegated user is marked as the label issuer. */
  delegatedUser?: DelegatedUser;
  /** Specifies whether the assigned label was set by an automated process or manually. */
  assignmentMethod?: "Standard" | "Priviledged";
}

/** Delegated user details. The user must be an existing user in Power BI and Azure AAD, and must have signed in to Power BI during the last three months. */
export interface DelegatedUser {
  /** The email address of the delegated user */
  emailAddress: string;
}

/** OData response wrapper for a collection of Power BI deployment pipelines */
export interface Pipelines {
  /** OData context */
  "odata.context"?: string;
  /** The collection of deployment pipelines */
  value?: Pipeline[];
}

/** OData response wrapper for a collection of Power BI deployment pipelines */
export interface AdminPipelines {
  /** OData context */
  "odata.context"?: string;
  /** The collection of deployment pipelines */
  value?: AdminPipeline[];
}

export interface PipelineBaseProperties {
  /**
   * The deployment pipeline ID
   * @format uuid
   */
  id: string;
  /** The deployment pipeline display name */
  displayName?: string;
  /** The deployment pipeline description */
  description?: string;
  /** The collection of deployment pipeline stages. Only returned when `$expand` is set to `stages` in the request. */
  stages?: PipelineStage[];
}

export interface PipelineUsersProperties {
  /** The collection of deployment pipeline users. Only returned when `$expand` is set to `users` in the request. */
  users?: PipelineUser[];
}

/** A Power BI pipeline */
export type Pipeline = PipelineBaseProperties;

/** A Power BI pipeline returned by user APIs */
export type AdminPipeline = PipelineBaseProperties & PipelineUsersProperties;

/** OData response wrapper for a collection of Power BI deployment pipeline stages. */
export interface PipelineStages {
  /** OData context */
  "odata.context"?: string;
  /** The collection of deployment pipeline stages */
  value?: PipelineStage[];
}

/** A Power BI deployment pipeline stage */
export interface PipelineStage {
  /** The stage order, starting from zero. */
  order: number;
  /**
   * The assigned workspace ID. Only applicable when there's an assigned workspace.
   * @format uuid
   */
  workspaceId?: string;
  /** The assigned workspace name. Only applicable when there's an assigned workspace and the user has access to the workspace. */
  workspaceName?: string;
}

/** Supported items from a workspace that's assigned to a deployment pipeline stage */
export interface PipelineStageArtifacts {
  /** The datasets collection */
  datasets?: PipelineStageDataset[];
  /** The reports collection */
  reports?: PipelineStageReport[];
  /** The dashboards collection */
  dashboards?: PipelineStageDashboard[];
  /** The dataflows collection */
  dataflows?: PipelineStageDataflow[];
  /** The datamarts collection */
  datamarts?: PipelineStageDatamart[];
}

/** Power BI item metadata for a deployment pipeline stage */
export interface PipelineStageArtifactBase {
  /**
   * The Power BI item ID
   * @format uuid
   */
  artifactId: string;
  /** The Power BI item display name */
  artifactDisplayName?: string;
  /**
   * The ID of the Power BI item (such as a report or a dashboard) from the workspace assigned to the source stage, which will update the current Power BI item upon deployment. Applicable only when the user has at least contributor access to the source stage workspace.
   * @format uuid
   */
  sourceArtifactId?: string;
  /**
   * The ID of the Power BI item (such as a report or a dashboard) from the workspace of the target stage, which will be updated by the current Power BI item upon deployment. Applicable only when the user has at least contributor access to the target stage workspace.
   * @format uuid
   */
  targetArtifactId?: string;
  /**
   * The last deployment date and time of the Power BI item
   * @format date-time
   */
  lastDeploymentTime?: string;
}

/** The metadata for a deployment pipeline dataflow */
export type PipelineStageDataflow = PipelineStageArtifactBase;

/** The metadata for a deployment pipeline datamart */
export type PipelineStageDatamart = PipelineStageArtifactBase;

/** The metadata for a deployment pipeline dataset */
export type PipelineStageDataset = PipelineStageArtifactBase;

/** The metadata for a deployment pipeline report */
export type PipelineStageReport = PipelineStageArtifactBase;

/** The metadata for a deployment pipeline dashboard */
export type PipelineStageDashboard = PipelineStageArtifactBase;

/** OData response wrapper for a collection of Power BI deployment pipeline operations */
export interface PipelineOperations {
  /** OData context */
  "odata.context"?: string;
  /** The collection of deployment pipeline operations */
  value?: PipelineOperation[];
}

/** A Power BI deployment pipeline operation */
export interface PipelineOperation {
  /**
   * The operation ID
   * @format uuid
   */
  id: string;
  /** The operation type */
  type?: "Deploy";
  /** The pipeline operation status */
  status: "NotStarted" | "Executing" | "Succeeded" | "Failed";
  /**
   * The date and time that the operation was last updated
   * @format date-time
   */
  lastUpdatedTime: string;
  /**
   * The date and time that the operation started
   * @format date-time
   */
  executionStartTime?: string;
  /**
   * The date and time that the operation ended
   * @format date-time
   */
  executionEndTime?: string;
  /** The numeric identifier of a source pipeline deployment stage. Development (0), Test (1), Production (2). */
  sourceStageOrder?: number;
  /** The numeric identifier of a target pipeline deployment stage. Development (0), Test (1), Production (2). */
  targetStageOrder?: number;
  /** User or service principal that performed the pipeline operation. */
  performedBy?: PipelineOperationUser;
  /** A note representing a description of the operation. */
  note?: PipelineOperationNote;
  /** The deployment execution plan. Only applicable to a single pipeline operation. */
  executionPlan?: DeploymentExecutionPlan;
  /** The amount of deployed items in the source stage, that are new, identical or different to items in the target stage, before deployment. */
  preDeploymentDiffInformation?: PreDeploymentDiffInformation;
}

/** User or service principal that performed the pipeline operation. */
export interface PipelineOperationUser {
  /** The UPN of the user who performed the deployment. */
  userPrincipalName?: string;
  /**
   * The ID of the service principal that performed the deployment.
   * @format uuid
   */
  principalObjectID?: string;
  /** The type of user who performed the deployment. */
  principalType: PrincipalType;
}

/** A note describing the deployment. */
export interface PipelineOperationNote {
  /** Text describing the deployment. */
  content: string;
  /** Indicates if the note is incomplete. True, only part of the note is returned. False, the note is complete. */
  isTruncated: boolean;
}

/** A deployment execution plan */
export interface DeploymentExecutionPlan {
  /** The collection of execution plan steps */
  steps?: DeploymentExecutionStep[];
}

/** A deployment execution step */
export interface DeploymentExecutionStep {
  /** The step index */
  index: number;
  /** The type of deployment step */
  type: "DatasetDeployment" | "ReportDeployment" | "DashboardDeployment" | "DataflowDeployment" | "DatamartDeployment";
  /** The status of the pipeline operation */
  status: "NotStarted" | "Executing" | "Succeeded" | "Failed";
  /** Is an item new, different or identical to items in the target stage before deployment. */
  preDeploymentDiffState?: DeploymentExecutionStepPreDeploymentDiffState;
  /** The source and target items of the step */
  sourceAndTarget?: DeploymentSourceAndTarget;
  /** The error details. Only applicable if the pipeline operation failed. */
  error?: DeploymentError;
}

/** Is an item new, different or identical to items in the target stage before deployment. */
export enum DeploymentExecutionStepPreDeploymentDiffState {
  New = "New",
  Different = "Different",
  NoDifference = "NoDifference",
}

/** Source and target items */
export interface DeploymentSourceAndTarget {
  /**
   * The ID of the Power BI item that's deployed from the source stage
   * @format uuid
   */
  source: string;
  /** The display name of the Power BI item that's deployed from the source stage */
  sourceDisplayName?: string;
  /**
   * The ID of the Power BI item that will be overwritten in the target stage. Only applies when overwriting a Power BI item.
   * @format uuid
   */
  target?: string;
  /** The name of the Power BI item that will be overwritten in the target stage. Only applies when overwriting a Power BI item. */
  targetDisplayName?: string;
  /** The type of the Power BI item that will be overwritten in the target stage. Only applies when overwriting a Power BI item. */
  type?: string;
}

/** Error details for the deployment step */
export interface DeploymentError {
  /** The error code */
  errorCode?: string;
  /** Additional error details */
  errorDetails?: string;
}

/** The amount of new, different and identical deployed items before deployment. */
export interface PreDeploymentDiffInformation {
  /** The number of new items deployed to the target stage. */
  newArtifactsCount: number;
  /** The number of deployed items with differences between source and target stages, before deployment. */
  differentArtifactsCount: number;
  /** The number of identical deployed items in the source and target stages, before deployment. */
  noDifferenceArtifactsCount: number;
}

/** Base request to deploy content from a deployment pipeline stage */
export interface DeployRequestBase {
  /** The numeric identifier of the pipeline deployment stage that the content should be deployed from. Development (0), Test (1), Production (2). */
  sourceStageOrder: number;
  /** Whether the deployment will be from a later stage in the deployment pipeline, to an earlier one. The default value is `false`. */
  isBackwardDeployment?: boolean;
  /** The configuration details for creating a new workspace. Required when deploying to a stage that has no assigned workspaces. The deployment will fail if the new workspace configuration details aren't provided when required. */
  newWorkspace?: PipelineNewWorkspaceRequest;
  /** Update org app in the target workspace settings */
  updateAppSettings?: PipelineUpdateAppSettings;
  /** Options that control the behavior of the entire deployment */
  options?: DeploymentOptions;
  /** A note describing the deployment. */
  note?: string;
}

/** A request to deploy all supported items from a deployment pipeline stage */
export type DeployAllRequest = DeployRequestBase;

/** A request to selectively deploy items from a deployment pipeline stage */
export type SelectiveDeployRequest = DeployRequestBase & {
  /** A list of datasets to be deployed */
  datasets?: DeployArtifactRequest[];
  /** A list of reports to be deployed */
  reports?: DeployArtifactRequest[];
  /** A list of dashboards to be deployed */
  dashboards?: DeployArtifactRequest[];
  /** A list of dataflows to be deployed */
  dataflows?: DeployArtifactRequest[];
  /** A list of datamarts to be deployed */
  datamarts?: DeployArtifactRequest[];
};

/** The configuration details for creating a new workspace. Required when deploying to a stage that has no assigned workspaces. */
export interface PipelineNewWorkspaceRequest {
  /** The name of the new workspace */
  name?: string;
  /**
   * The ID of the capacity that the new workspace will be assigned to. If unspecified and the API caller has permissions for the source stage workspace capacity, then that capacity will be used. Otherwise, Power BI will select a capacity that the API caller has permissions for.
   * @format uuid
   */
  capacityId?: string;
}

/** Configuration update org app after deployment */
export interface PipelineUpdateAppSettings {
  /** Whether to update the app in the target workspace. Only deployed items that already exist in the app are updated. New deployed items are not added to the app. */
  updateAppInTargetWorkspace?: boolean;
}

/** Deployment configuration options. Can be specified either for the entire deployment or for a specific Power BI item (such as a report or dashboard). If both are specified, only the deployment options for the Power BI item are used. */
export interface DeploymentOptions {
  /** Whether creating a new Power BI item (such as a report or a dashboard) in the target stage workspace is allowed. If this option isn't set to `true` when it's required for deployment, the deployment will fail. */
  allowCreateArtifact?: boolean;
  /** Whether overwriting a Power BI item (such as a report or a dashboard) in the target stage workspace is allowed. If this option isn't set to `true` when it's required for deployment, the deployment will fail. */
  allowOverwriteArtifact?: boolean;
  /** Whether to skip tiles that don't have a model or a report in the target stage workspace. If this option isn't set to `true` when it's required for deployment, the deployment will fail. */
  allowSkipTilesWithMissingPrerequisites?: boolean;
  /** Whether to delete all data from the target Power BI item (such as a report or a dashboard) when there's a schema mismatch. If this option isn't set to `true` when it's required for deployment, the deployment will fail. */
  allowPurgeData?: boolean;
  /** Whether to allow overriding the previous paginated report owner and becoming the owner of the paginated report. Applicable when deploying a paginated report to a stage that already contains a copy of the paginated report that isn't owned by you. If this option isn't set to `true` when it's required for deployment, the deployment will fail. */
  allowTakeOver?: boolean;
  /** Whether the label of a target Power BI item (such as a report or a dashboard) can be changed. The label gets changed when the source is protected but the target isn't. If this option isn't set to `true` when it's required for deployment, the deployment will fail. */
  allowOverwriteTargetArtifactLabel?: boolean;
}

/** A request to deploy a Power BI item (such as a report or a dashboard) */
export interface DeployArtifactRequest {
  /**
   * The ID of the Power BI item (such as a report or a dashboard) to be deployed
   * @format uuid
   */
  sourceId: string;
  /** The deployment configuration options for a specific Power BI item (such as a report or a dashboard) */
  options?: DeploymentOptions;
}

/** A request to create a new deployment pipeline */
export interface CreatePipelineRequest {
  /**
   * The display name for the new deployment pipeline
   * @maxLength 256
   */
  displayName: string;
  /**
   * The description for the new deployment pipeline
   * @maxLength 1024
   */
  description?: string;
}

/** A request to update an existing deployment pipeline. An updated display name and/or a description is required. */
export interface UpdatePipelineRequest {
  /**
   * The updated display name for the deployment pipeline
   * @maxLength 256
   */
  displayName?: string;
  /**
   * The updated description for the deployment pipeline
   * @maxLength 1024
   */
  description?: string;
}

/** A request to assign a workspace to a deployment pipeline stage */
export interface AssignWorkspaceRequest {
  /**
   * The workspace ID.
   * @format uuid
   */
  workspaceId: string;
}

/** OData response wrapper for a collection of Power BI deployment pipeline users */
export interface PipelineUsers {
  /** OData context */
  "odata.context"?: string;
  /** The collection of deployment pipeline users */
  value?: PipelineUser[];
}

/** A Power BI user access right entry for a deployment pipeline */
export type PipelineUser = UtilRequiredKeys<Principal, "identifier" | "principalType"> & {
  /** Required. The access right a user has for the deployment pipeline. */
  accessRight?: "Admin";
};

/** A request to execute queries against a dataset */
export interface DatasetExecuteQueriesRequest {
  /** The list of dataset queries to execute */
  queries: DatasetExecuteQueriesQuery[];
  /** The serialization settings for the result set */
  serializerSettings?: DatasetExecuteQueriesSerializationSettings;
  /** The UPN of a user to be impersonated. If the model is not RLS enabled, this will be ignored. */
  impersonatedUserName?: string;
}

/** A dataset query */
export interface DatasetExecuteQueriesQuery {
  /** The DAX query to be executed */
  query: string;
}

/** The serialization settings for the results of a dataset query */
export interface DatasetExecuteQueriesSerializationSettings {
  /** Whether null (blank) values should be included in the result set. If unspecified, the default value is `false`. */
  includeNulls?: boolean;
}

/** The response to a dataset execute queries request */
export interface DatasetExecuteQueriesResponse {
  /** The details of the information protection label, if any, associated with the dataset. */
  informationProtectionLabel?: DatasetExecuteQueriesInformationProtectionLabel;
  /** The list of results, one per input query. */
  results?: DatasetExecuteQueriesQueryResult[];
  /** The details of an error, if present. */
  error?: DatasetExecuteQueriesError;
}

/** The details of the information protection label, if any, associated with the dataset. */
export interface DatasetExecuteQueriesInformationProtectionLabel {
  /** The identifier (guid) of the information protection label */
  id?: string;
  /** The display name of the information protection label */
  name?: string;
}

/** The results from a single dataset query */
export interface DatasetExecuteQueriesQueryResult {
  /** A list of tables data for a query */
  tables?: DatasetExecuteQueriesTableResult[];
  /** The details of an error, if present. */
  error?: DatasetExecuteQueriesError;
}

/** A table of data */
export interface DatasetExecuteQueriesTableResult {
  /** A list of rows */
  rows?: DatasetExecuteQueriesRowResult[];
  /** The details of an error, if present. */
  error?: DatasetExecuteQueriesError;
}

/**
 * A set of key-value pairs representing the column name and a row value. The column name is the key of the pair.
 * @example {"Country":"United States","Sales":100.5}
 */
export type DatasetExecuteQueriesRowResult = object;

/** The details of an error, if present. */
export interface DatasetExecuteQueriesError {
  /** The code associated with the error */
  code?: string;
  /** The message of the error. If not present here, this information my also be found in details object nested under the error object. */
  message?: string;
}

/** The OData response wrapper for a Power BI scorecard collection */
export interface Scorecards {
  /** OData context */
  "@odata.context"?: string;
  "@odata.count"?: number;
  /** Link to the next page results. */
  "@odata.nextLink"?: string;
  /** The scorecard collection */
  value?: Scorecard[];
}

/** A request to create a scorecard */
export interface ScorecardCreateRequest {
  /** The scorecard name */
  name: string;
  /** Optional. The scorecard description. */
  description?: string;
  /**
   * Optional. The GUID of a sensitivity label. If you don't want to select a sensitivity label, use a null or empty GUID (`00000000-0000-0000-0000-000000000000`). If default labels are enabled and/or enforced, they will be applied on the scorecard and dataset.
   * @format uuid
   */
  sensitivityLabelId?: string;
}

/** A Power BI scorecard */
export interface Scorecard {
  /**
   * The scorecard ID
   * @format uuid
   */
  id?: string;
  /** The scorecard name */
  name?: string;
  /**
   * The UTC time at creation
   * @format date-time
   */
  createdTime?: string;
  /**
   * The UTC time at last modification
   * @format date-time
   */
  lastModifiedTime?: string;
  /**
   * The provisioning status of the scorecard.
   * @default "Initialized"
   */
  provisioningStatus?: "Initialized" | "Completed" | "Failed" | "Deprovisioning" | "Deleted";
  /**
   * The ID of the workspace
   * @format uuid
   */
  groupId?: string;
  /**
   * The ID of the dataset associated with the scorecard
   * @format uuid
   */
  datasetId?: string;
  /**
   * The ID of the internal report associated with the scorecard
   * @format uuid
   */
  reportId?: string;
  /** The scorecard description */
  description?: string;
  /** The scorecard permissions */
  permissions?: "None" | "Read" | "Write" | "ReadWrite";
  /** The display settings for columns on a scorecard */
  columnSettings?: ScorecardColumnSetting[];
  /** The scorecard goals */
  goals?: Goal[];
}

/** The OData response wrapper for a Power BI goal collection */
export interface Goals {
  /** OData context */
  "@odata.context"?: string;
  /** The goal collection */
  value?: Goal[];
}

/** The rank validation information for a Power BI goal, to be used with the [Move Goals](/rest/api/power-bi/scorecards/move-goals) API request. The caller provides validation information to confirm that they know the existing position of the goal within the hierarchy of goals. */
export interface GoalRankValidationInfo {
  /**
   * The goal ID
   * @format uuid
   */
  goalId?: string;
  /**
   * The ID of the current parent goal
   * @format uuid
   */
  currentParentId?: string;
}

/** A request object to be used with the [Move Goals](/rest/api/power-bi/scorecards/move-goals) API request */
export interface GoalsMoveRequest {
  /** The rank validation information for the goal to be moved. The caller provides validation information to confirm that they know the existing position of a goal within the hierarchy of goals. */
  goalToMove: GoalRankValidationInfo;
  /** Optional. The rank validation information for the new parent of the goal to be moved. The caller provides validation information to confirm that they know the existing position of a goal within the hierarchy of goals. */
  newParent?: GoalRankValidationInfo;
  /** Optional. The rank validation information for the new previous-sibling of the goal to be moved. The caller provides validation information to confirm that they know the existing position of a goal within the hierarchy of goals. */
  newPrevious?: GoalRankValidationInfo;
  /** Optional. The rank validation information for the new next-sibling of the goal to be moved. The caller provides validation information to confirm that they know the existing position of a goal within the hierarchy of goals. */
  newNext?: GoalRankValidationInfo;
}

/** A Power BI goal create request */
export interface GoalCreateRequest {
  /** The goal name */
  name: string;
  /**
   * Optional. The UTC timestamp for the start date of the goal. The time portion of the timestamp is zero.
   * @format date-time
   */
  startDate?: string;
  /**
   * Optional. The UTC timestamp for the completion date of the goal. The time portion of the timestamp is zero.
   * @format date-time
   */
  completionDate?: string;
  /** Optional. The ID of the parent goal, if defined. */
  parentId?: string;
  /** Optional. The [custom format string](/power-bi/create-reports/desktop-custom-format-strings) for values. */
  valuesFormatString?: string;
  /** Optional. The [custom format string](/power-bi/create-reports/desktop-custom-format-strings) for dates. */
  datesFormatString?: string;
}

/** A Power BI goal */
export interface Goal {
  /**
   * The goal ID
   * @format uuid
   */
  id?: string;
  /** The goal name */
  name?: string;
  /**
   * The scorecard ID
   * @format uuid
   */
  scorecardId?: string;
  /**
   * The UTC time at creation
   * @format date-time
   */
  createdTime?: string;
  /**
   * The UTC time at last modification
   * @format date-time
   */
  lastModifiedTime?: string;
  /**
   * The UTC timestamp for the start date of the goal. The time portion of the timestamp is zero.
   * @format date-time
   */
  startDate?: string;
  /**
   * The UTC timestamp for the completion date of the goal. The time portion of the timestamp is zero.
   * @format date-time
   */
  completionDate?: string;
  /**
   * The ID of the parent goal, if defined.
   * @format uuid
   */
  parentId?: string;
  /**
   * notesCount
   * @format int32
   */
  notesCount?: number;
  /** valuesFormatString */
  valuesFormatString?: string;
  /** datesFormatString */
  datesFormatString?: string;
  /** The goal description */
  description?: string;
  /** Whether the goal has status rules defined */
  hasStatusRules?: boolean;
  /** The goal status rules */
  statusRules?: GoalsRulesGoalRulesContainer;
  /** The goal permissions */
  permissions?:
    | "None"
    | "View"
    | "UpdateCurrentValue"
    | "UpdateTargetValue"
    | "UpdateNotes"
    | "UpdateStatus"
    | "UpdateValues"
    | "All"
    | "11"
    | "13"
    | "15"
    | "19"
    | "21"
    | "23"
    | "25"
    | "27"
    | "29";
  /**
   * The nested level of the goal in the parent-child hierarchy of scorecard goals
   * @format int32
   */
  level?: number;
  /**
   * The rank of the goal within the ordered set of sibling goals
   * @format int64
   */
  rank?: number;
  /** The list of goal value check-ins */
  goalValues?: GoalValue[];
  /** The list of aggregated properties of the goal */
  aggregations?: GoalAggregation[];
}

/** The OData response wrapper for a collection of Power BI goal refresh history entries */
export interface GoalRefreshHistories {
  /** OData context */
  "@odata.context"?: string;
  /** The goal refresh history entries */
  value?: GoalRefreshHistory[];
}

/** A refresh history entry for a Power BI goal */
export interface GoalRefreshHistory {
  /**
   * The goal ID
   * @format uuid
   */
  goalId?: string;
  /** The refresh connection type */
  connectionType?: "Current" | "Target" | "Status";
  /** The status of the refresh processing. */
  status?:
    | "NotProcessed"
    | "Succeeded"
    | "Failed"
    | "UserNotFound"
    | "QueryExecutionError"
    | "QueryResultError"
    | "BadQueryResultMetadata"
    | "EmptyGoalValues"
    | "ConnectedDatasetDeleted"
    | "UserNotAuthorized"
    | "ModelNotFound"
    | "ScorecardNotFound";
  /**
   * The UTC timestamp of the refresh operation
   * @format date-time
   */
  timestamp?: string;
  /**
   * The root activity ID
   * @format uuid
   */
  rootActivityId?: string;
  /** The verbal description of the status of the refresh operation */
  message?: string;
}

/** An entry defining the display settings for columns on a Power BI scorecard */
export interface ScorecardColumnSetting {
  /**
   * The ID for one of the columns on the scorecard control or scorecard Web UI page
   * @format int32
   */
  columnId: "0" | "1" | "2" | "3" | "4" | "5" | "6";
  /** Whether the column should be visible on the scorecard */
  show: boolean;
}

/** The OData response wrapper for a Power BI goal value collection */
export interface GoalValues {
  /** OData context */
  "@odata.context"?: string;
  /** The goal value collection */
  value?: GoalValue[];
}

/** A creation request for a Power BI goal value check-in */
export interface GoalValueCreateRequest {
  /**
   * The UTC timestamp of the goal value check-in. The time portion of the timestamp is zero.
   * @format date-time
   */
  timestamp: string;
  /**
   * Optional. The current value of the goal.
   * @format double
   */
  value?: number;
  /**
   * Optional. The target value of the goal.
   * @format double
   */
  target?: number;
  /**
   * Optional. The value trend of the goal.
   * @format int32
   */
  trend?: number;
  /**
   * Optional. The value trend forecast of the goal.
   * @format double
   */
  forecast?: number;
  /**
   * Optional. The goal status ID.
   *
   * | ID | Description |
   * |-|-|
   * | 0 | Not started |
   * | 1 | On track |
   * | 2 | At risk |
   * | 3 | Behind |
   * | 4 | Overdue |
   * | 5 | Completed |
   * @format int32
   */
  status?: number;
}

/** A Power BI goal value check-in */
export interface GoalValue {
  /**
   * The UTC timestamp of the goal value check-in. The time portion of the timestamp is zero.
   * @format date-time
   */
  timestamp?: string;
  /**
   * The goal ID
   * @format uuid
   */
  goalId?: string;
  /**
   * The scorecard ID
   * @format uuid
   */
  scorecardId?: string;
  /**
   * The UTC time at creation
   * @format date-time
   */
  createdTime?: string;
  /**
   * The UTC time at last modification
   * @format date-time
   */
  lastModifiedTime?: string;
  /**
   * The goal current value
   * @format double
   */
  value?: number;
  /**
   * The goal target value
   * @format double
   */
  target?: number;
  /** The textual representation of the current goal value */
  valueDisplayString?: string;
  /** The textual representation of the goal target */
  targetDisplayString?: string;
  /**
   * The goal value trend
   * @format int32
   */
  trend?: number;
  /**
   * The goal value trend forecast
   * @format double
   */
  forecast?: number;
  /**
   * The ID of the goal status
   *
   * | ID | Description |
   * |-|-|
   * | 0 | Not started |
   * | 1 | On track |
   * | 2 | At risk |
   * | 3 | Behind |
   * | 4 | Overdue |
   * | 5 | Completed |
   * @format int32
   */
  status?: number;
  /** The notes for the goal */
  notes?: GoalNote[];
}

/** An entry describing the state of various Power BI goal properties at a specific time (normally current time) */
export interface GoalAggregation {
  /** The aggregation ID */
  id: string;
  /**
   * The UTC timestamp associated with the aggregated property. The time portion of the timestamp is zero.
   * @format date-time
   */
  timestamp: string;
  /**
   * The UTC timestamp of the aggregation calculation
   * @format date-time
   */
  calculationTime: string;
  /**
   * The scorecard ID
   * @format uuid
   */
  scorecardId: string;
  /**
   * The goal ID
   * @format uuid
   */
  goalId: string;
  /**
   * The numeric value of the aggregated property
   * @format double
   */
  value: number;
  /** Optional. The alternative text representation of the aggregated property value. */
  valueDisplayString?: string;
  /** The type of the aggregated property */
  type: "Value" | "Target" | "Status" | "Sparkline" | "Change";
  /**
   * The UTC timestamp of the latest modification to the aggregated property
   * @format date-time
   */
  maxLastModifiedTime: string;
}

/** The OData response wrapper for a Power BI goal value note collection */
export interface GoalNotes {
  /** OData context */
  "@odata.context"?: string;
  /** The goal value note collection */
  value?: GoalNote[];
}

/** A Power BI goal value check-in note request */
export interface GoalNoteRequest {
  /** The note text */
  body: string;
}

/** A Power BI goal value check-in note */
export interface GoalNote {
  /**
   * The goal value check-in note ID
   * @format uuid
   */
  id?: string;
  /**
   * The UTC timestamp of the goal value check-in that this note belongs to. The time portion of the timestamp is zero.
   * @format date-time
   */
  valueTimestamp?: string;
  /**
   * The goal ID
   * @format uuid
   */
  goalId?: string;
  /**
   * The scorecard ID
   * @format uuid
   */
  scorecardId?: string;
  /**
   * The UTC time at last modification
   * @format date-time
   */
  lastModifiedTime?: string;
  /** The content of this note in special format */
  content?: string;
  /**
   * The UTC time at creation
   * @format date-time
   */
  createdTime?: string;
  /** The note text */
  body?: string;
}

/** The request data to be used when updating rules for a Power BI goal */
export interface GoalsRulesGoalStatusRulesUpdateRequest {
  /** Optional. The list of rules. */
  rules?: GoalsRulesRule1OfInt32[];
  /**
   * The status ID when no rule matches
   *
   * | ID | Description |
   * |-|-|
   * | 0 | Not started |
   * | 1 | On track |
   * | 2 | At risk |
   * | 3 | Behind |
   * | 4 | Overdue |
   * | 5 | Completed |
   * @format int32
   */
  defaultOutput: number;
}

/** The request data to be used when defining or reporting rules for the status of a Power BI goal */
export interface GoalsRulesGoalStatusRules {
  /** The list of rules */
  rules?: GoalsRulesRule1OfInt32[];
  /**
   * The status ID when no rule matches
   *
   * | ID | Description |
   * |-|-|
   * | 0 | Not started |
   * | 1 | On track |
   * | 2 | At risk |
   * | 3 | Behind |
   * | 4 | Overdue |
   * | 5 | Completed |
   * @format int32
   */
  defaultOutput?: number;
  /** The scorecard ID */
  scorecardObjectId?: string;
  /** The goal ID */
  goalObjectId?: string;
  /**
   * The UTC time at last modification
   * @format date-time
   */
  lastModifiedTime?: string;
}

/** A status rule object for the Power BI goal */
export interface GoalsRulesRule1OfInt32 {
  /** The list of status rule conditions */
  conditions?: GoalsRulesRuleCondition[];
  /**
   * The status ID when conditions are met
   *
   * | ID | Description |
   * |-|-|
   * | 0 | Not started |
   * | 1 | On track |
   * | 2 | At risk |
   * | 3 | Behind |
   * | 4 | Overdue |
   * | 5 | Completed |
   * @format int32
   */
  output?: number;
}

/** A container for JSON definitions of status rules on a Power BI goal */
export interface GoalsRulesGoalRulesContainer {
  /**
   * The scorecard ID
   * @format uuid
   */
  scorecardObjectId?: string;
  /**
   * The goal ID
   * @format uuid
   */
  goalObjectId?: string;
  /**
   * The UTC time at last modification
   * @format date-time
   */
  lastModifiedTime?: string;
  /** The list of rules */
  rules?: string;
}

/** A Power BI goal status rule */
export interface GoalsRulesRuleCondition {
  /** The field comparison definition when `expression` isn't defined */
  fieldComparison?: GoalsRulesFieldComparison;
  /** The rule condition expression when `fieldComparison` isn't defined */
  expression?: string;
}

/** A field comparison specification for Power BI goal status rule */
export interface GoalsRulesFieldComparison {
  /** The name of the field, such as `Timestamp`, `Value`, or `Change`. */
  field?: string;
  /** The comparison operator */
  operator?: "Equal" | "GreaterThan" | "GreaterThanOrEqual" | "LessThan" | "LessThanOrEqual";
  /** The rule value */
  value?: GoalsRulesRuleValue;
}

/** A specification for a condition in a Power BI goal status rule */
export interface GoalsRulesRuleValue {
  /** An entry defining a percentage of some target metric */
  percentOf?: GoalsRulesPercentOf;
  /** The rule value */
  field?: string;
  /**
   * The rule value timestamp
   * @format date-time
   */
  dateTime?: string;
  /**
   * The rule value number
   * @format double
   */
  number?: number;
}

/** An entry defining a percentage of some target metric in a condition for Power BI goal status rule */
export interface GoalsRulesPercentOf {
  /** The field for which the percent value is computed */
  field?: string;
  /**
   * The percent value
   * @format double
   */
  percent?: number;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://api.powerbi.com";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Power BI Client
 * @version v1.0
 * @baseUrl https://api.powerbi.com
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  v10 = {
    /**
     * @description ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetDatasets
     * @summary Returns a list of datasets from **My workspace**.
     * @request GET:/v1.0/myorg/datasets
     */
    datasetsGetDatasets: (params: RequestParams = {}) =>
      this.request<Datasets, any>({
        path: `/v1.0/myorg/datasets`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All ## Limitations This API call only supports **push datasets**. For a complete list of limitations, see [Push datasets limitations](/power-bi/developer/embedded/push-datasets-limitations). <br><br>
     *
     * @tags PushDatasets
     * @name DatasetsPostDataset
     * @summary Creates a new dataset on **My workspace**.
     * @request POST:/v1.0/myorg/datasets
     */
    datasetsPostDataset: (
      dataset: CreateDatasetRequest,
      query?: {
        /** The default retention policy */
        defaultRetentionPolicy?: "None" | "basicFIFO";
      },
      params: RequestParams = {},
    ) =>
      this.request<Dataset, any>({
        path: `/v1.0/myorg/datasets`,
        method: "POST",
        query: query,
        body: dataset,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetDataset
     * @summary Returns the specified dataset from **My workspace**.
     * @request GET:/v1.0/myorg/datasets/{datasetId}
     */
    datasetsGetDataset: (datasetId: string, params: RequestParams = {}) =>
      this.request<Dataset, any>({
        path: `/v1.0/myorg/datasets/${datasetId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must be the dataset owner. ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsUpdateDataset
     * @summary Updates the properties for the specified dataset from **My workspace**.
     * @request PATCH:/v1.0/myorg/datasets/{datasetId}
     */
    datasetsUpdateDataset: (
      datasetId: string,
      updateDatasetRequest: UpdateDatasetRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/datasets/${datasetId}`,
        method: "PATCH",
        body: updateDatasetRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsDeleteDataset
     * @summary Deletes the specified dataset from **My workspace**.
     * @request DELETE:/v1.0/myorg/datasets/{datasetId}
     */
    datasetsDeleteDataset: (datasetId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/datasets/${datasetId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description DAX query errors will result in: - A response error, such as `DAX query failure`. - A failure HTTP status code (400). A query that requests more than one table, or more than the allowed number of table rows, will result in: - Limited data being returned. - A response error, such as `More than one result table in a query` or `More than {allowed number} rows in a query result`. - A successful HTTP status code (200). Columns that are fully qualified in the query will be returned with a fully qualified name, for example, `MyTable[MyColumn]`. Columns that are renamed or created in the query will be returned within square bracket, for example, `[MyNewColumn]`. ## Permissions The user must have [Manage dataset access permissions](/power-bi/connect-data/service-datasets-manage-access-permissions). ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All ## Limitations - Datasets that are hosted in Azure Analysis Services or that have a live connection to an on-premises Azure Analysis Services model aren't supported. - The tenant setting **Dataset Execute Queries REST API**, found under **Integration settings**, must be enabled. - One query per API call. - One table request per query. - Maximum of 100,000 rows or 1,000,000 values per query (whichever is hit first). For example if you query for 5 columns, you can get back max 100,000 rows. If you query for 20 columns, you can get back max 50,000 rows (1 million divided by 20). - Maximum of 15MB of data per query. Once 15MB is exceeded, the current row will be completed but no additional rows will be written. - Maximum of 120 requests per user per minute. Target dataset does not impact this rate limit. - Service Principals aren't supported for datasets with RLS per [RLS limitations](/power-bi/admin/service-admin-rls#considerations-and-limitations) or with SSO enabled. To use Service Principals, make sure the admin tenant setting [_Allow service principals to use Power BI APIs_](/power-bi/admin/service-admin-portal-developer#allow-service-principals-to-use-power-bi-apis) under _Developer settings_ is enabled. - Only DAX queries are supported at this time. MDX and DMV queries are not supported. <br><br>
     *
     * @tags Datasets
     * @name DatasetsExecuteQueries
     * @summary Executes Data Analysis Expressions (DAX) queries against the provided dataset. The dataset must reside in **My workspace** or another workspace.
     * @request POST:/v1.0/myorg/datasets/{datasetId}/executeQueries
     */
    datasetsExecuteQueries: (
      datasetId: string,
      requestMessage: DatasetExecuteQueriesRequest,
      params: RequestParams = {},
    ) =>
      this.request<DatasetExecuteQueriesResponse, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/executeQueries`,
        method: "POST",
        body: requestMessage,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All ## Limitations This API call only supports **push datasets**. For a complete list of limitations, see [Push datasets limitations](/power-bi/developer/embedded/push-datasets-limitations). <br><br>
     *
     * @tags PushDatasets
     * @name DatasetsGetTables
     * @summary Returns a list of tables within the specified dataset from **My workspace**.
     * @request GET:/v1.0/myorg/datasets/{datasetId}/tables
     */
    datasetsGetTables: (datasetId: string, params: RequestParams = {}) =>
      this.request<Tables, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/tables`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All ## Limitations This API call only supports **push datasets**. <br><br>
     *
     * @tags PushDatasets
     * @name DatasetsPutTable
     * @summary Updates the metadata and schema for the specified table within the specified dataset from **My workspace**.
     * @request PUT:/v1.0/myorg/datasets/{datasetId}/tables/{tableName}
     */
    datasetsPutTable: (datasetId: string, tableName: string, requestMessage: Table, params: RequestParams = {}) =>
      this.request<Table, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/tables/${tableName}`,
        method: "PUT",
        body: requestMessage,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All ## Limitations - This API call only supports **push datasets**. - See [Power BI REST API limitations](/power-bi/developer/automation/api-rest-api-limitations). <br><br>
     *
     * @tags PushDatasets
     * @name DatasetsPostRows
     * @summary Adds new data rows to the specified table within the specified dataset from **My workspace**.
     * @request POST:/v1.0/myorg/datasets/{datasetId}/tables/{tableName}/rows
     */
    datasetsPostRows: (
      datasetId: string,
      tableName: string,
      requestMessage: PostRowsRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/tables/${tableName}/rows`,
        method: "POST",
        body: requestMessage,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All ## Limitations This API call only supports **push datasets**. For a complete list of limitations, see [Push datasets limitations](/power-bi/developer/embedded/push-datasets-limitations). <br><br>
     *
     * @tags PushDatasets
     * @name DatasetsDeleteRows
     * @summary Deletes all rows from the specified table within the specified dataset from **My workspace**.
     * @request DELETE:/v1.0/myorg/datasets/{datasetId}/tables/{tableName}/rows
     */
    datasetsDeleteRows: (datasetId: string, tableName: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/tables/${tableName}/rows`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All ## Limitations OneDrive refresh history isn't returned. <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetRefreshHistory
     * @summary Returns the refresh history for the specified dataset from **My workspace**.
     * @request GET:/v1.0/myorg/datasets/{datasetId}/refreshes
     */
    datasetsGetRefreshHistory: (
      datasetId: string,
      query?: {
        /**
         * The requested number of entries in the refresh history. If not provided, the default is the last available 500 entries.
         * @min 1
         */
        $top?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Refreshes, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/refreshes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All ## Limitations - For Shared capacities, a maximum of eight requests per day, including refreshes executed by using scheduled refresh, can be initiated. - For Shared capacities, only `notifyOption` can be specified in the request body. - Enhanced refresh is not supported for shared capacities. - For enhanced refresh, `notifyOption` is not required and must be excluded from the request body. However, one or more parameters other than `notifyOption` are required. - For Premium capacities, the maximum requests per day is only limited by the available resources in the capacity. If available resources are overloaded, refreshes are throttled until the load is reduced. The refresh will fail if throttling exceeds 1 hour. <br><br>
     *
     * @tags Datasets
     * @name DatasetsRefreshDataset
     * @summary Triggers a refresh for the specified dataset from **My workspace**. An [enhanced refresh](/power-bi/connect-data/asynchronous-refresh) is triggered only if a request payload other than `notifyOption` is set.
     * @request POST:/v1.0/myorg/datasets/{datasetId}/refreshes
     */
    datasetsRefreshDataset: (
      datasetId: string,
      datasetRefreshRequest: DatasetRefreshRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/refreshes`,
        method: "POST",
        body: datasetRefreshRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetRefreshExecutionDetails
     * @summary Returns execution details of an [enhanced refresh operation](/power-bi/connect-data/asynchronous-refresh) for the specified dataset from **My workspace**.
     * @request GET:/v1.0/myorg/datasets/{datasetId}/refreshes/{refreshId}
     */
    datasetsGetRefreshExecutionDetails: (datasetId: string, refreshId: string, params: RequestParams = {}) =>
      this.request<DatasetRefreshDetail, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/refreshes/${refreshId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsCancelRefresh
     * @summary Cancels the specified refresh operation for the specified dataset from **My workspace**.
     * @request DELETE:/v1.0/myorg/datasets/{datasetId}/refreshes/{refreshId}
     */
    datasetsCancelRefresh: (datasetId: string, refreshId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/refreshes/${refreshId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetRefreshSchedule
     * @summary Returns the refresh schedule for the specified dataset from **My workspace**.
     * @request GET:/v1.0/myorg/datasets/{datasetId}/refreshSchedule
     */
    datasetsGetRefreshSchedule: (datasetId: string, params: RequestParams = {}) =>
      this.request<RefreshSchedule, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/refreshSchedule`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description A request that disables the refresh schedule should contain no other changes. At least one day must be specified. If no times are specified, then Power BI will use a default single time per day. ## Permissions The user must be the dataset owner. ## Required Scope Dataset.ReadWrite.All ## Limitations The limit on the number of time slots per day depends on whether a [Premium](/power-bi/admin/service-premium-what-is) or Shared capacity is used. <br><br>
     *
     * @tags Datasets
     * @name DatasetsUpdateRefreshSchedule
     * @summary Updates the refresh schedule for the specified dataset from **My workspace**.
     * @request PATCH:/v1.0/myorg/datasets/{datasetId}/refreshSchedule
     */
    datasetsUpdateRefreshSchedule: (
      datasetId: string,
      datasetModelRefreshScheduleRequest: RefreshScheduleRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/refreshSchedule`,
        method: "PATCH",
        body: datasetModelRefreshScheduleRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetDirectQueryRefreshSchedule
     * @summary Returns the refresh schedule for a specified [DirectQuery](/power-bi/connect-data/desktop-directquery-about) or [LiveConnection](/power-bi/connect-data/desktop-directquery-about#live-connections) dataset from **My workspace**.
     * @request GET:/v1.0/myorg/datasets/{datasetId}/directQueryRefreshSchedule
     */
    datasetsGetDirectQueryRefreshSchedule: (datasetId: string, params: RequestParams = {}) =>
      this.request<DirectQueryRefreshSchedule, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/directQueryRefreshSchedule`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description A request should contain either a set of days and times *or* a valid frequency, but not both. If you choose a set of days without specifying any times, then Power BI will use a default single time per day. Setting the frequency will automatically overwrite the days and times setting. ## Permissions The user must be the dataset owner. ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsUpdateDirectQueryRefreshSchedule
     * @summary Updates the refresh schedule for a specified [DirectQuery](/power-bi/connect-data/desktop-directquery-about) or [LiveConnection](/power-bi/connect-data/desktop-directquery-about#live-connections) dataset from **My workspace**.
     * @request PATCH:/v1.0/myorg/datasets/{datasetId}/directQueryRefreshSchedule
     */
    datasetsUpdateDirectQueryRefreshSchedule: (
      datasetId: string,
      datasetDQRefreshScheduleRequest: DirectQueryRefreshScheduleRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/directQueryRefreshSchedule`,
        method: "PATCH",
        body: datasetDQRefreshScheduleRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.Read.All or Dataset.ReadWrite.All ## Limitations Datasets with SQL, Oracle, Teradata, and SAP HANA [DirectQuery](/power-bi/connect-data/desktop-directquery-about) connections aren't supported. <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetParameters
     * @summary Returns a list of parameters for the specified dataset from **My workspace**.
     * @request GET:/v1.0/myorg/datasets/{datasetId}/parameters
     */
    datasetsGetParameters: (datasetId: string, params: RequestParams = {}) =>
      this.request<MashupParameters, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/parameters`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description > [!NOTE] > We recommend using [enhanced dataset metadata](/power-bi/connect-data/desktop-enhanced-dataset-metadata) with this API call. > [!IMPORTANT] > > - If you're using **enhanced dataset metadata**, refresh the dataset to apply the new parameter values. > - If you're not using **enhanced dataset metadata**, wait 30 minutes for the update data sources operation to complete, and then refresh the dataset. ## Permissions The user must be the dataset owner. ## Required Scope Dataset.ReadWrite.All ## Limitations - Datasets created using the public [XMLA endpoint](/power-bi/admin/service-premium-connect-tools) aren't supported. To make changes to those data sources, the admin must use the Azure Analysis Services client library for Tabular Object Model. - [DirectQuery](/power-bi/connect-data/desktop-directquery-about) connections are only supported with [enhanced dataset metadata](/power-bi/connect-data/desktop-enhanced-dataset-metadata). - Datasets with Azure Analysis Services live connections aren't supported. - Maximum of 100 parameters per request. - All specified parameters must exist in the dataset. - Parameters values should be of the expected type. - The parameter list can't be empty or include duplicate parameters. - Parameters names are case-sensitive. - Parameter `IsRequired` must have a non-empty value. - The parameter types `Any` and `Binary` can't be updated. <br><br>
     *
     * @tags Datasets
     * @name DatasetsUpdateParameters
     * @summary Updates the parameters values for the specified dataset from **My workspace**.
     * @request POST:/v1.0/myorg/datasets/{datasetId}/Default.UpdateParameters
     */
    datasetsUpdateParameters: (
      datasetId: string,
      updateMashupParametersRequest: UpdateMashupParametersRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/Default.UpdateParameters`,
        method: "POST",
        body: updateMashupParametersRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetDatasources
     * @summary Returns a list of data sources for the specified dataset from **My workspace**.
     * @request GET:/v1.0/myorg/datasets/{datasetId}/datasources
     */
    datasetsGetDatasources: (datasetId: string, params: RequestParams = {}) =>
      this.request<Datasources, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/datasources`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description > [!NOTE] > We recommend using [enhanced dataset metadata](/power-bi/connect-data/desktop-enhanced-dataset-metadata) with this API call. > [!IMPORTANT] > > - The original data source and the new data source must have the exact same schema. > - If you're using **enhanced dataset metadata**, refresh the dataset to get data from the new data sources. > - If you're not using **enhanced dataset metadata**, wait 30 minutes for the update data sources operation to complete, and then refresh the dataset. ## Permissions The user must be the dataset owner. ## Limitations - Datasets created using the public [XMLA endpoint](/power-bi/admin/service-premium-connect-tools) aren't supported. To make changes to those data sources, the admin must use the Azure Analysis Services client library for Tabular Object Model. - Only these data sources are supported: SQL Server, Azure SQL Server, Azure Analysis Services, Azure Synapse, OData, SharePoint, Teradata, and SAP HANA. For other data sources, use the [Update Parameters](/rest/api/power-bi/datasets/update-parameters) API call. - Changing the data source type isn't supported. - Data sources that contain parameters in the connection string aren't supported. - Updating data sources that are part of merged or joined tables is only supported if you're using [enhanced dataset metadata](/power-bi/connect-data/desktop-enhanced-dataset-metadata). - For an Advanced Query that references multiple data sources, only the first data source will be updated. To overcome this limitation, define the data source as a parameter and use the [Update Parameters](/rest/api/power-bi/datasets/update-parameters) API call. - Datasets with incremental refresh policy are not fully supported, calling this API may not work as expected and result of partial datasources update, to overcome this you can try run a dataset refresh before calling this API. ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsUpdateDatasources
     * @summary Updates the data sources of the specified dataset from **My workspace**.
     * @request POST:/v1.0/myorg/datasets/{datasetId}/Default.UpdateDatasources
     */
    datasetsUpdateDatasources: (
      datasetId: string,
      updateDatasourcesRequest: UpdateDatasourcesRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/Default.UpdateDatasources`,
        method: "POST",
        body: updateDatasourcesRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description > [!IMPORTANT] > This API call is deprecated and no longer supported. This API call isn't compatible with [enhanced dataset metadata](/power-bi/connect-data/desktop-enhanced-dataset-metadata). > > Instead use: > > - [Update Parameters](/rest/api/power-bi/datasets/update-parameters) to update connections for SQL, Azure Synapse, OData, and SharePoint data sources. > - [Update Datasources](/rest/api/power-bi/datasets/update-datasources) to connections for other data sources. ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsSetAllDatasetConnections
     * @summary Updates all connections for the specified dataset from **My workspace**. This API call only supports SQL DirectQuery datasets.
     * @request POST:/v1.0/myorg/datasets/{datasetId}/Default.SetAllConnections
     * @deprecated
     */
    datasetsSetAllDatasetConnections: (datasetId: string, parameters: ConnectionDetails, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/Default.SetAllConnections`,
        method: "POST",
        body: parameters,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description > [!IMPORTANT] > Add the API caller principal as a data source user on the gateway. ## Required Scope Dataset.ReadWrite.All ## Limitations Only supports the on-premises data gateway <br><br>
     *
     * @tags Datasets
     * @name DatasetsBindToGateway
     * @summary Binds the specified dataset from **My workspace** to the specified gateway, optionally with a given set of data source IDs. If you don't supply a specific data source ID, the dataset will be bound to the first matching data source in the gateway.
     * @request POST:/v1.0/myorg/datasets/{datasetId}/Default.BindToGateway
     */
    datasetsBindToGateway: (
      datasetId: string,
      bindToGatewayRequest: BindToGatewayRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/Default.BindToGateway`,
        method: "POST",
        body: bindToGatewayRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description > [!IMPORTANT] > This API call is deprecated, use [Get Datasources](/rest/api/power-bi/datasets/get-datasources) instead. ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetGatewayDatasources
     * @summary Returns a list of gateway data sources for the specified dataset from **My workspace**.
     * @request GET:/v1.0/myorg/datasets/{datasetId}/Default.GetBoundGatewayDatasources
     */
    datasetsGetGatewayDatasources: (datasetId: string, params: RequestParams = {}) =>
      this.request<GatewayDatasources, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/Default.GetBoundGatewayDatasources`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description This API call is only relevant to datasets that have at least one on-premises connection. For datasets with cloud-only connections, this API call returns an empty list. ## Required Scope Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsDiscoverGateways
     * @summary Returns a list of gateways that the specified dataset from **My workspace** can be bound to.
     * @request GET:/v1.0/myorg/datasets/{datasetId}/Default.DiscoverGateways
     */
    datasetsDiscoverGateways: (datasetId: string, params: RequestParams = {}) =>
      this.request<Gateways, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/Default.DiscoverGateways`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description When user permissions to a dataset have been recently updated, the new permissions might not be immediately available through API calls. To refresh user permissions, use the [Refresh User Permissions](/rest/api/power-bi/users/refresh-user-permissions) API call. ## Required Scope Dataset.ReadWrite.All ## Limitations - Adding permissions to service principals (app principalType) isn't supported - Caller must have ReadReshare permissions on the dataset. - This API call can't be used to grant dataset Write permission on the dataset <br><br>
     *
     * @tags Datasets
     * @name DatasetsPostDatasetUserInGroup
     * @summary Grants the specified user's permissions to the specified dataset.
     * @request POST:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/users
     */
    datasetsPostDatasetUserInGroup: (
      groupId: string,
      datasetId: string,
      userDetails: PostDatasetUserAccess,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/users`,
        method: "POST",
        body: userDetails,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description When user permissions to a dataset have been recently updated, the new permissions might not be immediately available through API calls. To refresh user permissions, use the [Refresh User Permissions](/rest/api/power-bi/users/refresh-user-permissions) API call. This API call can be used to remove all the dataset permissions of the specified user by using `datasetUserAccessRight: None` ## Required Scope Dataset.ReadWrite.All ## Permissions The permissions for this API call are listed in [Datasets permissions](/power-bi/developer/embedded/datasets-permissions). ## Limitations - Updating permissions to service principals (app principalType) isn't supported - Caller must have ReadWriteReshare permissions on the dataset. That is, folder admins, members and contributors with Reshare permissions, or dataset owners. - This API can't be used to add or remove *write* permission. - This API can't be used to remove folder-level inherited permissions. For folder admins and members, the ReadWriteReshareExplore permission on the folder's datasets is inherited. For folder contributors, the ReadWriteExplore permission on the folder's datasets is inherited. For folder viewers, the Read permission on the folder's datasets is inherited. <br><br>
     *
     * @tags Datasets
     * @name DatasetsPutDatasetUserInGroup
     * @summary Updates the existing dataset permissions of the specified user to the specified permissions.
     * @request PUT:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/users
     */
    datasetsPutDatasetUserInGroup: (
      groupId: string,
      datasetId: string,
      userDetails: DatasetUserAccess,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/users`,
        method: "PUT",
        body: userDetails,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description When user permissions to a dataset have been recently updated, the new permissions might not be immediately available through API calls. To refresh user permissions, use the [Refresh User Permissions](/rest/api/power-bi/users/refresh-user-permissions) API call. ## Permissions The permissions for this API call are listed in [Datasets permissions](/power-bi/developer/embedded/datasets-permissions). ## Required Scope Dataset.Read.All or Dataset.ReadWrite.All ## Limitations Caller must have ReadWriteReshare permissions on the dataset. That is, folder admins, members and contributors with Reshare permissions, or dataset owners. <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetDatasetUsersInGroup
     * @summary Returns a list of principals that have access to the specified dataset.
     * @request GET:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/users
     */
    datasetsGetDatasetUsersInGroup: (groupId: string, datasetId: string, params: RequestParams = {}) =>
      this.request<DatasetUsersAccess, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description When user permissions to a dataset have been recently updated, the new permissions might not be immediately available through API calls. To refresh user permissions, use the [Refresh User Permissions](/rest/api/power-bi/users/refresh-user-permissions) API call. ## Required Scope Dataset.ReadWrite.All ## Limitations - Adding permissions to service principals (app principalType) isn't supported - Caller must have ReadReshare permissions on the dataset. - This API call can't be used to grant dataset Write permission on the dataset <br><br>
     *
     * @tags Datasets
     * @name DatasetsPostDatasetUser
     * @summary Grants the specified user's permissions to the specified dataset.
     * @request POST:/v1.0/myorg/datasets/{datasetId}/users
     */
    datasetsPostDatasetUser: (datasetId: string, userDetails: PostDatasetUserAccess, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/users`,
        method: "POST",
        body: userDetails,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description When user permissions to a dataset have been recently updated, the new permissions might not be immediately available through API calls. To refresh user permissions, use the [Refresh User Permissions](/rest/api/power-bi/users/refresh-user-permissions) API call. This API call can be used to remove all the dataset permissions of the specified user by using `datasetUserAccessRight: None` ## Required Scope Dataset.ReadWrite.All ## Permissions The permissions for this API call are listed in [Datasets permissions](/power-bi/developer/embedded/datasets-permissions). ## Limitations - Updating permissions to service principals (app principalType) isn't supported - Caller must have ReadWriteReshare permissions on the dataset. That is, folder admins, members and contributors with Reshare permissions, or dataset owners. - This API can't be used to add or remove *write* permission. - This API can't be used to remove folder-level inherited permissions. For folder admins and members, the ReadWriteReshareExplore permission on the folder's datasets is inherited. For folder contributors, the ReadWriteExplore permission on the folder's datasets is inherited. For folder viewers, the Read permission on the folder's datasets is inherited. <br><br>
     *
     * @tags Datasets
     * @name DatasetsPutDatasetUser
     * @summary Updates the existing dataset permissions of the specified user to the specified permissions.
     * @request PUT:/v1.0/myorg/datasets/{datasetId}/users
     */
    datasetsPutDatasetUser: (datasetId: string, userDetails: DatasetUserAccess, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/users`,
        method: "PUT",
        body: userDetails,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description When user permissions to a dataset have been recently updated, the new permissions might not be immediately available through API calls. To refresh user permissions, use the [Refresh User Permissions](/rest/api/power-bi/users/refresh-user-permissions) API call. ## Permissions The permissions for this API call are listed in [Datasets permissions](/power-bi/developer/embedded/datasets-permissions). ## Required Scope Dataset.Read.All or Dataset.ReadWrite.All ## Limitations Caller must have ReadWriteReshare permissions on the dataset. That is, folder admins, members and contributors with Reshare permissions, or dataset owners. <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetDatasetUsers
     * @summary Returns a list of principals that have access to the specified dataset.
     * @request GET:/v1.0/myorg/datasets/{datasetId}/users
     */
    datasetsGetDatasetUsers: (datasetId: string, params: RequestParams = {}) =>
      this.request<DatasetUsersAccess, any>({
        path: `/v1.0/myorg/datasets/${datasetId}/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description When a user is granted permissions to a workspace, app, or Power BI item (such as a report or a dashboard), the new permissions might not be immediately available through API calls. This operation refreshes user permissions to ensure they're fully updated. > [!IMPORTANT] > > - Call **Refresh User Permissions** before making other API calls. > - Since it takes about two minutes for the permissions to get refreshed, wait for two minutes before making other API calls. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Workspace.Read.All or Workspace.ReadWrite.All ## Limitations Maximum one call per user per hour. <br><br>
     *
     * @tags Users
     * @name UsersRefreshUserPermissions
     * @summary Refreshes user permissions in Power BI.
     * @request POST:/v1.0/myorg/RefreshUserPermissions
     */
    usersRefreshUserPermissions: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/RefreshUserPermissions`,
        method: "POST",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Imports
     * @name ImportsGetImports
     * @summary Returns a list of imports from **My workspace**.
     * @request GET:/v1.0/myorg/imports
     */
    importsGetImports: (params: RequestParams = {}) =>
      this.request<Imports, any>({
        path: `/v1.0/myorg/imports`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description See the [Import Large Files](https://github.com/microsoft/PowerBI-Developer-Samples/blob/master/PowerShell%20Scripts/Import%20Large%20Files) PowerShell script for an example of using this API. > [!NOTE] > Supported content: > - Power BI .pbix files > - JSON files (.json) > - Excel files (.xlsx) > - RDL files (.rdl) - To import a file, specify the content type **multipart/form-data** in the request headers and encode the file as [form data](https://www.w3.org/TR/html401/interact/forms.html) in the request body. - To import an .rdl file, include the file extension in the name specified by `datasetDisplayName`, as described in [URI parameters](/rest/api/power-bi/imports/post-import-in-group#uri-parameters). - To import an .xlsx file from OneDrive for Business, include the content type **application/json** in the request headers. Include [ImportInfo](/rest/api/power-bi/imports/post-import-in-group#importinfo) with `filePath` set to the .xlsx file path in the request body. - To import large Power BI .pbix files that are between 1 GB and 10 GB in size, see [Create Temporary Upload Location](/rest/api/power-bi/imports/create-temporary-upload-location). This is only supported for Premium capacity workspaces. - To create a dataflow from a model.json file, set `datasetDisplayName` to *model.json*, as described in [URI parameters](/rest/api/power-bi/imports/post-import-in-group#uri-parameters). ## Required Scope Dataset.ReadWrite.All ## Limitations - Dataflows with service principal aren't supported. - Importing a Power BI .pbix file from OneDrive isn't supported. - Importing a file that has a **protected** sensitivity label isn't supported for service principals. <br><br>
     *
     * @tags Imports
     * @name ImportsPostImport
     * @summary Creates new content in **My workspace**.
     * @request POST:/v1.0/myorg/imports
     */
    importsPostImport: (
      query: {
        /** The display name of the dataset, should include file extension. Not supported when importing from OneDrive for Business. */
        datasetDisplayName: string;
        /** Specifies what to do if a dataset with the same name already exists. The default value is `Ignore`. For RDL files, `Abort` and `Overwrite` are the only supported options. */
        nameConflict?: "Ignore" | "Abort" | "Overwrite" | "CreateOrOverwrite" | "GenerateUniqueName";
        /** Whether to skip report import. If specified, the value must be `true`. Only supported for Power BI .pbix files. */
        skipReport?: boolean;
        /** Whether to override the existing report label when republishing a Power BI .pbix file. The service default value is `true`. */
        overrideReportLabel?: boolean;
        /** Whether to override the existing label on a model when republishing a Power BI .pbix file. The service default value is `true`. */
        overrideModelLabel?: boolean;
      },
      importInfo: ImportInfo,
      params: RequestParams = {},
    ) =>
      this.request<Import, any>({
        path: `/v1.0/myorg/imports`,
        method: "POST",
        query: query,
        body: importInfo,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Imports
     * @name ImportsGetImport
     * @summary Returns the specified import from **My workspace**.
     * @request GET:/v1.0/myorg/imports/{importId}
     */
    importsGetImport: (importId: string, params: RequestParams = {}) =>
      this.request<Import, any>({
        path: `/v1.0/myorg/imports/${importId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description To import large Power BI .pbix files: 1. Create a temporary upload location using this API call. 1. Upload the Power BI .pbix files using the *shared access signature* URL from the API call response. 1. Call [Post Import In Group](/rest/api/power-bi/imports/post-import), specifying the *shared access signature* URL in the `fileUrl` parameter of the [request body](/rest/api/power-bi/imports/post-import#request-body). See the [Import Large Files](https://github.com/microsoft/PowerBI-Developer-Samples/blob/master/PowerShell%20Scripts/Import%20Large%20Files) PowerShell script for an example of using this API. ## Required Scope Dataset.ReadWrite.All ## Limitations Importing large Power BI .pbix files between 1 GB and 10 GB in size is only available for Premium capacity workspaces. <br><br>
     *
     * @tags Imports
     * @name ImportsCreateTemporaryUploadLocation
     * @summary Creates a temporary blob storage upload location for importing large Power BI .pbix files that are between 1 GB and 10 GB in size.
     * @request POST:/v1.0/myorg/imports/createTemporaryUploadLocation
     */
    importsCreateTemporaryUploadLocation: (params: RequestParams = {}) =>
      this.request<TemporaryUploadLocation, any>({
        path: `/v1.0/myorg/imports/createTemporaryUploadLocation`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description This API also returns shared reports and reports from shared apps. Reports that reside in shared workspaces can be accessed using the [Get Reports In Group API](/rest/api/power-bi/reports/get-reports-in-group). Since paginated reports (RDL) don't have a dataset, the dataset ID value in the API response for paginated reports isn't displayed. ## Required Scope Report.ReadWrite.All or Report.Read.All <br><br>
     *
     * @tags Reports
     * @name ReportsGetReports
     * @summary Returns a list of reports from **My workspace**.
     * @request GET:/v1.0/myorg/reports
     */
    reportsGetReports: (params: RequestParams = {}) =>
      this.request<Reports, any>({
        path: `/v1.0/myorg/reports`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Report.ReadWrite.All or Report.Read.All <br><br>
     *
     * @tags Reports
     * @name ReportsGetReport
     * @summary Returns the specified report from **My workspace**.
     * @request GET:/v1.0/myorg/reports/{reportId}
     */
    reportsGetReport: (reportId: string, params: RequestParams = {}) =>
      this.request<Report, any>({
        path: `/v1.0/myorg/reports/${reportId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Report.ReadWrite.All <br><br>
     *
     * @tags Reports
     * @name ReportsDeleteReport
     * @summary Deletes the specified report from **My workspace**.
     * @request DELETE:/v1.0/myorg/reports/{reportId}
     */
    reportsDeleteReport: (reportId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/reports/${reportId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description - If the dataset for a cloned report resides in two different workspaces or in **My workspace**, then a shared dataset will be created in the report's workspace. - When cloned, reports with a [live connection](/power-bi/desktop-report-lifecycle-datasets) will lose that connection and instead have a direct binding to the target dataset. ## Permissions The user must have all of the following, unless a requirement doesn't apply: - **Write** permission on the specified report. - **Build** permission on the target dataset, required if the `targetModelId` parameter is used. ## Required Scope Content.Create <br><br>
     *
     * @tags Reports
     * @name ReportsCloneReport
     * @summary Clones the specified report from **My workspace**.
     * @request POST:/v1.0/myorg/reports/{reportId}/Clone
     */
    reportsCloneReport: (reportId: string, requestParameters: CloneReportRequest, params: RequestParams = {}) =>
      this.request<Report, any>({
        path: `/v1.0/myorg/reports/${reportId}/Clone`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description - For .pbix reports - As a [workaround](/power-bi/developer/embedded/embedded-troubleshoot#how-to-fix-timeout-exceptions-when-using-import-and-export-apis) for timeout issues, set the `preferClientRouting` parameter to `true`. - Large files are downloaded to a temporary blob. Their URL is returned in the response, and stored in the locally downloaded Power BI .pbix file. - For more information on requirements and limitations, see [Download a report from the Power BI service to Power BI Desktop](/power-bi/create-reports/service-export-to-pbix). ## Required Scope Report.ReadWrite.All or both Report.Read.All and Dataset.Read.All ## Limitations For .pbix report, after calling [Rebind Report](/rest/api/power-bi/reports/rebind-report), export of a report with a [Power BI service live connection](/power-bi/desktop-report-lifecycle-datasets) isn't supported. <br><br>
     *
     * @tags Reports
     * @name ReportsExportReport
     * @summary Exports the specified report from **My workspace** to a Power BI .pbix or .rdl file.
     * @request GET:/v1.0/myorg/reports/{reportId}/Export
     */
    reportsExportReport: (reportId: string, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/v1.0/myorg/reports/${reportId}/Export`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Specify the source report in the request body. ## Required Scope Report.ReadWrite.All <br><br>
     *
     * @tags Reports
     * @name ReportsUpdateReportContent
     * @summary Updates the content of the specified report from **My workspace** with the content of a specified source report.
     * @request POST:/v1.0/myorg/reports/{reportId}/UpdateReportContent
     */
    reportsUpdateReportContent: (
      reportId: string,
      requestParameters: UpdateReportContentRequest,
      params: RequestParams = {},
    ) =>
      this.request<Report, any>({
        path: `/v1.0/myorg/reports/${reportId}/UpdateReportContent`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description - If the specified dataset resides in a different workspace than the report, then a shared dataset will be created in **My workspace**. - On rebind, reports with a [live connection](/power-bi/desktop-report-lifecycle-datasets) will lose that connection and instead have a direct binding to the target dataset. ## Permissions The user must have all of the following: - **Write** permission on the specified report. - **Build** permission on the target dataset. ## Required Scope Report.ReadWrite.All <br><br>
     *
     * @tags Reports
     * @name ReportsRebindReport
     * @summary Rebinds the specified report from **My workspace** to the specified dataset.
     * @request POST:/v1.0/myorg/reports/{reportId}/Rebind
     */
    reportsRebindReport: (reportId: string, requestParameters: RebindReportRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/reports/${reportId}/Rebind`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Report.ReadWrite.All or Report.Read.All <br><br>
     *
     * @tags Reports
     * @name ReportsGetPages
     * @summary Returns a list of pages within the specified report from **My workspace**.
     * @request GET:/v1.0/myorg/reports/{reportId}/pages
     */
    reportsGetPages: (reportId: string, params: RequestParams = {}) =>
      this.request<Pages, any>({
        path: `/v1.0/myorg/reports/${reportId}/pages`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Report.ReadWrite.All or Report.Read.All <br><br>
     *
     * @tags Reports
     * @name ReportsGetPage
     * @summary Returns the specified page within the specified report from **My workspace**.
     * @request GET:/v1.0/myorg/reports/{reportId}/pages/{pageName}
     */
    reportsGetPage: (reportId: string, pageName: string, params: RequestParams = {}) =>
      this.request<Page, any>({
        path: `/v1.0/myorg/reports/${reportId}/pages/${pageName}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Report.ReadWrite.All or Report.Read.All <br><br>
     *
     * @tags Reports
     * @name ReportsGetDatasources
     * @summary Returns a list of data sources for the specified paginated report (RDL) from **My workspace**.
     * @request GET:/v1.0/myorg/reports/{reportId}/datasources
     */
    reportsGetDatasources: (reportId: string, params: RequestParams = {}) =>
      this.request<Datasources, any>({
        path: `/v1.0/myorg/reports/${reportId}/datasources`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description > [!IMPORTANT] > Both the original data source and the new data source must have the exact same schema. ## Permissions The user must be the data source owner. ## Required Scope Reports.ReadWrite.All ## Limitations - Only supports paginated reports. - Changing the data source type isn't supported. <br><br>
     *
     * @tags Reports
     * @name ReportsUpdateDatasources
     * @summary Updates the data sources of the specified paginated report (RDL) from **My workspace**.
     * @request POST:/v1.0/myorg/reports/{reportId}/Default.UpdateDatasources
     */
    reportsUpdateDatasources: (
      reportId: string,
      updateRdlDatasourcesRequest: UpdateRdlDatasourcesRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/reports/${reportId}/Default.UpdateDatasources`,
        method: "POST",
        body: updateRdlDatasourcesRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The API is asynchronous. When the API is called, it triggers an export job. After triggering an export job, use [GetExportToFileStatus API](/rest/api/power-bi/reports/get-export-to-file-status) to track the job status. Read more about the entire flow: [Export Power BI reports](/power-bi/developer/embedded/export-to) and [Export Paginated reports](/power-bi/developer/embedded/export-paginated-report) ## Required Scope All of the following: - Report.ReadWrite.All or Report.Read.All - Dataset.ReadWrite.All or Dataset.Read.All ## Limitations Check the limitations in [Export Power BI report to file](/power-bi/developer/embedded/export-to#considerations-and-limitations) and [Export paginated report to file](/power-bi/developer/embedded/export-paginated-report#considerations-and-limitations). <br><br>
     *
     * @tags Reports
     * @name ReportsExportToFile
     * @summary Exports the specified report from **My workspace** to the requested [file format](/rest/api/power-bi/reports/export-to-file#fileformat).
     * @request POST:/v1.0/myorg/reports/{reportId}/ExportTo
     */
    reportsExportToFile: (reportId: string, requestParameters: ExportReportRequest, params: RequestParams = {}) =>
      this.request<Export, any>({
        path: `/v1.0/myorg/reports/${reportId}/ExportTo`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description When the export job status is 'Succeeded' use the [GetFileOfExportToFile API](/rest/api/power-bi/reports/get-file-of-export-to-file) to retrieve the file. ## Required Scope Report.ReadWrite.All or Report.Read.All <br><br>
     *
     * @tags Reports
     * @name ReportsGetExportToFileStatus
     * @summary Returns the current status of the [Export to File](/rest/api/power-bi/reports/export-to-file) job for the specified report from **My workspace**.
     * @request GET:/v1.0/myorg/reports/{reportId}/exports/{exportId}
     */
    reportsGetExportToFileStatus: (reportId: string, exportId: string, params: RequestParams = {}) =>
      this.request<Export, any>({
        path: `/v1.0/myorg/reports/${reportId}/exports/${exportId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Report.ReadWrite.All or Report.Read.All <br><br>
     *
     * @tags Reports
     * @name ReportsGetFileOfExportToFile
     * @summary Returns the file from the [Export to File](/rest/api/power-bi/reports/export-to-file) job for the specified report from **My workspace**.
     * @request GET:/v1.0/myorg/reports/{reportId}/exports/{exportId}/file
     */
    reportsGetFileOfExportToFile: (reportId: string, exportId: string, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/v1.0/myorg/reports/${reportId}/exports/${exportId}/file`,
        method: "GET",
        format: "blob",
        ...params,
      }),

    /**
     * @description This API also returns shared dashboards and dashboards from shared apps. Dashboards that reside in shared workspaces can be accessed using the [Get Dashboards In Group API](/rest/api/power-bi/dashboards/get-dashboards-in-group). ## Required Scope Dashboard.ReadWrite.All or Dashboard.Read.All <br><br>
     *
     * @tags Dashboards
     * @name DashboardsGetDashboards
     * @summary Returns a list of dashboards from **My workspace**.
     * @request GET:/v1.0/myorg/dashboards
     */
    dashboardsGetDashboards: (params: RequestParams = {}) =>
      this.request<Dashboards, any>({
        path: `/v1.0/myorg/dashboards`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Content.Create <br><br>
     *
     * @tags Dashboards
     * @name DashboardsAddDashboard
     * @summary Creates a new empty dashboard in **My workspace**.
     * @request POST:/v1.0/myorg/dashboards
     */
    dashboardsAddDashboard: (requestParameters: AddDashboardRequest, params: RequestParams = {}) =>
      this.request<Dashboard, any>({
        path: `/v1.0/myorg/dashboards`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dashboard.ReadWrite.All or Dashboard.Read.All <br><br>
     *
     * @tags Dashboards
     * @name DashboardsGetDashboard
     * @summary Returns the specified dashboard from **My workspace**.
     * @request GET:/v1.0/myorg/dashboards/{dashboardId}
     */
    dashboardsGetDashboard: (dashboardId: string, params: RequestParams = {}) =>
      this.request<Dashboard, any>({
        path: `/v1.0/myorg/dashboards/${dashboardId}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dashboard.ReadWrite.All <br><br>
     *
     * @tags Dashboards
     * @name DashboardsDeleteDashboard
     * @summary Deletes the specified dashboard from **My workspace**.
     * @request DELETE:/v1.0/myorg/dashboards/{dashboardId}
     */
    dashboardsDeleteDashboard: (dashboardId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/dashboards/${dashboardId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Supported tiles include datasets and live tiles that contain an entire report page. ## Required Scope Dashboard.ReadWrite.All or Dashboard.Read.All <br><br>
     *
     * @tags Dashboards
     * @name DashboardsGetTiles
     * @summary Returns a list of tiles within the specified dashboard from **My workspace**.
     * @request GET:/v1.0/myorg/dashboards/{dashboardId}/tiles
     */
    dashboardsGetTiles: (dashboardId: string, params: RequestParams = {}) =>
      this.request<Tiles, any>({
        path: `/v1.0/myorg/dashboards/${dashboardId}/tiles`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Supported tiles include datasets and live tiles that contain an entire report page. ## Required Scope Dashboard.ReadWrite.All or Dashboard.Read.All <br><br>
     *
     * @tags Dashboards
     * @name DashboardsGetTile
     * @summary Returns the specified tile within the specified dashboard from **My workspace**.
     * @request GET:/v1.0/myorg/dashboards/{dashboardId}/tiles/{tileId}
     */
    dashboardsGetTile: (dashboardId: string, tileId: string, params: RequestParams = {}) =>
      this.request<Tile, any>({
        path: `/v1.0/myorg/dashboards/${dashboardId}/tiles/${tileId}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description When a tile is cloned to another workspace and bound to another report and dataset, it's cloned as is with its underlying query containing the original report filters. If the target report ID and target dataset are missing, the following can occur: - If you're cloning a tile within the same workspace, the report and dataset links will be cloned from the source tile. - If you're cloning a tile within a different workspace, report and dataset links will be removed, and the tile will be broken. ## Required Scope Dashboard.ReadWrite.All <br><br>
     *
     * @tags Dashboards
     * @name DashboardsCloneTile
     * @summary Clones the specified tile from **My workspace**.
     * @request POST:/v1.0/myorg/dashboards/{dashboardId}/tiles/{tileId}/Clone
     */
    dashboardsCloneTile: (
      dashboardId: string,
      tileId: string,
      requestParameters: CloneTileRequest,
      params: RequestParams = {},
    ) =>
      this.request<Tile, any>({
        path: `/v1.0/myorg/dashboards/${dashboardId}/tiles/${tileId}/Clone`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetDatasetsInGroup
     * @summary Returns a list of datasets from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/datasets
     */
    datasetsGetDatasetsInGroup: (groupId: string, params: RequestParams = {}) =>
      this.request<Datasets, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All ## Limitations This API call only supports **push datasets**. For a complete list of limitations, see [Push datasets limitations](/power-bi/developer/embedded/push-datasets-limitations). <br><br>
     *
     * @tags PushDatasets
     * @name DatasetsPostDatasetInGroup
     * @summary Creates a new dataset in the specified workspace.
     * @request POST:/v1.0/myorg/groups/{groupId}/datasets
     */
    datasetsPostDatasetInGroup: (
      groupId: string,
      dataset: CreateDatasetRequest,
      query?: {
        /** The default retention policy */
        defaultRetentionPolicy?: "None" | "basicFIFO";
      },
      params: RequestParams = {},
    ) =>
      this.request<Dataset, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets`,
        method: "POST",
        query: query,
        body: dataset,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetDatasetToDataflowsLinksInGroup
     * @summary Returns a list of upstream dataflows for datasets from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/datasets/upstreamDataflows
     */
    datasetsGetDatasetToDataflowsLinksInGroup: (groupId: string, params: RequestParams = {}) =>
      this.request<DatasetToDataflowLinksResponse, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/upstreamDataflows`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetDatasetInGroup
     * @summary Returns the specified dataset from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}
     */
    datasetsGetDatasetInGroup: (groupId: string, datasetId: string, params: RequestParams = {}) =>
      this.request<Dataset, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must be the dataset owner. ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsUpdateDatasetInGroup
     * @summary Updates the properties for the specified dataset from the specified workspace.
     * @request PATCH:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}
     */
    datasetsUpdateDatasetInGroup: (
      groupId: string,
      datasetId: string,
      updateDatasetRequest: UpdateDatasetRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}`,
        method: "PATCH",
        body: updateDatasetRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsDeleteDatasetInGroup
     * @summary Deletes the specified dataset from the specified workspace.
     * @request DELETE:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}
     */
    datasetsDeleteDatasetInGroup: (groupId: string, datasetId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Required Scope ## Limitations This API call only supports **push datasets**. For a complete list of limitations, see [Push datasets limitations](/power-bi/developer/embedded/push-datasets-limitations). <br><br>
     *
     * @tags PushDatasets
     * @name DatasetsGetTablesInGroup
     * @summary Returns a list of tables within the specified dataset from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/tables
     */
    datasetsGetTablesInGroup: (groupId: string, datasetId: string, params: RequestParams = {}) =>
      this.request<Tables, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/tables`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All ## Limitations This API call only supports **push datasets**. <br><br>
     *
     * @tags PushDatasets
     * @name DatasetsPutTableInGroup
     * @summary Updates the metadata and schema for the specified table within the specified dataset from the specified workspace.
     * @request PUT:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/tables/{tableName}
     */
    datasetsPutTableInGroup: (
      groupId: string,
      datasetId: string,
      tableName: string,
      requestMessage: Table,
      params: RequestParams = {},
    ) =>
      this.request<Table, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/tables/${tableName}`,
        method: "PUT",
        body: requestMessage,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All ## Limitations - This API call only supports **push datasets**. - See [Power BI REST API limitations](/power-bi/developer/automation/api-rest-api-limitations). <br><br>
     *
     * @tags PushDatasets
     * @name DatasetsPostRowsInGroup
     * @summary Adds new data rows to the specified table within the specified dataset from the specified workspace.
     * @request POST:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/tables/{tableName}/rows
     */
    datasetsPostRowsInGroup: (
      groupId: string,
      datasetId: string,
      tableName: string,
      requestMessage: PostRowsRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/tables/${tableName}/rows`,
        method: "POST",
        body: requestMessage,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All ## Limitations This API call only supports **push datasets**. For a complete list of limitations, see [Push datasets limitations](/power-bi/developer/embedded/push-datasets-limitations). <br><br>
     *
     * @tags PushDatasets
     * @name DatasetsDeleteRowsInGroup
     * @summary Deletes all rows from the specified table within the specified dataset from the specified workspace.
     * @request DELETE:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/tables/{tableName}/rows
     */
    datasetsDeleteRowsInGroup: (groupId: string, datasetId: string, tableName: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/tables/${tableName}/rows`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All ## Limitations OneDrive refresh history isn't returned. <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetRefreshHistoryInGroup
     * @summary Returns the refresh history for the specified dataset from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/refreshes
     */
    datasetsGetRefreshHistoryInGroup: (
      groupId: string,
      datasetId: string,
      query?: {
        /**
         * The requested number of entries in the refresh history. If not provided, the default is the last available 500 entries.
         * @min 1
         */
        $top?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Refreshes, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/refreshes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All ## Limitations - For Shared capacities, a maximum of eight requests per day, including refreshes executed by using scheduled refresh, can be initiated. - For Shared capacities, only `notifyOption` can be specified in the request body. - Enhanced refresh is not supported for shared capacities. - For enhanced refresh, `notifyOption` is not required and must be excluded from the request body. However, one or more parameters other than `notifyOption` are required. - For Premium capacities, the maximum requests per day is only limited by the available resources in the capacity. If available resources are overloaded, refreshes are throttled until the load is reduced. The refresh will fail if throttling exceeds 1 hour. <br><br>
     *
     * @tags Datasets
     * @name DatasetsRefreshDatasetInGroup
     * @summary Triggers a refresh for the specified dataset from the specified workspace. An [enhanced refresh](/power-bi/connect-data/asynchronous-refresh) is triggered only if a request payload other than `notifyOption` is set.
     * @request POST:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/refreshes
     */
    datasetsRefreshDatasetInGroup: (
      groupId: string,
      datasetId: string,
      datasetRefreshRequest: DatasetRefreshRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/refreshes`,
        method: "POST",
        body: datasetRefreshRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetRefreshExecutionDetailsInGroup
     * @summary Returns execution details of an [enhanced refresh operation](/power-bi/connect-data/asynchronous-refresh) for the specified dataset from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/refreshes/{refreshId}
     */
    datasetsGetRefreshExecutionDetailsInGroup: (
      groupId: string,
      datasetId: string,
      refreshId: string,
      params: RequestParams = {},
    ) =>
      this.request<DatasetRefreshDetail, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/refreshes/${refreshId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsCancelRefreshInGroup
     * @summary Cancels the specified refresh operation for the specified dataset from the specified workspace.
     * @request DELETE:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/refreshes/{refreshId}
     */
    datasetsCancelRefreshInGroup: (groupId: string, datasetId: string, refreshId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/refreshes/${refreshId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetRefreshScheduleInGroup
     * @summary Returns the refresh schedule for the specified dataset from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/refreshSchedule
     */
    datasetsGetRefreshScheduleInGroup: (groupId: string, datasetId: string, params: RequestParams = {}) =>
      this.request<RefreshSchedule, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/refreshSchedule`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description A request that disables the refresh schedule should contain no other changes. At least one day must be specified. If no times are specified, then Power BI will use a default single time per day. ## Permissions - The user must be the dataset owner. - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All ## Limitations The limit on the number of time slots per day depends on whether a [Premium](/power-bi/admin/service-premium-what-is) or Shared capacity is used. <br><br>
     *
     * @tags Datasets
     * @name DatasetsUpdateRefreshScheduleInGroup
     * @summary Updates the refresh schedule for the specified dataset from the specified workspace.
     * @request PATCH:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/refreshSchedule
     */
    datasetsUpdateRefreshScheduleInGroup: (
      groupId: string,
      datasetId: string,
      datasetModelRefreshScheduleRequest: RefreshScheduleRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/refreshSchedule`,
        method: "PATCH",
        body: datasetModelRefreshScheduleRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetDirectQueryRefreshScheduleInGroup
     * @summary Returns the refresh schedule for a specified [DirectQuery](/power-bi/connect-data/desktop-directquery-about) or [LiveConnection](/power-bi/connect-data/desktop-directquery-about#live-connections) dataset from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/directQueryRefreshSchedule
     */
    datasetsGetDirectQueryRefreshScheduleInGroup: (groupId: string, datasetId: string, params: RequestParams = {}) =>
      this.request<DirectQueryRefreshSchedule, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/directQueryRefreshSchedule`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description A request should contain either a set of days and times *or* a valid frequency, but not both. If you choose a set of days without specifying any times, then Power BI will use a default single time per day. Setting the frequency will automatically overwrite the days and times setting. ## Permissions - The user must be the dataset owner. - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsUpdateDirectQueryRefreshScheduleInGroup
     * @summary Updates the refresh schedule for a specified [DirectQuery](/power-bi/connect-data/desktop-directquery-about) or [LiveConnection](/power-bi/connect-data/desktop-directquery-about#live-connections) dataset from the specified workspace.
     * @request PATCH:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/directQueryRefreshSchedule
     */
    datasetsUpdateDirectQueryRefreshScheduleInGroup: (
      groupId: string,
      datasetId: string,
      datasetDQRefreshScheduleRequest: DirectQueryRefreshScheduleRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/directQueryRefreshSchedule`,
        method: "PATCH",
        body: datasetDQRefreshScheduleRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.Read.All or Dataset.ReadWrite.All ## Limitations Datasets with SQL, Oracle, Teradata, and SAP HANA [DirectQuery](/power-bi/connect-data/desktop-directquery-about) connections aren't supported. <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetParametersInGroup
     * @summary Returns a list of parameters for the specified dataset from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/parameters
     */
    datasetsGetParametersInGroup: (groupId: string, datasetId: string, params: RequestParams = {}) =>
      this.request<MashupParameters, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/parameters`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description > [!NOTE] > We recommend using [enhanced dataset metadata](/power-bi/connect-data/desktop-enhanced-dataset-metadata) with this API call. > [!IMPORTANT] > > - If you're using **enhanced dataset metadata**, refresh the dataset to apply the new parameter values. > - If you're not using **enhanced dataset metadata**, wait 30 minutes for the update data sources operation to complete, and then refresh the dataset. ## Permissions - The user must be the dataset owner. - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All ## Limitations - Datasets created using the public [XMLA endpoint](/power-bi/admin/service-premium-connect-tools) aren't supported. To make changes to those data sources, the admin must use the Azure Analysis Services client library for Tabular Object Model. - [DirectQuery](/power-bi/connect-data/desktop-directquery-about) connections are only supported with [enhanced dataset metadata](/power-bi/connect-data/desktop-enhanced-dataset-metadata). - Datasets with Azure Analysis Services live connections aren't supported. - Maximum of 100 parameters per request. - All specified parameters must exist in the dataset. - Parameters values should be of the expected type. - The parameter list can't be empty or include duplicate parameters. - Parameters names are case-sensitive. - Parameter `IsRequired` must have a non-empty value. - The parameter types `Any` and `Binary` can't be updated. <br><br>
     *
     * @tags Datasets
     * @name DatasetsUpdateParametersInGroup
     * @summary Updates the parameters values for the specified dataset from the specified workspace.
     * @request POST:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/Default.UpdateParameters
     */
    datasetsUpdateParametersInGroup: (
      groupId: string,
      datasetId: string,
      updateMashupParametersRequest: UpdateMashupParametersRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/Default.UpdateParameters`,
        method: "POST",
        body: updateMashupParametersRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetDatasourcesInGroup
     * @summary Returns a list of data sources for the specified dataset from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/datasources
     */
    datasetsGetDatasourcesInGroup: (groupId: string, datasetId: string, params: RequestParams = {}) =>
      this.request<Datasources, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/datasources`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description > [!NOTE] > We recommend using [enhanced dataset metadata](/power-bi/connect-data/desktop-enhanced-dataset-metadata) with this API call. > [!IMPORTANT] > > - The original data source and the new data source must have the exact same schema. > - If you're using **enhanced dataset metadata**, refresh the dataset to get data from the new data sources. > - If you're not using **enhanced dataset metadata**, wait 30 minutes for the update data sources operation to complete, and then refresh the dataset. ## Permissions - The user must be the dataset owner. - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All ## Limitations - Datasets created using the public [XMLA endpoint](/power-bi/admin/service-premium-connect-tools) aren't supported. To make changes to those data sources, the admin must use the Azure Analysis Services client library for Tabular Object Model. - Only these data sources are supported: SQL Server, Azure SQL Server, Azure Analysis Services, Azure Synapse, OData, SharePoint, Teradata, and SAP HANA. For other data sources, use the [Update Parameters In Group](/rest/api/power-bi/datasets/update-parameters-in-group) API call. - Changing the data source type isn't supported. - Data sources that contain parameters in the connection string aren't supported. - Updating data sources that are part of merged or joined tables is only supported if you're using [enhanced dataset metadata](/power-bi/connect-data/desktop-enhanced-dataset-metadata). - For an Advanced Query that reference multiple data sources, only the first data source will be updated. To overcome this limitation, define the data source as a parameter and use the [Update Parameters In Group](/rest/api/power-bi/datasets/update-parameters-in-group) API call. - Datasets with incremental refresh policy are not fully supported, calling this API may not work as expected and result of partial datasources update, to overcome this you can try run a dataset refresh before calling this API. <br><br>
     *
     * @tags Datasets
     * @name DatasetsUpdateDatasourcesInGroup
     * @summary Updates the data sources of the specified dataset from the specified workspace.
     * @request POST:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/Default.UpdateDatasources
     */
    datasetsUpdateDatasourcesInGroup: (
      groupId: string,
      datasetId: string,
      updateDatasourcesRequest: UpdateDatasourcesRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/Default.UpdateDatasources`,
        method: "POST",
        body: updateDatasourcesRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description > [!IMPORTANT] > This API call is deprecated and no longer supported. This API call isn't compatible with [enhanced dataset metadata](/power-bi/connect-data/desktop-enhanced-dataset-metadata). > > Instead use: > > - [Update Parameters In Group](/rest/api/power-bi/datasets/update-parameters-in-group) to update connections for SQL, Azure Synapse, OData, and SharePoint data sources. > - [Update Datasources In Group](/rest/api/power-bi/datasets/update-datasources-in-group) to connections for other data sources. ## Required Scope Dataset.ReadWrite.All ## Limitations Supports SQL DirectQuery datasets. <br><br>
     *
     * @tags Datasets
     * @name DatasetsSetAllDatasetConnectionsInGroup
     * @summary Updates all connections for the specified dataset from the specified workspace. This API call only supports SQL DirectQuery datasets.
     * @request POST:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/Default.SetAllConnections
     * @deprecated
     */
    datasetsSetAllDatasetConnectionsInGroup: (
      groupId: string,
      datasetId: string,
      parameters: ConnectionDetails,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/Default.SetAllConnections`,
        method: "POST",
        body: parameters,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description > [!IMPORTANT] > Add the API caller principal as a data source user on the gateway. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All ## Limitations Only supports the on-premises data gateway <br><br>
     *
     * @tags Datasets
     * @name DatasetsBindToGatewayInGroup
     * @summary Binds the specified dataset from the specified workspace to the specified gateway, optionally with a given set of data source IDs. If you don't supply a specific data source ID, the dataset will be bound to the first matching data source in the gateway.
     * @request POST:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/Default.BindToGateway
     */
    datasetsBindToGatewayInGroup: (
      groupId: string,
      datasetId: string,
      bindToGatewayRequest: BindToGatewayRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/Default.BindToGateway`,
        method: "POST",
        body: bindToGatewayRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description > [!IMPORTANT] > This API call is deprecated, use [Get Datasources In Group](/rest/api/power-bi/datasets/get-datasources-in-group) instead. ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsGetGatewayDatasourcesInGroup
     * @summary Returns a list of gateway data sources for the specified dataset from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/Default.GetBoundGatewayDatasources
     */
    datasetsGetGatewayDatasourcesInGroup: (groupId: string, datasetId: string, params: RequestParams = {}) =>
      this.request<GatewayDatasources, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/Default.GetBoundGatewayDatasources`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description This API call is only relevant to datasets that have at least one on-premises connection. For datasets with cloud-only connections, this API call returns an empty list. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.Read.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsDiscoverGatewaysInGroup
     * @summary Returns a list of gateways that the specified dataset from the specified workspace can be bound to.
     * @request GET:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/Default.DiscoverGateways
     */
    datasetsDiscoverGatewaysInGroup: (groupId: string, datasetId: string, params: RequestParams = {}) =>
      this.request<Gateways, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/Default.DiscoverGateways`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Datasets
     * @name DatasetsTakeOverInGroup
     * @summary Transfers ownership over the specified dataset to the current authorized user.
     * @request POST:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/Default.TakeOver
     */
    datasetsTakeOverInGroup: (groupId: string, datasetId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/Default.TakeOver`,
        method: "POST",
        ...params,
      }),

    /**
     * @description DAX query errors will result in: - A response error, such as `DAX query failure`. - A failure HTTP status code (400). A query that requests more than one table, or more than the allowed number of table rows, will result in: - Limited data being returned. - A response error, such as `More than one result table in a query` or `More than {allowed number} rows in a query result`. - A successful HTTP status code (200). Columns that are fully qualified in the query will be returned with a fully qualified name, for example, `MyTable[MyColumn]`. Columns that are renamed or created in the query will be returned within square bracket, for example, `[MyNewColumn]`. ## Permissions The user must have [Manage dataset access permissions](/power-bi/connect-data/service-datasets-manage-access-permissions). ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All ## Limitations - Datasets that are hosted in Azure Analysis Services or that have a live connection to an on-premises Azure Analysis Services model aren't supported. - The tenant setting **Dataset Execute Queries REST API**, found under **Integration settings**, must be enabled. - One query per API call. - One table request per query. - Maximum of 100,000 rows or 1,000,000 values per query (whichever is hit first). For example if you query for 5 columns, you can get back max 100,000 rows. If you query for 20 columns, you can get back max 50,000 rows (1 million divided by 20). - Maximum of 15MB of data per query. Once 15MB is exceeded, the current row will be completed but no additional rows will be written. - Maximum of 120 requests per user per minute. Target dataset does not impact this rate limit. - Service Principals aren't supported for datasets with RLS per [RLS limitations](/power-bi/admin/service-admin-rls#considerations-and-limitations) or with SSO enabled. To use Service Principals, make sure the admin tenant setting [_Allow service principals to use Power BI APIs_](/power-bi/admin/service-admin-portal-developer#allow-service-principals-to-use-power-bi-apis) under _Developer settings_ is enabled. - Only DAX queries are supported at this time. MDX and DMV queries are not supported. <br><br>
     *
     * @tags Datasets
     * @name DatasetsExecuteQueriesInGroup
     * @summary Executes Data Analysis Expressions (DAX) queries against the provided dataset.
     * @request POST:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/executeQueries
     */
    datasetsExecuteQueriesInGroup: (
      groupId: string,
      datasetId: string,
      requestMessage: DatasetExecuteQueriesRequest,
      params: RequestParams = {},
    ) =>
      this.request<DatasetExecuteQueriesResponse, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/executeQueries`,
        method: "POST",
        body: requestMessage,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All ## Limitations Importing Power BI .pbix files from OneDrive isn't supported. <br><br>
     *
     * @tags Imports
     * @name ImportsGetImportsInGroup
     * @summary Returns a list of imports from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/imports
     */
    importsGetImportsInGroup: (groupId: string, params: RequestParams = {}) =>
      this.request<Imports, any>({
        path: `/v1.0/myorg/groups/${groupId}/imports`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description > [!NOTE] > Supported content: > > - Power BI .pbix files > - JSON files (.json) > - Excel files (.xlsx) > - SQL Server Report Definition Language files (.rdl) - To import a file, specify the content type **multipart/form-data** in the request headers and encode the file as [form data](https://www.w3.org/TR/html401/interact/forms.html) in the request body. - To import an .rdl file, include the file extension in the name specified by `datasetDisplayName`, as described in [URI parameters](/rest/api/power-bi/imports/post-import-in-group#uri-parameters). - To import an .xlsx file from OneDrive for Business, include the content type **application/json** in the request headers. Include [ImportInfo](/rest/api/power-bi/imports/post-import-in-group#importinfo) with `filePath` set to the .xlsx file path in the request body. - To import large Power BI .pbix files that are between 1 GB and 10 GB in size, see [Create Temporary Upload Location In Group](/rest/api/power-bi/imports/create-temporary-upload-location-in-group) and the [Import Large Files](https://github.com/microsoft/PowerBI-Developer-Samples/blob/master/PowerShell%20Scripts/Import%20Large%20Files) PowerShell script. This is only supported for Premium capacity workspaces. - To create a dataflow from a model.json file, set `datasetDisplayName` to *model.json*, as described in [URI parameters](/rest/api/power-bi/imports/post-import-in-group#uri-parameters). ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All ## Limitations - Dataflows with service principal aren't supported. - Importing a Power BI .pbix file from OneDrive isn't supported. - Importing a file that has a **protected** sensitivity label isn't supported for service principals. <br><br>
     *
     * @tags Imports
     * @name ImportsPostImportInGroup
     * @summary Creates new content in the specified workspace.
     * @request POST:/v1.0/myorg/groups/{groupId}/imports
     */
    importsPostImportInGroup: (
      groupId: string,
      query: {
        /** The display name of the dataset should include file extension. Not supported when importing from OneDrive for Business. For importing or creating dataflows, this parameter should be hardcoded to model.json. */
        datasetDisplayName: string;
        /** Specifies what to do if a dataset with the same name already exists. The default value is `Ignore`. For RDL files, `Abort` and `Overwrite` are the only supported options. For dataflow model.json files, `Abort` and `GenerateUniqueName` are the only supported options. */
        nameConflict?: "Ignore" | "Abort" | "Overwrite" | "CreateOrOverwrite" | "GenerateUniqueName";
        /** Whether to skip report import. If specified, the value must be `true`. Only supported for Power BI .pbix files. */
        skipReport?: boolean;
        /** Whether to override the existing label on a report when republishing a Power BI .pbix file. The service default value is `true`. */
        overrideReportLabel?: boolean;
        /** Determines whether to override the existing label on a model when republishing a Power BI .pbix file. The service default value is `true`. */
        overrideModelLabel?: boolean;
      },
      importInfo: ImportInfo,
      params: RequestParams = {},
    ) =>
      this.request<Import, any>({
        path: `/v1.0/myorg/groups/${groupId}/imports`,
        method: "POST",
        query: query,
        body: importInfo,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags Imports
     * @name ImportsGetImportInGroup
     * @summary Returns the specified import from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/imports/{importId}
     */
    importsGetImportInGroup: (groupId: string, importId: string, params: RequestParams = {}) =>
      this.request<Import, any>({
        path: `/v1.0/myorg/groups/${groupId}/imports/${importId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description To import large Power BI .pbix files: 1. Create a temporary upload location using this API call. 1. Upload the Power BI .pbix files using the *shared access signature* URL from the API call response. 1. Call [Post Import In Group](/rest/api/power-bi/imports/post-import-in-group), specifying the *shared access signature* URL in the `fileUrl` parameter of the [request body](/rest/api/power-bi/imports/post-import-in-group#request-body). ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All ## Limitations Importing large Power BI .pbix files between 1 GB and 10 GB in size is only available for Premium capacity workspaces. <br><br>
     *
     * @tags Imports
     * @name ImportsCreateTemporaryUploadLocationInGroup
     * @summary Creates a temporary blob storage upload location for importing large Power BI .pbix files that are between 1 GB and 10 GB in size.
     * @request POST:/v1.0/myorg/groups/{groupId}/imports/createTemporaryUploadLocation
     */
    importsCreateTemporaryUploadLocationInGroup: (groupId: string, params: RequestParams = {}) =>
      this.request<TemporaryUploadLocation, any>({
        path: `/v1.0/myorg/groups/${groupId}/imports/createTemporaryUploadLocation`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description Since paginated reports (RDL) don't have a dataset, the dataset ID value in the API response for paginated reports isn't displayed. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Report.ReadWrite.All or Report.Read.All <br><br>
     *
     * @tags Reports
     * @name ReportsGetReportsInGroup
     * @summary Returns a list of reports from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/reports
     */
    reportsGetReportsInGroup: (groupId: string, params: RequestParams = {}) =>
      this.request<Reports, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Report.ReadWrite.All or Report.Read.All <br><br>
     *
     * @tags Reports
     * @name ReportsGetReportInGroup
     * @summary Returns the specified report from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/reports/{reportId}
     */
    reportsGetReportInGroup: (groupId: string, reportId: string, params: RequestParams = {}) =>
      this.request<Report, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Report.ReadWrite.All <br><br>
     *
     * @tags Reports
     * @name ReportsDeleteReportInGroup
     * @summary Deletes the specified report from the specified workspace.
     * @request DELETE:/v1.0/myorg/groups/{groupId}/reports/{reportId}
     */
    reportsDeleteReportInGroup: (groupId: string, reportId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description - If the dataset for a cloned report resides in two different workspaces or in **My workspace**, then a shared dataset will be created in the report's workspace. - When cloned, reports with a [live connection](/power-bi/desktop-report-lifecycle-datasets) will lose that connection and instead have a direct binding to the target dataset. ## Permissions - The user must have all of the following, unless a requirement doesn't apply: - **Write** permission on the specified report. - **Build** permission on the target dataset, required if the `targetModelId` parameter is used. - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Content.Create <br><br>
     *
     * @tags Reports
     * @name ReportsCloneReportInGroup
     * @summary Clones the specified report from the specified workspace.
     * @request POST:/v1.0/myorg/groups/{groupId}/reports/{reportId}/Clone
     */
    reportsCloneReportInGroup: (
      groupId: string,
      reportId: string,
      requestParameters: CloneReportRequest,
      params: RequestParams = {},
    ) =>
      this.request<Report, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}/Clone`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description - For .pbix reports - You can set the `preferClientRouting` parameter to `true` as a [workaround](/power-bi/developer/embedded/embedded-troubleshoot#how-to-fix-timeout-exceptions-when-using-import-and-export-apis) for timeout issues. - Large files are downloaded to a temporary blob. Their URL is returned in the response and stored in the locally downloaded Power BI .pbix file. - For more information on requirements and limitations, see [Download a report from the Power BI service to Power BI Desktop](/power-bi/create-reports/service-export-to-pbix). ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Report.ReadWrite.All or both Report.Read.All and Dataset.Read.All ## Limitations For .pbix reports, exporting a report with a [Power BI service live connection](/power-bi/desktop-report-lifecycle-datasets) isn't supported after calling [Rebind Report](/rest/api/power-bi/reports/rebind-report). <br><br>
     *
     * @tags Reports
     * @name ReportsExportReportInGroup
     * @summary Exports the specified report from the specified workspace to a Power BI .pbix or .rdl file.
     * @request GET:/v1.0/myorg/groups/{groupId}/reports/{reportId}/Export
     */
    reportsExportReportInGroup: (groupId: string, reportId: string, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}/Export`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Specify the source report in the request body. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Report.ReadWrite.All <br><br>
     *
     * @tags Reports
     * @name ReportsUpdateReportContentInGroup
     * @summary Updates the content of the specified report from the specified workspace with the content of a specified source report.
     * @request POST:/v1.0/myorg/groups/{groupId}/reports/{reportId}/UpdateReportContent
     */
    reportsUpdateReportContentInGroup: (
      groupId: string,
      reportId: string,
      requestParameters: UpdateReportContentRequest,
      params: RequestParams = {},
    ) =>
      this.request<Report, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}/UpdateReportContent`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description - If the specified dataset resides in a different workspace than the report or in **My workspace**, then a shared dataset will be created in the report's workspace. - On rebind, reports with a [live connection](/power-bi/desktop-report-lifecycle-datasets) will lose that connection and instead have a direct binding to the target dataset. ## Permissions - The user must have all of the following: - **Write** permission on the specified report. - **Build** permission on the target dataset. - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Report.ReadWrite.All <br><br>
     *
     * @tags Reports
     * @name ReportsRebindReportInGroup
     * @summary Rebinds the specified report from the specified workspace to the specified dataset.
     * @request POST:/v1.0/myorg/groups/{groupId}/reports/{reportId}/Rebind
     */
    reportsRebindReportInGroup: (
      groupId: string,
      reportId: string,
      requestParameters: RebindReportRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}/Rebind`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Report.ReadWrite.All or Report.Read.All <br><br>
     *
     * @tags Reports
     * @name ReportsGetPagesInGroup
     * @summary Returns a list of pages within the specified report from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/reports/{reportId}/pages
     */
    reportsGetPagesInGroup: (groupId: string, reportId: string, params: RequestParams = {}) =>
      this.request<Pages, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}/pages`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Report.ReadWrite.All or Report.Read.All <br><br>
     *
     * @tags Reports
     * @name ReportsGetPageInGroup
     * @summary Returns the specified page within the specified report from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/reports/{reportId}/pages/{pageName}
     */
    reportsGetPageInGroup: (groupId: string, reportId: string, pageName: string, params: RequestParams = {}) =>
      this.request<Page, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}/pages/${pageName}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Report.ReadWrite.All or Report.Read.All <br><br>
     *
     * @tags Reports
     * @name ReportsGetDatasourcesInGroup
     * @summary Returns a list of data sources for the specified paginated report (RDL) from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/reports/{reportId}/datasources
     */
    reportsGetDatasourcesInGroup: (groupId: string, reportId: string, params: RequestParams = {}) =>
      this.request<Datasources, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}/datasources`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description > [!IMPORTANT] > Both the original data source and the new data source must have the exact same schema. ## Permissions - The user must be the data source owner. - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Reports.ReadWrite.All ## Limitations - Only supports paginated reports. - Changing the data source type isn't supported. <br><br>
     *
     * @tags Reports
     * @name ReportsUpdateDatasourcesInGroup
     * @summary Updates the data sources of the specified paginated report (RDL) from the specified workspace.
     * @request POST:/v1.0/myorg/groups/{groupId}/reports/{reportId}/Default.UpdateDatasources
     */
    reportsUpdateDatasourcesInGroup: (
      groupId: string,
      reportId: string,
      updateRdlDatasourcesRequest: UpdateRdlDatasourcesRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}/Default.UpdateDatasources`,
        method: "POST",
        body: updateRdlDatasourcesRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The API is asynchronous. When the API is called, it triggers an export job. After triggering an export job, use [GetExportToFileStatus API](/rest/api/power-bi/reports/get-export-to-file-status-in-group) to track the job status. Read more about the entire flow: [Export Power BI reports](/power-bi/developer/embedded/export-to) and [Export Paginated reports](/power-bi/developer/embedded/export-paginated-report) ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope All of the following: - Report.ReadWrite.All or Report.Read.All - Dataset.ReadWrite.All or Dataset.Read.All ## Limitations Check the limitations in [Export Power BI report to file](/power-bi/developer/embedded/export-to#considerations-and-limitations) and [Export paginated report to file](/power-bi/developer/embedded/export-paginated-report#considerations-and-limitations). <br><br>
     *
     * @tags Reports
     * @name ReportsExportToFileInGroup
     * @summary Exports the specified report from the specified workspace to the requested [file format](/rest/api/power-bi/reports/export-to-file-in-group#fileformat).
     * @request POST:/v1.0/myorg/groups/{groupId}/reports/{reportId}/ExportTo
     */
    reportsExportToFileInGroup: (
      groupId: string,
      reportId: string,
      requestParameters: ExportReportRequest,
      params: RequestParams = {},
    ) =>
      this.request<Export, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}/ExportTo`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description When the export job status is 'Succeeded' use the [GetFileOfExportToFile API](/rest/api/power-bi/reports/get-file-of-export-to-file-in-group) to retrieve the file. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Report.ReadWrite.All or Report.Read.All <br><br>
     *
     * @tags Reports
     * @name ReportsGetExportToFileStatusInGroup
     * @summary Returns the current status of the [Export to File In Group](/rest/api/power-bi/reports/export-to-file-in-group) job for the specified report from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/reports/{reportId}/exports/{exportId}
     */
    reportsGetExportToFileStatusInGroup: (
      groupId: string,
      reportId: string,
      exportId: string,
      params: RequestParams = {},
    ) =>
      this.request<Export, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}/exports/${exportId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Report.ReadWrite.All or Report.Read.All <br><br>
     *
     * @tags Reports
     * @name ReportsGetFileOfExportToFileInGroup
     * @summary Returns the file from the [Export to File In Group](/rest/api/power-bi/reports/export-to-file-in-group) job for the specified report from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/reports/{reportId}/exports/{exportId}/file
     */
    reportsGetFileOfExportToFileInGroup: (
      groupId: string,
      reportId: string,
      exportId: string,
      params: RequestParams = {},
    ) =>
      this.request<File, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}/exports/${exportId}/file`,
        method: "GET",
        format: "blob",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dashboard.ReadWrite.All or Dashboard.Read.All <br><br>
     *
     * @tags Dashboards
     * @name DashboardsGetDashboardsInGroup
     * @summary Returns a list of dashboards from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/dashboards
     */
    dashboardsGetDashboardsInGroup: (groupId: string, params: RequestParams = {}) =>
      this.request<Dashboards, any>({
        path: `/v1.0/myorg/groups/${groupId}/dashboards`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Content.Create <br><br>
     *
     * @tags Dashboards
     * @name DashboardsAddDashboardInGroup
     * @summary Creates a new empty dashboard in the specified workspace.
     * @request POST:/v1.0/myorg/groups/{groupId}/dashboards
     */
    dashboardsAddDashboardInGroup: (
      groupId: string,
      requestParameters: AddDashboardRequest,
      params: RequestParams = {},
    ) =>
      this.request<Dashboard, any>({
        path: `/v1.0/myorg/groups/${groupId}/dashboards`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dashboard.ReadWrite.All or Dashboard.Read.All <br><br>
     *
     * @tags Dashboards
     * @name DashboardsGetDashboardInGroup
     * @summary Returns the specified dashboard from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/dashboards/{dashboardId}
     */
    dashboardsGetDashboardInGroup: (groupId: string, dashboardId: string, params: RequestParams = {}) =>
      this.request<Dashboard, any>({
        path: `/v1.0/myorg/groups/${groupId}/dashboards/${dashboardId}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dashboard.ReadWrite.All <br><br>
     *
     * @tags Dashboards
     * @name DashboardsDeleteDashboardInGroup
     * @summary Deletes the specified dashboard from the specified workspace.
     * @request DELETE:/v1.0/myorg/groups/{groupId}/dashboards/{dashboardId}
     */
    dashboardsDeleteDashboardInGroup: (groupId: string, dashboardId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/dashboards/${dashboardId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Supported tiles include datasets and live tiles that contain an entire report page. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dashboard.ReadWrite.All or Dashboard.Read.All <br><br>
     *
     * @tags Dashboards
     * @name DashboardsGetTilesInGroup
     * @summary Returns a list of tiles within the specified dashboard from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/dashboards/{dashboardId}/tiles
     */
    dashboardsGetTilesInGroup: (groupId: string, dashboardId: string, params: RequestParams = {}) =>
      this.request<Tiles, any>({
        path: `/v1.0/myorg/groups/${groupId}/dashboards/${dashboardId}/tiles`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Supported tiles include datasets and live tiles that contain an entire report page. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dashboard.ReadWrite.All or Dashboard.Read.All <br><br>
     *
     * @tags Dashboards
     * @name DashboardsGetTileInGroup
     * @summary Returns the specified tile within the specified dashboard from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/dashboards/{dashboardId}/tiles/{tileId}
     */
    dashboardsGetTileInGroup: (groupId: string, dashboardId: string, tileId: string, params: RequestParams = {}) =>
      this.request<Tile, any>({
        path: `/v1.0/myorg/groups/${groupId}/dashboards/${dashboardId}/tiles/${tileId}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description When a tile is cloned to another workspace and bound to another report and dataset, it's cloned as is with its underlying query containing the original report filters. If the target report ID and target dataset are missing, the following can occur: - If you're cloning a tile within the same workspace, the report and dataset links will be cloned from the source tile. - If you're cloning a tile within a different workspace, report and dataset links will be removed, and the tile will be broken. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dashboard.ReadWrite.All <br><br>
     *
     * @tags Dashboards
     * @name DashboardsCloneTileInGroup
     * @summary Clones the specified tile from the specified workspace.
     * @request POST:/v1.0/myorg/groups/{groupId}/dashboards/{dashboardId}/tiles/{tileId}/Clone
     */
    dashboardsCloneTileInGroup: (
      groupId: string,
      dashboardId: string,
      tileId: string,
      requestParameters: CloneTileRequest,
      params: RequestParams = {},
    ) =>
      this.request<Tile, any>({
        path: `/v1.0/myorg/groups/${groupId}/dashboards/${dashboardId}/tiles/${tileId}/Clone`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description > [!TIP] > To create embed tokens, it's recommended to use the latest API, [Generate Token](/rest/api/power-bi/embed-token/generate-token). Generate token supports additional functions, such as creating a token for multiple items. > [!IMPORTANT] > This API call is only relevant to the [embed for your customers](/power-bi/developer/embed-sample-for-customers) scenario. To learn more about using this API, see [Considerations when generating an embed token](/power-bi/developer/embedded/generate-embed-token). ## Permissions - When using a service principal for authentication, refer to [Embed Power BI content with service principal](/power-bi/developer/embed-service-principal) and [Considerations and limitations](/power-bi/developer/embedded/embed-service-principal#considerations-and-limitations). - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope All of the following: - Content.Create - Report.ReadWrite.All or Report.Read.All - Dataset.ReadWrite.All or Dataset.Read.All ## Limitations For Azure Analysis Services or Analysis Services on-premises live connection reports, generating an embed token with row-level security may not work for several minutes after a [Rebind Report](/rest/api/power-bi/reports/rebind-report) api call. <br><br>
     *
     * @tags EmbedToken
     * @name ReportsGenerateTokenForCreateInGroup
     * @summary Generates an embed token to allow report creation in the specified workspace based on the specified dataset.
     * @request POST:/v1.0/myorg/groups/{groupId}/reports/GenerateToken
     */
    reportsGenerateTokenForCreateInGroup: (
      groupId: string,
      requestParameters: GenerateTokenRequest,
      params: RequestParams = {},
    ) =>
      this.request<EmbedToken, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/GenerateToken`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description > [!TIP] > To create embed tokens, it's recommended to use the latest API, [Generate Token](/rest/api/power-bi/embed-token/generate-token). Generate token supports additional functions, such as creating a token for multiple items. > [!IMPORTANT] > This API call is only relevant to the [embed for your customers](/power-bi/developer/embed-sample-for-customers) scenario. To learn more about using this API, see [Considerations when generating an embed token](/power-bi/developer/embedded/generate-embed-token). ## Permissions - When using a service principal for authentication, refer to [Embed Power BI content with service principal](/power-bi/developer/embed-service-principal) and [Considerations and limitations](/power-bi/developer/embedded/embed-service-principal#considerations-and-limitations). - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope All of the following, unless a requirement doesn't apply: - Report.ReadWrite.All or Report.Read.All - Dataset.ReadWrite.All or Dataset.Read.All - Content.Create, required if the `allowSaveAs` flag is specified in [GenerateTokenRequest](/rest/api/power-bi/embed-token/reports-generate-token-for-create-in-group#generatetokenrequest) ## Limitations For Azure Analysis Services or Analysis Services on-premises live connection reports, generating an embed token with row-level security may not work for several minutes after a [Rebind Report](/rest/api/power-bi/reports/rebind-report). <br><br>
     *
     * @tags EmbedToken
     * @name ReportsGenerateTokenInGroup
     * @summary Generates an embed token to view or edit the specified report from the specified workspace.
     * @request POST:/v1.0/myorg/groups/{groupId}/reports/{reportId}/GenerateToken
     */
    reportsGenerateTokenInGroup: (
      groupId: string,
      reportId: string,
      requestParameters: GenerateTokenRequest,
      params: RequestParams = {},
    ) =>
      this.request<EmbedToken, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description > [!TIP] > To create embed tokens, it's recommended to use the latest API, [Generate Token](/rest/api/power-bi/embed-token/generate-token). Generate token supports additional functions, such as creating a token for multiple items. > [!NOTE] > An embed token can be used to [embed Q&A](/power-bi/developer/qanda) within your application. > [!IMPORTANT] > This API call is only relevant to the [embed for your customers](/power-bi/developer/embed-sample-for-customers) scenario. To learn more about using this API, see [Considerations when generating an embed token](/power-bi/developer/embedded/generate-embed-token). ## Permissions - When using a service principal for authentication, refer to [Embed Power BI content with service principal](/power-bi/developer/embed-service-principal) and [Considerations and limitations](/power-bi/developer/embedded/embed-service-principal#considerations-and-limitations). - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags EmbedToken
     * @name DatasetsGenerateTokenInGroup
     * @summary Generates an embed token based on the specified dataset from the specified workspace.
     * @request POST:/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/GenerateToken
     */
    datasetsGenerateTokenInGroup: (
      groupId: string,
      datasetId: string,
      requestParameters: GenerateTokenRequest,
      params: RequestParams = {},
    ) =>
      this.request<EmbedToken, any>({
        path: `/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/GenerateToken`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description > [!IMPORTANT] > This API call is only relevant to the [embed for your customers](/power-bi/developer/embed-sample-for-customers) scenario. To learn more about using this API, see [Considerations when generating an embed token](/power-bi/developer/embedded/generate-embed-token). ## Permissions - When using a service principal for authentication, refer to [Embed Power BI content with service principal](/power-bi/developer/embed-service-principal) and [Considerations and limitations](/power-bi/developer/embedded/embed-service-principal#considerations-and-limitations). - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope All of the following: - Dashboard.ReadWrite.All or Dashboard.Read.All - Report.ReadWrite.All or Report.Read.All - Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags EmbedToken
     * @name DashboardsGenerateTokenInGroup
     * @summary Generates an embed token to view the specified dashboard from the specified workspace.
     * @request POST:/v1.0/myorg/groups/{groupId}/dashboards/{dashboardId}/GenerateToken
     */
    dashboardsGenerateTokenInGroup: (
      groupId: string,
      dashboardId: string,
      requestParameters: GenerateTokenRequest,
      params: RequestParams = {},
    ) =>
      this.request<EmbedToken, any>({
        path: `/v1.0/myorg/groups/${groupId}/dashboards/${dashboardId}/GenerateToken`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description > [!IMPORTANT] > This API call is only relevant to the [embed for your customers](/power-bi/developer/embed-sample-for-customers) scenario. To learn more about using this API, see [Considerations when generating an embed token](/power-bi/developer/embedded/generate-embed-token). ## Permissions - When using a service principal for authentication, refer to [Embed Power BI content with service principal](/power-bi/developer/embed-service-principal) and [Considerations and limitations](/power-bi/developer/embedded/embed-service-principal#considerations-and-limitations). - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope All of the following: - Dashboard.ReadWrite.All or Dashboard.Read.All - Report.ReadWrite.All or Report.Read.All - Dataset.ReadWrite.All or Dataset.Read.All <br><br>
     *
     * @tags EmbedToken
     * @name TilesGenerateTokenInGroup
     * @summary Generates an embed token to view the specified tile from the specified workspace.
     * @request POST:/v1.0/myorg/groups/{groupId}/dashboards/{dashboardId}/tiles/{tileId}/GenerateToken
     */
    tilesGenerateTokenInGroup: (
      groupId: string,
      dashboardId: string,
      tileId: string,
      requestParameters: GenerateTokenRequest,
      params: RequestParams = {},
    ) =>
      this.request<EmbedToken, any>({
        path: `/v1.0/myorg/groups/${groupId}/dashboards/${dashboardId}/tiles/${tileId}/GenerateToken`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope App.Read.All ## Limitations Service principal authentication isn't supported. <br><br>
     *
     * @tags Apps
     * @name AppsGetApps
     * @summary Returns a list of installed apps.
     * @request GET:/v1.0/myorg/apps
     */
    appsGetApps: (params: RequestParams = {}) =>
      this.request<Apps, any>({
        path: `/v1.0/myorg/apps`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope App.Read.All ## Limitations Service principal authentication isn't supported. <br><br>
     *
     * @tags Apps
     * @name AppsGetApp
     * @summary Returns the specified installed app.
     * @request GET:/v1.0/myorg/apps/{appId}
     */
    appsGetApp: (appId: string, params: RequestParams = {}) =>
      this.request<App, any>({
        path: `/v1.0/myorg/apps/${appId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Report.ReadWrite.All or Report.Read.All ## Limitations Service principal authentication isn't supported. <br><br>
     *
     * @tags Apps
     * @name AppsGetReports
     * @summary Returns a list of reports from the specified app.
     * @request GET:/v1.0/myorg/apps/{appId}/reports
     */
    appsGetReports: (appId: string, params: RequestParams = {}) =>
      this.request<Reports, any>({
        path: `/v1.0/myorg/apps/${appId}/reports`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Report.ReadWrite.All or Report.Read.All ## Limitations Service principal authentication isn't supported. <br><br>
     *
     * @tags Apps
     * @name AppsGetReport
     * @summary Returns the specified report from the specified app.
     * @request GET:/v1.0/myorg/apps/{appId}/reports/{reportId}
     */
    appsGetReport: (appId: string, reportId: string, params: RequestParams = {}) =>
      this.request<Report, any>({
        path: `/v1.0/myorg/apps/${appId}/reports/${reportId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dashboard.ReadWrite.All or Dashboard.Read.All ## Limitations Service principal authentication isn't supported. <br><br>
     *
     * @tags Apps
     * @name AppsGetDashboards
     * @summary Returns a list of dashboards from the specified app.
     * @request GET:/v1.0/myorg/apps/{appId}/dashboards
     */
    appsGetDashboards: (appId: string, params: RequestParams = {}) =>
      this.request<Dashboards, any>({
        path: `/v1.0/myorg/apps/${appId}/dashboards`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dashboard.ReadWrite.All or Dashboard.Read.All ## Limitations Service principal authentication isn't supported. <br><br>
     *
     * @tags Apps
     * @name AppsGetDashboard
     * @summary Returns the specified dashboard from the specified app.
     * @request GET:/v1.0/myorg/apps/{appId}/dashboards/{dashboardId}
     */
    appsGetDashboard: (appId: string, dashboardId: string, params: RequestParams = {}) =>
      this.request<Dashboard, any>({
        path: `/v1.0/myorg/apps/${appId}/dashboards/${dashboardId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dashboard.ReadWrite.All or Dashboard.Read.All ## Limitations Service principal authentication isn't supported. <br><br>
     *
     * @tags Apps
     * @name AppsGetTiles
     * @summary Returns a list of tiles within the specified dashboard from the specified app.
     * @request GET:/v1.0/myorg/apps/{appId}/dashboards/{dashboardId}/tiles
     */
    appsGetTiles: (appId: string, dashboardId: string, params: RequestParams = {}) =>
      this.request<Tiles, any>({
        path: `/v1.0/myorg/apps/${appId}/dashboards/${dashboardId}/tiles`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Supported tiles include datasets and live tiles that contain an entire report page. ## Required Scope Dashboard.ReadWrite.All or Dashboard.Read.All ## Limitations Service principal authentication isn't supported. <br><br>
     *
     * @tags Apps
     * @name AppsGetTile
     * @summary Returns the specified tile within the specified dashboard from the specified app.
     * @request GET:/v1.0/myorg/apps/{appId}/dashboards/{dashboardId}/tiles/{tileId}
     */
    appsGetTile: (appId: string, dashboardId: string, tileId: string, params: RequestParams = {}) =>
      this.request<Tile, any>({
        path: `/v1.0/myorg/apps/${appId}/dashboards/${dashboardId}/tiles/${tileId}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataflow.ReadWrite.All or Dataflow.Read.All <br><br>
     *
     * @tags Dataflows
     * @name DataflowsGetDataflow
     * @summary Exports the specified dataflow definition to a JSON file.
     * @request GET:/v1.0/myorg/groups/{groupId}/dataflows/{dataflowId}
     */
    dataflowsGetDataflow: (groupId: string, dataflowId: string, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/v1.0/myorg/groups/${groupId}/dataflows/${dataflowId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataflow.ReadWrite.All <br><br>
     *
     * @tags Dataflows
     * @name DataflowsDeleteDataflow
     * @summary Deletes a dataflow from Power BI data prep storage, including its definition file and model.
     * @request DELETE:/v1.0/myorg/groups/{groupId}/dataflows/{dataflowId}
     */
    dataflowsDeleteDataflow: (groupId: string, dataflowId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/dataflows/${dataflowId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataflow.ReadWrite.All <br><br>
     *
     * @tags Dataflows
     * @name DataflowsUpdateDataflow
     * @summary Updates dataflow properties, capabilities and settings.
     * @request PATCH:/v1.0/myorg/groups/{groupId}/dataflows/{dataflowId}
     */
    dataflowsUpdateDataflow: (
      groupId: string,
      dataflowId: string,
      dataflowUpdateRequest: DataflowUpdateRequestMessage,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/dataflows/${dataflowId}`,
        method: "PATCH",
        body: dataflowUpdateRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Supported email notification options are **MailOnFailure** and **NoNotification**. **MailOnCompletion** isn't supported. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataflow.ReadWrite.All <br><br>
     *
     * @tags Dataflows
     * @name DataflowsRefreshDataflow
     * @summary Triggers a refresh for the specified dataflow.
     * @request POST:/v1.0/myorg/groups/{groupId}/dataflows/{dataflowId}/refreshes
     */
    dataflowsRefreshDataflow: (
      groupId: string,
      dataflowId: string,
      refreshRequest: RefreshRequest,
      query?: {
        /**
         * Type of refresh process to use.
         * @format uuid
         */
        processType?: "default" | "processFull";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/dataflows/${dataflowId}/refreshes`,
        method: "POST",
        query: query,
        body: refreshRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataflow.ReadWrite.All or Dataflow.Read.All <br><br>
     *
     * @tags Dataflows
     * @name DataflowsGetDataflowDataSources
     * @summary Returns a list of data sources for the specified dataflow.
     * @request GET:/v1.0/myorg/groups/{groupId}/dataflows/{dataflowId}/datasources
     */
    dataflowsGetDataflowDataSources: (groupId: string, dataflowId: string, params: RequestParams = {}) =>
      this.request<Datasources, any>({
        path: `/v1.0/myorg/groups/${groupId}/dataflows/${dataflowId}/datasources`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataflow.ReadWrite.All or Dataflow.Read.All <br><br>
     *
     * @tags Dataflows
     * @name DataflowsGetDataflows
     * @summary Returns a list of all dataflows from the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/dataflows
     */
    dataflowsGetDataflows: (groupId: string, params: RequestParams = {}) =>
      this.request<Dataflows, any>({
        path: `/v1.0/myorg/groups/${groupId}/dataflows`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataflow.ReadWrite.All or Dataflow.Read.All <br><br>
     *
     * @tags Dataflows
     * @name DataflowsGetUpstreamDataflowsInGroup
     * @summary Returns a list of upstream dataflows for the specified dataflow.
     * @request GET:/v1.0/myorg/groups/{groupId}/dataflows/{dataflowId}/upstreamDataflows
     */
    dataflowsGetUpstreamDataflowsInGroup: (groupId: string, dataflowId: string, params: RequestParams = {}) =>
      this.request<DependentDataflows, any>({
        path: `/v1.0/myorg/groups/${groupId}/dataflows/${dataflowId}/upstreamDataflows`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataflow.ReadWrite.All <br><br>
     *
     * @tags Dataflows
     * @name DataflowsUpdateRefreshSchedule
     * @summary Creates or updates the refresh schedule for a specified dataflow.
     * @request PATCH:/v1.0/myorg/groups/{groupId}/dataflows/{dataflowId}/refreshSchedule
     */
    dataflowsUpdateRefreshSchedule: (
      groupId: string,
      dataflowId: string,
      refreshScheduleRequest: RefreshScheduleRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/dataflows/${dataflowId}/refreshSchedule`,
        method: "PATCH",
        body: refreshScheduleRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataflow.ReadWrite.All or Dataflow.Read.All <br><br>
     *
     * @tags Dataflows
     * @name DataflowsGetDataflowTransactions
     * @summary Returns a list of transactions for the specified dataflow.
     * @request GET:/v1.0/myorg/groups/{groupId}/dataflows/{dataflowId}/transactions
     */
    dataflowsGetDataflowTransactions: (groupId: string, dataflowId: string, params: RequestParams = {}) =>
      this.request<DataflowTransactions, any>({
        path: `/v1.0/myorg/groups/${groupId}/dataflows/${dataflowId}/transactions`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataflow.ReadWrite.All <br><br>
     *
     * @tags Dataflows
     * @name DataflowsCancelDataflowTransaction
     * @summary Attempts to cancel the specified transactions.
     * @request POST:/v1.0/myorg/groups/{groupId}/dataflows/transactions/{transactionId}/cancel
     */
    dataflowsCancelDataflowTransaction: (groupId: string, transactionId: string, params: RequestParams = {}) =>
      this.request<DataflowTransactionStatus, any>({
        path: `/v1.0/myorg/groups/${groupId}/dataflows/transactions/${transactionId}/cancel`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have gateway admin permissions. ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All ## Limitations Virtual network (VNet) gateways aren't supported. <br><br>
     *
     * @tags Gateways
     * @name GatewaysGetGateways
     * @summary Returns a list of gateways for which the user is an admin.
     * @request GET:/v1.0/myorg/gateways
     */
    gatewaysGetGateways: (params: RequestParams = {}) =>
      this.request<Gateways, any>({
        path: `/v1.0/myorg/gateways`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have gateway admin permissions. ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All ## Limitations Virtual network (VNet) gateways aren't supported. <br><br>
     *
     * @tags Gateways
     * @name GatewaysGetGateway
     * @summary Returns the specified gateway.
     * @request GET:/v1.0/myorg/gateways/{gatewayId}
     */
    gatewaysGetGateway: (gatewayId: string, params: RequestParams = {}) =>
      this.request<Gateway, any>({
        path: `/v1.0/myorg/gateways/${gatewayId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have gateway admin permissions. ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All ## Limitations Virtual network (VNet) gateways aren't supported. <br><br>
     *
     * @tags Gateways
     * @name GatewaysGetDatasources
     * @summary Returns a list of data sources from the specified gateway.
     * @request GET:/v1.0/myorg/gateways/{gatewayId}/datasources
     */
    gatewaysGetDatasources: (gatewayId: string, params: RequestParams = {}) =>
      this.request<GatewayDatasources, any>({
        path: `/v1.0/myorg/gateways/${gatewayId}/datasources`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description <br>On premises data source credentials must be encrypted. The `encryptedConnection` parameter must be set to `Encrypted` and the credentials should be encrypted using the gateway public key. See the [CreateGatewayDataSource](https://github.com/microsoft/PowerBI-Developer-Samples/blob/master/PowerShell%20Scripts/CreateGatewayDataSource) PowerShell script for an example of using this API. > [!NOTE] > To encrypt credentials, see [Configure credentials programmatically](/power-bi/developer/embedded/configure-credentials) for Power BI and review the EncryptCredentials [.NET Core](https://github.com/microsoft/PowerBI-Developer-Samples/tree/master/.NET%20Core/EncryptCredentials), [Java](https://github.com/microsoft/PowerBI-Developer-Samples/tree/master/Java/EncryptCredentials) and [Python](https://github.com/microsoft/PowerBI-Developer-Samples/tree/master/Python/Encrypt%20credentials) examples. ## Permissions Supports only on-premises gateways and the user must have gateway admin permissions ## Required Scope Dataset.ReadWrite.All ## Limitations - Virtual network (VNet) and Cloud gateways aren't supported. - OAuth2 as a credential type isn't supported. <br><br>
     *
     * @tags Gateways
     * @name GatewaysCreateDatasource
     * @summary Creates a new data source on the specified on-premises gateway.
     * @request POST:/v1.0/myorg/gateways/{gatewayId}/datasources
     */
    gatewaysCreateDatasource: (
      gatewayId: string,
      datasourceToGatewayRequest: PublishDatasourceToGatewayRequest,
      params: RequestParams = {},
    ) =>
      this.request<GatewayDatasource, any>({
        path: `/v1.0/myorg/gateways/${gatewayId}/datasources`,
        method: "POST",
        body: datasourceToGatewayRequest,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have gateway admin permissions. ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All ## Limitations Virtual network (VNet) gateways aren't supported. <br><br>
     *
     * @tags Gateways
     * @name GatewaysGetDatasource
     * @summary Returns the specified data source from the specified gateway.
     * @request GET:/v1.0/myorg/gateways/{gatewayId}/datasources/{datasourceId}
     */
    gatewaysGetDatasource: (gatewayId: string, datasourceId: string, params: RequestParams = {}) =>
      this.request<GatewayDatasource, any>({
        path: `/v1.0/myorg/gateways/${gatewayId}/datasources/${datasourceId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have gateway admin permissions. ## Required Scope Dataset.ReadWrite.All ## Limitations Virtual network (VNet) gateways aren't supported. <br><br>
     *
     * @tags Gateways
     * @name GatewaysDeleteDatasource
     * @summary Deletes the specified data source from the specified gateway.
     * @request DELETE:/v1.0/myorg/gateways/{gatewayId}/datasources/{datasourceId}
     */
    gatewaysDeleteDatasource: (gatewayId: string, datasourceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/gateways/${gatewayId}/datasources/${datasourceId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description On Premises data source credentials must be encrypted, as described in the [On-premise encrypted credentials example](/rest/api/power-bi/gateways/update-datasource#on-premise-encrypted-credentials-example). > [!NOTE] > - To encrypt credentials, see [Configure credentials programmatically](/power-bi/developer/embedded/configure-credentials) for Power BI and review the EncryptCredentials [.NET Core](https://github.com/microsoft/PowerBI-Developer-Samples/tree/master/.NET%20Core/EncryptCredentials), [Java](https://github.com/microsoft/PowerBI-Developer-Samples/tree/master/Java/EncryptCredentials) and [Python](https://github.com/microsoft/PowerBI-Developer-Samples/tree/master/Python/Encrypt%20credentials) examples. > - Windows credentials before encryption look like the credentials in the credentials of [Basic credentials example](/rest/api/power-bi/gateways/update-datasource#basic-credentials-example). When changing from single sign-on to other credential types, such as `Basic` or `OAuth2`, set the parameter `useEndUserOAuth2Credentials` to `false` as described in the [Basic credentials example](/rest/api/power-bi/gateways/update-datasource#basic-credentials-example). OAuth 2.0 credentials are valid as long as the provided token is valid. When using the OAuth 2.0 credential type, do the following: - Set the OAuth 2.0 token audience correctly, according to the data source type. - Send the OAuth 2.0 token in the payload as shown in the [OAuth 2.0 credentials example](/rest/api/power-bi/gateways/update-datasource#oauth-2.0-credentials-example). - If you're using **Extension** data sources, don't set `useCallerAADIdentity` to `true`. ## Permissions - With on-premises gateways, the user must have gateway admin permissions. - With cloud data sources, user must be the data source owner. Use [Datasets - Take Over API](/rest/api/power-bi/datasets/take-over-in-group) to transfer ownership over the specified dataset or [Paginated reports - Take Over API](/rest/api/power-bi/reports/take-over-in-group) to transfer ownership of the data sources over the specified paginated report. - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Dataset.ReadWrite.All ## Limitations Virtual network (VNet) gateways aren't supported. SAS Token credentials are supported only with AzureBlobStorage and AzureDataLakeStorage. <br><br>
     *
     * @tags Gateways
     * @name GatewaysUpdateDatasource
     * @summary Updates the credentials of the specified data source from the specified gateway.
     * @request PATCH:/v1.0/myorg/gateways/{gatewayId}/datasources/{datasourceId}
     */
    gatewaysUpdateDatasource: (
      gatewayId: string,
      datasourceId: string,
      updateDatasourceRequest: UpdateDatasourceRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/gateways/${gatewayId}/datasources/${datasourceId}`,
        method: "PATCH",
        body: updateDatasourceRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions The user must have gateway admin permissions. ## Required Scope Dataset.ReadWrite.All ## Limitations Virtual network (VNet) gateways aren't supported. <br><br>
     *
     * @tags Gateways
     * @name GatewaysGetDatasourceStatus
     * @summary Checks the connectivity status of the specified data source from the specified gateway.
     * @request GET:/v1.0/myorg/gateways/{gatewayId}/datasources/{datasourceId}/status
     */
    gatewaysGetDatasourceStatus: (gatewayId: string, datasourceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/gateways/${gatewayId}/datasources/${datasourceId}/status`,
        method: "GET",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have gateway admin permissions. ## Required Scope Dataset.ReadWrite.All or Dataset.Read.All ## Limitations Virtual network (VNet) gateways aren't supported. <br><br>
     *
     * @tags Gateways
     * @name GatewaysGetDatasourceUsers
     * @summary Returns a list of users who have access to the specified data source.
     * @request GET:/v1.0/myorg/gateways/{gatewayId}/datasources/{datasourceId}/users
     */
    gatewaysGetDatasourceUsers: (gatewayId: string, datasourceId: string, params: RequestParams = {}) =>
      this.request<DatasourceUsers, any>({
        path: `/v1.0/myorg/gateways/${gatewayId}/datasources/${datasourceId}/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have gateway admin permissions. ## Required Scope Dataset.ReadWrite.All ## Limitations Virtual network (VNet) gateways aren't supported. <br><br>
     *
     * @tags Gateways
     * @name GatewaysAddDatasourceUser
     * @summary Grants or updates the permissions required to use the specified data source for the specified user.
     * @request POST:/v1.0/myorg/gateways/{gatewayId}/datasources/{datasourceId}/users
     */
    gatewaysAddDatasourceUser: (
      gatewayId: string,
      datasourceId: string,
      addUserToDatasourceRequest: DatasourceUser,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/gateways/${gatewayId}/datasources/${datasourceId}/users`,
        method: "POST",
        body: addUserToDatasourceRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions The user must have gateway admin permissions. ## Required Scope Dataset.ReadWrite.All ## Limitations Virtual network (VNet) gateways aren't supported. <br><br>
     *
     * @tags Gateways
     * @name GatewaysDeleteDatasourceUser
     * @summary Removes the specified user from the specified data source.
     * @request DELETE:/v1.0/myorg/gateways/{gatewayId}/datasources/{datasourceId}/users/{emailAdress}
     */
    gatewaysDeleteDatasourceUser: (
      gatewayId: string,
      datasourceId: string,
      emailAdress: string,
      query?: {
        /**
         * The service principal profile ID to delete
         * @format uuid
         */
        profileId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/gateways/${gatewayId}/datasources/${datasourceId}/users/${emailAdress}`,
        method: "DELETE",
        query: query,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description When user permissions to a workspace have been recently updated, the new permissions might not be immediately available through API calls. To refresh user permissions, use the [Refresh User Permissions](/rest/api/power-bi/users/refresh-user-permissions) API call. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Workspace.Read.All or Workspace.ReadWrite.All <br><br>
     *
     * @tags Groups
     * @name GroupsGetGroups
     * @summary Returns a list of workspaces the user has access to.
     * @request GET:/v1.0/myorg/groups
     */
    groupsGetGroups: (
      query?: {
        /** Filters the results, based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results
         * @format int32
         */
        $top?: number;
        /**
         * Skips the first n results
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Groups, any>({
        path: `/v1.0/myorg/groups`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Workspace.ReadWrite.All <br><br>
     *
     * @tags Groups
     * @name GroupsCreateGroup
     * @summary Creates a new workspace.
     * @request POST:/v1.0/myorg/groups
     */
    groupsCreateGroup: (
      requestParameters: GroupCreationRequest,
      query?: {
        /** (Preview feature) Whether to create a workspace. The only supported value is `true`. */
        workspaceV2?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Group, any>({
        path: `/v1.0/myorg/groups`,
        method: "POST",
        query: query,
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Workspace.ReadWrite.All <br><br>
     *
     * @tags Groups
     * @name GroupsDeleteGroup
     * @summary Deletes the specified workspace.
     * @request DELETE:/v1.0/myorg/groups/{groupId}
     */
    groupsDeleteGroup: (groupId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description When user permissions to a workspace have been recently updated, the new permissions might not be immediately available through API calls. As a result, this API call might return an HTTP 401 error when a user has permissions to a workspace. To refresh user permissions, use the [Refresh User Permissions](/rest/api/power-bi/users/refresh-user-permissions) API call. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Workspace.Read.All or Workspace.ReadWrite.All <br><br>
     *
     * @tags Groups
     * @name GroupsGetGroupUsers
     * @summary Returns a list of users that have access to the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/users
     */
    groupsGetGroupUsers: (
      groupId: string,
      query?: {
        /**
         * Returns only the first n results
         * @format int32
         */
        $top?: number;
        /**
         * Skips the first n results
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GroupUsers, any>({
        path: `/v1.0/myorg/groups/${groupId}/users`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description When user permissions to a workspace have been recently updated, the new permissions might not be immediately available through API calls. To refresh user permissions, use the [Refresh User Permissions](/rest/api/power-bi/users/refresh-user-permissions) API call. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Workspace.ReadWrite.All <br><br>
     *
     * @tags Groups
     * @name GroupsAddGroupUser
     * @summary Grants the specified user the specified permissions to the specified workspace.
     * @request POST:/v1.0/myorg/groups/{groupId}/users
     */
    groupsAddGroupUser: (groupId: string, userDetails: GroupUser, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/users`,
        method: "POST",
        body: userDetails,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description When user permissions to a workspace have been recently updated, the new permissions might not be immediately available through API calls. To refresh user permissions, use the [Refresh User Permissions](/rest/api/power-bi/users/refresh-user-permissions) API call. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Workspace.ReadWrite.All <br><br>
     *
     * @tags Groups
     * @name GroupsUpdateGroupUser
     * @summary Updates the specified user permissions to the specified workspace.
     * @request PUT:/v1.0/myorg/groups/{groupId}/users
     */
    groupsUpdateGroupUser: (groupId: string, userDetails: GroupUser, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/users`,
        method: "PUT",
        body: userDetails,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Workspace.ReadWrite.All <br><br>
     *
     * @tags Groups
     * @name GroupsDeleteUserInGroup
     * @summary Deletes the specified user permissions from the specified workspace.
     * @request DELETE:/v1.0/myorg/groups/{groupId}/users/{user}
     */
    groupsDeleteUserInGroup: (
      groupId: string,
      user: string,
      query?: {
        /**
         * The service principal profile ID to delete
         * @format uuid
         */
        profileId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/users/${user}`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). The profile creator must have capacity permissions. ## Required Scope Capacity.Read.All or Capacity.ReadWrite.All <br><br>
     *
     * @tags Capacities
     * @name CapacitiesGetCapacities
     * @summary Returns a list of capacities that the user has access to.
     * @request GET:/v1.0/myorg/capacities
     */
    capacitiesGetCapacities: (params: RequestParams = {}) =>
      this.request<Capacities, any>({
        path: `/v1.0/myorg/capacities`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Workload APIs aren't relevant for [Gen2](/power-bi/developer/embedded/power-bi-embedded-generation-2) capacities. ## Required Scope Capacity.Read.All or Capacity.ReadWrite.All <br><br>
     *
     * @tags Capacities
     * @name CapacitiesGetWorkloads
     * @summary Returns the current state of the specified capacity workloads. If a workload is enabled, the percentage of maximum memory that the workload can consume is also returned.
     * @request GET:/v1.0/myorg/capacities/{capacityId}/Workloads
     */
    capacitiesGetWorkloads: (capacityId: string, params: RequestParams = {}) =>
      this.request<Workloads, any>({
        path: `/v1.0/myorg/capacities/${capacityId}/Workloads`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Workload APIs aren't relevant for [Gen2](/power-bi/developer/embedded/power-bi-embedded-generation-2) capacities. ## Required Scope Capacity.Read.All or Capacity.ReadWrite.All <br><br>
     *
     * @tags Capacities
     * @name CapacitiesGetWorkload
     * @summary Returns the current state of a workload. If the workload is enabled, the percentage of maximum memory that the workload can consume is also returned.
     * @request GET:/v1.0/myorg/capacities/{capacityId}/Workloads/{workloadName}
     */
    capacitiesGetWorkload: (capacityId: string, workloadName: string, params: RequestParams = {}) =>
      this.request<Workload, any>({
        path: `/v1.0/myorg/capacities/${capacityId}/Workloads/${workloadName}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Workload APIs aren't relevant for [Gen2](/power-bi/developer/embedded/power-bi-embedded-generation-2) capacities. ## Required Scope Capacity.ReadWrite.All <br><br>
     *
     * @tags Capacities
     * @name CapacitiesPatchWorkload
     * @summary Changes the state of a specific workload to *Enabled* or *Disabled*. When enabling a workload, specify the percentage of maximum memory that the workload can consume.
     * @request PATCH:/v1.0/myorg/capacities/{capacityId}/Workloads/{workloadName}
     */
    capacitiesPatchWorkload: (
      capacityId: string,
      workloadName: string,
      workload: PatchWorkloadRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/capacities/${capacityId}/Workloads/${workloadName}`,
        method: "PATCH",
        body: workload,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Power BI retains a seven-day refresh history for each dataset, up to a maximum of sixty refreshes. ## Required Scope Capacity.Read.All or Capacity.ReadWrite.All <br><br>
     *
     * @tags Capacities
     * @name CapacitiesGetRefreshables
     * @summary Returns a list of refreshables for all capacities that the user has access to.
     * @request GET:/v1.0/myorg/capacities/refreshables
     */
    capacitiesGetRefreshables: (
      query: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `capacities` and `groups`. */
        $expand?: string;
        /** Filters the results based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results.
         * @format int32
         * @min 1
         */
        $top: number;
        /**
         * Skips the first n results. Use with top to fetch results beyond the first 1000.
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Refreshables, any>({
        path: `/v1.0/myorg/capacities/refreshables`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Power BI retains a seven-day refresh history for each dataset, up to a maximum of sixty refreshes. ## Required Scope Capacity.Read.All or Capacity.ReadWrite.All <br><br>
     *
     * @tags Capacities
     * @name CapacitiesGetRefreshablesForCapacity
     * @summary Returns a list of refreshables for the specified capacity that the user has access to.
     * @request GET:/v1.0/myorg/capacities/{capacityId}/refreshables
     */
    capacitiesGetRefreshablesForCapacity: (
      capacityId: string,
      query: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `capacities` and `groups`. */
        $expand?: string;
        /** Filters the results based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results.
         * @format int32
         * @min 1
         */
        $top: number;
        /**
         * Skips the first n results. Use with top to fetch results beyond the first 1000.
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Refreshables, any>({
        path: `/v1.0/myorg/capacities/${capacityId}/refreshables`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Power BI retains a seven-day refresh history for each dataset, up to a maximum of sixty refreshes. ## Required Scope Capacity.Read.All or Capacity.ReadWrite.All <br><br>
     *
     * @tags Capacities
     * @name CapacitiesGetRefreshableForCapacity
     * @summary Returns the specified refreshable for the specified capacity that the user has access to.
     * @request GET:/v1.0/myorg/capacities/{capacityId}/refreshables/{refreshableId}
     */
    capacitiesGetRefreshableForCapacity: (
      capacityId: string,
      refreshableId: string,
      query?: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `capacities` and `groups`. */
        $expand?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Refreshables, any>({
        path: `/v1.0/myorg/capacities/${capacityId}/refreshables/${refreshableId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description To unassign **My workspace** from a capacity, provide an empty GUID (`00000000-0000-0000-0000-000000000000`) as the `capacityId`. ## Permissions The user must have administrator rights or Assign permission on the capacity. ## Required Scope Capacity.ReadWrite.All and Workspace.ReadWrite.All <br><br>
     *
     * @tags Capacities
     * @name GroupsAssignMyWorkspaceToCapacity
     * @summary Assigns **My workspace** to the specified capacity.
     * @request POST:/v1.0/myorg/AssignToCapacity
     */
    groupsAssignMyWorkspaceToCapacity: (requestParameters: AssignToCapacityRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/AssignToCapacity`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description To unassign **My workspace** from a capacity, provide an empty GUID (`00000000-0000-0000-0000-000000000000`) as the `capacityId`. ## Permissions - The user must have administrator rights or assign permissions on the capacity. - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Capacity.ReadWrite.All and Workspace.ReadWrite.All <br><br>
     *
     * @tags Capacities
     * @name GroupsAssignToCapacity
     * @summary Assigns the specified workspace to the specified capacity.
     * @request POST:/v1.0/myorg/groups/{groupId}/AssignToCapacity
     */
    groupsAssignToCapacity: (groupId: string, requestParameters: AssignToCapacityRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/AssignToCapacity`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Workspace.Read.All and Workspace.ReadWrite.All <br><br>
     *
     * @tags Capacities
     * @name GroupsCapacityAssignmentStatusMyWorkspace
     * @summary Gets the status of the **My workspace** assignment-to-capacity operation.
     * @request GET:/v1.0/myorg/CapacityAssignmentStatus
     */
    groupsCapacityAssignmentStatusMyWorkspace: (params: RequestParams = {}) =>
      this.request<WorkspaceCapacityAssignmentStatus, any>({
        path: `/v1.0/myorg/CapacityAssignmentStatus`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights or assign permissions on the capacity. - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Workspace.Read.All and Workspace.ReadWrite.All <br><br>
     *
     * @tags Capacities
     * @name GroupsCapacityAssignmentStatus
     * @summary Gets the status of the assignment-to-capacity operation for the specified workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/CapacityAssignmentStatus
     */
    groupsCapacityAssignmentStatus: (groupId: string, params: RequestParams = {}) =>
      this.request<WorkspaceCapacityAssignmentStatus, any>({
        path: `/v1.0/myorg/groups/${groupId}/CapacityAssignmentStatus`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description This API call doesn't require any scopes. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). <br><br>
     *
     * @tags AvailableFeatures
     * @name AvailableFeaturesGetAvailableFeatures
     * @summary Returns a list of available features for the user.
     * @request GET:/v1.0/myorg/availableFeatures
     */
    availableFeaturesGetAvailableFeatures: (params: RequestParams = {}) =>
      this.request<AvailableFeatures, any>({
        path: `/v1.0/myorg/availableFeatures`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description This API call doesn't require any scopes. ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). <br><br>
     *
     * @tags AvailableFeatures
     * @name AvailableFeaturesGetAvailableFeatureByName
     * @summary Returns the specified available feature for the user by name.
     * @request GET:/v1.0/myorg/availableFeatures(featureName='{featureName}')
     */
    availableFeaturesGetAvailableFeatureByName: (featureName: string, params: RequestParams = {}) =>
      this.request<AvailableFeature, any>({
        path: `/v1.0/myorg/availableFeatures(featureName='${featureName}')`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Pipeline.Read.All or Pipeline.ReadWrite.All <br><br>
     *
     * @tags Pipelines
     * @name PipelinesGetPipelines
     * @summary Returns a list of deployment pipelines that the user has access to.
     * @request GET:/v1.0/myorg/pipelines
     */
    pipelinesGetPipelines: (params: RequestParams = {}) =>
      this.request<Pipelines, any>({
        path: `/v1.0/myorg/pipelines`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Pipeline.ReadWrite.All <br><br>
     *
     * @tags Pipelines
     * @name PipelinesCreatePipeline
     * @summary Creates a new deployment pipeline.
     * @request POST:/v1.0/myorg/pipelines
     */
    pipelinesCreatePipeline: (createPipelineRequest: CreatePipelineRequest, params: RequestParams = {}) =>
      this.request<Pipeline, any>({
        path: `/v1.0/myorg/pipelines`,
        method: "POST",
        body: createPipelineRequest,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Pipeline.ReadWrite.All or Pipeline.Read.All <br><br>
     *
     * @tags Pipelines
     * @name PipelinesGetPipeline
     * @summary Returns the specified deployment pipeline.
     * @request GET:/v1.0/myorg/pipelines/{pipelineId}
     */
    pipelinesGetPipeline: (
      pipelineId: string,
      query?: {
        /**
         * Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `stages`.
         * @default "stages"
         */
        $expand?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Pipeline, any>({
        path: `/v1.0/myorg/pipelines/${pipelineId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Pipeline.ReadWrite.All <br><br>
     *
     * @tags Pipelines
     * @name PipelinesUpdatePipeline
     * @summary Updates the specified deployment pipeline.
     * @request PATCH:/v1.0/myorg/pipelines/{pipelineId}
     */
    pipelinesUpdatePipeline: (
      pipelineId: string,
      updatePipelineRequest: UpdatePipelineRequest,
      params: RequestParams = {},
    ) =>
      this.request<Pipeline, any>({
        path: `/v1.0/myorg/pipelines/${pipelineId}`,
        method: "PATCH",
        body: updatePipelineRequest,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Pipeline.ReadWrite.All ## Limitations This operation will fail if there's an active deployment operation. <br><br>
     *
     * @tags Pipelines
     * @name PipelinesDeletePipeline
     * @summary Deletes the specified deployment pipeline.
     * @request DELETE:/v1.0/myorg/pipelines/{pipelineId}
     */
    pipelinesDeletePipeline: (pipelineId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/pipelines/${pipelineId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Required Scope Pipeline.ReadWrite.All or Pipeline.Read.All <br><br>
     *
     * @tags Pipelines
     * @name PipelinesGetPipelineUsers
     * @summary Returns a list of users that have access to the specified deployment pipeline.
     * @request GET:/v1.0/myorg/pipelines/{pipelineId}/users
     */
    pipelinesGetPipelineUsers: (pipelineId: string, params: RequestParams = {}) =>
      this.request<PipelineUsers, any>({
        path: `/v1.0/myorg/pipelines/${pipelineId}/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Pipeline.ReadWrite.All <br><br>
     *
     * @tags Pipelines
     * @name PipelinesUpdatePipelineUser
     * @summary Grants user permissions to the specified deployment pipeline.
     * @request POST:/v1.0/myorg/pipelines/{pipelineId}/users
     */
    pipelinesUpdatePipelineUser: (pipelineId: string, userDetails: PipelineUser, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/pipelines/${pipelineId}/users`,
        method: "POST",
        body: userDetails,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Pipeline.ReadWrite.All <br><br>
     *
     * @tags Pipelines
     * @name PipelinesDeletePipelineUser
     * @summary Removes user permissions from the specified deployment pipeline.
     * @request DELETE:/v1.0/myorg/pipelines/{pipelineId}/users/{identifier}
     */
    pipelinesDeletePipelineUser: (pipelineId: string, identifier: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/pipelines/${pipelineId}/users/${identifier}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Required Scope Pipeline.ReadWrite.All or Pipeline.Read.All <br><br>
     *
     * @tags Pipelines
     * @name PipelinesGetPipelineStages
     * @summary Returns the stages of the specified deployment pipeline.
     * @request GET:/v1.0/myorg/pipelines/{pipelineId}/stages
     */
    pipelinesGetPipelineStages: (pipelineId: string, params: RequestParams = {}) =>
      this.request<PipelineStages, any>({
        path: `/v1.0/myorg/pipelines/${pipelineId}/stages`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Pipeline.ReadWrite.All and Workspace.ReadWrite.All ## Limitations - The specified deployment pipeline stage isn't already assigned. - You must be an admin of the specified workspace. - The specified workspace isn't assigned to any other deployment pipeline. - This operation will fail if there's an active deployment operation. <br><br>
     *
     * @tags Pipelines
     * @name PipelinesAssignWorkspace
     * @summary Assigns the specified workspace to the specified deployment pipeline stage.
     * @request POST:/v1.0/myorg/pipelines/{pipelineId}/stages/{stageOrder}/assignWorkspace
     */
    pipelinesAssignWorkspace: (
      pipelineId: string,
      stageOrder: number,
      assignWorkspaceRequest: AssignWorkspaceRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/pipelines/${pipelineId}/stages/${stageOrder}/assignWorkspace`,
        method: "POST",
        body: assignWorkspaceRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Pipeline.ReadWrite.All ## Limitations This operation will fail if there's an active deployment operation. <br><br>
     *
     * @tags Pipelines
     * @name PipelinesUnassignWorkspace
     * @summary Unassigns the workspace from the specified stage in the specified deployment pipeline.
     * @request POST:/v1.0/myorg/pipelines/{pipelineId}/stages/{stageOrder}/unassignWorkspace
     */
    pipelinesUnassignWorkspace: (pipelineId: string, stageOrder: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/pipelines/${pipelineId}/stages/${stageOrder}/unassignWorkspace`,
        method: "POST",
        ...params,
      }),

    /**
     * @description To learn about items that aren't supported in deployment pipelines, see [Unsupported items](/power-bi/create-reports/deployment-pipelines-process#unsupported-items). ## Permissions The user must at least be a contributor on the workspace assigned to the specified stage. For more information, see [Permissions](/power-bi/create-reports/deployment-pipelines-process#permissions). ## Required Scope Pipeline.ReadWrite.All or Pipeline.Read.All <br><br>
     *
     * @tags Pipelines
     * @name PipelinesGetPipelineStageArtifacts
     * @summary Returns the supported items from the workspace assigned to the specified stage of the specified deployment pipeline.
     * @request GET:/v1.0/myorg/pipelines/{pipelineId}/stages/{stageOrder}/artifacts
     */
    pipelinesGetPipelineStageArtifacts: (pipelineId: string, stageOrder: number, params: RequestParams = {}) =>
      this.request<PipelineStageArtifacts, any>({
        path: `/v1.0/myorg/pipelines/${pipelineId}/stages/${stageOrder}/artifacts`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope Pipeline.ReadWrite.All or Pipeline.Read.All <br><br>
     *
     * @tags Pipelines
     * @name PipelinesGetPipelineOperations
     * @summary Returns a list of the up-to-20 most recent deploy operations performed on the specified deployment pipeline.
     * @request GET:/v1.0/myorg/pipelines/{pipelineId}/operations
     */
    pipelinesGetPipelineOperations: (pipelineId: string, params: RequestParams = {}) =>
      this.request<PipelineOperations, any>({
        path: `/v1.0/myorg/pipelines/${pipelineId}/operations`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Use to track the status of a deploy operation. ## Required Scope Pipeline.ReadWrite.All or Pipeline.Read.All <br><br>
     *
     * @tags Pipelines
     * @name PipelinesGetPipelineOperation
     * @summary Returns the details of the specified deploy operation performed on the specified deployment pipeline, including the deployment execution plan.
     * @request GET:/v1.0/myorg/pipelines/{pipelineId}/operations/{operationId}
     */
    pipelinesGetPipelineOperation: (pipelineId: string, operationId: string, params: RequestParams = {}) =>
      this.request<PipelineOperation, any>({
        path: `/v1.0/myorg/pipelines/${pipelineId}/operations/${operationId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description To learn about items that aren't supported in deployment pipelines, see [Unsupported items](/power-bi/create-reports/deployment-pipelines-process#unsupported-items). ## Permissions The user must at least be a member on both source and target deployment workspaces. For more information, see [Permissions](/power-bi/create-reports/deployment-pipelines-process#permissions). ## Required Scope Pipeline.Deploy ## Limitations Maximum 300 deployed items per request. <br><br>
     *
     * @tags Pipelines
     * @name PipelinesDeployAll
     * @summary Deploys all supported items from the source stage of the specified deployment pipeline.
     * @request POST:/v1.0/myorg/pipelines/{pipelineId}/deployAll
     */
    pipelinesDeployAll: (pipelineId: string, deployRequest: DeployAllRequest, params: RequestParams = {}) =>
      this.request<PipelineOperation, any>({
        path: `/v1.0/myorg/pipelines/${pipelineId}/deployAll`,
        method: "POST",
        body: deployRequest,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must at least be a member on both source and target deployment workspaces. For more information, see [Permissions](/power-bi/create-reports/deployment-pipelines-process#permissions). ## Required Scope Pipeline.Deploy ## Limitations Maximum 300 deployed items per request. <br><br>
     *
     * @tags Pipelines
     * @name PipelinesSelectiveDeploy
     * @summary Deploys the specified items from the source stage of the specified deployment pipeline.
     * @request POST:/v1.0/myorg/pipelines/{pipelineId}/deploy
     */
    pipelinesSelectiveDeploy: (pipelineId: string, deployRequest: SelectiveDeployRequest, params: RequestParams = {}) =>
      this.request<PipelineOperation, any>({
        path: `/v1.0/myorg/pipelines/${pipelineId}/deploy`,
        method: "POST",
        body: deployRequest,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Required Scope StorageAccount.Read.All or StorageAccount.ReadWrite.All <br><br>
     *
     * @tags DataflowStorageAccounts
     * @name DataflowStorageAccountsGetDataflowStorageAccounts
     * @summary Returns a list of dataflow storage accounts that the user has access to.
     * @request GET:/v1.0/myorg/dataflowStorageAccounts
     */
    dataflowStorageAccountsGetDataflowStorageAccounts: (params: RequestParams = {}) =>
      this.request<DataflowStorageAccounts, any>({
        path: `/v1.0/myorg/dataflowStorageAccounts`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description To perform this operation, the user must be an admin on the specified workspace and the Power BI dataflow storage account must be enabled. To unassign the specified workspace from a Power BI dataflow storage account, provide an empty GUID (`00000000-0000-0000-0000-000000000000`) as the `dataflowStorageId`. ## Required Scope StorageAccount.ReadWrite.All and Workspace.ReadWrite.All <br><br>
     *
     * @tags DataflowStorageAccounts
     * @name GroupsAssignToDataflowStorage
     * @summary Assigns the specified workspace to the specified dataflow storage account.
     * @request POST:/v1.0/myorg/groups/{groupId}/AssignToDataflowStorage
     */
    groupsAssignToDataflowStorage: (
      groupId: string,
      requestParameters: AssignToDataflowStorageRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/AssignToDataflowStorage`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description > [!IMPORTANT] > If you set the `datasetSchema` or `datasetExpressions` parameters to `true`, you must fully enable metadata scanning in order for data to be returned. For more information, see [Enable tenant settings for metadata scanning](/power-bi/admin/service-admin-metadata-scanning-setup#enable-tenant-settings-for-metadata-scanning). ## Permissions The user must have administrator rights (such as Microsoft 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. When running under service principal authentication, an app **must not** have any admin-consent required permissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations - Maximum 500 requests per hour. - Maximum 16 simultaneous requests. <br><br>
     *
     * @tags Admin
     * @name WorkspaceInfoPostWorkspaceInfo
     * @summary Initiates a call to receive metadata for the requested list of workspaces.
     * @request POST:/v1.0/myorg/admin/workspaces/getInfo
     */
    workspaceInfoPostWorkspaceInfo: (
      requiredWorkspaces: RequiredWorkspaces,
      query?: {
        /** Whether to return lineage info (upstream dataflows, tiles, data source IDs) */
        lineage?: boolean;
        /** Whether to return data source details */
        datasourceDetails?: boolean;
        /** Whether to return dataset schema (tables, columns and measures). If you set this parameter to `true`, you must fully enable metadata scanning in order for data to be returned. For more information, see [Enable tenant settings for metadata scanning](/power-bi/admin/service-admin-metadata-scanning-setup#enable-tenant-settings-for-metadata-scanning). */
        datasetSchema?: boolean;
        /** Whether to return dataset expressions (DAX and Mashup queries). If you set this parameter to `true`, you must fully enable metadata scanning in order for data to be returned. For more information, see [Enable tenant settings for metadata scanning](/power-bi/admin/service-admin-metadata-scanning-setup#enable-tenant-settings-for-metadata-scanning). */
        datasetExpressions?: boolean;
        /** Whether to return user details for a Power BI item (such as a report or a dashboard) */
        getArtifactUsers?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<ScanRequest, any>({
        path: `/v1.0/myorg/admin/workspaces/getInfo`,
        method: "POST",
        query: query,
        body: requiredWorkspaces,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have administrator rights (such as Microsoft 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. When running under service principal authentication, an app **must not** have any admin-consent required permissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 10,000 requests per hour. <br><br>
     *
     * @tags Admin
     * @name WorkspaceInfoGetScanStatus
     * @summary Gets the scan status for the specified scan.
     * @request GET:/v1.0/myorg/admin/workspaces/scanStatus/{scanId}
     */
    workspaceInfoGetScanStatus: (scanId: string, params: RequestParams = {}) =>
      this.request<ScanRequest, any>({
        path: `/v1.0/myorg/admin/workspaces/scanStatus/${scanId}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Only make this API call after a successful [GetScanStatus](/rest/api/power-bi/admin/workspace-info-get-scan-status) API call. The scan result will remain available for 24 hours. ## Permissions The user must have administrator rights (such as Microsoft 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. When running under service principal authentication, an app **must not** have any admin-consent required permissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 500 requests per hour. <br><br>
     *
     * @tags Admin
     * @name WorkspaceInfoGetScanResult
     * @summary Gets the scan result for the specified scan.
     * @request GET:/v1.0/myorg/admin/workspaces/scanResult/{scanId}
     */
    workspaceInfoGetScanResult: (scanId: string, params: RequestParams = {}) =>
      this.request<WorkspaceInfoResponse, any>({
        path: `/v1.0/myorg/admin/workspaces/scanResult/${scanId}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description If the optional `modifiedSince` parameter is set to a date-time, only the IDs of workspaces that changed after that date-time are returned. If the `modifiedSince` parameter isn't used, the IDs of all workspaces in the organization are returned. The date-time specified by the `modifiedSince` parameter must be in the range of 30 minutes (to allow workspace changes to take effect) to 30 days prior to the current time. ## Permissions The user must have administrator rights (such as Microsoft 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. When running under service principal authentication, an app **must not** have any admin-consent required permissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 30 requests per hour. <br><br>
     *
     * @tags Admin
     * @name WorkspaceInfoGetModifiedWorkspaces
     * @summary Gets a list of workspace IDs in the organization.
     * @request GET:/v1.0/myorg/admin/workspaces/modified
     */
    workspaceInfoGetModifiedWorkspaces: (
      query?: {
        /**
         * Last modified date (must be in ISO 8601 compliant UTC format)
         * @format date-time
         */
        modifiedSince?: string;
        /** Whether to exclude personal workspaces */
        excludePersonalWorkspaces?: boolean;
        /** Whether to exclude inactive workspaces */
        excludeInActiveWorkspaces?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<ModifiedWorkspace[], any>({
        path: `/v1.0/myorg/admin/workspaces/modified`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator). ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All <br><br>
     *
     * @tags Admin
     * @name CapacitiesAssignWorkspacesToCapacity
     * @summary Assigns the specified workspaces to the specified Premium capacity.
     * @request POST:/v1.0/myorg/admin/capacities/AssignWorkspaces
     */
    capacitiesAssignWorkspacesToCapacity: (
      requestParameters: AssignWorkspacesToCapacityRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/admin/capacities/AssignWorkspaces`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator). ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All <br><br>
     *
     * @tags Admin
     * @name CapacitiesUnassignWorkspacesFromCapacity
     * @summary Unassigns the specified workspaces from capacity.
     * @request POST:/v1.0/myorg/admin/capacities/UnassignWorkspaces
     */
    capacitiesUnassignWorkspacesFromCapacity: (
      requestParameters: UnassignWorkspacesCapacityRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/admin/capacities/UnassignWorkspaces`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Each request takes two seconds to process, during which time other requests are queued. ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. <br><br>
     *
     * @tags Admin
     * @name DatasetsGetDatasetsAsAdmin
     * @summary Returns a list of datasets for the organization.
     * @request GET:/v1.0/myorg/admin/datasets
     */
    datasetsGetDatasetsAsAdmin: (
      query?: {
        /** Filters the results, based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results
         * @format int32
         */
        $top?: number;
        /**
         * Skips the first n results
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminDatasets, any>({
        path: `/v1.0/myorg/admin/datasets`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Each request takes 0.5 seconds to process, during which time other requests are queued. ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. <br><br>
     *
     * @tags Admin
     * @name DatasetsGetDatasourcesAsAdmin
     * @summary Returns a list of data sources for the specified dataset.
     * @request GET:/v1.0/myorg/admin/datasets/{datasetId}/datasources
     */
    datasetsGetDatasourcesAsAdmin: (datasetId: string, params: RequestParams = {}) =>
      this.request<Datasources, any>({
        path: `/v1.0/myorg/admin/datasets/${datasetId}/datasources`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. - The permissions for this API call are listed in [Datasets permissions](/power-bi/developer/embedded/datasets-permissions). When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name DatasetsGetDatasetUsersAsAdmin
     * @summary Returns a list of users that have access to the specified dataset.
     * @request GET:/v1.0/myorg/admin/datasets/{datasetId}/users
     */
    datasetsGetDatasetUsersAsAdmin: (datasetId: string, params: RequestParams = {}) =>
      this.request<DatasetUsers, any>({
        path: `/v1.0/myorg/admin/datasets/${datasetId}/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 50 requests per hour, per tenant. This call will also time out after 30 seconds to prevent adverse effect on the Power BI service. <br><br>
     *
     * @tags Admin
     * @name GroupsGetGroupsAsAdmin
     * @summary Returns a list of workspaces for the organization.
     * @request GET:/v1.0/myorg/admin/groups
     */
    groupsGetGroupsAsAdmin: (
      query: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `users`, `reports`, `dashboards`, `datasets`, `dataflows`, and `workbooks`. */
        $expand?: string;
        /** Filters the results based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results. This parameter is mandatory and must be in the range of 1-5000.
         * @format int32
         * @min 1
         * @max 5000
         */
        $top: number;
        /**
         * Skips the first n results. Use with top to fetch results beyond the first 5000.
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGroups, any>({
        path: `/v1.0/myorg/admin/groups`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name GroupsGetGroupAsAdmin
     * @summary Returns a workspace for the organization.
     * @request GET:/v1.0/myorg/admin/groups/{groupId}
     */
    groupsGetGroupAsAdmin: (
      groupId: string,
      query?: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `users`, `reports`, `dashboards`, `datasets`, `dataflows`, and `workbooks`. */
        $expand?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGroup, any>({
        path: `/v1.0/myorg/admin/groups/${groupId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Only the name and description can be updated. The name must be unique inside an organization. ## Permissions The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator). ## Required Scope Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name GroupsUpdateGroupAsAdmin
     * @summary Updates the properties of the specified workspace.
     * @request PATCH:/v1.0/myorg/admin/groups/{groupId}
     */
    groupsUpdateGroupAsAdmin: (groupId: string, groupProperties: AdminGroup, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/admin/groups/${groupId}`,
        method: "PATCH",
        body: groupProperties,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name GroupsGetGroupUsersAsAdmin
     * @summary Returns a list of users that have access to the specified workspace.
     * @request GET:/v1.0/myorg/admin/groups/{groupId}/users
     */
    groupsGetGroupUsersAsAdmin: (groupId: string, params: RequestParams = {}) =>
      this.request<GroupUsers, any>({
        path: `/v1.0/myorg/admin/groups/${groupId}/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description This API call only supports adding a user principle. ## Permissions The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator). ## Required Scope Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name GroupsAddUserAsAdmin
     * @summary Grants user permissions to the specified workspace.
     * @request POST:/v1.0/myorg/admin/groups/{groupId}/users
     */
    groupsAddUserAsAdmin: (groupId: string, userDetails: GroupUser, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/admin/groups/${groupId}/users`,
        method: "POST",
        body: userDetails,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description This API call only supports adding a user principle. ## Permissions The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator). ## Required Scope Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name GroupsDeleteUserAsAdmin
     * @summary Removes user permissions from the specified workspace.
     * @request DELETE:/v1.0/myorg/admin/groups/{groupId}/users/{user}
     */
    groupsDeleteUserAsAdmin: (
      groupId: string,
      user: string,
      query?: {
        /**
         * The service principal profile ID to delete
         * @format uuid
         */
        profileId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/admin/groups/${groupId}/users/${user}`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * @description Use this API call to restore workspaces. ## Permissions The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator). ## Required Scope Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name GroupsRestoreDeletedGroupAsAdmin
     * @summary Restores a deleted workspace.
     * @request POST:/v1.0/myorg/admin/groups/{groupId}/restore
     */
    groupsRestoreDeletedGroupAsAdmin: (
      groupId: string,
      groupRestoreRequest: GroupRestoreRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/admin/groups/${groupId}/restore`,
        method: "POST",
        body: groupRestoreRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name DataflowsGetUpstreamDataflowsInGroupAsAdmin
     * @summary Returns a list of upstream dataflows for the specified dataflow.
     * @request GET:/v1.0/myorg/admin/groups/{groupId}/dataflows/{dataflowId}/upstreamDataflows
     */
    dataflowsGetUpstreamDataflowsInGroupAsAdmin: (groupId: string, dataflowId: string, params: RequestParams = {}) =>
      this.request<DependentDataflows, any>({
        path: `/v1.0/myorg/admin/groups/${groupId}/dataflows/${dataflowId}/upstreamDataflows`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name DashboardsGetDashboardsInGroupAsAdmin
     * @summary Returns a list of dashboards from the specified workspace.
     * @request GET:/v1.0/myorg/admin/groups/{groupId}/dashboards
     */
    dashboardsGetDashboardsInGroupAsAdmin: (
      groupId: string,
      query?: {
        /** Filters the results, based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results
         * @format int32
         */
        $top?: number;
        /**
         * Skips the first n results
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminDashboards, any>({
        path: `/v1.0/myorg/admin/groups/${groupId}/dashboards`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name ReportsGetReportsInGroupAsAdmin
     * @summary Returns a list of reports from the specified workspace.
     * @request GET:/v1.0/myorg/admin/groups/{groupId}/reports
     */
    reportsGetReportsInGroupAsAdmin: (
      groupId: string,
      query?: {
        /** Filters the results, based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results
         * @format int32
         */
        $top?: number;
        /**
         * Skips the first n results
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminReports, any>({
        path: `/v1.0/myorg/admin/groups/${groupId}/reports`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name DatasetsGetDatasetsInGroupAsAdmin
     * @summary Returns a list of datasets from the specified workspace.
     * @request GET:/v1.0/myorg/admin/groups/{groupId}/datasets
     */
    datasetsGetDatasetsInGroupAsAdmin: (
      groupId: string,
      query?: {
        /** Filters the results, based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results
         * @format int32
         */
        $top?: number;
        /**
         * Skips the first n results
         * @format int32
         */
        $skip?: number;
        /** Expands related entities inline */
        $expand?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminDatasets, any>({
        path: `/v1.0/myorg/admin/groups/${groupId}/datasets`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name DatasetsGetDatasetToDataflowsLinksInGroupAsAdmin
     * @summary Returns a list of upstream dataflows for datasets from the specified workspace.
     * @request GET:/v1.0/myorg/admin/groups/{groupId}/datasets/upstreamDataflows
     */
    datasetsGetDatasetToDataflowsLinksInGroupAsAdmin: (groupId: string, params: RequestParams = {}) =>
      this.request<DatasetToDataflowLinksResponse, any>({
        path: `/v1.0/myorg/admin/groups/${groupId}/datasets/upstreamDataflows`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name DataflowsGetDataflowsInGroupAsAdmin
     * @summary Returns a list of dataflows from the specified workspace.
     * @request GET:/v1.0/myorg/admin/groups/{groupId}/dataflows
     */
    dataflowsGetDataflowsInGroupAsAdmin: (
      groupId: string,
      query?: {
        /** Filters the results, based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results
         * @format int32
         */
        $top?: number;
        /**
         * Skips the first n results
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Dataflows, any>({
        path: `/v1.0/myorg/admin/groups/${groupId}/dataflows`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name GroupsGetUnusedArtifactsAsAdmin
     * @summary Returns a list of datasets, reports, and dashboards that have not been used within 30 days for the specified workspace. This is a preview API call.
     * @request GET:/v1.0/myorg/admin/groups/{groupId}/unused
     */
    groupsGetUnusedArtifactsAsAdmin: (
      groupId: string,
      query?: {
        /** Token required to get the next chunk of the result set */
        continuationToken?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UnusedArtifactsResponse, any>({
        path: `/v1.0/myorg/admin/groups/${groupId}/unused`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name ReportsGetReportsAsAdmin
     * @summary Returns a list of reports for the organization.
     * @request GET:/v1.0/myorg/admin/reports
     */
    reportsGetReportsAsAdmin: (
      query?: {
        /** Filters the results, based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results
         * @format int32
         */
        $top?: number;
        /**
         * Skips the first n results
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminReports, any>({
        path: `/v1.0/myorg/admin/reports`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name ReportsGetReportUsersAsAdmin
     * @summary Returns a list of users that have access to the specified report.
     * @request GET:/v1.0/myorg/admin/reports/{reportId}/users
     */
    reportsGetReportUsersAsAdmin: (reportId: string, params: RequestParams = {}) =>
      this.request<ReportUsers, any>({
        path: `/v1.0/myorg/admin/reports/${reportId}/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name ReportsGetReportSubscriptionsAsAdmin
     * @summary Returns a list of report subscriptions along with subscriber details. This is a preview API call.
     * @request GET:/v1.0/myorg/admin/reports/{reportId}/subscriptions
     */
    reportsGetReportSubscriptionsAsAdmin: (reportId: string, params: RequestParams = {}) =>
      this.request<Subscriptions, any>({
        path: `/v1.0/myorg/admin/reports/${reportId}/subscriptions`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name DashboardsGetDashboardsAsAdmin
     * @summary Returns a list of dashboards for the organization.
     * @request GET:/v1.0/myorg/admin/dashboards
     */
    dashboardsGetDashboardsAsAdmin: (
      query?: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `tiles`. */
        $expand?: string;
        /** Filters the results, based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results
         * @format int32
         */
        $top?: number;
        /**
         * Skips the first n results
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminDashboards, any>({
        path: `/v1.0/myorg/admin/dashboards`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name DashboardsGetTilesAsAdmin
     * @summary Returns a list of tiles within the specified dashboard.
     * @request GET:/v1.0/myorg/admin/dashboards/{dashboardId}/tiles
     */
    dashboardsGetTilesAsAdmin: (dashboardId: string, params: RequestParams = {}) =>
      this.request<AdminTiles, any>({
        path: `/v1.0/myorg/admin/dashboards/${dashboardId}/tiles`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name DashboardsGetDashboardUsersAsAdmin
     * @summary Returns a list of users that have access to the specified dashboard.
     * @request GET:/v1.0/myorg/admin/dashboards/{dashboardId}/users
     */
    dashboardsGetDashboardUsersAsAdmin: (dashboardId: string, params: RequestParams = {}) =>
      this.request<DashboardUsers, any>({
        path: `/v1.0/myorg/admin/dashboards/${dashboardId}/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name DashboardsGetDashboardSubscriptionsAsAdmin
     * @summary Returns a list of dashboard subscriptions along with subscriber details. This is a preview API call.
     * @request GET:/v1.0/myorg/admin/dashboards/{dashboardId}/subscriptions
     */
    dashboardsGetDashboardSubscriptionsAsAdmin: (dashboardId: string, params: RequestParams = {}) =>
      this.request<Subscriptions, any>({
        path: `/v1.0/myorg/admin/dashboards/${dashboardId}/subscriptions`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name WidelySharedArtifactsLinksSharedToWholeOrganization
     * @summary Returns a list of Power BI items (such as reports or dashboards) that are shared with the whole organization through links.
     * @request GET:/v1.0/myorg/admin/widelySharedArtifacts/linksSharedToWholeOrganization
     */
    widelySharedArtifactsLinksSharedToWholeOrganization: (
      query?: {
        /** Token required to get the next chunk of the result set */
        continuationToken?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ArtifactAccessResponse, any>({
        path: `/v1.0/myorg/admin/widelySharedArtifacts/linksSharedToWholeOrganization`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name WidelySharedArtifactsPublishedToWeb
     * @summary Returns a list of Power BI items (such as reports or dashboards) that are published to the web.
     * @request GET:/v1.0/myorg/admin/widelySharedArtifacts/publishedToWeb
     */
    widelySharedArtifactsPublishedToWeb: (
      query?: {
        /** Token required to get the next chunk of the result set */
        continuationToken?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ArtifactAccessResponse, any>({
        path: `/v1.0/myorg/admin/widelySharedArtifacts/publishedToWeb`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name ImportsGetImportsAsAdmin
     * @summary Returns a list of imports for the organization.
     * @request GET:/v1.0/myorg/admin/imports
     */
    importsGetImportsAsAdmin: (
      query?: {
        /** Expands related entities inline */
        $expand?: string;
        /** Filters the results, based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results
         * @format int32
         */
        $top?: number;
        /**
         * Skips the first n results
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Imports, any>({
        path: `/v1.0/myorg/admin/imports`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator). ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All ## Limitations Maximum 600 requests per hour. <br><br>
     *
     * @tags Admin
     * @name AdminAddPowerBiEncryptionKey
     * @summary Adds an encryption key for Power BI workspaces assigned to a capacity.
     * @request POST:/v1.0/myorg/admin/tenantKeys
     */
    adminAddPowerBiEncryptionKey: (tenantKeyCreationRequest: TenantKeyCreationRequest, params: RequestParams = {}) =>
      this.request<TenantKey, any>({
        path: `/v1.0/myorg/admin/tenantKeys`,
        method: "POST",
        body: tenantKeyCreationRequest,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. <br><br>
     *
     * @tags Admin
     * @name AdminGetPowerBiEncryptionKeys
     * @summary Returns the encryption keys for the tenant.
     * @request GET:/v1.0/myorg/admin/tenantKeys
     */
    adminGetPowerBiEncryptionKeys: (params: RequestParams = {}) =>
      this.request<TenantKeys, any>({
        path: `/v1.0/myorg/admin/tenantKeys`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator). ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All ## Limitations Maximum 600 requests per hour. <br><br>
     *
     * @tags Admin
     * @name AdminRotatePowerBiEncryptionKey
     * @summary Rotate the encryption key for Power BI workspaces assigned to a capacity.
     * @request POST:/v1.0/myorg/admin/tenantKeys/{tenantKeyId}/Default.Rotate
     */
    adminRotatePowerBiEncryptionKey: (
      tenantKeyId: string,
      tenantKeyRotationRequest: TenantKeyRotationRequest,
      params: RequestParams = {},
    ) =>
      this.request<TenantKey, any>({
        path: `/v1.0/myorg/admin/tenantKeys/${tenantKeyId}/Default.Rotate`,
        method: "POST",
        body: tenantKeyRotationRequest,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. <br><br>
     *
     * @tags Admin
     * @name AdminGetCapacitiesAsAdmin
     * @summary Returns a list of capacities for the organization.
     * @request GET:/v1.0/myorg/admin/capacities
     */
    adminGetCapacitiesAsAdmin: (
      query?: {
        /** Expands related entities inline */
        $expand?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Capacities, any>({
        path: `/v1.0/myorg/admin/capacities`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator). ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All <br><br>
     *
     * @tags Admin
     * @name AdminPatchCapacityAsAdmin
     * @summary Changes specific capacity information. Currently, this API call only supports changing the capacity's encryption key.
     * @request PATCH:/v1.0/myorg/admin/capacities/{capacityId}
     */
    adminPatchCapacityAsAdmin: (
      capacityId: string,
      capacityPatchRequest: CapacityPatchRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/admin/capacities/${capacityId}`,
        method: "PATCH",
        body: capacityPatchRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator). - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. <br><br>
     *
     * @tags Admin
     * @name CapacitiesGetCapacityUsersAsAdmin
     * @summary Returns a list of users that have access to the specified workspace.
     * @request GET:/v1.0/myorg/admin/capacities/{capacityId}/users
     */
    capacitiesGetCapacityUsersAsAdmin: (capacityId: string, params: RequestParams = {}) =>
      this.request<CapacityUsers, any>({
        path: `/v1.0/myorg/admin/capacities/${capacityId}/users`,
        method: "GET",
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Power BI retains a seven-day refresh history for each dataset, up to a maximum of sixty refreshes. ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. <br><br>
     *
     * @tags Admin
     * @name AdminGetRefreshables
     * @summary Returns a list of refreshables for the organization within a capacity.
     * @request GET:/v1.0/myorg/admin/capacities/refreshables
     */
    adminGetRefreshables: (
      query: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `capacities` and `groups`. */
        $expand?: string;
        /** Filters the results based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results.
         * @format int32
         * @min 1
         */
        $top: number;
        /**
         * Skips the first n results. Use with top to fetch results beyond the first 1000.
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Refreshables, any>({
        path: `/v1.0/myorg/admin/capacities/refreshables`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Power BI retains a seven-day refresh history for each dataset, up to a maximum of sixty refreshes. ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. <br><br>
     *
     * @tags Admin
     * @name AdminGetRefreshablesForCapacity
     * @summary Returns a list of refreshables for the specified capacity that the user has access to.
     * @request GET:/v1.0/myorg/admin/capacities/{capacityId}/refreshables
     */
    adminGetRefreshablesForCapacity: (
      capacityId: string,
      query: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `capacities` and `groups`. */
        $expand?: string;
        /** Filters the results based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results.
         * @format int32
         * @min 1
         */
        $top: number;
        /**
         * Skips the first n results. Use with top to fetch results beyond the first 1000.
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Refreshables, any>({
        path: `/v1.0/myorg/admin/capacities/${capacityId}/refreshables`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Power BI retains a seven-day refresh history for each dataset, up to a maximum of sixty refreshes. ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. <br><br>
     *
     * @tags Admin
     * @name AdminGetRefreshableForCapacity
     * @summary Returns the specified refreshable for the specified capacity that the user has access to.
     * @request GET:/v1.0/myorg/admin/capacities/{capacityId}/refreshables/{refreshableId}
     */
    adminGetRefreshableForCapacity: (
      capacityId: string,
      refreshableId: string,
      query?: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `capacities` and `groups`. */
        $expand?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Refreshables, any>({
        path: `/v1.0/myorg/admin/capacities/${capacityId}/refreshables/${refreshableId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. <br><br>
     *
     * @tags Admin
     * @name DataflowsGetDataflowsAsAdmin
     * @summary Returns a list of dataflows for the organization.
     * @request GET:/v1.0/myorg/admin/dataflows
     */
    dataflowsGetDataflowsAsAdmin: (
      query?: {
        /** Filters the results, based on a boolean condition */
        $filter?: string;
        /**
         * Returns only the first n results
         * @format int32
         */
        $top?: number;
        /**
         * Skips the first n results
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminDataflows, any>({
        path: `/v1.0/myorg/admin/dataflows`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. <br><br>
     *
     * @tags Admin
     * @name DataflowsExportDataflowAsAdmin
     * @summary Exports the definition for the specified dataflow to a JSON file.
     * @request GET:/v1.0/myorg/admin/dataflows/{dataflowId}/export
     */
    dataflowsExportDataflowAsAdmin: (dataflowId: string, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/v1.0/myorg/admin/dataflows/${dataflowId}/export`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Deleted data sources will still appear in the response. This may include both cloud and on-premise data gateway sources. For more information see [Dataflows considerations and limitations](/power-bi/transform-model/dataflows/dataflows-features-limitations). ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. <br><br>
     *
     * @tags Admin
     * @name DataflowsGetDataflowDatasourcesAsAdmin
     * @summary Returns a list of data sources for the specified dataflow.
     * @request GET:/v1.0/myorg/admin/dataflows/{dataflowId}/datasources
     */
    dataflowsGetDataflowDatasourcesAsAdmin: (dataflowId: string, params: RequestParams = {}) =>
      this.request<Datasources, any>({
        path: `/v1.0/myorg/admin/dataflows/${dataflowId}/datasources`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name DataflowsGetDataflowUsersAsAdmin
     * @summary Returns a list of users that have access to the specified dataflow.
     * @request GET:/v1.0/myorg/admin/dataflows/{dataflowId}/users
     */
    dataflowsGetDataflowUsersAsAdmin: (dataflowId: string, params: RequestParams = {}) =>
      this.request<DataflowUsers, any>({
        path: `/v1.0/myorg/admin/dataflows/${dataflowId}/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description - Reports and datasets don't have to be related. - You can bind a report to a dataset during embedding. - You can only create a report in workspaces specified by the `targetWorkspaces` parameter. > [!IMPORTANT] > This API call is only relevant to the [embed for your customers](/power-bi/developer/embed-sample-for-customers) scenario. To learn more about using this API, see [Considerations when generating an embed token](/power-bi/developer/embedded/generate-embed-token). ## Permissions - When using a service principal for authentication, refer to [Embed Power BI content with service principal](/power-bi/developer/embed-service-principal) and [Considerations and limitations](/power-bi/developer/embedded/embed-service-principal#considerations-and-limitations). - For PowerBI reports with a paginated visual, include the paginated report ID in the API call. For more information, see [example](/rest/api/power-bi/embed-token/generate-token#examples). - This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope All of the following, unless a requirement doesn't apply: - Content.Create, required if a target workspace is specified in [GenerateTokenRequestV2](/rest/api/power-bi/embed-token/generate-token#generatetokenrequestv2). - Report.ReadWrite.All or Report.Read.All, required if a report is specified in [GenerateTokenRequestV2](/rest/api/power-bi/embed-token/generate-token#generatetokenrequestv2). - Report.ReadWrite.All, required if the `allowEdit` flag is specified for at least one report in [GenerateTokenRequestV2](/rest/api/power-bi/embed-token/generate-token#generatetokenrequestv2). - Dataset.ReadWrite.All or Dataset.Read.All ## Limitations - You can only create a report in workspaces specified by the `targetWorkspaces` parameter. - All reports and datasets must reside in a **V2** workspace. - All target workspaces must be **V2** workspaces. - Maximum 50 reports. - Maximum 50 datasets. - Maximum 50 target workspaces. - For Azure Analysis Services or Analysis Services on-premises live connection reports, generating an embed token with row-level security (RLS) might not work for several minutes after a [rebind](/rest/api/power-bi/reports/rebind-report). <br><br>
     *
     * @tags EmbedToken
     * @name EmbedTokenGenerateToken
     * @summary Generates an embed token for multiple reports, datasets, and target workspaces.
     * @request POST:/v1.0/myorg/GenerateToken
     */
    embedTokenGenerateToken: (requestParameters: GenerateTokenRequestV2, params: RequestParams = {}) =>
      this.request<EmbedToken, any>({
        path: `/v1.0/myorg/GenerateToken`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description The query parameter $top is required. ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name AppsGetAppsAsAdmin
     * @summary Returns a list of apps in the organization.
     * @request GET:/v1.0/myorg/admin/apps
     */
    appsGetAppsAsAdmin: (
      query: {
        /**
         * The requested number of entries in the refresh history. If not provided, the default is all available entries.
         * @min 1
         */
        $top: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminApps, any>({
        path: `/v1.0/myorg/admin/apps`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name AppsGetAppUsersAsAdmin
     * @summary Returns a list of users that have access to the specified app.
     * @request GET:/v1.0/myorg/admin/apps/{appId}/users
     */
    appsGetAppUsersAsAdmin: (appId: string, params: RequestParams = {}) =>
      this.request<AppUsers, any>({
        path: `/v1.0/myorg/admin/apps/${appId}/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name UsersGetUserArtifactAccessAsAdmin
     * @summary Returns a list of Power BI items (such as reports or dashboards) that the specified user has access to.
     * @request GET:/v1.0/myorg/admin/users/{userId}/artifactAccess
     */
    usersGetUserArtifactAccessAsAdmin: (
      userId: string,
      query?: {
        /** Token required to get the next chunk of the result set */
        continuationToken?: string;
        /** Comma separated list of artifact types. */
        artifactTypes?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ArtifactAccessResponse, any>({
        path: `/v1.0/myorg/admin/users/${userId}/artifactAccess`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ### Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name UsersGetUserSubscriptionsAsAdmin
     * @summary Returns a list of subscriptions for the specified user. This is a preview API call.
     * @request GET:/v1.0/myorg/admin/users/{userId}/subscriptions
     */
    usersGetUserSubscriptionsAsAdmin: (
      userId: string,
      query?: {
        /** Token required to get the next chunk of the result set */
        continuationToken?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SubscriptionsByUserResponse, any>({
        path: `/v1.0/myorg/admin/users/${userId}/subscriptions`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Provide either a continuation token or both a start and end date time. `StartDateTime` and `EndDateTime` must be in the same UTC day and should be wrapped in single quotes. ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator) or authenticate using a service principal. - Delegated permissions are supported. When running under service prinicipal authentication, an app **must not** have any admin-consent required premissions for Power BI set on it in the Azure portal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All Relevant only when authenticating via a standard delegated admin access token. Must not be present when authentication via a service principal is used. ## Limitations - Maximum 200 requests per hour. - Activity logging isn't supported for Microsoft Cloud Deutschland. <br><br>
     *
     * @tags Admin
     * @name AdminGetActivityEvents
     * @summary Returns a list of audit activity events for a tenant.
     * @request GET:/v1.0/myorg/admin/activityevents
     */
    adminGetActivityEvents: (
      query?: {
        /** Start date and time of the window for audit event results. Must be in ISO 8601 compliant UTC format. */
        startDateTime?: string;
        /** End date and time of the window for audit event results. Must be in ISO 8601 compliant UTC format. */
        endDateTime?: string;
        /** Token required to get the next chunk of the result set */
        continuationToken?: string;
        /** Filters the results based on a boolean condition, using 'Activity', 'UserId', or both properties. Supports only 'eq' and 'and' operators. */
        $filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActivityEventResponse, any>({
        path: `/v1.0/myorg/admin/activityevents`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description For a usage example, see [Set or remove sensitivity labels](/power-bi/admin/service-security-sensitivity-label-inheritance-set-remove-api). ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator). - The admin user must have sufficient [usage rights](/azure/information-protection/configure-usage-rights) to delete labels. ## Required Scope Tenant.ReadWrite.All ## Limitations - Maximum 25 requests per hour. - Each request can update up to 2,000 Power BI items. <br><br>
     *
     * @tags Admin
     * @name InformationProtectionRemoveLabelsAsAdmin
     * @summary Remove sensitivity labels from Power BI items (such as reports or dashboards) by item ID.
     * @request POST:/v1.0/myorg/admin/informationprotection/removeLabels
     */
    informationProtectionRemoveLabelsAsAdmin: (
      artifacts: InformationProtectionArtifactsChangeLabel,
      params: RequestParams = {},
    ) =>
      this.request<InformationProtectionChangeLabelResponse, any>({
        path: `/v1.0/myorg/admin/informationprotection/removeLabels`,
        method: "POST",
        body: artifacts,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description To set a sensitivity label using this API, the admin user or the delegated user (if provided) must have the label included in their [label policy](/microsoft-365/compliance/create-sensitivity-labels?view=o365-worldwide). For a usage example, see [Set or remove sensitivity labels](/power-bi/admin/service-security-sensitivity-label-inheritance-set-remove-api). ## Permissions - The user must have administrator rights (such as Office 365 Global Administrator or Power BI Service Administrator). - The admin user and the delegated user (if provided) must have sufficient [usage rights](/azure/information-protection/configure-usage-rights) to set labels. ## Required Scope Tenant.ReadWrite.All ## Limitations - Maximum 25 requests per hour. - Each request can update up to 2,000 Power BI items. <br><br>
     *
     * @tags Admin
     * @name InformationProtectionSetLabelsAsAdmin
     * @summary Set sensitivity labels on Power BI items (such as reports or dashboards) by item ID.
     * @request POST:/v1.0/myorg/admin/informationprotection/setLabels
     */
    informationProtectionSetLabelsAsAdmin: (
      informationProtectionChangeLabelDetails: InformationProtectionChangeLabelDetails,
      params: RequestParams = {},
    ) =>
      this.request<InformationProtectionChangeLabelResponse, any>({
        path: `/v1.0/myorg/admin/informationprotection/setLabels`,
        method: "POST",
        body: informationProtectionChangeLabelDetails,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have administrator rights or authenticate using a service principal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name PipelinesGetPipelinesAsAdmin
     * @summary Returns a list of deployment pipelines for the organization.
     * @request GET:/v1.0/myorg/admin/pipelines
     */
    pipelinesGetPipelinesAsAdmin: (
      query?: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `users` and `stages`. */
        $expand?: string;
        /** Filters the results based on a boolean condition. This API only supports filtering for [orphaned deployment pipelines](#get-orphaned-deployment-pipelines-example). Unsupported filters will return unfiltered results. */
        $filter?: string;
        /**
         * Returns only the first n results. This parameter must be in the range of 1-5000.
         * @format int32
         * @min 1
         * @max 5000
         */
        $top?: number;
        /**
         * Skips the first n results. Use with top to fetch results beyond the first 5000.
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminPipelines, any>({
        path: `/v1.0/myorg/admin/pipelines`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have administrator rights or authenticate using a service principal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name PipelinesGetPipelineUsersAsAdmin
     * @summary Returns a list of users that have access to a specified deployment pipeline.
     * @request GET:/v1.0/myorg/admin/pipelines/{pipelineId}/users
     */
    pipelinesGetPipelineUsersAsAdmin: (pipelineId: string, params: RequestParams = {}) =>
      this.request<PipelineUsers, any>({
        path: `/v1.0/myorg/admin/pipelines/${pipelineId}/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have administrator rights. ## Required Scope Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name PipelinesUpdateUserAsAdmin
     * @summary Grants user permissions to a specified deployment pipeline.
     * @request POST:/v1.0/myorg/admin/pipelines/{pipelineId}/users
     */
    pipelinesUpdateUserAsAdmin: (pipelineId: string, userDetails: PipelineUser, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/admin/pipelines/${pipelineId}/users`,
        method: "POST",
        body: userDetails,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Permissions The user must have administrator rights. ## Required Scope Tenant.ReadWrite.All ## Limitations Maximum 200 requests per hour. <br><br>
     *
     * @tags Admin
     * @name PipelinesDeleteUserAsAdmin
     * @summary Removes user permissions from a specified deployment pipeline.
     * @request DELETE:/v1.0/myorg/admin/pipelines/{pipelineId}/users/{identifier}
     */
    pipelinesDeleteUserAsAdmin: (pipelineId: string, identifier: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/admin/pipelines/${pipelineId}/users/${identifier}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have administrator rights or authenticate using a service principal. ## Required Scope Tenant.Read.All or Tenant.ReadWrite.All <br><br>
     *
     * @tags Admin
     * @name ProfilesGetProfilesAsAdmin
     * @summary Returns a list of service principal profiles for the organization.
     * @request GET:/v1.0/myorg/admin/profiles
     */
    profilesGetProfilesAsAdmin: (
      query?: {
        /** Filters the results based on a boolean condition, using 'id', 'displayName', or 'servicePrincipalId'. Supports only 'eq' operator. */
        $filter?: string;
        /**
         * Returns only the first n results. This parameter must be in the range of 1-5000.
         * @format int32
         * @min 1
         * @max 5000
         */
        $top?: number;
        /**
         * Skips the first n results. Use with top to fetch results beyond the first 5000.
         * @format int32
         */
        $skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminServicePrincipalProfiles, any>({
        path: `/v1.0/myorg/admin/profiles`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions The user must have administrator rights. ## Required Scope Tenant.ReadWrite.All <br><br>
     *
     * @tags Admin
     * @name ProfilesDeleteProfileAsAdmin
     * @summary Deletes the specified service principal profile.
     * @request DELETE:/v1.0/myorg/admin/profiles/{profileId}
     */
    profilesDeleteProfileAsAdmin: (profileId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/admin/profiles/${profileId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Permissions The caller must use service principal for authentication. For more information, see [Embed Power BI content with service principal](/power-bi/developer/embed-service-principal) and [Considerations and limitations](/power-bi/developer/embedded/embed-service-principal#considerations-and-limitations). ## Limitations - The tenant making this API call *must* own the specified template app. - The template app must either be published to Microsoft AppSource, or, both the ticket creator and the end-user installing with the ticket must have explicit access to the app. - All query parameters in the install ticket *must* be configured. <br><br>
     *
     * @tags TemplateApps
     * @name TemplateAppsCreateInstallTicket
     * @summary Generates an installation ticket for the [automated install flow](/power-bi/connect-data/template-apps-auto-install) of the specified template app.
     * @request POST:/v1.0/myorg/CreateTemplateAppInstallTicket
     */
    templateAppsCreateInstallTicket: (requestParameters: CreateInstallTicketRequest, params: RequestParams = {}) =>
      this.request<InstallTicket, any>({
        path: `/v1.0/myorg/CreateTemplateAppInstallTicket`,
        method: "POST",
        body: requestParameters,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ## Permissions This API call can be called by a service principal profile. For more information see: [Service principal profiles in Power BI Embedded](/power-bi/developer/embedded/embed-multi-tenancy). ## Required Scope Report.ReadWrite.All ## Limitations Only supports paginated reports. <br><br>
     *
     * @tags Reports
     * @name ReportsTakeOverInGroup
     * @summary Transfers ownership of the data sources for the specified paginated report (RDL) to the current authorized user.
     * @request POST:/v1.0/myorg/groups/{groupId}/reports/{reportId}/Default.TakeOver
     */
    reportsTakeOverInGroup: (groupId: string, reportId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/reports/${reportId}/Default.TakeOver`,
        method: "POST",
        ...params,
      }),

    /**
     * @description <br/>Returns a list of profiles that belongs to service principal caller. ## Limitations Can only be called by a service principal.
     *
     * @tags Profiles
     * @name ProfilesGetProfiles
     * @summary Returns a list of service principal profiles.
     * @request GET:/v1.0/myorg/profiles
     */
    profilesGetProfiles: (
      query?: {
        /**
         * Returns only the first n results
         * @format int32
         */
        $top?: number;
        /**
         * Skips the first n results
         * @format int32
         */
        $skip?: number;
        /** Get a profile by DisplayName */
        $filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServicePrincipalProfiles, any>({
        path: `/v1.0/myorg/profiles`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description <br/>Creates a new profile that belongs to service principal caller. ## Limitations Can only be called by a service principal.
     *
     * @tags Profiles
     * @name ProfilesCreateProfile
     * @summary Creates a new service principal profile.
     * @request POST:/v1.0/myorg/profiles
     */
    profilesCreateProfile: (CreateOrUpdateProfileRequest: CreateOrUpdateProfileRequest, params: RequestParams = {}) =>
      this.request<ServicePrincipalProfile, any>({
        path: `/v1.0/myorg/profiles`,
        method: "POST",
        body: CreateOrUpdateProfileRequest,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description <br/>Returns the specified profile if it exists and belongs to service principal caller. ## Limitations Can only be called by a service principal.
     *
     * @tags Profiles
     * @name ProfilesGetProfile
     * @summary Returns the specified service principal profile.
     * @request GET:/v1.0/myorg/profiles/{profileId}
     */
    profilesGetProfile: (profileId: string, params: RequestParams = {}) =>
      this.request<ServicePrincipalProfile, any>({
        path: `/v1.0/myorg/profiles/${profileId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description <br/>Updates the specified profile name if it exists and belongs to service principal caller. ## Limitations Can only be called by a service principal.
     *
     * @tags Profiles
     * @name ProfilesUpdateProfile
     * @summary Updates the specified service principal profile name.
     * @request PUT:/v1.0/myorg/profiles/{profileId}
     */
    profilesUpdateProfile: (
      profileId: string,
      CreateOrUpdateProfileRequest: CreateOrUpdateProfileRequest,
      params: RequestParams = {},
    ) =>
      this.request<ServicePrincipalProfile, any>({
        path: `/v1.0/myorg/profiles/${profileId}`,
        method: "PUT",
        body: CreateOrUpdateProfileRequest,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description <br/>Deletes the specified profile if it exists and belongs to service principal caller. ## Limitations Can only be called by a service principal.
     *
     * @tags Profiles
     * @name ProfilesDeleteProfile
     * @summary Deletes the specified service principal profile.
     * @request DELETE:/v1.0/myorg/profiles/{profileId}
     */
    profilesDeleteProfile: (profileId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/profiles/${profileId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.Read.All or Dataset.ReadWrite.All <br><br>
     *
     * @tags Scorecards_(Preview)
     * @name ScorecardsPreviewGet
     * @summary Returns a list of scorecards from a workspace.
     * @request GET:/v1.0/myorg/groups/{groupId}/scorecards
     */
    scorecardsPreviewGet: (
      groupId: string,
      query?: {
        /**
         * Returns only the first n results.
         * @format int32
         */
        $top?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Scorecards, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Scorecards_(Preview)
     * @name ScorecardsPreviewPost
     * @summary Creates a new scorecard.
     * @request POST:/v1.0/myorg/groups/{groupId}/scorecards
     */
    scorecardsPreviewPost: (groupId: string, scorecard: ScorecardCreateRequest, params: RequestParams = {}) =>
      this.request<Scorecard, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards`,
        method: "POST",
        body: scorecard,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.Read.All or Dataset.ReadWrite.All <br><br>
     *
     * @tags Scorecards_(Preview)
     * @name ScorecardsPreviewGetById
     * @summary Returns a scorecard with ID.
     * @request GET:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})
     */
    scorecardsPreviewGetById: (
      groupId: string,
      scorecardId: string,
      query?: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `goals`, `goalValues`, `aggregations`, and `notes`. */
        $expand?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Scorecard, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Scorecards_(Preview)
     * @name ScorecardsPreviewPatchById
     * @summary Updates a scorecard by its ID
     * @request PATCH:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})
     */
    scorecardsPreviewPatchById: (
      groupId: string,
      scorecardId: string,
      scorecard: Scorecard,
      params: RequestParams = {},
    ) =>
      this.request<Scorecard, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})`,
        method: "PATCH",
        body: scorecard,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Scorecards_(Preview)
     * @name ScorecardsPreviewDeleteById
     * @summary Deletes a scorecard by its ID.
     * @request DELETE:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})
     */
    scorecardsPreviewDeleteById: (groupId: string, scorecardId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.Read.All or Dataset.ReadWrite.All <br><br>
     *
     * @tags Goals_(Preview)
     * @name GoalsPreviewGet
     * @summary Returns a list of goals from a scorecard.
     * @request GET:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals
     */
    goalsPreviewGet: (
      groupId: string,
      scorecardId: string,
      query?: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `goalValues` and `aggregations`. */
        $expand?: string;
        /** Allows the clients to select specific properties from the server. */
        $select?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Goals, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Goals_(Preview)
     * @name GoalsPreviewPost
     * @summary Adds a new goal to a scorecard.
     * @request POST:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals
     */
    goalsPreviewPost: (groupId: string, scorecardId: string, goal: GoalCreateRequest, params: RequestParams = {}) =>
      this.request<Goal, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals`,
        method: "POST",
        body: goal,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.Read.All or Dataset.ReadWrite.All <br><br>
     *
     * @tags Goals_(Preview)
     * @name GoalsPreviewGetById
     * @summary Returns a goal by ID from a scorecard.
     * @request GET:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})
     */
    goalsPreviewGetById: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      query?: {
        /** description */
        expand?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Goal, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Goals_(Preview)
     * @name GoalsPreviewPatchById
     * @summary Updates a goal by ID.
     * @request PATCH:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})
     */
    goalsPreviewPatchById: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      goal: Goal,
      params: RequestParams = {},
    ) =>
      this.request<Goal, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})`,
        method: "PATCH",
        body: goal,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Goals_(Preview)
     * @name GoalsPreviewDeleteById
     * @summary Deletes a goal from a scorecard by goal ID.
     * @request DELETE:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})
     */
    goalsPreviewDeleteById: (groupId: string, scorecardId: string, goalId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.Read.All or Dataset.ReadWrite.All <br><br>
     *
     * @tags GoalsStatusRules_(Preview)
     * @name GoalsStatusRulesPreviewGet
     * @summary Returns status rules of a goal.
     * @request GET:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/statusRules
     */
    goalsStatusRulesPreviewGet: (groupId: string, scorecardId: string, goalId: string, params: RequestParams = {}) =>
      this.request<GoalsRulesGoalStatusRules, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/statusRules`,
        method: "GET",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags GoalsStatusRules_(Preview)
     * @name GoalsStatusRulesPreviewPost
     * @summary Creates or updates status rules of a goal.
     * @request POST:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/statusRules
     */
    goalsStatusRulesPreviewPost: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      statusRulesUpdateRequest: GoalsRulesGoalStatusRulesUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<GoalsRulesGoalStatusRules, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/statusRules`,
        method: "POST",
        body: statusRulesUpdateRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags GoalsStatusRules_(Preview)
     * @name GoalsStatusRulesPreviewDelete
     * @summary Removes status rule definitions from a goal.
     * @request DELETE:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/statusRules
     */
    goalsStatusRulesPreviewDelete: (groupId: string, scorecardId: string, goalId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/statusRules`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.Read.All or Dataset.ReadWrite.All <br><br>
     *
     * @tags GoalValues_(Preview)
     * @name GoalValuesPreviewGet
     * @summary Reads goal value check-ins.
     * @request GET:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/goalValues
     */
    goalValuesPreviewGet: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      query?: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `notes`. */
        $expand?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GoalValues, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/goalValues`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags GoalValues_(Preview)
     * @name GoalValuesPreviewPost
     * @summary Creates a new goal value check-in.
     * @request POST:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/goalValues
     */
    goalValuesPreviewPost: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      goalValue: GoalValueCreateRequest,
      params: RequestParams = {},
    ) =>
      this.request<GoalValue, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/goalValues`,
        method: "POST",
        body: goalValue,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.Read.All or Dataset.ReadWrite.All <br><br>
     *
     * @tags GoalValues_(Preview)
     * @name GoalValuesPreviewGetById
     * @summary Reads a goal value check-in by a UTC date timestamp.
     * @request GET:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/goalValues({timestamp})
     */
    goalValuesPreviewGetById: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      timestamp: string,
      query?: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `notes`. */
        $expand?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GoalValue, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/goalValues(${timestamp})`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags GoalValues_(Preview)
     * @name GoalValuesPreviewPatchById
     * @summary Updates a goal value check-in by a UTC date timestamp.
     * @request PATCH:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/goalValues({timestamp})
     */
    goalValuesPreviewPatchById: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      timestamp: string,
      goalValue: GoalValue,
      params: RequestParams = {},
    ) =>
      this.request<GoalValue, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/goalValues(${timestamp})`,
        method: "PATCH",
        body: goalValue,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags GoalValues_(Preview)
     * @name GoalValuesPreviewDeleteById
     * @summary Deletes a goal value check-in by a UTC day timestamp.
     * @request DELETE:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/goalValues({timestamp})
     */
    goalValuesPreviewDeleteById: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      timestamp: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/goalValues(${timestamp})`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags GoalNotes_(Preview)
     * @name GoalNotesPreviewPost
     * @summary Adds a new note to a goal value check-in.
     * @request POST:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/goalValues({timestamp})/notes
     */
    goalNotesPreviewPost: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      timestamp: string,
      goalNote: GoalNoteRequest,
      params: RequestParams = {},
    ) =>
      this.request<GoalNote, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/goalValues(${timestamp})/notes`,
        method: "POST",
        body: goalNote,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags GoalNotes_(Preview)
     * @name GoalNotesPreviewPatchById
     * @summary Updates a goal value check-in note by ID.
     * @request PATCH:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/goalValues({timestamp})/notes({noteId})
     */
    goalNotesPreviewPatchById: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      timestamp: string,
      noteId: string,
      goalNote: GoalNoteRequest,
      params: RequestParams = {},
    ) =>
      this.request<GoalNote, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/goalValues(${timestamp})/notes(${noteId})`,
        method: "PATCH",
        body: goalNote,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags GoalNotes_(Preview)
     * @name GoalNotesPreviewDeleteById
     * @summary Deletes a goal value check-in note by ID.
     * @request DELETE:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/goalValues({timestamp})/notes({noteId})
     */
    goalNotesPreviewDeleteById: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      timestamp: string,
      noteId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/goalValues(${timestamp})/notes(${noteId})`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.Read.All or Dataset.ReadWrite.All <br><br>
     *
     * @tags Scorecards_(Preview)
     * @name ScorecardsPreviewGetScorecardByReportId
     * @summary Reads a scorecard associated with an internal report ID.
     * @request GET:/v1.0/myorg/groups/{groupId}/scorecards/GetScorecardByReportId(reportId={reportId})
     */
    scorecardsPreviewGetScorecardByReportId: (
      groupId: string,
      reportId: string,
      query?: {
        /** Accepts a comma-separated list of data types, which will be expanded inline in the response. Supports `goals`, `goalValues`, and `aggregations`. */
        $expand?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Scorecard, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards/GetScorecardByReportId(reportId=${reportId})`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Scorecards_(Preview)
     * @name ScorecardsPreviewMoveGoals
     * @summary Moves goals within the scorecard. Changes their ranks and parents.
     * @request POST:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/MoveGoals()
     */
    scorecardsPreviewMoveGoals: (
      groupId: string,
      scorecardId: string,
      moveGoalsRequest: GoalsMoveRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/MoveGoals()`,
        method: "POST",
        body: moveGoalsRequest,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.Read.All or Dataset.ReadWrite.All <br><br>
     *
     * @tags Goals_(Preview)
     * @name GoalsPreviewGetRefreshHistory
     * @summary Reads refresh history of a connected goal.
     * @request GET:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/GetRefreshHistory()
     */
    goalsPreviewGetRefreshHistory: (groupId: string, scorecardId: string, goalId: string, params: RequestParams = {}) =>
      this.request<GoalRefreshHistories, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/GetRefreshHistory()`,
        method: "GET",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Goals_(Preview)
     * @name GoalsPreviewDeleteGoalCurrentValueConnection
     * @summary Disconnects the current value of a goal.
     * @request POST:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/DeleteGoalCurrentValueConnection()
     */
    goalsPreviewDeleteGoalCurrentValueConnection: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      params: RequestParams = {},
    ) =>
      this.request<Goal, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/DeleteGoalCurrentValueConnection()`,
        method: "POST",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Goals_(Preview)
     * @name GoalsPreviewDeleteGoalTargetValueConnection
     * @summary Disconnects the target value of a goal.
     * @request POST:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/DeleteGoalTargetValueConnection()
     */
    goalsPreviewDeleteGoalTargetValueConnection: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      params: RequestParams = {},
    ) =>
      this.request<Goal, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/DeleteGoalTargetValueConnection()`,
        method: "POST",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Goals_(Preview)
     * @name GoalsPreviewRefreshGoalCurrentValue
     * @summary Schedules a refresh of the connected value of a goal.
     * @request POST:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/RefreshGoalCurrentValue()
     */
    goalsPreviewRefreshGoalCurrentValue: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/RefreshGoalCurrentValue()`,
        method: "POST",
        ...params,
      }),

    /**
     * @description ## Required Scope Dataset.ReadWrite.All <br><br>
     *
     * @tags Goals_(Preview)
     * @name GoalsPreviewRefreshGoalTargetValue
     * @summary Schedules a refresh of the target value of a goal.
     * @request POST:/v1.0/myorg/groups/{groupId}/scorecards({scorecardId})/goals({goalId})/RefreshGoalTargetValue()
     */
    goalsPreviewRefreshGoalTargetValue: (
      groupId: string,
      scorecardId: string,
      goalId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1.0/myorg/groups/${groupId}/scorecards(${scorecardId})/goals(${goalId})/RefreshGoalTargetValue()`,
        method: "POST",
        ...params,
      }),
  };
}
