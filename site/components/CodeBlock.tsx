'use client';
import { useState } from 'react';
export function CodeBlock({ children }: { children: string }) {
  const [status, setStatus] = useState('Copy');
  async function copy() {
    try {
      await navigator.clipboard.writeText(children);
      setStatus('Copied');
    } catch {
      setStatus('Select to copy');
    }
  }
  return (
    <div className="copy-code">
      <button onClick={copy} aria-label="Copy command">
        {status}
      </button>
      <pre>
        <code>{children}</code>
      </pre>
      <span className="sr-only" aria-live="polite">
        {status === 'Copied' ? 'Command copied' : ''}
      </span>
    </div>
  );
}
