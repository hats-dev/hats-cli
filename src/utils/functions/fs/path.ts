import { HatsConfig } from '../../constants/configs';

export function getCwd() {
	return process.cwd();
}

export type GetProjectRootParams = Pick<HatsConfig, 'paths_root_folder'>;
export function getProjectRoot(params: GetProjectRootParams) {
	return `${getCwd()}/${params.paths_root_folder}`;
}

export type PathFnParams = { path: string };
