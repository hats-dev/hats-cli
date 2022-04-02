import { O } from './sets';

test('utils > ts > sets > O', function () {
	const foo = {
		b: null,
		a: null,
		r: null,
	} as const;
	const foo_keys = O.keys(foo);
	// Contains
	expect(foo_keys).toContain('b');
	expect(foo_keys).toContain('a');
	expect(foo_keys).toContain('r');
	// Length
	expect(foo_keys).toHaveLength(3);
	// Order
	const foo_keys_explicit = ['b', 'a', 'r'];
	expect(foo_keys).toStrictEqual(foo_keys_explicit);
	const foo_keys_wrong_order = ['r', 'b', 'a'];
	expect(foo_keys).not.toStrictEqual(foo_keys_wrong_order);
});
