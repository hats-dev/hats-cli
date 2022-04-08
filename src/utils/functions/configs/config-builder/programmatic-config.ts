import { capitalCase } from 'change-case';
import { O } from '../../../ts/sets';
import { LocalProgramParams } from '../../shell/which';
import { licenses } from '../persistent-sources/system-default-constants/licenses';
import { Config, ProgrammaticSourceConfig } from '../types';

type GetModuleDisplayNameParams = {
	prev_config: Pick<Config, 'HATS_MODULE_NAME'>;
};
export function getModuleDisplayName(params: GetModuleDisplayNameParams) {
	const {
		prev_config: { HATS_MODULE_NAME: str },
	} = params;
	let display_name = capitalCase(str.slice());
	const language_casing = {
		Typescript: 'TypeScript',
		Ts: 'TS',
		Javascript: 'JavaScript',
		Js: 'JS',
	} as const;
	O.keys(language_casing).forEach((k) => {
		display_name = display_name.replace(
			new RegExp(`${k}`, 'g'),
			language_casing[k],
		);
	});
	return display_name;
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
		HATS_MODULE_DISPLAY_NAME: getModuleDisplayName(params),
		HATS_RUNTIME_ROOT_DIR_NAME: prev_config['HATS_MODULE_NAME'],
	};
}
