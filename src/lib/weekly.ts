import { ALANKARS } from '../music/alankar';
import { getLesson } from '../curriculum';
import { midiToNoteName } from '../music/theory';
import type { AppData } from '../storage/schema';
import { addDays, localDate } from './dates';
import { minutesByDate, streak } from './progress';

/** One measured number for this week and the week before (null = no data that week). */
export interface WeekMetric {
  thisWeek: number | null;
  lastWeek: number | null;
}

export interface WeeklyReport {
  /** first and last day of "this week" (the last 7 days, today included) */
  from: string;
  to: string;
  minutes: WeekMetric;
  daysPractised: WeekMetric;
  /** % of reliable pitch attempts matched */
  pitchMatched: WeekMetric & { attempts: number };
  /** longest long note, seconds */
  longNote: WeekMetric;
  /** average dictation score, % */
  dictation: WeekMetric;
  /** average on-beat %, rhythm tests */
  rhythm: WeekMetric;
  /** alankars sung cleanly this week, with their best tempo */
  alankars: { name: string; bpm: number }[];
  /** titles of lessons completed this week */
  lessonsCompleted: string[];
  range: { low: string; high: string; semitones: number; grewBy: number | null } | null;
  streak: number;
  strainSessions: number;
  /** short plain-language highlights, best first */
  wins: string[];
  /** the one area to focus on next week */
  focus: string;
}

const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);

/**
 * Builds the weekly report from saved practice only. "This week" is the last
 * 7 days including today; it is compared with the 7 days before.
 */
export function weeklyReport(data: AppData, today = localDate()): WeeklyReport {
  const from = addDays(today, -6);
  const prevFrom = addDays(today, -13);
  const inWeek = (iso: string) => {
    const d = localDate(new Date(iso));
    return d >= from && d <= today;
  };
  const inPrev = (iso: string) => {
    const d = localDate(new Date(iso));
    return d >= prevFrom && d < from;
  };
  const day = (d: string) => d >= from && d <= today;
  const prevDay = (d: string) => d >= prevFrom && d < from;

  const byDate = minutesByDate(data);
  const mins = (f: (d: string) => boolean) => Math.round(Object.entries(byDate).filter(([d]) => f(d)).reduce((s, [, m]) => s + m, 0));
  const days = (f: (d: string) => boolean) => Object.entries(byDate).filter(([d, m]) => f(d) && m > 0).length;

  const pitch = (f: (iso: string) => boolean) => {
    const r = data.pitchAttempts.filter((a) => a.reliable && f(a.at));
    return { pct: r.length >= 3 ? Math.round((r.filter((a) => a.matched).length / r.length) * 100) : null, n: r.length };
  };
  const pThis = pitch(inWeek);
  const pPrev = pitch(inPrev);
  const longest = (f: (iso: string) => boolean) => {
    const r = data.longNotes.filter((x) => f(x.at));
    return r.length ? Math.max(...r.map((x) => x.sec)) : null;
  };
  const dict = (f: (iso: string) => boolean) => avg(data.earTests.filter((t) => t.kind === 'dictation' && f(t.at)).map((t) => (t.correct / t.questions) * 100));
  const rhythm = (f: (iso: string) => boolean) => avg(data.rhythm.filter((r) => f(r.at)).map((r) => r.onBeatPct));

  const alankars = Object.entries(data.alankars)
    .filter(([, v]) => inWeek(v.at) && v.bestBpm > 0)
    .map(([k, v]) => ({ name: ALANKARS.find((a) => a.id === k.split(':')[0])?.name ?? k, bpm: v.bestBpm }))
    .sort((a, b) => b.bpm - a.bpm);

  const lessonsCompleted = Object.entries(data.lessons)
    .filter(([, l]) => l.completedAt && inWeek(l.completedAt))
    .map(([id]) => getLesson(id)?.title ?? id);

  const last = data.ranges.at(-1);
  const first = data.ranges[0];
  const range = last
    ? { low: midiToNoteName(last.lowMidi).label, high: midiToNoteName(last.highMidi).label, semitones: last.highMidi - last.lowMidi, grewBy: data.ranges.length > 1 ? last.highMidi - last.lowMidi - (first.highMidi - first.lowMidi) : null }
    : null;

  const r: WeeklyReport = {
    from,
    to: today,
    minutes: { thisWeek: mins(day), lastWeek: mins(prevDay) },
    daysPractised: { thisWeek: days(day), lastWeek: days(prevDay) },
    pitchMatched: { thisWeek: pThis.pct, lastWeek: pPrev.pct, attempts: pThis.n },
    longNote: { thisWeek: longest(inWeek), lastWeek: longest(inPrev) },
    dictation: { thisWeek: dict(inWeek), lastWeek: dict(inPrev) },
    rhythm: { thisWeek: rhythm(inWeek), lastWeek: rhythm(inPrev) },
    alankars,
    lessonsCompleted,
    range,
    streak: streak(data, today).current,
    strainSessions: data.sessions.filter((s) => day(s.date) && (s.comfort === 'some-strain' || s.comfort === 'discomfort')).length,
    wins: [],
    focus: '',
  };
  r.wins = wins(r);
  r.focus = focus(r);
  return r;
}

const up = (m: WeekMetric, by = 1) => m.thisWeek !== null && m.lastWeek !== null && m.thisWeek - m.lastWeek >= by;

function wins(r: WeeklyReport): string[] {
  const w: string[] = [];
  if (up(r.minutes, 5)) w.push(`You practised ${r.minutes.thisWeek} minutes — ${r.minutes.thisWeek! - r.minutes.lastWeek!} more than the week before.`);
  if (r.daysPractised.thisWeek! >= 5) w.push(`You practised on ${r.daysPractised.thisWeek} of 7 days.`);
  if (up(r.pitchMatched, 5)) w.push(`Pitch matching went up from ${r.pitchMatched.lastWeek}% to ${r.pitchMatched.thisWeek}%.`);
  if (up(r.longNote, 1)) w.push(`Your longest note grew from ${r.longNote.lastWeek}s to ${r.longNote.thisWeek}s.`);
  if (up(r.dictation, 10)) w.push(`Sargam dictation improved from ${r.dictation.lastWeek}% to ${r.dictation.thisWeek}%.`);
  if (up(r.rhythm, 5)) w.push(`Rhythm went up from ${r.rhythm.lastWeek}% to ${r.rhythm.thisWeek}% on the beat.`);
  if (r.alankars.length) w.push(`Clean alankar runs: ${r.alankars.map((a) => `${a.name} at ${a.bpm} bpm`).join(', ')}.`);
  if (r.lessonsCompleted.length) w.push(`${r.lessonsCompleted.length} lesson${r.lessonsCompleted.length > 1 ? 's' : ''} completed.`);
  if (r.streak >= 3) w.push(`A ${r.streak}-day streak.`);
  return w;
}

function focus(r: WeeklyReport): string {
  if (r.strainSessions >= 2) return 'You felt strain in more than one session. Next week: shorter, softer sessions, a longer warm-up, and lower notes. If pain or hoarseness lasts, see a doctor (ENT).';
  if (!r.daysPractised.thisWeek) return 'Start small: 10 minutes of Daily Riyaz on 4 days next week.';
  if (r.daysPractised.thisWeek < 4) return `Practice was on ${r.daysPractised.thisWeek} day${r.daysPractised.thisWeek === 1 ? '' : 's'}. Short daily riyaz beats one long session — aim for 5 days, even 10 minutes each.`;
  if (r.pitchMatched.thisWeek !== null && r.pitchMatched.thisWeek < 60) return 'Sur is the priority: Pitch Matcher and slow Sargam over the tanpura every day, and the Long Note on Sa.';
  if (r.longNote.thisWeek !== null && r.longNote.thisWeek < 10) return 'Build breath: Long Note on Sa twice a day, calm and comfortable, aiming for a few more steady seconds.';
  if (r.dictation.thisWeek !== null && r.dictation.thisWeek < 60) return 'Train the ear: one round of Sargam dictation every day, singing each answer back.';
  if (r.rhythm.thisWeek !== null && r.rhythm.thisWeek < 60) return 'Work on laya: Taal & Tabla with the tap-along test, and alankars on the beat.';
  if (!r.alankars.length && r.minutes.thisWeek! > 0) return 'Add the Alankar Trainer to your routine — start with groups of three at a slow tempo.';
  return 'Keep the routine going, and add one new challenge: a faster alankar, a new raag phrase, or a meend on the graph.';
}
