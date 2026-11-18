import Link from 'next/link';
import { ArrowRight, GitBranch } from 'lucide-react';
export default function HowItWorksPage() {
  const steps = [
    [
      '01',
      'Give the repo a direction.',
      'Choose Simple, Signature, or Motion. Set a sharp one-liner, About text, and topics in .pomade.json. Keep product claims specific and reviewed.',
    ],
    [
      '02',
      'Inspect the real project.',
      'PoMade reads manifests, configured scripts, licenses, workflows, and existing assets. A dependency is evidence of a dependency; it is not proof of a feature or a successful test run.',
    ],
    [
      '03',
      'Review once. Maintain on pushes.',
      'Review pomade diff, then adopt managed README sections with pomade apply --approved. The installed workflow runs after pushes to main and updates only generated sections.',
    ],
    [
      '04',
      'Keep the rest of the front door in step.',
      'The Action commits README and cover changes with GitHub’s workflow token. An optional POMADE_TOKEN with Administration write permission updates About, homepage, and topics. Existing topics are preserved.',
    ],
    [
      '05',
      'Show the actual product.',
      'Check real screenshots or GIF recordings into docs/media and point screenshot/demo at them in .pomade.json. Motion adds a local animated SVG cover plus a static alternative. It does not pretend a generated cover is a screenshot.',
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
        A coding-agent skill for the first pass. A GitHub Action for every pass
        after that.
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
      <Link className="text-link" href="/docs">
        Read the command reference
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
