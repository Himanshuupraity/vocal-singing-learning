import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from './Icon';

export { Icon };
export type { IconName };

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ');
}

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover shadow-sm',
  accent: 'bg-accent text-white hover:opacity-90 shadow-sm dark:text-black',
  secondary: 'bg-surface text-text border border-border hover:bg-surface-2',
  ghost: 'text-text hover:bg-surface-2',
  danger: 'bg-danger text-white hover:opacity-90 dark:text-black',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' | 'lg'; icon?: IconName }) {
  return (
    <button
      type="button"
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm',
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />}
      {children}
    </button>
  );
}

export function LinkButton({ to, variant = 'primary', icon, children, className, size = 'md' }: { to: string; variant?: Variant; icon?: IconName; children: ReactNode; className?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Link
      to={to}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors',
        size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm',
        VARIANTS[variant],
        className,
      )}
    >
      {icon && <Icon name={icon} className="h-5 w-5" />}
      {children}
    </Link>
  );
}

export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cx('inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline', className)}>
      {children}
      <Icon name="external" className="h-3.5 w-3.5" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function Card({ children, className, as: As = 'section' }: { children: ReactNode; className?: string; as?: 'section' | 'div' | 'article' | 'li' }) {
  return <As className={cx('min-w-0 rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]', className)}>{children}</As>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

const TONES = {
  neutral: 'bg-surface-2 text-muted',
  primary: 'bg-primary-soft text-primary',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
};
export type Tone = keyof typeof TONES;

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', TONES[tone], className)}>{children}</span>;
}

export function Alert({ tone = 'info', title, children, icon, className }: { tone?: 'info' | 'warning' | 'danger' | 'success'; title?: string; children?: ReactNode; icon?: IconName; className?: string }) {
  const ic: IconName = icon ?? (tone === 'success' ? 'check' : tone === 'info' ? 'info' : 'alert');
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cx('flex gap-3 rounded-xl p-4 text-sm', TONES[tone], className)}>
      <Icon name={ic} className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 text-text">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cx(title && 'mt-1', 'text-text/90')}>{children}</div>}
      </div>
    </div>
  );
}

export function ProgressBar({ value, label, tone = 'primary' }: { value: number; label?: string; tone?: 'primary' | 'accent' | 'success' }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} aria-label={label} className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div className={cx('h-full rounded-full transition-all', tone === 'accent' ? 'bg-accent' : tone === 'success' ? 'bg-success' : 'bg-primary')} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export function ProgressRing({ value, size = 88, label, children }: { value: number; size?: number; label: string; children?: ReactNode }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${Math.round(v)}%`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={8} className="stroke-surface-2" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={8} strokeLinecap="round" className="stroke-primary transition-all" strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children ?? <span className="text-lg font-semibold">{Math.round(v)}%</span>}</div>
    </div>
  );
}

export function EmptyState({ icon = 'info', title, children, action, page }: { icon?: IconName; title: string; children?: ReactNode; action?: ReactNode; /** render the title as the page's h1 */ page?: boolean }) {
  const H = page ? 'h1' : 'p';
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-10 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <H className="font-semibold">{title}</H>
      {children && <div className="mt-1 max-w-md text-sm text-muted">{children}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** `wrap`: on wider screens show every tab in wrapped rows instead of one scrolling row. */
export function Tabs<T extends string>({ tabs, value, onChange, label, wrap }: { tabs: { id: T; label: string; icon?: IconName }[]; value: T; onChange: (v: T) => void; label: string; wrap?: boolean }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div role="tablist" aria-label={label} className={cx('-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none]', wrap && 'sm:flex-wrap sm:overflow-visible')}>
      {tabs.map((t, i) => (
        <button
          key={t.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          role="tab"
          type="button"
          id={`tab-${t.id}`}
          aria-selected={value === t.id}
          aria-controls={`panel-${t.id}`}
          tabIndex={value === t.id ? 0 : -1}
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
            onChange(tabs[n].id);
            refs.current[n]?.focus();
          }}
          className={cx(
            'inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
            value === t.id ? 'bg-primary text-on-primary' : 'text-muted hover:bg-surface-2 hover:text-text',
          )}
        >
          {t.icon && <Icon name={t.icon} className="h-4 w-4" />}
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal?.();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} onCancel={onClose} className="m-auto w-[min(560px,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-0 text-text backdrop:bg-black/50" aria-labelledby="modal-title">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 id="modal-title" className="font-semibold">{title}</h2>
        <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-surface-2" aria-label="Close">
          <Icon name="x" />
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
    </dialog>
  );
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export const inputClass = 'w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-muted/70 focus:border-primary focus:outline-none';

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-sm text-muted">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
      {label}
    </span>
  );
}

export function Stat({ label, value, sub, icon }: { label: string; value: ReactNode; sub?: ReactNode; icon?: IconName }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
        {icon && <Icon name={icon} className="h-4 w-4" />}
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}
