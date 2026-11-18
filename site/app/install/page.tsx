import Link from 'next/link';
import type { Metadata } from 'next';
import { CodeBlock } from '../../components/CodeBlock';
import { INSTALL_COMMAND, RELEASE, REPOSITORY } from '../../lib/product';
export const metadata: Metadata = {
  title: 'Installation & hooks — PoMade',
  description:
    'Install PoMade in Codex, Claude Code, or your terminal. Configure optional hooks and GitHub Actions.',
};
export default function InstallPage() {
  return (
    <article className="readme-page" id="content">
      <p className="doc-breadcrumb">PoMade / Installation</p>
      <h1>A small setup. A better next push.</h1>
      <p className="doc-lead">
        Use the browser Studio without installation, or add PoMade to your
        terminal and coding agent. Node.js 22 or newer is required for the CLI
        and bundled hooks.
      </p>
      <nav className="page-toc" aria-label="On this page">
        <a href="#cli">CLI</a>
        <a href="#codex">Codex</a>
        <a href="#claude">Claude Code</a>
        <a href="#first-run">First repository</a>
        <a href="#hooks">Hooks</a>
        <a href="#github">GitHub Action</a>
      </nav>
      <section className="markdown-section" id="cli">
        <h2>1. Install the CLI</h2>
        <p>
          Install the package attached to the{' '}
          <a href={RELEASE}>v1.0.1 release</a>. This does not depend on an npm
          registry publication.
        </p>
        <CodeBlock>{INSTALL_COMMAND + '\npomade --version'}</CodeBlock>
        <details>
          <summary>Prefer building from source?</summary>
          <CodeBlock>
            {
              'git clone https://github.com/Gurtejhundal/Pomade.git PoMade\ncd PoMade\nnpm ci\nnpm run build\nnpm link'
            }
          </CodeBlock>
        </details>
        <p>
          Only want to make a README? <Link href="/studio">Open Studio</Link>,
          edit the facts, and download a kit.
        </p>
        <p>
          The updated guided agent flow is currently on the repository’s main
          branch. The v1.0.1 release archives are unchanged. Use a source checkout for the updated flow
          until the next release.
        </p>
      </section>
      <section className="markdown-section" id="codex">
        <h2>2a. Add PoMade to Codex</h2>
        <CodeBlock>
          {
            'codex plugin marketplace add Gurtejhundal/Pomade --ref v1.0.1\ncodex plugin add pomade@pomade'
          }
        </CodeBlock>
        <p>
          Restart Codex or open a new chat. Look for <strong>PoMade</strong> in
          the plugin picker and mention it with <code>@PoMade</code>. Review and
          trust the bundled hooks when Codex asks. Installing the plugin does
          not install the CLI or a Git hook.
        </p>
        <blockquote>
          Hooks execute locally. This is a manually installable repository
          plugin, not a claim of approval in the universal public plugin
          directory.
        </blockquote>
        <p>
          <a href="https://developers.openai.com/plugins/build/plugins">
            Official Codex plugin packaging and installation
          </a>
        </p>
      </section>
      <section className="markdown-section" id="claude">
        <h2>2b. Add PoMade to Claude Code</h2>
        <p>Inside Claude Code:</p>
        <CodeBlock>
          {
            '/plugin marketplace add Gurtejhundal/Pomade\n/plugin install pomade@pomade'
          }
        </CodeBlock>
        <p>
          Then invoke <code>/pomade:pomade</code>. For a local checkout, start
          with <code>claude --plugin-dir /absolute/path/to/PoMade</code>.
          Session and pre-tool hooks are bundled; review the host’s hook
          permissions.
        </p>
        <details>
          <summary>Other coding agents</summary>
          <p>
            Install{' '}
            <a href={`${REPOSITORY}/tree/main/skills/pomade`}>skills/pomade</a>{' '}
            using the agent’s supported skill installer. Hook formats vary by
            host; portable skill installation alone does not activate lifecycle
            hooks. The Git pre-push check works independently of the agent.
          </p>
        </details>
      </section>
      <section className="markdown-section" id="first-run">
        <h2>3. Adopt your first repository</h2>
        <p>
          In your coding agent, invoke PoMade and say: “Understand this project
          and prepare its GitHub presentation.” It inspects the project, media,
          and release history, suggests three About pitches, and asks which pitch
          and README style you want. It then derives topics and prepares the
          changes using real project assets. Your choices are reused on later
          pushes.
        </p>
        <p>For manual CLI setup, run these inside the target repository:</p>
        <CodeBlock>
          {
            'pomade init --preset signature --approved\npomade diff\n# Review the proposed change before continuing\npomade apply --approved'
          }
        </CodeBlock>
        <p>
          Edit <code>.pomade.json</code> with your pitch, features, and media.
          Choose <code>minimal</code>, <code>signature</code>, or{' '}
          <code>animated</code>. Commit the README, config, workflow, and
          referenced media with your code.
        </p>
        <p>
          <Link href="/templates">Compare the three styles →</Link>
        </p>
      </section>
      <section className="markdown-section" id="hooks">
        <h2>4. Decide how to hook it in</h2>
        <div className="markdown-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>When</th>
                <th>Setup</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Agent hook</td>
                <td>Session start and shell git push</td>
                <td>Bundled with plugin; review/trust in the agent</td>
              </tr>
              <tr>
                <td>Git hook</td>
                <td>Before a local push</td>
                <td>Optional, installed per clone</td>
              </tr>
              <tr>
                <td>GitHub Action</td>
                <td>After a push to main</td>
                <td>Installed by pomade init; commit the workflow</td>
              </tr>
            </tbody>
          </table>
        </div>
        <CodeBlock>
          {
            'pomade hooks install --approved\npomade hooks status\npomade hooks check'
          }
        </CodeBlock>
        <p>
          The Git hook checks current generated content and uncommitted
          README/cover changes. It stops a push when a refresh or commit is
          needed. It never rewrites, stages, commits, or pushes for you.
        </p>
        <CodeBlock>
          {
            '# If the check reports stale presentation\npomade sync --approved\ngit diff\n# Commit the reviewed presentation, then push again\n\n# Remove the optional Git hook\npomade hooks uninstall --approved'
          }
        </CodeBlock>
        <p>
          Existing pre-push hooks and custom <code>core.hooksPath</code>{' '}
          settings are left intact. Add <code>pomade hooks check</code> to your
          existing hook manager instead. Git hooks are local checks, not an
          enforced server policy; the Action is the after-push layer.
        </p>
      </section>
      <section className="markdown-section" id="github">
        <h2>5. Enable GitHub maintenance</h2>
        <p>
          <code>pomade init</code> writes{' '}
          <code>.github/workflows/pomade.yml</code>. Adjust the default branch,
          pin the Action to a reviewed version or commit, and allow{' '}
          <code>contents: write</code> for generated-file commits.
        </p>
        <p>
          For About/topics, create a fine-grained token restricted to your
          repository with <strong>Administration: read and write</strong>. Save
          it in repository Settings → Secrets and variables → Actions as{' '}
          <code>POMADE_TOKEN</code>. Never put the token in a command, config
          file, or chat.
        </p>
        <p>
          Without that secret, README maintenance continues and metadata sync is
          skipped. Protected branches may need a pull-request workflow.{' '}
          <Link href="/how-it-works">See the complete workflow →</Link>
        </p>
      </section>
    </article>
  );
}
