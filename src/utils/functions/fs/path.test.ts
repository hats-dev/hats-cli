import { getCwd, getRootDirPath } from './path';
import { O } from '../../ts/sets';

describe('utils > functions > fs > path', function () {
	enum TestCaseType {
		getCwd = 'getCwd',
		getRootDirPath = 'getRootDirPath',
	}
	const test_cases: Record<TestCaseType, string | undefined> = {
		getCwd: undefined,
		getRootDirPath: undefined,
	};
	beforeAll(function () {
		test_cases.getCwd = getCwd();
		test_cases.getRootDirPath = getRootDirPath({
			HATS_RUNTIME_ROOT_DIR_NAME: 'foo',
		});
	});
	test.each(O.keys(test_cases))('test case: %s', function (test_case) {
		const result = test_cases[test_case];
		const result_type = typeof result;
		type T = typeof result_type;
		expect<T>(result_type).toBe<T>('string');
	});
});
