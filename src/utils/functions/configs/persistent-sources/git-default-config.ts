import { EmptyObject } from '../../../ts/objects';
import { LoggerFnOptions, logger } from '../../console/logger';
import exec from '../../node/exec';
import { GitDefaultSourceConfig } from '../types';

type FullGitConfig = Record<string, Record<string, string>>;
export type GetGitDefaultSourceConfigParams = typeof EmptyObject &
	LoggerFnOptions;
export async function getGitDefaultSourceConfig(
	params: GetGitDefaultSourceConfigParams,
): Promise<GitDefaultSourceConfig> {
	try {
		const get_git_user_configs_sh = 'git config --list --global';
		const { stdout } = await exec(get_git_user_configs_sh);
		const configs = stdout.split('\n').filter((config) => config);
		const git_config_sh = configs.reduce(function (acc: FullGitConfig, config) {
			const arr = config.split('=');
			const key_segments = arr[0] || '';
			const value = arr[1] || '';
			const key_arr = key_segments.split('.');
			const key_root = key_arr[0] || '';
			const key_path = key_arr.slice(1).join('') || '';
			if (!acc[key_root]) {
				return {
					...acc,
					[key_root]: {
						[key_path]: value,
					},
				};
			}
			return {
				...acc,
				[key_root]: {
					...acc[key_root],
					[key_path]: value,
				},
			};
		}, {});
		const { name, username } = git_config_sh.user || {};
		return {
			HATS_AUTHOR_NAME: name || '',
			HATS_GITHUB_USERNAME: username || '',
		};
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}
