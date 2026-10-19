/** Builds an iCalendar file with a daily recurring practice reminder (works with any calendar app, no server needed). */
export function buildReminderIcs(time: string, minutes: number, now = new Date()): string {
  const [h, m] = time.split(':').map(Number);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  if (start < now) start.setDate(start.getDate() + 1);
  const pad = (n: number) => String(n).padStart(2, '0');
  const local = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const end = new Date(start.getTime() + minutes * 60000);
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SurSadhana//Riyaz Reminder//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:sursadhana-riyaz-${stamp}@sursadhana.local`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${local(start)}`,
    `DTEND:${local(end)}`,
    'RRULE:FREQ=DAILY',
    'SUMMARY:SurSadhana riyaz 🎵',
    `DESCRIPTION:Time for your ${minutes}-minute riyaz. Warm up gently and stop if anything hurts.`,
    'BEGIN:VALARM',
    'TRIGGER:PT0M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Time for riyaz',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/** True when the reminder time has passed today and there is no practice logged today. */
export function reminderDue(time: string | undefined, practisedToday: boolean, now = new Date()): boolean {
  if (!time || practisedToday) return false;
  const [h, m] = time.split(':').map(Number);
  return now.getHours() * 60 + now.getMinutes() >= h * 60 + m;
}
