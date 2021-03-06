import { Config } from '../configs/types';
import { Keys, O } from '../ts/sets';
import { LoggerFnOptions, logger } from '../console/logger';
import exec from '../node/exec';

export enum LocalProgramType {
	'auto-changelog' = 'auto-changelog',
	doctoc = 'doctoc',
	code = 'code',
	gh = 'gh',
	git = 'git',
	node = 'node',
	npm = 'npm',
}
export type LocalProgramKey = Keys<typeof LocalProgramType>;
export const local_program_types = O.keys(LocalProgramType);
export type LocalProgramParams = Pick<Config, 'HATS_RUNTIME_PROGRAMS'>;

type WhichParams = { program: LocalProgramKey } & LoggerFnOptions;
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
	readonly programs: LocalProgramKey[];
} & LoggerFnOptions;
export async function whichPrograms(
	params: WhichProgramsParams,
): Promise<LocalProgramKey[]> {
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

type GetDefaultScriptParams = {
	required: LocalProgramKey[];
} & LocalProgramParams;
export function hasRequiredPrograms(params: GetDefaultScriptParams): boolean {
	const { required, HATS_RUNTIME_PROGRAMS } = params;
	return (
		required.findIndex(
			(program) => !HATS_RUNTIME_PROGRAMS.includes(program),
		) === -1
	);
}
