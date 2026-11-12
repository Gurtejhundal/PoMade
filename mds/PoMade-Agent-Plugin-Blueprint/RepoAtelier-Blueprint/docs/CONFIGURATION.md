# Configuration proposal — simple defaults, optional overrides

**This is a future schema proposal, not a file already consumed by the plugin.** v0.1 should run with zero config. Add `.repoatelier.yml` only when user requests persistent configuration. A future implementation must validate it and never infer authorizations from repo-owned config.

```yaml
schema: 1
preset: minimal  # minimal | studio | maintainer
project:
  kind: auto     # auto | cli | library | web | api | ml | monorepo
  stage: auto    # auto | idea | prototype | usable | released | maintained
content:
  voice: direct  # direct | technical | playful
  preserve_manual: true
  managed_sections: false
  max_badges: 3
media:
  enabled: false
  format: png
  output_dir: docs/media
  allowed_local_urls: []
remote:
  enabled: false
  allow_metadata_writes: false
  allow_release_drafts: false
privacy:
  offline: true
  exclude:
    - '**/.env*'
    - '**/secrets/**'
    - '**/node_modules/**'
quality:
  require_evidence_for_claims: true
```

## Rules

- `offline: true` means no remote calls, no external model prompts, and no external media uploads.
- Configuration is not an authorization grant: even `allow_metadata_writes: true` requires explicit approval per plan/action.
- `.repoatelier.yml` must never silently overwrite user instructions or another tool's config.
- Ignore known credentials even if an exclusion list accidentally omits them.
- `media.enabled` only permits suggesting capture; launching arbitrary project commands still requires approval.
- `managed_sections: true` is not permission to replace manual content; it only allows updates within valid, previously opted-in markers.
- Version config schema; provide migrations and fail closed for unknown destructive settings.

## Environment (future)

Use standard GitHub CLI login where available; do not store raw tokens in config. Optional `REPOATELIER_OFFLINE=1` can force offline mode. Do not require a cloud account or model API key.
