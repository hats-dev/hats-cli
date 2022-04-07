import { getCwd } from '../fs/path';
import { isGitTracked } from './git';

describe('utils > functions > shell > git', function () {
	test('isGitTracked', function () {
		return (async function () {
			const is_git_tracked = await isGitTracked({ path: getCwd() });
			type T = typeof is_git_tracked;
			expect<T>(is_git_tracked).toBe<T>(true);
		})();
	});
});
