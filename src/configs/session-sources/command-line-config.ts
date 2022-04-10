import { textSync } from 'figlet';
import { logger } from '../../console/logger';
import {
	LocalProgramKey,
	whichPrograms,
	local_program_types,
	LocalProgramType,
	hasRequiredPrograms,
} from '../../shell/which';
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
		const HATS_RUNTIME_PROGRAMS = await whichPrograms({
			programs: local_program_types,
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
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
		const { version } = require('../../../package.json');
		if (!version) {
			throw new Error();
		}
		return {
			HATS_RUNTIME_PROGRAMS,
			version: version as string,
		};
	} catch (err) {
		console.log(err);
		throw new Error();
	}
}

export async function printWelcome(): Promise<void> {
	try {
		const str = await Promise.resolve(
			textSync('HaTs', {
				font: '3D-ASCII',
				horizontalLayout: 'default',
				verticalLayout: 'default',
				width: 60,
				whitespaceBreak: true,
			}),
		);
		logger.log({
			msg: `${str}

Welcome to the HaTs CLI! 🧢

Let's configure your TypeScript project:

`,
			stringify: false,
		});
	} catch (msg) {
		logger.error({ msg });
		throw new Error();
	}
}
