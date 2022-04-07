import { Config, ConfigsFromUserDefault } from '../types';
import {
	getHomeConfigPath,
	getUserDefaultSourceConfig,
	saveUserDefaultSourceConfig,
} from './user-default-config';

describe('utils > functions > configs > persistent-sources > user-default-config', function () {
	test('getHomeConfigPath', function () {
		return (async function () {
			const path = await getHomeConfigPath({ debug_file: true });
			const path_type = typeof path;
			type T = typeof path_type;
			expect<T>(path_type).toBe<T>('string');
			expect<T>(path_type).not.toBe<T>('undefined');
		})();
	});
	const expected_debug_source = { hello: 'world' };
	describe('getUserDefaultSourceConfig', function () {
		test.each([true, false])('debug_file: %s', function (debug_file) {
			return (async function () {
				const source = await getUserDefaultSourceConfig({
					debug_file,
				});
				if (debug_file) {
					expect<typeof source>(source).toEqual(
						expect.objectContaining(expected_debug_source),
					);
				} else {
					const source_type = typeof source;
					type T = typeof source_type;
					expect<T>(source_type).toBe<T>('object');
					expect<T>(source_type).not.toBe<T>('undefined');
				}
			})();
		});
	});
	describe('saveUserDefaultSourceConfig', function () {
		test.each([
			{ debug_file: true, i: 0 },
			{ debug_file: true, i: 1 },
		])(`debug_file: %s`, function (params) {
			return (async function () {
				const { debug_file, i } = params;
				const merge_config = (i === 0
					? {
							random: 'str',
							hello: 'universe',
					  }
					: expected_debug_source) as unknown as Partial<
					Pick<Config, ConfigsFromUserDefault>
				>;
				const next_source = await saveUserDefaultSourceConfig({
					debug_file,
					merge_config,
				});
				expect<typeof next_source>(next_source).toEqual(
					expect.objectContaining({
						random: 'str',
						hello: i === 0 ? 'universe' : 'world',
					}),
				);
			})();
		});
	});
});
