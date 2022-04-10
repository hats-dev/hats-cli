import { O } from '../../ts/sets';
import { ConfigsFromUserDefault } from '../types';
import {
	getUserDefaultConfigsCliChoices,
	parseUserDefaultConfigsCliChoices,
	printWelcome,
} from './command-line-config';

describe('configs > session-sources > command-line-config.test.ts', function () {
	const expected_cli_choices: Record<string, ConfigsFromUserDefault> = {
		'author.contact': 'HATS_AUTHOR_CONTACT',
		'author.name': 'HATS_AUTHOR_NAME',
		'github.org-username': 'HATS_GITHUB_ORG_USERNAME',
		'github.repo-access': 'HATS_GITHUB_REPO_ACCESS',
		'github.username': 'HATS_GITHUB_USERNAME',
		'license.name': 'HATS_LICENSE_NAME',
		'module.description': 'HATS_MODULE_DESCRIPTION',
		'module.keywords': 'HATS_MODULE_KEYWORDS',
		'paths.build-dir-path': 'HATS_PATHS_BUILD_DIR_PATH',
		'paths.main-module-path': 'HATS_PATHS_MAIN_MODULE_PATH',
		'paths.ts-build-root-dir-path': 'HATS_PATHS_TS_BUILD_ROOT_DIR_PATH',
		'paths.ts-build-exlude-paths': 'HATS_PATHS_TS_BUILD_EXLUDE_PATHS',
		'paths.types-dts-path': 'HATS_PATHS_TYPES_DTS_PATH',
		'scripts.changelog': 'HATS_SCRIPTS_CHANGELOG',
		'scripts.deploy': 'HATS_SCRIPTS_DEPLOY',
		'scripts.md-toc': 'HATS_SCRIPTS_MD_TOC',
	} as const;
	test('getUserDefaultConfigsCliChoices', function () {
		const choices = getUserDefaultConfigsCliChoices();
		type T = typeof choices;
		expect<T>(choices).toEqual<T>(O.keys(expected_cli_choices));
	});
	describe('parseUserDefaultConfigsCliChoices', function () {
		test.each(O.keys(expected_cli_choices))('cli config: %s', function (key) {
			expect(parseUserDefaultConfigsCliChoices({ key })).toBe(
				expected_cli_choices[key],
			);
		});
	});
	test('printWelcome', function () {
		return (async function () {
			await printWelcome();
			expect(null).toBeNull();
		})();
	});
});
