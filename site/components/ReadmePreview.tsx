import {
  safeMediaUrl,
  type PresentationFacts,
  type PresentationStyle,
} from '../../src/core/content/templates';

export function ReadmePreview({
  facts,
  style = 'signature',
  compact = false,
  idPrefix = 'preview',
}: {
  facts: PresentationFacts;
  style?: PresentationStyle;
  compact?: boolean;
  idPrefix?: string;
}) {
  const media = safeMediaUrl(
    style === 'animated'
      ? facts.demoGifUrl || facts.screenshotUrl
      : facts.screenshotUrl
  );
  return (
    <article className={`readme-preview ${compact ? 'compact-preview' : ''}`}>
      <div
        className={
          style === 'minimal' ? 'preview-intro simple-intro' : 'preview-intro'
        }
      >
        {style !== 'minimal' &&
          facts.logoUrl === 'docs/media/pomade-mascot.png' && (
            <img
              className="preview-logo"
              src="/pomade-mascot.png"
              width="80"
              height="80"
              alt="PoMade mascot"
            />
          )}
        <h2>{facts.name || 'Your project'}</h2>
        <p className="preview-tagline">{facts.tagline || facts.description}</p>
        <div className="badge-row">
          {facts.version && (
            <span>
              <b>version</b>
              {facts.version}
            </span>
          )}
          {facts.license && (
            <span>
              <b>license</b>
              {facts.license}
            </span>
          )}
          {facts.workflowPath && (
            <a href={`${facts.repositoryUrl}/actions`}>
              <b>CI</b>view workflow ↗
            </a>
          )}
        </div>
        <div className="readme-links">
          <a href={`#${idPrefix}-quickstart`}>Quickstart</a>
          <span>·</span>
          <a href={`#${idPrefix}-features`}>Features</a>
          {safeMediaUrl(facts.repositoryUrl) && (
            <>
              <span>·</span>
              <a href={safeMediaUrl(facts.repositoryUrl)}>Repository ↗</a>
            </>
          )}
        </div>
      </div>
      {style === 'animated' && (
        <div className="motion-cover">
          <div className="motion-eyebrow">README / MOTION</div>
          <strong>
            {facts.name}
            <span className="cursor">_</span>
          </strong>
          <p>{facts.tagline}</p>
          <div className="motion-track" />
          <small>Animated cover · static alternative included</small>
        </div>
      )}
      <h3>Overview</h3>
      <p>{facts.description}</p>
      {media && style !== 'minimal' && (
        <>
          <h3>See it in action</h3>
          <img
            className="product-capture"
            src={media.replace(/^docs\/media\//, '/')}
            alt={`${facts.name} demonstration`}
          />
        </>
      )}
      <h3 id={`${idPrefix}-quickstart`}>Quickstart</h3>
      <pre>
        <code>
          {facts.installCommand || '# Add your verified installation command'}
        </code>
      </pre>
      <h3 id={`${idPrefix}-features`}>Features</h3>
      <ul>
        {facts.features?.map((f) => (
          <li key={f.title}>
            <strong>{f.title}</strong> — {f.description}
          </li>
        ))}
      </ul>
      {!compact && (
        <>
          <h3>Usage</h3>
          <pre>
            <code>{facts.runCommand || '# Add your verified run command'}</code>
          </pre>
          {facts.testCommand && (
            <>
              <h3>Development</h3>
              <p>Configured test command:</p>
              <pre>
                <code>{facts.testCommand}</code>
              </pre>
            </>
          )}
          <h3>License</h3>
          <p>{facts.license || 'No license declared.'}</p>
        </>
      )}
    </article>
  );
}
