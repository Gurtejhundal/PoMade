# Architecture decision records (initial)

## ADR-001: One core, many adapters

**Decision:** Functional core, thin CLI, portable Agent Skill; native plugins and MCP consume same core later.
**Why:** Avoid different agents producing inconsistent results. **Cost:** small upfront interface design.

## ADR-002: No mandatory LLM backend

**Decision:** scanner, audit, and plans are deterministic. Agents can draft copy from evidence. Optional model integration is a later enhancement.
**Why:** offline reliability, cost, testability and privacy. **Risk:** style quality relies on the host agent when used via skill.

## ADR-003: Writes require visible authorization

**Decision:** `apply` needs explicit approval; separate permission for remote changes, licenses, tags and release publishing.
**Why:** repo integrity and user control. **Cost:** extra confirmation.

## ADR-004: Preserve hand-authored documentation

**Decision:** managed sections (if explicitly opted in) or proposed replacement as a diff; never unconditionally replace README.
**Why:** trust matters more than seamless automation. **Cost:** complexity around mixed ownership.

## ADR-005: Quality is not a raw star benchmark

**Decision:** stage-specific checklist and clear warnings, no universal magic '100k stars score'.
**Why:** stars reflect adoption, not presentation alone.

## ADR-006: Social previews may require manual GitHub UI upload

**Decision:** render a correct preview and give upload instructions. Treat automated upload as unsupported until an officially supported, reliable integration is proven.
**Why:** standard repository metadata APIs are not a general promise to upload social preview images.

## ADR-007: No default per-commit README churn

**Decision:** event-driven suggestions after meaningful public interface changes; no broad rewrite on every save/commit.
**Why:** prevent noise and PR conflicts.
