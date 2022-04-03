import { logger, type LoggerFnOptions } from '../console/logger';
import { promises as fs_async } from 'fs';
import { PathFnParams } from './path';
const { readFile } = fs_async;

export type GetFileStrParams = PathFnParams;
async function getFileStr(
	params: GetFileStrParams & LoggerFnOptions,
): Promise<string> {
	try {
		return await readFile(params.path, 'utf-8');
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}

export default getFileStr;
