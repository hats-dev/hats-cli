import { LocalProgramParams } from '../../shell/which';
import { licenses } from '../persistent-sources/system-default-constants/licenses';
import { Config, ProgrammaticSourceConfig } from '../types';
import { getDisplayName } from './format-display-names';

export type GetProgrammaticConfigParams = LocalProgramParams &
	Pick<
		Config,
		'HATS_GITHUB_USERNAME' | 'HATS_LICENSE_NAME' | 'HATS_MODULE_NAME'
	>;
export function getProgrammaticConfig(
	params: GetProgrammaticConfigParams,
): ProgrammaticSourceConfig {
	const { HATS_GITHUB_USERNAME: gh_username, HATS_MODULE_NAME: module_name } =
		params;
	return {
		HATS_AUTHOR_CONTACT: gh_username.length
			? `https://github.com/${gh_username}`
			: '',
		HATS_LICENSE_BODY: licenses[params['HATS_LICENSE_NAME']],
		HATS_LICENSE_YEAR: new Date().getFullYear().toString(),
		HATS_MODULE_DISPLAY_NAME: getDisplayName({ str: module_name }),
		HATS_RUNTIME_ROOT_DIR_NAME: params['HATS_MODULE_NAME'],
	};
}
