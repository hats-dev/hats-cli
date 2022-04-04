import { ConfigType, RUNTIME } from '../../constants/configs';
import { logger } from '../console/logger';
import { getCwd, getRootDirPath } from './path';

test('utils > functions > fs > path', function () {
	// Data
	const cwd = getCwd();
	const root_dir_path = getRootDirPath({
		[ConfigType.RUNTIME]: {
			[RUNTIME.ROOT_DIR_NAME]: 'foo',
		},
	});
	[{ str: cwd }, { str: root_dir_path }].forEach((s) => {
		// Types
		const str_type = typeof s.str;
		type T = typeof str_type;
		// Tests
		expect<T>(str_type).toBe<T>('string');
		// Debug
		logger.log({ msg: s, debug: false });
	});
});
