# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-12

### Added
- Added `type` field to `Event` interface to allow reliable differentiation between event types (Run, Ride, Swim, Strength, etc.)
- Added comprehensive test suite for event type filtering
- Added documentation for filtering events by type in README

### Changed
- Improved event filtering examples in documentation to use the new `type` field instead of name-based pattern matching

## [1.0.1] - Previous Release

Initial release with core functionality.

[1.1.0]: https://github.com/paladini/intervals-icu/compare/v1.0.1...v1.1.0
