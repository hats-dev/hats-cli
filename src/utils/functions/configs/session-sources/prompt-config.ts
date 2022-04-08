import inquirer from 'inquirer';
import { EmptyObject } from '../../../ts/objects';
import { O } from '../../../ts/sets';
import { LoggerFnOptions } from '../../console/logger';
import { GithubRepoAccessType } from '../../shell/git';
import { getDisplayName } from '../config-builder/format-display-names';
import { LicenseNameType } from '../persistent-sources/system-default-constants/licenses';
import {
	Config,
	configs,
	ConfigsFromPrompt,
	GithubRepoAccessConfig,
	isConfigsFromPrompt,
	LicenseNameConfig,
	PromptSourceConfig,
} from '../types';

type PromptData<K extends ConfigsFromPrompt> = {
	default?: Config[K];
	message: string;
} & (K extends GithubRepoAccessConfig | LicenseNameConfig
	? {
			choices: Config[K][];
			type: 'list';
	  }
	: typeof EmptyObject);
type Prompts = {
	[K in ConfigsFromPrompt]?: PromptData<K>;
};
export function getPrompts(params: GetPromptSourceConfigParams): Prompts {
	return configs
		.filter(isConfigsFromPrompt)
		.reduce(function (acc: Prompts, config) {
			switch (config) {
				case 'HATS_GITHUB_REPO_ACCESS': {
					return {
						...acc,
						[config]: {
							choices: O.keys(GithubRepoAccessType).map(
								(k) => GithubRepoAccessType[k],
							),
							default: params[config],
							message: getDisplayName({ str: config }),
							type: 'list',
						},
					};
				}
				case 'HATS_LICENSE_NAME': {
					return {
						...acc,
						[config]: {
							choices: O.keys(LicenseNameType).map((k) => LicenseNameType[k]),
							default: params[config],
							message: getDisplayName({ str: config }),
							type: 'list',
						},
					};
				}
				default: {
					return {
						...acc,
						[config]: {
							default: params[config],
							message: getDisplayName({ str: config }),
						},
					};
				}
			}
		}, {});
}

export type GetPromptSourceConfigParams = Partial<Config> & LoggerFnOptions;
export async function getPromptSourceConfig(
	params: GetPromptSourceConfigParams,
): Promise<Partial<PromptSourceConfig>> {
	const prompts = getPrompts(params);
	return await inquirer.prompt<Partial<PromptSourceConfig>>(
		O.keys(prompts).map((k) => ({
			name: k,
			...prompts[k],
		})),
	);
}
