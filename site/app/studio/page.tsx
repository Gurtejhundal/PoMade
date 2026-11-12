'use client';

import React, { useState } from 'react';
import {
  FileText,
  Sliders,
  Eye,
  Code,
  GitCompare,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface ProjectState {
  name: string;
  tagline: string;
  description: string;
  author: string;
  license: string;
  template: string;
  repoUrl: string;
  installCmd: string;
  runCmd: string;
  testCmd: string;
  features: string;
}

const SAMPLE_PROJECTS: Record<string, ProjectState> = {
  cli: {
    name: 'hyper-cli',
    tagline: 'High-performance command-line workflow accelerator.',
    description: 'A developer-first CLI utility that automates project maintenance and git hygiene.',
    author: 'Gurtej Hundal',
    license: 'MIT',
    template: 'character',
    repoUrl: 'https://github.com/org/hyper-cli',
    installCmd: 'npm install -g hyper-cli',
    runCmd: 'hyper-cli --help',
    testCmd: 'npm test',
    features: '• Instant project scaffold\n• Real-time lint diagnostics\n• Atomic git staging',
  },
  web: {
    name: 'orbit-ui',
    tagline: 'Accessible React UI components with zero runtime CSS.',
    description: 'An open-source design system engineered for high-performance dashboard interfaces.',
    author: 'Acme Design Labs',
    license: 'Apache-2.0',
    template: 'product-showcase',
    repoUrl: 'https://github.com/acme/orbit-ui',
    installCmd: 'npm install @orbit/ui',
    runCmd: 'npm run dev',
    testCmd: 'npm run test:e2e',
    features: '• 40+ accessible components\n• Light and dark theme tokens\n• Zero runtime CSS dependencies',
  },
  research: {
    name: 'deep-align',
    tagline: 'Direct preference optimization for code generation agents.',
    description: 'A research framework evaluating agent code quality using synthetic critique loops.',
    author: 'Nous AI Research',
    license: 'MIT',
    template: 'research-lab',
    repoUrl: 'https://github.com/nous/deep-align',
    installCmd: 'pip install -r requirements.txt',
    runCmd: 'python evaluate.py --model llama-3-8b',
    testCmd: 'pytest tests/',
    features: '• Verified benchmarks table\n• Multi-agent feedback critique\n• Fully reproducible training scripts',
  },
};

export default function StudioPage() {
  const [project, setProject] = useState<ProjectState>(SAMPLE_PROJECTS.cli);
  const [activeTab, setActiveTab] = useState<'preview' | 'source' | 'diff'>('preview');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState<boolean>(false);

  const loadSample = (key: string) => {
    if (SAMPLE_PROJECTS[key]) {
      setProject(SAMPLE_PROJECTS[key]);
    }
  };

  // Generate Markdown based on template
  const generateMarkdown = () => {
    const isCharacter = project.template === 'character';
    const isTerminal = project.template === 'terminal-noir';
    const isResearch = project.template === 'research-lab';

    if (isCharacter) {
      return `<!-- pomade:start header -->
<p align="center">
  <img src="docs/media/pomade-mascot.png" alt="${project.name} Mascot" width="180" />
</p>

# ${project.name}

> ${project.tagline}

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-${project.license}-blue.svg" alt="License: ${project.license}" /></a>
  <img src="https://img.shields.io/badge/version-v1.0.0-informational.svg" alt="Version: 1.0.0" />
  <img src="https://img.shields.io/badge/stage-maintained-orange.svg" alt="Maintained" />
</p>
<!-- pomade:end header -->

<!-- pomade:start overview -->
## Overview

${project.description}
<!-- pomade:end overview -->

<!-- pomade:start quickstart -->
## Quickstart

\`\`\`bash
${project.installCmd}
${project.runCmd}
\`\`\`
<!-- pomade:end quickstart -->

<!-- pomade:start features -->
## Features

${project.features}
<!-- pomade:end features -->

<!-- pomade:start license -->
## License

Released under the [${project.license} License](LICENSE). Copyright (c) ${new Date().getFullYear()} ${project.author}.
<!-- pomade:end license -->
`;
    }

    if (isTerminal) {
      return `<!-- pomade:start header -->
# [TERMINAL NOIR] ${project.name}

> $ ${project.tagline}

\`\`\`
  ___                        _      
 | _ \\___ _ __  __ _ __ _ __| |___  
 |  _/ _ \\ '  \\/ _\` / _\` / _\` / -_) 
 |_| \\___/_|_|_\\__,_\\__,_\\__,_\\___| 
\`\`\`
<!-- pomade:end header -->

## Quick Execution

\`\`\`bash
$ ${project.installCmd}
$ ${project.runCmd}
\`\`\`

## Technical Capabilities

${project.features}

## Testing Verification

\`\`\`bash
$ ${project.testCmd}
\`\`\`

## License

Licensed under the ${project.license} License.
`;
    }

    // Default template layout
    return `<!-- pomade:start header -->
# ${project.name}

> ${project.tagline}

[![License](https://img.shields.io/badge/license-${project.license}-blue.svg)](LICENSE)
<!-- pomade:end header -->

## Overview

${project.description}

## Installation & Usage

\`\`\`bash
${project.installCmd}
${project.runCmd}
\`\`\`

## Core Highlights

${project.features}

## License

This project is licensed under the ${project.license} License.
`;
  };

  const markdownOutput = generateMarkdown();

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownOutput], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-subtle-light dark:border-border-subtle-dark gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-copper-600 dark:text-amberGold-400 font-semibold">
            Interactive Editor
          </span>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            README Studio
          </h1>
        </div>

        {/* Preset Sample Buttons */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-text-muted-light dark:text-text-muted-dark hidden sm:inline">Samples:</span>
          <button
            onClick={() => loadSample('cli')}
            className="px-2.5 py-1 rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-subtle-dark hover:border-copper-500 transition-colors"
          >
            Node CLI
          </button>
          <button
            onClick={() => loadSample('web')}
            className="px-2.5 py-1 rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-subtle-dark hover:border-copper-500 transition-colors"
          >
            Web App
          </button>
          <button
            onClick={() => loadSample('research')}
            className="px-2.5 py-1 rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-subtle-dark hover:border-copper-500 transition-colors"
          >
            ML Research
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl border border-border-subtle-light dark:border-border-subtle-dark bg-surface-light dark:bg-surface-dark space-y-5 text-xs font-mono shadow-editorial">
          <div className="space-y-1">
            <label className="font-semibold text-text-primary-light dark:text-text-primary-dark">
              Design Template
            </label>
            <select
              value={project.template}
              onChange={(e) => setProject({ ...project, template: e.target.value })}
              className="w-full p-2.5 rounded bg-subtle-light dark:bg-subtle-dark border border-border-strong-light dark:border-border-strong-dark text-text-primary-light dark:text-text-primary-dark"
            >
              <option value="character">Template 01 — The Character</option>
              <option value="terminal-noir">Template 02 — Terminal Noir</option>
              <option value="product-showcase">Template 03 — Product Showcase</option>
              <option value="editorial">Template 04 — Editorial</option>
              <option value="technical-precision">Template 05 — Technical Precision</option>
              <option value="research-lab">Template 06 — Research Lab</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-primary-light dark:text-text-primary-dark">
              Project Name
            </label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              className="w-full p-2 rounded bg-subtle-light dark:bg-subtle-dark border border-border-subtle-light dark:border-border-subtle-dark"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-primary-light dark:text-text-primary-dark">
              Tagline
            </label>
            <input
              type="text"
              value={project.tagline}
              onChange={(e) => setProject({ ...project, tagline: e.target.value })}
              className="w-full p-2 rounded bg-subtle-light dark:bg-subtle-dark border border-border-subtle-light dark:border-border-subtle-dark"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-primary-light dark:text-text-primary-dark">
              Description
            </label>
            <textarea
              rows={3}
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
              className="w-full p-2 rounded bg-subtle-light dark:bg-subtle-dark border border-border-subtle-light dark:border-border-subtle-dark font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                License
              </label>
              <input
                type="text"
                value={project.license}
                onChange={(e) => setProject({ ...project, license: e.target.value })}
                className="w-full p-2 rounded bg-subtle-light dark:bg-subtle-dark border border-border-subtle-light dark:border-border-subtle-dark"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                Author
              </label>
              <input
                type="text"
                value={project.author}
                onChange={(e) => setProject({ ...project, author: e.target.value })}
                className="w-full p-2 rounded bg-subtle-light dark:bg-subtle-dark border border-border-subtle-light dark:border-border-subtle-dark"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-primary-light dark:text-text-primary-dark">
              Installation Command
            </label>
            <input
              type="text"
              value={project.installCmd}
              onChange={(e) => setProject({ ...project, installCmd: e.target.value })}
              className="w-full p-2 rounded bg-subtle-light dark:bg-subtle-dark border border-border-subtle-light dark:border-border-subtle-dark"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-primary-light dark:text-text-primary-dark">
              Execution / Run Command
            </label>
            <input
              type="text"
              value={project.runCmd}
              onChange={(e) => setProject({ ...project, runCmd: e.target.value })}
              className="w-full p-2 rounded bg-subtle-light dark:bg-subtle-dark border border-border-subtle-light dark:border-border-subtle-dark"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-primary-light dark:text-text-primary-dark">
              Core Features (One per line)
            </label>
            <textarea
              rows={3}
              value={project.features}
              onChange={(e) => setProject({ ...project, features: e.target.value })}
              className="w-full p-2 rounded bg-subtle-light dark:bg-subtle-dark border border-border-subtle-light dark:border-border-subtle-dark"
            />
          </div>
        </div>

        {/* Right Column: Live Rendered Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Preview Navigation Tabs */}
          <div className="flex items-center justify-between bg-subtle-light dark:bg-subtle-dark p-2 rounded-xl border border-border-subtle-light dark:border-border-subtle-dark">
            <div className="flex items-center space-x-1 text-xs font-mono">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-surface-light dark:bg-surface-dark text-copper-600 dark:text-amberGold-400 font-semibold shadow-editorial'
                    : 'text-text-secondary-light dark:text-text-secondary-dark'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>GitHub Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('source')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'source'
                    ? 'bg-surface-light dark:bg-surface-dark text-copper-600 dark:text-amberGold-400 font-semibold shadow-editorial'
                    : 'text-text-secondary-light dark:text-text-secondary-dark'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Markdown Source</span>
              </button>
            </div>

            {/* Export Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-mono bg-surface-light dark:bg-surface-dark border border-border-subtle-light dark:border-border-subtle-dark hover:border-copper-500 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-mono bg-copper-500 hover:bg-copper-600 dark:bg-amberGold-500 dark:hover:bg-amberGold-600 text-white dark:text-black font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .md</span>
              </button>
            </div>
          </div>

          {/* Render Area */}
          <div className="p-8 rounded-xl border border-border-strong-light dark:border-border-strong-dark bg-surface-light dark:bg-canvas-dark min-h-[580px] shadow-editorial font-sans">
            {activeTab === 'preview' ? (
              <div className="prose dark:prose-invert max-w-none space-y-6 text-sm">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 mx-auto rounded-full border border-border-strong-light dark:border-border-strong-dark overflow-hidden p-1 bg-white dark:bg-black">
                    <img src="/pomade-mascot.png" alt="Mascot" className="w-full h-full object-cover" />
                  </div>
                  <h1 className="text-3xl font-extrabold font-mono text-text-primary-light dark:text-text-primary-dark">
                    {project.name}
                  </h1>
                  <p className="text-text-muted-light dark:text-text-muted-dark italic font-serif">
                    {project.tagline}
                  </p>
                  <div className="flex justify-center space-x-2 pt-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      license: {project.license}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                      v1.0.0
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-subtle-light dark:border-border-subtle-dark space-y-2">
                  <h2 className="text-lg font-bold font-mono text-text-primary-light dark:text-text-primary-dark">
                    Overview
                  </h2>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-bold font-mono text-text-primary-light dark:text-text-primary-dark">
                    Quickstart
                  </h2>
                  <pre className="p-3 bg-subtle-light dark:bg-subtle-dark rounded-md font-mono text-xs text-text-primary-light dark:text-text-primary-dark overflow-x-auto">
                    {project.installCmd}
                    <br />
                    {project.runCmd}
                  </pre>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-bold font-mono text-text-primary-light dark:text-text-primary-dark">
                    Features
                  </h2>
                  <pre className="p-3 bg-subtle-light dark:bg-subtle-dark rounded-md font-mono text-xs text-text-secondary-light dark:text-text-secondary-dark whitespace-pre-line">
                    {project.features}
                  </pre>
                </div>

                <div className="pt-4 border-t border-border-subtle-light dark:border-border-subtle-dark text-xs text-text-muted-light dark:text-text-muted-dark font-mono">
                  Licensed under the {project.license} License.
                </div>
              </div>
            ) : (
              <pre className="font-mono text-xs leading-relaxed text-text-primary-light dark:text-text-primary-dark whitespace-pre-wrap select-all">
                {markdownOutput}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
