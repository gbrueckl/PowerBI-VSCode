import { ThisExtension } from "../../ThisExtension";

export async function startExternalProcess(executable: string, args: string[]): Promise<void> {
	ThisExtension.log(`Starting external process ${executable} with args ${args.join(' ')}`);
	var execFile = require('child_process').execFile;
	var process = execFile(executable, args);
	ThisExtension.log(`External process started!`);
}