export const O: {
	keys<T extends Record<string, unknown>>(object: T): (keyof T)[];
} = {
	keys: Object.keys,
};
