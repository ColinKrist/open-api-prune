import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Read version from package.json
const packageJson = JSON.parse(readFileSync("package.json", "utf-8"));
const version = packageJson.version;

const targets = [
  "darwin-x64",
  "darwin-arm64",
  "windows-x64",
  "linux-x64",
  "linux-arm64",
];

for (const target of targets) {
  const bunTarget = `bun-${target}`;
  console.log(`Building for ${bunTarget}...`);

  const outfile = `open-api-pruner-${target}${
    target.includes("windows") ? ".exe" : ""
  }`;

  const result = spawnSync(
    "bun",
    [
      "build",
      "./src/index.ts",
      "--compile",
      "--minify",
      "--sourcemap",
      `--outfile=${outfile}`,
      `--target=${bunTarget}`,
      "--define",
      `process.env.NODE_ENV="production"`,
      "--define",
      `process.env.APP_VERSION="${version}"`,
    ],
    { stdio: "inherit" }
  );

  if (result.status !== 0) {
    console.error(`Failed to build for ${target}`);
    process.exit(1);
  }
}

console.log("Build completed successfully for all targets.");
