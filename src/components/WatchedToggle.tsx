import { useAppData } from '../state/AppData';
import { queryKey } from '../lib/youtube';
import { cx } from './ui';

/** Lets learners track search-based resources as watched — works without the YouTube API. */
export function WatchedToggle({ query }: { query: string }) {
  const { data, update } = useAppData();
  const k = queryKey(query);
  const on = !!data.videos.watched[k];
  return (
    <label className={cx('inline-flex cursor-pointer items-center gap-1.5 text-xs', on ? 'text-success' : 'text-muted')}>
      <input type="checkbox" checked={on} onChange={(e) => update((d) => void (e.target.checked ? (d.videos.watched[k] = new Date().toISOString()) : delete d.videos.watched[k]))} />
      {on ? 'Watched' : 'Mark watched'}
    </label>
  );
}
