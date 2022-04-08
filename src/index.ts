#!/usr/bin/env node
// eslint-disable-next-line node/shebang
import { Argument, Command } from 'commander';
import { mergeConfigSources } from './configs/config-builder/merge-config-sources';
import {
	getUserDefaultSourceConfig,
	saveUserDefaultSourceConfig,
} from './configs/persistent-sources/user-default-config';
import {
	getCommanderCliParams,
	getUserDefaultConfigsCliChoices,
	mapUserDefaultConfigsCliChoices,
	parseUserDefaultConfigsCliChoices,
} from './configs/session-sources/command-line-config';
import { isArrayConfigs } from './configs/types';
import { logger } from './console/logger';
import { O } from './ts/sets';

type CreateCommandOptions = {
	yes: boolean;
};
type ConfigCommandOptions = {
	list: boolean;
};
void (async function () {
	try {
		const { HATS_RUNTIME_PROGRAMS, version } = await getCommanderCliParams();
		const program = new Command();
		program
			.command('create')
			.description('Create a TypeScript library in the current directory')
			.argument(
				'<module-name>',
				'Name of your module, e.g. cool-ts-lib or @scope/cool-ts-lib',
			)
			.option('-y, --yes', 'Skip interactive steps and use HaTs defaults')
			.action(function (
				HATS_MODULE_NAME: string,
				options: CreateCommandOptions,
			) {
				return (async function (): Promise<void> {
					const { yes } = options;
					const config = await mergeConfigSources({
						command_line_configs: {
							HATS_MODULE_NAME,
							HATS_RUNTIME_SKIP_INTERACTIVE: yes,
						},
						HATS_RUNTIME_PROGRAMS,
					});
					logger.log({
						msg: config,
						stringify: true,
					});
					return;
				})();
			});
		program
			.command('config')
			.description('Configure the HaTs CLI')
			.addArgument(
				new Argument('[config-key]', 'Name of config').choices(
					getUserDefaultConfigsCliChoices(),
				),
			)
			.argument('[config-value]', 'New value')
			.option('--list', 'View your current configs')
			.action(function (
				key: string,
				value: string,
				options: ConfigCommandOptions,
			) {
				return (async function (): Promise<void> {
					const { list } = options;
					if (list) {
						const prev_config = await getUserDefaultSourceConfig();
						const prev_config_keys = O.keys(prev_config);
						const msg = prev_config_keys
							.map(function (k) {
								const cli_config = mapUserDefaultConfigsCliChoices(k);
								const value = prev_config[k] || '';
								const cli_config_value =
									typeof value === 'object' ? value.join(',') : value;
								return `${cli_config}=${cli_config_value}`;
							})
							.join('\n');
						logger.log({ msg, stringify: false });
						return;
					}
					const user_default_config = parseUserDefaultConfigsCliChoices({
						key,
					});
					if (isArrayConfigs(user_default_config)) {
						const values = value.split(',');
						await saveUserDefaultSourceConfig({
							merge_config: {
								[user_default_config]: values,
							},
						});
						return;
					}
					await saveUserDefaultSourceConfig({
						merge_config: {
							[user_default_config]: value,
						},
					});
					return;
				})();
			});
		program.version(version, '-v, --VERSION');
		program.parse();
		return;
	} catch (err) {
		console.log(err);
		throw new Error();
	}
})();
