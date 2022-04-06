import { logger } from '../console/logger';
import { getCwd } from './path';
import * as Tree from './tree';

const test_tree = `tests/tree-test-ts/
├── dir
│   ├── dir-file.test.txt
│   ├── nested-dir
│   │   ├── nested-dir-file.test.txt
│   │   └── test-package-lock.json
│   └── test_node_modules
│       ├── bar
│       │   └── bar.test.txt
│       ├── baz
│       │   └── baz.test.txt
│       └── foo
│           └── foo.test.txt
└── file.test.txt`;
test_tree;

describe('utils > function > fs > tree', function () {
	const path = `${getCwd()}/tests/tree-test-ts`;
	let fs_tree: Tree.FsEntry[] = [];

	beforeAll(function () {
		return (async function () {
			fs_tree = await Tree.getFsTree({ path });
		})();
	});

	test('getFsTree: entries', function () {
		type T = typeof fs_tree;
		type U = Tree.FsDir[];
		type V = Tree.FsFile[];
		expect<T>(fs_tree).toHaveLength(7);
		expect<U>(fs_tree.filter(Tree.isDir)).toHaveLength(3);
		expect<V>(fs_tree.filter(Tree.isFile)).toHaveLength(4);
		logger.log({ msg: fs_tree, debug: false });
	});

	test('getFsTree: lock files', function () {
		function isTestPackageLock(fsEntry: Tree.FsEntry): boolean {
			return fsEntry.name.endsWith('test-package-lock.json');
		}
		const matches = fs_tree.filter(isTestPackageLock);
		const lock = matches[0];
		if (!lock || !Tree.isFile(lock)) {
			throw new Error();
		}
		const { ignore_replacements } = lock;
		type T = typeof matches;
		type U = typeof ignore_replacements;
		expect<T>(matches).toHaveLength(1);
		expect<U>(ignore_replacements).toBe<U>(true);
	});

	test('getFsTree: module directories', function () {
		function isTestModulesDir(fsEntry: Tree.FsEntry): boolean {
			return fsEntry.name.endsWith('test_node_modules');
		}
		const test_modules_dir_matches = fs_tree.filter(isTestModulesDir);
		const modules = test_modules_dir_matches[0];
		if (!modules || !Tree.isDir(modules)) {
			throw new Error();
		}
		const { skip_search } = modules;
		type T = typeof test_modules_dir_matches;
		type U = typeof skip_search;
		expect<T>(test_modules_dir_matches).toHaveLength(1);
		expect<U>(skip_search).toBe<U>(true);
	});

	test('getFsTree: module directory entries', function () {
		function isTestModuleEntry(fsEntry: Tree.FsEntry): boolean {
			const test_modules = ['bar', 'baz', 'foo'];
			return !!test_modules.find((k) => fsEntry.name.includes(k));
		}
		const test_modules_entry_matches = fs_tree.filter(isTestModuleEntry);
		type T = typeof test_modules_entry_matches;
		expect<T>(test_modules_entry_matches).toHaveLength(0);
	});
});
