'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sliders,
  Eye,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  FileText,
  Terminal,
  Cpu,
  Bookmark,
  Share2,
} from 'lucide-react';
import { TEMPLATES } from '../../lib/templates/registry';
import { SAMPLE_PROJECTS } from '../../lib/templates/samples';
import type { TemplateDefinition } from '../../lib/templates/types';

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);

  const categories = [
    { id: 'all', label: 'All Templates (6)' },
    { id: 'cli', label: 'CLI & Tools' },
    { id: 'web', label: 'Web & Desktop' },
    { id: 'api', label: 'SDKs & APIs' },
    { id: 'research', label: 'Research & ML' },
  ];

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'cli') return tpl.category === 'cli';
    if (selectedCategory === 'web') return tpl.category === 'web';
    if (selectedCategory === 'api') return tpl.category === 'api' || tpl.category === 'library';
    if (selectedCategory === 'research') return tpl.category === 'research';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-wider text-copper-600 dark:text-amberGold-400 font-semibold">
          Curated Design Gallery
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight font-sans">
          6 Genuinely Distinct README Designs
        </h1>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-sans leading-relaxed">
          Not six identical layouts with different accent colors. Each design features distinct composition, content hierarchy, and visual rhythm.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                selectedCategory === c.id
                  ? 'bg-copper-500 text-white dark:bg-amberGold-500 dark:text-black font-bold shadow-editorial'
                  : 'bg-subtle-light dark:bg-subtle-dark text-text-secondary-light dark:text-text-secondary-dark border border-border-subtle-light dark:border-border-subtle-dark hover:border-copper-500'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {filteredTemplates.map((tpl) => {
          const sample = SAMPLE_PROJECTS[tpl.id] || SAMPLE_PROJECTS.character;
          return (
            <div
              key={tpl.id}
              className="p-6 rounded-2xl border border-border-subtle-light dark:border-border-subtle-dark bg-surface-light dark:bg-surface-dark space-y-5 hover:border-copper-500/60 dark:hover:border-amberGold-500/60 transition-all shadow-editorial flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Card Top Meta */}
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle-light dark:border-border-subtle-dark">
                  <span className="font-mono text-xs font-bold text-copper-600 dark:text-amberGold-400 uppercase tracking-wide">
                    {tpl.id}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-subtle-light dark:bg-subtle-dark text-text-muted-light dark:text-text-muted-dark border border-border-subtle-light dark:border-border-subtle-dark">
                    Light & Dark
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-copper-600 dark:group-hover:text-amberGold-400 transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="text-xs font-serif italic text-text-muted-light dark:text-text-muted-dark pt-0.5">
                    {tpl.tagline}
                  </p>
                </div>

                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed font-sans">
                  {tpl.description}
                </p>

                {/* Recommended For */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark font-semibold">
                    Recommended For:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tpl.recommendedFor.map((rec) => (
                      <span
                        key={rec}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-copper-50 dark:bg-amberGold-500/10 text-copper-700 dark:text-amberGold-300 border border-copper-200/50 dark:border-amberGold-500/20"
                      >
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Section Structure Preview */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark font-semibold">
                    Composition Flow:
                  </div>
                  <div className="p-2.5 rounded bg-subtle-light dark:bg-subtle-dark font-mono text-[11px] text-text-muted-light dark:text-text-muted-dark leading-tight border border-border-subtle-light dark:border-border-subtle-dark">
                    {tpl.supportedSections.slice(0, 4).join(' ➔ ')}
                    {tpl.supportedSections.length > 4 && ' ➔ ...'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 border-t border-border-subtle-light dark:border-border-subtle-dark grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPreviewTemplate(tpl)}
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-subtle-dark hover:bg-surface-light dark:hover:bg-surface-dark text-xs font-mono text-text-primary-light dark:text-text-primary-dark transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-text-muted-light dark:text-text-muted-dark" />
                  <span>Preview</span>
                </button>

                <a
                  href={`/studio?template=${tpl.id}&sample=${tpl.id}`}
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-copper-500 hover:bg-copper-600 dark:bg-amberGold-500 dark:hover:bg-amberGold-600 text-white dark:text-black font-mono text-xs font-semibold transition-all shadow-editorial"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border border-border-strong-light dark:border-border-strong-dark bg-surface-light dark:bg-canvas-dark shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-subtle-dark">
              <div>
                <span className="font-mono text-xs font-bold text-copper-600 dark:text-amberGold-400">
                  {previewTemplate.id.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
                  {previewTemplate.name}
                </h3>
              </div>

              <div className="flex items-center space-x-3">
                <a
                  href={`/studio?template=${previewTemplate.id}&sample=${previewTemplate.id}`}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-copper-500 hover:bg-copper-600 dark:bg-amberGold-500 dark:hover:bg-amberGold-600 text-white dark:text-black font-mono text-xs font-semibold transition-all"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Open in Studio</span>
                </a>

                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 rounded-lg border border-border-subtle-light dark:border-border-subtle-dark hover:bg-subtle-light dark:hover:bg-subtle-dark text-text-muted-light dark:text-text-muted-dark transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Rendered Markdown */}
            <div className="p-8 overflow-y-auto font-mono text-xs leading-relaxed space-y-4 bg-surface-light dark:bg-canvas-dark text-text-primary-light dark:text-text-primary-dark select-text">
              <pre className="whitespace-pre-wrap font-mono">
                {previewTemplate.render(SAMPLE_PROJECTS[previewTemplate.id] || SAMPLE_PROJECTS.character)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
