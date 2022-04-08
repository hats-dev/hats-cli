import { getNodeEnv, NodeEnvType } from './env';

describe('utils > functions > node > env', function () {
	test('getNodeEnv', function () {
		const node_env = getNodeEnv();
		type T = typeof node_env;
		expect<T>(node_env).toBe<T>(NodeEnvType.test);
	});
});
