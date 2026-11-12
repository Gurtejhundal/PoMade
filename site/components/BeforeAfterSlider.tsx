'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, SlidersHorizontal, Sparkles } from 'lucide-react';

export function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [mode, setMode] = useState<'slide' | 'side-by-side'>('side-by-side');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-copper-600 dark:text-amberGold-400 font-semibold">
            Real Comparison
          </span>
          <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            The Repository Reality Check
          </h3>
        </div>

        <div className="flex items-center space-x-2 bg-subtle-light dark:bg-subtle-dark p-1 rounded-md border border-border-subtle-light dark:border-border-subtle-dark text-xs font-mono">
          <button
            onClick={() => setMode('side-by-side')}
            className={`px-3 py-1 rounded transition-colors ${
              mode === 'side-by-side'
                ? 'bg-surface-light dark:bg-surface-dark text-copper-600 dark:text-amberGold-400 font-semibold shadow-editorial'
                : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
          >
            Side by Side
          </button>
          <button
            onClick={() => setMode('slide')}
            className={`px-3 py-1 rounded transition-colors ${
              mode === 'slide'
                ? 'bg-surface-light dark:bg-surface-dark text-copper-600 dark:text-amberGold-400 font-semibold shadow-editorial'
                : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
          >
            Interactive Slider
          </button>
        </div>
      </div>

      {mode === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before Column */}
          <div className="rounded-xl border border-red-200 dark:border-red-950/60 bg-red-50/20 dark:bg-red-950/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-red-200/60 dark:border-red-900/40">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-mono text-xs font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>BEFORE POMADE (Common AI Output)</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                Score: 28/100
              </span>
            </div>

            <div className="font-mono text-xs text-text-secondary-light dark:text-text-secondary-dark space-y-3 bg-surface-light dark:bg-canvas-dark p-4 rounded-lg border border-border-subtle-light dark:border-border-subtle-dark">
              <div className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
                # my-project
              </div>
              <p className="text-text-muted-light dark:text-text-muted-dark italic">
                A project created by AI coding assistant.
              </p>
              <div className="text-red-500 text-[11px]">
                ✖ Missing license, missing badges, missing description
              </div>

              <div className="font-bold text-text-primary-light dark:text-text-primary-dark pt-2">
                ## Installation
              </div>
              <pre className="p-2 bg-subtle-light dark:bg-subtle-dark rounded text-[11px] text-text-muted-light dark:text-text-muted-dark">
                git clone ...<br />
                npm install<br />
                # TODO: add more instructions
              </pre>

              <div className="font-bold text-text-primary-light dark:text-text-primary-dark pt-2">
                ## Features
              </div>
              <ul className="list-disc pl-4 space-y-1 text-text-muted-light dark:text-text-muted-dark text-[11px]">
                <li>Feature 1 (placeholder)</li>
                <li>Fast and scalable (unverified claim)</li>
              </ul>
              <div className="text-xs text-red-600 dark:text-red-400 pt-2 font-semibold">
                Result: Visitors close the tab in 3 seconds.
              </div>
            </div>
          </div>

          {/* After Column */}
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60 dark:border-emerald-900/40">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>AFTER POMADE (Evidence-Backed)</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                Score: 96/100
              </span>
            </div>

            <div className="font-mono text-xs text-text-secondary-light dark:text-text-secondary-dark space-y-3 bg-surface-light dark:bg-canvas-dark p-4 rounded-lg border border-border-subtle-light dark:border-border-subtle-dark">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
                  # HyperCLI
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  MIT
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  CI: passing
                </span>
              </div>
              <p className="text-text-primary-light dark:text-text-primary-dark font-sans text-xs">
                High-performance command-line workflow accelerator built with TypeScript and Commander.
              </p>

              <div className="font-bold text-text-primary-light dark:text-text-primary-dark pt-2">
                ## Quickstart (Verified from package.json)
              </div>
              <pre className="p-2 bg-subtle-light dark:bg-subtle-dark rounded text-[11px] text-text-primary-light dark:text-text-primary-dark">
                npm install -g hyper-cli<br />
                hyper-cli --help
              </pre>

              <div className="font-bold text-text-primary-light dark:text-text-primary-dark pt-2">
                ## Verified Architecture
              </div>
              <div className="p-2 bg-subtle-light dark:bg-subtle-dark rounded text-[11px] text-copper-600 dark:text-amberGold-400">
                [SVG Architecture Diagram + Dark Mode Social Card embedded]
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 pt-2 font-semibold">
                Result: Clear first-run experience, instant credibility.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Slider Mode */
        <div className="relative w-full rounded-xl border border-border-strong-light dark:border-border-strong-dark overflow-hidden bg-canvas-dark p-6 select-none font-mono text-xs">
          <div className="flex justify-between items-center mb-4">
            <span className="text-red-400 font-bold">◄ Drag to Reveal Contrast ►</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="w-48 accent-amberGold-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className={`p-4 rounded border ${sliderPosition > 50 ? 'border-red-500 bg-red-950/20' : 'opacity-40'}`}>
              <div className="text-red-400 font-bold mb-2">RAW AGENT OUTPUT ({100 - sliderPosition}%)</div>
              <div className="text-slate-400">Missing licenses, unverified claims, zero architecture diagrams.</div>
            </div>
            <div className={`p-4 rounded border ${sliderPosition <= 50 ? 'border-emerald-500 bg-emerald-950/20' : 'opacity-40'}`}>
              <div className="text-emerald-400 font-bold mb-2">POMADE POLISHED ({sliderPosition}%)</div>
              <div className="text-emerald-300">Managed markers, 96/100 quality score, verified scripts, SVG cards.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
