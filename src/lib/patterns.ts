import { parseSwara, type SwaraToken } from '../music/theory';

const pick = <T,>(xs: T[], rnd = Math.random) => xs[Math.floor(rnd() * xs.length)];

/** Sort tokens by pitch so we can move stepwise through the learner's target set. */
function ordered(targets: SwaraToken[]) {
  return [...new Set(targets)].sort((a, b) => parseSwara(a)!.semitones - parseSwara(b)!.semitones);
}

/** Two notes from the target set, at most a Pa (7 semitones) apart, never identical. */
export function makeInterval(targets: SwaraToken[], rnd = Math.random): SwaraToken[] {
  const o = ordered(targets);
  if (o.length < 2) return [o[0], o[0]];
  for (let tries = 0; tries < 50; tries++) {
    const a = pick(o, rnd);
    const b = pick(o, rnd);
    const gap = Math.abs(parseSwara(a)!.semitones - parseSwara(b)!.semitones);
    if (a !== b && gap <= 7) return [a, b];
  }
  return [o[0], o[1]];
}

/** A short, mostly stepwise melodic fragment (like a tiny alankar). */
export function makeSequence(targets: SwaraToken[], length = 3, rnd = Math.random): SwaraToken[] {
  const o = ordered(targets);
  if (o.length < 2) return Array(length).fill(o[0]);
  let i = Math.floor(rnd() * o.length);
  const out = [o[i]];
  while (out.length < length) {
    const step = rnd() < 0.8 ? (rnd() < 0.5 ? 1 : -1) : rnd() < 0.5 ? 2 : -2;
    let j = i + step;
    if (j < 0 || j >= o.length) j = i - step;
    j = Math.max(0, Math.min(o.length - 1, j));
    if (j === i) j = i === 0 ? 1 : i - 1;
    out.push(o[j]);
    i = j;
  }
  return out;
}
