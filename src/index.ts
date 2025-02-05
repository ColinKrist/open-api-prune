#!/usr/bin/env bun
import { Command } from "commander";
import { createPruneCommand } from "./commands/prune";

// Read version from package.json
const version = await Bun.file("package.json")
  .json()
  .then((json) => json.version)
  .catch(() => "__VERSION__");

const program = new Command()
  .name("openapi-prune")
  .description(
    "CLI tool to prune OpenAPI/Swagger specifications based on path filters"
  )
  .version(version)
  .configureHelp({
    sortSubcommands: true,
    sortOptions: true,
  });

// Add commands
program.addCommand(createPruneCommand());

// Parse command line arguments
program.parse(process.argv);
