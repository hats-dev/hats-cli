import { O } from '../../ts/sets';
import { isProdEnv } from '../node/env';

export enum LogType {
	error = 'error',
	log = 'log',
	warn = 'warn',
}
export const log_types = O.keys(LogType);

export type LoggerFnOptions = {
	debug?: boolean;
	prod?: boolean;
};
type LoggerFnParams = LoggerFnOptions & {
	msg: unknown;
};
type LoggerFn = (params: LoggerFnParams) => void;

function allowLog(params: LoggerFnOptions) {
	const { debug = true, prod = false } = params;
	return isProdEnv() ? prod : debug;
}
function log({ type }: { type: LogType }): LoggerFn {
	return function (params) {
		if (allowLog(params)) {
			switch (type) {
				case LogType.error: {
					console.error('Error:', JSON.stringify(params));
					break;
				}
				case LogType.log: {
					console.log('Log:', JSON.stringify(params));
					break;
				}
				case LogType.warn:
					console.warn('Warn:', JSON.stringify(params));
					break;
				default:
					throw new Error();
			}
		}
	};
}

type Logger = Record<LogType, LoggerFn>;
export const logger: Logger = log_types.reduce(function (
	acc: Logger,
	log_type,
) {
	return {
		...acc,
		[log_type]: (params: LoggerFnParams) =>
			log({ type: LogType[log_type] })(params),
	};
},
{} as Logger);
