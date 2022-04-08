import getFileStr from './reads';
import { getCwd } from './path';
import { logger } from '../console/logger';

describe('utils > functions > fs > reads', function () {
	test('getFileStr', function () {
		return (async function () {
			const path = `${getCwd()}/tests/reads.test.txt`;
			const read_test_file_str = `Hello world
`;
			const str = await getFileStr({ path });
			type T = typeof str;
			expect<T>(str).toBe<T>(read_test_file_str);
			logger.log({ msg: str, debug: false });
		})();
	});
});
