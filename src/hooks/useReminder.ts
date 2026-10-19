import { useEffect, useState } from 'react';
import { useAppData } from '../state/AppData';
import { localDate } from '../lib/dates';
import { minutesByDate } from '../lib/progress';
import { reminderDue } from '../lib/reminders';

const KEY = 'sursadhana:reminder-shown';

/** Shows the daily reminder (in-app, plus a system notification if allowed) while the app is open. */
export function useReminder() {
  const { data } = useAppData();
  const [due, setDue] = useState(false);
  const time = data.settings.reminderTime;
  const practised = (minutesByDate(data)[localDate()] ?? 0) > 0;

  useEffect(() => {
    const check = () => {
      const today = localDate();
      let shown: string | null = null;
      try {
        shown = localStorage.getItem(KEY);
      } catch {
        /* storage blocked */
      }
      const isDue = reminderDue(time, practised);
      setDue(isDue && shown !== `dismissed:${today}`);
      if (isDue && shown !== `notified:${today}` && shown !== `dismissed:${today}` && 'Notification' in window && Notification.permission === 'granted') {
        try {
          localStorage.setItem(KEY, `notified:${today}`);
        } catch {
          /* ignore */
        }
        const opts = { body: `Your ${data.profile.dailyMinutes}-minute riyaz is ready. Warm up gently 🙏`, icon: '/icon-192.png', tag: 'sursadhana-riyaz' };
        const show = async () => {
          const reg = await navigator.serviceWorker?.getRegistration();
          if (reg) await reg.showNotification('Time for riyaz', opts);
          else new Notification('Time for riyaz', opts);
        };
        show().catch(() => {});
      }
    };
    check();
    const iv = window.setInterval(check, 60_000);
    return () => clearInterval(iv);
  }, [time, practised, data.profile.dailyMinutes]);

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, `dismissed:${localDate()}`);
    } catch {
      /* ignore */
    }
    setDue(false);
  };
  return { due, dismiss };
}
