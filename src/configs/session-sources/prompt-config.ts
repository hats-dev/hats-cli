import inquirer from 'inquirer';
import { EmptyObject } from '../../ts/objects';
import { O } from '../../ts/sets';
import { LoggerFnOptions } from '../../console/logger';
import { GithubRepoAccessType } from '../../shell/git';
import { getDisplayName } from '../config-builder/format-display-names';
import { LicenseNameType } from '../persistent-sources/system-default-constants/licenses';
import {
	ArrayConfigs,
	Config,
	configs,
	ConfigsFromPrompt,
	GithubRepoAccessConfig,
	isArrayConfigs,
	isConfigsFromPrompt,
	LicenseNameConfig,
	PromptSourceConfig,
} from '../types';

function getPromptMessage({ config }: { config: ConfigsFromPrompt }): string {
	const prompt_messages: Partial<Record<ConfigsFromPrompt, string>> = {
		HATS_AUTHOR_CONTACT: `Author Contact Info (Appears in Package Metadata)`,
		HATS_GITHUB_REPO: 'Github Repository Name',
		HATS_PATHS_BUILD_DIR_PATH: 'Build Directory Path',
		HATS_PATHS_MAIN_MODULE_PATH: 'Main Module Path',
		HATS_PATHS_TS_BUILD_ROOT_DIR_PATH:
			'TypeScript Root Directory (tsconfig-build.json > rootDir)',
		HATS_PATHS_TS_BUILD_EXLUDE_PATHS:
			'TypeScript Exclude Glob(s) (tsconfig-build.json > exclude)',
		HATS_PATHS_TYPES_DTS_PATH: 'Main Types Declaration Path',
		HATS_RUNTIME_ROOT_DIR_NAME: 'Local Directory Name (on your machine)',
		HATS_SCRIPTS_CHANGELOG:
			'Changelog Automation Script (package.json > scripts)',
		HATS_SCRIPTS_DEPLOY: 'Deploy Script (package.json > scripts)',
		HATS_SCRIPTS_MD_TOC:
			'Update *.md Table of Contents Script (package.json > scripts)',
	};
	return (
		prompt_messages[config] ||
		getDisplayName({ str: config }) +
			(isArrayConfigs(config) ? ' (comma separated)' : '')
	);
}

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
							message: getPromptMessage({ config }),
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
							message: getPromptMessage({ config }),
							type: 'list',
						},
					};
				}
				default: {
					return {
						...acc,
						[config]: {
							default: params[config],
							message: getPromptMessage({ config }),
						},
					};
				}
			}
		}, {});
}

function formatArrayAnswer({
	answer,
}: {
	answer: string | string[] | undefined;
}): string[] {
	return typeof answer === 'string' ? answer.split(',') : answer || [];
}
type PromptAnswers = {
	[K in ConfigsFromPrompt]?: K extends ArrayConfigs
		? string | string[]
		: Config[K];
};
export type GetPromptSourceConfigParams = Partial<Config> & LoggerFnOptions;
export async function getPromptSourceConfig(
	params: GetPromptSourceConfigParams,
): Promise<Partial<PromptSourceConfig>> {
	const prompts = getPrompts(params);
	const answers = await inquirer.prompt<PromptAnswers>(
		O.keys(prompts).map((k) => ({
			name: k,
			...prompts[k],
		})),
	);
	const { HATS_MODULE_KEYWORDS, HATS_PATHS_TS_BUILD_EXLUDE_PATHS } = answers;
	return {
		...answers,
		HATS_MODULE_KEYWORDS: formatArrayAnswer({ answer: HATS_MODULE_KEYWORDS }),
		HATS_PATHS_TS_BUILD_EXLUDE_PATHS: formatArrayAnswer({
			answer: HATS_PATHS_TS_BUILD_EXLUDE_PATHS,
		}),
	};
}
