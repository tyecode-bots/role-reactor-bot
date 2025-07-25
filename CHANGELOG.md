# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.2] - 2025-07-23

### Added
- Health check server configuration with configurable port settings
- Global error handlers for unhandled promise rejections and uncaught exceptions

### Changed
- Enhanced Discord API integration tests with updated imports and better test coverage
- Improved error handling in health monitoring systems

### Fixed
- Resolved issues with health check server port conflicts
- Fixed test imports after utility reorganization
- Fixed CI workflow pnpm executable error by reordering setup steps
- Fixed pnpm lockfile compatibility by updating to pnpm v9 in workflows
- Fixed CI test failures by adding required environment variables for config validation
- Fixed release workflow pnpm executable error by reordering setup steps

## [0.2.1] - 2025-01-22

### Added
- Dynamic external links in help command
- Improved component handling for help system

### Changed
- Modularized monitoring, storage, and global utilities
- Organized utilities into subdirectories for better structure
- Improved GitHub Actions release workflow with modern practices
- Enhanced release workflow with better error handling and validation

### Fixed
- Resolved post-refactor bugs in developer commands
- Fixed imports after utility reorganization

## [0.2.0] - 2025-07-20

### Added
- Developer command system with runtime permission checks
- `/storage` command for storage status monitoring
- Runtime permission checks using `DEVELOPERS` environment variable
- Discord command visibility controls (`setDefaultMemberPermissions(0n)`, `setDMPermission(false)`)
- Component-based help system architecture
- Environment-based command deployment filtering
- GitHub Actions automated release workflow
- Persistent data storage for temporary roles
- Enhanced role management validation
- Automated bot update script

### Changed
- Renamed "bot owner" to "developer" throughout codebase
- Added "🔒 [DEVELOPER ONLY]" descriptions to developer commands
- Simplified deployment scripts (reduced from 8 to 4 commands: `deploy:dev`, `deploy:prod`, `deploy:global`, `delete:commands`)
- Updated ephemeral usage from `ephemeral: true` to `flags: 64` (Discord deprecation fix)
- Enhanced documentation with developer command system details
- Improved command visibility and permission handling
- Streamlined README.md organization
- Consolidated deployment guides (merged VPS_DEPLOYMENT.md)
- Enhanced database manager error handling
- Improved scheduler cleanup process
- Better error messages and validation

### Fixed
- Fixed Discord deprecation warnings by updating ephemeral usage
- Fixed developer command visibility issues in Discord UI
- Fixed deployment script logic for proper environment-based command filtering
- Enhanced permission checking and feedback for developer commands
- Fixed `list-temp-roles` command (`getExpiredTemporaryRoles` error)
- Fixed date parsing issues in temporary role display
- Added cache clearing to prevent stale data
- Fixed data structure handling for temporary roles

### Security
- Added runtime permission checks for developer commands
- Implemented environment-based command filtering
- Enhanced command visibility controls to prevent unauthorized access

### Performance
- Optimized command deployment with environment-based filtering
- Reduced deployment script complexity from 8 to 4 essential commands
- Improved command response times with better error handling
- Implemented 5-minute cache timeout
- Added automatic data sync between storage methods
- Enhanced error handling and logging

## [0.1.0] - 2025-07-10

### Added
- Initial Discord role reactor bot implementation
- Self-assignable roles through reactions
- Temporary role system with auto-expiration
- Role management commands (`/setup-roles`, `/update-roles`, `/delete-roles`, `/list-roles`)
- Temporary role commands (`/assign-temp-role`, `/list-temp-roles`, `/remove-temp-role`)
- Health monitoring and performance metrics (`/health`, `/performance`)
- Structured logging system with file output
- Docker deployment support
- MongoDB integration for data persistence
- Permission controls and validation
- Custom emoji support (Unicode and server emojis)
- Role categories and organization
- Developer management commands (`/health`, `/performance`)
- Comprehensive error handling and rate limiting

[Unreleased]: https://github.com/tyecode-bots/role-reactor-bot/compare/v0.2.2...HEAD
[0.2.2]: https://github.com/tyecode-bots/role-reactor-bot/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/tyecode-bots/role-reactor-bot/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/tyecode-bots/role-reactor-bot/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/tyecode-bots/role-reactor-bot/releases/tag/v0.1.0
