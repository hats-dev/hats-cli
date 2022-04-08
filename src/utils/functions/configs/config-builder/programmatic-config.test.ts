import { O } from '../../../ts/sets';
import { getModuleDisplayName } from './programmatic-config';

describe('utils > functions > configs > config-builder > programmatic-config', function () {
	describe('getModuleDisplayName', function () {
		const examples = {
			foo: 'Foo',
			'happy-typescript': 'Happy TypeScript',
			'happy-typescript-and-more-typescript':
				'Happy TypeScript And More TypeScript',
			'ts-helper-package': 'TS Helper Package',
			'random-js-library': 'Random JS Library',
			'javascript-library': 'JavaScript Library',
		} as const;
		test.each(O.keys(examples))('test %s', function (example) {
			expect(
				getModuleDisplayName({ prev_config: { HATS_MODULE_NAME: example } }),
			).toBe(examples[example]);
		});
	});
});
