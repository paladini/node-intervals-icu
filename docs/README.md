# Documentation

This directory contains documentation for maintainers and contributors of the `node-intervals-icu` library.

## Available Documentation

### [Publishing Guide](./PUBLISHING.md)
Comprehensive guide for publishing the library to NPM Registry. Includes:
- Prerequisites and setup
- Pre-publishing checklist
- Step-by-step publishing instructions
- Package configuration details
- Verification steps for both JS and TS projects
- Troubleshooting common issues
- Best practices for version management

## Package Information

- **Package Name**: `node-intervals-icu`
- **Type**: TypeScript library with dual package support (CommonJS + ES Modules)
- **Bundle Size**: ~10KB (packed), ~71KB (unpacked)
- **Node Version**: >=16.0.0
- **Dependencies**: Only `axios` (runtime dependency)

## Author

**Fernando Paladini**
- GitHub: [@paladini](https://github.com/paladini)
- NPM: [npmjs.com/~paladini](https://www.npmjs.com/~paladini)

## Key Features

The library is designed to be:
- ✅ **Lightweight**: Minimal dependencies and small bundle size
- ✅ **TypeScript-first**: Full type definitions included
- ✅ **Dual package**: Works with both CommonJS and ES Modules
- ✅ **Tree-shakeable**: ESM format allows optimal bundling
- ✅ **Developer-friendly**: Comprehensive JSDoc comments

## Quick Links

- [Main README](../README.md) - User-facing documentation
- [Publishing Guide](./PUBLISHING.md) - How to publish to NPM
- [GitHub Repository](https://github.com/paladini/node-intervals-icu)
- [NPM Package](https://www.npmjs.com/package/node-intervals-icu)
- [Intervals.icu API Documentation](https://intervals.icu/api/v1/docs)

## Note

This documentation folder is **not included** in the published NPM package. Only the `dist/` directory is published, keeping the package lightweight. The `docs/` folder is excluded via:
1. The `files` field in `package.json` (only includes `dist/`)
2. The `.npmignore` file (explicitly excludes `docs/`)
