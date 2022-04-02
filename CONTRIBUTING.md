# Contributing to HaTs

Thank you for your interest in contributing to HaTs! We welcome PRs.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [First steps - Features](#first-steps---features)
- [First steps - Fixes](#first-steps---fixes)
- [Creating a PR](#creating-a-pr)
- [Submitting a PR](#submitting-a-pr)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## First steps - Features

If your PR proposes a new feature start a [**discussion**](https://github.com/hats-dev/hats-cli/discussions/new) with the HaTs community first.

## First steps - Fixes

If your PR proposes a bug fix, create an [**issue**](https://github.com/hats-dev/hats-cli/issues/new/choose) first.

## Creating a PR

1. Fork this repo to your own GitHub

1. Remove any existing `hats-cli` global installations on your machine

   ```bash
   npm uninstall -g hats-cli
   ```

1. Clone your fork to your machine

   ```
   git clone https://github.com/<your-org>/hats-cli.git
   cd hats-cli
   ```

1. Install deps and build

   ```
   npm i && npm run build
   ```

   > **Note:** you'll need to run `npm run build` to view your changes

1. Symlink your local dev version (this enables the `hats` command to run your local build)

   ```
   npm link
   ```

## Submitting a PR

1. Pull master if there have been any commits since your fork

1. Ensure `npm run test` passes, and you're good to go 🚀
