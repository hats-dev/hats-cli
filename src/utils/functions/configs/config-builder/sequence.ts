import { logger } from '../../console/logger';
import { ConfigSource, config_sources, ConfigSourceMap } from '../types';

export type MergeSequence = [
	ConfigSource.system_default,
	ConfigSource.command_line,
	ConfigSource.git_default,
	ConfigSource.user_default,
	ConfigSource.prompt,
	ConfigSource.programmatic,
];
type MergeIndex = 0 | 1 | 2 | 3 | 4 | 5;
function getMergeSequence(): MergeSequence {
	const merge_sequence: MergeSequence = [
		ConfigSource.system_default,
		ConfigSource.command_line,
		ConfigSource.git_default,
		ConfigSource.user_default,
		ConfigSource.prompt,
		ConfigSource.programmatic,
	];
	if (
		merge_sequence.length !== config_sources.length ||
		merge_sequence.length !== new Set(merge_sequence).size
	) {
		logger.error({ msg: merge_sequence });
		throw new Error();
	}
	return merge_sequence;
}
const merge_sequence = getMergeSequence();
export type CurrentConfig<I extends MergeIndex> = Partial<
	ConfigSourceMap<typeof merge_sequence[I]>
>;
export type CurrentSequence<I extends MergeIndex> = typeof merge_sequence[I];
export default merge_sequence;
export function isMergeIndex(i: number): i is MergeIndex {
	return i === 0 || i === 1 || i === 2 || i === 3 || i === 4 || i === 5;
}
