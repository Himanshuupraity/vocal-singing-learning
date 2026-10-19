import { useRef, useState } from 'react';
import { decodeToMono } from '../../audio/offlineAnalysis';
import { voicePayload } from '../../lib/voicePayload';
import { useServerStatus } from '../../hooks/useServerStatus';
import { ApiError, streamPost } from '../../lib/sse';
import { useAppData } from '../../state/AppData';
import type { RecordingEntry } from '../../storage/recordings';
import { Alert, Button, Spinner } from '../ui';
import { Markdown } from '../ui/Markdown';

const MAX_SEC = 60;

/**
 * Sends one Recording Journal clip to the AI to *listen* to, together with the
 * app's own pitch measurements. Nothing is sent until the learner confirms,
 * every time.
 */
export function AiVoiceFeedback({ recording }: { recording: RecordingEntry }) {
  const { data } = useAppData();
  const status = useServerStatus();
  const [stage, setStage] = useState<'idle' | 'confirm' | 'sending' | 'done' | 'error'>('idle');
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const abort = useRef<AbortController | null>(null);

  if (!status?.reachable || !status.tutor.voice) {
    return status?.reachable ? <p className="text-xs text-muted">AI voice feedback needs a Gemini key on the server.</p> : null;
  }

  const send = async () => {
    setStage('sending');
    setText('');
    setErr('');
    abort.current = new AbortController();
    try {
      const { samples, sampleRate } = await decodeToMono(recording.blob);
      const { analysis: a, body } = voicePayload(samples, sampleRate, data, { label: recording.label, exercise: recording.exercise, maxSec: MAX_SEC });
      if (a.voicedSec < 0.5) throw new ApiError('empty', 'No clear singing was found in this recording, so there is nothing for the AI to listen to. Try recording again a little closer to the mic.');
      await streamPost(
        '/api/tutor/voice',
        body,
        (t) => setText((x) => x + t),
        abort.current.signal,
      );
      setStage('done');
    } catch (e) {
      if ((e as Error).name === 'AbortError') return setStage('idle');
      setErr((e as Error).message || 'Could not get feedback. Please try again.');
      setStage('error');
    }
  };

  if (stage === 'idle')
    return (
      <Button size="sm" variant="secondary" icon="sparkle" onClick={() => setStage('confirm')}>
        Get AI voice feedback
      </Button>
    );

  if (stage === 'confirm')
    return (
      <Alert tone="info" title="Send this recording to the AI?">
        <p>
          The first {MAX_SEC} seconds of <strong>this recording</strong> and its pitch measurements will be sent through the SurSadhana server to <strong>Google Gemini</strong>, which listens and replies with feedback. SurSadhana does not keep a copy; Google’s handling is described in the{' '}
          <a className="underline" href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noreferrer">
            Gemini API terms
          </a>
          . Your other recordings stay on this device.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" onClick={send}>
            Send to AI
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setStage('idle')}>
            Cancel
          </Button>
        </div>
      </Alert>
    );

  return (
    <div className="space-y-2 rounded-xl bg-surface-2 p-3">
      <p className="text-sm font-medium">AI voice feedback</p>
      {stage === 'sending' && !text && <Spinner label="The AI is listening…" />}
      {text && <Markdown text={text} />}
      {stage === 'error' && <Alert tone="warning">{err}</Alert>}
      {stage === 'sending' ? (
        <Button size="sm" variant="ghost" onClick={() => abort.current?.abort()}>
          Stop
        </Button>
      ) : (
        <Button size="sm" variant="ghost" icon="repeat" onClick={() => setStage('confirm')}>
          Ask again
        </Button>
      )}
      <p className="text-xs text-muted">AI listening can be wrong, especially with a phone mic or background noise. Pitch numbers come from the app’s own measurements. If anything hurts, stop and rest your voice.</p>
    </div>
  );
}
