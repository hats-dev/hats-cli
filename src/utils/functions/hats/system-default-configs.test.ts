import { O } from '../../ts/sets';
import {
	LocalProgramType,
	local_program_types,
	whichPrograms,
} from '../shell/which';
import { ArrayConfigs, Config, configs, scripts_configs } from './configs';
import {
	default_script_map,
	getDefaultConfig,
	getDefaultScript,
	getDefaultScripts,
	fallback_script,
	DefaultScriptConfigs,
} from './system-default-configs';

describe('utils > functions > hats > system-default-configs', function () {
	const all_programs = local_program_types.map((t) => LocalProgramType[t]);
	const only_default_scripts: DefaultScriptConfigs = scripts_configs.reduce(
		function (acc, k) {
			return {
				...acc,
				[k]: default_script_map[k].default_script,
			};
		},
		{} as DefaultScriptConfigs,
	);
	const only_fallback_scripts: DefaultScriptConfigs = scripts_configs.reduce(
		function (acc, k) {
			return {
				...acc,
				[k]: fallback_script,
			};
		},
		{} as DefaultScriptConfigs,
	);

	enum TestCaseType {
		if_installed = 'if_installed',
		if_missing = 'if_missing',
		current_machine = 'current_machine',
	}
	type TestCase = {
		expected: DefaultScriptConfigs;
		local_programs: LocalProgramType[];
	};
	const test_cases: Record<TestCaseType, TestCase> = {
		if_installed: {
			expected: only_default_scripts,
			local_programs: all_programs,
		},
		if_missing: {
			expected: only_fallback_scripts,
			local_programs: [],
		},
		current_machine: {
			expected: only_default_scripts,
			local_programs: [],
		},
	};
	const test_case_keys = O.keys(test_cases);

	beforeAll(function () {
		return (async function () {
			const which_programs = await whichPrograms({
				programs: all_programs,
			});
			test_cases.current_machine.local_programs = which_programs;
		})();
	});

	test.each(test_case_keys)(
		'test case: %s: getDefaultScript',
		function (test_case) {
			const {
				[test_case]: { expected, local_programs },
			} = test_cases;
			scripts_configs.forEach(function (script_config) {
				const script = getDefaultScript({
					default_script_map,
					local_programs,
					script_config,
				});
				type T = typeof script;
				expect<T>(script).toBe<T>(expected[script_config]);
			});
		},
	);

	test.each(test_case_keys)(
		'test case: %s: getDefaultScripts',
		function (test_case) {
			const {
				[test_case]: { expected, local_programs },
			} = test_cases;
			const scripts = getDefaultScripts({
				default_script_map,
				local_programs,
			});
			type T = typeof scripts;
			expect<T>(scripts).toEqual<T>(expected);
		},
	);

	test.each(test_case_keys)(
		`test case: %s: getDefaultConfigMap`,
		function (test_case) {
			const {
				[test_case]: { local_programs },
			} = test_cases;
			const config = getDefaultConfig({
				local_programs,
			});
			type T = Config;
			const array_config_map: Record<ArrayConfigs, null> = {
				'HATS.MODULE.KEYWORDS': null,
				'HATS.PATHS.TS_BUILD_EXLUDE_PATHS': null,
				'HATS.RUNTIME.PROGRAMS': null,
			};
			const array_configs = O.keys(array_config_map);
			const config_match = configs.reduce(function (acc, k) {
				return {
					...acc,
					[k]: array_configs.includes(k as ArrayConfigs)
						? (expect.any(Array) as string[])
						: (expect.stringContaining('') as string),
				};
			}, {} as Partial<T>);
			expect<T>(config).toMatchObject(
				expect.objectContaining<Partial<T>>(config_match),
			);
		},
	);
});
