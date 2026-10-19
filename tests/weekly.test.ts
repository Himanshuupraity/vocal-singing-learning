import { defaultData, type AppData } from '../src/storage/schema';
import { weeklyReport } from '../src/lib/weekly';
import { reportText } from '../src/components/WeeklyReport';
import { addDays } from '../src/lib/dates';

const TODAY = '2026-10-19';
const at = (date: string) => new Date(`${date}T10:00:00`).toISOString();

function week(): AppData {
  const d = defaultData();
  // This week: 5 days × 20 min. Week before: 2 days × 15 min.
  for (let i = 0; i < 5; i++) d.sessions.push({ id: `a${i}`, date: addDays(TODAY, -i), startedAt: '', minutes: 20, kind: 'riyaz', exercisesCompleted: [], exercisesSkipped: [] });
  for (let i = 0; i < 2; i++) d.sessions.push({ id: `b${i}`, date: addDays(TODAY, -8 - i), startedAt: '', minutes: 15, kind: 'riyaz', exercisesCompleted: [], exercisesSkipped: [] });
  const attempt = (date: string, matched: boolean) => ({ id: Math.random().toString(), at: at(date), context: 'studio', target: 'S', tonic: 'C3', targetFreq: 130.8, medianCents: 0, withinPct: 90, stabilityCents: 10, octaveOffset: 0, tolerance: 50, matched, reliable: true });
  for (let i = 0; i < 10; i++) d.pitchAttempts.push(attempt(addDays(TODAY, -1), i < 8)); // 80%
  for (let i = 0; i < 10; i++) d.pitchAttempts.push(attempt(addDays(TODAY, -9), i < 5)); // 50%
  d.longNotes.push({ id: 'l1', at: at(addDays(TODAY, -10)), swara: 'S', sec: 9, steadinessCents: 30, inTunePct: 60 }, { id: 'l2', at: at(addDays(TODAY, -2)), swara: 'S', sec: 14.5, steadinessCents: 20, inTunePct: 80 });
  d.alankars = { 'three:shuddh': { bestBpm: 70, lastBpm: 80, lastPct: 85, at: at(TODAY) } };
  return d;
}

describe('weekly report', () => {
  it('compares the last 7 days with the 7 before, from real data only', () => {
    const r = weeklyReport(week(), TODAY);
    expect(r.from).toBe('2026-10-13');
    expect(r.minutes).toEqual({ thisWeek: 100, lastWeek: 30 });
    expect(r.daysPractised).toEqual({ thisWeek: 5, lastWeek: 2 });
    expect(r.pitchMatched).toMatchObject({ thisWeek: 80, lastWeek: 50 });
    expect(r.longNote).toEqual({ thisWeek: 14.5, lastWeek: 9 });
    expect(r.dictation).toEqual({ thisWeek: null, lastWeek: null });
    expect(r.alankars).toEqual([{ name: 'Groups of three', bpm: 70 }]);
    expect(r.wins.join(' ')).toMatch(/70 more than/);
    expect(r.wins.join(' ')).toMatch(/50% to 80%/);
    expect(r.wins.join(' ')).toMatch(/9s to 14.5s/);
  });

  it('puts vocal health first after strain', () => {
    const d = week();
    d.sessions[0].comfort = 'discomfort';
    d.sessions[1].comfort = 'some-strain';
    expect(weeklyReport(d, TODAY).focus).toMatch(/strain/);
  });

  it('suggests a small start with no practice', () => {
    const r = weeklyReport(defaultData(), TODAY);
    expect(r.wins).toEqual([]);
    expect(r.focus).toMatch(/10 minutes/);
  });

  it('makes a WhatsApp-friendly text without empty measures', () => {
    const t = reportText(weeklyReport(week(), TODAY), 'Asha');
    expect(t).toMatch(/Asha’s week/);
    expect(t).toMatch(/Practice: 100 min \(before: 30 min\)/);
    expect(t).not.toMatch(/dictation/i);
  });
});
