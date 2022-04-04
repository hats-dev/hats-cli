import { PathConfig } from '../../constants/configs';

export function getCwd() {
	return process.cwd();
}
export const getParentDirPath = getCwd;

export type GetRootDirPathParams = PathConfig;
export function getRootDirPath(params: GetRootDirPathParams) {
	return `${getParentDirPath()}/${params.root_dir_name}`;
}

export type PathFnParams = { path: string };
