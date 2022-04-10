import { ScriptsConfig, ScriptsConfigs, scripts_configs } from '../../types';
import {
	LocalProgramType,
	LocalProgramKey,
	LocalProgramParams,
	hasRequiredPrograms,
} from '../../../shell/which';
import { exact } from '../../../ts/objects';

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
		default_script: 'npm publish --access=restricted',
		required: [LocalProgramType.npm],
	},
	HATS_SCRIPTS_MD_TOC: {
		default_script: 'doctoc .',
		required: [LocalProgramType.doctoc],
	},
};

type Rt = ReturnType<typeof getDefaultScripts>;
export type GetDefaultScriptsParams = LocalProgramParams;
export function getDefaultScripts(
	params: GetDefaultScriptsParams,
): ScriptsConfig {
	return exact<Rt>()(
		scripts_configs.reduce(
			function (acc, script_config) {
				const next = { ...acc };
				if (
					hasRequiredPrograms({
						required: default_scripts[script_config].required,
						...params,
					})
				) {
					const { default_script } = default_scripts[script_config];
					next[script_config] = default_script;
				}
				return next;
			},
			{
				HATS_SCRIPTS_CHANGELOG:
					'echo \\"Missing changelog automation (Consider: https://npmjs.com/package/auto-changelog)\\"',
				HATS_SCRIPTS_DEPLOY: 'echo \\"Missing deployment script"',
				HATS_SCRIPTS_MD_TOC:
					'echo \\"Missing *.md ToC automation (Consider: https://npmjs.com/package/doctoc)\\"',
			},
		),
	);
}
