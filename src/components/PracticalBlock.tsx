import type { PracticalCheck } from '../curriculum/types';
import { useAppData } from '../state/AppData';
import { PitchMatcher } from './studio/PitchMatcher';
import { EarTraining } from './studio/EarTraining';
import { Badge } from './ui';
import type { RequirementState } from '../lib/progress';

/** Renders the right interactive tool for a practical requirement and saves results under `context`. */
export function PracticalBlock({ practical, context, ticked, onToggle, state }: { practical: PracticalCheck; context: string; ticked: string[]; onToggle: (item: string, on: boolean) => void; state?: RequirementState }) {
  const { data } = useAppData();
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-medium">{practical.description}</p>
        {state && <Badge tone={state.met ? 'success' : 'neutral'}>{state.met ? 'Requirement met' : 'Not yet met'}</Badge>}
      </div>
      {state && <p className="text-sm text-muted">{state.detail}</p>}
      {practical.kind === 'pitch-match' && (
        <>
          {data.profile.hasMic === false && <p className="text-sm text-warning">This practical needs a microphone (a phone or laptop mic works).</p>}
          <PitchMatcher targets={practical.targets} context={context} tolerance={practical.toleranceCents} title="Practical: pitch matching" />
        </>
      )}
      {practical.kind === 'ear-test' && <EarTraining context={context} questions={practical.minQuestions} initialKind="same-different" lockKind />}
      {practical.kind === 'self-check' && (
        <fieldset className="space-y-2">
          <legend className="text-sm text-muted">These can&apos;t be measured by the app, so they rely on your honest self-report. Tick each one only when it&apos;s genuinely true.</legend>
          {practical.items.map((item) => (
            <label key={item} className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm">
              <input type="checkbox" className="mt-0.5" checked={ticked.includes(item)} onChange={(e) => onToggle(item, e.target.checked)} />
              <span>{item}</span>
            </label>
          ))}
        </fieldset>
      )}
    </div>
  );
}
