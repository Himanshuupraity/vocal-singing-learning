import { buildReminderIcs, reminderDue } from '../src/lib/reminders';

describe('reminders', () => {
  it('builds a valid daily recurring calendar event', () => {
    const ics = buildReminderIcs('07:30', 20, new Date(2026, 9, 12, 10, 0));
    expect(ics).toContain('RRULE:FREQ=DAILY');
    expect(ics).toContain('DTSTART:20261013T073000');
    expect(ics).toContain('DTEND:20261013T075000');
    expect(ics.split('\r\n')[0]).toBe('BEGIN:VCALENDAR');
  });
  it('is due only after the time and when not practised', () => {
    const at = new Date(2026, 9, 12, 19, 5);
    expect(reminderDue('19:00', false, at)).toBe(true);
    expect(reminderDue('19:00', true, at)).toBe(false);
    expect(reminderDue('20:00', false, at)).toBe(false);
    expect(reminderDue(undefined, false, at)).toBe(false);
  });
});
