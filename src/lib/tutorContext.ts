import { ALL_LESSONS, getLesson, getLevel } from '../curriculum';
import { midiToNoteName, tonicLabel } from '../music/theory';
import type { AppData } from '../storage/schema';
import { completionStats, currentLevel, insights, nextRecommendedLesson, streak, swaraAccuracy, totalMinutes } from './progress';

/**
 * Builds a compact, structured summary for the tutor — never the whole
 * database. Only real, saved data is included.
 */
export function buildTutorContext(data: AppData, focusLessonId?: string) {
  const level = currentLevel(data);
  const completed = ALL_LESSONS.filter((l) => data.lessons[l.id]?.completedAt);
  const next = nextRecommendedLesson(data);
  const focus = focusLessonId ? getLesson(focusLessonId) : undefined;
  const recentPitch = data.pitchAttempts.filter((a) => a.reliable).slice(-12);
  const lastSelf = data.selfAssessments.at(-1);
  return {
    learner: {
      name: data.profile.name || undefined,
      experience: data.profile.experience,
      focus: data.profile.focus,
      dailyMinutesGoal: data.profile.dailyMinutes,
      favouriteSongs: data.profile.favoriteSongs || undefined,
      favouriteSingers: data.profile.favoriteSingers || undefined,
      hasMicrophone: data.profile.hasMic,
      hasHeadphones: data.profile.hasHeadphones,
      sa: `${tonicLabel(data.profile.tonic)} (${data.profile.tonicSource === 'default' ? 'app default, not yet personalised' : 'chosen by learner'})`,
    },
    course: {
      currentLevel: `${level} — ${getLevel(level).title}`,
      completion: completionStats(data),
      completedLessonTitles: completed.slice(-15).map((l) => l.title),
      nextLesson: next ? { id: next.id, title: next.title, objective: next.objective } : null,
      lowQuizScores: Object.entries(data.lessons)
        .filter(([, p]) => p.quizBest !== undefined && p.quizBest < 70)
        .map(([id, p]) => ({ lesson: getLesson(id)?.title ?? id, best: p.quizBest }))
        .slice(0, 6),
    },
    lessonBeingAskedAbout: focus
      ? { title: focus.title, level: focus.level, objective: focus.objective, summary: focus.explanation.english.slice(0, 1200), commonMistakes: focus.mistakes.map((m) => m.mistake) }
      : undefined,
    measuredResults: {
      note: 'Pitch results are from the app’s pitch detector (cents vs target; 100 cents = 1 semitone; negative = flat). They measure note-matching only.',
      perSwara: swaraAccuracy(data).slice(0, 14),
      recentPitchAttempts: recentPitch.map((a) => ({ target: a.target, cents: a.medianCents, matched: a.matched, octaveOffset: a.octaveOffset, at: a.at.slice(0, 10) })),
      earTests: data.earTests.slice(-4).map((t) => ({ kind: t.kind, score: `${t.correct}/${t.questions}`, at: t.at.slice(0, 10) })),
      rhythmTapTests: data.rhythm.slice(-3).map((r) => ({ bpm: r.bpm, onBeatPct: r.onBeatPct, meanOffsetMs: r.meanAbsOffsetMs })),
      baseline: data.baseline,
      comfortableRange: data.ranges.at(-1) ? `${midiToNoteName(data.ranges.at(-1)!.lowMidi).label}–${midiToNoteName(data.ranges.at(-1)!.highMidi).label} (measured ${data.ranges.at(-1)!.at.slice(0, 10)})` : 'not measured yet',
      insights: insights(data).map((i) => `${i.kind}: ${i.text}`),
    },
    practice: {
      totalMinutes: Math.round(totalMinutes(data)),
      sessions: data.sessions.length,
      streakDays: streak(data).current,
      recentSessions: data.sessions.slice(-5).map((s) => ({ date: s.date, minutes: s.minutes, kind: s.kind, comfort: s.comfort, reflection: s.reflection?.slice(0, 200) })),
    },
    latestSelfAssessment: lastSelf ? { weekOf: lastSelf.weekOf, answers: lastSelf.answers, difficult: lastSelf.difficult } : undefined,
    songs: Object.values(data.songs)
      .slice(0, 8)
      .map((s) => ({ title: s.title, artist: s.artist, status: s.status, difficultPhrases: s.phrases.filter((p) => p.difficult).map((p) => p.label).slice(0, 5) })),
    tutorMemory: data.tutor.memory,
  };
}
