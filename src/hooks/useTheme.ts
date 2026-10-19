import { useEffect } from 'react';
import { useAppData } from '../state/AppData';

export function useApplyTheme() {
  const { data } = useAppData();
  const theme = data.settings.theme;
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && !!mq?.matches);
      document.documentElement.classList.toggle('dark', dark);
    };
    apply();
    mq?.addEventListener?.('change', apply);
    return () => mq?.removeEventListener?.('change', apply);
  }, [theme]);
}
