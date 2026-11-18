'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
export function Header() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('pomade-theme', next ? 'dark' : 'light');
    } catch {}
  }
  return (
    <header
      className={`document-header ${pathname === '/' ? 'home-document-header' : ''}`}
    >
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      {pathname !== '/' && (
        <nav aria-label="Main navigation">
          <Link href="/">← PoMade</Link>
          <Link
            href="/templates"
            aria-current={pathname === '/templates' ? 'page' : undefined}
          >
            Templates
          </Link>
          <Link
            href="/studio"
            aria-current={pathname === '/studio' ? 'page' : undefined}
          >
            Studio
          </Link>
          <Link
            href="/how-it-works"
            aria-current={pathname === '/how-it-works' ? 'page' : undefined}
          >
            Workflow
          </Link>
          <Link
            href="/docs"
            aria-current={pathname === '/docs' ? 'page' : undefined}
          >
            Docs
          </Link>
        </nav>
      )}
      <button
        className="theme-button"
        aria-label={dark ? 'Use light theme' : 'Use dark theme'}
        onClick={toggleTheme}
      >
        {dark ? <Sun size={17} /> : <Moon size={17} />}
      </button>
    </header>
  );
}
