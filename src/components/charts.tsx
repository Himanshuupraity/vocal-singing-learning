import { addDays, localDate } from '../lib/dates';
import { cx } from './ui';

/** Last N days of practice minutes as bars, with a text table for screen readers. */
export function PracticeBars({ byDate, days = 7, goal }: { byDate: Record<string, number>; days?: number; goal: number }) {
  const today = localDate();
  const list = Array.from({ length: days }, (_, i) => addDays(today, i - days + 1));
  const max = Math.max(goal, ...list.map((d) => byDate[d] ?? 0), 1);
  return (
    <figure>
      <div className="flex h-32 items-end gap-2" aria-hidden>
        {list.map((d) => {
          const v = byDate[d] ?? 0;
          const dt = new Date(d + 'T00:00');
          return (
            <div key={d} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] tabular-nums text-muted">{v ? Math.round(v) : ''}</span>
              <div className="relative flex h-24 w-full items-end rounded-md bg-surface-2">
                <div className="absolute inset-x-0 border-t border-dashed border-accent/70" style={{ bottom: `${(goal / max) * 100}%` }} />
                <div className={cx('w-full rounded-md', v >= goal ? 'bg-success' : 'bg-primary')} style={{ height: `${(v / max) * 100}%` }} />
              </div>
              <span className={cx('text-[11px]', d === today ? 'font-semibold text-text' : 'text-muted')}>{dt.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2)}</span>
            </div>
          );
        })}
      </div>
      <figcaption className="mt-2 text-xs text-muted">Minutes practised per day · dashed line = your daily goal ({goal} min)</figcaption>
      <table className="sr-only">
        <caption>Practice minutes, last {days} days</caption>
        <tbody>
          {list.map((d) => (
            <tr key={d}>
              <th scope="row">{d}</th>
              <td>{Math.round(byDate[d] ?? 0)} minutes</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Month-style heat calendar (last 5 weeks). */
export function PracticeCalendar({ byDate }: { byDate: Record<string, number> }) {
  const today = localDate();
  const dow = (new Date(today + 'T00:00').getDay() + 6) % 7;
  const start = addDays(today, -dow - 28);
  const cells = Array.from({ length: 35 }, (_, i) => addDays(start, i));
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted" aria-hidden>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1" role="list" aria-label="Practice calendar, last five weeks">
        {cells.map((d) => {
          const v = byDate[d] ?? 0;
          const future = d > today;
          return (
            <div
              key={d}
              role="listitem"
              aria-label={`${d}: ${future ? 'upcoming' : v ? `${Math.round(v)} minutes` : 'no practice'}`}
              title={`${d}: ${Math.round(v)} min`}
              className={cx('aspect-square rounded-md', future ? 'bg-transparent' : v === 0 ? 'bg-surface-2' : v < 10 ? 'bg-primary/30' : v < 25 ? 'bg-primary/60' : 'bg-primary', d === today && 'ring-2 ring-accent')}
            />
          );
        })}
      </div>
    </div>
  );
}

/** Simple line for weekly pitch-match % (only drawn from real data). */
export function TrendLine({ points, label }: { points: { x: string; y: number }[]; label: string }) {
  if (points.length < 2) return null;
  const w = 300;
  const h = 100;
  const px = (i: number) => 10 + (i / (points.length - 1)) * (w - 20);
  const py = (v: number) => h - 10 - (v / 100) * (h - 20);
  return (
    <figure>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-28 w-full" role="img" aria-label={`${label}: ${points.map((p) => `${p.x} ${p.y}%`).join(', ')}`}>
        {[0, 50, 100].map((g) => (
          <line key={g} x1={10} x2={w - 10} y1={py(g)} y2={py(g)} className="stroke-border" strokeDasharray="3 3" />
        ))}
        <polyline fill="none" className="stroke-primary" strokeWidth={2.5} points={points.map((p, i) => `${px(i)},${py(p.y)}`).join(' ')} />
        {points.map((p, i) => (
          <circle key={i} cx={px(i)} cy={py(p.y)} r={3.5} className="fill-primary" />
        ))}
      </svg>
      <figcaption className="text-xs text-muted">{label}</figcaption>
    </figure>
  );
}
