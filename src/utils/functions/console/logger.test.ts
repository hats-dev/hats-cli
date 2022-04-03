import { O } from '../../ts/sets';
import { logger, LogType, log_types } from './logger';

test('utils > functions > console > logger > keys', function () {
	// Data
	const logger_keys = O.keys(logger);
	// Types
	type T = typeof logger_keys;
	type K = T[number];
	type TL = typeof log_types;
	type TLK = TL[number];
	// Tests
	expect<T>(logger_keys).toContain<K>(LogType.error);
	expect<T>(logger_keys).toContain<K>(LogType.log);
	expect<T>(logger_keys).toContain<K>(LogType.warn);
	expect<T>(logger_keys).toContain<TLK>('error');
	expect<T>(logger_keys).toContain<TLK>('log');
	expect<T>(logger_keys).toContain<TLK>('warn');
	// Debug
	// logger.error({ msg: 'Emitted error msg' });
	// logger.log({ msg: 'Emitted log msg' });
	// logger.warn({ msg: 'Emitted warn msg' });
	logger.warn({ msg: 'Silenced warn msg', debug: false });
});

test('utils > functions > console > logger > functions', function () {
	// Data
	const logger_keys = O.keys(logger);
	// Types
	type T = typeof logger_keys;
	type K = T[number];
	type TL = typeof logger;
	type Fn<L extends K> = TL[L];
	// Tests
	logger_keys.forEach((key) => {
		const logger_fn: Fn<typeof key> = logger[key];
		const logger_fn_type = typeof logger_fn;
		type TFn = typeof logger_fn_type;
		expect<TFn>(typeof logger_fn).toBe<TFn>('function');
	});
});
