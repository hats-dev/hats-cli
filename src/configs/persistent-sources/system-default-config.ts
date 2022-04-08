import { exact } from '../../ts/objects';
import { GithubRepoAccessType } from '../../shell/git';
import { LocalProgramParams } from '../../shell/which';
import { SystemDefaultSourceConfig } from '../types';
import { default_license_name } from './system-default-constants/licenses';
import { getDefaultScripts } from './system-default-constants/scripts';

type Rt = ReturnType<typeof getSystemDefaultSourceConfig>;
type GetSystemDefaultSourceConfigParams = LocalProgramParams;
export function getSystemDefaultSourceConfig(
	params: GetSystemDefaultSourceConfigParams,
): SystemDefaultSourceConfig {
	return exact<Rt>()<Rt>({
		HATS_GITHUB_REPO_ACCESS: GithubRepoAccessType.private,
		HATS_LICENSE_NAME: default_license_name,
		HATS_MODULE_KEYWORDS: ['typescript'],
		HATS_PATHS_BUILD_DIR_PATH: 'dist/',
		HATS_PATHS_MAIN_MODULE_PATH: 'dist/index.js',
		HATS_PATHS_TS_BUILD_ROOT_DIR_PATH: './src',
		HATS_PATHS_TS_BUILD_EXLUDE_PATHS: ['tests', 'src/**/*.test.ts'],
		HATS_PATHS_TYPES_DTS_PATH: 'dist/index.d.ts',
		...getDefaultScripts(params),
	});
}
