import type { Metadata } from 'next';
import { RELEASE, REPOSITORY } from '../../lib/product';
export const metadata: Metadata = { title: 'Changelog — PoMade' };
export default function ChangelogPage() {
  return (
    <article className="readme-page" id="content">
      <p className="doc-breadcrumb">PoMade / Changelog</p>
      <h1>What shipped.</h1>
      <p className="doc-lead">
        Versioned changes, downloadable packages, and the details behind each
        release.
      </p>
      <section className="markdown-section">
        <h2>v1.0.1 <span className="release-label">Latest</span></h2>
        <p>18 November 2026 · <a href={RELEASE}>Release notes & downloads →</a></p>
        <ul><li>A clearer plugin pitch: “Repository polish on every push.”</li><li>Every presentation pass includes a concise, factual GitHub About pitch, stored for metadata synchronization.</li><li>Updated CLI and plugin downloads include the new copy and skill guidance.</li></ul>
      </section>
      <section className="markdown-section">
        <h2>
          v1.0.0 <span className="release-label">Stable</span>
        </h2>
        <p>
          18 November 2026 · <a href={RELEASE}>Release notes & downloads →</a>
        </p>
        <ul>
          <li>
            Codex and Claude Code plugin packaging, with a repository
            marketplace and mascot icon.
          </li>
          <li>Bundled session and pre-push agent context hooks.</li>
          <li>
            Optional local Git pre-push checks with install, status, check, and
            uninstall commands.
          </li>
          <li>
            A complete README-style product website: functions, setup,
            templates, Studio, reference, workflow, and troubleshooting.
          </li>
          <li>
            Three shared README styles, managed content, safe saved plans, and
            push-triggered About/topics maintenance.
          </li>
        </ul>
        <p>
          The CLI and hooks require Node.js 22+. Packages are distributed
          through GitHub Releases.
        </p>
      </section>
      <section className="markdown-section">
        <h2>
          v1.0.0-rc.1 <span className="release-label">Pre-release</span>
        </h2>
        <p>
          18 November 2026 ·{' '}
          <a href={`${REPOSITORY}/releases/tag/v1.0.0-rc.1`}>Release notes →</a>
        </p>
        <p>
          First packaged CLI candidate: shared templates, browser Studio,
          saved-plan checks, GitHub Action, real sample media, and initial
          portable skill.
        </p>
      </section>
      <section className="markdown-section">
        <h2>Found a problem?</h2>
        <p>
          <a href={`${REPOSITORY}/issues`}>Report it on GitHub</a> with the
          version, command, expected result, and error. Leave credentials out of
          reports.
        </p>
      </section>
    </article>
  );
}
