'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import JSZip from 'jszip';
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
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  Archive,
  Layers,
} from 'lucide-react';

import type { ProjectFacts, ProjectCategory } from '../../lib/templates/types';
import { TEMPLATES, renderTemplate, getTemplate } from '../../lib/templates/registry';
import { SAMPLE_PROJECTS } from '../../lib/templates/samples';
import { computeClientDiff } from '../../lib/templates/diff';
import { validateProjectFacts } from '../../lib/templates/validator';

export default function StudioPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('character');
  const [activeTab, setActiveTab] = useState<'preview' | 'raw' | 'diff' | 'audit'>('preview');
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  // Initialize form state from the default sample
  const [facts, setFacts] = useState<ProjectFacts>(SAMPLE_PROJECTS['character']);

  // Baseline unpolished markdown for diff comparison
  const baselineRawMarkdown = useMemo(() => {
    return `# ${facts.name || 'My Project'}

${facts.description || 'A software project.'}

## Installation
\`\`\`bash
${facts.installCommand || 'npm install'}
\`\`\`

## Usage
\`\`\`bash
${facts.runCommand || 'npm start'}
\`\`\`

## License
${facts.license || 'MIT'}
`;
  }, [facts.name, facts.description, facts.installCommand, facts.runCommand, facts.license]);

  // Render polished markdown using the chosen template renderer
  const polishedMarkdown = useMemo(() => {
    return renderTemplate(selectedTemplateId, facts);
  }, [selectedTemplateId, facts]);

  // Compute unified diff
  const diffLines = useMemo(() => {
    return computeClientDiff(baselineRawMarkdown, polishedMarkdown);
  }, [baselineRawMarkdown, polishedMarkdown]);

  // Compute validation report & audit score
  const validation = useMemo(() => {
    return validateProjectFacts(facts);
  }, [facts]);

  const activeTemplate = getTemplate(selectedTemplateId);

  // Load a preset sample
  const handleLoadSample = (sampleKey: string) => {
    if (SAMPLE_PROJECTS[sampleKey]) {
      setFacts(JSON.parse(JSON.stringify(SAMPLE_PROJECTS[sampleKey])));
      setSelectedTemplateId(sampleKey);
    }
  };

  // Clipboard copy
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(polishedMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Download raw README.md
  const handleDownloadReadme = () => {
    const blob = new Blob([polishedMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Client-side ZIP bundle packaging
  const handleDownloadZipBundle = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();

      // 1. Polished README.md
      zip.file('README.md', polishedMarkdown);

      // 2. LICENSE
      const licenseText = facts.license === 'Apache-2.0'
        ? `Apache License\nVersion 2.0, January 2004\nhttp://www.apache.org/licenses/\n\nCopyright ${new Date().getFullYear()} ${facts.author || 'The Authors'}`
        : `MIT License\n\nCopyright (c) ${new Date().getFullYear()} ${facts.author || 'The Authors'}\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so...`;
      zip.file('LICENSE', licenseText);

      // 3. CONTRIBUTING.md
      const contributingText = `# Contributing to ${facts.name}

Thank you for considering contributing to ${facts.name}!

## Development Workflow
1. Fork the repository on GitHub: \`${facts.repositoryUrl || 'https://github.com/org/repo'}\`
2. Clone your fork locally.
3. Install dependencies:
   \`\`\`bash
   ${facts.installCommand}
   \`\`\`
4. Run the test suite:
   \`\`\`bash
   ${facts.testCommand || 'npm test'}
   \`\`\`
5. Submit a Pull Request with a clear description of your changes.

Please adhere to our code style and verify tests before opening a pull request.
`;
      zip.file('CONTRIBUTING.md', contributingText);

      // 4. SECURITY.md
      const securityText = `# Security Policy

## Supported Versions
| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability
Please do not report security vulnerabilities via public GitHub issues. Instead, email security inquiries to \`security@pomade.dev\`.
`;
      zip.file('SECURITY.md', securityText);

      // 5. GitHub Issue & PR Templates
      const githubFolder = zip.folder('.github');
      if (githubFolder) {
        githubFolder.file('pull_request_template.md', `## Description
Describe your changes in detail.

## Related Issues
Fixes # (issue)

## Checklist
- [ ] Tests pass locally (\`${facts.testCommand || 'npm test'}\`)
- [ ] Documentation updated to reflect changes
`);
        const issueTemplates = githubFolder.folder('ISSUE_TEMPLATE');
        if (issueTemplates) {
          issueTemplates.file('bug_report.md', `---
name: Bug report
about: Create a report to help us improve
title: ''
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Run '${facts.runCommand}'
2. See error

**Expected behavior**
A clear and concise description of what you expected to happen.
`);
        }
      }

      // Generate zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${facts.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-') || 'repo'}-pomade-pack.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  // Add / Remove feature helpers
  const handleAddFeature = () => {
    setFacts({
      ...facts,
      features: [
        ...facts.features,
        { title: 'New Capability', description: 'Brief explanation of this feature.' },
      ],
    });
  };

  const handleRemoveFeature = (idx: number) => {
    setFacts({
      ...facts,
      features: facts.features.filter((_, i) => i !== idx),
    });
  };

  const handleFeatureChange = (idx: number, field: 'title' | 'description', value: string) => {
    const updated = [...facts.features];
    updated[idx] = { ...updated[idx], [field]: value };
    setFacts({ ...facts, features: updated });
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark">
      {/* Studio Header Bar */}
      <div className="border-b border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-subtle-dark px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-accent-amber/15 text-accent-amber font-mono text-xs font-semibold uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5" />
              <span>Studio Engine</span>
            </span>
            <h1 className="font-mono text-sm sm:text-base font-bold text-text-primary-light dark:text-text-primary-dark">
              README Design &amp; Repository Packaging
            </h1>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Quick Presets */}
            <div className="flex items-center space-x-1 mr-2 text-xs font-mono text-text-muted-light dark:text-text-muted-dark">
              <span>Preset:</span>
              <button
                onClick={() => handleLoadSample('character')}
                className="px-2 py-1 rounded bg-bg-light dark:bg-bg-dark border border-border-subtle-light dark:border-border-subtle-dark hover:border-accent-amber transition-colors"
                title="Load Pomade (CLI)"
              >
                CLI
              </button>
              <button
                onClick={() => handleLoadSample('product-showcase')}
                className="px-2 py-1 rounded bg-bg-light dark:bg-bg-dark border border-border-subtle-light dark:border-border-subtle-dark hover:border-accent-amber transition-colors"
                title="Load OrbitUI (Web)"
              >
                Web
              </button>
              <button
                onClick={() => handleLoadSample('technical-precision')}
                className="px-2 py-1 rounded bg-bg-light dark:bg-bg-dark border border-border-subtle-light dark:border-border-subtle-dark hover:border-accent-amber transition-colors"
                title="Load TitanDB (Database)"
              >
                Systems
              </button>
              <button
                onClick={() => handleLoadSample('research-lab')}
                className="px-2 py-1 rounded bg-bg-light dark:bg-bg-dark border border-border-subtle-light dark:border-border-subtle-dark hover:border-accent-amber transition-colors"
                title="Load NeuroDiff (Research)"
              >
                Research
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border border-border-subtle-light dark:border-border-subtle-dark bg-bg-light dark:bg-bg-dark hover:bg-subtle-light dark:hover:bg-subtle-dark transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy GFM</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadReadme}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border border-border-subtle-light dark:border-border-subtle-dark bg-bg-light dark:bg-bg-dark hover:bg-subtle-light dark:hover:bg-subtle-dark transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>README.md</span>
            </button>

            <button
              onClick={handleDownloadZipBundle}
              disabled={downloadingZip}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded bg-accent-amber text-black hover:bg-accent-copper hover:text-white transition-colors shadow-sm disabled:opacity-50"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{downloadingZip ? 'Packing ZIP...' : 'Export Full Repo ZIP'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Facts Editor & Template Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Template Selection Box */}
          <div className="border border-border-subtle-light dark:border-border-subtle-dark rounded-lg p-4 bg-bg-light dark:bg-surface-dark shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-accent-amber" />
                <span>Select Design Template</span>
              </label>
              <span className="font-mono text-[11px] text-text-muted-light dark:text-text-muted-dark">
                {TEMPLATES.length} Styles
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((tpl) => {
                const isSelected = tpl.id === selectedTemplateId;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`text-left p-2.5 rounded border transition-all text-xs font-mono ${
                      isSelected
                        ? 'border-accent-amber bg-accent-amber/10 text-accent-amber font-semibold ring-1 ring-accent-amber'
                        : 'border-border-subtle-light dark:border-border-subtle-dark hover:border-accent-amber/50 bg-subtle-light dark:bg-bg-dark text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                  >
                    <div className="font-bold truncate">{tpl.name}</div>
                    <div className="text-[10px] text-text-muted-light dark:text-text-muted-dark truncate mt-0.5">
                      {tpl.category.toUpperCase()}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 p-2.5 rounded bg-subtle-light dark:bg-bg-dark border border-border-subtle-light dark:border-border-subtle-dark text-[11px] font-mono text-text-secondary-light dark:text-text-secondary-dark">
              <span className="font-semibold text-accent-amber">{activeTemplate.name}: </span>
              {activeTemplate.tagline}
            </div>
          </div>

          {/* Project Facts Form */}
          <div className="border border-border-subtle-light dark:border-border-subtle-dark rounded-lg p-5 bg-bg-light dark:bg-surface-dark space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border-subtle-light dark:border-border-subtle-dark pb-3">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-accent-amber" />
                <span>Project Evidence &amp; Metadata</span>
              </h2>
              <button
                onClick={() => setFacts(SAMPLE_PROJECTS['character'])}
                className="text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark text-[11px] font-mono flex items-center space-x-1"
                title="Reset to default facts"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Basic Info */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={facts.name}
                  onChange={(e) => setFacts({ ...facts, name: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent-amber"
                  placeholder="e.g. Pomade"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  Tagline (One sentence hook)
                </label>
                <input
                  type="text"
                  value={facts.tagline}
                  onChange={(e) => setFacts({ ...facts, tagline: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent-amber"
                  placeholder="Make every repo worth opening."
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  Description / Core Purpose
                </label>
                <textarea
                  rows={3}
                  value={facts.description}
                  onChange={(e) => setFacts({ ...facts, description: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent-amber"
                  placeholder="Comprehensive description of what this software actually does..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                    Primary Language
                  </label>
                  <input
                    type="text"
                    value={facts.primaryLanguage}
                    onChange={(e) => setFacts({ ...facts, primaryLanguage: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent-amber"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                    License
                  </label>
                  <select
                    value={facts.license}
                    onChange={(e) => setFacts({ ...facts, license: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent-amber"
                  >
                    <option value="MIT">MIT</option>
                    <option value="Apache-2.0">Apache 2.0</option>
                    <option value="GPL-3.0">GPL 3.0</option>
                    <option value="BSD-3-Clause">BSD 3-Clause</option>
                    <option value="Unlicense">Unlicense</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                    Author / Org
                  </label>
                  <input
                    type="text"
                    value={facts.author}
                    onChange={(e) => setFacts({ ...facts, author: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent-amber"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                    Category
                  </label>
                  <select
                    value={facts.category}
                    onChange={(e) => setFacts({ ...facts, category: e.target.value as ProjectCategory })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent-amber"
                  >
                    <option value="cli">CLI Tool</option>
                    <option value="web">Web Application</option>
                    <option value="library">Library / Package</option>
                    <option value="api">Backend API</option>
                    <option value="research">Research / Model</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  value={facts.repositoryUrl}
                  onChange={(e) => setFacts({ ...facts, repositoryUrl: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent-amber"
                />
              </div>
            </div>

            {/* Commands */}
            <div className="border-t border-border-subtle-light dark:border-border-subtle-dark pt-3 space-y-3">
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark">
                Verified Terminal Commands
              </label>

              <div>
                <label className="block text-[11px] font-mono text-text-muted-light dark:text-text-muted-dark mb-1">
                  Install Command
                </label>
                <input
                  type="text"
                  value={facts.installCommand}
                  onChange={(e) => setFacts({ ...facts, installCommand: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent-amber"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-muted-light dark:text-text-muted-dark mb-1">
                  Run / Start Command
                </label>
                <input
                  type="text"
                  value={facts.runCommand}
                  onChange={(e) => setFacts({ ...facts, runCommand: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent-amber"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-muted-light dark:text-text-muted-dark mb-1">
                  Test Command
                </label>
                <input
                  type="text"
                  value={facts.testCommand || ''}
                  onChange={(e) => setFacts({ ...facts, testCommand: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent-amber"
                  placeholder="npm test"
                />
              </div>
            </div>

            {/* Features List */}
            <div className="border-t border-border-subtle-light dark:border-border-subtle-dark pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark">
                  Features ({facts.features.length})
                </label>
                <button
                  onClick={handleAddFeature}
                  className="text-xs font-mono text-accent-amber hover:underline flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Feature</span>
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {facts.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                        className="font-mono font-bold w-full bg-transparent border-b border-border-subtle-light dark:border-border-subtle-dark pb-0.5 focus:outline-none text-text-primary-light dark:text-text-primary-dark"
                        placeholder="Feature Title"
                      />
                      {facts.features.length > 1 && (
                        <button
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-text-muted-light dark:text-text-muted-dark hover:text-rose-500 ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={feat.description}
                      onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                      className="w-full font-mono text-[11px] bg-transparent text-text-secondary-light dark:text-text-secondary-dark resize-none focus:outline-none"
                      placeholder="Concise explanation of feature capability"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Presentation Toggles */}
            <div className="border-t border-border-subtle-light dark:border-border-subtle-dark pt-3 space-y-2">
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark">
                Branding &amp; Engine Markers
              </label>

              <label className="flex items-center space-x-2 text-xs font-mono cursor-pointer">
                <input
                  type="checkbox"
                  checked={facts.includeMascot ?? true}
                  onChange={(e) => setFacts({ ...facts, includeMascot: e.target.checked })}
                  className="rounded text-accent-amber focus:ring-accent-amber"
                />
                <span>Include Centered Pomade Character Hero</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-mono cursor-pointer">
                <input
                  type="checkbox"
                  checked={facts.includeManagedMarkers ?? true}
                  onChange={(e) => setFacts({ ...facts, includeManagedMarkers: e.target.checked })}
                  className="rounded text-accent-amber focus:ring-accent-amber"
                />
                <span>Include Managed Block Markers (&lt;!-- pomade:start/end --&gt;)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Output Pane (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          {/* Tab Switcher */}
          <div className="flex items-center justify-between border border-border-subtle-light dark:border-border-subtle-dark rounded-t-lg bg-subtle-light dark:bg-surface-dark px-3 py-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-bg-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark font-bold shadow-sm'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>GitHub Preview</span>
              </button>

              <button
                onClick={() => setActiveTab('raw')}
                className={`px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors ${
                  activeTab === 'raw'
                    ? 'bg-bg-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark font-bold shadow-sm'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Raw Markdown</span>
              </button>

              <button
                onClick={() => setActiveTab('diff')}
                className={`px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors ${
                  activeTab === 'diff'
                    ? 'bg-bg-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark font-bold shadow-sm'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Unified Diff</span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors ${
                  activeTab === 'audit'
                    ? 'bg-bg-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark font-bold shadow-sm'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Audit Score ({validation.score}/100)</span>
              </button>
            </div>

            <div className="font-mono text-[11px] text-text-muted-light dark:text-text-muted-dark">
              {polishedMarkdown.split('\n').length} lines · {polishedMarkdown.split(/\s+/).length} words
            </div>
          </div>

          {/* Active Tab Panel Content */}
          <div className="border border-t-0 border-border-subtle-light dark:border-border-subtle-dark rounded-b-lg p-5 bg-bg-light dark:bg-bg-dark shadow-sm min-h-[600px] max-h-[850px] overflow-y-auto">
            {/* 1. GITHUB PREVIEW */}
            {activeTab === 'preview' && (
              <div className="space-y-6 max-w-3xl mx-auto">
                {/* Simulated GitHub README Box */}
                <div className="border border-border-subtle-light dark:border-border-subtle-dark rounded-md bg-bg-light dark:bg-surface-dark overflow-hidden shadow-sm">
                  {/* Repo Readme Header */}
                  <div className="border-b border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark px-4 py-2 flex items-center justify-between text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark" />
                      <span className="font-bold text-text-primary-light dark:text-text-primary-dark">README.md</span>
                    </div>
                    <span className="text-[11px]">Rendered View</span>
                  </div>

                  <div className="p-6 space-y-6 text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                    {/* Centered Character Hero (if character template or enabled) */}
                    {(selectedTemplateId === 'character' || facts.includeMascot) && (
                      <div className="text-center space-y-3 pb-4 border-b border-border-subtle-light dark:border-border-subtle-dark">
                        <div className="relative w-20 h-20 mx-auto rounded-full bg-subtle-light dark:bg-bg-dark p-2 border border-border-subtle-light dark:border-border-subtle-dark">
                          <Image
                            src="/pomade-mascot.png"
                            alt="Pomade Character"
                            width={80}
                            height={80}
                            className="w-full h-full object-contain filter grayscale"
                          />
                        </div>
                        <h1 className="text-2xl font-bold font-mono text-text-primary-light dark:text-text-primary-dark tracking-tight">
                          {facts.name}
                        </h1>
                        <p className="font-serif italic text-base text-text-secondary-light dark:text-text-secondary-dark max-w-md mx-auto">
                          {facts.tagline}
                        </p>
                        <div className="flex justify-center items-center gap-1.5 flex-wrap pt-1">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                            license: {facts.license}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                            build: passing
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300">
                            lang: {facts.primaryLanguage}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Overview */}
                    <div className="space-y-2">
                      <h2 className="text-lg font-bold font-mono text-text-primary-light dark:text-text-primary-dark border-b border-border-subtle-light dark:border-border-subtle-dark pb-1">
                        Overview
                      </h2>
                      <p>{facts.description}</p>
                    </div>

                    {/* Quickstart / Installation */}
                    <div className="space-y-3">
                      <h2 className="text-lg font-bold font-mono text-text-primary-light dark:text-text-primary-dark border-b border-border-subtle-light dark:border-border-subtle-dark pb-1">
                        Quickstart
                      </h2>
                      <div className="space-y-2">
                        <div className="text-xs font-mono text-text-muted-light dark:text-text-muted-dark">Install:</div>
                        <pre className="p-3 bg-subtle-light dark:bg-bg-dark rounded font-mono text-xs text-text-primary-light dark:text-text-primary-dark border border-border-subtle-light dark:border-border-subtle-dark overflow-x-auto">
                          {facts.installCommand}
                        </pre>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-mono text-text-muted-light dark:text-text-muted-dark">Run:</div>
                        <pre className="p-3 bg-subtle-light dark:bg-bg-dark rounded font-mono text-xs text-text-primary-light dark:text-text-primary-dark border border-border-subtle-light dark:border-border-subtle-dark overflow-x-auto">
                          {facts.runCommand}
                        </pre>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <h2 className="text-lg font-bold font-mono text-text-primary-light dark:text-text-primary-dark border-b border-border-subtle-light dark:border-border-subtle-dark pb-1">
                        Core Capabilities
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {facts.features.map((feat, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark"
                          >
                            <div className="font-mono text-xs font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                              • {feat.title}
                            </div>
                            <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                              {feat.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Template-specific details badge */}
                    <div className="p-3 bg-accent-amber/5 border border-accent-amber/20 rounded text-xs font-mono text-accent-amber flex items-center justify-between">
                      <span>Rendered with Pomade Style: {activeTemplate.name}</span>
                      <span className="text-[11px] underline">Review full markdown in &quot;Raw Markdown&quot; tab</span>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-border-subtle-light dark:border-border-subtle-dark text-xs font-mono text-text-muted-light dark:text-text-muted-dark flex items-center justify-between">
                      <span>Licensed under {facts.license}</span>
                      <span>{facts.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. RAW MARKDOWN */}
            {activeTab === 'raw' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-text-muted-light dark:text-text-muted-dark pb-2 border-b border-border-subtle-light dark:border-border-subtle-dark">
                  <span>Exact GFM markdown ready for git commit:</span>
                  <button
                    onClick={handleCopy}
                    className="text-accent-amber hover:underline flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to clipboard' : 'Copy markdown'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-subtle-light dark:bg-bg-dark border border-border-subtle-light dark:border-border-subtle-dark rounded-md font-mono text-xs leading-relaxed text-text-primary-light dark:text-text-primary-dark overflow-x-auto whitespace-pre-wrap select-all">
                  {polishedMarkdown}
                </pre>
              </div>
            )}

            {/* 3. UNIFIED DIFF */}
            {activeTab === 'diff' && (
              <div className="space-y-3">
                <div className="text-xs font-mono text-text-muted-light dark:text-text-muted-dark pb-2 border-b border-border-subtle-light dark:border-border-subtle-dark flex items-center justify-between">
                  <span>Comparison: Unpolished Draft vs. Pomade-Generated README</span>
                  <span className="text-emerald-500 font-semibold">
                    +{diffLines.filter((l) => l.type === 'add').length} additions
                  </span>
                </div>

                <div className="p-3 bg-subtle-light dark:bg-bg-dark border border-border-subtle-light dark:border-border-subtle-dark rounded-md font-mono text-xs overflow-x-auto">
                  {diffLines.map((line, idx) => {
                    if (line.type === 'header') {
                      return (
                        <div key={idx} className="text-accent-amber font-bold py-0.5">
                          {line.text}
                        </div>
                      );
                    }
                    if (line.type === 'add') {
                      return (
                        <div
                          key={idx}
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 py-0.5 px-1 rounded-sm"
                        >
                          {line.text}
                        </div>
                      );
                    }
                    if (line.type === 'del') {
                      return (
                        <div
                          key={idx}
                          className="bg-rose-500/10 text-rose-600 dark:text-rose-400 py-0.5 px-1 rounded-sm"
                        >
                          {line.text}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={idx}
                        className="text-text-secondary-light dark:text-text-secondary-dark py-0.5 px-1"
                      >
                        {line.text}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. AUDIT SCORECARD */}
            {activeTab === 'audit' && (
              <div className="space-y-6">
                {/* Score Header */}
                <div className="p-5 rounded-lg border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-surface-dark flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src="/pomade-mascot.png"
                        alt="Pomade Mascot"
                        width={64}
                        height={64}
                        className="object-contain filter grayscale"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-2xl font-black text-text-primary-light dark:text-text-primary-dark">
                          {validation.score}
                        </span>
                        <span className="font-mono text-xs text-text-muted-light dark:text-text-muted-dark">/ 100</span>
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            validation.score >= 85
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : validation.score >= 60
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {validation.score >= 85 ? 'Grade A (Publish Ready)' : validation.score >= 60 ? 'Grade B (Acceptable)' : 'Grade C (Needs Work)'}
                        </span>
                      </div>
                      <p className="font-serif italic text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                        &quot;{validation.reactionMessage}&quot;
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs text-text-muted-light dark:text-text-muted-dark">
                    <div>{validation.findings.filter((f) => f.status === 'pass').length} Checks Passed</div>
                    <div>{validation.findings.filter((f) => f.status !== 'pass').length} Improvements Flagged</div>
                  </div>
                </div>

                {/* Audit Findings Breakdown */}
                <div className="space-y-2">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark">
                    Diagnostic Breakdown
                  </h3>
                  <div className="space-y-2">
                    {validation.findings.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded border border-border-subtle-light dark:border-border-subtle-dark bg-subtle-light dark:bg-bg-dark flex items-start space-x-3 text-xs"
                      >
                        {item.status === 'pass' && (
                          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        )}
                        {item.status === 'warn' && (
                          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        )}
                        {item.status === 'fail' && (
                          <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        )}

                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-text-primary-light dark:text-text-primary-dark">
                              {item.category}
                            </span>
                            <span
                              className={`font-mono text-[10px] uppercase font-semibold ${
                                item.status === 'pass'
                                  ? 'text-emerald-500'
                                  : item.status === 'warn'
                                  ? 'text-amber-500'
                                  : 'text-rose-500'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className="text-text-secondary-light dark:text-text-secondary-dark font-mono text-[11px]">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}