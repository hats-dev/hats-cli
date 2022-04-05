import {
	hasRequiredPrograms,
	LocalProgramType,
	whichProgram,
	whichPrograms,
} from './which';

describe('utils > functions > shell > which', function () {
	const fake_shell_program =
		'fake-shell-program' as unknown as LocalProgramType;
	const valid_programs = [LocalProgramType.npm, LocalProgramType.node];
	const fake_programs = [...valid_programs, fake_shell_program];
	test('whichProgram', function () {
		return (async function () {
			// Data
			const which_npm = await whichProgram({ program: LocalProgramType.npm });
			const which_fake = await whichProgram({
				program: fake_shell_program,
			});
			// Types
			type T = typeof which_npm;
			type Tf = typeof which_fake;
			// Tests
			expect<T>(which_npm).toBe<T>(true);
			expect<Tf>(which_fake).toBe<T>(false);
		})();
	});
	test('whichPrograms', function () {
		return (async function () {
			// Data
			const which_valid_programs = await whichPrograms({
				programs: valid_programs,
			});
			const which_fake_programs = await whichPrograms({
				programs: fake_programs,
			});
			// Types
			type T = typeof which_valid_programs;
			type Tf = typeof which_fake_programs;
			type K = LocalProgramType;
			// Tests
			expect<T>(which_valid_programs).toHaveLength(2);
			expect<T>(which_valid_programs).toContain<K>(LocalProgramType.npm);
			expect<T>(which_valid_programs).toContain<K>(LocalProgramType.node);
			expect<Tf>(which_fake_programs).toHaveLength(2);
			expect<Tf>(which_fake_programs).toContain<K>(LocalProgramType.npm);
			expect<Tf>(which_fake_programs).toContain<K>(LocalProgramType.node);
			expect<Tf>(which_fake_programs).not.toContain<K>(fake_shell_program);
		})();
	});
	test('hasRequiredPrograms', function () {
		return (async function () {
			// Data
			const installed_programs = await hasRequiredPrograms({
				programs: valid_programs,
			});
			const missing_programs = await hasRequiredPrograms({
				programs: fake_programs,
			});
			// Types
			type T = typeof installed_programs;
			type Tf = typeof missing_programs;
			// Tests
			expect<T>(installed_programs).toBe<T>(true);
			expect<Tf>(missing_programs).toBe<T>(false);
		})();
	});
});
