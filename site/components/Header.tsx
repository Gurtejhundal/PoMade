'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GitBranch,
  FolderGit2,
  FileText,
  LayoutTemplate,
  Sliders,
  HelpCircle,
  BookOpen,
  Sun,
  Moon,
  CheckCircle2,
} from 'lucide-react';

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check saved theme or system preference
    const saved = localStorage.getItem('pomade-theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pomade-theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pomade-theme', 'dark');
      setIsDark(true);
    }
  };

  const navItems = [
    { label: 'README.md', href: '/', icon: FileText },
    { label: 'Templates', href: '/templates', icon: LayoutTemplate },
    { label: 'Studio', href: '/studio', icon: Sliders },
    { label: 'How it works', href: '/how-it-works', icon: HelpCircle },
    { label: 'Docs', href: '/docs', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle-light dark:border-border-subtle-dark bg-canvas-light/90 dark:bg-canvas-dark/90 backdrop-blur-md transition-colors">
      {/* Top Repo Meta Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Repo Identity */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-2 text-text-primary-light dark:text-text-primary-dark font-mono text-sm hover:opacity-80 transition-opacity"
            >
              <FolderGit2 className="w-4 h-4 text-copper-500 dark:text-amberGold-500" />
              <span className="text-text-muted-light dark:text-text-muted-dark">gurtejbirsinghh</span>
              <span className="text-border-strong-light dark:text-border-strong-dark">/</span>
              <span className="font-semibold tracking-tight">pomade</span>
            </Link>

            {/* Branch pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 rounded text-xs font-mono bg-subtle-light dark:bg-subtle-dark border border-border-subtle-light dark:border-border-subtle-dark text-text-secondary-light dark:text-text-secondary-dark">
              <GitBranch className="w-3 h-3 text-copper-500 dark:text-amberGold-500" />
              <span>main</span>
            </div>

            {/* Release tag */}
            <div className="hidden md:flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-copper-50 dark:bg-amberGold-500/10 text-copper-600 dark:text-amberGold-400 border border-copper-200 dark:border-amberGold-500/30">
              <CheckCircle2 className="w-3 h-3" />
              <span>v1.0.0-rc.1</span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-1.5 rounded-md border border-border-subtle-light dark:border-border-subtle-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-subtle-light dark:hover:bg-subtle-dark transition-all"
            >
              {isDark ? <Sun className="w-4 h-4 text-amberGold-400" /> : <Moon className="w-4 h-4 text-copper-600" />}
            </button>

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/Gurtejhundal/PoMade"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono rounded-md border border-border-subtle-light dark:border-border-subtle-dark text-text-primary-light dark:text-text-primary-dark hover:bg-subtle-light dark:hover:bg-subtle-dark transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Star</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs (GitHub File Tab Style) */}
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar border-t border-border-subtle-light/60 dark:border-border-subtle-dark/60 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                  isActive
                    ? 'bg-subtle-light dark:bg-subtle-dark text-copper-600 dark:text-amberGold-400 font-semibold shadow-editorial border border-border-subtle-light dark:border-border-subtle-dark'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-subtle-light/50 dark:hover:bg-subtle-dark/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-copper-500 dark:text-amberGold-500' : 'text-text-muted-light dark:text-text-muted-dark'}`} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
