import { Config } from '../configs/types';

export function getCwd() {
	return process.cwd();
}
export const getParentDirPath = getCwd;

export type GetRootDirPathParams = Pick<Config, 'HATS_RUNTIME_ROOT_DIR_NAME'>;
export function getRootDirPath(params: GetRootDirPathParams) {
	return `${getParentDirPath()}/${params['HATS_RUNTIME_ROOT_DIR_NAME']}`;
}

export type PathFnParams = { path: string };
