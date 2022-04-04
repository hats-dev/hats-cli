import { whichFile } from './which';

test('utils > functions > shell > which', function () {
	return (async function () {
		// Data
		const npm_file = await whichFile({ program: 'npm' });
		const fake_file = await whichFile({ program: 'fake-shell-program' });
		// Types
		type T = typeof npm_file;
		type Tf = typeof fake_file;
		// Tests
		expect<T>(npm_file).toBe<T>(true);
		expect<Tf>(fake_file).toBe<T>(false);
	})();
});
