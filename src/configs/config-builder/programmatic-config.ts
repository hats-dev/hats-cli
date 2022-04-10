import { LocalProgramParams } from '../../shell/which';
import { licenses } from '../persistent-sources/system-default-constants/licenses';
import { Config, ProgrammaticSourceConfig } from '../types';
import { getDisplayName } from './format-display-names';

export type GetProgrammaticConfigParams = LocalProgramParams & Config;
export function getProgrammaticConfig(
	params: GetProgrammaticConfigParams,
): ProgrammaticSourceConfig {
	const {
		HATS_AUTHOR_CONTACT: author_contact,
		HATS_GITHUB_ORG_USERNAME: github_org_username,
		HATS_GITHUB_USERNAME: github_username,
		HATS_LICENSE_BODY: license_body,
		HATS_LICENSE_NAME: license_name,
		HATS_MODULE_NAME: module_display_name,
	} = params;
	return {
		HATS_AUTHOR_CONTACT:
			author_contact ||
			(github_username ? `https://github.com/${github_username}` : ''),
		HATS_GITHUB_ORG_USERNAME: github_org_username || github_username,
		HATS_GITHUB_REPO: module_display_name,
		HATS_LICENSE_BODY: license_body || licenses[license_name],
		HATS_LICENSE_YEAR: new Date().getFullYear().toString(),
		HATS_MODULE_DISPLAY_NAME: getDisplayName({ str: module_display_name }),
		HATS_RUNTIME_ROOT_DIR_NAME: module_display_name,
	};
}
