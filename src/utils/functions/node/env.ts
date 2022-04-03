export enum NodeEnvType {
	development = 'development',
	production = 'production',
	test = 'test',
}

export function getNodeEnv() {
	return process.env.NODE_ENV as NodeEnvType;
}

export function isProdEnv() {
	return getNodeEnv() === NodeEnvType.production;
}
