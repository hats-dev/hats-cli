import { LoggerFnOptions } from '../../console/logger';
import { LocalProgramParams } from '../../shell/which';
import { UserDefaultSourceConfig } from '../types';

// TODO
export type GetUserDefaultSourceConfigParams = LocalProgramParams &
	LoggerFnOptions;
export async function getUserDefaultSourceConfig(
	params: GetUserDefaultSourceConfigParams,
): Promise<UserDefaultSourceConfig> {
	params;
	return Promise.resolve({
		// "HATS_AUTHOR_NAME": "",
		// "HATS_GITHUB_ORG_USERNAME": "",
		// "HATS_GITHUB_REPO": "",
		// "HATS_GITHUB_REPO_ACCESS": GithubRepoAccessType.private,
		// "HATS_GITHUB_USERNAME": "",
		// "HATS_LICENSE_NAME": LicenseNameType["BSD-3-Clause"],
		// "HATS_MODULE_DESCRIPTION": "",
		// "HATS_MODULE_KEYWORDS": [],
		// "HATS_PATHS_BUILD_DIR_PATH": "",
		// "HATS_PATHS_MAIN_MODULE_PATH": "",
		// "HATS_PATHS_TS_BUILD_ROOT_DIR_PATH": "",
		// "HATS_PATHS_TS_BUILD_EXLUDE_PATHS": [],
		// "HATS_PATHS_TYPES_DTS_PATH": "",
		// "HATS_SCRIPTS_CHANGELOG": "",
		// "HATS_SCRIPTS_DEPLOY": "",
		// "HATS_SCRIPTS_MD_TOC": ""
	});
}

// TODO
export function saveUserDefaultSourceConfig(): void {
	return;
}
