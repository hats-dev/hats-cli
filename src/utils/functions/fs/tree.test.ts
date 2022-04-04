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

describe('utils > function > fs > tree > getFsTree', function () {
	// Data
	const path = `${getCwd()}/tests/tree-test-ts`;
	let fs_tree: Tree.FsEntry[] = [];

	beforeAll(function () {
		return (async function () {
			fs_tree = await Tree.getFsTree({ path });
		})();
	});

	test('locate all fs entries. assign correct type', function () {
		// Types
		type T = typeof fs_tree;
		// Tests
		expect<T>(fs_tree).toHaveLength(7);
		expect<Tree.FsDir[]>(fs_tree.filter(Tree.isDir)).toHaveLength(3);
		expect<Tree.FsFile[]>(fs_tree.filter(Tree.isFile)).toHaveLength(4);
		// Debug
		logger.log({ msg: fs_tree, debug: false });
	});

	test('lock files', function () {
		// Data
		function isTestPackageLock(fsEntry: Tree.FsEntry): boolean {
			return fsEntry.name.endsWith('test-package-lock.json');
		}
		const matches = fs_tree.filter(isTestPackageLock);
		const lock = matches[0];
		if (!lock || !Tree.isFile(lock)) {
			throw new Error();
		}
		const { ignore_replacements } = lock;
		// Types
		type T = typeof matches;
		type Ti = typeof ignore_replacements;
		// Tests
		expect<T>(matches).toHaveLength(1);
		expect<Ti>(ignore_replacements).toBe<Ti>(true);
	});

	test('module dir', function () {
		function isTestModulesDir(fsEntry: Tree.FsEntry): boolean {
			return fsEntry.name.endsWith('test_node_modules');
		}
		const test_modules_dir_matches = fs_tree.filter(isTestModulesDir);
		const modules = test_modules_dir_matches[0];
		if (!modules || !Tree.isDir(modules)) {
			throw new Error();
		}
		const { skip_search } = modules;
		// Types
		type T = typeof test_modules_dir_matches;
		type Ts = typeof skip_search;
		// Tests
		expect<T>(test_modules_dir_matches).toHaveLength(1);
		expect<Ts>(skip_search).toBe<Ts>(true);
	});

	test('module dir entries', function () {
		// Data
		function isTestModuleEntry(fsEntry: Tree.FsEntry): boolean {
			const test_modules = ['bar', 'baz', 'foo'];
			return !!test_modules.find((k) => fsEntry.name.includes(k));
		}
		const test_modules_entry_matches = fs_tree.filter(isTestModuleEntry);
		// Types
		type T = typeof test_modules_entry_matches;
		// Tests
		expect<T>(test_modules_entry_matches).toHaveLength(0);
	});
});
