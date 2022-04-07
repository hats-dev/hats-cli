export const EmptyObject = {} as const;

type ExactType<T, U> = T extends U ? (U extends T ? T : never) : never;
export const exact =
	<E>() =>
	<T>(t: ExactType<T, E>) =>
		t;
