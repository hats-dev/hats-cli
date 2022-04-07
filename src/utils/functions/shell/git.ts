import { PathFnParams } from '../fs/path';
import exec from '../node/exec';
import { logger, type LoggerFnOptions } from '../console/logger';

export type IsGitTrackedParams = PathFnParams;
export async function isGitTracked(
	params: IsGitTrackedParams & LoggerFnOptions,
): Promise<boolean> {
	try {
		const is_git_tracked_sh = `git -C ${params.path} rev-parse 2>/dev/null; echo $?`;
		const { stdout } = await exec(is_git_tracked_sh);
		return stdout.replace(/\n/g, '') === '0';
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}

export enum GithubRepoAccessType {
	private = 'private',
	public = 'public',
}
