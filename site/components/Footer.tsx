import React from 'react';
import Image from 'next/image';
import { FileText, CheckCircle, Terminal, Heart } from 'lucide-react';

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

export function Footer() {
  return (
    <footer className="w-full border-t border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light/40 dark:bg-canvas-dark/60 mt-24 py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-full border border-border-strong-light dark:border-border-strong-dark overflow-hidden bg-white dark:bg-black flex-shrink-0">
                <img
                  src="/pomade-mascot.png"
                  alt="Pomade Mascot"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-mono text-base font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark">
                  Pomade
                </span>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark font-mono">
                  Make every repo worth opening.
                </p>
              </div>
            </div>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark max-w-sm leading-relaxed">
              He doesn't write your code. He makes sure it looks finished. The agent-native GitHub presentation, packaging, and maintenance engine.
            </p>
            <div className="pt-2 text-[11px] font-mono text-text-muted-light dark:text-text-muted-dark">
              MIT Licensed • Built for genuine developers and AI agents.
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider text-[11px]">
              Design Engine
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/templates" className="text-text-secondary-light dark:text-text-secondary-dark hover:text-copper-500 dark:hover:text-amberGold-400 transition-colors">
                  6 Curated Templates
                </a>
              </li>
              <li>
                <a href="/studio" className="text-text-secondary-light dark:text-text-secondary-dark hover:text-copper-500 dark:hover:text-amberGold-400 transition-colors">
                  Interactive Studio
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="text-text-secondary-light dark:text-text-secondary-dark hover:text-copper-500 dark:hover:text-amberGold-400 transition-colors">
                  Evidence Rubric
                </a>
              </li>
              <li>
                <a href="/docs" className="text-text-secondary-light dark:text-text-secondary-dark hover:text-copper-500 dark:hover:text-amberGold-400 transition-colors">
                  CLI Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Technical Specs */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider text-[11px]">
              Safety Invariants
            </h4>
            <ul className="space-y-2 text-text-muted-light dark:text-text-muted-dark text-[11px]">
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Zero Hallucination</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Managed Markers Preserved</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Explicit Approval Gates</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>100% Test Verified</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border-subtle-light dark:border-border-subtle-dark flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted-light dark:text-text-muted-dark font-mono space-y-4 sm:space-y-0">
          <div>
            © 2026 Gurtej Hundal. Designed with craftsmanship for open-source developers.
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/Gurtejhundal/PoMade"
              target="_blank"
              rel="noreferrer"
              className="hover:text-text-primary-light dark:hover:text-text-primary-dark flex items-center space-x-1"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <span className="text-border-strong-light dark:text-border-strong-dark">•</span>
            <span>v1.0.0-rc.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
