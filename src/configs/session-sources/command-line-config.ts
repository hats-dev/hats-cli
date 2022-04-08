import { getCwd } from '../../fs/path';
import getFileStr from '../../fs/reads';
import {
	LocalProgramKey,
	whichPrograms,
	local_program_types,
	LocalProgramType,
} from '../../shell/which';
import { safeParse } from '../../ts/objects';
import { hasRequiredPrograms } from '../persistent-sources/system-default-constants/scripts';
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
		const get_programs = () =>
			whichPrograms({
				programs: local_program_types,
			});
		const get_package_json_str = () =>
			getFileStr({
				path: `${getCwd()}/package.json`,
			});
		const [HATS_RUNTIME_PROGRAMS, package_json_str] = (await Promise.all(
			[get_programs, get_package_json_str].map((fn) => fn()),
		)) as [
			Awaited<Promise<ReturnType<typeof whichPrograms>>>,
			Awaited<Promise<ReturnType<typeof getFileStr>>>,
		];
		const { version } = safeParse<{ version: string }>({
			str: package_json_str,
		});
		const has_required_programs = hasRequiredPrograms({
			HATS_RUNTIME_PROGRAMS,
			required: [
				LocalProgramType.gh,
				LocalProgramType.git,
				LocalProgramType.node,
				LocalProgramType.npm,
			],
		});
		if (!has_required_programs) {
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
