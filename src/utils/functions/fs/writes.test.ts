import { promises as fs_async } from 'fs';
// eslint-disable-next-line node/no-unpublished-import
import { v4 as uuid } from 'uuid';
import writeStrToFile from './writes';
import { getCwd } from './path';
import { logger } from '../console/logger';
import exec from '../node/exec';

describe('utils > functions > fs > writes', function () {
	test('writeStrToFile', function () {
		const path = `${getCwd()}/tests/writes.test.txt`;
		const str = `uuid: ${uuid()}; timestamp: ${new Date().toISOString()}`;
		async function cleanup(): Promise<void> {
			try {
				if (await fs_async.stat(path)) {
					logger.log({ msg: `cleaning up ${path}`, debug: false });
					await fs_async.rm(path);
				}
			} catch {
				// eslint-disable-next-line no-empty
			}
		}
		async function write(): Promise<void> {
			await writeStrToFile({ path, str });
		}
		async function stat(): Promise<void> {
			const { stdout } = await exec(`cat ${path}`);
			const valid_write = stdout.includes(str);
			type T = typeof valid_write;
			expect<T>(valid_write).toBe<T>(true);
		}
		return (async function () {
			await [cleanup, write, stat]
				.map(function (task) {
					return async function () {
						await task();
					};
				})
				.reduce((acc, fn) => acc.then(fn), Promise.resolve());
		})();
	});
});
