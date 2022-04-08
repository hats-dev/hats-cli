import { O, Keys } from '../ts/sets';
import { logger, LogType } from './logger';

describe('utils > functions > console > logger', function () {
	test('keys', function () {
		const logger_keys = O.keys(logger);
		type T = typeof logger_keys;
		type U = Keys<typeof logger>;
		type V = Keys<typeof LogType>;
		expect<T>(logger_keys).toContain<U>(LogType.error);
		expect<T>(logger_keys).toContain<U>(LogType.log);
		expect<T>(logger_keys).toContain<U>(LogType.warn);
		expect<T>(logger_keys).toContain<V>('error');
		expect<T>(logger_keys).toContain<V>('log');
		expect<T>(logger_keys).toContain<V>('warn');
		// Debug
		// logger.error({ msg: 'Emitted error msg' });
		// logger.log({ msg: 'Emitted log msg' });
		// logger.warn({ msg: 'Emitted warn msg' });
		logger.warn({ msg: 'Silenced warn msg', debug: false });
	});
	test('functions', function () {
		const logger_keys = O.keys(logger);
		logger_keys.forEach((key) => {
			const logger_fn = logger[key];
			const logger_fn_type = typeof logger_fn;
			type T = typeof logger_fn_type;
			expect<T>(typeof logger_fn).toBe<T>('function');
		});
	});
});
