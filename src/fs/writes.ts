import { logger, type LoggerFnOptions } from '../console/logger';
import { promises as fs_async } from 'fs';
import { PathFnParams } from './path';
const { writeFile } = fs_async;

export type WriteStrToFileParams = PathFnParams & { str: string };
async function writeStrToFile(
	params: WriteStrToFileParams & LoggerFnOptions,
): Promise<void> {
	try {
		await writeFile(params.path, params.str);
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}
export default writeStrToFile;
