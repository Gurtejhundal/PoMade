import { GithubIcon } from './GithubIcon';

export function Footer() {
  return (
    <footer className="site-footer">
      <span>
        <strong>PoMade</strong> <span className="footer-dot">/</span> A little
        polish goes a long way.
      </span>
      <div>
        <a href="https://github.com/Gurtejhundal/PoMade/blob/main/LICENSE">
          MIT license
        </a>
        <a href="/docs">Documentation</a>
        <a
          href="https://github.com/Gurtejhundal/PoMade"
          aria-label="PoMade on GitHub"
        >
          <GithubIcon size={16} />
        </a>
      </div>
    </footer>
  );
}
