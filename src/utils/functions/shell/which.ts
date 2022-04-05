import { O } from '../../ts/sets';
import { LoggerFnOptions, logger } from '../console/logger';
import exec from '../node/exec';

export enum LocalProgramType {
	'auto-changelog' = 'auto-changelog',
	doctoc = 'doctoc',
	gh = 'gh',
	git = 'git',
	node = 'node',
	npm = 'npm',
}
export const local_program_types = O.keys(LocalProgramType);

type WhichParams = { program: LocalProgramType } & LoggerFnOptions;
export async function whichProgram(params: WhichParams): Promise<boolean> {
	try {
		const { stdout } = await exec(`which ${params.program}`);
		return !!stdout;
	} catch (msg) {
		logger.error({
			msg,
			debug: false,
			...params,
		});
		return false;
	}
}

type WhichProgramsParams = {
	readonly programs: LocalProgramType[];
} & LoggerFnOptions;
export async function whichPrograms(
	params: WhichProgramsParams,
): Promise<LocalProgramType[]> {
	try {
		const which_programs = await Promise.all(
			params.programs.slice().map((program) => whichProgram({ program })),
		);
		return params.programs.slice().filter((_, i) => which_programs[i]);
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}

type HasRequiredProgramsParams = WhichProgramsParams;
export async function hasRequiredPrograms(
	params: HasRequiredProgramsParams,
): Promise<boolean> {
	try {
		const which_programs = await whichPrograms(params);
		return params.programs.length === which_programs.length;
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}
