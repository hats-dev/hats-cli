import { Ext } from '../../ts/sets';
import { LoggerFnOptions, logger } from '../console/logger';
import { LocalProgramKey } from '../shell/which';
import { getDefaultScripts } from './scripts-config';
import {
	getSystemDefaultSourceConfig,
	licenses,
} from './system-default-config';
import * as Hats from './types';

type ConfigSourcesPriority = [
	Hats.ConfigSource.programmatic,
	Hats.ConfigSource.system_default,
	Hats.ConfigSource.git_default,
	Hats.ConfigSource.user_default,
	Hats.ConfigSource.command_line,
	Hats.ConfigSource.prompt,
];
const config_sources_priority: ConfigSourcesPriority = [
	Hats.ConfigSource.programmatic,
	Hats.ConfigSource.system_default,
	Hats.ConfigSource.git_default,
	Hats.ConfigSource.user_default,
	Hats.ConfigSource.command_line,
	Hats.ConfigSource.prompt,
];
if (
	config_sources_priority.length !== Hats.config_sources.length ||
	config_sources_priority.length !== new Set(config_sources_priority).size
) {
	logger.error({ msg: config_sources_priority });
	throw new Error();
}

type MergeCommandLineSourceConfig = {
	[key in `${Ext<
		Hats.ConfigSources,
		'command_line'
	>}_configs`]: Hats.CommandLineSourceConfig;
};
type MergeGitSourceConfig = {
	[key in `${Ext<
		Hats.ConfigSources,
		'git_default'
	>}_configs`]: Hats.GitSourceConfig;
};
type MergePromptSourceConfig = {
	[key in `${Ext<
		Hats.ConfigSources,
		'prompt'
	>}_configs`]: Hats.PromptSourceConfig;
};
type MergeUserDefaultSourceConfig = {
	[key in `${Ext<
		Hats.ConfigSources,
		'user_default'
	>}_configs`]: Hats.UserDefaultSourceConfig;
};
type MergeConfigSourcesParams = {
	local_programs: LocalProgramKey[];
	merge_sources: MergeCommandLineSourceConfig &
		MergeGitSourceConfig &
		MergePromptSourceConfig &
		MergeUserDefaultSourceConfig;
} & LoggerFnOptions;
export function mergeConfigSourcs(
	params: MergeConfigSourcesParams,
): Hats.Config {
	try {
		const { local_programs, merge_sources } = params;
		const [, , priority_2, priority_3, priority_4, priority_5] =
			config_sources_priority;
		const parsed_configs = {
			...getSystemDefaultSourceConfig(),
			...merge_sources[`${priority_2}_configs`],
			...merge_sources[`${priority_3}_configs`],
			...merge_sources[`${priority_4}_configs`],
			...merge_sources[`${priority_5}_configs`],
		};
		const programmatic_configs: Hats.ProgrammaticSourceConfig = {
			'HATS.AUTHOR.CONTACT': `https://github.com/${parsed_configs['HATS.GITHUB.USERNAME']}`,
			'HATS.LICENSE.BODY': licenses[parsed_configs['HATS.LICENSE.NAME']],
			'HATS.LICENSE.YEAR': new Date().getFullYear().toString(),
			'HATS.MODULE.DISPLAY_NAME': parsed_configs['HATS.MODULE.NAME'],
			'HATS.RUNTIME.PROGRAMS': local_programs,
			'HATS.RUNTIME.ROOT_DIR_NAME': parsed_configs['HATS.MODULE.NAME'],
			...getDefaultScripts({ local_programs }),
		};
		return {
			...programmatic_configs,
			...parsed_configs,
		};
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}
