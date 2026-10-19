import { parseYouTubeId, youtubeSearchUrl } from '../src/lib/youtube';

describe('YouTube helpers', () => {
  it('parses common video URL shapes', () => {
    expect(parseYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10')).toBe('dQw4w9WgXcQ');
    expect(parseYouTubeId('https://youtu.be/dQw4w9WgXcQ?si=x')).toBe('dQw4w9WgXcQ');
    expect(parseYouTubeId('https://m.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });
  it('rejects non-YouTube or malformed links', () => {
    expect(parseYouTubeId('https://evil.com/watch?v=dQw4w9WgXcQ')).toBeNull();
    expect(parseYouTubeId('javascript:alert(1)')).toBeNull();
    expect(parseYouTubeId('https://youtube.com/watch?v=short')).toBeNull();
    expect(parseYouTubeId('not a url')).toBeNull();
  });
  it('encodes search queries safely', () => {
    expect(youtubeSearchUrl('sa & re <b>')).toBe('https://www.youtube.com/results?search_query=sa%20%26%20re%20%3Cb%3E');
  });
});
