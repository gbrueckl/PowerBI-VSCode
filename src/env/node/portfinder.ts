const portfinder = require('portfinder');

export const getPort = async (port: number): Promise<number> => {
	portfinder.setBasePort(port);
	return portfinder.getPortPromise();
};