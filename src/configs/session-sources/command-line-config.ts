import { logger } from '../../console/logger';
import { getCwd } from '../../fs/path';
import getFileStr from '../../fs/reads';
import { isGitTracked } from '../../shell/git';
import {
	LocalProgramKey,
	whichPrograms,
	local_program_types,
	LocalProgramType,
	hasRequiredPrograms,
} from '../../shell/which';
import { safeParse } from '../../ts/objects';
import {
	configs,
	ConfigsFromUserDefault,
	isConfigsFromUserDefault,
} from '../types';

export function mapUserDefaultConfigsCliChoices(
	key: ConfigsFromUserDefault,
): string {
	return key
		.toLowerCase()
		.replace(/hats_/g, '')
		.replace(/_/, '.')
		.replace(/_/g, '-');
}
export function getUserDefaultConfigsCliChoices(): string[] {
	return configs
		.filter(isConfigsFromUserDefault)
		.map(mapUserDefaultConfigsCliChoices);
}

export function parseUserDefaultConfigsCliChoices({
	key,
}: {
	key: string;
}): ConfigsFromUserDefault {
	const [config_type = '', config_prop = ''] = key.toUpperCase().split('.');
	return `HATS_${config_type}_${config_prop.replace(
		/-/g,
		'_',
	)}` as ConfigsFromUserDefault;
}

type CommanderCliParams = {
	HATS_RUNTIME_PROGRAMS: LocalProgramKey[];
	version: string;
};
export async function getCommanderCliParams(): Promise<CommanderCliParams> {
	try {
		type TaskRes = [
			Awaited<Promise<ReturnType<typeof isGitTracked>>>,
			Awaited<Promise<ReturnType<typeof whichPrograms>>>,
			Awaited<Promise<ReturnType<typeof getFileStr>>>,
		];
		const tasks = [
			function () {
				return isGitTracked({
					path: getCwd(),
				});
			},
			function () {
				return whichPrograms({
					programs: local_program_types,
				});
			},
			function () {
				return getFileStr({
					path: `${getCwd()}/package.json`,
				});
			},
		];
		const [is_git_tracked, HATS_RUNTIME_PROGRAMS, package_json_str] =
			(await Promise.all(tasks.map((fn) => fn()))) as TaskRes;
		const { version } = safeParse<{ version: string }>({
			str: package_json_str,
		});
		const required = [
			LocalProgramType.gh,
			LocalProgramType.git,
			LocalProgramType.node,
			LocalProgramType.npm,
		];
		const has_required_programs = hasRequiredPrograms({
			HATS_RUNTIME_PROGRAMS,
			required,
		});
		if (is_git_tracked) {
			logger.error({
				msg: 'Error: Current directory is already a git repository',
				prod: true,
			});
			throw new Error();
		}
		if (!has_required_programs) {
			logger.error({
				msg: `Error: Missing one ore more required program: \
${required.join(
	'\n',
)}. Visit the HaTs documentation for more info https://hats.dev/\
`,
				prod: true,
			});
			throw new Error();
		}
		if (!version) {
			throw new Error();
		}
		return {
			HATS_RUNTIME_PROGRAMS,
			version,
		};
	} catch (err) {
		console.log(err);
		throw new Error();
	}
}
