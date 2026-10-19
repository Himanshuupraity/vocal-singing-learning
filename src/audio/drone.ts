import { ensureRunning, getMaster } from './context';
import { periodicWave } from './synth';
import { renderPluck } from './pluck';
import { midiToFreq, tonicMidi, type Tonic } from '../music/theory';

/**
 * Synthesized tanpura-style drone.
 *
 * HONEST LABEL: this is a synthesized approximation, not a recording of a
 * real tanpura. Each string is physically modelled (Karplus–Strong plucked
 * string, accurately tuned with a fractional-delay allpass) with a jawari-like
 * buzz, played in the tanpura's four-string cycle (1st string – Sa' – Sa' – low Sa).
 *
 * Mode "tanpura" = plucked cycle; mode "sustained" = steady Sa + Pa tone
 * (like an electronic shruti box).
 */
export type DroneMode = 'tanpura' | 'sustained';
/** Tuning of the first string relative to Sa: Pa (most common), Ma (for ragas without Pa), Ni. */
export type FirstString = 'P' | 'm' | 'N';

const FIRST_STRING_SEMITONES: Record<FirstString, number> = { P: 7 - 12, m: 5 - 12, N: 11 - 12 };

export interface DroneSettings {
  tonic: Tonic;
  volume: number;
  mode: DroneMode;
  firstString: FirstString;
  /** seconds per full 4-pluck cycle */
  cycleSec: number;
}

export class Drone {
  private out: GainNode | null = null;
  private timer: number | null = null;
  private nextPluck = 0;
  private pluckIndex = 0;
  private sustained: OscillatorNode[] = [];
  private settings: DroneSettings;
  playing = false;

  constructor(settings: DroneSettings) {
    this.settings = { ...settings };
  }

  async start() {
    if (this.playing) return;
    const ctx = await ensureRunning();
    this.out = ctx.createGain();
    this.out.gain.setValueAtTime(0.0001, ctx.currentTime);
    this.out.gain.exponentialRampToValueAtTime(Math.max(0.0001, this.settings.volume), ctx.currentTime + 0.4);
    this.out.connect(getMaster());
    this.playing = true;
    if (this.settings.mode === 'sustained') this.startSustained(ctx);
    else {
      this.nextPluck = ctx.currentTime + 0.05;
      this.pluckIndex = 0;
      this.timer = window.setInterval(() => this.schedule(ctx), 50);
      this.schedule(ctx);
    }
  }

  stop() {
    if (!this.playing || !this.out) return;
    const out = this.out;
    const ctx = out.context;
    out.gain.cancelScheduledValues(ctx.currentTime);
    out.gain.setValueAtTime(out.gain.value, ctx.currentTime);
    out.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    window.setTimeout(() => out.disconnect(), 400);
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
    this.sustained.forEach((o) => {
      try {
        o.stop(ctx.currentTime + 0.35);
      } catch {
        /* noop */
      }
    });
    this.sustained = [];
    this.out = null;
    this.playing = false;
  }

  setVolume(v: number) {
    this.settings.volume = v;
    if (this.out) this.out.gain.setTargetAtTime(Math.max(0.0001, v), this.out.context.currentTime, 0.05);
  }

  async update(partial: Partial<DroneSettings>) {
    const restart = this.playing && (partial.tonic || partial.mode || partial.firstString);
    this.settings = { ...this.settings, ...partial };
    if (partial.volume !== undefined) this.setVolume(partial.volume);
    if (restart) {
      this.stop();
      await this.start();
    }
  }

  private stringFreqs(): number[] {
    const sa = tonicMidi(this.settings.tonic);
    return [
      midiToFreq(sa + 12 + FIRST_STRING_SEMITONES[this.settings.firstString]),
      midiToFreq(sa + 12),
      midiToFreq(sa + 12),
      midiToFreq(sa),
    ];
  }

  private schedule(ctx: AudioContext) {
    if (!this.out) return;
    const lookahead = 0.3;
    const gap = this.settings.cycleSec / 4;
    const freqs = this.stringFreqs();
    while (this.nextPluck < ctx.currentTime + lookahead) {
      // Traditional rhythm: slight pause before the 4th (low Sa) string completes the cycle.
      const idx = this.pluckIndex % 4;
      this.pluck(ctx, freqs[idx], this.nextPluck, idx === 3 ? 1.2 : 0.85);
      this.nextPluck += idx === 3 ? gap * 1.4 : gap * 0.87;
      this.pluckIndex++;
    }
  }

  private buffers = new Map<string, AudioBuffer>();

  /** Physically-modelled string (Karplus–Strong), rendered once per pitch and cached. */
  private stringBuffer(ctx: AudioContext, freq: number, seconds: number): AudioBuffer {
    const key = `${freq.toFixed(3)}|${ctx.sampleRate}|${seconds}`;
    let b = this.buffers.get(key);
    if (!b) {
      const data = renderPluck(freq, ctx.sampleRate, seconds, { seed: Math.round(freq) });
      b = ctx.createBuffer(1, data.length, ctx.sampleRate);
      b.copyToChannel(data, 0);
      this.buffers.set(key, b);
    }
    return b;
  }

  private pluck(ctx: AudioContext, freq: number, when: number, amp: number) {
    const dur = Math.min(9, this.settings.cycleSec * 1.8);
    const src = ctx.createBufferSource();
    src.buffer = this.stringBuffer(ctx, freq, dur);
    // slight random detune per pluck — real strings never sound identical twice
    src.detune.value = (Math.random() - 0.5) * 3;
    const g = ctx.createGain();
    g.gain.value = 0.22 * amp;
    // gentle resonant sweep adds the characteristic "blooming" jawari shimmer
    const bp = ctx.createBiquadFilter();
    bp.type = 'peaking';
    bp.Q.value = 4;
    bp.gain.value = 6;
    bp.frequency.setValueAtTime(freq * 4, when);
    bp.frequency.exponentialRampToValueAtTime(freq * 10, when + dur * 0.35);
    bp.frequency.exponentialRampToValueAtTime(freq * 5, when + dur);
    src.connect(bp).connect(g).connect(this.out!);
    src.start(when);
    src.stop(when + dur);
  }

  private startSustained(ctx: AudioContext) {
    const sa = tonicMidi(this.settings.tonic);
    const parts: [number, number][] = [
      [midiToFreq(sa), 0.16],
      [midiToFreq(sa + 12 + FIRST_STRING_SEMITONES[this.settings.firstString]), 0.1],
      [midiToFreq(sa + 12), 0.1],
    ];
    for (const [f, a] of parts) {
      const o = ctx.createOscillator();
      o.setPeriodicWave(periodicWave(ctx, 'reed'));
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = a;
      // gentle slow swell for a living sound
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.15 + Math.random() * 0.1;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = a * 0.25;
      lfo.connect(lfoGain).connect(g.gain);
      o.connect(g).connect(this.out!);
      o.start();
      lfo.start();
      this.sustained.push(o, lfo);
    }
  }
}
