import { readFileSync, writeFileSync } from "node:fs";

interface ApiSpec {
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
}

export class OpenApiPruner {
  private apiSpec: ApiSpec;
  private referencedSchemas: Set<string> = new Set();
  private processedSchemas: Set<string> = new Set();

  constructor(inputFile: string) {
    const fileContent = readFileSync(inputFile, "utf-8");
    this.apiSpec = JSON.parse(fileContent);
  }

  private collectRefs(details: any): void {
    if (details && typeof details === "object") {
      if (Array.isArray(details)) {
        details.forEach((item) => this.collectRefs(item));
      } else {
        for (const [key, value] of Object.entries(details)) {
          if (
            key === "$ref" &&
            typeof value === "string" &&
            value.startsWith("#/components/schemas/")
          ) {
            const schemaName = value.split("/").pop()!;
            if (!this.processedSchemas.has(schemaName)) {
              this.referencedSchemas.add(schemaName);
              this.processedSchemas.add(schemaName);
              // Recursively process the referenced schema to find nested refs
              const referencedSchema =
                this.apiSpec.components.schemas[schemaName];
              if (referencedSchema) {
                this.collectRefs(referencedSchema);
              }
            }
          } else {
            this.collectRefs(value);
          }
        }
      }
    }
  }

  prune(filterTerm: string): void {
    // Reset processed schemas for new prune operation
    this.processedSchemas.clear();
    this.referencedSchemas.clear();

    // Step 1: Filter paths containing filterTerm
    const filteredPaths = Object.entries(this.apiSpec.paths)
      .filter(([path]) => path.includes(filterTerm))
      .reduce((acc, [path, details]) => ({ ...acc, [path]: details }), {});

    // Step 2: Collect referenced schemas from filtered paths
    Object.entries(filteredPaths).forEach(([_, pathDetails]) => {
      Object.entries(pathDetails as Record<string, unknown>).forEach(
        ([_, methodDetails]) => {
          this.collectRefs(methodDetails);
        }
      );
    });

    // Step 3: Prune the schemas in components
    const filteredSchemas = Object.entries(this.apiSpec.components.schemas)
      .filter(([name]) => this.referencedSchemas.has(name))
      .reduce((acc, [name, details]) => ({ ...acc, [name]: details }), {});

    // Update the API specification
    this.apiSpec.paths = filteredPaths;
    this.apiSpec.components.schemas = filteredSchemas;
  }

  save(outputFile: string): void {
    writeFileSync(outputFile, JSON.stringify(this.apiSpec, null, 2));
  }
}
