import { Exc, Ext, Keys, O } from '../../ts/sets';
import { GithubRepoAccessType } from '../shell/git';
import { LocalProgramKey } from '../shell/which';
import { LicenseNameType } from './system-default-config';

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
export function configMapper<K extends ConfigType, V extends string>(k: K) {
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
	| 'HATS.MODULE.KEYWORDS'
	| 'HATS.PATHS.TS_BUILD_EXLUDE_PATHS'
	| 'HATS.RUNTIME.PROGRAMS'
>;
export type GithubRepoAccessConfig = Ext<Configs, 'HATS.GITHUB.REPO_ACCESS'>;
export type LicenseNameConfig = Ext<Configs, 'HATS.LICENSE.NAME'>;
export type RuntimeProgramsConfig = Ext<Configs, 'HATS.RUNTIME.PROGRAMS'>;
export type RuntimeSkipInteractiveConfig = Ext<
	Configs,
	'HATS.RUNTIME.SKIP_INTERACTIVE'
>;
export type StringConfigs = Exc<
	Configs,
	| ArrayConfigs
	| GithubRepoAccessConfig
	| LicenseNameConfig
	| RuntimeProgramsConfig
	| RuntimeSkipInteractiveConfig
>;
export enum FlagType {
	y = 'y',
	n = 'n',
}
export type Config = {
	[key in ArrayConfigs]: string[];
} & {
	[key in GithubRepoAccessConfig]: GithubRepoAccessType;
} & {
	[key in LicenseNameConfig]: LicenseNameType;
} & {
	[key in RuntimeProgramsConfig]: LocalProgramKey[];
} & {
	[key in RuntimeSkipInteractiveConfig]: FlagType;
} & {
	[key in StringConfigs]: string;
};

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
	'HATS.MODULE.NAME' | 'HATS.RUNTIME.SKIP_INTERACTIVE'
>;
export type ConfigsFromGit = Ext<
	Configs,
	'HATS.AUTHOR.NAME' | 'HATS.GITHUB.USERNAME'
>;
export type ConfigsFromProgrammatic = Ext<
	Configs,
	| 'HATS.AUTHOR.CONTACT'
	| Exc<LicenseConfigs, 'HATS.LICENSE.NAME'>
	| 'HATS.MODULE.DISPLAY_NAME'
	| Exc<RuntimeConfigs, 'HATS.RUNTIME.SKIP_INTERACTIVE'>
	| ScriptsConfigs
>;
export type ConfigsFromPrompt = Exc<
	Configs,
	| ConfigsFromCommandLine
	| Exc<
			ConfigsFromProgrammatic,
			'HATS.AUTHOR.CONTACT' | 'HATS.RUNTIME.ROOT_DIR_NAME'
	  >
>;
export type ConfigsFromSystemDefault = Exc<
	Configs,
	| 'HATS.AUTHOR.NAME'
	| Exc<GithubConfigs, 'HATS.GITHUB.REPO_ACCESS'>
	| 'HATS.MODULE.DESCRIPTION'
	| ConfigsFromCommandLine
	| ConfigsFromProgrammatic
>;
export type ConfigsFromUserDefault = Exc<
	Configs,
	ConfigsFromCommandLine | Exc<ConfigsFromProgrammatic, ScriptsConfigs>
>;

export type ConfigSet<T extends Configs> = {
	[k in T]: Config[k];
};
export type ArrayConfig = ConfigSet<ArrayConfigs>;
export type StringConfig = ConfigSet<StringConfigs>;
export type AuthorConfig = ConfigSet<AuthorConfigs>;
export type GithubConfig = ConfigSet<GithubConfigs>;
export type LicenseConfig = ConfigSet<LicenseConfigs>;
export type ModuleConfig = ConfigSet<ModuleConfigs>;
export type PathsConfig = ConfigSet<PathsConfigs>;
export type RuntimeConfig = ConfigSet<RuntimeConfigs>;
export type ScriptsConfig = ConfigSet<ScriptsConfigs>;
export type CommandLineSourceConfig = ConfigSet<ConfigsFromCommandLine>;
export type GitSourceConfig = ConfigSet<ConfigsFromGit>;
export type ProgrammaticSourceConfig = ConfigSet<ConfigsFromProgrammatic>;
export type PromptSourceConfig = ConfigSet<ConfigsFromPrompt>;
export type SystemDefaultSourceConfig = ConfigSet<ConfigsFromSystemDefault>;
export type UserDefaultSourceConfig = Partial<
	ConfigSet<ConfigsFromUserDefault>
>;
