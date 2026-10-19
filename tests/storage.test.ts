import { describe, expect, it, beforeEach } from 'vitest';
import { LocalStorageAdapter, exportData, importData, STORAGE_KEY } from '../src/storage/adapter';
import { migrate } from '../src/storage/migrate';
import { defaultData } from '../src/storage/schema';
import { recordingStore } from '../src/storage/recordings';

describe('storage', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips data through localStorage', () => {
    const a = new LocalStorageAdapter();
    const d = defaultData();
    d.profile.name = 'Asha';
    d.lessons['l1-x'] = { quizAttempts: 2, quizBest: 80, selfChecks: [], practiceCount: 1, completedAt: '2026-01-01' };
    a.save(d);
    const loaded = new LocalStorageAdapter().load();
    expect(loaded.warning).toBeUndefined();
    expect(loaded.data.profile.name).toBe('Asha');
    expect(loaded.data.lessons['l1-x'].quizBest).toBe(80);
  });

  it('recovers from corrupted JSON and keeps a backup', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    const r = new LocalStorageAdapter().load();
    expect(r.warning).toMatch(/corrupted/);
    expect(r.data.profile.onboarded).toBe(false);
    expect(Object.keys(localStorage).some((k) => k.includes(':corrupt:'))).toBe(true);
  });

  it('repairs invalid fields while keeping valid ones', () => {
    const r = migrate({ version: 1, profile: { name: 'Ravi', dailyMinutes: 999, tonic: { note: 'H', octave: 3 } }, pitchAttempts: 'oops', songs: { a: { title: 'X' } } });
    expect(r.data.profile.name).toBe('Ravi');
    expect(r.data.profile.dailyMinutes).toBe(20);
    expect(r.data.profile.tonic.note).toBe('C');
    expect(r.data.pitchAttempts).toEqual([]);
    expect(r.data.songs.a.phrases).toEqual([]);
  });

  it('migrates version 0 data', () => {
    const r = migrate({ progress: { completed: ['l1-a'] } });
    expect(r.data.lessons['l1-a'].completedAt).toBeTruthy();
    expect(r.data.version).toBe(1);
  });

  it('exports and imports', () => {
    const d = defaultData();
    d.profile.name = 'Meera';
    const back = importData(exportData(d));
    expect(back.data.profile.name).toBe('Meera');
    expect(() => importData('{"foo":1}')).toThrow(/not a SurSadhana/);
    expect(() => importData('nope')).toThrow(/JSON/);
  });
});

describe('recording store (IndexedDB)', () => {
  it('adds, lists, updates and deletes recordings', async () => {
    await recordingStore.clear();
    await recordingStore.add({ id: 'r1', createdAt: '2026-01-01', label: 'Sa', exercise: 'Sa', notes: '', durationSec: 3, mimeType: 'audio/webm', sizeBytes: 3, blob: new Blob(['abc']) });
    expect((await recordingStore.list()).length).toBe(1);
    await recordingStore.update('r1', { notes: 'steady' });
    expect((await recordingStore.list())[0].notes).toBe('steady');
    await recordingStore.remove('r1');
    expect(await recordingStore.list()).toEqual([]);
  });
});
