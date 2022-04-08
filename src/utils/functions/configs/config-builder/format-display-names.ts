import { capitalCase } from 'change-case';
import { O } from '../../../ts/sets';

type GetDisplayNameParams = { str: string };
export function getDisplayName(params: GetDisplayNameParams) {
	const { str } = params;
	let display_name = capitalCase(str.slice().replace(/HATS/g, ''));
	const language_casing = {
		Typescript: 'TypeScript',
		Ts: 'TS',
		Javascript: 'JavaScript',
		Js: 'JS',
	} as const;
	O.keys(language_casing).forEach((k) => {
		display_name = display_name.replace(
			new RegExp(`${k}`, 'g'),
			language_casing[k],
		);
	});
	return display_name;
}
