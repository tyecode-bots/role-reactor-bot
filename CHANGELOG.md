# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2024-07-18

### Added
- Hybrid storage system (MongoDB + local files)
- Comprehensive storage manager with caching
- Storage status command for bot owners (`/storage`)
- Enhanced temporary roles with proper data persistence
- Improved role management with better validation
- Update script for automated bot updates

### Changed
- Streamlined README.md with better organization
- Consolidated deployment guides (merged VPS_DEPLOYMENT.md)
- Enhanced database manager with better error handling
- Improved scheduler with proper cleanup
- Better error messages and validation

### Fixed
- Fixed list-temp-roles command (getExpiredTemporaryRoles error)
- Fixed date parsing issues in temporary role display
- Added cache clearing to prevent stale data
- Fixed data structure handling for temporary roles
- Enhanced permission checking and feedback

### Performance
- Implemented 5-minute cache timeout
- Added automatic data sync between storage methods
- Enhanced error handling and logging
- Improved command response times

## [1.0.0] - 2024-06-01

### Added
- Initial release of Role Reactor Bot
- Self-assignable roles through reactions
- Temporary role system with auto-expiration
- Role management commands
- Health monitoring and performance metrics
- Structured logging system 