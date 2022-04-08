import { constants as fs_constants, promises as fs_async } from 'fs';
import { safeParse } from '../../../ts/objects';
import { logger, LoggerFnOptions } from '../../console/logger';
import getFileStr from '../../fs/reads';
import writeStrToFile from '../../fs/writes';
import exec from '../../node/exec';
import { UserDefaultSourceConfig } from '../types';

export type DebugConfigFile = { debug_file?: boolean };
export type GetHomeConfigPathParams = DebugConfigFile & LoggerFnOptions;
export async function getHomeConfigPath(
	params: GetHomeConfigPathParams,
): Promise<string> {
	try {
		const { stdout: home_dir } = await exec('echo ~');
		return `${home_dir.replace('\n', '')}/.hats${
			params.debug_file === true ? '-debug' : ''
		}.json`;
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}

export async function getUserDefaultSourceConfig(
	params: GetHomeConfigPathParams,
): Promise<Partial<UserDefaultSourceConfig>> {
	try {
		const config_path = await getHomeConfigPath(params);
		await fs_async.access(config_path, fs_constants.F_OK);
		const str = await getFileStr({ path: config_path });
		return safeParse({ str });
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}

export type SaveUserDefaultSourceConfigParams = GetHomeConfigPathParams & {
	merge_config: Partial<UserDefaultSourceConfig>;
};
export async function saveUserDefaultSourceConfig(
	params: SaveUserDefaultSourceConfigParams,
): Promise<Partial<UserDefaultSourceConfig>> {
	try {
		const [path, prev_config] = (await Promise.all(
			[getHomeConfigPath, getUserDefaultSourceConfig].map((fn) => fn(params)),
		)) as [
			Awaited<Promise<ReturnType<typeof getHomeConfigPath>>>,
			Awaited<Promise<ReturnType<typeof getUserDefaultSourceConfig>>>,
		];
		const next = {
			...prev_config,
			...params.merge_config,
		};
		await writeStrToFile({
			path,
			str: JSON.stringify(next, null, '\t'),
		});
		return next;
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}
