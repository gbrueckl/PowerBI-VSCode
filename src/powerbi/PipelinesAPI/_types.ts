import { UniqueId } from "../../helpers/Helper";
import { ApiItemType } from "../../vscode/treeviews/_types";

export function resolveOrder(order: number | string): string {
	switch (order) {
		case 0:
		case "0":
			return "Development";

		case 1:
		case "1":
			return "Test";

		case 2:
		case "2":
			return "Production";

		default:
			return "NO_NAME_DEFINED";
	}
}

export function resolveOrderShort(order: number | string): string {
	switch (order) {
		case 0:
		case "0":
			return "DEV";

		case 1:
		case "1":
			return "TEST";

		case 2:
		case "2":
			return "PROD";

		default:
			return "NO_NAME_DEFINED";
	}
}

export type PipelineStageArtifact = 
| 	"PIPELINESTAGEDASHBOARD"
| 	"PIPELINESTAGEDATAFLOW"
| 	"PIPELINESTAGEDATAMART"
|	"PIPELINESTAGEDATASET"
|	"PIPELINESTAGEREPORT" 
| 	"PIPELINESTAGEDASHBOARDS"
| 	"PIPELINESTAGEDATAFLOWS"
| 	"PIPELINESTAGEDATAMARTS"
|	"PIPELINESTAGEDATASETS"
|	"PIPELINESTAGEREPORTS" 
;

export interface iPowerBIPipelineStage {
	/* from iPowerBIApiItem */
	itemType: ApiItemType;
	uid: UniqueId;
	id?: string;
	name: string;

	/* new properties */
	order: number;
	workspaceId: string;
	workspaceName: string;
}

export interface iPowerBIPipelineOperationStep {
	index: number;
	type: string;
	status: string;
	preDeploymentDiffState: string;
	sourceAndTarget: {
		source: string;
		sourceDisplayName: string;
		type: string;
		target: string;
		targetDisplayName: string;
	};
}
export interface iPowerBIPipelineOperation {
	/* from iPowerBIApiItem */
	itemType: ApiItemType;
	uid: UniqueId;
	id?: string;
	name: string;

	/* new properties */
	type: string;
	status: string
	lastUpdatedTime: Date;
	executionStartTime: Date;
	executionEndTime: Date;
	sourceStageOrder: number;
	targetStageOrder: number;
	executionPlan: {
		"Steps": iPowerBIPipelineOperationStep[]
	};
	note: {
		content: string;
		isTruncated: boolean;
	};
	preDeploymentDiffInformation: {
		newArtifactsCount: number;
		differentArtifactsCount: number;
		noDifferenceArtifactsCount: number;
	};
	performedBy: {
		userPrincipalName: string;
		principalType: string;
	};
}

export interface iPowerBIPipelineStageArtifact {
	artifactId: string;
	artifactName: string;
	artifactDisplayName: string;
	sourceArtifactId?: string;
	targetArtifactId?: string;
	lastDeploymentTime?: Date;
}

export interface iPowerBIPipelineStageArtifacts {
	dataflows?: iPowerBIPipelineStageArtifact[];
	datamarts?: iPowerBIPipelineStageArtifact[];
	datasets?: iPowerBIPipelineStageArtifact[];
	reports?: iPowerBIPipelineStageArtifact[];
	dashboards?: iPowerBIPipelineStageArtifact[];
}

export interface iPowerBIPipeline {
	/* from iPowerBIApiItem */
	itemType: ApiItemType;
	uid: UniqueId;
	id?: string;
	name: string;

	/* new properties */
	displayName: string;
	stages: iPowerBIPipelineStage[];
}