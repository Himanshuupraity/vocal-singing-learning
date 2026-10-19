import { isChunkError, newerBuildAvailable } from '../src/lib/updates';

const res = (status: number, body: unknown) => (async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

describe('update detection', () => {
  it('spots a different build id on the server', async () => {
    expect(await newerBuildAvailable('abc', res(200, { id: 'def' }))).toBe(true);
    expect(await newerBuildAvailable('abc', res(200, { id: 'abc' }))).toBe(false);
  });

  it('stays quiet when the check fails', async () => {
    expect(await newerBuildAvailable('abc', res(404, {}))).toBe(false);
    expect(await newerBuildAvailable('abc', res(200, {}))).toBe(false);
    expect(await newerBuildAvailable('abc', (async () => Promise.reject(new TypeError('offline'))) as unknown as typeof fetch)).toBe(false);
  });

  it('recognises lazy-page load failures from every browser', () => {
    expect(isChunkError(new TypeError('Failed to fetch dynamically imported module: https://x/assets/Studio-abc.js'))).toBe(true);
    expect(isChunkError(new TypeError('Importing a module script failed.'))).toBe(true);
    expect(isChunkError(new Error('error loading dynamically imported module'))).toBe(true);
    expect(isChunkError(new Error('Cannot read properties of undefined'))).toBe(false);
  });
});
