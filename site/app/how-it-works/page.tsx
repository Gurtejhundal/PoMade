import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Push workflow — PoMade' };
import Link from 'next/link';
import { ArrowRight, GitBranch } from 'lucide-react';
export default function HowItWorksPage() {
  const steps = [
    [
      '01',
      'Understand the real project.',
      'The presentation agent inspects the README, implementation, manifests, workflows, existing media, and actual release history. It explains the project before proposing its presentation.',
    ],
    [
      '02',
      'Choose your pitch and style.',
      'PoMade offers three factual About pitch lines and asks you to choose Simple, Signature, or Motion. It derives relevant topics and saves your choices in .pomade.json for future pushes.',
    ],
    [
      '03',
      'Show the actual product.',
      'The host agent reuses accurate project screenshots and GIFs, or uses available tools to capture the running product when needed. Motion adds a decorative animated cover with a static alternative. A capture plan alone is not a recording.',
    ],
    [
      '04',
      'Review and apply the presentation.',
      'Review the concrete README and metadata changes. PoMade preserves useful manual content and completes authorized edits. If GitHub access is missing, it identifies the blocked metadata update after preparing the independent local changes.',
    ],
    [
      '05',
      'Maintain it with later pushes.',
      'Reuse the chosen pitch and style. The Action refreshes managed sections and covers; optional metadata access updates About and topics. Verify the actual result separately from the push. Release history is inspected; publishing still requires a release request.',
    ],
  ];
  return (
    <div className="inner-page narrow-page" id="content">
      <div className="page-eyebrow">THE PUSH WORKFLOW</div>
      <h1>
        The push is the trigger.
        <br />
        <em>The repo is the product.</em>
      </h1>
      <p className="page-lead">
        A presentation agent inside your coding agent. Checked CLI operations
        for edits. A GitHub Action for routine maintenance after setup.
      </p>
      <div className="workflow-steps">
        {steps.map(([n, title, description]) => (
          <section key={n}>
            <span>{n}</span>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </section>
        ))}
      </div>
      <div className="document-note">
        <span className="note-bar" />
        <p>
          <strong>Your prose stays yours.</strong> Automatic sync refuses an
          unmarked README and malformed markers. Hash checks reject stale plans.
          Pushes use ordinary Git conflict protection.
        </p>
      </div>
      <div className="code-window">
        <div>
          <GitBranch size={14} />
          one-time setup
        </div>
        <pre>
          <code>
            {
              'pomade init --preset animated --approved\npomade diff\npomade apply --approved\ngit add README.md .pomade.json .github/workflows/pomade.yml docs/media\ngit commit -m "docs: set up repository presentation"\ngit push'
            }
          </code>
        </pre>
      </div>
      <p className="caption">
        The generated workflow assumes a branch named main. Protected branches
        may require a pull request or repository-specific workflow adjustment.
      </p>
      <section className="document-section">
        <h2>Before the push: optional hooks</h2>
        <p>
          Agent hooks add context when a session starts or a shell command is
          about to push. Install the optional Git check with{' '}
          <code>pomade hooks install --approved</code> to stop stale or
          uncommitted generated presentation before a push. The check never
          changes files or stages your work.
        </p>
        <p>
          <Link href="/install#hooks">
            Hook setup, permissions, and removal →
          </Link>
        </p>
      </section>
      <Link className="text-link" href="/docs">
        Read the command reference
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
