import { DebugConfigs, ConfigType, RUNTIME } from '../hats/configs';

export function getCwd() {
	return process.cwd();
}
export const getParentDirPath = getCwd;

export type GetRootDirPathParams = DebugConfigs;
export function getRootDirPath(params: GetRootDirPathParams) {
	return `${getParentDirPath()}/${
		params[ConfigType.RUNTIME][RUNTIME.ROOT_DIR_NAME]
	}`;
}

export type PathFnParams = { path: string };
