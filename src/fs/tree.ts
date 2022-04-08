import {
	scandir as scandirSync,
	Settings as scandirSettings,
	type Entry as ScandirEntry,
} from '@nodelib/fs.scandir';
import util from 'util';
import { logger, LoggerFnOptions } from '../console/logger';
import { PathFnParams } from './path';

enum FsEntryType {
	dir = 'dir',
	file = 'file',
}
export type FsEntryData = {
	name: string;
	path: string;
	type: FsEntryType;
};
export type FsDir = FsEntryData & {
	skip_search: boolean;
	type: FsEntryType.dir;
};
export type FsFile = FsEntryData & {
	ignore_replacements: boolean;
	type: FsEntryType.file;
};
export type FsEntry = FsDir | FsFile;

function getFsEntryType(
	scandirEntryWithStats: Required<ScandirEntry>,
): FsEntryType {
	const mode_str = scandirEntryWithStats.stats.mode.toString();
	const is_dir = mode_str.startsWith('16');
	const is_file = mode_str.startsWith('33');
	const valid_fs_mode = is_dir || is_file;
	if (!valid_fs_mode) {
		logger.error({ msg: scandirEntryWithStats });
		throw new Error();
	}
	return is_file ? FsEntryType.file : FsEntryType.dir;
}

function skipDirSearch({ name }: { name: string }): boolean {
	return name.includes('modules');
}
function ignoreFileReplacements({ name }: { name: string }): boolean {
	return name.includes('lock');
}
function scandirEntryToFsEntry(scandirEntry: Required<ScandirEntry>): FsEntry {
	const { name, path } = scandirEntry;
	const type = getFsEntryType(scandirEntry);
	switch (type) {
		case FsEntryType.dir: {
			return {
				name,
				path,
				skip_search: skipDirSearch(scandirEntry),
				type,
			};
		}
		case FsEntryType.file: {
			return {
				ignore_replacements: ignoreFileReplacements(scandirEntry),
				name,
				path,
				type,
			};
		}
		default: {
			throw new Error();
		}
	}
}

type GetFsEntriesParams = PathFnParams & LoggerFnOptions;
async function getFsEntries(params: GetFsEntriesParams): Promise<FsEntry[]> {
	try {
		const scandir_entries = (await util.promisify(scandirSync)(
			params.path,
			new scandirSettings({ stats: true }),
		)) as Required<ScandirEntry>[];
		return scandir_entries.map(scandirEntryToFsEntry);
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}

export function isDir(fsEntry: FsEntry): fsEntry is FsDir {
	return fsEntry.type === FsEntryType.dir;
}
function shouldSearchDir(fsDir: FsDir): boolean {
	return !fsDir.skip_search;
}
export function isFile(fsEntry: FsEntry): fsEntry is FsFile {
	return fsEntry.type === FsEntryType.file;
}
export type GetFsTreeParams = GetFsEntriesParams;
export async function getFsTree(params: GetFsTreeParams): Promise<FsEntry[]> {
	try {
		const fs_entries: FsEntry[] = await getFsEntries(params);
		const search_dirs = fs_entries.filter(isDir).filter(shouldSearchDir);
		const tasks = search_dirs.map((search_dir) =>
			getFsTree({ path: search_dir.path }),
		);
		const res = await Promise.all(tasks);
		const nested_fs_entries = res.reduce((acc, t) => [...acc, ...t], []);
		return [...fs_entries, ...nested_fs_entries];
	} catch (msg) {
		logger.error({ msg, ...params });
		throw new Error();
	}
}
