##### This is a [Happy TypeScript](https://hats.dev) project bootstrapped with the [`hats-cli`](https://github.com/hats-dev/hats-cli).

# HaTs

Happy TypeScript (aka `HaTs`) is a project scaffolding CLI that speeds up
the process of creating TS libraries.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [System requirements](#system-requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [`create`](#create)
  - [`config`](#config)
- [More Help](#more-help)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## System requirements

Ensure your shell environment has the following programs installed globally:

- [Node (v12 or higher)](https://www.npmjs.com/package/n)
- [Git (v2.3 or higher)](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [GitHub CLI (latest)](https://cli.github.com/)
- [auto-changelog](https://npmjs.com/package/auto-changelog)
- [doctoc](https://npmjs.com/package/doctoc)

## Installation

```bash
npm i -g hats-cli
```

## Quick Start

### `create`

Interactively create a new HaTs library called `my-cool-lib` and create a new GitHub remote automagically synced with your local version

```bash
hats create my-cool-lib
```

Skip interactive prompts, and use default configs

```bash
hats create my-cool-lib -y
```

### `config`

View all HaTs configs

```bash
hats config --list
```

Update a HaTs config

```bash
hats config scripts.changelog "auto-changelog -p"
```

## More Help

Read the full docs at https://hats.dev.

## Contributing

Please see the [Contributing Guidelines](/CONTRIBUTING.md).

## Author

- [Kamar Mack](https://github.com/kamarmack)

## License

BSD-3-Clause
