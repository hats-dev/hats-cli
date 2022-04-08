import { O } from '../../../ts/sets';
import { getDisplayName } from './format-display-names';

describe('utils > functions > configs > config-builder > format-display-names', function () {
	describe('getDisplayName', function () {
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
			expect(getDisplayName({ str: example })).toBe(examples[example]);
		});
	});
});
