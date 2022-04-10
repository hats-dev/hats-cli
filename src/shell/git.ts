import { getRootDirPath, PathFnParams } from '../fs/path';
import exec from '../node/exec';
import { logger, type LoggerFnOptions } from '../console/logger';
import { Config, GithubConfig } from '../configs/types';
import { LocalProgramType } from './which';
import { getFsTree, isFile } from '../fs/tree';
import getFileStr from '../fs/reads';
import writeStrToFile from '../fs/writes';
import { O } from '../ts/sets';
import { getStaticSystemDefaultSourceConfig } from '../configs/persistent-sources/system-default-config';

export type IsGitTrackedParams = PathFnParams & LoggerFnOptions;
export async function isGitTracked(
	params: IsGitTrackedParams,
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

type ScaffoldRepoParams = Pick<Config, 'HATS_RUNTIME_ROOT_DIR_NAME'> &
	LoggerFnOptions;
export async function scaffoldRepo(params: ScaffoldRepoParams): Promise<void> {
	try {
		const library_repo_url =
			'https://github.com/hats-dev/hats-template-library.git';
		const sh_scaffold_repo = `\
git clone ${library_repo_url} ${params.HATS_RUNTIME_ROOT_DIR_NAME} \
&& rm -rf ${getRootDirPath(params)}/.git\
`;
		await exec(sh_scaffold_repo);
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}

type MapTemplateFileStrParams = { prev: string; params: Config };
export function mapTemplateFileStr({ prev, params }: MapTemplateFileStrParams) {
	let copy = prev.slice();
	O.keys(params).forEach(function (config) {
		const value = params[config];
		copy = copy.replace(
			new RegExp(config, 'g'),
			typeof value === 'string' ? value : JSON.stringify(params[config]),
		);
	});
	return copy;
}

type ReplaceRepoPlaceholdersParams = Config & LoggerFnOptions;
export async function replaceRepoPlaceholders(
	params: ReplaceRepoPlaceholdersParams,
): Promise<void> {
	try {
		const fs_tree = await getFsTree({
			path: getRootDirPath(params),
		});
		const replacements = fs_tree
			.filter(isFile)
			.filter((f) => !f.ignore_replacements);

		await Promise.all([
			...replacements.map(async function (replacement) {
				const { path } = replacement;
				const prev = await getFileStr({ path });
				const str = mapTemplateFileStr({ params, prev });
				await writeStrToFile({ path, str });
			}),
			...[params.HATS_PATHS_TS_BUILD_ROOT_DIR_PATH].map(async function (p) {
				const static_system_default_source_config =
					getStaticSystemDefaultSourceConfig();
				if (
					p !==
					static_system_default_source_config.HATS_PATHS_TS_BUILD_ROOT_DIR_PATH
				) {
					const root_dir_path = getRootDirPath(params);
					const mv_script = `mv ${root_dir_path}/${static_system_default_source_config.HATS_PATHS_TS_BUILD_ROOT_DIR_PATH} ${root_dir_path}/${p}`;
					await exec(mv_script);
				}
			}),
		]);
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}

export enum GithubRepoAccessType {
	private = 'private',
	public = 'public',
}
type InitRemoteParams = GithubConfig &
	Pick<
		Config,
		| 'HATS_MODULE_DESCRIPTION'
		| 'HATS_RUNTIME_ROOT_DIR_NAME'
		| 'HATS_RUNTIME_PROGRAMS'
	> &
	LoggerFnOptions;
export async function initRepo(params: InitRemoteParams): Promise<void> {
	try {
		const code_found = params.HATS_RUNTIME_PROGRAMS.includes(
			LocalProgramType.code,
		);
		const init_repo_script = `
cd ${getRootDirPath(params)} \
&& npm i \
&& git init \
&& git add . \
&& git commit -m 'initial commit' \
&& gh repo create ${params.HATS_GITHUB_ORG_USERNAME}/${
			params.HATS_GITHUB_REPO
		} --${
			params.HATS_GITHUB_REPO_ACCESS
		} --source=. --remote=origin --description="${
			params.HATS_MODULE_DESCRIPTION
		}" --push \
${code_found ? '&& code .' : ''}\
		`;
		await exec(init_repo_script);
	} catch (msg) {
		logger.error({ msg, prod: true, ...params });
		throw new Error();
	}
}
