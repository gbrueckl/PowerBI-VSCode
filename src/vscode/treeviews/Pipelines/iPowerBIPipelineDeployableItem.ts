export interface iPowerBIPipelineDeployableItem {
	artifactIds: {sourceId: string}[];
	artifactType: string;

	getDeployableItems(): Promise<{[key: string]: {sourceId: string}[]}>;
}