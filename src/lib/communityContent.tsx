import React from 'react';

export function renderParagraph(text: string, keyBase: number): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={`${keyBase}-${i}`}>{part}</strong> : part));
}

export function isListBlock(block: string): boolean {
  const lines = block.trim().split('\n').filter((l) => l.trim());
  return lines.length > 0 && lines.every((l) => l.trimStart().startsWith('- '));
}

export function renderContent(content: string): React.ReactNode[] {
  const blocks = content.trim().split(/\n\n+/);
  return blocks.map((block, blockIndex) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={blockIndex} className="text-xl font-bold text-[#0F172A] mt-8 mb-3 first:mt-0">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={blockIndex} className="text-lg font-semibold text-[#0F172A] mt-6 mb-2">
          {trimmed.slice(4)}
        </h3>
      );
    }
    if (isListBlock(trimmed)) {
      const items = trimmed.split('\n').map((l) => l.trimStart().replace(/^- /, '').trim()).filter(Boolean);
      return (
        <ul key={blockIndex} className="list-disc list-inside text-slate-600 space-y-2 mb-4 pl-1">
          {items.map((item, i) => (
            <li key={i}>{renderParagraph(item, blockIndex * 100 + i)}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={blockIndex} className="text-slate-600 leading-relaxed mb-4">
        {renderParagraph(trimmed, blockIndex)}
      </p>
    );
  });
}
