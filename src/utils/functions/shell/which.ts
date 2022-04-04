import { LoggerFnOptions, logger } from '../console/logger';
import exec from '../node/exec';

type WhichParams = { program: string } & LoggerFnOptions;
export async function whichFile(params: WhichParams): Promise<boolean> {
	try {
		const { stdout } = await exec(`which ${params.program}`);
		return !!stdout;
	} catch (msg) {
		logger.error({
			msg,
			debug: false,
			...params,
		});
		return false;
	}
}
