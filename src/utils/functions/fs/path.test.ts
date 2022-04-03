import { logger } from '../console/logger';
import { getCwd, getProjectRoot } from './path';

test('utils > functions > fs > path', function () {
	// Data
	const cwd = getCwd();
	const project_root = getProjectRoot({ paths_root_folder: 'foo' });
	[{ str: cwd }, { str: project_root }].forEach((s) => {
		// Types
		const str_type = typeof s.str;
		type T = typeof str_type;
		// Tests
		expect<T>(str_type).toBe<T>('string');
		// Debug
		logger.log({ msg: s, debug: false });
	});
});
