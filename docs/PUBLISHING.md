# Publishing to NPM Registry

This guide explains how to correctly publish the `node-intervals-icu` library to the NPM Registry. The library is designed to be lightweight and work seamlessly with both JavaScript and TypeScript projects.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Pre-Publishing Checklist](#pre-publishing-checklist)
- [Publishing Steps](#publishing-steps)
- [Package Configuration](#package-configuration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Prerequisites

Before publishing, ensure you have:

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com) if you don't have one
2. **NPM Authentication**: Log in to NPM on your local machine
   ```bash
   npm login
   ```
3. **Repository Access**: Write access to the GitHub repository
4. **Node.js**: Version 16.0.0 or higher (as specified in `package.json`)

## Pre-Publishing Checklist

Before publishing a new version, complete these steps:

### 1. Update Version Number

Update the version in `package.json` following [semantic versioning](https://semver.org/):

- **Patch release** (bug fixes): `1.0.0` → `1.0.1`
  ```bash
  npm version patch
  ```

- **Minor release** (new features, backward compatible): `1.0.0` → `1.1.0`
  ```bash
  npm version minor
  ```

- **Major release** (breaking changes): `1.0.0` → `2.0.0`
  ```bash
  npm version major
  ```

### 2. Run Quality Checks

Ensure all checks pass before publishing:

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build the package
npm run build
```

All commands should complete without errors.

### 3. Verify Build Output

Check that the `dist/` directory contains all necessary files:

```bash
ls -la dist/
```

Expected files:
- `index.js` - ES Module bundle (ESM, because `"type": "module"` in package.json)
- `index.cjs` - CommonJS bundle (CJS, explicit extension)
- `index.d.ts` - TypeScript type definitions (ESM)
- `index.d.cts` - TypeScript type definitions (CJS)

### 4. Test Package Contents

Preview what will be included in the published package:

```bash
npm pack --dry-run
```

This shows all files that will be included. Verify that:
- ✅ Only `dist/` directory is included
- ✅ `package.json` is included
- ✅ `README.md` is included
- ❌ `src/` directory is NOT included
- ❌ `docs/` directory is NOT included
- ❌ `node_modules/` is NOT included
- ❌ Development files are NOT included

### 5. Update Documentation

Ensure documentation is current:
- Update `README.md` with any API changes
- Update version numbers in examples if needed
- Review and update `CHANGELOG.md` (if you maintain one)

## Publishing Steps

### Method 1: Standard Publishing (Recommended)

1. **Build the package** (automatically runs via `prepublishOnly` script):
   ```bash
   npm run build
   ```

2. **Publish to NPM**:
   ```bash
   npm publish
   ```

   The `prepublishOnly` script in `package.json` will automatically run the build before publishing.

### Method 2: Publishing with Tag

For pre-release versions (beta, alpha, rc):

1. **Update version with pre-release identifier**:
   ```bash
   npm version prerelease --preid=beta
   # Or manually edit package.json to something like "1.0.0-beta.1"
   ```

2. **Publish with tag**:
   ```bash
   npm publish --tag beta
   ```

### Method 3: Dry Run Publishing

To test the publishing process without actually publishing:

```bash
npm publish --dry-run
```

This simulates the publish process and shows what would be published.

## Package Configuration

### Key Configuration for Dual Package Support

The `package.json` is configured to support both CommonJS and ES Modules:

```json
{
  "main": "./dist/index.cjs",          // CommonJS entry point
  "module": "./dist/index.js",         // ES Module entry point
  "types": "./dist/index.d.ts",        // TypeScript definitions
  "type": "module",                     // Default module system (makes .js = ESM)
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",    // TypeScript types
      "import": "./dist/index.js",     // ES Module import
      "require": "./dist/index.cjs"    // CommonJS require
    }
  },
  "files": [
    "dist"                              // Only dist/ is published
  ]
}
```

**Note**: With `"type": "module"`, Node.js treats `.js` files as ES Modules by default. The `.cjs` extension explicitly marks CommonJS files. This is the modern Node.js dual package convention.

### What Makes This Package Lightweight

1. **Minimal Dependencies**: Only `axios` as runtime dependency
2. **Tree-Shakeable**: ES Module format allows bundlers to eliminate unused code
3. **Small Bundle Size**: Only includes compiled code in `dist/`, not source files
4. **No Dev Dependencies**: Development tools are not included in the published package

### Build Configuration

The package uses `tsup` for building, configured via the build script:

```bash
tsup src/index.ts --format cjs,esm --dts --clean
```

This:
- Builds both CommonJS (`cjs`) and ES Module (`esm`) formats
- Generates TypeScript declarations (`--dts`)
- Cleans the output directory before building (`--clean`)
- Takes `src/index.ts` as the entry point

**File naming convention**: Since `package.json` has `"type": "module"`, tsup produces:
- `index.js` - ES Module format (default for `.js` when type is "module")
- `index.cjs` - CommonJS format (explicit `.cjs` extension)
- `index.d.ts` - TypeScript definitions for ESM
- `index.d.cts` - TypeScript definitions for CJS

This follows the modern Node.js dual package pattern recommended for new packages.

## Verification

### After Publishing

1. **Check NPM Registry**:
   Visit `https://www.npmjs.com/package/node-intervals-icu` to verify the package is published

2. **Test Installation in a New Project**:

   ```bash
   # Create test directory
   mkdir test-node-intervals-icu
   cd test-node-intervals-icu
   
   # Initialize package.json
   npm init -y
   
   # Install your package
   npm install node-intervals-icu
   ```

3. **Test with JavaScript (CommonJS)**:

   Create `test-cjs.js`:
   ```javascript
   const { IntervalsClient } = require('node-intervals-icu');
   
   console.log('CommonJS import successful!');
   console.log('IntervalsClient:', typeof IntervalsClient);
   ```

   Run: `node test-cjs.js`

4. **Test with JavaScript (ES Modules)**:

   Create `test-esm.mjs`:
   ```javascript
   import { IntervalsClient } from 'node-intervals-icu';
   
   console.log('ES Module import successful!');
   console.log('IntervalsClient:', typeof IntervalsClient);
   ```

   Run: `node test-esm.mjs`

5. **Test with TypeScript**:

   Create `test-ts.ts`:
   ```typescript
   import { IntervalsClient, type IntervalsConfig } from 'node-intervals-icu';
   
   const config: IntervalsConfig = {
     apiKey: 'test-key'
   };
   
   console.log('TypeScript import successful!');
   console.log('IntervalsClient:', typeof IntervalsClient);
   ```

   Compile and run:
   ```bash
   npx tsc test-ts.ts --module es2022 --moduleResolution bundler --esModuleInterop
   node test-ts.js
   ```

### Verify Package Size

Check the published package size:

```bash
npm info node-intervals-icu
```

The unpacked size should be small (typically under 100KB for this library).

## Troubleshooting

### Issue: "You do not have permission to publish"

**Solution**: Ensure you're logged in with the correct NPM account:
```bash
npm whoami
npm logout
npm login
```

### Issue: "Version already exists"

**Solution**: You're trying to publish a version that already exists. Update the version:
```bash
npm version patch  # or minor/major
npm publish
```

### Issue: "Module not found" after installation

**Solution**: Verify the `exports` field in `package.json` is correctly configured and all paths exist in the `dist/` directory after building.

### Issue: TypeScript types not working

**Solution**: 
1. Ensure `types` field points to correct `.d.ts` file
2. Verify type definitions are generated during build
3. Check that `dist/index.d.ts` exists in the published package

### Issue: Package size is too large

**Solution**:
1. Verify only `dist/` is in the `files` array
2. Run `npm pack --dry-run` to see what's included
3. Add unwanted files to `.npmignore` if needed (though `files` should handle this)

## Best Practices

### Version Management

1. **Never skip versions**: Always increment sequentially
2. **Use semantic versioning**: Follow semver.org strictly
3. **Tag releases**: Create git tags for each version
   ```bash
   git tag v1.0.1
   git push --tags
   ```

### Pre-Publishing

1. **Always test locally**: Run all quality checks before publishing
2. **Review changes**: Use `git diff` to review all changes since last release
3. **Update CHANGELOG**: Document all changes (if maintaining a changelog)
4. **Test in real project**: Install and test in an actual project before publishing

### Security

1. **Never commit secrets**: Ensure no API keys or secrets in code
2. **Review dependencies**: Regularly update and audit dependencies
   ```bash
   npm audit
   npm audit fix
   ```
3. **Use 2FA**: Enable two-factor authentication on your NPM account

### Documentation

1. **Keep README updated**: Ensure examples work with current version
2. **Document breaking changes**: Clearly mark breaking changes in major versions
3. **Provide migration guides**: Help users upgrade between major versions

### CI/CD (Optional but Recommended)

Consider setting up automated publishing via GitHub Actions:

```yaml
# .github/workflows/publish.yml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Post-Publishing

After successfully publishing:

1. **Verify on NPM**: Check the package page on npmjs.com
2. **Test installation**: Install in a fresh project to verify
3. **Create GitHub release**: Create a release on GitHub matching the NPM version
4. **Announce**: Share the release with users (Twitter, Discord, etc.)
5. **Monitor**: Watch for issues or feedback from users

## Package Metadata

- **Package Name**: `node-intervals-icu`
- **Author**: Fernando Paladini ([@paladini](https://github.com/paladini))
- **NPM Profile**: [npmjs.com/~paladini](https://www.npmjs.com/~paladini)
- **Repository**: [github.com/paladini/node-intervals-icu](https://github.com/paladini/node-intervals-icu)
- **License**: MIT

---

## Quick Reference

```bash
# Quick publishing workflow
npm run typecheck          # Check types
npm run lint              # Check code quality
npm run build            # Build the package
npm version patch        # Update version
npm publish              # Publish to NPM
git push --follow-tags   # Push with tags
```

For questions or issues, please open an issue on the [GitHub repository](https://github.com/paladini/node-intervals-icu/issues).
