import { Command } from "commander";
import { OpenApiPruner } from "../utils/OpenApiPruner";

export function createPruneCommand(): Command {
  return new Command("prune")
    .description("Prune OpenAPI/Swagger specification based on a filter term")
    .requiredOption(
      "-i, --input <file>",
      "Input Swagger/OpenAPI specification file"
    )
    .requiredOption(
      "-o, --output <file>",
      "Output file for filtered specification"
    )
    .requiredOption("-f, --filter <term>", "Filter term to match paths against")
    .action(async (options) => {
      try {
        const pruner = new OpenApiPruner(options.input);
        pruner.prune(options.filter);
        pruner.save(options.output);
        console.log(
          `✅ Successfully filtered specification saved to ${options.output}`
        );
      } catch (error) {
        console.error(
          "❌ Error:",
          error instanceof Error ? error.message : error
        );
        process.exit(1);
      }
    });
}
