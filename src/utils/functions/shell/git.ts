// import { whichFile } from './which';
import { PathFnParams } from '../fs/path';
// import { getRootDirPath, PathFnParams } from '../fs/path';
import exec from '../node/exec';
// import {
// 	GithubConfig,
// 	ModuleConfig,
// 	Paths,
// } from '../../constants/configs';
// import { library_repo_url } from '../../constants/urls';
import { logger, type LoggerFnOptions } from '../console/logger';
import { EmptyObject } from '../../ts/objects';

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

type GitUser = {
	name?: string;
	email?: string;
	username?: string;
};
type GitUserConfig = { user?: GitUser };
export type GitConfigs = Record<string, Record<string, string>>;
export type GetGitConfigsParams = typeof EmptyObject;
export async function getGitUserConfigs(
	params: GetGitConfigsParams & LoggerFnOptions = {},
): Promise<GitUserConfig> {
	try {
		const get_git_user_configs_sh = 'git config --list --global';
		const { stdout } = await exec(get_git_user_configs_sh);
		const configs = stdout.split('\n').filter((config) => config);
		return configs.reduce(function (acc: GitConfigs, config) {
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
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}

/* TODO
export type ScaffoldRepoParams = Paths;
export async function scaffoldRepo(
	params: ScaffoldRepoParams & LoggerFnOptions,
): Promise<void> {
	try {
		const sh_scaffold_repo = `\
git clone ${library_repo_url} ${params.root_dir_name} \
&& rm -rf ${getRootDirPath(params)}/.git\
`;
		await exec(sh_scaffold_repo);
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}

type InitRemoteParams = ModuleConfig &
	Paths &
	GithubConfig &
	LoggerFnOptions;
export async function initRepo(params: InitRemoteParams): Promise<void> {
	try {
		const [gh_found, code_found] = await Promise.all(
			['gh', 'code'].map((program) => whichFile({ program })),
		);
		if (!gh_found) {
			throw new Error(
				"Oops! Couldn't find the gh cli. Please install and try again https://cli.github.com/",
			);
		}
		const init_repo_script = `
cd ${getRootDirPath(params)} \
&& npm i \
&& git init \
&& git add . \
&& git commit -m 'initial commit' \
&& gh repo create ${params.gh_org_username}/${params.gh_repo} --${
			params.gh_repo_access
		} --source=. --remote=origin --description="${params.description}" --push \
${code_found ? '&& code .' : ''}\
		`;
		await exec(init_repo_script);
	} catch (msg) {
		logger.error({ msg, prod: true, ...params });
		throw new Error();
	}
}
*/
