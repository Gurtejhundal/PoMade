import Link from 'next/link';
import type { Metadata } from 'next';
import { INSTALL_COMMAND } from '../../lib/product';
export const metadata: Metadata = { title: 'Command reference — PoMade' };
const commands = [
  [
    'pomade hooks install --approved',
    'Install the optional local Git pre-push check. Preview without --approved. Existing hooks and custom hook paths are preserved.',
  ],
  [
    'pomade hooks status',
    'Report whether this clone has the PoMade Git hook installed. Read-only.',
  ],
  [
    'pomade hooks check',
    'Check generated README/cover freshness and whether presentation changes are committed. Exit 1 when a refresh or commit is needed. No writes.',
  ],
  [
    'pomade hooks uninstall --approved',
    'Remove only the exact PoMade-managed pre-push hook. Never removes another tool’s hook.',
  ],
  ['pomade doctor', 'Inspect local environment and Git configuration.'],
  [
    'pomade media generate-diagram',
    'Generate a manifest-based architecture SVG in docs/media.',
  ],
  [
    'pomade media generate-card',
    'Generate a social preview SVG in docs/media.',
  ],
  [
    'pomade github init-community --approved',
    'Create missing community templates; preserve existing owner files. --license MIT creates the complete MIT license only when requested.',
  ],

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
        Node.js 22 or newer. Commands run inside your target repository, or
        accept an explicit repository path.
      </p>
      <section className="document-section">
        <h2>Install v1.0.0</h2>
        <pre className="config-example">
          <code>{INSTALL_COMMAND}</code>
        </pre>
        <p>
          <Link href="/install">
            Complete installation guide: Codex, Claude Code, Git hooks, and
            GitHub Actions →
          </Link>
        </p>
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
        <h2>Configuration reference</h2>
        <p>
          All fields live in <code>.pomade.json</code>. Unknown fields and
          invalid media paths are rejected.
        </p>
        <div className="markdown-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>preset</code>
                </td>
                <td>minimal | signature | animated</td>
                <td>The README style. Defaults to signature.</td>
              </tr>
              <tr>
                <td>
                  <code>name / tagline / description</code>
                </td>
                <td>text</td>
                <td>Project identity and reviewed About copy.</td>
              </tr>
              <tr>
                <td>
                  <code>topics</code>
                </td>
                <td>up to 20 topic strings</td>
                <td>
                  Lowercase letters, numbers, and hyphens. Existing remote
                  topics are preserved.
                </td>
              </tr>
              <tr>
                <td>
                  <code>homepage</code>
                </td>
                <td>HTTPS URL</td>
                <td>Public project or documentation website.</td>
              </tr>
              <tr>
                <td>
                  <code>installCommand / runCommand / testCommand</code>
                </td>
                <td>text</td>
                <td>
                  Commands to document, not commands for PoMade to execute.
                </td>
              </tr>
              <tr>
                <td>
                  <code>features</code>
                </td>
                <td>title + description array</td>
                <td>Up to 12 owner-reviewed feature descriptions.</td>
              </tr>
              <tr>
                <td>
                  <code>logo / screenshot / demo / demoPoster</code>
                </td>
                <td>repository-relative image paths</td>
                <td>
                  Existing PNG, JPEG, WebP, GIF, or SVG files inside the
                  repository.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="document-section">
        <h2>Managed sections</h2>
        <pre className="config-example">
          <code>
            {
              '<!-- pomade:start header -->\nGenerated content\n<!-- pomade:end header -->'
            }
          </code>
        </pre>
        <p>
          The author creates its own section markers during first adoption. Keep
          handwritten paragraphs outside the generated blocks. After adoption,{' '}
          <code>sync</code> requires valid markers and stops on malformed ones.
          Preview the first adoption carefully; it introduces generated
          structure into an existing README.
        </p>
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
      <section className="document-section">
        <h2>Troubleshooting</h2>
        <details>
          <summary>The pre-push check blocks my push</summary>
          <p>
            Run <code>pomade sync --approved</code>, review{' '}
            <code>git diff</code>, commit the README and covers, then push
            again. Use <code>pomade hooks uninstall --approved</code> to remove
            the optional gate.
          </p>
        </details>
        <details>
          <summary>
            I already use Husky, Lefthook, or another hook manager
          </summary>
          <p>
            Keep it. Add <code>pomade hooks check</code> to your existing
            pre-push pipeline. PoMade refuses to overwrite an owner hook or
            alter core.hooksPath.
          </p>
        </details>
        <details>
          <summary>About and topics are not updating</summary>
          <p>
            Check the presentation Action logs. Save POMADE_TOKEN as a
            repository Actions secret with Administration write access to the
            correct repository. A missing token produces a skip notice; expired
            or insufficient tokens produce an error.
          </p>
        </details>
        <details>
          <summary>My image is missing</summary>
          <p>
            Use a repository-relative path to an existing file, commit the file,
            and check letter casing. For the CLI, media must remain inside the
            repository boundary. The Studio ZIP includes only assets you
            supplied or selected from its sample.
          </p>
        </details>
        <details>
          <summary>The plugin does not appear in Codex</summary>
          <p>
            Run the marketplace and plugin installation commands on the Install
            page, then open a new chat or restart the app. Select PoMade from
            your local marketplace. The universal public directory is a separate
            distribution channel.
          </p>
        </details>
        <details>
          <summary>The Action cannot push to a protected branch</summary>
          <p>
            Keep branch protection. Adapt the workflow to create a pull request
            or use your repository’s approved bot path. The sample uses a normal
            push and will not force through protection.
          </p>
        </details>
      </section>
    </div>
  );
}
