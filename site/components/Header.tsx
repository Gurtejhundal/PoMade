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
    <header className="document-header">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Link className="site-wordmark" href="/" aria-label="PoMade home">
        PoMade<span>v1.0.0</span>
      </Link>
      <nav aria-label="Main navigation">
        {[
          ['/features', 'Functions'],
          ['/templates', 'Templates'],
          ['/studio', 'Studio'],
          ['/install', 'Install & hooks'],
          ['/docs', 'Docs'],
          ['/changelog', 'Changelog'],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
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
