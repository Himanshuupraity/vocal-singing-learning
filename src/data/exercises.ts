import type { LevelId, PracticeTool } from '../curriculum/types';
import type { SwaraToken } from '../music/theory';

export type ExerciseCategory = 'warmup' | 'breath' | 'listening' | 'sa' | 'sargam' | 'pitch' | 'alankar' | 'rhythm' | 'raga' | 'technique' | 'song' | 'reflection' | 'cooldown';

export interface Exercise {
  id: string;
  title: string;
  category: ExerciseCategory;
  minLevel: LevelId;
  maxLevel?: LevelId;
  objective: string;
  instructions: string[];
  tool: PracticeTool;
  pattern?: SwaraToken[];
  bpm?: number;
  /** pitch-match targets when tool = pitch-match */
  targets?: SwaraToken[];
  safety?: string;
}

const up = ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"];
const down = [...up].reverse();

export const EXERCISES: Exercise[] = [
  // ---------- Warm-ups ----------
  {
    id: 'wu-guided', title: 'Guided warm-up', category: 'warmup', minLevel: 1,
    objective: 'Wake up breath and voice gently, step by step, with spoken cues and sounds to follow.',
    instructions: ['Press Start below and follow each step.', 'Everything stays soft and comfortable.', 'Stop if anything feels tight, scratchy or painful.'],
    tool: 'warmup',
  },
  {
    id: 'wu-hum', title: 'Gentle humming', category: 'warmup', minLevel: 1,
    objective: 'Wake up the voice gently without strain.',
    instructions: ['Sit or stand tall, shoulders relaxed.', 'Close your lips lightly, teeth apart, and hum "mmm" on a comfortable, speaking-level note.', 'Feel a light buzz on your lips and nose. Keep it soft.', 'Slide the hum slightly up and down — small, easy movements only.'],
    tool: 'none',
  },
  {
    id: 'wu-liptrill', title: 'Lip trills (bubbles)', category: 'warmup', minLevel: 1,
    objective: 'Balance breath and voice with a semi-occluded, low-effort exercise.',
    instructions: ['Relax your lips and blow air through them so they flutter ("brrr"). Light fingertips on your cheeks can help.', 'Add a soft voice to the flutter on a comfortable note.', 'Glide gently up a few notes and back down, like a small hill.', 'If your lips won\'t trill, do the same glide on "vvv" or humming instead.'],
    tool: 'none',
  },
  {
    id: 'wu-siren', title: 'Easy sirens on "oo"', category: 'warmup', minLevel: 1,
    objective: 'Gently explore the comfortable middle of your range.',
    instructions: ['Say a soft "oo" like a quiet ghost sound.', 'Slide smoothly from low to a little higher and back — only within comfortable range.', 'Keep the volume soft; never reach or push for the top.', 'Repeat 5–6 times, a little wider each time only if it stays easy.'],
    tool: 'none', safety: 'Stop if anything feels tight, scratchy or painful.',
  },
  {
    id: 'wu-yawn', title: 'Yawn–sigh release', category: 'warmup', minLevel: 1,
    objective: 'Release jaw and throat tension.',
    instructions: ['Begin a gentle yawn — feel the back of the throat open.', 'Let it go on a soft, descending sigh: "haaah".', 'Massage your jaw hinges lightly with your fingertips.', 'Repeat 4–5 times, slowly.'],
    tool: 'none',
  },
  {
    id: 'wu-straw', title: 'Straw phonation', category: 'warmup', minLevel: 3,
    objective: 'Efficient, low-strain voice production using a straw (semi-occluded vocal tract).',
    instructions: ['Hold a drinking straw between your lips.', 'Hum through the straw on a comfortable note — air should flow out of the straw only.', 'Glide up and down gently, then try a simple tune through the straw.', 'Keep it soft and easy.'],
    tool: 'none',
  },
  // ---------- Breath ----------
  {
    id: 'br-hiss', title: 'Slow hiss breath', category: 'breath', minLevel: 1,
    objective: 'Calm, low breathing and an even outflow of air.',
    instructions: ['Breathe in quietly through the nose for 4 counts; let the belly and lower ribs expand — shoulders stay still.', 'Breathe out on a steady "sss" for 8 counts.', 'Repeat 5 times; extend the hiss to 10–12 counts only if it is comfortable.', 'Never squeeze out the last bit of air.'],
    tool: 'metronome', bpm: 60,
  },
  {
    id: 'br-phrase', title: 'Breath for a phrase', category: 'breath', minLevel: 3,
    objective: 'Plan where to breathe and spend air evenly across a phrase.',
    instructions: ['Pick a 4-beat phrase from the Sargam Player (e.g. S R G m P).', 'Take a relaxed breath before it, sing the phrase at a medium volume.', 'Notice whether you run out of air or have too much left — adjust the next breath.', 'Mark your breath points with a "/" in your practice notes.'],
    tool: 'sargam', pattern: ['S', 'R', 'G', 'm', 'P', '-', 'P', 'm', 'G', 'R', 'S', '-'], bpm: 60,
  },
  {
    id: 'br-longnote', title: 'Long note on Sa', category: 'breath', minLevel: 1,
    objective: 'Hold Sa steadily and in tune for as long as it stays comfortable.',
    instructions: ['Tanpura on. Take a calm, low breath.', 'Sing Sa on "aa" softly and hold it; the app times the hold and checks steadiness.', 'Do 3 holds with a rest between. Stop before you run out of air.'],
    tool: 'long-note',
    safety: 'Never squeeze out the last bit of air or push from the throat.',
  },
  // ---------- Listening ----------
  {
    id: 'li-same-diff', title: 'Same or different?', category: 'listening', minLevel: 1,
    objective: 'Train your ear to notice pitch differences before singing.',
    instructions: ['Open Ear Training → "Same or different?".', 'Listen to both notes fully before answering.', 'Hum each note quietly in your head if it helps.', 'Aim for 10 questions.'],
    tool: 'ear-training',
  },
  {
    id: 'li-higher-lower', title: 'Higher or lower?', category: 'listening', minLevel: 1,
    objective: 'Hear the direction of pitch movement.',
    instructions: ['Open Ear Training → "Higher or lower?".', 'Decide whether the second note is higher or lower than the first.', 'Do 10 questions; the gap gets smaller as you improve.'],
    tool: 'ear-training',
  },
  {
    id: 'li-dictation', title: 'Sargam dictation', category: 'listening', minLevel: 1,
    objective: 'Recognise short phrases by ear and name their swaras.',
    instructions: ['Listen to Sa, then the phrase.', 'Tap the swaras you heard, in order.', 'After each answer, play it back and sing it once.'],
    tool: 'ear-training',
  },
  // ---------- Sa ----------
  {
    id: 'sa-match', title: 'Listen and match Sa', category: 'sa', minLevel: 1,
    objective: 'Sing your Sa accurately against the reference.',
    instructions: ['Start the Tanpura Drone at your Sa (optional, softly).', 'In Pitch Matcher, press "Play reference" and listen fully.', 'Hum the note quietly, then sing "aa" on Sa and hold it for 3 seconds.', 'Read the feedback, relax, and repeat 5–8 times.'],
    tool: 'pitch-match', targets: ['S'],
  },
  {
    id: 'sa-long', title: 'Long Sa with the drone', category: 'sa', minLevel: 1,
    objective: 'Hold Sa steadily, in tune with the drone.',
    instructions: ['Play the Tanpura Drone at your Sa.', 'Take a comfortable breath and sing "aa" on Sa for as long as it stays easy (5–10 seconds).', 'Listen for the voice blending into the drone — no "wobble" or beating.', 'Rest a breath between each long note. 6 repetitions.'],
    tool: 'pitch-match', targets: ['S'],
  },
  // ---------- Sargam ----------
  {
    id: 'sg-slow', title: 'Slow sargam (aroha–avaroha)', category: 'sargam', minLevel: 1,
    objective: 'Sing Sa Re Ga Ma Pa Dha Ni Sa up and down slowly with the reference.',
    instructions: ['Open the Sargam Player at slow speed (50–60 bpm).', 'Listen once without singing.', 'Sing along softly, one note per beat, saying the note names.', 'Then sing on "aa" instead of the names.'],
    tool: 'sargam', pattern: [...up, ...down.slice(1)], bpm: 55,
  },
  {
    id: 'sg-half', title: 'Sa–Re–Ga–Ma–Pa and back', category: 'sargam', minLevel: 1,
    objective: 'Build confidence on the first five notes.',
    instructions: ['Use the Sargam Player at 60 bpm.', 'Sing S R G m P, then P m G R S.', 'Keep each note steady for its full beat.', 'Repeat 4 times.'],
    tool: 'sargam', pattern: ['S', 'R', 'G', 'm', 'P', 'P', 'm', 'G', 'R', 'S'], bpm: 60,
  },
  {
    id: 'sg-match', title: 'Sargam note matching', category: 'pitch', minLevel: 1,
    objective: 'Match individual sargam notes with measured feedback.',
    instructions: ['In Pitch Matcher choose targets S, R, G, m, P.', 'For each: play the reference, listen, then sing and hold.', 'Note which notes tend to go flat or sharp.'],
    tool: 'pitch-match', targets: ['S', 'R', 'G', 'm', 'P'],
  },
  {
    id: 'pt-game', title: 'Pitch-matching game', category: 'pitch', minLevel: 1,
    objective: 'Playful, measured practice of matching random notes.',
    instructions: ['Open the Pitch Game.', 'Play a round of 8 notes at your level.', 'Read the feedback for each note before moving on.'],
    tool: 'pitch-match', targets: ['S', 'R', 'G', 'm', 'P', 'D', 'N'],
  },
  // ---------- Alankars ----------
  {
    id: 'al-3', title: 'Alankar: groups of three', category: 'alankar', minLevel: 2,
    objective: 'Sing the 3-note alankar evenly.',
    instructions: ['Sargam Player at 60 bpm. Listen once.', 'Sing along: S R G, R G m, G m P …', 'Increase to 70–80 bpm only when every note is clear and in tune.'],
    tool: 'sargam', bpm: 60,
    pattern: ['S', 'R', 'G', 'R', 'G', 'm', 'G', 'm', 'P', 'm', 'P', 'D', 'P', 'D', 'N', 'D', 'N', "S'", "S'", 'N', 'D', 'N', 'D', 'P', 'D', 'P', 'm', 'P', 'm', 'G', 'm', 'G', 'R', 'G', 'R', 'S'],
  },
  {
    id: 'al-trainer', title: 'Alankar Trainer', category: 'alankar', minLevel: 2,
    objective: 'Sing an alankar on the beat with every note checked, raising the tempo only after clean runs.',
    instructions: ['Pick an alankar (start with groups of three).', 'Listen once, then sing it on the beat.', 'Move up 10 bpm only after a clean run (80% or more in tune).'],
    tool: 'alankar-trainer',
  },
  {
    id: 'al-4', title: 'Alankar: groups of four', category: 'alankar', minLevel: 2,
    objective: 'Develop evenness and breath across longer patterns.',
    instructions: ['Sargam Player at 60 bpm.', 'Sing S R G m, R G m P, G m P D …', 'Breathe at the end of each group of four if needed.'],
    tool: 'sargam', bpm: 60,
    pattern: ['S', 'R', 'G', 'm', 'R', 'G', 'm', 'P', 'G', 'm', 'P', 'D', 'm', 'P', 'D', 'N', 'P', 'D', 'N', "S'", "S'", 'N', 'D', 'P', 'N', 'D', 'P', 'm', 'D', 'P', 'm', 'G', 'P', 'm', 'G', 'R', 'm', 'G', 'R', 'S'],
  },
  {
    id: 'al-skip', title: 'Alankar: skip notes (S G, R m …)', category: 'alankar', minLevel: 2,
    objective: 'Accurately jump over a note.',
    instructions: ['Sargam Player at 55 bpm.', 'Sing S G, R m, G P, m D, P N, D S\'. Then come down.', 'Hear the skipped note in your head before you jump.'],
    tool: 'sargam', bpm: 55,
    pattern: ['S', 'G', 'R', 'm', 'G', 'P', 'm', 'D', 'P', 'N', 'D', "S'", "S'", 'D', 'N', 'P', 'D', 'm', 'P', 'G', 'm', 'R', 'G', 'S'],
  },
  {
    id: 'al-vakra', title: 'Advanced alankar: zig-zag', category: 'alankar', minLevel: 4,
    objective: 'Control a vakra (zig-zag) pattern at a steady tempo.',
    instructions: ['Sargam Player at 70 bpm, then 90, then 110 when clean.', 'Sing S R S R G, R G R G m, G m G m P …', 'Use a metronome; never rush.'],
    tool: 'sargam', bpm: 70,
    pattern: ['S', 'R', 'S', 'R', 'G', 'R', 'G', 'R', 'G', 'm', 'G', 'm', 'G', 'm', 'P', 'm', 'P', 'm', 'P', 'D', 'P', 'D', 'P', 'D', 'N', 'D', 'N', 'D', 'N', "S'"],
  },
  // ---------- Rhythm ----------
  {
    id: 'rh-keharwa', title: 'Clap Keharwa (8 beats)', category: 'rhythm', minLevel: 1,
    objective: 'Feel a steady 8-beat cycle: clap on 1, wave on 5.',
    instructions: ['Open Metronome & Taal → Keharwa at 70 bpm.', 'Count aloud 1–8. Clap on 1 (sam), wave your hand on 5 (khali), tap fingers on the others.', 'Do 4 full cycles without stopping.'],
    tool: 'taal', bpm: 70,
  },
  {
    id: 'rh-dadra', title: 'Clap Dadra (6 beats)', category: 'rhythm', minLevel: 2,
    objective: 'Feel the 3+3 lilt of Dadra.',
    instructions: ['Metronome & Taal → Dadra at 75 bpm.', 'Count 1–6: clap on 1, wave on 4.', '4 cycles; then sing Sa on each sam while clapping.'],
    tool: 'taal', bpm: 75,
  },
  {
    id: 'rh-teentaal', title: 'Clap Teentaal (16 beats)', category: 'rhythm', minLevel: 2,
    objective: 'Follow the 16-beat cycle: claps on 1, 5, 13; wave on 9.',
    instructions: ['Metronome & Taal → Teentaal at 80 bpm.', 'Clap on 1 (sam), 5 and 13; wave on 9 (khali).', 'Say the theka bols if you can: Dha Dhin Dhin Dha …', '3 full cycles.'],
    tool: 'taal', bpm: 80,
  },
  {
    id: 'rh-tap', title: 'Tap-along timing test', category: 'rhythm', minLevel: 1,
    objective: 'Measure how evenly you can follow a beat.',
    instructions: ['Metronome & Taal → "Tap-along test".', 'Tap the button (or space bar) exactly with each click for 16 beats.', 'Read your result — it measures timing only.'],
    tool: 'metronome', bpm: 70,
  },
  {
    id: 'rh-sargam-taal', title: 'Sargam in Keharwa', category: 'rhythm', minLevel: 2,
    objective: 'Sing one note per beat while keeping the taal.',
    instructions: ['Keharwa at 70 bpm.', 'Sing S R G m on beats 1–4 and P D N S\' on beats 5–8.', 'Come down on the next cycle. Clap or tap as you sing.'],
    tool: 'taal', bpm: 70,
  },
  // ---------- Raga & technique ----------
  {
    id: 'rg-yaman', title: 'Yaman aroha–avaroha', category: 'raga', minLevel: 3,
    objective: 'Sing Yaman’s scale with teevra Ma, slowly over the drone.',
    instructions: ['Drone on. Sargam Player at 50 bpm.', 'Sing .N R G M D N S\' and S\' N D P M G R S.', 'Linger on Ga and Ni; feel how teevra Ma (Ma♯) sounds bright.'],
    tool: 'sargam', bpm: 50, pattern: ['.N', 'R', 'G', 'M', 'D', 'N', "S'", "S'", 'N', 'D', 'P', 'M', 'G', 'R', 'S'],
  },
  {
    id: 'rg-bhupali', title: 'Bhupali aroha–avaroha', category: 'raga', minLevel: 3,
    objective: 'Sing the five notes of Bhupali (no Ma, no Ni).',
    instructions: ['Drone on. Sargam Player at 50 bpm.', 'Sing S R G P D S\' and S\' D P G R S.', 'Notice the open, pentatonic sound.'],
    tool: 'sargam', bpm: 50, pattern: ['S', 'R', 'G', 'P', 'D', "S'", "S'", 'D', 'P', 'G', 'R', 'S'],
  },
  {
    id: 'tq-meend', title: 'Meend glides', category: 'technique', minLevel: 3,
    objective: 'Connect two notes with a smooth, controlled glide.',
    instructions: ['Listen to the glide first.', 'Hold the first note, glide slowly on "aa" and land exactly on the second; hold it.', 'Read the graph: no stopping on the notes in between, no overshoot.', 'Try Sa → Ga, then Sa → Pa and Pa → Sa.'],
    tool: 'meend',
  },
  {
    id: 'tq-gamak', title: 'Andolan swings', category: 'technique', minLevel: 3,
    objective: 'Swing evenly between two neighbouring swaras with control.',
    instructions: ['Start with the slow sway (andolan) between Re and Ga.', 'Touch both notes each time; keep the swings even.', 'Only try the faster gamak when the slow one is even.'],
    tool: 'meend',
  },
  {
    id: 'rg-check', title: 'Raag free singing check', category: 'raga', minLevel: 3,
    objective: 'Sing slow alap phrases in a raag without using its varjit swaras.',
    instructions: ['Pick the raag you are learning and play the tanpura.', 'Sing slow phrases on "aa" or sargam.', 'Watch for red notes (not in the raag) and correct them.'],
    tool: 'raag',
  },
  {
    id: 'tq-alap', title: 'Simple alap over the drone', category: 'technique', minLevel: 3,
    objective: 'Explore notes freely and slowly, without rhythm.',
    instructions: ['Drone on.', 'Start on Sa; move slowly to neighbouring notes (.N, R) and return to Sa.', 'Expand one note at a time; always return to Sa or a resting note.', 'Record a 1-minute alap in the Recording Journal and listen back.'],
    tool: 'recorder',
  },
  {
    id: 'tq-taan', title: 'Slow-to-fast sapaat taan', category: 'technique', minLevel: 4,
    objective: 'Build speed with clarity.',
    instructions: ['Sargam Player: S R G m P D N S\' N D P m G R S.', 'Start at 80 bpm, then 100, 120, 140 — move up only when every note is clean.', 'Sing on "aa" (akaar) after the note names.'],
    tool: 'sargam', bpm: 80, pattern: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'", 'N', 'D', 'P', 'm', 'G', 'R', 'S'],
  },
  // ---------- Song ----------
  {
    id: 'sn-phrase', title: 'Song phrase practice', category: 'song', minLevel: 1,
    objective: 'Work on one phrase from a song in My Songs.',
    instructions: ['Open Bollywood Songs → My Songs and pick a song you are learning.', 'Play the phrase on the original (official) video; listen 3 times.', 'Hum it, then sing it softly at a comfortable pitch.', 'Mark the phrase done or difficult.'],
    tool: 'none',
  },
  // ---------- Reflection / cooldown ----------
  {
    id: 'cd-hum', title: 'Cool-down hum and sighs', category: 'cooldown', minLevel: 1,
    objective: 'Relax the voice after practice.',
    instructions: ['Hum softly downward slides for 30 seconds.', 'A few relaxed yawn-sighs.', 'Sip some water.'],
    tool: 'none',
  },
  {
    id: 'rf-reflect', title: 'Reflection', category: 'reflection', minLevel: 1,
    objective: 'Notice what went well and how your voice feels.',
    instructions: ['How does your throat feel — comfortable, a little tired, or strained?', 'What felt easier today?', 'What will you focus on next time?'],
    tool: 'none',
  },
];

export const EXERCISE_BY_ID = new Map(EXERCISES.map((e) => [e.id, e]));
