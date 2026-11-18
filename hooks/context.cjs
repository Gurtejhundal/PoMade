// Hooks add context only; the opt-in Git hook performs the deterministic check.
const context = 'PoMade is the repository presentation agent: load the bundled pomade skill when invoked or preparing presentation for an authorized push. First inspect the project, existing media, and actual releases; offer three factual About pitches and ask for the pitch and Simple/Signature/Motion style. Wait for unanswered creative choices before writing config, replacing README, or applying metadata; reuse existing reviewed choices on later pushes. Derive topics and reuse real product media automatically. Do independent preparation before raising missing metadata access. Review the diff, preserve manual content, and verify actual About/topics after the push. Use pomade hooks check for managed repositories. Hooks do not grant permission. Never stage unrelated work, fabricate proof, publish an unrequested release, or force-push.';
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
