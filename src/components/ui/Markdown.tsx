import { Fragment, type ReactNode } from 'react';

/**
 * Minimal, safe Markdown renderer for AI responses: headings, bold/italic,
 * inline code, bullet & numbered lists, links (http/https only), paragraphs.
 * Produces React elements — never injects raw HTML.
 */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|(?<!\w)_[^_`\s][^_`]*_(?!\w)|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const k = `${keyBase}-${i++}`;
    if (t.startsWith('**')) out.push(<strong key={k}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith('`')) out.push(<code key={k} className="rounded bg-surface-2 px-1 text-[0.9em]">{t.slice(1, -1)}</code>);
    else if (t.startsWith('[')) {
      const mm = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/.exec(t)!;
      out.push(
        <a key={k} href={mm[2]} target="_blank" rel="noopener noreferrer" className="text-primary underline">
          {mm[1]}
        </a>,
      );
    } else out.push(<em key={k}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r/g, '').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const lvl = h[1].length;
      const cls = lvl <= 2 ? 'mt-4 mb-2 text-base font-semibold' : 'mt-3 mb-1 font-semibold';
      blocks.push(<p key={key++} role="heading" aria-level={Math.min(6, lvl + 2)} className={cls}>{inline(h[2], `h${key}`)}</p>);
      i++;
      continue;
    }
    if (/^\s*([-*•])\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*•])\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*([-*•])\s+/, ''));
      blocks.push(
        <ul key={key++} className="my-2 list-disc space-y-1 pl-5">
          {items.map((it, j) => <li key={j}>{inline(it, `u${key}-${j}`)}</li>)}
        </ul>,
      );
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+[.)]\s+/, ''));
      blocks.push(
        <ol key={key++} className="my-2 list-decimal space-y-1 pl-5">
          {items.map((it, j) => <li key={j}>{inline(it, `o${key}-${j}`)}</li>)}
        </ol>,
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4})\s|^\s*([-*•]|\d+[.)])\s+/.test(lines[i])) para.push(lines[i++]);
    blocks.push(
      <p key={key++} className="my-2 leading-relaxed">
        {para.map((p, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {inline(p, `p${key}-${j}`)}
          </Fragment>
        ))}
      </p>,
    );
  }
  return <div className="text-sm">{blocks}</div>;
}
