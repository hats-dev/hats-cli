import { Keys, O } from './sets';

describe('utils > ts > sets', function () {
	describe('O.keys', function () {
		describe('with objects', function () {
			const foo = {
				b: null,
				a: null,
				r: null,
			} as const;
			const foo_keys = O.keys(foo);
			type T = typeof foo_keys;
			type U = Keys<typeof foo>;
			test('entries', function () {
				expect<T>(foo_keys).toContain<U>('b');
				expect<T>(foo_keys).toContain<U>('a');
				expect<T>(foo_keys).toContain<U>('r');
			});
			test('length', function () {
				expect<T>(foo_keys).toHaveLength(3);
			});
			test('order', function () {
				const foo_keys_in_order: T = ['b', 'a', 'r'];
				const foo_keys_wrong_order: T = ['r', 'b', 'a'];
				expect<T>(foo_keys).toStrictEqual<T>(foo_keys_in_order);
				expect<T>(foo_keys).not.toStrictEqual<T>(foo_keys_wrong_order);
			});
		});
		describe('with enums', function () {
			enum Foo {
				b = 'b',
				a = 'a',
				r = 'r',
			}
			const foo_keys = O.keys(Foo);
			type T = typeof foo_keys;
			type U = Keys<typeof Foo>;
			test('entries', function () {
				expect<T>(foo_keys).toContain<U>(Foo.b);
				expect<T>(foo_keys).toContain<U>('b');
				expect<T>(foo_keys).toContain<U>(Foo.a);
				expect<T>(foo_keys).toContain<U>('a');
				expect<T>(foo_keys).toContain<U>(Foo.r);
				expect<T>(foo_keys).toContain<U>('r');
			});
			test('length', function () {
				expect<T>(foo_keys).toHaveLength(3);
			});
			test('order', function () {
				const foo_keys_in_order: T = [Foo.b, Foo.a, Foo.r];
				const foo_keys_exp_in_order: T = ['b', 'a', 'r'];
				const foo_keys_wrong_order: T = [Foo.r, Foo.b, Foo.a];
				const foo_keys_exp_wrong_order: T = ['r', 'b', 'a'];
				expect<T>(foo_keys).toStrictEqual<T>(foo_keys_in_order);
				expect<T>(foo_keys).toStrictEqual<T>(foo_keys_exp_in_order);
				expect<T>(foo_keys).not.toStrictEqual<T>(foo_keys_wrong_order);
				expect<T>(foo_keys).not.toStrictEqual<T>(foo_keys_exp_wrong_order);
			});
		});
	});
});
