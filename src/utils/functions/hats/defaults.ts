import { licenses, LicenseType } from './licenses';
import { GithubRepoAccessType } from '../shell/git';
import { LocalProgramType } from '../shell/which';
import { Config, ScriptsConfigs, scripts_configs } from './configs';

export const fallback_script = 'exit 0';
type GetDefaultScriptParams = {
	script_config: ScriptsConfigs;
} & GetDefaultScriptsParams;
export function getDefaultScript(params: GetDefaultScriptParams): string {
	const { default_script_map } = params;
	const { default_script, required } = default_script_map[params.script_config];
	const missing_requirement_index = required.findIndex(
		(program) => !params.local_programs.includes(program),
	);
	return missing_requirement_index === -1 ? default_script : fallback_script;
}

export type DefaultScriptMap = Record<
	ScriptsConfigs,
	{
		default_script: string;
		required: LocalProgramType[];
	}
>;
type GetDefaultScriptsParams = {
	default_script_map: DefaultScriptMap;
} & GetDefaultConfigMapParams;
export type DefaultScriptConfigs = Record<ScriptsConfigs, string>;
export function getDefaultScripts(
	params: GetDefaultScriptsParams,
): DefaultScriptConfigs {
	return scripts_configs.reduce(function (acc, script_config) {
		return {
			...acc,
			[script_config]: getDefaultScript({ script_config, ...params }),
		};
	}, {} as DefaultScriptConfigs);
}

export const default_license: LicenseType = LicenseType['BSD-3-Clause'];
export const default_script_map: DefaultScriptMap = {
	'HATS.SCRIPTS.CHANGELOG': {
		default_script: 'auto-changelog -p',
		required: [LocalProgramType['auto-changelog']],
	},
	'HATS.SCRIPTS.DEPLOY': {
		default_script: 'npm publish',
		required: [LocalProgramType.npm],
	},
	'HATS.SCRIPTS.MD_TOC': {
		default_script: 'doctoc .',
		required: [LocalProgramType.doctoc],
	},
};
type GetDefaultConfigMapParams = {
	local_programs: LocalProgramType[];
};
export function getDefaultConfig(params: GetDefaultConfigMapParams): Config {
	return {
		'HATS.AUTHOR.CONTACT': '',
		'HATS.AUTHOR.NAME': '',
		'HATS.GITHUB.ORG_USERNAME': '',
		'HATS.GITHUB.REPO': '',
		'HATS.GITHUB.REPO_ACCESS': GithubRepoAccessType.private,
		'HATS.GITHUB.USERNAME': '',
		'HATS.LICENSE.NAME': default_license,
		'HATS.LICENSE.BODY': licenses[default_license],
		'HATS.LICENSE.YEAR': new Date().getFullYear().toString(),
		'HATS.MODULE.NAME': 'happy-ts-project',
		'HATS.MODULE.DESCRIPTION': '',
		'HATS.MODULE.DISPLAY_NAME': 'Happy TypeScript Project',
		'HATS.MODULE.KEYWORDS': ['typescript'],
		'HATS.PATHS.BUILD_DIR_PATH': 'dist/',
		'HATS.PATHS.MAIN_MODULE_PATH': 'dist/index.js',
		'HATS.PATHS.TS_BUILD_ROOT_DIR_PATH': './src',
		'HATS.PATHS.TS_BUILD_EXLUDE_PATHS': ['tests', 'src/**/*.test.ts'],
		'HATS.PATHS.TYPES_DTS_PATH': 'dist/index.d.ts',
		'HATS.RUNTIME.PROGRAMS': params.local_programs,
		'HATS.RUNTIME.ROOT_DIR_NAME': 'happy-ts-project',
		'HATS.RUNTIME.SKIP_INTERACTIVE': 'n',
		...getDefaultScripts({
			default_script_map,
			...params,
		}),
	};
}
