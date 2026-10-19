import { encodeWav, resample, toBase64, VOICE_RATE } from '../src/audio/wav';

describe('WAV encoding for AI voice feedback', () => {
  it('writes a valid mono 16-bit PCM header', () => {
    const bytes = encodeWav(new Float32Array([0, 0.5, -0.5, 1, -1]));
    const v = new DataView(bytes.buffer);
    const s = (o: number) => String.fromCharCode(...bytes.subarray(o, o + 4));
    expect([s(0), s(8), s(12), s(36)]).toEqual(['RIFF', 'WAVE', 'fmt ', 'data']);
    expect(v.getUint16(22, true)).toBe(1);
    expect(v.getUint32(24, true)).toBe(VOICE_RATE);
    expect(v.getUint16(34, true)).toBe(16);
    expect(v.getUint32(40, true)).toBe(10);
    expect(v.getInt16(44 + 3 * 2, true)).toBe(32767);
    expect(v.getInt16(44 + 4 * 2, true)).toBe(-32768);
  });

  it('downsamples to 16 kHz and caps the length', () => {
    const one = new Float32Array(48000);
    expect(resample(one, 48000).length).toBe(16000);
    expect(resample(new Float32Array(48000 * 90), 48000, VOICE_RATE, 60).length).toBe(16000 * 60);
  });

  it('base64-encodes large buffers', () => {
    const bytes = encodeWav(new Float32Array(100_000));
    const b64 = toBase64(bytes);
    expect(b64.startsWith('UklGR')).toBe(true);
    expect(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))).toEqual(bytes);
  });
});
