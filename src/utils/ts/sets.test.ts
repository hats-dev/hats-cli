import { O } from './sets';

test('utils > ts > sets > O > objects', function () {
	// Data
	const foo = {
		b: null,
		a: null,
		r: null,
	} as const;
	const foo_keys = O.keys(foo);
	// Types
	type T = typeof foo_keys;
	type K = T[number];
	// Tests: Contains
	expect<T>(foo_keys).toContain<K>('b');
	expect<T>(foo_keys).toContain<K>('a');
	expect<T>(foo_keys).toContain<K>('r');
	// Tests: Length
	expect<T>(foo_keys).toHaveLength(3);
	// Tests: Order
	const foo_keys_in_order: T = ['b', 'a', 'r'];
	const foo_keys_wrong_order: T = ['r', 'b', 'a'];
	expect<T>(foo_keys).toStrictEqual<T>(foo_keys_in_order);
	expect<T>(foo_keys).not.toStrictEqual<T>(foo_keys_wrong_order);
});

test('utils > ts > sets > O > enums', function () {
	// Data
	enum Foo {
		b = 'b',
		a = 'a',
		r = 'r',
	}
	const foo_keys = O.keys(Foo);
	// Types
	type T = typeof foo_keys;
	type K = T[number];
	// Tests: Contains
	expect<T>(foo_keys).toContain<K>(Foo.b);
	expect<T>(foo_keys).toContain<K>('b');
	expect<T>(foo_keys).toContain<K>(Foo.a);
	expect<T>(foo_keys).toContain<K>('a');
	expect<T>(foo_keys).toContain<K>(Foo.r);
	expect<T>(foo_keys).toContain<K>('r');
	// Tests: Length
	expect<T>(foo_keys).toHaveLength(3);
	// Tests: Order
	const foo_keys_in_order: T = [Foo.b, Foo.a, Foo.r];
	const foo_keys_exp_in_order: T = ['b', 'a', 'r'];
	const foo_keys_wrong_order: T = [Foo.r, Foo.b, Foo.a];
	const foo_keys_exp_wrong_order: T = ['r', 'b', 'a'];
	expect<T>(foo_keys).toStrictEqual<T>(foo_keys_in_order);
	expect<T>(foo_keys).toStrictEqual<T>(foo_keys_exp_in_order);
	expect<T>(foo_keys).not.toStrictEqual<T>(foo_keys_wrong_order);
	expect<T>(foo_keys).not.toStrictEqual<T>(foo_keys_exp_wrong_order);
});
