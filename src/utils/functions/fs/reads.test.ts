import getFileStr from './reads';
import { getCwd } from './path';
import { logger } from '../console/logger';

test('utils > functions > fs > reads', function () {
	return (async function () {
		// Data
		const path = `${getCwd()}/tests/reads.test.txt`;
		const str = await getFileStr({ path });
		const read_test_file_str = `Hello world
`;
		// Types
		type T = typeof str;
		// Tests
		expect<T>(str).toBe<T>(read_test_file_str);
		// Debug
		logger.log({ msg: str, debug: false });
	})();
});
