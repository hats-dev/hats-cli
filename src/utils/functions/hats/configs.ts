import { logger, LoggerFnOptions } from '../console/logger';
import { EmptyObject } from '../../ts/objects';
import { O } from '../../ts/sets';

export enum GithubRepoAccessType {
	private = 'private',
	public = 'public',
}
export enum LicenseNameType {
	'BSD-3-Clause' = 'BSD-3-Clause',
	'MIT' = 'MIT',
}
export enum LocalProgramType {
	'auto-changelog' = 'auto-changelog',
	doctoc = 'doctoc',
	gh = 'gh',
}

export enum ConfigType {
	AUTHOR = 'AUTHOR',
	GITHUB = 'GITHUB',
	LICENSE = 'LICENSE',
	MODULE = 'MODULE',
	PATHS = 'PATHS',
	RUNTIME = 'RUNTIME',
	SCRIPTS = 'SCRIPTS',
}
export const config_types = O.keys(ConfigType);

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
	INTERACTIVE = 'INTERACTIVE',
	PROGRAMS = 'PROGRAMS',
	ROOT_DIR_NAME = 'ROOT_DIR_NAME',
}
export enum SCRIPTS {
	CHANGELOG = 'CHANGELOG',
	DEPLOY = 'DEPLOY',
	MD_TOC = 'MD_TOC',
}

export const author_configs = O.keys(AUTHOR);
export const github_configs = O.keys(GITHUB);
export const license_configs = O.keys(LICENSE);
export const module_configs = O.keys(MODULE);
export const paths_configs = O.keys(PATHS);
export const runtime_configs = O.keys(RUNTIME);
export const scripts_configs = O.keys(SCRIPTS);
export const configs = [
	...author_configs,
	...github_configs,
	...license_configs,
	...module_configs,
	...paths_configs,
	...runtime_configs,
	...scripts_configs,
];

export type ConfigKey<
	K extends ConfigType,
	V extends string,
> = `HATS.${K}.${V}`;
export type author_config_keys = ConfigKey<
	ConfigType.AUTHOR,
	typeof author_configs[number]
>;
export type github_config_keys = ConfigKey<
	ConfigType.GITHUB,
	typeof github_configs[number]
>;
export type license_config_keys = ConfigKey<
	ConfigType.LICENSE,
	typeof license_configs[number]
>;
export type module_config_keys = ConfigKey<
	ConfigType.MODULE,
	typeof module_configs[number]
>;
export type paths_config_keys = ConfigKey<
	ConfigType.PATHS,
	typeof paths_configs[number]
>;
export type runtime_config_keys = ConfigKey<
	ConfigType.RUNTIME,
	typeof runtime_configs[number]
>;
export type scripts_config_keys = ConfigKey<
	ConfigType.SCRIPTS,
	typeof scripts_configs[number]
>;
export type config_keys =
	| author_config_keys
	| github_config_keys
	| license_config_keys
	| module_config_keys
	| paths_config_keys
	| runtime_config_keys
	| scripts_config_keys;

export type V = string | string[];
export type ConfigData<T extends V> = {
	default?: T;
	message?: string;
	value: T;
};
export type ConfigListData<K extends string> = {
	choices: K[];
};
export type ListConfig<T extends V, K extends string> = ConfigData<T> &
	ConfigListData<K>;
export type Config<T extends V, K extends string = ''> = Partial<
	ListConfig<T, K>
>;
export function isListConfig<T extends V, K extends string>() {
	return function (c: Config<T, K>): c is ListConfig<T, K> {
		return !!c.choices;
	};
}

// TODO
export type DebugConfigs = {
	[ConfigType.RUNTIME]: {
		[RUNTIME.ROOT_DIR_NAME]: string;
	};
};

export type GetConfigsParams = typeof EmptyObject & LoggerFnOptions;
export function getConfigs(params: GetConfigsParams): unknown {
	try {
		const system_author_configs: Record<AUTHOR, Config<string>> = {
			CONTACT: {
				message: 'Contact email',
			},
			NAME: {},
		};
		// TODO
		// const system_github_configs = {};
		// const system_license_configs = {};
		// const system_local_configs = {};
		// const system_module_configs = {};
		// const system_paths_configs = {};
		// const system_scripts_configs = {};
		// const system_configs = [];
		return system_author_configs;
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}
