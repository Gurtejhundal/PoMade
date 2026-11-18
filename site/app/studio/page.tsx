'use client';
import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Download, FileText, RotateCcw } from 'lucide-react';

import {
  PRESENTATION_STYLES,
  renderPresentation,
  renderBanner,
  type PresentationStyle,
  type PresentationFacts,
} from '../../../src/core/content/templates';
import { PUSH_WORKFLOW } from '../../../src/core/sync/workflow';
import { POMADE_SAMPLE } from '../../lib/templates/samples';
import { computeClientDiff } from '../../lib/templates/diff';
import { ReadmePreview } from '../../components/ReadmePreview';

export default function StudioPage() {
  const [style, setStyle] = useState<PresentationStyle>('signature');
  const [facts, setFacts] = useState<PresentationFacts>(POMADE_SAMPLE);
  const [topics, setTopics] = useState(
    'agent-skills, readme, github-actions, developer-tools'
  );
  const [tab, setTab] = useState<'preview' | 'markdown' | 'diff' | 'checks'>(
    'preview'
  );
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get(
      'template'
    );
    if (PRESENTATION_STYLES.some((t) => t.id === requested))
      setStyle(requested as PresentationStyle);
  }, []);
  const outputFacts = {
    ...facts,
    bannerUrl:
      style === 'animated' ? 'docs/media/pomade-motion.svg' : undefined,
    staticBannerUrl:
      style === 'animated' ? 'docs/media/pomade-static.svg' : undefined,
  };
  const markdown = renderPresentation(outputFacts, style);
  const baseline = `# ${facts.name}\n\n${facts.description}\n`;
  const diff = useMemo(
    () => computeClientDiff(baseline, markdown),
    [baseline, markdown]
  );
  const update = (key: keyof PresentationFacts, value: string) => {
    setFacts((f) => ({
      ...f,
      [key]: value,
      ...(key === 'repositoryUrl'
        ? {
            workflowPath: undefined,
            version: undefined,
            license: undefined,
            licensePath: undefined,
          }
        : {}),
    }));
    setMessage('');
  };
  const topicList = topics
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const validTopics =
    topicList.length <= 20 &&
    topicList.every((t) => /^[a-z0-9][a-z0-9-]{0,49}$/.test(t));
  const config = {
    preset: style,
    name: facts.name,
    tagline: facts.tagline,
    description: facts.description,
    topics: topicList,
    features: facts.features,
    installCommand: facts.installCommand,
    runCommand: facts.runCommand,
    testCommand: facts.testCommand,
    logo: facts.logoUrl,
    screenshot: facts.screenshotUrl,
    demo: facts.demoGifUrl,
    demoPoster: facts.demoPosterUrl,
    ...(facts.homepageUrl ? { homepage: facts.homepageUrl } : {}),
  };
  function download(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setMessage('README copied.');
    } catch {
      setMessage('Clipboard unavailable. Download the README instead.');
    }
  }
  async function bundle() {
    if (
      !validTopics ||
      !facts.name.trim() ||
      !facts.description.trim() ||
      facts.description.length > 350
    ) {
      setMessage(
        'Add a project name, a description under 350 characters, and valid topics before exporting.'
      );
      return;
    }
    setBusy(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      zip.file('README.md', markdown);
      zip.file('.pomade.json', JSON.stringify(config, null, 2) + '\n');
      zip.file('.github/workflows/pomade.yml', PUSH_WORKFLOW);
      if (style === 'animated') {
        zip.file('docs/media/pomade-motion.svg', renderBanner(facts));
        zip.file('docs/media/pomade-static.svg', renderBanner(facts, false));
      }
      for (const asset of [
        facts.logoUrl,
        facts.screenshotUrl,
        facts.demoGifUrl,
        facts.demoPosterUrl,
      ].filter((v): v is string => Boolean(v))) {
        const response = await fetch(asset.replace(/^docs\/media\//, '/'));
        if (!response.ok) throw new Error(`Media download failed: ${asset}`);
        zip.file(asset, await response.blob());
      }
      zip.file(
        'POMADE-SETUP.md',
        '# Finish your setup\n\nReview all claims and commands before committing. Copy the README, configuration, and workflow into your repository. Pin the action to a reviewed commit SHA. Add POMADE_TOKEN (Administration: write) only if you want automatic About/topics updates. The workflow assumes main. Keep your existing LICENSE; this bundle does not grant a license.\n\nTo include screenshots or demo GIFs, check real captures into docs/media and add screenshot/demo paths to .pomade.json. README commands are authored input, not executed or verified by Studio.\n'
      );
      download(
        await zip.generateAsync({ type: 'blob' }),
        `${facts.name.replace(/[^a-z0-9_-]/gi, '-') || 'project'}-pomade.zip`
      );
      setMessage(
        'Bundle downloaded: README, config, workflow, and any generated covers.'
      );
    } catch (error) {
      setMessage(
        `Export failed: ${error instanceof Error ? error.message : 'Try again.'}`
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="studio-page" id="content">
      <div className="studio-heading">
        <div>
          <div className="page-eyebrow">
            README STUDIO / LOCAL IN YOUR BROWSER
          </div>
          <h1>
            A little polish.
            <br />
            <em>Make it yours.</em>
          </h1>
        </div>
        <button
          className="quiet-button"
          onClick={() => {
            setFacts(POMADE_SAMPLE);
            setTopics('agent-skills, readme, github-actions, developer-tools');
            setMessage('Example restored.');
          }}
        >
          <RotateCcw size={14} />
          Reset example
        </button>
      </div>
      <p className="page-lead">
        Start with the PoMade example. Replace its facts with yours, preview the
        README, and take the files with you.
      </p>
      <div className="studio-layout">
        <aside className="studio-controls">
          <h2>
            01 <span>Choose your style</span>
          </h2>
          <div className="style-choice">
            {PRESENTATION_STYLES.map((t) => (
              <button
                key={t.id}
                aria-pressed={style === t.id}
                onClick={() => setStyle(t.id)}
              >
                <span>{t.number}</span>
                <strong>{t.name}</strong>
                {style === t.id && <Check size={14} />}
              </button>
            ))}
          </div>
          <h2>
            02 <span>The project facts</span>
          </h2>
          <label>
            Project name
            <input
              value={facts.name}
              maxLength={80}
              onChange={(e) => update('name', e.target.value)}
            />
          </label>
          <label>
            The one-liner
            <input
              value={facts.tagline || ''}
              maxLength={160}
              onChange={(e) => update('tagline', e.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              value={facts.description}
              maxLength={350}
              rows={4}
              onChange={(e) => update('description', e.target.value)}
            />
          </label>
          <label>
            GitHub repository
            <input
              value={facts.repositoryUrl || ''}
              onChange={(e) => update('repositoryUrl', e.target.value)}
            />
          </label>
          <label>
            Install command
            <textarea
              className="mono-input"
              value={facts.installCommand || ''}
              rows={4}
              onChange={(e) => update('installCommand', e.target.value)}
            />
          </label>
          <label>
            Usage command
            <textarea
              className="mono-input"
              value={facts.runCommand || ''}
              rows={3}
              onChange={(e) => update('runCommand', e.target.value)}
            />
          </label>
          <label>
            Topics <small>comma-separated</small>
            <textarea
              value={topics}
              rows={3}
              aria-invalid={!validTopics}
              onChange={(e) => setTopics(e.target.value)}
            />
          </label>
          {!validTopics && (
            <p className="field-error">
              Use up to 20 lowercase topics with letters, numbers, and hyphens
              (50 characters each).
            </p>
          )}
          <label className="media-checkbox">
            <input
              type="checkbox"
              checked={Boolean(facts.logoUrl)}
              onChange={(e) =>
                setFacts((f) => ({
                  ...f,
                  logoUrl: e.target.checked ? POMADE_SAMPLE.logoUrl : undefined,
                  screenshotUrl: e.target.checked
                    ? POMADE_SAMPLE.screenshotUrl
                    : undefined,
                  demoGifUrl: e.target.checked
                    ? POMADE_SAMPLE.demoGifUrl
                    : undefined,
                  demoPosterUrl: e.target.checked
                    ? POMADE_SAMPLE.demoPosterUrl
                    : undefined,
                }))
              }
            />
            Include PoMade example media
          </label>
          <p className="control-note">
            Uncheck for your own project. Add your checked-in captures to
            .pomade.json after export.
          </p>
          <h2>
            03 <span>What it actually does</span>
          </h2>
          {facts.features?.map((f, i) => (
            <div className="feature-editor" key={i}>
              <label>
                Feature {i + 1}
                <input
                  value={f.title}
                  onChange={(e) =>
                    setFacts((current) => ({
                      ...current,
                      features: current.features?.map((feature, j) =>
                        j === i
                          ? { ...feature, title: e.target.value }
                          : feature
                      ),
                    }))
                  }
                />
              </label>
              <label className="sr-only" htmlFor={`feature-description-${i}`}>
                Feature {i + 1} description
              </label>
              <textarea
                id={`feature-description-${i}`}
                rows={3}
                value={f.description}
                onChange={(e) =>
                  setFacts((current) => ({
                    ...current,
                    features: current.features?.map((feature, j) =>
                      j === i
                        ? { ...feature, description: e.target.value }
                        : feature
                    ),
                  }))
                }
              />
            </div>
          ))}
          <p className="control-note">
            Commands and claims are authored by you. Studio does not run or
            verify them.
          </p>
        </aside>
        <div className="studio-output">
          <div className="output-toolbar">
            <div role="group" aria-label="Output view">
              {(['preview', 'markdown', 'diff', 'checks'] as const).map((t) => (
                <button
                  key={t}
                  aria-pressed={tab === t}
                  onClick={() => setTab(t)}
                >
                  {t === 'markdown'
                    ? 'Markdown'
                    : t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <button
              className="icon-button"
              onClick={copy}
              aria-label="Copy README"
            >
              <Copy size={15} />
            </button>
          </div>
          <div className="output-meta">
            <span>
              <FileText size={13} />
              README.md
            </span>
            <span>
              {markdown.split('\n').length} lines · {style}
            </span>
          </div>
          {tab === 'preview' && (
            <ReadmePreview facts={outputFacts} style={style} />
          )}
          {tab === 'markdown' && (
            <pre className="raw-output">
              <code>{markdown}</code>
            </pre>
          )}
          {tab === 'diff' && (
            <div className="diff-output">
              <p>Compared with a title and description only.</p>
              {diff.map((line, i) => (
                <pre key={i} className={`diff-${line.type}`}>
                  {line.text}
                </pre>
              ))}
            </div>
          )}
          {tab === 'checks' && (
            <div className="checks-output">
              <h2>Before you ship</h2>
              {[
                [
                  'Project identity',
                  Boolean(facts.name.trim() && facts.description.trim()),
                ],
                [
                  'Installation command supplied',
                  Boolean(facts.installCommand?.trim()),
                ],
                ['Usage command supplied', Boolean(facts.runCommand?.trim())],
                ['Topics fit GitHub limits', validTopics],
              ].map(([label, checked]) => (
                <p key={String(label)}>
                  <span>{checked ? '✓' : '○'}</span>
                  {label}
                </p>
              ))}
              <p>
                These checks confirm supplied fields. Run the CLI in your real
                repository to inspect source evidence, existing files, and
                command configuration.
              </p>
              <p>
                For screenshots and GIFs, add checked-in capture paths to{' '}
                <code>.pomade.json</code>. Motion includes an animated SVG cover
                and its static alternative.
              </p>
            </div>
          )}
          <div className="export-bar">
            <button
              className="quiet-button"
              onClick={() =>
                download(
                  new Blob([markdown], { type: 'text/markdown' }),
                  'README.md'
                )
              }
            >
              <Download size={14} />
              README.md
            </button>
            <button
              className="primary-button"
              onClick={bundle}
              disabled={busy || !validTopics}
            >
              <Download size={14} />
              {busy ? 'Packaging…' : 'Download repo kit'}
            </button>
          </div>
          <p className="export-note">
            README + config + push workflow. Motion adds both cover assets.
          </p>
          <p role="status" className="studio-status">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
