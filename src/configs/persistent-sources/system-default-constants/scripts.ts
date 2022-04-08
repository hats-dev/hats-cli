import { ScriptsConfig, ScriptsConfigs, scripts_configs } from '../../types';
import {
	LocalProgramType,
	LocalProgramKey,
	LocalProgramParams,
} from '../../../shell/which';
import { exact } from '../../../ts/objects';

const fallback_script = 'exit 0';
type DefaultScriptMap = Record<
	ScriptsConfigs,
	{
		default_script: string;
		required: LocalProgramKey[];
	}
>;
const default_scripts: DefaultScriptMap = {
	HATS_SCRIPTS_CHANGELOG: {
		default_script: 'auto-changelog -p',
		required: [LocalProgramType['auto-changelog']],
	},
	HATS_SCRIPTS_DEPLOY: {
		default_script: 'npm publish',
		required: [LocalProgramType.npm],
	},
	HATS_SCRIPTS_MD_TOC: {
		default_script: 'doctoc .',
		required: [LocalProgramType.doctoc],
	},
};

type GetDefaultScriptParams = {
	script_config: ScriptsConfigs;
} & GetDefaultScriptsParams;
function hasRequiredPrograms(params: GetDefaultScriptParams): boolean {
	const { required } = default_scripts[params.script_config];
	return (
		required.findIndex(
			(program) => !params.HATS_RUNTIME_PROGRAMS.includes(program),
		) === -1
	);
}

type Rt = ReturnType<typeof getDefaultScripts>;
export type GetDefaultScriptsParams = LocalProgramParams;
export function getDefaultScripts(
	params: GetDefaultScriptsParams,
): ScriptsConfig {
	return exact<Rt>()(
		scripts_configs.reduce(
			function (acc, script_config) {
				const next = { ...acc };
				if (hasRequiredPrograms({ script_config, ...params })) {
					const { default_script } = default_scripts[script_config];
					next[script_config] = default_script;
				}
				return next;
			},
			{
				HATS_SCRIPTS_CHANGELOG: fallback_script,
				HATS_SCRIPTS_DEPLOY: fallback_script,
				HATS_SCRIPTS_MD_TOC: fallback_script,
			},
		),
	);
}
