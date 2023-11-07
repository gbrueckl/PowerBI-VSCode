// just a dummy - should actually never be called in the web extensions as all commands are disabled there
export const getPort = async (port: number): Promise<number> => {
	return port;
};