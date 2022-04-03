import { logger } from '../console/logger';
import { getCwd } from '../fs/path';
import { getGitUserConfigs, isGitTracked } from './git';

test('utils > functions > shell > git > isGitTracked', function () {
	return (async function () {
		// Data
		const is_git_tracked = await isGitTracked({ path: getCwd() });
		// Types
		type T = typeof is_git_tracked;
		// Tests
		expect<T>(is_git_tracked).toBe<T>(true);
	})();
});

test('utils > functions > shell > git > getGitUserConfigs', function () {
	return (async function () {
		// Data
		const git_configs = await getGitUserConfigs();
		// Types
		type T = typeof git_configs;
		// Tests
		expect<T>(git_configs).toBeTruthy();
		// Debug
		logger.log({ msg: git_configs, debug: false });
	})();
});
