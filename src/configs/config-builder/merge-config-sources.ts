import { LocalProgramParams } from '../../shell/which';
import { exact } from '../../ts/objects';
import merge_sequence, { CurrentConfig, isMergeIndex } from './sequence';
import { logger, LoggerFnOptions } from '../../console/logger';
import { getSystemDefaultSourceConfig } from '../persistent-sources/system-default-config';
import { Config, ConfigSource, CommandLineSourceConfig } from '../types';
import { getGitDefaultSourceConfig } from '../persistent-sources/git-default-config';
import { getUserDefaultSourceConfig } from '../persistent-sources/user-default-config';
import { getPromptSourceConfig } from '../session-sources/prompt-config';
import { getProgrammaticConfig } from './programmatic-config';

type Rt = Awaited<Promise<ReturnType<typeof mergeConfigSources>>>;
type MergeConfigSourcesParams = {
	[K in `${ConfigSource.command_line}_configs`]: CommandLineSourceConfig;
} & LocalProgramParams &
	LoggerFnOptions;
export async function mergeConfigSources(
	params: MergeConfigSourcesParams,
): Promise<Config> {
	try {
		const { command_line_configs, HATS_RUNTIME_PROGRAMS } = params;
		const merge_tasks = merge_sequence.map(function (_, i) {
			if (!isMergeIndex(i)) {
				throw new Error();
			}
			return async function (prev: Config) {
				function merge<T extends Partial<Config>>(next: T) {
					return {
						...prev,
						...next,
					};
				}
				switch (i) {
					case 0: {
						return prev;
					}
					case 1: {
						const next: CurrentConfig<typeof i> = command_line_configs;
						return merge(next);
					}
					case 2: {
						const next: CurrentConfig<typeof i> =
							await getGitDefaultSourceConfig(params);
						return merge(next);
					}
					case 3: {
						const next: CurrentConfig<typeof i> =
							await getUserDefaultSourceConfig(params);
						return merge(next);
					}
					case 4: {
						const next: CurrentConfig<typeof i> =
							prev.HATS_RUNTIME_SKIP_INTERACTIVE
								? {}
								: await getPromptSourceConfig(prev);
						return merge(next);
					}
					case 5: {
						const next: CurrentConfig<typeof i> = getProgrammaticConfig(prev);
						return merge(next);
					}
					default:
						throw new Error();
				}
			};
		});
		const init_config: Config = {
			HATS_AUTHOR_CONTACT: '',
			HATS_AUTHOR_NAME: '',
			HATS_GITHUB_ORG_USERNAME: '',
			HATS_GITHUB_REPO: '',
			HATS_GITHUB_USERNAME: '',
			HATS_LICENSE_BODY: '',
			HATS_LICENSE_YEAR: '',
			HATS_MODULE_DESCRIPTION: '',
			HATS_MODULE_DISPLAY_NAME: '',
			HATS_MODULE_NAME: '',
			HATS_RUNTIME_PROGRAMS,
			HATS_RUNTIME_ROOT_DIR_NAME: '',
			HATS_RUNTIME_SKIP_INTERACTIVE: false,
			...getSystemDefaultSourceConfig(params),
		};
		return exact<Rt>()(
			await merge_tasks.reduce(
				(acc, fn) => acc.then(fn),
				Promise.resolve(init_config),
			),
		);
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}
