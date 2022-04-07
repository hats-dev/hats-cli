export const EmptyObject = {} as const;

type ExactType<T, U> = T extends U ? (U extends T ? T : never) : never;
export const exact =
	<E>() =>
	<T>(t: ExactType<T, E>) =>
		t;

export function safeParse<T = typeof EmptyObject>({ str }: { str: string }) {
	try {
		return JSON.parse(str) as T;
	} catch {
		return {} as Partial<T>;
	}
}
