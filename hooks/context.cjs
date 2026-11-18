// Hooks add context only; the opt-in Git hook performs the deterministic check.
const context = 'PoMade: when preparing an authorized commit or push, review README, real media, About, and topics with the bundled pomade skill. Check config/workflow in the target repository; verify its About/topics after the push, or report missing authorization explicitly. Use pomade diff; apply only within the user-authorized scope. Use pomade hooks check before a push when .pomade.json is configured. Never stage unrelated work, fabricate product proof, publish a release, or force-push without the relevant user request.';
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; if (input.length > 65536) process.exit(0); });
process.stdin.on('end', () => {
  let event;
  try { event = JSON.parse(input); } catch { return; }
  const name = event.hook_event_name;
  const command = event.tool_input?.command ?? event.tool_input?.cmd;
  if (name !== 'SessionStart' && !(name === 'PreToolUse' && typeof command === 'string' && /\bgit\b[^\n]*\bpush\b/.test(command))) return;
  console.log(JSON.stringify({hookSpecificOutput:{hookEventName:name,additionalContext:context}}));
});
