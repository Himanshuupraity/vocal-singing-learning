import { ensureRunning, getMaster } from './context';
import { beatRole, TAALS, type BeatRole, type TaalId } from '../music/taal';

export interface MetronomeOptions {
  bpm: number;
  /** null = plain metronome; else taal cycle */
  taal: TaalId | null;
  /** beats per bar for plain metronome */
  beatsPerBar: number;
  volume: number;
  /** speak / sound distinct count clicks */
  accentFirst: boolean;
  onBeat?: (beatIndex: number, role: BeatRole) => void;
}

/**
 * Look-ahead scheduled click track (Chris Wilson's "A Tale of Two Clocks"
 * pattern): a JS timer schedules audio events slightly ahead on the
 * AudioContext clock, so timing stays stable even if the UI thread stutters.
 *
 * In taal mode the sound differs by beat role: sam = strongest, tali = medium,
 * khali = soft hollow "wave" sound, other matras = light tick. This shows the
 * taal's structure, which a plain metronome (equal beats) does not have.
 */
export class Metronome {
  private timer: number | null = null;
  private nextTime = 0;
  private beat = 0;
  private uiTimers: number[] = [];
  running = false;
  constructor(public opts: MetronomeOptions) {}

  async start() {
    if (this.running) return;
    const ctx = await ensureRunning();
    this.running = true;
    this.beat = 0;
    this.nextTime = ctx.currentTime + 0.1;
    this.timer = window.setInterval(() => this.tick(ctx), 25);
    this.tick(ctx);
  }

  stop() {
    this.running = false;
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
    this.uiTimers.forEach(clearTimeout);
    this.uiTimers = [];
  }

  update(o: Partial<MetronomeOptions>) {
    const resetBeat = o.taal !== undefined && o.taal !== this.opts.taal;
    this.opts = { ...this.opts, ...o };
    if (resetBeat) this.beat = 0;
  }

  private cycleLength() {
    return this.opts.taal ? TAALS[this.opts.taal].matras : this.opts.beatsPerBar;
  }

  private roleOf(i: number): BeatRole {
    if (this.opts.taal) return beatRole(TAALS[this.opts.taal], i);
    return i === 0 && this.opts.accentFirst ? 'sam' : 'plain';
  }

  private tick(ctx: AudioContext) {
    while (this.nextTime < ctx.currentTime + 0.12) {
      const idx = this.beat % this.cycleLength();
      const role = this.roleOf(idx);
      this.click(ctx, this.nextTime, role);
      const delay = Math.max(0, (this.nextTime - ctx.currentTime) * 1000);
      const cb = this.opts.onBeat;
      this.uiTimers.push(window.setTimeout(() => this.running && cb?.(idx, role), delay));
      if (this.uiTimers.length > 64) this.uiTimers.splice(0, 32);
      this.nextTime += 60 / this.opts.bpm;
      this.beat = (this.beat + 1) % this.cycleLength();
    }
  }

  private click(ctx: AudioContext, when: number, role: BeatRole) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const spec = {
      sam: { f: 1500, a: 1, type: 'square' as OscillatorType, d: 0.06 },
      tali: { f: 1100, a: 0.7, type: 'square' as OscillatorType, d: 0.05 },
      khali: { f: 500, a: 0.5, type: 'sine' as OscillatorType, d: 0.09 },
      plain: { f: 900, a: 0.4, type: 'sine' as OscillatorType, d: 0.035 },
    }[role];
    o.type = spec.type;
    o.frequency.setValueAtTime(spec.f, when);
    const peak = Math.max(0.0001, spec.a * this.opts.volume * 0.5);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(peak, when + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, when + spec.d);
    o.connect(g).connect(getMaster());
    o.start(when);
    o.stop(when + spec.d + 0.02);
  }
}
