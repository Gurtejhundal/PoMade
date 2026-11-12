'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, Play } from 'lucide-react';

interface CommandOutput {
  command: string;
  badge: string;
  description: string;
  output: string;
}

const COMMAND_DATA: Record<string, CommandOutput> = {
  scan: {
    command: 'pomade scan',
    badge: 'READ-ONLY INSPECTION',
    description: 'Inspect manifests, languages, frameworks, git state, and licenses without side effects.',
    output: `Pomade Repository Scan Report
----------------------------------------------------
Repo Root:        /Users/developer/projects/hyper-cli
Project Kind:     CLI
Maturity Stage:   MAINTAINED
Primary Language: TypeScript
Frameworks:       Commander, Vitest

Git Environment:
  Branch:        main
  Working Tree:  Clean
  Commit SHA:    c1cb013
  Remote URL:    https://github.com/org/hyper-cli.git

Manifests (1):
  • package.json (hyper-cli@1.2.0)

Documentation (4):
  • README.md (readme, 2410 B) [pomade managed]
  • CONTRIBUTING.md (contributing, 488 B)
  • LICENSE (license, 1070 B)
  • SECURITY.md (security, 556 B)

Media Assets (2):
  • docs/media/architecture.svg (diagram, 4502 B)
  • docs/media/social-preview.svg (diagram, 3339 B)

License Status:
  ✔ MIT (file)

Fingerprint: 0194ce49212f1903 (Verified deterministic)`,
  },
  audit: {
    command: 'pomade audit',
    badge: 'QUALITY RUBRIC',
    description: 'Evaluate repository presentation score (0-100) across 6 stage-aware pillars.',
    output: `Pomade Repository Quality Audit
----------------------------------------------------
Target: /Users/developer/projects/hyper-cli
Kind: CLI  |  Stage: MAINTAINED
Overall Presentation Score: 96/100 [PASSING]

Category Breakdown:
  Clarity          100% (2 pass, 0 warn, 0 fail, 0 blocked, 0 n/a)
  First-run        100% (2 pass, 0 warn, 0 fail, 0 blocked, 0 n/a)
  Trust            100% (2 pass, 0 warn, 0 fail, 0 blocked, 0 n/a)
  Discoverability  100% (1 pass, 0 warn, 0 fail, 0 blocked, 0 n/a)
  Presentation     100% (0 pass, 0 warn, 0 fail, 0 blocked, 1 n/a)
  Maintainability  100% (2 pass, 0 warn, 0 fail, 0 blocked, 0 n/a)

Findings & Diagnostics:
   PASS  [P1] Project Name Identifiable
         Identified project name from package.json.
   PASS  [P2] Clear One-Line Description
         Found concise description: "A lightning-fast developer tool."
   PASS  [P0] README File Present
         README exists at 'README.md' (2410 bytes).
   PASS  [P1] Executable Manifest Scripts Found
         Found 4 manifest scripts (build, test, start).
   PASS  [P0] Standard Open Source License Detected
         Detected MIT license via LICENSE file.
   N/A   [P2] UI Visuals (Not Applicable)
         Project is a CLI; graphical screenshots are skipped gracefully.
   PASS  [P2] Automated Workflows Detected
         Found 1 GitHub Action workflow(s) (ci.yml).

Status: READ-ONLY AUDIT — zero files were modified.`,
  },
  plan: {
    command: 'pomade diff --preset studio',
    badge: 'UNIFIED DIFF PREVIEW',
    description: 'Preview proposed evidence-backed updates before applying any file modifications.',
    output: `Pomade Proposed Diffs [plan-5df95af4ef]
----------------------------------------------------
Diff for README.md:
--- a/README.md
+++ b/README.md
@@ -1,5 +1,8 @@
 <!-- pomade:start header -->
-# hyper-cli
+# hyper-cli
+
+> High-performance command line workflow accelerator for developers.
+
+[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
+[![Version](https://img.shields.io/badge/version-v1.2.0-informational)](package.json)
 <!-- pomade:end header -->
 
 <!-- pomade:start quickstart -->
@@ -12,4 +15,6 @@
 npm install -g hyper-cli
+npm test
 <!-- pomade:end quickstart -->

[✔ Non-managed human text outside markers is guaranteed untouched]`,
  },
  apply: {
    command: 'pomade apply --approved',
    badge: 'ATOMIC LOCAL WRITES',
    description: 'Execute approved actions with target freshness checks and safe backup validation.',
    output: `✔ Pomade Plan Successfully Applied [plan-5df95af4ef]
----------------------------------------------------
Actions Applied: 1
Target Files:
  • README.md (updated atomically via temp swap)

Policy Checks:
  ✔ Explicit user authorization verified (--approved)
  ✔ Target SHA-256 hash verified (freshness confirmed)
  ✔ No secrets or environment credentials written

Repository status: Ready for git commit.`,
  },
};

export function TerminalDemo() {
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [copied, setCopied] = useState<boolean>(false);

  const current = COMMAND_DATA[activeTab];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(current.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-border-strong-light dark:border-border-strong-dark bg-canvas-dark text-slate-100 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111318] border-b border-[#222630]">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <div className="w-3 h-3 rounded-full bg-[#10B981]" />
          <span className="ml-2 text-xs text-slate-400 font-semibold tracking-wide">
            pomade — zsh
          </span>
        </div>

        {/* Action pills */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {Object.keys(COMMAND_DATA).map((key) => {
            const item = COMMAND_DATA[key];
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  isActive
                    ? 'bg-amberGold-500/20 text-amberGold-400 border border-amberGold-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1A1D26]'
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Terminal Command Prompt */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#161820] border-b border-[#252936] text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-emerald-400 font-bold">➜</span>
          <span className="text-cyan-400">~/projects/hyper-cli</span>
          <span className="text-slate-400">(main)</span>
          <span className="text-slate-100 font-semibold">$ {current.command}</span>
        </div>

        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#212532] hover:bg-[#2C3142] text-slate-300 text-[11px] transition-colors"
          title="Copy command"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Terminal Output */}
      <div className="p-5 overflow-x-auto text-[12px] leading-relaxed max-h-[380px] bg-[#0C0D12] select-text">
        <div className="mb-3 text-[11px] inline-block px-2 py-0.5 rounded bg-slate-800 text-amberGold-400 border border-slate-700">
          MODE: {current.badge}
        </div>
        <pre className="text-slate-300 whitespace-pre font-mono">
          {current.output}
        </pre>
      </div>
    </div>
  );
}
