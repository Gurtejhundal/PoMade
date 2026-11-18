import Link from 'next/link';
import { TemplateSwitcher } from '../components/TemplateSwitcher';
import { INSTALL_COMMAND, VERSION, FEATURES, RELEASE } from '../lib/product';
import { StarHistory } from '../components/StarHistory';
const repo = 'https://github.com/Gurtejhundal/PoMade';
function Shield({
  label,
  value,
  color,
  href,
}: {
  label: string;
  value: string;
  color: string;
  href: string;
}) {
  return (
    <a className="readme-shield" href={href}>
      <span>{label}</span>
      <strong style={{ backgroundColor: color }}>{value}</strong>
    </a>
  );
}
export default function HomePage() {
  return (
    <article className="standalone-readme" id="content">
      <header className="readme-opening">
        <img
          className="readme-mascot"
          src="/pomade-mascot.png"
          alt="PoMade, your repository's finishing touch"
          width="244"
          height="244"
          fetchPriority="high"
        />
        <h1>PoMade</h1>
        <p className="readme-punchline">
          <em>Code pushed. First impression handled.</em>
        </p>
        <p className="readme-summary">
          Your agent writes the code.
          <br />
          PoMade makes the repository worth opening.
        </p>
        <p className="readme-anchor-links">
          <Link href="/install">Installation</Link>
          <span> · </span>
          <a href="#how-it-works">How it works</a>
          <span> · </span>
          <a href="#templates">Templates</a>
          <span> · </span>
          <Link href="/studio">README Studio</Link>
          <span> · </span>
          <a href={repo}>GitHub</a>
        </p>
        <div className="flat-badge-row primary-readme-badges">
          <a href={`${repo}/stargazers`}>
            <img
              src="https://img.shields.io/github/stars/Gurtejhundal/PoMade?style=flat-square&color=24292f&label=stars"
              alt="PoMade GitHub stars"
              height="20"
            />
          </a>
          <Shield
            label="version"
            value={VERSION}
            color="#24292f"
            href={`${repo}/blob/main/package.json`}
          />
          <Shield
            label="agent skill"
            value="included"
            color="#24292f"
            href={`${repo}/tree/main/skills/pomade`}
          />
          <Shield
            label="license"
            value="MIT"
            color="#24292f"
            href={`${repo}/blob/main/LICENSE`}
          />
        </div>
        <div className="flat-badge-row resource-readme-badges">
          <Shield
            label="DOCS"
            value="GET STARTED"
            color="#0969da"
            href="/docs"
          />
          <Shield
            label="TEMPLATES"
            value="3 STYLES"
            color="#8250df"
            href="#templates"
          />
          <Shield
            label="WORKFLOW"
            value="ON PUSH"
            color="#1a7f37"
            href="/how-it-works"
          />
          <Shield
            label="BUILT BY"
            value="GURTEJ HUNDAL"
            color="#bf8700"
            href="https://github.com/Gurtejhundal"
          />
        </div>
      </header>

      <section className="markdown-section" id="overview">
        <h2>What is PoMade?</h2>
        <p>
          The code works. The README still says “coming soon.” The About is
          empty. Nobody knows what the project does.
        </p>
        <p>
          <strong>PoMade handles the last mile.</strong> It is a coding-agent
          companion and a GitHub Action that keeps your README, real demo media,
          About, and topics in step with the code you ship.
        </p>
        <blockquote>
          A sharp one-liner. A working command. A real preview. A repo that
          feels finished.
        </blockquote>
      </section>

      <section className="markdown-section" id="functions">
        <h2>The finishing tools, together.</h2>
        <div className="function-index">
          {FEATURES.map((f, i) => (
            <div key={f.id}>
              <span>0{i + 1}</span>
              <h3>
                <Link href={`/features#${f.id}`}>{f.title}</Link>
              </h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
        <p>
          <Link href="/features">Explore every function →</Link> ·{' '}
          <Link href="/install#hooks">Understand the hooks →</Link>
        </p>
      </section>

      <section className="markdown-section" id="status">
        <h2>Status</h2>
        <div className="flat-badge-row status-readme-badges">
          <a href={`${repo}/actions/workflows/ci.yml`}>
            <img
              src="https://github.com/Gurtejhundal/PoMade/actions/workflows/ci.yml/badge.svg"
              alt="Current PoMade CI status"
              height="20"
            />
          </a>
          <Shield
            label="templates"
            value="3 styles"
            color="#1a7f37"
            href="#templates"
          />
          <Shield
            label="release"
            value="v1.0.1"
            color="#9a6700"
            href={`${repo}/blob/main/package.json`}
          />
          <Shield
            label="media"
            value="SVG + GIF"
            color="#0969da"
            href="#demo"
          />
        </div>
        <p className="markdown-note">
          <a href={RELEASE}>Download v1.0.1</a>. Install the packaged CLI from
          GitHub Releases.
        </p>
      </section>

      <section className="markdown-section" id="demo">
        <h2>See it in action</h2>
        <p>
          Presentation is part of shipping. Here is the actual PoMade CLI
          output, played back as a short animation.
        </p>
        <a href={`${repo}/blob/main/docs/media/cli-demo.gif`}>
          <img
            className="readme-demo"
            src="/cli-demo.gif"
            alt="Animated playback of PoMade's real init and sync help output"
            width="1120"
            height="530"
            loading="lazy"
          />
        </a>
        <p className="markdown-note">
          <a href="/cli-demo-static.png">Static version</a> ·{' '}
          <Link href="/studio">Try the README Studio</Link>
        </p>
      </section>

      <section className="markdown-section" id="installation">
        <h2>Installation</h2>
        <p>Install the release package with Node.js 22 or newer:</p>
        <pre>
          <code>{INSTALL_COMMAND}</code>
        </pre>
        <p>Then, inside the project you want to polish:</p>
        <pre>
          <code>
            {
              'pomade init --preset signature --approved\npomade diff\npomade apply --approved'
            }
          </code>
        </pre>
        <p>
          <code>init</code> installs the configuration and push workflow. Review
          the first diff, adopt managed sections once, and commit the files with
          your code.
        </p>
        <p>
          <Link href="/install">Agent installation, hooks, and setup →</Link>
        </p>
      </section>

      <section className="markdown-section" id="how-it-works">
        <h2>How it works</h2>
        <ol className="markdown-steps">
          <li>
            <strong>Read the project.</strong> Inspect manifests, scripts,
            documentation, licenses, and existing media.
          </li>
          <li>
            <strong>Choose the first impression.</strong> Simple, Signature, or
            Motion. Your facts, your voice.
          </li>
          <li>
            <strong>Review the diff.</strong> Inspect a saved plan before
            applying it. Stale targets and malformed markers stop the update.
          </li>
          <li>
            <strong>Push the code.</strong> The GitHub Action maintains
            generated README sections and cover assets.
          </li>
          <li>
            <strong>Keep the front door current.</strong> An optional scoped
            token syncs About, homepage, and topics.
          </li>
        </ol>
        <blockquote>
          Handwritten text outside the managed sections stays yours.
        </blockquote>
        <p>
          <Link href="/how-it-works">Workflow, permissions, and setup →</Link>
        </p>
      </section>

      <section className="markdown-section" id="templates">
        <h2>Three ways to introduce your project</h2>
        <div className="markdown-table-scroll">
          <table className="markdown-table">
            <thead>
              <tr>
                <th>Simple</th>
                <th>Signature</th>
                <th>Motion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Quiet. Direct. Command-first.</td>
                <td>An identity people remember.</td>
                <td>Show the thing doing the thing.</td>
              </tr>
              <tr>
                <td>Title, setup, features, usage.</td>
                <td>Logo, one-liner, badges, real image.</td>
                <td>Animated cover, real GIF, static alternatives.</td>
              </tr>
              <tr>
                <td>
                  <Link href="/studio?template=minimal">Use Simple →</Link>
                </td>
                <td>
                  <Link href="/studio?template=signature">Use Signature →</Link>
                </td>
                <td>
                  <Link href="/studio?template=animated">Use Motion →</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Same project. Same facts. Pick a preview:</p>
        <TemplateSwitcher />
        <p>
          <Link href="/templates">Explore all three templates →</Link>
        </p>
      </section>

      <section className="markdown-section" id="agent-plugin">
        <h2>Made for your coding agent</h2>
        <p>
          The included skill brings presentation into a requested commit or push
          workflow. The Action keeps it maintained after the push.
        </p>
        <pre>
          <code>
            {
              'codex plugin marketplace add Gurtejhundal/Pomade --ref v1.0.1\ncodex plugin add pomade@pomade'
            }
          </code>
        </pre>
        <p>
          Other agents that support portable skills can install{' '}
          <a href={`${repo}/tree/main/skills/pomade`}>
            <code>skills/pomade</code>
          </a>{' '}
          with their own skill installer. Loading the skill alone does not
          install a Git hook.
        </p>
      </section>

      <section className="markdown-section" id="principles">
        <h2>A little polish. No made-up proof.</h2>
        <ul>
          <li>
            <strong>Real media.</strong> Screenshots come from the running
            product. Generated covers are labeled as covers.
          </li>
          <li>
            <strong>Useful badges.</strong> Live GitHub data and declared
            project facts. No invented stars or passing builds.
          </li>
          <li>
            <strong>Reviewed claims.</strong> A dependency is a dependency. A
            configured test command is not a passing test.
          </li>
          <li>
            <strong>Your writing.</strong> Generated sections are maintained.
            Your surrounding prose is preserved.
          </li>
        </ul>
        <p>
          Structure references:{' '}
          <a href="https://github.com/DietrichGebert/ponytail">Ponytail</a>,{' '}
          <a href="https://github.com/ollama/ollama">Ollama</a>,{' '}
          <a href="https://github.com/fastapi/fastapi">FastAPI</a>,{' '}
          <a href="https://github.com/microsoft/vscode">VS Code</a>,{' '}
          <a href="https://github.com/denoland/deno">Deno</a>, and{' '}
          <a href="https://github.com/yt-dlp/yt-dlp">yt-dlp</a>.{' '}
          <a href={`${repo}/blob/main/docs/design/REFERENCE_ANALYSIS.md`}>
            Read the research.
          </a>
        </p>
      </section>

      <section className="markdown-section" id="star-history">
        <h2>Star History</h2>
        <StarHistory />
      </section>
      <section className="markdown-section" id="contributing">
        <h2>Contributing</h2>
        <p>
          Have a better example, a useful template improvement, or a bug to
          report? <a href={`${repo}/issues`}>Open an issue</a> or read the{' '}
          <a href={`${repo}/blob/main/CONTRIBUTING.md`}>contributing guide</a>.
        </p>
      </section>
      <section className="markdown-section" id="license">
        <h2>License</h2>
        <p>
          <a href={`${repo}/blob/main/LICENSE`}>MIT</a> © Gurtej Hundal.
        </p>
      </section>
    </article>
  );
}
