import { tasklist } from 'tasklist';
import { LocalProcess } from '../_types';
import {pidToPorts} from 'pid-port';

export async function getLocalInstances(): Promise<any> {
	const localProcess = await getMsdmsrvTasks();
	const pids = localProcess.map((task) => task.pid);

	const ports = await pidToPorts(pids);
}

async function getMsdmsrvTasks(): Promise<LocalProcess[]> {
	return new Promise((resolve, reject) => {
		tasklist().then((tasks) => {
			const msmdsrvTasks = tasks.filter((task) => {
				return task.imageName === 'msmdsrv.exe';
			});
			resolve(msmdsrvTasks);
		}).catch((err) => {
			reject(err);
		});
	});
}