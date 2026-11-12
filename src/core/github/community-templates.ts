export class CommunityTemplates {
  public static bugReport(): string {
    return `---
name: Bug Report
about: Create a report to help improve this project
title: '[BUG] '
labels: bug
assignees: ''
---

## Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Execute command '...'
2. Pass arguments '...'
3. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Environment
- OS: [e.g. Linux / macOS / Windows]
- Node version: [e.g. 20.x]
- Project version: [e.g. 1.0.0]
`;
  }

  public static featureRequest(): string {
    return `---
name: Feature Request
about: Suggest an idea or capability for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Problem Statement
Is your feature request related to a problem? Please describe.

## Proposed Solution
A clear description of what you want to happen.

## Alternatives Considered
Any alternative solutions or features you have considered.
`;
  }

  public static pullRequest(): string {
    return `## Summary
Provide a brief summary of the changes introduced by this pull request.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Checklist
- [ ] Tests have been added or updated to cover my changes.
- [ ] All new and existing tests pass locally.
- [ ] Code follows project style and passes typecheck.
`;
  }

  public static contributing(projectName: string): string {
    return `# Contributing to ${projectName}

Thank you for your interest in contributing!

## Development Setup

1. Fork and clone the repository.
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the test suite:
   \`\`\`bash
   npm test
   \`\`\`
4. Run typechecks:
   \`\`\`bash
   npm run typecheck
   \`\`\`

## Pull Request Guidelines

- Create a feature branch from \`main\`.
- Keep commits focused and atomic with descriptive commit messages.
- Ensure all tests pass before opening a pull request.
`;
  }

  public static security(projectName: string, contactEmail = 'security@example.com'): string {
    return `# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within ${projectName}, please do NOT open a public issue.

Instead, please send an email to \`${contactEmail}\`. Please include:
- A description of the vulnerability.
- Steps to reproduce or proof-of-concept.
- Potential impact.

We will acknowledge receipt within 48 hours and provide a timeline for a resolution.
`;
  }
}
