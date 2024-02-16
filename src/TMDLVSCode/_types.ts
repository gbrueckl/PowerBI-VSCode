export interface ProxyRequest {
	connectionString: string;
	vscodeAccessToken?: string;
}

export interface DeploymentResult {
	success: boolean;
	connectionString: string;
}