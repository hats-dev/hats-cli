export const O: {
	keys<T extends Record<string, unknown>>(object: T): (keyof T)[];
} = {
	keys: Object.keys,
};

export type Keys<T extends Record<string, unknown>> = (keyof T)[][number];
