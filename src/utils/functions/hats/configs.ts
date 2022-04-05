import { logger } from '../console/logger';
import { Exc, Ext, Keys, O } from '../../ts/sets';

// TODO
export type DebugConfigs = {
	[ConfigType.RUNTIME]: {
		[RUNTIME.ROOT_DIR_NAME]: string;
	};
};

export enum ConfigType {
	AUTHOR = 'AUTHOR',
	GITHUB = 'GITHUB',
	LICENSE = 'LICENSE',
	MODULE = 'MODULE',
	PATHS = 'PATHS',
	RUNTIME = 'RUNTIME',
	SCRIPTS = 'SCRIPTS',
}
export type ConfigTypes = Keys<typeof ConfigType>;
export const config_types = O.keys(ConfigType);

type ConfigMapper<K extends ConfigType, V extends string> = `HATS.${K}.${V}`;
function configMapper<K extends ConfigType, V extends string>(k: K) {
	return function (v: V): ConfigMapper<K, V> {
		return `HATS.${k}.${v}`;
	};
}

export enum AUTHOR {
	CONTACT = 'CONTACT',
	NAME = 'NAME',
}
export enum GITHUB {
	ORG_USERNAME = 'ORG_USERNAME',
	REPO = 'REPO',
	REPO_ACCESS = 'REPO_ACCESS',
	USERNAME = 'USERNAME',
}
export enum LICENSE {
	BODY = 'BODY',
	NAME = 'NAME',
	YEAR = 'YEAR',
}
export enum MODULE {
	DESCRIPTION = 'DESCRIPTION',
	DISPLAY_NAME = 'DISPLAY_NAME',
	KEYWORDS = 'KEYWORDS',
	NAME = 'NAME',
}
export enum PATHS {
	BUILD_DIR_PATH = 'BUILD_DIR_PATH',
	MAIN_MODULE_PATH = 'MAIN_MODULE_PATH',
	TS_BUILD_ROOT_DIR_PATH = 'TS_BUILD_ROOT_DIR_PATH',
	TS_BUILD_EXLUDE_PATHS = 'TS_BUILD_EXLUDE_PATHS',
	TYPES_DTS_PATH = 'TYPES_DTS_PATH',
}
export enum RUNTIME {
	PROGRAMS = 'PROGRAMS',
	ROOT_DIR_NAME = 'ROOT_DIR_NAME',
	SKIP_INTERACTIVE = 'SKIP_INTERACTIVE',
}
export enum SCRIPTS {
	CHANGELOG = 'CHANGELOG',
	DEPLOY = 'DEPLOY',
	MD_TOC = 'MD_TOC',
}

type AuthorProps = Keys<typeof AUTHOR>;
type GithubProps = Keys<typeof GITHUB>;
type LicenseProps = Keys<typeof LICENSE>;
type ModuleProps = Keys<typeof MODULE>;
type PathsProps = Keys<typeof PATHS>;
type RuntimeProps = Keys<typeof RUNTIME>;
type ScriptsProps = Keys<typeof SCRIPTS>;
export type AuthorConfigs = ConfigMapper<ConfigType.AUTHOR, AuthorProps>;
export type GithubConfigs = ConfigMapper<ConfigType.GITHUB, GithubProps>;
export type LicenseConfigs = ConfigMapper<ConfigType.LICENSE, LicenseProps>;
export type ModuleConfigs = ConfigMapper<ConfigType.MODULE, ModuleProps>;
export type PathsConfigs = ConfigMapper<ConfigType.PATHS, PathsProps>;
export type RuntimeConfigs = ConfigMapper<ConfigType.RUNTIME, RuntimeProps>;
export type ScriptsConfigs = ConfigMapper<ConfigType.SCRIPTS, ScriptsProps>;
export type Configs =
	| AuthorConfigs
	| GithubConfigs
	| LicenseConfigs
	| ModuleConfigs
	| PathsConfigs
	| RuntimeConfigs
	| ScriptsConfigs;
export const author_configs = O.keys(AUTHOR).map(
	configMapper<ConfigType.AUTHOR, AuthorProps>(ConfigType.AUTHOR),
);
export const github_configs = O.keys(GITHUB).map(
	configMapper<ConfigType.GITHUB, GithubProps>(ConfigType.GITHUB),
);
export const license_configs = O.keys(LICENSE).map(
	configMapper<ConfigType.LICENSE, LicenseProps>(ConfigType.LICENSE),
);
export const module_configs = O.keys(MODULE).map(
	configMapper<ConfigType.MODULE, ModuleProps>(ConfigType.MODULE),
);
export const paths_configs = O.keys(PATHS).map(
	configMapper<ConfigType.PATHS, PathsProps>(ConfigType.PATHS),
);
export const runtime_configs = O.keys(RUNTIME).map(
	configMapper<ConfigType.RUNTIME, RuntimeProps>(ConfigType.RUNTIME),
);
export const scripts_configs = O.keys(SCRIPTS).map(
	configMapper<ConfigType.SCRIPTS, ScriptsProps>(ConfigType.SCRIPTS),
);
export const configs = [
	...author_configs,
	...github_configs,
	...license_configs,
	...module_configs,
	...paths_configs,
	...runtime_configs,
	...scripts_configs,
];

export type ArrayConfigs = Ext<
	Configs,
	| 'HATS.MODULE.KEYWORDS'
	| 'HATS.PATHS.TS_BUILD_EXLUDE_PATHS'
	| 'HATS.RUNTIME.PROGRAMS'
>;
export type StringConfigs = Exc<Configs, ArrayConfigs>;
export type Config = {
	[key in ArrayConfigs]: string[];
} & {
	[key in StringConfigs]: string;
};

export enum ConfigSource {
	command_line = 'command_line',
	git_config = 'git_config',
	hats_config_file = 'hats_config_file',
	hats_defaults = 'hats_defaults',
}
export type ConfigSources = Keys<typeof ConfigSource>;
export const config_sources = O.keys(ConfigSource);
export type ConfigSourcesPriority = [
	ConfigSource,
	ConfigSource,
	ConfigSource,
	ConfigSource,
];
const default_config_sources_priority: ConfigSourcesPriority = [
	ConfigSource.hats_defaults,
	ConfigSource.git_config,
	ConfigSource.hats_config_file,
	ConfigSource.command_line,
];
type GetConfigParams = {
	config_sources_priority?: ConfigSourcesPriority;
	merge_configs: {
		[key in Ext<ConfigSources, 'hats_defaults'>]: Config;
	} & {
		[key in Exc<ConfigSources, 'hats_defaults'>]: Partial<Config>;
	};
};
export function getConfig(params: GetConfigParams): Config {
	const {
		config_sources_priority = default_config_sources_priority,
		merge_configs,
	} = params;
	if (
		config_sources_priority.length !== config_sources.length ||
		config_sources_priority.length !== new Set(config_sources_priority).size
	) {
		logger.error({ msg: config_sources_priority });
		throw new Error();
	}
	return config_sources_priority.reduce(function (acc, k) {
		return {
			...acc,
			...merge_configs[k],
		};
	}, {} as Config);
}
