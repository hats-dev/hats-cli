import { O } from '../ts/sets';
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
	stringify?: boolean;
};
type LoggerFnParams = LoggerFnOptions & {
	msg: unknown;
};
type LoggerFn = (params: LoggerFnParams) => void;

function allowLog(params: LoggerFnOptions) {
	const { debug = true, prod = false } = params;
	return isProdEnv() ? prod : debug;
}
type LogParams = { type: LogType };
function stringifyLog(params: LoggerFnOptions & LogParams) {
	if (params.stringify !== undefined) {
		return params.stringify;
	}
	return !isProdEnv();
}
function log({ type }: LogParams): LoggerFn {
	return function (params) {
		if (allowLog(params)) {
			const s = stringifyLog({ type, ...params })
				? `${type.toLocaleUpperCase()}: ${JSON.stringify(params, null, '\t')}`
				: params.msg;
			switch (type) {
				case LogType.error: {
					console.error(s);
					break;
				}
				case LogType.log: {
					console.log(s);
					break;
				}
				case LogType.warn:
					console.warn(s);
					break;
				default:
					throw new Error();
			}
		}
	};
}

type Logger = Record<LogType, LoggerFn>;
export const logger: Logger = log_types.reduce(
	function (acc: Logger, log_type) {
		return {
			...acc,
			[log_type]: (params: LoggerFnParams) =>
				log({ type: LogType[log_type] })(params),
		};
	},
	{
		error() {
			throw new Error();
		},
		log() {
			throw new Error();
		},
		warn() {
			throw new Error();
		},
	},
);
