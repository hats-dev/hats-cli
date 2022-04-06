import { LocalProgramKey, LocalProgramType } from '../shell/which';
import * as Hats from './types';

export const fallback_script = 'exit 0';
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

type GetDefaultScriptParams = {
	script_config: Hats.ScriptsConfigs;
} & GetDefaultScriptsParams;
export function getDefaultScript(params: GetDefaultScriptParams): string {
	const { default_script, required } = default_script_map[params.script_config];
	const missing_requirement_index = required.findIndex(
		(program) => !params.local_programs.includes(program),
	);
	return missing_requirement_index === -1 ? default_script : fallback_script;
}

export type DefaultScriptMap = Record<
	Hats.ScriptsConfigs,
	{
		default_script: string;
		required: LocalProgramKey[];
	}
>;
type GetDefaultScriptsParams = {
	local_programs: LocalProgramKey[];
};
export function getDefaultScripts(
	params: GetDefaultScriptsParams,
): Hats.ScriptsConfig {
	return Hats.scripts_configs.reduce(function (acc, script_config) {
		return {
			...acc,
			[script_config]: getDefaultScript({ script_config, ...params }),
		};
	}, {} as Hats.ScriptsConfig);
}
