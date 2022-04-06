import { logger } from '../console/logger';
import { getCwd } from '../fs/path';
import { getGitUserConfigs, isGitTracked } from './git';

describe('utils > functions > shell > git', function () {
	test('isGitTracked', function () {
		return (async function () {
			const is_git_tracked = await isGitTracked({ path: getCwd() });
			type T = typeof is_git_tracked;
			expect<T>(is_git_tracked).toBe<T>(true);
		})();
	});
	test('getGitUserConfigs', function () {
		return (async function () {
			const git_configs = await getGitUserConfigs();
			type T = typeof git_configs;
			expect<T>(git_configs).toMatchObject(
				expect.objectContaining<T>({
					user: {
						name: expect.stringContaining('') as string,
						email: expect.stringContaining('') as string,
						username: expect.stringContaining('') as string,
					},
				}),
			);
			logger.log({ msg: git_configs, debug: false });
		})();
	});
});
