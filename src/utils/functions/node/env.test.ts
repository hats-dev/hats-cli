import { getNodeEnv, NodeEnvType } from './env';

test('utils > functions > node > env > getNodeEnv', function () {
	// Data
	const node_env = getNodeEnv();
	// Types
	type T = typeof node_env;
	// Tests
	expect<T>(node_env).toBe<T>(NodeEnvType.test);
});
