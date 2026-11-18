import { it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { VERSION } from '../site/lib/product';
it('packages consistent plugin metadata and emits advisory hook context without accepting permission decisions', () => {
  const manifest = JSON.parse(fs.readFileSync('plugin.json', 'utf8'));
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  expect(manifest.version).toBe(pkg.version);
  expect(VERSION).toBe(pkg.version);
  expect(
    JSON.parse(fs.readFileSync('.claude-plugin/marketplace.json', 'utf8'))
      .plugins[0].version
  ).toBe(pkg.version);
  expect(
    JSON.parse(fs.readFileSync('.claude-plugin/plugin.json', 'utf8')).version
  ).toBe(pkg.version);
  const overlay = manifest.extensions['com.openai'];
  for (const file of [
    overlay.hooks,
    overlay.interface.composerIcon,
    overlay.interface.logo,
  ])
    expect(fs.existsSync(file)).toBe(true);
  const run = (event: unknown) =>
    execFileSync(process.execPath, ['hooks/context.cjs'], {
      input: JSON.stringify(event),
      encoding: 'utf8',
    });
  expect(
    run({ hook_event_name: 'PreToolUse', tool_input: { command: 'npm test' } })
  ).toBe('');
  for (const event of [
    { hook_event_name: 'SessionStart' },
    {
      hook_event_name: 'PreToolUse',
      tool_input: { cmd: 'git -C "repo with space" push origin main' },
    },
  ]) {
    const output = JSON.parse(run(event));
    expect(output.hookSpecificOutput.additionalContext).toContain('PoMade');
    expect(output.hookSpecificOutput.permissionDecision).toBeUndefined();
  }
  const hook = JSON.parse(fs.readFileSync('hooks/hooks.json', 'utf8')).hooks
    .SessionStart[0].hooks[0];
  const result = execFileSync(hook.command, {
    shell: true,
    env: { ...process.env, PLUGIN_ROOT: path.resolve('.') },
    input: '{"hook_event_name":"SessionStart"}',
    encoding: 'utf8',
  });
  expect(JSON.parse(result).hookSpecificOutput.hookEventName).toBe(
    'SessionStart'
  );
});
