export const O: {
	keys<T extends Record<string, unknown>>(object: T): (keyof T)[];
} = {
	keys: Object.keys,
};

export type Keys<T extends Record<string, unknown>> = (keyof T)[][number];

export type Exc<T, V extends T> = Exclude<T, V>;
export type Ext<T, V extends T> = Extract<T, V>;
