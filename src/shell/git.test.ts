import { Config } from '../configs/types';
import { getCwd } from '../fs/path';
import { isGitTracked, mapTemplateFileStr } from './git';
import getFileStr from '../fs/reads';
import { local_program_types } from './which';
import { getSystemDefaultSourceConfig } from '../configs/persistent-sources/system-default-config';

describe('utils > functions > shell > git', function () {
	test('isGitTracked', function () {
		return (async function () {
			const is_git_tracked = await isGitTracked({ path: getCwd() });
			type T = typeof is_git_tracked;
			expect<T>(is_git_tracked).toBe<T>(true);
		})();
	});
	test('mapTemplateFileStr', function () {
		return (async function () {
			const path = `${getCwd()}/tests/git-test-ts/package.test.json`;
			const prev = await getFileStr({ path });
			const params: Config = {
				HATS_AUTHOR_CONTACT: 'sergio@email.com',
				HATS_AUTHOR_NAME: 'Sergio Kitchens',
				HATS_GITHUB_ORG_USERNAME: 'sergio',
				HATS_GITHUB_REPO: 'happy-ts-lib',
				HATS_GITHUB_USERNAME: 'sergio',
				HATS_LICENSE_BODY: 'test-license-body',
				HATS_LICENSE_YEAR: 'test-license-year',
				HATS_MODULE_DESCRIPTION: 'test-module-description',
				HATS_MODULE_DISPLAY_NAME: 'Happy TS Lib',
				HATS_MODULE_NAME: 'happy-ts-lib',
				HATS_RUNTIME_PROGRAMS: local_program_types,
				HATS_RUNTIME_ROOT_DIR_NAME: 'happy-ts-lib',
				HATS_RUNTIME_SKIP_INTERACTIVE: false,
				...getSystemDefaultSourceConfig({
					HATS_RUNTIME_PROGRAMS: local_program_types,
				}),
			};
			const mapped_template_file = mapTemplateFileStr({ params, prev });
			const expected_mapped_template_file = `{
	"author": "Sergio Kitchens",
	"bugs": "https://github.com/sergio/happy-ts-lib/issues",
	"dependencies": {},
	"devDependencies": {
		"@types/jest": "^27.4.1",
		"@typescript-eslint/eslint-plugin": "^5.15.0",
		"@typescript-eslint/parser": "^5.15.0",
		"auto-changelog": "^2.4.0",
		"eslint": "^8.11.0",
		"eslint-config-prettier": "^8.5.0",
		"eslint-import-resolver-typescript": "^2.5.0",
		"eslint-plugin-import": "^2.25.4",
		"eslint-plugin-jest": "^26.1.1",
		"eslint-plugin-node": "^11.1.0",
		"eslint-plugin-promise": "^6.0.0",
		"jest": "^27.5.1",
		"prettier": "2.5.1",
		"ts-jest": "^27.1.3",
		"typescript": "^4.6.2"
	},
	"description": "test-module-description",
	"engines": {
		"node": ">=11.14"
	},
	"homepage": "https://github.com/sergio/happy-ts-lib",
	"jest": {
		"errorOnDeprecated": true,
		"preset": "ts-jest",
		"testEnvironment": "node",
		"verbose": true
	},
	"keywords": ["typescript"],
	"license": "BSD-3-Clause",
	"main": "dist/index.js",
	"name": "happy-ts-lib",
	"prettier": {
		"arrowParens": "always",
		"bracketSpacing": true,
		"bracketSameLine": true,
		"printWidth": 80,
		"quoteProps": "as-needed",
		"semi": true,
		"singleQuote": true,
		"tabWidth": 2,
		"trailingComma": "all",
		"useTabs": true
	},
	"repository": {
		"type": "git",
		"url": "git://github.com/sergio/happy-ts-lib.git"
	},
	"scripts": {
		"clean-deps": "rm -rf node_modules",
		"clean-build": "rm -rf dist/",
		"clean": "npm run clean-deps && npm run clean-build",
		"predev-build": "npm run clean-build",
		"dev-build": "NODE_ENV=development && tsc -p tsconfig-build.json",
		"prebuild": "npm run clean-build",
		"build": "NODE_ENV=production && tsc -p tsconfig-build.json",
		"ts-silent-build": "tsc --project ./tsconfig.json --noEmit",
		"prelint": "npm run ts-silent-build",
		"lint": "eslint . --ext .js,.jsx,.ts,.tsx",
		"prelint-fix": "npm run ts-silent-build",
		"lint-fix": "eslint --fix . --ext .js,.jsx,.ts,.tsx",
		"prettify": "npx prettier --write .",
		"test": "jest",
		"validate": "git pull --ff-only && npm i && npm run test && npm run lint",
		"stage": "npm run prettify && git add .",
		"push": "git push && git push --tags",
		"precommit": "npm run validate && doctoc .",
		"commit": "npm run stage && git commit",
		"postcommit": "npm run push",
		"preversion": "npm run validate",
		"version": "auto-changelog -p && npm run stage",
		"postversion": "npm run push && npm run build && npm publish --access=restricted"
	},
	"type": "commonjs",
	"types": "dist/index.d.ts",
	"version": "1.0.0-alpha.0"
}
`;
			type T = typeof mapped_template_file;
			expect<T>(mapped_template_file).toBe<T>(expected_mapped_template_file);
			// logger.log({ msg: mapped_template_file, stringify: false });
		})();
	});
});
