import { Exc, Ext, Keys, O } from '../ts/sets';
import { GithubRepoAccessType } from '../shell/git';
import { LocalProgramKey } from '../shell/which';
import { LicenseNameType } from './persistent-sources/system-default-constants/licenses';

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
type ConfigMapper<K extends ConfigType, V extends string> = `HATS_${K}_${V}`;
export function configMapper<K extends ConfigType, V extends string>(k: K) {
	return function (v: V): ConfigMapper<K, V> {
		return `HATS_${k}_${v}`;
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
export type AuthorProps = Keys<typeof AUTHOR>;
export type GithubProps = Keys<typeof GITHUB>;
export type LicenseProps = Keys<typeof LICENSE>;
export type ModuleProps = Keys<typeof MODULE>;
export type PathsProps = Keys<typeof PATHS>;
export type RuntimeProps = Keys<typeof RUNTIME>;
export type ScriptsProps = Keys<typeof SCRIPTS>;
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
export type ArrayConfigs = Ext<
	Configs,
	| 'HATS_MODULE_KEYWORDS'
	| 'HATS_PATHS_TS_BUILD_EXLUDE_PATHS'
	| 'HATS_RUNTIME_PROGRAMS'
>;
export function isArrayConfigs(k: Configs): k is ArrayConfigs {
	const array_configs: Record<ArrayConfigs, null> = {
		HATS_MODULE_KEYWORDS: null,
		HATS_PATHS_TS_BUILD_EXLUDE_PATHS: null,
		HATS_RUNTIME_PROGRAMS: null,
	};
	return k in array_configs;
}
export type GithubRepoAccessConfig = Ext<Configs, 'HATS_GITHUB_REPO_ACCESS'>;
export type LicenseNameConfig = Ext<Configs, 'HATS_LICENSE_NAME'>;
export type RuntimeProgramsConfig = Ext<Configs, 'HATS_RUNTIME_PROGRAMS'>;
export type RuntimeSkipInteractiveConfig = Ext<
	Configs,
	'HATS_RUNTIME_SKIP_INTERACTIVE'
>;
export type StringConfigs = Exc<
	Configs,
	| ArrayConfigs
	| GithubRepoAccessConfig
	| LicenseNameConfig
	| RuntimeProgramsConfig
	| RuntimeSkipInteractiveConfig
>;
export type Config = Record<ArrayConfigs, string[]> &
	Record<GithubRepoAccessConfig, GithubRepoAccessType> &
	Record<LicenseNameConfig, LicenseNameType> &
	Record<RuntimeProgramsConfig, LocalProgramKey[]> &
	Record<RuntimeSkipInteractiveConfig, boolean> &
	Record<StringConfigs, string>;

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

export enum ConfigSource {
	command_line = 'command_line',
	git_default = 'git_default',
	programmatic = 'programmatic',
	prompt = 'prompt',
	system_default = 'system_default',
	user_default = 'user_default',
}
export type ConfigSources = Keys<typeof ConfigSource>;
export const config_sources = O.keys(ConfigSource);
export type ConfigsFromCommandLine = Ext<
	Configs,
	'HATS_MODULE_NAME' | 'HATS_RUNTIME_SKIP_INTERACTIVE'
>;
export type ConfigsFromGitDefault = Ext<
	Configs,
	'HATS_AUTHOR_NAME' | 'HATS_GITHUB_USERNAME'
>;
export type ConfigsFromProgrammatic = Ext<
	Configs,
	| 'HATS_AUTHOR_CONTACT'
	| 'HATS_LICENSE_BODY'
	| 'HATS_LICENSE_YEAR'
	| 'HATS_MODULE_DISPLAY_NAME'
	| 'HATS_RUNTIME_ROOT_DIR_NAME'
>;
export type ConfigsFromPrompt = Exc<
	Configs,
	| 'HATS_LICENSE_BODY'
	| 'HATS_LICENSE_YEAR'
	| 'HATS_MODULE_DISPLAY_NAME'
	| 'HATS_MODULE_NAME'
	| 'HATS_RUNTIME_PROGRAMS'
	| 'HATS_RUNTIME_SKIP_INTERACTIVE'
>;
export function isConfigsFromPrompt(k: Configs): k is ConfigsFromPrompt {
	const configs_from_prompt: Record<ConfigsFromPrompt, null> = {
		HATS_AUTHOR_CONTACT: null,
		HATS_AUTHOR_NAME: null,
		HATS_GITHUB_ORG_USERNAME: null,
		HATS_GITHUB_REPO: null,
		HATS_GITHUB_REPO_ACCESS: null,
		HATS_GITHUB_USERNAME: null,
		HATS_LICENSE_NAME: null,
		HATS_MODULE_DESCRIPTION: null,
		HATS_MODULE_KEYWORDS: null,
		HATS_PATHS_BUILD_DIR_PATH: null,
		HATS_PATHS_MAIN_MODULE_PATH: null,
		HATS_PATHS_TS_BUILD_ROOT_DIR_PATH: null,
		HATS_PATHS_TS_BUILD_EXLUDE_PATHS: null,
		HATS_PATHS_TYPES_DTS_PATH: null,
		HATS_RUNTIME_ROOT_DIR_NAME: null,
		HATS_SCRIPTS_CHANGELOG: null,
		HATS_SCRIPTS_DEPLOY: null,
		HATS_SCRIPTS_MD_TOC: null,
	};
	return k in configs_from_prompt;
}
export type ConfigsFromSystemDefault = Ext<
	Configs,
	| 'HATS_GITHUB_REPO_ACCESS'
	| 'HATS_LICENSE_NAME'
	| 'HATS_MODULE_KEYWORDS'
	| PathsConfigs
	| ScriptsConfigs
>;
export type ConfigsFromUserDefault = Exc<
	Configs,
	| 'HATS_LICENSE_BODY'
	| 'HATS_LICENSE_YEAR'
	| 'HATS_MODULE_DISPLAY_NAME'
	| 'HATS_MODULE_NAME'
	| RuntimeConfigs
>;
export function isConfigsFromUserDefault(
	k: Configs,
): k is ConfigsFromUserDefault {
	const configs_from_user_default: Record<ConfigsFromUserDefault, null> = {
		HATS_AUTHOR_CONTACT: null,
		HATS_AUTHOR_NAME: null,
		HATS_GITHUB_ORG_USERNAME: null,
		HATS_GITHUB_REPO: null,
		HATS_GITHUB_REPO_ACCESS: null,
		HATS_GITHUB_USERNAME: null,
		HATS_LICENSE_NAME: null,
		HATS_MODULE_DESCRIPTION: null,
		HATS_MODULE_KEYWORDS: null,
		HATS_PATHS_BUILD_DIR_PATH: null,
		HATS_PATHS_MAIN_MODULE_PATH: null,
		HATS_PATHS_TS_BUILD_ROOT_DIR_PATH: null,
		HATS_PATHS_TS_BUILD_EXLUDE_PATHS: null,
		HATS_PATHS_TYPES_DTS_PATH: null,
		HATS_SCRIPTS_CHANGELOG: null,
		HATS_SCRIPTS_DEPLOY: null,
		HATS_SCRIPTS_MD_TOC: null,
	};
	return k in configs_from_user_default;
}

export type ArrayConfig = Pick<Config, ArrayConfigs>;
export type StringConfig = Pick<Config, StringConfigs>;
export type AuthorConfig = Pick<Config, AuthorConfigs>;
export type GithubConfig = Pick<Config, GithubConfigs>;
export type LicenseConfig = Pick<Config, LicenseConfigs>;
export type ModuleConfig = Pick<Config, ModuleConfigs>;
export type PathsConfig = Pick<Config, PathsConfigs>;
export type RuntimeConfig = Pick<Config, RuntimeConfigs>;
export type ScriptsConfig = Pick<Config, ScriptsConfigs>;

export type CommandLineSourceConfig = Pick<Config, ConfigsFromCommandLine>;
export type GitDefaultSourceConfig = Pick<Config, ConfigsFromGitDefault>;
export type ProgrammaticSourceConfig = Pick<Config, ConfigsFromProgrammatic>;
export type PromptSourceConfig = Pick<Config, ConfigsFromPrompt>;
export type SystemDefaultSourceConfig = Pick<Config, ConfigsFromSystemDefault>;
export type UserDefaultSourceConfig = Pick<Config, ConfigsFromUserDefault>;
export type ConfigSourceMap<T extends ConfigSource> =
	T extends ConfigSource.command_line
		? CommandLineSourceConfig
		: T extends ConfigSource.git_default
		? GitDefaultSourceConfig
		: T extends ConfigSource.programmatic
		? ProgrammaticSourceConfig
		: T extends ConfigSource.prompt
		? PromptSourceConfig
		: T extends ConfigSource.system_default
		? SystemDefaultSourceConfig
		: UserDefaultSourceConfig;
