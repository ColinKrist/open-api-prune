# OpenAPI Pruner

A lightweight and efficient utility for pruning OpenAPI specifications to include only the endpoints and schemas that matter to your frontend application. This tool helps reduce the size of OpenAPI specs by removing unused endpoints and their associated schemas, making it perfect for frontend applications that only need a subset of a larger API specification.

## Features

- 🔍 **Smart Pruning**: Intelligently removes unused endpoints and schemas while preserving all referenced components
- 🌳 **Deep Reference Resolution**: Automatically maintains all nested schema references
- 🚀 **Easy to Use**: Simple CLI interface for quick specification pruning
- 💾 **Safe Operations**: Preserves original files by creating new output files

## Installation

### Using Pre-built Binaries (Recommended)

Download the appropriate binary for your system from the [GitHub Releases page](https://github.com/yourusername/open-api-prune/releases). Available for:

- Linux (x64)
- macOS (arm64, x64)
- Windows (x64)

After downloading, make the binary executable and move it to your PATH:

```bash
# Linux/macOS
chmod +x open-api-pruner-*
sudo mv open-api-pruner-* /usr/local/bin/openapi-prune

# Windows
# Move the executable to a location in your PATH
```

## Usage

```bash
# Basic usage
openapi-prune prune --input <path-to-input-spec> --output <path-to-output> --filter <endpoint-pattern>

# Example: Prune spec to only include /users endpoints
openapi-prune prune --input api-spec.json --output pruned-spec.json --filter "users"
```

## How It Works

The OpenAPI Pruner works by:

1. Loading your OpenAPI specification
2. Filtering paths based on your specified pattern
3. Analyzing all schema references in the matching endpoints
4. Recursively collecting all dependent schemas
5. Creating a new specification with only the required components

This ensures that your pruned specification remains valid and contains all necessary schemas for the endpoints you want to keep.

## Use Cases

- **Frontend Development**: Keep only the endpoints your frontend application actually uses
- **Microservices**: Extract relevant API subsets for specific microservices
- **Documentation**: Generate focused documentation for specific API areas
- **Testing**: Create smaller specs for testing specific API functionalities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this in your own projects!
