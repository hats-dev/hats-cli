import { LocalProgramType, whichProgram, whichPrograms } from './which';

describe('utils > functions > shell > which', function () {
	const fake_shell_program =
		'fake-shell-program' as unknown as LocalProgramType;
	const valid_programs = [LocalProgramType.npm, LocalProgramType.node];
	const fake_programs = [...valid_programs, fake_shell_program];

	test('whichProgram', function () {
		return (async function () {
			const which_npm = await whichProgram({ program: LocalProgramType.npm });
			const which_fake = await whichProgram({
				program: fake_shell_program,
			});
			type T = typeof which_npm;
			type U = typeof which_fake;
			expect<T>(which_npm).toBe<T>(true);
			expect<U>(which_fake).toBe<T>(false);
		})();
	});

	test('whichPrograms', function () {
		return (async function () {
			const which_valid_programs = await whichPrograms({
				programs: valid_programs,
			});
			const which_fake_programs = await whichPrograms({
				programs: fake_programs,
			});
			type T = typeof which_valid_programs;
			type U = typeof which_fake_programs;
			type V = LocalProgramType;
			expect<T>(which_valid_programs).toHaveLength(2);
			expect<T>(which_valid_programs).toContain<V>(LocalProgramType.npm);
			expect<T>(which_valid_programs).toContain<V>(LocalProgramType.node);
			expect<U>(which_fake_programs).toHaveLength(2);
			expect<U>(which_fake_programs).toContain<V>(LocalProgramType.npm);
			expect<U>(which_fake_programs).toContain<V>(LocalProgramType.node);
			expect<U>(which_fake_programs).not.toContain<V>(fake_shell_program);
		})();
	});
});
