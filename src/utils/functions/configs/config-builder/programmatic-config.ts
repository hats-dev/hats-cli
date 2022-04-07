import { capitalCase } from 'change-case';
import { LocalProgramParams } from '../../shell/which';
import { licenses } from '../persistent-sources/system-default-constants/licenses';
import { Config, ProgrammaticSourceConfig } from '../types';

function formatCasing(str: string) {
	let next = str.slice();
	const r = {
		Typescript: 'TypeScript',
		Javascript: 'JavaScript',
	} as const;
	type S = ['Typescript', 'Javascript'];
	const specials: S = ['Typescript', 'Javascript'];
	specials.forEach((special) => {
		next = next.replace(new RegExp(`${special}`, 'g'), r[special]);
	});
	return next;
}

export type GetProgrammaticConfigParams = {
	prev_config: Pick<
		Config,
		'HATS_GITHUB_USERNAME' | 'HATS_LICENSE_NAME' | 'HATS_MODULE_NAME'
	>;
} & LocalProgramParams;
export function getProgrammaticConfig(
	params: GetProgrammaticConfigParams,
): ProgrammaticSourceConfig {
	const { prev_config } = params;
	const { HATS_GITHUB_USERNAME: gh_username } = prev_config;
	return {
		HATS_AUTHOR_CONTACT: gh_username.length
			? `https://github.com/${gh_username}`
			: '',
		HATS_LICENSE_BODY: licenses[prev_config['HATS_LICENSE_NAME']],
		HATS_LICENSE_YEAR: new Date().getFullYear().toString(),
		HATS_MODULE_DISPLAY_NAME: formatCasing(
			capitalCase(prev_config['HATS_MODULE_NAME']),
		),
		HATS_RUNTIME_ROOT_DIR_NAME: prev_config['HATS_MODULE_NAME'],
	};
}
