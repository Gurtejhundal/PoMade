import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, LayoutTemplate, Sliders } from 'lucide-react';

export default function TemplatesPage() {
  const templates = [
    {
      id: 'character',
      name: 'Template 01 — The Character',
      desc: 'Inspired by personality-led utilities (like Ponytail). Centered mascot hero, bold project name, memorable tagline, minimal badge strip, and concise quickstart.',
      recommended: ['Agent Skills', 'CLI Tools', 'Developer Utilities'],
      sections: ['Mascot Hero', 'Hook & Philosophy', 'The Decision Ladder', 'Quickstart', 'Configuration', 'License'],
    },
    {
      id: 'terminal-noir',
      name: 'Template 02 — Terminal Noir',
      desc: 'Inspired by terminal-native developer products (like Hermes Agent). Dark-mode banner, monospaced typography, command prompts, flags table, and process tree.',
      recommended: ['System Utilities', 'Backend Daemons', 'Agent Harnesses', 'Infrastructure'],
      sections: ['Terminal Banner', 'Command Reference', 'Process Tree', 'Platform Matrix', 'Environment Variables'],
    },
    {
      id: 'product-showcase',
      name: 'Template 03 — Product Showcase',
      desc: 'Inspired by modern open-source product documentation (like OpenDesign). High-impact screenshot hero with window drop-shadows, 2-column visual feature grid, and live demo links.',
      recommended: ['Web Applications', 'Desktop Tools', 'Dashboards', 'SaaS Products'],
      sections: ['Product Screenshot Hero', 'Feature Grid with Captures', 'Demo Walkthrough', 'Platform Binaries', 'Roadmap'],
    },
    {
      id: 'editorial',
      name: 'Template 04 — Editorial',
      desc: 'Inspired by essayist, human-written developer tools (like Traqu). Storytelling headings, illustrated workflow diagrams, wide visual breathing room, and reduced badge clutter.',
      recommended: ['Creative Software', 'Productivity Tools', 'Craft-Driven Apps'],
      sections: ['Editorial Headline', 'The Friction', 'Illustrated Workflow', 'Step-by-Step Narrative', 'Daily Routine'],
    },
    {
      id: 'technical-precision',
      name: 'Template 05 — Technical Precision',
      desc: 'Inspired by specification-grade design systems (like UI UX Pro Max). Deep configuration tables, API signatures, Mermaid state diagrams, and strict developer documentation.',
      recommended: ['SDKs', 'Libraries', 'APIs', 'Enterprise Tooling'],
      sections: ['Specification Pill', 'API Reference', 'Config Options Table', 'Mermaid Architecture', 'Benchmarks'],
    },
    {
      id: 'research-lab',
      name: 'Template 06 — Research Lab',
      desc: 'Designed for machine-learning, AI models, and scientific research. Research thesis, dataset details, verifiable benchmark comparison tables with source links, and BibTeX citation.',
      recommended: ['ML Models', 'Academic Research', 'Datasets', 'Algorithms'],
      sections: ['Paper Title & Abstract', 'Model Methodology', 'Dataset Specs', 'Verified Benchmarks Table', 'BibTeX Citation'],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-wider text-copper-600 dark:text-amberGold-400 font-semibold">
          Curated Gallery
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
          6 Genuinely Distinct README Designs
        </h1>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-sans leading-relaxed">
          Not six identical layouts with different accent colors. Each template features unique composition, content hierarchy, and visual rhythm.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="p-6 rounded-xl border border-border-subtle-light dark:border-border-subtle-dark bg-surface-light dark:bg-surface-dark space-y-5 hover:border-copper-500/50 dark:hover:border-amberGold-500/50 transition-all shadow-editorial flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle-light dark:border-border-subtle-dark">
                <span className="font-mono text-xs font-bold text-copper-600 dark:text-amberGold-400">
                  {tpl.id.toUpperCase()}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-subtle-light dark:bg-subtle-dark text-text-muted-light dark:text-text-muted-dark border border-border-subtle-light dark:border-border-subtle-dark">
                  Light & Dark Ready
                </span>
              </div>

              <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                {tpl.name}
              </h2>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed font-sans">
                {tpl.desc}
              </p>

              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                  Recommended For:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tpl.recommended.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-copper-50 dark:bg-amberGold-500/10 text-copper-700 dark:text-amberGold-300 border border-copper-200/60 dark:border-amberGold-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                  Supported Sections:
                </div>
                <div className="text-[11px] font-mono text-text-muted-light dark:text-text-muted-dark">
                  {tpl.sections.join(' • ')}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle-light dark:border-border-subtle-dark">
              <a
                href={`/studio?template=${tpl.id}`}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-subtle-light hover:bg-copper-500 hover:text-white dark:bg-subtle-dark dark:hover:bg-amberGold-500 dark:hover:text-black font-mono text-xs font-semibold text-text-primary-light dark:text-text-primary-dark transition-all border border-border-subtle-light dark:border-border-subtle-dark"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize in Studio</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
