import { Terminal } from 'lucide-react';
const commands = [
  [
    'pomade init --preset signature --approved',
    'Create .pomade.json and a push workflow. Existing configuration is never overwritten. Omit --approved to preview the files.',
  ],
  [
    'pomade scan --json',
    'Inspect manifests, scripts, frameworks, Git state, licenses, documentation, and media. Read-only.',
  ],
  [
    'pomade audit --min-score 70',
    'Check repository presentation signals. Scores describe the checks, not production readiness.',
  ],
  [
    'pomade diff --preset animated',
    'Preview the README and local animated/static covers. Presets: minimal (Simple), signature, animated (Motion).',
  ],
  [
    'pomade plan --output plan.json',
    'Save a concrete plan for review. The plan includes proposed content and target hashes.',
  ],
  [
    'pomade apply --plan plan.json --approved',
    'Apply that exact saved plan. Abort if target contents have changed. Without --plan, generate and apply a fresh plan.',
  ],
  [
    'pomade sync --approved --dry-run',
    'Preview automated maintenance. Requires managed README markers; refuses an unmarked existing README.',
  ],
  [
    'pomade sync --approved --approved-remote',
    'Refresh managed README/assets and sync About/topics. Supply GH_TOKEN or GITHUB_TOKEN with Administration write permission; local gh authentication is the fallback.',
  ],
  [
    'pomade media plan',
    'Prepare capture guidance for real screenshots and recordings. Does not execute the app or create a fake capture.',
  ],
  [
    'pomade github plan',
    'Suggest description and topics from manifests. .pomade.json provides curated metadata for sync.',
  ],
  [
    'pomade drift --fail-on-drift',
    'Flag differences between observed manifest configuration and documentation mentions.',
  ],
  [
    'pomade release plan',
    'Draft version and changelog suggestions from commits. Does not publish or claim tests have passed.',
  ],
];
export default function DocsPage() {
  return (
    <div className="inner-page narrow-page" id="content">
      <div className="page-eyebrow">DOCUMENTATION / GET STARTED</div>
      <h1>
        Small commands.
        <br />
        <em>A considered repository.</em>
      </h1>
      <p className="page-lead">
        Node.js 18 or newer for the CLI. The bundled GitHub Action uses Node.js
        22.
      </p>
      <section className="document-section">
        <h2>Install from source</h2>
        <div className="code-window">
          <div>
            <Terminal size={14} />
            terminal
          </div>
          <pre>
            <code>
              {
                'git clone https://github.com/Gurtejhundal/PoMade.git\ncd PoMade\nnpm ci\nnpm run build\nnpm link'
              }
            </code>
          </pre>
        </div>
        <p>
          Run PoMade inside your target repository. For a coding agent, install
          the included{' '}
          <a href="https://github.com/Gurtejhundal/PoMade/tree/main/skills/pomade">
            skill directory
          </a>{' '}
          in the agent’s skills location.
        </p>
      </section>
      <section className="document-section">
        <h2>Choose what gets maintained</h2>
        <pre className="config-example">
          <code>
            {
              '{\n  "preset": "animated",\n  "tagline": "The shortest path from idea to working thing.",\n  "description": "A concrete, accurate description of your project.",\n  "topics": ["developer-tools", "documentation"],\n  "screenshot": "docs/media/hero.png",\n  "demo": "docs/media/demo.gif"\n}'
            }
          </code>
        </pre>
        <p>
          Media paths must point to existing files inside your repository. The
          owner supplies product claims; the scanner supplies project facts.
          Neither Studio nor the scanner can certify that a product claim is
          true.
        </p>
      </section>
      <section className="document-section">
        <h2>Command reference</h2>
        <div className="command-reference">
          {commands.map(([cmd, desc]) => (
            <div key={cmd}>
              <code>{cmd}</code>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="document-section">
        <h2>Workflow permissions</h2>
        <p>
          The workflow needs <code>contents: write</code> to commit generated
          files. For About/topics, create a fine-grained token limited to this
          repository with <strong>Administration: write</strong>, and save it as{' '}
          <code>POMADE_TOKEN</code> in Actions secrets. Without it, README
          maintenance runs and metadata sync is skipped with a notice.
        </p>
        <p>
          Pin the external action to a reviewed commit SHA. The sample targets{' '}
          <code>main</code>; change that for other default branches. Releases
          remain an explicit publishing step.
        </p>
      </section>
    </div>
  );
}
