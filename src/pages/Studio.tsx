import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, PageHeader, Tabs, type IconName } from '../components/ui';
import { DroneTool } from '../components/studio/DroneTool';
import { PitchMatcher } from '../components/studio/PitchMatcher';
import { SargamPlayer } from '../components/studio/SargamPlayer';
import { VirtualKeyboard } from '../components/studio/Keyboard';
import { MetronomeTool } from '../components/studio/MetronomeTool';
import { PitchGame } from '../components/studio/PitchGame';
import { EarTraining } from '../components/studio/EarTraining';
import { RecordingJournal } from '../components/studio/RecordingJournal';
import { RangeFinder } from '../components/studio/RangeFinder';
import { isValidSwaraToken } from '../music/theory';
import { usePracticeTimer } from '../hooks/usePracticeTimer';
import type { TaalId } from '../music/taal';

const TOOLS: { id: string; label: string; icon: IconName }[] = [
  { id: 'pitch', label: 'Pitch Matcher', icon: 'target' },
  { id: 'drone', label: 'Tanpura Drone', icon: 'wave' },
  { id: 'sargam', label: 'Sargam Player', icon: 'music' },
  { id: 'taal', label: 'Metronome & Taal', icon: 'drum' },
  { id: 'game', label: 'Pitch Game', icon: 'sparkle' },
  { id: 'ear', label: 'Ear Training', icon: 'ear' },
  { id: 'keyboard', label: 'Keyboard', icon: 'keyboard' },
  { id: 'range', label: 'Range Finder', icon: 'chart' },
  { id: 'record', label: 'Recording Journal', icon: 'record' },
];

/** Map lesson/exercise tools to studio tabs. */
export function studioPath(tool: string, opts: { pattern?: string[]; bpm?: number; targets?: string[]; taal?: TaalId } = {}) {
  const map: Record<string, string> = { 'pitch-match': 'pitch', sargam: 'sargam', drone: 'drone', metronome: 'taal', taal: 'taal', keyboard: 'keyboard', recorder: 'record', 'ear-training': 'ear' };
  const sp = new URLSearchParams();
  if (opts.pattern?.length) sp.set('p', opts.pattern.filter((t) => t !== '-').join(','));
  if (opts.bpm) sp.set('bpm', String(opts.bpm));
  if (opts.targets?.length) sp.set('t', opts.targets.join(','));
  if (opts.taal) sp.set('taal', opts.taal);
  const q = sp.toString();
  return `/studio/${map[tool] ?? tool}${q ? `?${q}` : ''}`;
}

export default function Studio() {
  const { tool = 'pitch' } = useParams();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  usePracticeTimer('studio', 'Practice Studio');
  const active = TOOLS.some((t) => t.id === tool) ? tool : 'pitch';
  const pattern = sp.get('p')?.split(',').filter(isValidSwaraToken);
  const targets = sp.get('t')?.split(',').filter(isValidSwaraToken);
  const bpm = Number(sp.get('bpm')) || undefined;
  const taal = (['teentaal', 'keharwa', 'dadra'] as const).find((x) => x === sp.get('taal')) ?? null;

  return (
    <>
      <PageHeader title="Practice Studio" subtitle="Working audio tools for daily practice. Every tool follows your chosen Sa." />
      <Tabs label="Studio tools" tabs={TOOLS} value={active} onChange={(id) => nav(`/studio/${id}`)} />
      <Card className="mt-4" as="div">
        <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`}>
          {active === 'pitch' && <PitchMatcher targets={targets?.length ? targets : ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"]} context="studio" />}
          {active === 'drone' && <DroneTool />}
          {active === 'sargam' && <SargamPlayer initialPattern={pattern?.length ? pattern : undefined} initialBpm={bpm} />}
          {active === 'taal' && <MetronomeTool initialTaal={taal} initialBpm={bpm ?? 70} />}
          {active === 'game' && <PitchGame />}
          {active === 'ear' && <EarTraining />}
          {active === 'keyboard' && <VirtualKeyboard />}
          {active === 'record' && <RecordingJournal />}
          {active === 'range' && <RangeFinder />}
        </div>
      </Card>
    </>
  );
}
