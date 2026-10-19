import type { Level } from '../types';

/**
 * Level 3 — Intermediate.
 * Technique (breath, range, registers, resonance, dynamics, diction),
 * ornaments (meend, gamak, murki, khatka), raag foundations with five
 * introductory ragas, simple alap, and practical musicianship.
 *
 * Western vocal-pedagogy terms (chest/head/mix, passaggio, appoggio,
 * SOVT) are always labelled as such and kept distinct from Hindustani
 * concepts (saptak, awaaz lagana, meend, andolan, raag grammar).
 */
export const level3: Level = {
  id: 3,
  title: 'Intermediate',
  subtitle: 'Breath, tone, ornaments and your first ragas',
  suggestedDuration: 'Months 4–6 (flexible guideline)',
  description:
    'You can now hold Sa, sing the basic sargam in tune and keep a simple taal. Level 3 deepens technique — breath for whole phrases, a gently expanding comfortable range, register transitions, resonance, dynamics and Hindi/Urdu diction — and introduces the ornaments that give Indian singing its flavour (meend, gamak, murki, khatka). You then meet the grammar of raag and five introductory ragas: Yaman, Bhupali, Bilawal, Kafi and Bhairav, plus simple alap, learning songs by ear and reviewing your own recordings. Go at your own pace: these months are a guideline, not a deadline, and the raga lessons are an introduction, not a substitute for long-term training with a guru.',
  lessons: [
    // ───────────────────────── Module 1: Breath & Range ─────────────────────────
    {
      id: 'l3-breath-for-phrases',
      level: 3,
      module: 'Breath & Range',
      title: 'Breath Planning for Musical Phrases',
      objective:
        'Plan where to breathe in a phrase, mark breaths, and sustain a phrase with steady, unforced support.',
      explanation: {
        hinglish: `Level 1 mein aapne seekha ki saans pet aur pasliyon (ribs) tak jaani chahiye, kandhe upar nahi uthne chahiye. Ab next step hai: saans ko gaane ke phrase ke hisaab se plan karna.

Ek phrase matlab ek musical "sentence" — jaise bolte waqt hum comma aur full stop par rukte hain, waise hi gaane mein bhi saans lene ki sahi jagah hoti hai. Achhe singers pehle se decide karte hain ki saans kahan lenge. Isse "breath mark" kehte hain — notebook mein lyrics ya sargam ke upar ek chhota sa ✓ ya comma bana dijiye.

Western technique mein ek idea hai "appoggio" (Italian word, matlab "lean karna"). Simple bhasha mein: saans lene ke baad pasliyon ko thoda khula rakhne ki koshish kijiye, taaki hawa ek dum se bahar na nikal jaaye. Pet ki muscles dheere-dheere andar aati hain, jaise aap ek lambi "sss" awaaz nikaal rahe hon. Yeh pressing ya zor lagana NAHI hai — gala dheela rehta hai.

Sabse common galti: zyada hawa bhar lena aur phir zor se dhakka dena (over-pushing). Isse awaaz tight aur loud ho jaati hai, aur gala thak jaata hai. Sahi feeling hai — "kaafi hawa, aaram se kharch".

Ek aur tip: phrase ke end tak saans bilkul khatam mat kijiye. Thodi hawa bacha kar rakhiye, phir aaram se agli saans lijiye. Hindustani gayaki mein bhi lambi taan ya alap ke liye yeh "saans ka hisaab" bahut zaroori hai, bhale hi wahan "appoggio" shabd use nahi hota.`,
        english: `In Level 1 you learned low, relaxed breathing: the breath expands the belly and lower ribs while the shoulders stay still. Now we apply it to music: planning breath around phrases.

A phrase is a musical sentence. When you speak, you pause at commas and full stops; songs have natural breathing places too. Good singers decide in advance where they will breathe and write a breath mark (a small tick or comma) above the lyrics or sargam. Breathing in random places — mid-word, or only when you run out — breaks the meaning of the line and makes the next note start late or out of tune.

Western classical pedagogy uses the Italian term "appoggio" ("to lean") for a balanced support strategy. Put simply: after you inhale, try to keep the lower ribs gently expanded while you sing, so the air does not rush out all at once. The abdominal wall moves in gradually, like a long, steady hiss. This is not squeezing or pushing — the throat stays free and the sound should feel easy.

The commonest mistake is over-pushing: gulping a huge breath and then driving it out hard. That makes the tone pressed and loud and tires the voice. Aim for "enough air, spent calmly". Also, do not sing until you are completely empty; leave a little reserve and take a relaxed breath at the next planned spot.

Hindustani training does not normally use the word appoggio, but the same practical skill — knowing your breath budget for a long alap phrase or taan — is taught through riyaz and imitation of the guru.`,
        hindi: `लेवल 1 में आपने नीचे की ओर, आराम से साँस लेना सीखा: साँस पेट और निचली पसलियों को फैलाती है और कंधे स्थिर रहते हैं। अब इसे संगीत में लगाते हैं: फ़्रेज़ (phrase) के हिसाब से साँस की योजना बनाना।

फ़्रेज़ एक संगीत का वाक्य है। बोलते समय हम अल्पविराम और पूर्णविराम पर रुकते हैं; गानों में भी साँस लेने की स्वाभाविक जगहें होती हैं। अच्छे गायक पहले से तय करते हैं कि कहाँ साँस लेंगे और बोल या सरगम के ऊपर एक "ब्रेथ मार्क" (छोटा सा ✓ या कॉमा) लिख लेते हैं। बेतरतीब जगह पर — शब्द के बीच में, या तभी जब हवा ख़त्म हो जाए — साँस लेने से पंक्ति का अर्थ टूटता है और अगला सुर देर से या बेसुरा लगता है।

पश्चिमी शास्त्रीय शिक्षण में संतुलित सपोर्ट के लिए इतालवी शब्द "appoggio" (अप्पोज्जो, अर्थात "टेक लगाना") का प्रयोग होता है। सरल शब्दों में: साँस लेने के बाद गाते समय निचली पसलियों को हल्का फैला रखने की कोशिश करें, ताकि हवा एकदम से बाहर न निकल जाए। पेट की दीवार धीरे-धीरे अंदर आती है, जैसे लंबी, स्थिर "स्स्स" की आवाज़। यह दबाना या ज़ोर लगाना नहीं है — गला खुला रहता है और आवाज़ आसान लगनी चाहिए।

सबसे आम ग़लती है ज़्यादा धकेलना: बहुत बड़ी साँस भरना और फिर उसे ज़ोर से बाहर धकेलना। इससे आवाज़ दबी हुई और तेज़ हो जाती है और गला थक जाता है। लक्ष्य रखें — "पर्याप्त हवा, शांति से ख़र्च"। और तब तक मत गाइए जब तक हवा पूरी ख़त्म न हो जाए; थोड़ी हवा बचाकर रखें और अगली तय जगह पर आराम से साँस लें।

हिंदुस्तानी शिक्षा में आम तौर पर "appoggio" शब्द नहीं बोला जाता, लेकिन वही व्यावहारिक कौशल — लंबे आलाप या तान के लिए साँस का हिसाब — रियाज़ और गुरु की नक़ल से सिखाया जाता है।`,
      },
      whyItMatters:
        'Planned breathing keeps phrases musical and in tune, avoids gasping mid-word, and protects the voice from the strain of pushing out every last bit of air.',
      traditionNote:
        "'Appoggio' is a Western (Italian) pedagogy term; Hindustani teachers typically build breath stamina through long-note riyaz (kharaj and sustained Sa) and alap rather than explicit breath-support terminology. Both aim at steady, unforced airflow. This lesson's simplified explanation is not a replacement for in-person guidance.",
      demos: [
        { kind: 'drone', label: 'Tanpura drone for sustained Sa practice' },
        { kind: 'sequence', label: 'Two-breath phrase: S R G m P (breathe at the rest) P m G R S', notes: ['S', 'R', 'G', 'm', 'P', '-', '-', 'P', 'm', 'G', 'R', 'S'], bpm: 60 },
        { kind: 'note', label: 'Long Sa — aim for 10–15 steady seconds', swara: 'S', durationSec: 12 },
      ],
      guidedSteps: [
        'Stand or sit tall. Place one hand on your lower ribs and inhale silently through the nose for 4 counts; feel the ribs widen sideways.',
        'Exhale on a gentle "sss" for as long as is comfortable while trying to keep the ribs from collapsing quickly. Do not squeeze. Repeat 3 times.',
        'Open the Tanpura Drone. Sing a long Sa on "aa" at medium volume. Stop while you still have a little air left — note how many seconds it lasted.',
        'Open the Sargam Player and play "S R G m P – – P m G R S". Write a breath mark at the rest. Sing it: one breath for the ascent, a quick quiet breath at the mark, one breath for the descent.',
        'Take any Bollywood line you know. Write the lyrics down and mark breaths at commas or between thoughts — never in the middle of a word.',
        'Sing the line with your planned breaths and record it in the Recording Journal. Listen for gasps or phrases that fade out at the end.',
      ],
      independentPractice: {
        instructions:
          'Daily: 3 rounds of the 4-count inhale / long "sss" exhale, then sing the two-breath sargam phrase over the drone 5 times, keeping the ribs gently open and the throat relaxed.',
        durationMin: 10,
        tool: 'sargam',
        pattern: ['S', 'R', 'G', 'm', 'P', '-', '-', 'P', 'm', 'G', 'R', 'S'],
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Lifting the shoulders and chest when inhaling.', fix: 'Keep shoulders relaxed; think of the breath widening the lower ribs and belly. Practise in front of a mirror.' },
        { mistake: 'Taking a huge breath and pushing it out hard, making the tone loud and pressed.', fix: 'Take a comfortable, not maximal, breath and release it steadily like a gentle hiss. Volume should come from ease, not force.' },
        { mistake: 'Breathing in the middle of a word or only when completely out of air.', fix: 'Plan and mark breaths in advance at natural pauses, and leave a small reserve at the end of each phrase.' },
      ],
      quiz: [
        {
          question: 'What is a breath mark?',
          options: ['A sign to sing louder', 'A type of ornament', 'A symbol showing a planned breathing place in a phrase', 'The point where you must hold your breath'],
          answerIndex: 2,
          explanation: 'A breath mark (often a tick or comma) shows where you have planned to breathe so phrases stay musical.',
        },
        {
          question: "Which description of 'appoggio'-style support is most accurate?",
          options: ['Keeping the ribs gently expanded so air is released steadily, with a free throat', 'Squeezing the abdomen hard to push air out', 'Holding the breath before each note', 'Breathing high into the chest'],
          answerIndex: 0,
          explanation: 'Appoggio (a Western term) is a balance that slows the release of air without pushing or throat tension.',
        },
        {
          question: 'Why should you avoid singing until your lungs are completely empty?',
          options: ['It makes the drone go out of tune', 'It is forbidden in Hindustani music', 'It makes your voice deeper', 'The end of the phrase tends to become strained and the next breath becomes a gasp'],
          answerIndex: 3,
          explanation: 'Running fully empty tends to tighten the throat and pitch often sags; keeping a small reserve keeps tone and tuning steady.',
        },
        {
          question: 'Is "appoggio" a traditional Hindustani term?',
          options: ['Yes, it is from the Gwalior gharana', 'No, it is a Western (Italian) vocal-pedagogy term', 'Yes, it means meend', 'It is a raga name'],
          answerIndex: 1,
          explanation: 'Appoggio comes from Western classical pedagogy. Hindustani training builds similar breath control through riyaz and alap.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Self-reported: breath control cannot be measured by the pitch detector. Be honest with yourself.',
        items: [
          'I can inhale without lifting my shoulders.',
          'I sang the two-breath sargam phrase with a breath only at the marked rest.',
          'I marked breaths in one song line, recorded it, and heard no mid-word gasps.',
          'My throat felt relaxed, not pushed, throughout.',
        ],
      },
      videoQueries: ['breath support for singers appoggio explained simply', 'phrase breathing marks singing exercise', 'saans ka abhyas gayan riyaz breathing for singing hindi'],
      nextStep: 'Next, use this steady breath to gently explore and widen your comfortable range.',
      estMinutes: 25,
      safetyNote: 'Stop if you feel dizzy — breathe normally for a minute. Never push air hard against a tight throat.',
    },
    {
      id: 'l3-comfortable-range',
      level: 3,
      module: 'Breath & Range',
      title: 'Growing Your Comfortable Range (Sirens & SOVT)',
      objective:
        'Use sirens, lip trills and straw phonation to explore range gently and identify your comfortable low and high notes without forcing.',
      explanation: {
        hinglish: `Range matlab aapki awaaz kitne neeche se kitne upar tak ja sakti hai. Lekin hamara focus hai "comfortable range" — woh notes jo aap bina zor, bina dard, saaf aur aaram se ga sakte hain. Kabhi kabhi aap ek bahut upar ka note "cheekh" kar touch kar lete hain — woh range mein count nahi hota.

Range dheere-dheere badhti hai, hafton aur mahinon mein. Koi magic exercise ek din mein range nahi badhaati. Isliye hum gentle exercises use karenge:

1. Siren: "ng" ya "oo" par neeche se upar aur wapas, jaise ambulance ki awaaz — bina rukawat, smooth glide. Halki volume par.

2. Lip trill: honthon ko dheela chhod kar "brrr" kijiye, aur saath mein awaaz nikaaliye. Isse vocal folds par pressure balance hota hai.

3. Straw phonation: ek patli straw mein "oo" gaate hue glide kijiye. Yeh dono "semi-occluded vocal tract" (SOVT) exercises hain — Western voice science ka term, matlab muh ka raasta aadha band karke gaana. Speech therapists aur voice teachers inhe warm-up ke liye bahut use karte hain kyunki yeh gale par kam load daalte hain.

Hindustani parampara mein range ki baat saptak se hoti hai: mandra (neeche), madhya (beech), taar (upar). Hamara goal abhi madhya saptak ko solid banana aur mandra Pa se taar Sa tak aaram se pahunchna hai — har singer ka comfort alag hota hai, compare mat kijiye.

Rule simple hai: agar khaasi, kharaash, dard ya awaaz phatne lage, ruk jaiye. Zor lagana range nahi badhaata, gale ko nuksaan pahuncha sakta hai.`,
        english: `Range is the span from your lowest to highest note. What matters for singing songs is your comfortable range: the notes you can produce clearly, at moderate volume, without strain or pain. A note you can only reach by shouting does not count yet.

Comfortable range grows gradually over weeks and months as coordination improves; no exercise expands it overnight. So we use gentle tools:

1. Sirens: glide smoothly from low to high and back on "ng" or "oo", like a soft siren, without breaks or pushes.

2. Lip trills: let the lips flutter ("brrr") while you phonate and slide through your range.

3. Straw phonation: sing "oo" through a narrow straw while gliding.

Lip trills and straw work are called semi-occluded vocal tract (SOVT) exercises — a Western voice-science term meaning the mouth is partly closed. The partial closure creates back-pressure that helps the vocal folds vibrate efficiently with less effort, which is why voice teachers and speech therapists use them for warm-ups and gentle range work.

Hindustani pedagogy describes range in saptaks: mandra (lower), madhya (middle) and taar (upper). For now the goal is a solid madhya saptak and an easy path from roughly mandra Pa up to taar Sa — every voice differs, so do not compare yourself to others or to recordings in a different key.

The rule is simple: if you feel scratchiness, pain, coughing or a cracking, squeezed sound, stop and rest. Forcing does not build range; it risks injury.`,
        hindi: `रेंज (range) आपके सबसे नीचे के सुर से सबसे ऊँचे सुर तक का फैलाव है। गाने के लिए असली मायने रखती है आपकी "आरामदायक रेंज": वे सुर जो आप साफ़, मध्यम आवाज़ में, बिना तनाव या दर्द के गा सकते हैं। जो सुर सिर्फ़ चिल्लाकर पहुँचता है, वह अभी गिना नहीं जाता।

आरामदायक रेंज हफ़्तों और महीनों में धीरे-धीरे बढ़ती है, जैसे-जैसे तालमेल सुधरता है; कोई भी अभ्यास इसे रातों-रात नहीं बढ़ाता। इसलिए हम कोमल तरीक़े अपनाएँगे:

1. साइरन: "ng" या "oo" पर नीचे से ऊपर और वापस, एक हल्के साइरन की तरह, बिना रुकावट या धक्के के स्मूद ग्लाइड।

2. लिप ट्रिल: होंठों को ढीला छोड़कर "ब्र्र्र" करें और साथ में आवाज़ निकालते हुए अपनी रेंज में फिसलें।

3. स्ट्रॉ फ़ोनेशन: पतली स्ट्रॉ में "oo" गाते हुए ग्लाइड करें।

लिप ट्रिल और स्ट्रॉ वाले अभ्यास "semi-occluded vocal tract" (SOVT) अभ्यास कहलाते हैं — यह पश्चिमी वॉइस-साइंस का शब्द है, जिसका अर्थ है मुँह का रास्ता आंशिक रूप से बंद रखकर गाना। इस आंशिक बंद से पीछे की ओर हल्का दबाव बनता है जो वोकल फ़ोल्ड्स को कम मेहनत में अच्छे से कंपन करने में मदद करता है। इसीलिए वॉइस टीचर और स्पीच थेरेपिस्ट इन्हें वॉर्म-अप और कोमल रेंज अभ्यास के लिए इस्तेमाल करते हैं।

हिंदुस्तानी पद्धति में रेंज की बात सप्तक से होती है: मंद्र (नीचे), मध्य (बीच) और तार (ऊपर)। अभी लक्ष्य है मज़बूत मध्य सप्तक और लगभग मंद्र प से तार सा तक आसानी से पहुँचना — हर आवाज़ अलग होती है, इसलिए दूसरों से या किसी और स्केल की रिकॉर्डिंग से अपनी तुलना न करें।

नियम सीधा है: अगर खराश, दर्द, खाँसी, या आवाज़ फटने या दबने लगे, तो रुकिए और आराम कीजिए। ज़ोर लगाने से रेंज नहीं बढ़ती; चोट का ख़तरा बढ़ता है।`,
      },
      whyItMatters:
        'Knowing your honest comfortable range lets you choose a good Sa and song keys, and gentle range work builds flexibility without risking strain.',
      traditionNote:
        'SOVT (semi-occluded vocal tract) and sirens come from Western voice science/pedagogy. Hindustani riyaz traditionally builds range through long notes in mandra saptak (kharaj riyaz) and gradual extension of alap into taar saptak. Both approaches are gradual.',
      demos: [
        { kind: 'glide', label: 'Gentle siren up: mandra Pa to madhya Pa', from: '.P', to: 'P', durationSec: 4 },
        { kind: 'glide', label: 'Gentle siren down: madhya Pa to mandra Pa', from: 'P', to: '.P', durationSec: 4 },
        { kind: 'sequence', label: 'Five-note slide pattern for lip trills: S R G m P m G R S', notes: ['S', 'R', 'G', 'm', 'P', 'm', 'G', 'R', 'S'], bpm: 90 },
        { kind: 'compare', label: 'Range landmarks: mandra Pa vs taar Sa', a: '.P', b: "S'" },
      ],
      guidedSteps: [
        'Warm up with 1 minute of lip trills on a comfortable middle note. If lip trills are hard, gently press your cheeks with your fingertips.',
        'Open the Sargam Player and lip-trill along with "S R G m P m G R S". Then repeat on Re, then Ga (move the whole pattern up by ear) only while it stays easy.',
        'Do 5 straw sirens: sing "oo" through a straw, sliding from low to high and back. Keep volume soft.',
        'Do 5 sirens on "ng" (as in "sing") without the straw. Notice any spot where the sound wants to flip — just observe it, no forcing.',
        'Open the Pitch Matcher and gently find your lowest clear note and highest clear note. Write them in your notebook along with the date.',
        'Finish with a soft descending siren and a minute of humming to cool down.',
      ],
      independentPractice: {
        instructions:
          '5–8 minutes daily: lip trills on the five-note pattern, straw sirens and "ng" sirens at soft volume. Once a week, note your lowest and highest comfortable notes — expect slow change over weeks, not days.',
        durationMin: 8,
        tool: 'sargam',
        pattern: ['S', 'R', 'G', 'm', 'P', 'm', 'G', 'R', 'S'],
        bpm: 90,
      },
      mistakes: [
        { mistake: 'Pushing louder to reach higher notes.', fix: 'Go softer as you go higher in sirens. If a note only comes out by shouting, it is outside your current comfortable range — that is fine.' },
        { mistake: 'Measuring range by the single highest squeak you can produce.', fix: 'Count only notes you can sing clearly, comfortably and repeatably.' },
        { mistake: 'Doing range work cold or for too long.', fix: 'Always warm up with humming/lip trills first and keep range sessions short (5–10 minutes).' },
      ],
      quiz: [
        {
          question: 'Which of these is a semi-occluded vocal tract (SOVT) exercise?',
          options: ['Singing through a straw', 'Shouting "hey!"', 'Whispering', 'Clapping the taal'],
          answerIndex: 0,
          explanation: 'Straw phonation (and lip trills) partly close the vocal tract, which helps the folds vibrate efficiently with less effort.',
        },
        {
          question: 'What is the best definition of "comfortable range" for a singer?',
          options: ['Every note you can reach by any means', 'Only the madhya saptak', 'Notes you can sing clearly and repeatably without strain', 'Two octaves for everyone'],
          answerIndex: 2,
          explanation: 'Comfortable range means clear, repeatable, unstrained notes — not extreme notes reached by force.',
        },
        {
          question: 'How does range usually develop?',
          options: ['Overnight with one special exercise', 'Gradually over weeks and months with gentle, regular work', 'Only by singing very loudly', 'It never changes'],
          answerIndex: 1,
          explanation: 'Coordination and flexibility improve gradually; regular, gentle practice is the safe path.',
        },
        {
          question: 'In Hindustani terms, which saptak contains notes below madhya Sa?',
          options: ['Taar', 'Madhya', 'Ati-taar', 'Mandra'],
          answerIndex: 3,
          explanation: 'Mandra saptak is the lower octave, written with a dot before the note (e.g. .P).',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Self-reported range exploration. The goal is honest awareness, not a number to beat.',
        items: [
          'I did lip trills and straw sirens without any pain or scratchiness.',
          'I noted my lowest and highest comfortable notes with the date.',
          'I stopped and rested whenever the sound became squeezed or strained.',
        ],
      },
      videoQueries: ['straw phonation exercise for singers', 'lip trill sirens vocal warm up beginner', 'semi occluded vocal tract exercises explained'],
      nextStep: 'Next, explore what happens around the "flip" you may have noticed: chest, head, mix and smooth transitions.',
      estMinutes: 20,
      safetyNote:
        'Range work should never hurt. Stop at any pain, hoarseness, or tickle-cough. If hoarseness lasts more than two weeks, see an ENT doctor or voice specialist.',
    },

    // ───────────────────────── Module 2: Registers & Tone ─────────────────────────
    {
      id: 'l3-chest-head-mix',
      level: 3,
      module: 'Registers & Tone',
      title: 'Chest, Head, Mix & Smooth Register Transitions',
      objective:
        'Understand the Western concepts of chest voice, head voice, mix and passaggio (and how they differ from the Hindustani ideas of saptak and awaaz lagana), and move through your passaggio smoothly without forcing.',
      explanation: {
        hinglish: `Aapne shayad YouTube par suna hoga: "chest voice", "head voice", "mix". Yeh sab WESTERN vocal pedagogy ke terms hain.

Chest voice: neeche aur beech ke notes, jab awaaz bhaari aur boli jaisi lagti hai, aur chhaati mein vibration feel hoti hai. Head voice: upar ke notes, halki aur sir/chehre mein feel hone wali awaaz. Mix: dono ka balance — upar jaate hue bhi awaaz bahut patli na ho, aur bahut bhaari bhi na ho. Passaggio: woh area jahan awaaz ek register se doosre mein "switch" hoti hai — wahin aksar crack ya "flip" hota hai. Yeh naam feeling ke basis par hain; asal mein vocal folds ki thickness aur muscles ka balance badalta hai.

Ab Hindustani sangeet ki baat. Wahan "chest/head" jaise shabd traditionally use nahi hote. Wahan baat hoti hai saptak ki — mandra, madhya, taar — yeh pitch ke regions hain, register nahi. Aur ek important idea hai "awaaz lagana" — matlab awaaz ko sahi tarah se lagana/place karna, ek khuli, sthir, sur mein tiki hui awaaz jo guru se seekhi jaati hai. Har gharana ki awaaz lagane ki style alag hoti hai.

Dhyan dijiye: taar saptak ≠ head voice. Ek male singer taar Sa ko mix ya chest-dominant awaaz mein bhi ga sakta hai; ek female singer madhya saptak mein bhi head-dominant ho sakti hai. Yeh do alag frameworks hain — ek pitch ka naksha batata hai, doosra awaaz ki quality aur mechanism.

Passaggio se smoothly kaise guzrein? Neeche ki bhaari awaaz ko upar zabardasti mat kheenchiye ("pulling chest") — upar jaate hue awaaz ko thoda halka kijiye. Descending patterns (P m G R S), "oo"/"ee" jaise patle vowels, aur pehle lip trill par practice madad karte hain. Kabhi crack ho jaaye toh ghabraiye mat — yeh seekhne ka hissa hai.

Bollywood singing mein dono kaam aate hain: classical se sur aur alankaar, aur Western technique se register ko smooth rakhna.`,
        english: `You have probably heard "chest voice", "head voice" and "mix" in online singing videos. These are terms from WESTERN vocal pedagogy.

Chest voice usually describes lower and middle notes with a fuller, speech-like quality, often felt as vibration in the chest. Head voice describes higher notes with a lighter quality, often felt in the head or face. Mix is a blended coordination that lets you ascend without the sound becoming either thin and breathy or heavy and shouty. The passaggio (Italian for "passage") is the pitch area where the voice tends to shift between these coordinations — where cracks and flips often happen. The names describe sensations; physiologically, the thickness of the vibrating vocal folds and the balance of laryngeal muscles are changing.

Hindustani pedagogy traditionally does not use chest/head terms. It talks about saptaks — mandra, madhya and taar — which are pitch regions (octaves relative to Sa), not registers. It also talks about "awaaz lagana": how the voice is produced and placed — an open, steady, well-tuned sound learned by imitating the guru, with stylistic differences between gharanas.

Crucially, taar saptak is NOT the same as head voice. A male singer may sing taar Sa in a chest-dominant or mixed coordination; a female singer may already be head-dominant within madhya saptak. One framework maps pitch relative to Sa; the other describes vocal mechanism and quality. They are complementary, not interchangeable.

To move through the passaggio smoothly, do not drag the heavy lower sound upward by force ("pulling chest"); let the sound lighten slightly as you ascend. Descending patterns (P m G R S), narrower vowels like "oo" or "ee", and practising first on a lip trill all help. An occasional crack is normal — it is information, not failure.

Bollywood singing benefits from both: Hindustani training for sur, ornament and raga feel, and Western technique for smooth registration.`,
        hindi: `आपने ऑनलाइन सिंगिंग वीडियो में "chest voice", "head voice" और "mix" ज़रूर सुना होगा। ये पश्चिमी (WESTERN) वोकल शिक्षण के शब्द हैं।

चेस्ट वॉइस आम तौर पर नीचे और बीच के सुरों की भरी हुई, बोलचाल जैसी आवाज़ है, जिसका कंपन अक्सर छाती में महसूस होता है। हेड वॉइस ऊपर के सुरों की हल्की आवाज़ है, जो अक्सर सिर या चेहरे में महसूस होती है। मिक्स एक संतुलित तालमेल है जिससे ऊपर जाते हुए आवाज़ न तो पतली और साँस भरी होती है, न भारी और चिल्लाने जैसी। पसाज्जो (passaggio, इतालवी में "रास्ता") वह क्षेत्र है जहाँ आवाज़ एक तालमेल से दूसरे में बदलती है — यहीं अक्सर आवाज़ टूटती या "फ़्लिप" होती है। ये नाम अनुभूतियों पर आधारित हैं; शारीरिक रूप से कंपन करते वोकल फ़ोल्ड्स की मोटाई और गले की मांसपेशियों का संतुलन बदलता है।

हिंदुस्तानी शिक्षा में पारंपरिक रूप से चेस्ट/हेड जैसे शब्द नहीं हैं। वहाँ सप्तकों की बात होती है — मंद्र, मध्य और तार — जो सुर के क्षेत्र हैं (सा के सापेक्ष सप्तक), रजिस्टर नहीं। वहाँ "आवाज़ लगाना" की भी बात होती है: आवाज़ कैसे निकाली और लगाई जाए — एक खुली, स्थिर, सुरीली आवाज़ जो गुरु की नक़ल करके सीखी जाती है, और घरानों के बीच इसकी शैली अलग होती है।

सबसे ज़रूरी बात: तार सप्तक हेड वॉइस के बराबर नहीं है। एक पुरुष गायक तार सा को चेस्ट-प्रधान या मिक्स आवाज़ में गा सकता है; एक महिला गायिका मध्य सप्तक में ही हेड-प्रधान हो सकती है। एक ढाँचा सा के सापेक्ष सुर का नक़्शा बताता है; दूसरा आवाज़ की प्रक्रिया और गुण बताता है। दोनों एक-दूसरे के पूरक हैं, एक-दूसरे की जगह नहीं ले सकते।

पसाज्जो से स्मूद गुज़रने के लिए नीचे की भारी आवाज़ को ज़बरदस्ती ऊपर न खींचें ("pulling chest"); ऊपर जाते हुए आवाज़ को थोड़ा हल्का होने दें। उतरते पैटर्न (प म ग रे सा), "oo" या "ee" जैसे पतले स्वर, और पहले लिप ट्रिल पर अभ्यास — ये सब मदद करते हैं। कभी-कभार आवाज़ टूटना सामान्य है — यह जानकारी है, असफलता नहीं।

बॉलीवुड गायन को दोनों से फ़ायदा होता है: सुर, अलंकार और राग के भाव के लिए हिंदुस्तानी शिक्षा, और रजिस्टर को स्मूद रखने के लिए पश्चिमी तकनीक।`,
      },
      whyItMatters:
        'Clear terminology prevents confusion when you use resources from both traditions, and understanding registration helps you sing high notes without strain.',
      traditionNote:
        "Chest/head/mix/passaggio are Western pedagogy concepts, and even Western schools differ (e.g. some prefer 'modal/falsetto' or 'M1/M2' terminology). Hindustani training speaks of saptak and awaaz lagana; ideals of tone also vary between gharanas and between classical, light-classical and film styles.",
      demos: [
        { kind: 'drone', label: 'Tanpura drone' },
        { kind: 'glide', label: 'Slow glide through the middle of the range (listen for where your voice wants to shift)', from: 'S', to: "S'", durationSec: 6 },
        { kind: 'compare', label: 'Same swara name, different saptak: madhya Sa vs taar Sa', a: 'S', b: "S'" },
        { kind: 'sequence', label: 'Descending pattern for smooth transitions: P m G R S', notes: ['P', 'm', 'G', 'R', 'S'], bpm: 80 },
      ],
      guidedSteps: [
        'Speak "hey" in your normal speaking voice. Notice the vibration in your chest — this is roughly what Western teachers call chest-dominant sound.',
        'Now say a light, high "whoo" like an owl. Notice the lighter, head-felt sensation — roughly head-dominant sound.',
        'With the Tanpura Drone on, do a soft "ng" siren from Sa up toward taar Sa and back. Notice where the sound changes quality — that zone is your passaggio.',
        'Open the Virtual Keyboard and find the note where that change happens. Write down the swara name relative to your Sa.',
        'Remind yourself: that note is a register event, not a saptak boundary. Your saptaks are defined by Sa; your passaggio is defined by your voice.',
        'Sing "P m G R S" on a lip trill, then on "oo", moving the pattern up a step at a time (use the Virtual Keyboard) until its top note sits in your passaggio. Keep it soft.',
        'Gradually change the vowel from "oo" to "aa" and record one attempt in the Recording Journal; listen for clicks or sudden jumps in loudness.',
      ],
      independentPractice: {
        instructions:
          'Daily for a week: a soft "ng" siren over the drone, then 5 minutes of descending five-note patterns around your passaggio — lip trill first, then "oo", then "aa". Keep volume moderate and stop if you feel squeezing.',
        durationMin: 8,
        tool: 'sargam',
        pattern: ['P', 'm', 'G', 'R', 'S'],
        bpm: 80,
      },
      mistakes: [
        { mistake: 'Assuming taar saptak automatically means head voice.', fix: 'Saptak is a pitch region relative to Sa; register is a vocal coordination. They overlap differently for every voice.' },
        { mistake: 'Pulling chest: lifting the chin and getting louder to force the heavy sound upward.', fix: 'Keep the head level, let the sound lighten as you ascend, and use descending patterns and SOVT exercises.' },
        { mistake: 'Getting discouraged by occasional cracks.', fix: 'Cracks are normal while learning. Lighten, slow down, and return to lip trills before vowels.' },
        { mistake: 'Thinking one tradition is "right" and the other "wrong".', fix: 'Use each framework for what it describes best: Hindustani for raga, sur and ornament; Western terms for vocal mechanics.' },
      ],
      quiz: [
        {
          question: 'Which pair of terms comes from Western vocal pedagogy?',
          options: ['Chest voice and head voice', 'Mandra and taar', 'Vadi and samvadi', 'Meend and gamak'],
          answerIndex: 0,
          explanation: 'Chest/head voice are Western pedagogy terms. Mandra/taar are Hindustani saptaks; vadi/samvadi and meend/gamak are Hindustani concepts.',
        },
        {
          question: 'Is taar saptak the same thing as head voice?',
          options: ['Yes, always', 'No — saptak is a pitch region relative to Sa; head voice is a vocal coordination', 'Only for men', 'Only in Bollywood'],
          answerIndex: 1,
          explanation: 'They are different frameworks. Where registers shift depends on the individual voice, not on where Sa is.',
        },
        {
          question: 'What is the passaggio?',
          options: ['A raga for the evening', 'The highest note you can sing', 'The area where the voice transitions between registers', 'A taal with 8 beats'],
          answerIndex: 2,
          explanation: 'Passaggio is the transition zone where cracks or flips commonly occur.',
        },
        {
          question: "What does 'awaaz lagana' broadly refer to?",
          options: ['Singing as loud as possible', 'Recording your voice', 'How the voice is produced and placed, as learned in a Hindustani tradition', 'A type of taal'],
          answerIndex: 2,
          explanation: 'Awaaz lagana refers to voice production and placement in Hindustani training, often shaped by the guru and gharana.',
        },
        {
          question: 'Which approach best helps you move smoothly through the passaggio?',
          options: ['Lightening the sound and using descending patterns and narrow vowels', 'Singing louder and lifting the chin', 'Always starting from the lowest note and pushing up', 'Holding your breath'],
          answerIndex: 0,
          explanation: 'Lightening, descending patterns, narrow vowels and SOVT exercises encourage a blend; forcing causes strain and cracks.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Self-reported awareness check — the pitch detector cannot identify registers.',
        items: [
          'I can explain in my own words the difference between a saptak and a register.',
          'I found the approximate note where my voice shifts during a soft siren.',
          'I practised descending patterns around my passaggio on lip trill and on a vowel, and reviewed a recording.',
          'I did this without pushing, straining or lifting my chin.',
        ],
      },
      videoQueries: ['chest voice head voice mix explained', 'smooth register transition exercises passaggio', 'awaaz lagana hindustani classical vocal'],
      nextStep: 'Next, work on resonance and tone quality so your sound is clear and pleasant across the range.',
      estMinutes: 30,
      safetyNote: 'Never sing through pain. If your voice feels tired or hoarse after register work, rest it for the day and shorten the next session.',
    },
    {
      id: 'l3-resonance-tone',
      level: 3,
      module: 'Registers & Tone',
      title: 'Basic Resonance and Tone Quality',
      objective:
        'Use humming, "ng" and vowel shaping to find a clear, resonant tone without pressing or nasal over-placement.',
      explanation: {
        hinglish: `Resonance matlab awaaz ka "goonjna". Vocal folds jo basic awaaz banate hain, woh gale, muh aur naak ke raaste (vocal tract) mein goonj kar ameer aur clear banti hai. Achhi resonance se kam effort mein awaaz door tak jaati hai.

Kuch simple experiments:
1. Humming "mm": honth band, jaw dheela. Honthon aur naak ke aas-paas halki jhanjhanaahat (buzz) feel kijiye. Yeh "forward" sensation hai.
2. "Ng" (jaise "sing" ka end): jeebh ka peechhe ka hissa upar. Phir "ng" se "aa" kholiye — "ng-aa" — aur koshish kijiye ki woh buzz bana rahe.
3. Vowel shape: "aa" gaate waqt muh andar se thoda khula rakhiye (jaise halki jamhaai ki shuruaat), lekin zabardasti nahi.

Do common problems: (a) dabi hui awaaz — gale ko press karke "bhaari" banana; (b) bahut naak se awaaz (nasal) — jab "aa" bhi naak se nikalne lage. Test: "aa" gaate hue naak band kijiye; agar awaaz bahut badal jaye, toh zyada nasal hai (Hindi ke anunasik shabdon ko chhod kar, unke baare mein diction lesson mein baat karenge).

Hindustani gayaki mein "khuli awaaz" (open voice) ki taareef hoti hai, aur tanpura ke saath gaate hue awaaz ko tanpura ki goonj mein "milana" seekha jaata hai. Western mein "resonance", "placement", "ring" jaise words hain. Dono ka lakshya ek: saaf, sur mein, bina dabav ki awaaz.

Tone ek din mein nahi banti — roz thoda dhyan se sunna hi asli abhyas hai.`,
        english: `Resonance is how the sound made by the vocal folds is shaped and amplified by the spaces above them — the throat, mouth and nasal passages (the vocal tract). Efficient resonance gives a clear, carrying tone with less effort.

Simple explorations:
1. Hum on "mm" with relaxed lips and jaw. Notice a gentle buzz around the lips and nose — often described as "forward" sensation.
2. Sing "ng" (as at the end of "sing"), with the back of the tongue raised. Then open "ng" into "aa" ("ng-aa"), trying to keep the buzzy ease.
3. Shape the vowel: on "aa", allow some space inside the mouth, like the beginning of a gentle yawn, without forcing the jaw open or pulling the tongue back.

Two common problems: (a) a pressed or artificially darkened tone made by squeezing the throat to sound "big"; (b) excessive nasality, where even "aa" goes through the nose. Quick test: sing "aa" and gently pinch your nose; if the sound changes a lot, there is a lot of nasal airflow. (Hindi/Urdu nasal vowels are intentionally nasal — that comes in the diction lesson.)

Hindustani aesthetics praise a "khuli awaaz" (open voice) and train the ear to blend the voice with the resonance of the tanpura. Western pedagogy speaks of resonance, placement and "ring". The words differ, but the goal is the same: a clear, in-tune tone without pressure.

Tone develops slowly through attentive listening; small daily attention matters more than dramatic changes.`,
        hindi: `रेज़ोनेंस (गूँज) का अर्थ है वोकल फ़ोल्ड्स से बनी आवाज़ को उनके ऊपर की जगहें — गला, मुँह और नाक के रास्ते (वोकल ट्रैक्ट) — कैसे आकार देती और बढ़ाती हैं। अच्छी गूँज से कम मेहनत में साफ़, दूर तक जाने वाली आवाज़ मिलती है।

कुछ सरल प्रयोग:
1. ढीले होंठ और जबड़े के साथ "mm" पर गुनगुनाइए। होंठों और नाक के आसपास हल्की झनझनाहट महसूस कीजिए — इसे अक्सर "आगे की ओर" (forward) अनुभूति कहा जाता है।
2. "ng" गाइए (जैसे "sing" के अंत में), जीभ का पिछला हिस्सा ऊपर रहे। फिर "ng" को "aa" में खोलिए ("ng-aa"), और वही आसान झनझनाहट बनाए रखने की कोशिश कीजिए।
3. स्वर का आकार: "aa" पर मुँह के अंदर थोड़ी जगह बनने दीजिए, जैसे हल्की जम्हाई की शुरुआत, लेकिन जबड़े को ज़बरदस्ती खोले या जीभ को पीछे खींचे बिना।

दो आम समस्याएँ: (क) "बड़ी" आवाज़ के लिए गले को दबाकर बनाई गई भारी या दबी हुई आवाज़; (ख) ज़रूरत से ज़्यादा नाक की आवाज़, जब "aa" भी नाक से निकलने लगे। छोटा परीक्षण: "aa" गाते हुए नाक को हल्के से दबाइए; अगर आवाज़ बहुत बदल जाए, तो नाक से बहुत हवा जा रही है। (हिंदी/उर्दू के अनुनासिक स्वर जानबूझकर नाक से होते हैं — उनकी बात उच्चारण वाले पाठ में होगी।)

हिंदुस्तानी सौंदर्यबोध "खुली आवाज़" की तारीफ़ करता है और कान को आवाज़ को तानपुरे की गूँज में मिलाना सिखाता है। पश्चिमी शिक्षण रेज़ोनेंस, प्लेसमेंट और "रिंग" की बात करता है। शब्द अलग हैं, लक्ष्य एक: साफ़, सुरीली, बिना दबाव की आवाज़।

आवाज़ का रंग धीरे-धीरे, ध्यान से सुनने से बनता है; बड़े बदलावों से ज़्यादा रोज़ का थोड़ा ध्यान मायने रखता है।`,
      },
      whyItMatters:
        'Good resonance makes your voice sound fuller and clearer with less effort, which helps both tuning and vocal health.',
      traditionNote:
        "'Placement' and 'forward resonance' are Western teaching metaphors describing sensations, not literal locations of sound. Tonal ideals differ: classical gharanas, ghazal, and modern film singing each prize somewhat different tone colours.",
      demos: [
        { kind: 'drone', label: 'Tanpura drone — try to blend your hum with it' },
        { kind: 'note', label: 'Hum on Sa', swara: 'S', durationSec: 6 },
        { kind: 'sequence', label: '"ng-aa" on S G P G S', notes: ['S', 'G', 'P', 'G', 'S'], bpm: 60 },
      ],
      guidedSteps: [
        'Open the Tanpura Drone. Hum on Sa for 6–8 seconds. Feel for a buzz around your lips and nose, with a loose jaw.',
        'Sing "ng" on Sa, then open to "aa" without losing ease. Repeat 5 times.',
        'Use the Sargam Player to sing "S G P G S" on "ng-aa": start each note on "ng" and open to "aa".',
        'Do the nose-pinch test on "aa". If the sound changes a lot, lift the soft palate slightly (think of the start of a yawn) and try again.',
        'Record a hum, an "ng-aa" and a plain "aa" phrase in the Recording Journal. Compare clarity and ease.',
      ],
      independentPractice: {
        instructions:
          '5 minutes daily: humming on Sa and Pa over the drone, then "ng-aa" on S G P G S. Listen for a clear, ringing but relaxed sound.',
        durationMin: 6,
        tool: 'sargam',
        pattern: ['S', 'G', 'P', 'G', 'S'],
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Squeezing or darkening the throat to sound "deep" or "big".', fix: 'Let the size of the sound come from space and resonance, not pressure. Compare with a relaxed hum.' },
        { mistake: 'Sending every vowel through the nose.', fix: 'Use the nose-pinch test; aim for oral vowels except where the word is genuinely nasal.' },
        { mistake: 'Opening the jaw as wide as possible.', fix: 'Moderate jaw opening with inner space works better than forcing the jaw down.' },
      ],
      quiz: [
        {
          question: 'What does vocal resonance refer to?',
          options: ['How loud you can shout', 'The number of notes in a raga', 'A type of tabla stroke', 'How the vocal tract shapes and amplifies the sound from the vocal folds'],
          answerIndex: 3,
          explanation: 'Resonance is the shaping and amplification of the sound by the throat, mouth and nasal spaces.',
        },
        {
          question: 'If pinching your nose greatly changes your "aa" vowel, this suggests…',
          options: ['Perfect tone', 'A lot of nasal airflow on a vowel that should be mostly oral', 'You are in taar saptak', 'You are singing in Bhairav'],
          answerIndex: 1,
          explanation: 'Oral vowels should not change much when the nose is pinched; large changes indicate excess nasality.',
        },
        {
          question: 'A good way to make the voice sound fuller is…',
          options: ['Using space and resonance with a relaxed throat', 'Pressing the throat', 'Raising the chin', 'Singing only very softly'],
          answerIndex: 0,
          explanation: 'Fullness comes from resonance and ease, not throat pressure.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Self-reported: tone quality is judged by your ears and comfort.',
        items: [
          'I can feel a gentle buzz when humming with a loose jaw.',
          'I did the nose-pinch test and understand the difference between oral and nasal vowels.',
          'I recorded a hum and an "aa" phrase and noted which sounded clearer and easier.',
        ],
      },
      videoQueries: ['vocal resonance exercises humming ng', 'how to sing with open throat without pressing', 'khuli awaaz riyaz hindustani'],
      nextStep: 'Next, add life to your tone with dynamics and expression.',
      estMinutes: 20,
    },

    // ───────────────────────── Module 3: Expression & Diction ─────────────────────────
    {
      id: 'l3-dynamics-expression',
      level: 3,
      module: 'Expression & Diction',
      title: 'Dynamics and Expression',
      objective:
        'Control soft-to-loud changes (crescendo/decrescendo) while staying in tune, and shape phrases to express the meaning of the words.',
      explanation: {
        hinglish: `Dynamics matlab awaaz ka dheema aur tez hona. Ek hi volume par poora gaana "flat" lagta hai. Bollywood ke achhe singers har line mein chhote-chhote volume changes karte hain — kabhi dheere, kabhi khulke — taaki bhaav (emotion) aaye.

Kuch Western terms: piano (p) = dheema, forte (f) = tez, crescendo = dheere-dheere tez, decrescendo/diminuendo = dheere-dheere dheema. Hindustani mein in shabdon ki jagah aksar "bhaav", "ras", aur "kahan zor dena hai" jaisi baatein hoti hain — guru gaa kar dikhate hain.

Sabse important rule: volume badalte waqt sur nahi hilna chahiye. Bahut log tez gaate hue sharp (upar) ho jaate hain aur dheema gaate hue flat (neeche). Isliye tanpura ke saath "messa di voce" jaisi exercise karenge — ek lamba note: dheema → tez → dheema, aur sur bilkul same.

Tez gaana = chillaana nahi. Tez ke liye saans ka support aur resonance badhaiye, gala nahi dabaiye. Aur dheema gaana = saans waali, kamzor awaaz nahi — dheemi awaaz bhi focused honi chahiye.

Expression ke liye lyrics padhiye: kaun sa shabd sabse important hai? Usse thoda zyada weight dijiye. Line ke end ko aksar halka chhodna sundar lagta hai. Phrase ki "shape" socho — jaise ek lehar jo uthti hai aur girti hai.`,
        english: `Dynamics are changes in loudness. A song sung at one constant volume sounds flat; expressive film singers constantly shape lines with small swells and softenings to convey emotion.

Western musical terms: piano (p) = soft, forte (f) = loud, crescendo = gradually louder, decrescendo/diminuendo = gradually softer. Hindustani teaching tends to describe expression through bhaav (feeling) and ras (aesthetic mood) and through demonstration by the guru, rather than through dynamic markings.

The key technical rule: pitch must stay steady when volume changes. Many singers drift sharp when getting louder and flat when getting softer. We train this with a Western exercise called messa di voce: one long note that grows from soft to louder and back to soft over the drone, with the pitch unchanged.

Loud is not shouting. Increase volume with steady breath support and resonance, not throat pressure. Soft is not weak or breathy: a soft tone should still be focused and in tune.

For expression, read the lyrics first. Which word carries the meaning? Give it slightly more weight or length. Line endings often sound beautiful when released gently rather than chopped. Think of each phrase as a wave with a rise, a peak and a fall, and decide where the peak is.`,
        hindi: `डायनैमिक्स का अर्थ है आवाज़ की तीव्रता (धीमा-तेज़) में बदलाव। एक ही आवाज़ में गाया गाना सपाट लगता है; भावपूर्ण फ़िल्मी गायक हर पंक्ति को छोटे-छोटे उतार-चढ़ाव से सजाते हैं ताकि भाव आए।

पश्चिमी संगीत के शब्द: piano (p) = धीमा, forte (f) = तेज़, crescendo = धीरे-धीरे तेज़, decrescendo/diminuendo = धीरे-धीरे धीमा। हिंदुस्तानी शिक्षा में इन चिह्नों की जगह भाव और रस की बात होती है, और गुरु गाकर दिखाते हैं।

मुख्य तकनीकी नियम: आवाज़ धीमी-तेज़ होने पर सुर स्थिर रहना चाहिए। बहुत से गायक तेज़ गाते हुए ऊपर (sharp) और धीमा गाते हुए नीचे (flat) खिसक जाते हैं। इसका अभ्यास हम "messa di voce" नाम के पश्चिमी अभ्यास से करेंगे: ड्रोन के साथ एक लंबा सुर जो धीमे से थोड़ा तेज़ और फिर वापस धीमा होता है, और सुर ज़रा भी नहीं बदलता।

तेज़ गाना चिल्लाना नहीं है। आवाज़ स्थिर साँस के सहारे और गूँज से बढ़ाइए, गले के दबाव से नहीं। धीमा गाना कमज़ोर या साँस भरा नहीं है: धीमी आवाज़ भी केंद्रित और सुर में होनी चाहिए।

भाव के लिए पहले बोल पढ़िए। कौन सा शब्द अर्थ लेकर चलता है? उसे थोड़ा ज़्यादा वज़न या लंबाई दीजिए। पंक्ति का अंत अक्सर हल्के से छोड़ने पर सुंदर लगता है, काटने पर नहीं। हर फ़्रेज़ को एक लहर की तरह सोचिए — उठान, शिखर और ढलान — और तय कीजिए कि शिखर कहाँ है।`,
      },
      whyItMatters:
        'Dynamics turn correct notes into music that moves listeners — and controlling them without pitch drift is a hallmark of a skilled singer.',
      traditionNote:
        "Terms like piano, forte, crescendo and messa di voce come from Western music. Hindustani music rarely notates dynamics; expression (bhaav) is taught by demonstration and shaped by the raga's mood and the lyrics.",
      demos: [
        { kind: 'drone', label: 'Tanpura drone for messa di voce' },
        { kind: 'note', label: 'Long Pa for soft–loud–soft practice', swara: 'P', durationSec: 10 },
        { kind: 'sequence', label: 'Phrase with a peak: S R G P G R S', notes: ['S', 'R', 'G', 'P', '-', 'G', 'R', 'S'], bpm: 60 },
      ],
      guidedSteps: [
        'Open the Tanpura Drone. Sing Sa on "aa" softly for 2 seconds, grow to a comfortable medium-loud for 2 seconds, then return to soft. Repeat 3 times.',
        'Open the Pitch Matcher and repeat on Sa and Pa. Watch whether the needle moves when you get louder or softer.',
        'Sing "S R G P – G R S" with a crescendo to Pa and a decrescendo back to Sa.',
        'Pick one Bollywood line. Underline the most important word and sing it with slightly more weight; release the final word gently.',
        'Record two versions in the Recording Journal: one flat volume, one shaped. Compare which tells the story better.',
      ],
      independentPractice: {
        instructions:
          'Daily: 3 messa di voce notes (Sa, Ga, Pa) over the drone while watching the Pitch Matcher, then sing one song line with planned dynamics.',
        durationMin: 8,
        tool: 'pitch-match',
        pattern: ['S', 'G', 'P'],
      },
      mistakes: [
        { mistake: 'Going sharp when loud and flat when soft.', fix: 'Practise messa di voce with the Pitch Matcher; keep breath steady and think "same note, different size".' },
        { mistake: 'Getting louder by squeezing the throat.', fix: 'Increase airflow support and resonance; the throat stays relaxed.' },
        { mistake: 'Making soft singing breathy and unfocused.', fix: 'Keep a clear, hum-like core in soft notes.' },
      ],
      quiz: [
        {
          question: 'What does "crescendo" mean?',
          options: ['Gradually softer', 'A fast ornament', 'Gradually louder', 'A type of raga'],
          answerIndex: 2,
          explanation: 'Crescendo (Italian) means gradually getting louder.',
        },
        {
          question: 'What is the main goal of the messa di voce exercise?',
          options: ['Singing as high as possible', 'Changing loudness while keeping the pitch steady', 'Learning a raga', 'Clapping a taal'],
          answerIndex: 1,
          explanation: 'Messa di voce trains smooth loudness changes on one sustained, in-tune pitch.',
        },
        {
          question: 'How is expression usually taught in Hindustani music?',
          options: ['Through written dynamic markings', 'It is not taught', 'Only through Western terms', "Through bhaav, the raga's mood and demonstration by the guru"],
          answerIndex: 3,
          explanation: 'Hindustani music rarely notates dynamics; feeling is conveyed through demonstration and raga/lyric context.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Self-reported: the app checks pitch, but expressive shaping is judged by you.',
        items: [
          'I sang a soft–loud–soft long note and the Pitch Matcher stayed roughly steady.',
          'I recorded a song line in two versions (flat and shaped) and could hear the difference.',
          'I got louder without shouting or throat pain.',
        ],
      },
      videoQueries: ['messa di voce exercise beginner', 'singing dynamics crescendo decrescendo practice', 'gaane mein bhaav kaise laaye singing expression hindi'],
      nextStep: 'Next, shape your words clearly with Hindi/Urdu diction.',
      estMinutes: 20,
    },
    {
      id: 'l3-hindi-urdu-diction',
      level: 3,
      module: 'Expression & Diction',
      title: 'Hindi/Urdu Diction for Singing',
      objective:
        'Sing Hindi/Urdu lyrics with clear vowels, accurate consonants and correct nasalization, keeping the melody smooth.',
      explanation: {
        hinglish: `Bollywood gaane mein shabd utne hi important hain jitne sur. Saaf uchchaaran (diction) se gaana dil tak pahunchta hai.

Vowels (swar): Hindi mein chhote aur lambe vowels alag hain — "a" (kam) vs "aa" (kaam), "i" (dil) vs "ee" (jeena), "u" (tum) vs "oo" (phool). Gaane mein lamba note aksar vowel par hi tikta hai, consonant par nahi. Toh "dil" ko lamba gaate waqt "i" par tikiye, "l" ko end mein chhota sa lagaiye.

Consonants (vyanjan): Hindi mein retroflex (ट, ड — jeebh ulti) aur dental (त, द — jeebh daant ke peechhe) alag hain: "ḍaal" (डाल, shaakha) vs "daal" (दाल). Aspirated (kh, gh, th, dh, bh — hawa ke saath) aur unaspirated (k, g, t, d, b). Inhe saaf rakhiye, par bahut zor se mat thokiye — warna melody toot jaati hai.

Urdu ki awaazein: ghazal aur purane film gaanon mein "q" (qatl), "kh" (khwaab — gale ke peechhe se ख़), "gh" (ग़, ghazal), "z" (zindagi), "f" (fiza) — inka dhyan rakhiye. Lekin kuch singers aur regions inhe alag tarah bolte hain, so original recording suniye.

Nasalization (anunasik): "main" (मैं), "hain" (हैं), "kahaan" (कहाँ), "haan" (हाँ) — yahan vowel thoda naak se aata hai. Ise chandrabindu (ँ) se likhte hain; jab maatra upar ho (जैसे मैं, हैं) tab sirf bindu (ं) lagta hai. Ise poora "n" mat banaiye; bas vowel ko halka sa nasal rangiye.

Tip: pehle lyrics ko bol kar padhiye, phir dheere ek sur par "chant" kijiye, phir melody mein gaaiye.`,
        english: `In Bollywood singing, words matter as much as notes. Clear diction is a big part of how a song conveys emotion.

Vowels: Hindi distinguishes short and long vowels — "a" (kam) vs "aa" (kaam), "i" (dil) vs "ee" (jeena), "u" (tum) vs "oo" (phool). Long notes are sustained on the vowel, not the consonant. When holding "dil", stay on the "i" and place the "l" briefly at the end.

Consonants: Hindi has retroflex sounds (ट, ड — tongue tip curled back) and dental sounds (त, द — tongue against the back of the teeth), as in "ḍaal" (डाल, branch) vs "daal" (दाल, lentils). It also distinguishes aspirated (kh, gh, th, dh, bh — with a puff of air) from unaspirated (k, g, t, d, b). Keep these distinctions clear but do not hammer consonants, or the melodic line breaks.

Urdu sounds: ghazals and many film songs use sounds such as q (qatl), ḳh (ख़, as in khwaab), ġh (ग़, as in ghazal), z (zindagi) and f (fiza). Pronunciation of these varies by singer and region, so follow the original recording you are learning.

Nasalization (anunasik): in words like "main" (मैं), "hain" (हैं), "kahaan" (कहाँ), the vowel itself is nasal-coloured. It is marked with chandrabindu (ँ), or with a simple bindu (ं) when a vowel sign already sits above the line, as in मैं and हैं. Do not turn it into a full "n" consonant; just let the vowel take on a light nasal colour.

Method: speak the lyrics, then chant them on one note over the drone, then sing them on the melody. This separates "getting the words right" from "getting the notes right".`,
        hindi: `बॉलीवुड गायन में शब्द उतने ही ज़रूरी हैं जितने सुर। साफ़ उच्चारण से ही गाना भाव पहुँचा पाता है।

स्वर: हिंदी में छोटे और लंबे स्वर अलग हैं — "a" (कम) बनाम "aa" (काम), "i" (दिल) बनाम "ee" (जीना), "u" (तुम) बनाम "oo" (फूल)। लंबे सुर स्वर पर टिकते हैं, व्यंजन पर नहीं। "दिल" को लंबा गाते समय "i" पर टिकिए और "l" को अंत में छोटा सा लगाइए।

व्यंजन: हिंदी में मूर्धन्य (ट, ड — जीभ की नोक पीछे मुड़ी) और दंत्य (त, द — जीभ दाँतों के पीछे) ध्वनियाँ अलग हैं, जैसे "डाल" (शाखा) बनाम "दाल"। महाप्राण (ख, घ, थ, ध, भ — हवा के झोंके के साथ) और अल्पप्राण (क, ग, त, द, ब) भी अलग हैं। इन भेदों को साफ़ रखिए, पर व्यंजनों को ठोकिए मत, वरना धुन टूट जाती है।

उर्दू ध्वनियाँ: ग़ज़लों और बहुत से फ़िल्मी गीतों में क़ (क़त्ल), ख़ (ख़्वाब), ग़ (ग़ज़ल), ज़ (ज़िंदगी) और फ़ (फ़िज़ा) जैसी ध्वनियाँ आती हैं। अलग-अलग गायक और क्षेत्र इन्हें अलग तरह बोलते हैं, इसलिए जिस मूल रिकॉर्डिंग से सीख रहे हैं, उसी का पालन कीजिए।

अनुनासिक: "मैं", "हैं", "कहाँ" जैसे शब्दों में स्वर ख़ुद नाक के रंग में होता है। इसे चंद्रबिंदु (ँ) से लिखते हैं, और जब मात्रा पहले से ऊपर हो (जैसे मैं, हैं) तो सिर्फ़ बिंदु (ं) लगता है। इसे पूरा "न" व्यंजन मत बनाइए; बस स्वर को हल्का सा नासिक्य रंग दीजिए।

तरीक़ा: पहले बोल बोलिए, फिर ड्रोन के साथ एक सुर पर उनका पाठ (chant) कीजिए, फिर धुन में गाइए। इससे "शब्द सही करना" और "सुर सही करना" अलग-अलग हो जाते हैं।`,
      },
      whyItMatters:
        'Clear vowels and consonants make lyrics understandable and emotionally convincing, and good vowel management keeps long notes in tune.',
      traditionNote:
        'Diction norms differ between styles: khayal often stretches and abstracts syllables, thumri and ghazal emphasise poetic pronunciation, and film songs follow the lyric and the playback singer\'s style. Urdu sounds are pronounced differently by different singers; the original recording is your best guide for a specific song.',
      demos: [
        { kind: 'drone', label: 'Drone for chanting lyrics on one note' },
        { kind: 'note', label: 'Chanting note: Sa', swara: 'S', durationSec: 8 },
        { kind: 'sequence', label: 'Vowel ladder on S R G R S (aa – ee – oo – ay – oh)', notes: ['S', 'R', 'G', 'R', 'S'], bpm: 70 },
      ],
      guidedSteps: [
        'Sing the vowel ladder "aa, ee, oo, ay, oh" on Sa over the Tanpura Drone, keeping the pitch steady while the vowel changes.',
        'Practise pairs aloud: "ḍaal / daal" (डाल / दाल), "kal / khal", "dil / deel", "hai / hain". Exaggerate slightly, then relax to natural speech.',
        'Choose a Bollywood line. Speak it slowly, marking long vowels and nasal vowels in your notebook.',
        'Chant the line on Sa over the drone — same words, one note — focusing on clear vowels and gentle consonants.',
        'Now sing it on the melody. Hold long notes on the vowel and place final consonants late and lightly.',
        'Record it in the Recording Journal and ask: could a listener write the lyrics down from my recording?',
      ],
      independentPractice: {
        instructions:
          'Pick two lines from a song you love. Speak → chant on Sa → sing, every day for a week. Record day 1 and day 7 and compare clarity.',
        durationMin: 10,
        tool: 'recorder',
      },
      mistakes: [
        { mistake: 'Holding long notes on the consonant ("dilllll", "manNNN").', fix: 'Sustain the vowel; add the final consonant briefly at the end.' },
        { mistake: 'Turning nasal vowels into a full "n" sound.', fix: 'Keep nasalization as a colour on the vowel, as in natural speech.' },
        { mistake: 'Over-hitting consonants so the melody becomes choppy.', fix: 'Keep consonants crisp but quick; let the air keep flowing on the vowels.' },
      ],
      quiz: [
        {
          question: 'On which part of a syllable should a long note usually be sustained?',
          options: ['The vowel', 'The final consonant', 'The breath before it', 'The first consonant'],
          answerIndex: 0,
          explanation: 'Sustain on the vowel; consonants are placed briefly at the start and end.',
        },
        {
          question: 'What does chandrabindu (ँ) indicate in Hindi?',
          options: ['A long pause', 'A nasalized vowel', 'A retroflex consonant', 'A higher octave'],
          answerIndex: 1,
          explanation: 'Chandrabindu marks a nasalized vowel, as in "kahaan" (कहाँ) or "haan" (हाँ). (In मैं and हैं the same nasalization is written with a bindu because the vowel sign sits above the line.)',
        },
        {
          question: 'Which pair contrasts a retroflex and a dental consonant?',
          options: ['क (ka) vs ख (kha)', 'म (ma) vs न (na)', 'ट (ṭa) vs त (ta)', 'स (sa) vs श (sha)'],
          answerIndex: 2,
          explanation: 'ट is retroflex (tongue curled back), त is dental (tongue at the teeth). क/ख is unaspirated vs aspirated.',
        },
        {
          question: 'Why chant lyrics on one note before singing the melody?',
          options: ['It is the rule of every gharana', 'It raises your range', 'It separates getting the words right from getting the notes right', 'It replaces the need for a drone'],
          answerIndex: 2,
          explanation: 'Chanting lets you focus on diction first, then add melody.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Self-reported: diction is judged by listening to your recording.',
        items: [
          'I practised the speak → chant → sing method on at least two song lines.',
          'In my recording, long notes are held on vowels, not consonants.',
          'Nasal vowels sound like natural Hindi/Urdu, not like an added "n".',
        ],
      },
      videoQueries: ['hindi pronunciation for singers diction', 'urdu pronunciation for ghazal singing nukta', 'bollywood singing diction tips'],
      nextStep: 'Next, learn meend — the smooth glide that is at the heart of Indian singing.',
      estMinutes: 25,
    },

    // ───────────────────────── Module 4: Ornaments ─────────────────────────
    {
      id: 'l3-meend',
      level: 3,
      module: 'Ornaments (Alankar & Gayaki)',
      title: 'Meend — the Smooth Glide Between Notes',
      objective:
        'Sing slow, controlled meends between Sa, Ga, Pa and taar Sa, landing precisely in tune on the destination note.',
      explanation: {
        hinglish: `Meend Hindustani sangeet ki aatma jaisi hai. Meend matlab ek swar se doosre swar tak smooth, lagaataar glide — beech mein awaaz tootti nahi. Jaise sitar par taar ko kheench kar note badalte hain, waise hi awaaz bhi ek sur se doosre tak "behti" hai.

Meend aur "slide/siren" mein fark: siren warm-up hai, kahin bhi shuru, kahin bhi khatam. Meend musical hai: ek nishchit swar se shuru, raag ke hisaab se beech ke swaron ko chhoote hue (ya unhe halka sa sparsh karte hue), aur doosre nishchit swar par bilkul sur mein khatam. End note par "land" karna sabse important hai.

Meend upar ki taraf bhi hoti hai (S se G) aur neeche ki taraf bhi (P se G, G se S). Neeche ki meend aksar zyada natural lagti hai — shuru wahin se kijiye.

Kaise practice karein:
1. Pehle dono notes alag-alag tanpura ke saath ga kar sur pakkiye.
2. Phir 3-4 second mein dheere glide kijiye, "aa" par, saans ek hi.
3. End note par pahunch kar 2 second tikiye aur Pitch Matcher mein check kijiye.

Ek dhyan ki baat: raag mein meend kis raaste se jaati hai, yeh raag ka niyam batata hai. Jaise Yaman mein N se R ki taraf jaate hue Sa ko aksar chhod dete hain. Abhi hum basic meend seekh rahe hain — raag ke saath iska istemaal guru ke saath aur sun-sun kar gehra hota hai.`,
        english: `Meend is one of the most essential features of Hindustani music: a smooth, continuous glide from one swara to another without a break in the sound. Just as a sitar player pulls a string to bend from one note to another, the voice flows between pitches.

How meend differs from a warm-up siren: a siren can start and end anywhere. A meend is musical — it starts on a definite swara, passes through (or lightly touches) the intervening pitches as the raga allows, and arrives precisely in tune on a definite destination swara. Landing accurately is the whole point.

Meend can ascend (S to G) or descend (P to G, G to S). Descending meends often feel more natural, so begin there.

How to practise:
1. Sing both notes separately over the drone until each is secure.
2. Glide slowly on "aa" over 3–4 seconds in one breath.
3. Hold the destination note for 2 seconds and check it with the Pitch Matcher.

Note that a raga's grammar governs which notes a meend may emphasise or pass through — for example, in Yaman phrases moving from Ni up to Re usually skip a stressed Sa. Here we learn the basic skill; applying meend idiomatically within ragas deepens over years of listening and training with a teacher.

The app's glide demos move evenly in pitch. Real meend is more expressive — it may linger near the start, accelerate, and settle — so listen to classical vocalists too.`,
        hindi: `मींड हिंदुस्तानी संगीत की सबसे ज़रूरी विशेषताओं में से एक है: एक स्वर से दूसरे स्वर तक स्मूद, लगातार ग्लाइड, बिना आवाज़ तोड़े। जैसे सितार वादक तार खींचकर एक सुर से दूसरे सुर तक जाता है, वैसे ही आवाज़ सुरों के बीच बहती है।

मींड वॉर्म-अप साइरन से कैसे अलग है: साइरन कहीं से भी शुरू होकर कहीं भी ख़त्म हो सकता है। मींड संगीतमय है — यह एक निश्चित स्वर से शुरू होती है, राग के अनुसार बीच के सुरों से गुज़रती है (या उन्हें हल्का छूती है), और एक निश्चित गंतव्य स्वर पर बिल्कुल सुर में पहुँचती है। सही जगह उतरना ही असली बात है।

मींड ऊपर (सा से ग) भी जा सकती है और नीचे (प से ग, ग से सा) भी। उतरती मींड अक्सर ज़्यादा स्वाभाविक लगती है, इसलिए वहीं से शुरुआत कीजिए।

अभ्यास कैसे करें:
1. ड्रोन के साथ दोनों सुर अलग-अलग गाइए, जब तक दोनों पक्के न हो जाएँ।
2. "aa" पर 3–4 सेकंड में, एक साँस में, धीरे-धीरे ग्लाइड कीजिए।
3. गंतव्य सुर पर 2 सेकंड टिकिए और पिच मैचर से जाँचिए।

ध्यान दें कि मींड किन सुरों पर ज़ोर दे या किनसे गुज़रे, यह राग का व्याकरण तय करता है — जैसे यमन में नि से रे की ओर जाते हुए सा पर ज़ोर आम तौर पर नहीं दिया जाता। यहाँ हम मूल कौशल सीख रहे हैं; रागों में मींड का सही प्रयोग वर्षों के सुनने और गुरु से सीखने से गहरा होता है।

ऐप के ग्लाइड डेमो सुर में एक समान गति से चलते हैं। असली मींड ज़्यादा भावपूर्ण होती है — वह शुरुआत के पास ठहर सकती है, गति पकड़ सकती है और फिर टिक सकती है — इसलिए शास्त्रीय गायकों को भी सुनिए।`,
      },
      whyItMatters:
        'Meend gives Indian melodies their flowing, vocal character; it appears constantly in classical, ghazal and Bollywood singing.',
      traditionNote:
        'The app\'s glides are even, mechanical pitch slides — an approximation. In performance, meend shape, speed and the notes it touches depend on the raga and the singer\'s gayaki.',
      demos: [
        { kind: 'glide', label: 'Descending meend: Pa to Ga', from: 'P', to: 'G', durationSec: 3 },
        { kind: 'glide', label: 'Descending meend: Ga to Sa', from: 'G', to: 'S', durationSec: 3 },
        { kind: 'glide', label: 'Ascending meend: Sa to Ga', from: 'S', to: 'G', durationSec: 3 },
        { kind: 'glide', label: "Ascending meend: Pa to taar Sa", from: 'P', to: "S'", durationSec: 4 },
      ],
      guidedSteps: [
        'Open the Tanpura Drone. Sing Pa, then Ga, as separate held notes until both are steady.',
        'Play the "Pa to Ga" glide demo and copy it on "aa" over about 3 seconds. Hold Ga at the end.',
        'Open the Pitch Matcher and repeat, checking that your landing on Ga is within the green zone.',
        'Repeat with Ga → Sa (descending), then Sa → Ga (ascending).',
        'If Pa → taar Sa is comfortable, try it lightly; otherwise skip it for now.',
        'Record three meends in the Recording Journal and listen: is the glide continuous, and does it land in tune?',
      ],
      independentPractice: {
        instructions:
          'Daily: 5 slow meends each for P→G, G→S and S→G over the drone, checking landing notes on the Pitch Matcher.',
        durationMin: 10,
        tool: 'pitch-match',
        pattern: ['S', 'G', 'P'],
      },
      mistakes: [
        { mistake: 'Breaking the glide into steps (like a staircase).', fix: 'Keep the air flowing and slide continuously; slow down if needed.' },
        { mistake: 'Gliding past the target and correcting afterward.', fix: 'Aim for the destination before you start; slow the last part of the glide and land precisely.' },
        { mistake: 'Breathing mid-meend.', fix: 'Take a full, relaxed breath before each meend; shorten the duration if necessary.' },
      ],
      quiz: [
        {
          question: 'What is meend?',
          options: ['A smooth, continuous glide from one swara to another', 'A heavy shake between notes', 'A quick cluster of notes', 'A rhythmic cycle'],
          answerIndex: 0,
          explanation: 'Meend is a smooth, unbroken glide connecting notes.',
        },
        {
          question: 'How does a meend differ from a warm-up siren?',
          options: ['There is no difference', 'A siren is only in taar saptak', 'A meend is always fast', 'A meend starts and ends on definite swaras and must land in tune'],
          answerIndex: 3,
          explanation: 'A siren is a free exercise; a meend is a musical gesture between definite notes.',
        },
        {
          question: 'Which part of a meend is most important to get in tune?',
          options: ['The middle', 'The landing (destination) note', 'The breath', 'None — meend is never in tune'],
          answerIndex: 1,
          explanation: 'The start must be clear, but landing accurately on the destination is crucial.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Sing meends and hold the landing note; the app measures whether each landing (Sa, Ga, Pa) is in tune.',
        targets: ['S', 'G', 'P', 'G', 'S'],
        minAttempts: 10,
        minSuccessPct: 65,
        toleranceCents: 40,
      },
      videoQueries: ['meend in hindustani classical vocal lesson', 'how to sing meend glide practice', 'meend exercise for beginners hindi'],
      nextStep: 'Next, learn the faster ornaments: gamak, murki and khatka.',
      estMinutes: 25,
    },
    {
      id: 'l3-gamak-murki-khatka',
      level: 3,
      module: 'Ornaments (Alankar & Gayaki)',
      title: 'Gamak, Murki and Khatka',
      objective:
        'Recognise and slowly practise gamak, murki and khatka, understanding how they differ from each other and from meend.',
      explanation: {
        hinglish: `Meend ke baad teen aur important alankaar (ornaments):

Gamak: do swaron ke beech bhaari, zor-daar oscillation ya "shake" — jaise awaaz ek note se doosre tak baar-baar jhoolti hai, weight ke saath. Dhrupad aur khayal ki taanon mein gamak bahut sunai deti hai. Gamak heavy hoti hai, isliye gale se "jhatka" dekar mat kijiye — yeh saans aur control se aati hai, aur shuru mein bahut dheere practice hoti hai.

Murki: ek halka, tez, chhota sa notes ka guchha (cluster) — jaise ek note ke aas-paas 3-4 notes jaldi se ghoom jaate hain, bahut naazuk tareeke se. Thumri, ghazal aur Bollywood mein murki bahut common hai — Lata ji, Rafi sahab ke gaanon mein suniye.

Khatka: ek note ke aas-paas tez, zor-daar "turn" ya cluster — murki jaisa, lekin zyada force aur accent ke saath, jaise ek jhatka.

Dhyan dijiye: murki aur khatka ki definitions alag-alag gurus aur kitaabon mein thodi alag hoti hain. Kuch log khatka ko murki ka zor-daar roop kehte hain, kuch alag tarah samjhaate hain. Isliye naam se zyada zaroori hai awaaz ko sun kar pehchaanna.

App mein hum in ornaments ko "fast sequence" se approximate karte hain — asli gayaki mein swaron ke beech meend jaisi smoothness aur shading hoti hai jo machine poori tarah nahi dikha sakti. Pehle dheere (slow) practice, phir dheere-dheere speed. Speed se pehle saaf sur.`,
        english: `After meend, three more important ornaments:

Gamak: a heavy, forceful oscillation or shake between notes, where the voice swings with weight from one pitch to another. It is prominent in dhrupad and in khayal taans. Because gamak is weighty, it must not be produced by jerking the throat; it comes from controlled breath and is practised very slowly at first.

Murki: a quick, light, delicate cluster of notes — a short turn of three or four notes around a main note, sung lightly. Murkis are everywhere in thumri, ghazal and Bollywood singing.

Khatka: a quick, forceful cluster or turn around a note — similar in shape to a murki but with more force and accent, like a jolt.

Important: the definitions of murki and khatka vary between teachers and texts. Some describe khatka as a forceful murki; others draw the line differently or use the words interchangeably. Learning to recognise the sound matters more than the label.

The app approximates these ornaments as fast note sequences. Real ornaments have subtle shading and glides between notes that a synthesizer cannot fully reproduce, so treat the demos as maps, not models, and listen to real singers.

Practise slowly first and increase speed only when every note is in tune. Clean pitch before speed — always.`,
        hindi: `मींड के बाद तीन और ज़रूरी अलंकार:

गमक: सुरों के बीच भारी, ज़ोरदार आंदोलन या कंपन, जिसमें आवाज़ वज़न के साथ एक सुर से दूसरे तक झूलती है। ध्रुपद में और ख़याल की तानों में यह प्रमुखता से सुनाई देती है। क्योंकि गमक भारी होती है, इसे गले को झटका देकर नहीं निकालना चाहिए; यह नियंत्रित साँस से आती है और शुरू में बहुत धीरे अभ्यास की जाती है।

मुरकी: सुरों का एक तेज़, हल्का, नाज़ुक गुच्छा — किसी मुख्य सुर के आसपास तीन-चार सुरों का छोटा सा घुमाव, हल्केपन से गाया हुआ। ठुमरी, ग़ज़ल और बॉलीवुड गायन में मुरकियाँ हर जगह हैं।

खटका: किसी सुर के आसपास तेज़, ज़ोरदार गुच्छा या घुमाव — आकार में मुरकी जैसा, पर ज़्यादा ज़ोर और लहजे के साथ, जैसे एक झटका।

ज़रूरी बात: मुरकी और खटका की परिभाषाएँ अलग-अलग गुरुओं और किताबों में अलग हैं। कुछ खटके को ज़ोरदार मुरकी कहते हैं; कुछ इनमें अलग तरह से भेद करते हैं या दोनों शब्दों को एक ही अर्थ में इस्तेमाल करते हैं। नाम से ज़्यादा ज़रूरी है आवाज़ को सुनकर पहचानना।

ऐप इन अलंकारों को तेज़ सुर-क्रम (sequence) के रूप में दिखाता है। असली अलंकारों में सुरों के बीच बारीक रंगत और ग्लाइड होते हैं जो सिंथेसाइज़र पूरी तरह नहीं बना सकता, इसलिए डेमो को नक़्शा समझिए, आदर्श नहीं, और असली गायकों को सुनिए।

पहले धीरे अभ्यास कीजिए और गति तभी बढ़ाइए जब हर सुर सही हो। गति से पहले साफ़ सुर — हमेशा।`,
      },
      whyItMatters:
        'Ornaments give Indian melodies their characteristic beauty; recognising and gradually developing them makes your Bollywood and semi-classical singing more authentic.',
      traditionNote:
        'Definitions of murki and khatka differ between teachers, gharanas and books; gamak also has many sub-types in traditional texts. The app\'s demos are fast sequences — approximations of ornaments that in reality include glides and subtle shading.',
      demos: [
        { kind: 'sequence', label: 'Gamak approximation (slow): G R G R G R S', notes: ['G', 'R', 'G', 'R', 'G', 'R', 'S'], bpm: 120 },
        { kind: 'sequence', label: 'Murki approximation (fast, light): P m G m P — around Pa', notes: ['P', 'm', 'G', 'm', 'P', '-'], bpm: 190 },
        { kind: 'sequence', label: 'Murki practised slowly: P m G m P', notes: ['P', 'm', 'G', 'm', 'P'], bpm: 70 },
        { kind: 'sequence', label: 'Khatka approximation (fast, accented turn around Ga): m G R G', notes: ['m', 'G', 'R', 'G', '-'], bpm: 180 },
      ],
      guidedSteps: [
        'Play the slow murki demo "P m G m P" in the Sargam Player at 70 bpm and sing it on "aa" until every note is in tune.',
        'Increase to about 100 bpm, then 130 bpm, only if the notes stay clean. Then listen to the fast demo and try a light version.',
        'For khatka, sing "m G R G" slowly with a clear accent on the first note, then speed it up a little.',
        'For gamak, sing "G R G R" very slowly on "aa", letting the breath (not a throat jerk) drive each pulse. Keep it gentle.',
        'Use Ear Training-style listening: play each demo and say aloud whether it is murki, khatka or gamak.',
        'Record your slow versions in the Recording Journal and check that each note is audible and in tune.',
      ],
      independentPractice: {
        instructions:
          'Daily: murki "P m G m P" at 70 → 100 bpm, khatka "m G R G" slowly, and 1 minute of very gentle gamak on G–R. Increase speed only over weeks.',
        durationMin: 10,
        tool: 'sargam',
        pattern: ['P', 'm', 'G', 'm', 'P'],
        bpm: 70,
      },
      mistakes: [
        { mistake: 'Rushing to full speed so notes become a blur.', fix: 'Practise slowly with the Sargam Player and increase bpm only when every note is in tune.' },
        { mistake: 'Producing gamak by jerking the throat or jaw.', fix: 'Drive the oscillation with gentle breath pulses; keep jaw and neck relaxed. Stop if it feels harsh.' },
        { mistake: 'Making every murki heavy.', fix: 'Murki is light and delicate; keep volume moderate and the throat free.' },
        { mistake: 'Worrying about the exact label (murki vs khatka).', fix: 'Labels vary by teacher; focus on recognising and producing the sound cleanly.' },
      ],
      quiz: [
        {
          question: 'Which ornament is best described as a heavy oscillation/shake between notes?',
          options: ['Gamak', 'Meend', 'Murki', 'Kan swar'],
          answerIndex: 0,
          explanation: 'Gamak is the heavy, forceful oscillation between notes.',
        },
        {
          question: 'Which ornament is a quick, light, delicate cluster of notes?',
          options: ['Gamak', 'Meend', 'Murki', 'Andolan'],
          answerIndex: 2,
          explanation: 'Murki is a light, fast ornamental cluster — very common in thumri, ghazal and film songs.',
        },
        {
          question: 'Why are murki and khatka sometimes confusing?',
          options: ['They are the same as meend', 'Different teachers and texts define and distinguish them differently', 'They only exist in Western music', 'They are taals'],
          answerIndex: 1,
          explanation: 'Definitions vary; khatka is often described as a more forceful turn, but traditions differ.',
        },
        {
          question: 'What is the right way to build speed in ornaments?',
          options: ['Start at full speed', 'Sing louder', 'Skip the drone', 'Practise slowly in tune and increase speed gradually'],
          answerIndex: 3,
          explanation: 'Clean pitch at slow speed comes first; speed follows over time.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Self-reported: the pitch detector cannot reliably judge fast ornaments. Review your recording honestly.',
        items: [
          'I can sing the murki pattern "P m G m P" slowly with every note in tune.',
          'I can tell the difference between the murki, khatka and gamak demos by ear.',
          'I practised gamak gently, without throat jerking or discomfort.',
        ],
      },
      videoQueries: ['murki khatka gamak difference hindustani vocal', 'how to sing murki in bollywood songs', 'gamak practice hindustani classical beginners'],
      nextStep: 'Next, step into the world of raag — how ragas are built.',
      estMinutes: 30,
      safetyNote: 'Gamak practised with force can strain the voice. Keep it slow and gentle; stop at any hoarseness or discomfort.',
    },

    // ───────────────────────── Module 5: Raag Foundations ─────────────────────────
    {
      id: 'l3-raag-structure',
      level: 3,
      module: 'Raag Foundations',
      title: 'How a Raag Is Built',
      objective:
        'Understand thaat vs raag, aroha/avaroha, vadi/samvadi, pakad/chalan, characteristic phrases, and the traditional time and rasa associations.',
      explanation: {
        hinglish: `Raag sirf ek scale nahi hai. Scale ek list hai notes ki; raag ek "vyaktitva" (personality) hai — uske notes, unhe kis kram mein lagana hai, kaun se note important hain, kaun se phrases uski pehchaan hain, aur uska mood.

Thaat: Pandit V.N. Bhatkhande ne raagon ko 10 thaaton (parent scales) mein classify kiya — jaise Bilawal, Kalyan, Kafi, Bhairav. Thaat mein saat swar hote hain aur yeh sirf ek classification system hai. Ek thaat se kai raag bante hain. Jaise Kalyan thaat se Yaman aur Bhupali dono.

Aroha / Avaroha: raag mein upar jaane aur neeche aane ka niyam. Kabhi kuch notes chadhte waqt chhod dete hain, kabhi raasta tedha (vakra) hota hai.

Vadi / Samvadi: vadi raag ka sabse pramukh swar ("raja"), samvadi doosra sabse pramukh ("mantri"), aksar vadi se 4th ya 5th ki doori par.

Pakad / Chalan: pakad ek chhota sa phrase jisse raag pehchaan mein aata hai. Chalan raag ke chalne ka tareeka — kaun se phrases, kaise. Ek hi notes wale do raag (jaise Bhupali aur Deshkar) pakad aur chalan se alag pehchaane jaate hain.

Samay aur Ras: parampara mein raagon ko din ke samay (subah, shaam, raat) aur bhaav (ras — shaant, shringaar, karuna) se joda jaata hai. Yeh parampara aur saundarya ka hissa hai, physics ka niyam nahi — film songs aur modern concerts mein yeh aksar flexible hota hai.

Yeh lessons sirf parichay hain. Raag ko sach mein jaanne ke liye saalon tak sunna aur guru se seekhna padta hai.`,
        english: `A raag is not just a scale. A scale is a list of notes; a raag is a melodic personality: its notes, the order and paths in which they are used, which notes are emphasised, characteristic phrases, and its mood.

Thaat: Pandit V. N. Bhatkhande classified ragas into ten thaats (parent scales) such as Bilawal, Kalyan, Kafi and Bhairav. Each thaat has seven notes and serves as a classification system, not a performance practice. Many ragas belong to one thaat — Yaman and Bhupali are both placed under Kalyan, even though Bhupali uses only five notes.

Aroha / avaroha: the ascending and descending rules. Some ragas omit notes on the way up or down, and some move in zig-zag (vakra) paths.

Vadi / samvadi: the vadi is the most important note (often called the "king"), the samvadi the second most important ("minister"), usually a fourth or fifth apart.

Pakad / chalan: pakad is a short catch-phrase that identifies the raga; chalan is the raga's characteristic movement as a whole. Ragas with the same notes (e.g. Bhupali and Deshkar) are distinguished by chalan, emphasis and phrasing.

Time and rasa: tradition associates ragas with times of day (samay) and aesthetic moods (rasa). These are cultural and aesthetic conventions, not laws of physics, and modern concerts and film music often treat them flexibly.

These lessons are an introduction. Knowing a raga truly takes years of listening and guided training.`,
        hindi: `राग सिर्फ़ एक स्केल नहीं है। स्केल सुरों की सूची है; राग एक संगीतमय व्यक्तित्व है: उसके सुर, उन्हें किस क्रम और किन रास्तों से लगाया जाता है, किन सुरों पर ज़ोर है, उसके पहचान वाले वाक्यांश, और उसका भाव।

थाट: पंडित वि. ना. भातखंडे ने रागों को दस थाटों (जनक स्केल) में बाँटा, जैसे बिलावल, कल्याण, काफ़ी और भैरव। हर थाट में सात सुर होते हैं और यह वर्गीकरण की पद्धति है, प्रस्तुति का तरीक़ा नहीं। एक थाट में कई राग आते हैं — यमन और भूपाली दोनों कल्याण थाट में रखे जाते हैं, भले ही भूपाली में सिर्फ़ पाँच सुर हैं।

आरोह / अवरोह: चढ़ने और उतरने के नियम। कुछ राग चढ़ते या उतरते समय कुछ सुर छोड़ देते हैं, और कुछ टेढ़े-मेढ़े (वक्र) रास्तों से चलते हैं।

वादी / संवादी: वादी सबसे महत्वपूर्ण सुर है (अक्सर "राजा" कहा जाता है), संवादी दूसरा सबसे महत्वपूर्ण ("मंत्री"), और आम तौर पर दोनों में चौथे या पाँचवें सुर की दूरी होती है।

पकड़ / चलन: पकड़ एक छोटा वाक्यांश है जिससे राग पहचाना जाता है; चलन राग की पूरी विशिष्ट चाल है। एक जैसे सुरों वाले राग (जैसे भूपाली और देशकार) चलन, ज़ोर और वाक्यांशों से अलग पहचाने जाते हैं।

समय और रस: परंपरा रागों को दिन के समय (समय) और सौंदर्य-भाव (रस) से जोड़ती है। ये सांस्कृतिक और सौंदर्य संबंधी परंपराएँ हैं, भौतिकी के नियम नहीं, और आधुनिक संगीत सभाओं व फ़िल्म संगीत में इन्हें अक्सर लचीलेपन से लिया जाता है।

ये पाठ सिर्फ़ परिचय हैं। किसी राग को सच में जानने में वर्षों का सुनना और मार्गदर्शन में सीखना लगता है।`,
      },
      whyItMatters:
        'Knowing how ragas are structured lets you hear why melodies sound the way they do, learn ragas efficiently, and recognise raga influences in film songs.',
      traditionNote:
        'The ten-thaat system is Bhatkhande\'s 20th-century classification and does not fit every raga neatly. Vadi/samvadi assignments, pakad phrases and time associations vary between sources and gharanas; treat any single list as one reasonable version.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone' },
        { kind: 'sequence', label: 'Kalyan thaat (scale only): S R G M P D N S\'', notes: ['S', 'R', 'G', 'M', 'P', 'D', 'N', "S'"], bpm: 80 },
        { kind: 'sequence', label: 'Same thaat, different raag — Bhupali aroha: S R G P D S\'', notes: ['S', 'R', 'G', 'P', 'D', "S'"], bpm: 80 },
      ],
      guidedSteps: [
        'Play the Kalyan thaat scale in the Sargam Player. Notice the teevra Ma.',
        'Play the Bhupali aroha. Notice it uses only five of those notes — same thaat, very different raga.',
        'In your notebook, make a "raag card" template: Thaat, Aroha, Avaroha, Vadi, Samvadi, Pakad, Time, Mood, Notes on sources.',
        'Use the Virtual Keyboard to play S R G P D (Bhupali) and S R G M P D N (Yaman\'s notes) side by side.',
        'Listen to a short recorded alap of any raga (search the video queries) and try to hear which note the singer keeps returning to.',
      ],
      independentPractice: {
        instructions:
          'Fill in one raag card for Yaman and one for Bhupali as you go through the next lessons. Listen to 5 minutes of recorded classical music daily and try to notice repeated phrases.',
        durationMin: 10,
        tool: 'none',
      },
      mistakes: [
        { mistake: 'Treating a raga as just its scale.', fix: 'Learn its characteristic phrases, emphasised notes and movement, not only the notes.' },
        { mistake: 'Thinking the thaat is the raga.', fix: 'A thaat is a classification of parent scales; many ragas with different characters share one thaat.' },
        { mistake: 'Treating time-of-day rules as scientific laws.', fix: 'They are traditional aesthetic associations; respect them as culture, not physics.' },
      ],
      quiz: [
        {
          question: 'What is a thaat in the Bhatkhande system?',
          options: ['A seven-note parent scale used to classify ragas', 'A raga for the morning', 'A type of ornament', 'A rhythmic cycle'],
          answerIndex: 0,
          explanation: 'Thaats are ten seven-note parent scales used to classify ragas.',
        },
        {
          question: 'What is the vadi of a raga?',
          options: ['The lowest note', 'The most important / emphasised note', 'The last note of the avaroha', 'The tabla pattern'],
          answerIndex: 1,
          explanation: 'Vadi is the most prominent note; samvadi is the second most prominent.',
        },
        {
          question: 'Two ragas use exactly the same notes. How can they still be different ragas?',
          options: ['They cannot be different', 'Only through a different taal', 'Through different chalan, emphasis and characteristic phrases', 'Only by being sung louder'],
          answerIndex: 2,
          explanation: 'Bhupali and Deshkar, for example, share notes but differ in movement and emphasis.',
        },
        {
          question: 'How should the time-of-day associations of ragas be understood?',
          options: ['As laws of physics', 'As rules only for film music', 'As traditional aesthetic conventions, often applied flexibly today', 'They do not exist'],
          answerIndex: 2,
          explanation: 'Samay associations are cultural tradition, not physical law.',
        },
        {
          question: 'Which pair are both placed in Kalyan thaat?',
          options: ['Yaman and Bhupali', 'Bhairav and Kafi', 'Bilawal and Kafi', 'Bhairav and Yaman'],
          answerIndex: 0,
          explanation: 'Yaman and Bhupali are both classified under Kalyan thaat.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Self-reported understanding check.',
        items: [
          'I can explain the difference between a thaat and a raag.',
          'I made a raag card template with aroha, avaroha, vadi, samvadi, pakad, time and mood.',
          'I understand that sources may differ on vadi/samvadi and pakad.',
        ],
      },
      videoQueries: ['what is a raag thaat vadi samvadi explained', 'aroha avaroha pakad hindustani music basics', 'bhatkhande 10 thaat system explained'],
      nextStep: 'Next, meet your first raga: Yaman.',
      estMinutes: 25,
    },
    {
      id: 'l3-raag-yaman',
      level: 3,
      module: 'Raag Foundations',
      title: 'Raag Yaman',
      objective:
        'Sing the aroha, avaroha and a characteristic phrase of Raag Yaman in tune, with teevra Ma.',
      explanation: {
        hinglish: `Yaman aksar sabse pehle sikhaya jaane wala raag hai — aur saalon tak gaaya jaane wala bhi. Kalyan thaat ka raag, shaam/raat ke pehle prahar ka (evening) maana jaata hai.

Notes: saare swar shuddh, sirf Ma teevra (M). Yahi teevra Ma Yaman ko uski chamak deta hai.

Aroha (common version): .N R G M D N S' — dhyan dijiye, aksar shuru mein Sa ko skip karke mandra Ni se Re par jaate hain, aur Pa bhi chadhte waqt aksar chhoda jaata hai (kuch versions mein "N R G M P D N S'" bhi milta hai).
Avaroha: S' N D P M G R S.

Vadi: Ga, Samvadi: Ni (yeh sabse common maanyata hai; kuch sources alag batate hain).

Characteristic phrases (pakad/chalan): ".N R G R, .N R S", "P M G R, .N R S", "G M D N S'". ".N R G" Yaman ki ek pehchaan hai.

Yaman ki feeling: shaant, bhakti aur shringaar ka mel, khula aur ujjwal. Bahut saare film songs Yaman se prabhaavit maane jaate hain. Do jo aksar Yaman par aadhaarit bataye jaate hain: "Jab Deep Jale Aana" (Chitchor) aur "Chandan Sa Badan" (Saraswatichandra). Lekin film songs mein aksar doosre raagon ke note bhi aa jaate hain — isliye "based on / influenced by" samjhiye aur khud sun kar verify kijiye.

Teevra Ma ko dhyan se lagaiye — shuddh Ma ki aadat ki wajah se woh neeche khisak sakta hai. Pitch Matcher se check kijiye.`,
        english: `Yaman is often the first raga taught — and one musicians keep exploring for a lifetime. It belongs to Kalyan thaat and is traditionally sung in the evening (first part of the night).

Notes: all shuddh except Ma, which is teevra (M). The raised Ma gives Yaman its bright, luminous colour.

Aroha (a common version): .N R G M D N S'. Notice that the ascent often begins from mandra Ni and goes to Re, de-emphasising Sa at the start, and Pa is often skipped in the ascent. (Other books give N R G M P D N S' or S R G M P D N S'.)
Avaroha: S' N D P M G R S.

Vadi: Ga; samvadi: Ni (the most common assignment; some sources differ).

Characteristic phrases: ".N R G R, .N R S", "P M G R, .N R S", "G M D N S'". The movement ".N R G" is a strong Yaman identifier.

Mood: serene, devotional and romantic, open and bright.

Film connection: many film songs are commonly cited as based on or influenced by Yaman; two frequently cited examples are "Jab Deep Jale Aana" (Chitchor) and "Chandan Sa Badan" (Saraswatichandra). Film songs often mix ragas or add notes outside the raga, so treat these as "influenced by" rather than pure Yaman, and verify by listening.

Practice tip: teevra Ma is easy to sing flat if you are used to shuddh Ma. Check it carefully with the Pitch Matcher.`,
        hindi: `यमन अक्सर सबसे पहले सिखाया जाने वाला राग है — और ऐसा राग भी जिसे संगीतकार जीवन भर खोजते रहते हैं। यह कल्याण थाट का राग है और पारंपरिक रूप से शाम (रात के पहले प्रहर) में गाया जाता है।

सुर: मध्यम को छोड़कर सभी शुद्ध, मध्यम तीव्र (M) है। यही तीव्र म यमन को उसकी चमकीली, उजली रंगत देता है।

आरोह (एक प्रचलित रूप): .नि रे ग म॑ ध नि सां। ध्यान दें कि चढ़ाव अक्सर मंद्र नि से शुरू होकर रे पर जाता है, शुरुआत में सा पर ज़ोर नहीं होता, और आरोह में प अक्सर छोड़ा जाता है। (दूसरी किताबों में नि रे ग म॑ प ध नि सां या सा रे ग म॑ प ध नि सां भी मिलता है।)
अवरोह: सां नि ध प म॑ ग रे सा।

वादी: ग; संवादी: नि (सबसे प्रचलित मान्यता; कुछ स्रोत अलग बताते हैं)।

पहचान वाले वाक्यांश: ".नि रे ग रे, .नि रे सा", "प म॑ ग रे, .नि रे सा", "ग म॑ ध नि सां"। ".नि रे ग" की चाल यमन की मज़बूत पहचान है।

भाव: शांत, भक्ति और शृंगार से भरा, खुला और उजला।

फ़िल्म संबंध: बहुत से फ़िल्मी गीत आम तौर पर यमन पर आधारित या उससे प्रभावित बताए जाते हैं; दो अक्सर उद्धृत उदाहरण हैं "जब दीप जले आना" (चितचोर) और "चंदन सा बदन" (सरस्वतीचंद्र)। फ़िल्मी गीत अक्सर रागों को मिलाते हैं या राग से बाहर के सुर जोड़ते हैं, इसलिए इन्हें शुद्ध यमन नहीं, "यमन से प्रभावित" समझिए और सुनकर ख़ुद जाँचिए।

अभ्यास सुझाव: अगर आपको शुद्ध म की आदत है तो तीव्र म नीचे (flat) गाना आसान है। पिच मैचर से इसे ध्यान से जाँचिए।`,
      },
      whyItMatters:
        'Yaman teaches teevra Ma, the importance of phrasing over scale, and is widely heard in classical, light and film music.',
      traditionNote:
        "Vadi Ga / samvadi Ni is the most common assignment for Yaman; some texts give alternatives. Aroha versions vary (with or without Sa/Pa at the start/ascent). Yaman Kalyan, a closely related raga, adds shuddh Ma in specific descending phrases (e.g. G m G R), which pure Yaman avoids. Film examples are 'commonly cited as based on' Yaman — they may not follow raga grammar strictly.",
      demos: [
        { kind: 'drone', label: 'Tanpura drone' },
        { kind: 'sequence', label: "Yaman aroha: .N R G M D N S'", notes: ['.N', 'R', 'G', 'M', 'D', 'N', "S'"], bpm: 70 },
        { kind: 'sequence', label: "Yaman avaroha: S' N D P M G R S", notes: ["S'", 'N', 'D', 'P', 'M', 'G', 'R', 'S'], bpm: 70 },
        { kind: 'sequence', label: 'Characteristic phrase: .N R G R, .N R S', notes: ['.N', 'R', 'G', '-', 'R', '-', '.N', 'R', 'S'], bpm: 60 },
        { kind: 'compare', label: 'Shuddh Ma vs teevra Ma — Yaman uses the second', a: 'm', b: 'M' },
      ],
      guidedSteps: [
        'Play the compare demo: shuddh Ma vs teevra Ma. Sing both, then sing only teevra Ma over the Tanpura Drone.',
        'Play the Yaman aroha in the Sargam Player and sing along on sargam syllables, then on "aa".',
        'Play and sing the avaroha. Notice Pa appears in the descent.',
        'Sing the phrase ".N R G R, .N R S" slowly, letting Ga ring (it is the vadi).',
        'Open the Pitch Matcher and practise .N, R, G, M, D, N, S\' individually, especially teevra Ma.',
        'Record the aroha, avaroha and phrase in the Recording Journal. Listen for a flat M or a weak .N.',
      ],
      independentPractice: {
        instructions:
          'Daily: aroha + avaroha × 3, then the phrase ".N R G R, .N R S" × 5 over the drone. Add "P M G R, .N R S" once comfortable. Listen to one Yaman alap or bandish recording.',
        durationMin: 15,
        tool: 'sargam',
        pattern: ['.N', 'R', 'G', 'M', 'D', 'N', "S'", "S'", 'N', 'D', 'P', 'M', 'G', 'R', 'S'],
        bpm: 70,
      },
      mistakes: [
        { mistake: 'Singing shuddh Ma instead of teevra Ma.', fix: 'Compare m and M on the keyboard; tune teevra Ma with the Pitch Matcher.' },
        { mistake: 'Singing Yaman as a straight up-and-down scale.', fix: 'Use characteristic phrases like ".N R G R, .N R S" — the raga lives in its phrases.' },
        { mistake: 'Believing a film song "in Yaman" follows every rule of the raga.', fix: 'Film songs often borrow freely; say "influenced by Yaman" and verify by ear.' },
      ],
      quiz: [
        {
          question: 'Which Ma does Raag Yaman use?',
          options: ['Shuddh Ma (m)', 'Both equally', 'No Ma', 'Teevra Ma (M)'],
          answerIndex: 3,
          explanation: 'Yaman uses teevra Ma; all other notes are shuddh.',
        },
        {
          question: 'Which thaat is Yaman placed in?',
          options: ['Bilawal', 'Kalyan', 'Kafi', 'Bhairav'],
          answerIndex: 1,
          explanation: 'Yaman belongs to Kalyan thaat.',
        },
        {
          question: 'What are the commonly cited vadi and samvadi of Yaman?',
          options: ['Ga and Ni', 'Sa and Pa', 'Re and Dha', 'Ma and Sa'],
          answerIndex: 0,
          explanation: 'Ga (vadi) and Ni (samvadi) are the most common assignment, though some sources differ.',
        },
        {
          question: 'Which phrase is characteristic of Yaman?',
          options: ['S r G m d', 'S R g m P', '.N R G R, .N R S', 'S R G P D (only)'],
          answerIndex: 2,
          explanation: 'The movement from mandra Ni to Re and Ga is a classic Yaman identifier.',
        },
        {
          question: 'When is Yaman traditionally performed?',
          options: ['Early morning', 'Evening / first part of the night', 'Noon', 'Only during monsoon'],
          answerIndex: 1,
          explanation: 'Yaman is traditionally an evening raga — a convention, not a rule of nature.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the notes of Raag Yaman, including teevra Ma, within a comfortable range.',
        targets: ['.N', 'R', 'G', 'M', 'D', 'N', "S'"],
        minAttempts: 12,
        minSuccessPct: 70,
        toleranceCents: 35,
      },
      videoQueries: ['raag yaman aroha avaroha pakad for beginners', 'raag yaman alap vocal', 'bollywood songs based on raag yaman'],
      nextStep: 'Next, Raag Bhupali — five notes, same thaat, completely different feel.',
      estMinutes: 30,
    },
    {
      id: 'l3-raag-bhupali',
      level: 3,
      module: 'Raag Foundations',
      title: 'Raag Bhupali',
      objective:
        'Sing the pentatonic aroha, avaroha and a characteristic phrase of Raag Bhupali in tune.',
      explanation: {
        hinglish: `Bhupali (ya Bhoop) ek audav-audav raag hai — matlab aroha aur avaroha dono mein sirf paanch swar: S R G P D. Ma aur Ni bilkul nahi lagte. Thaat: Kalyan (classification ke hisaab se, bhale hi Ma/Ni nahi hai).

Aroha: S R G P D S'
Avaroha: S' D P G R S
Vadi: Ga, Samvadi: Dha.

Characteristic phrases: "G R S .D, S R G", "P G, D P G R S", "G P D S'". Mandra Dha (.D) se Sa par aana Bhupali mein bahut sundar lagta hai.

Bhupali ka mood: shaant, khula, prasann, bhakti-bhaav. Paramparik samay: shaam (evening).

Ek interesting baat: Raag Deshkar ke bhi yahi paanch swar hain, lekin Deshkar Bilawal thaat ka maana jaata hai aur uski chalan alag hai — usme Pa aur Dha par zyada zor, aur upar ke hisse mein zyada chalan. Isse samajh aata hai ki raag sirf notes nahi hai.

Bhupali ke paanch swar duniya bhar ke folk music mein milne wale "major pentatonic" jaise hain — isliye yeh kaan ko turant pehchaana sa lagta hai. Lekin Bhupali ki pehchaan uski chalan aur Ga ki pramukhta se hai.

Film connection: "Jyoti Kalash Chhalke" (Bhabhi Ki Chudiyan) ko aksar Bhupali par aadhaarit bataya jaata hai. Film songs mein raag mix ho sakte hain — khud sun kar verify kijiye.`,
        english: `Bhupali (also called Bhoop) is an audav–audav raga: five notes in both ascent and descent — S R G P D. Ma and Ni are omitted entirely. It is classified under Kalyan thaat.

Aroha: S R G P D S'
Avaroha: S' D P G R S
Vadi: Ga; samvadi: Dha.

Characteristic phrases: "G R S .D, S R G", "P G, D P G R S", "G P D S'". Returning to Sa from mandra Dha (.D S) is especially characteristic.

Mood: calm, open, joyful and devotional. Traditional time: evening.

An instructive comparison: Raag Deshkar uses exactly the same five notes but is placed in Bilawal thaat and has a different chalan — emphasising Pa and Dha and the upper part of the scale. This shows again that a raga is more than its notes.

Bhupali's notes correspond to the major pentatonic scale found in many musical cultures, which is why it sounds instantly familiar. What makes it Bhupali is its movement and the prominence of Ga.

Film connection: "Jyoti Kalash Chhalke" (Bhabhi Ki Chudiyan) is commonly cited as based on Bhupali. Film songs may still mix in other notes or ideas, so treat this as "based on / influenced by" and verify by listening.

Because there is no Ma or Ni, the intervals G→P and D→S' are wider jumps. Tune them carefully.`,
        hindi: `भूपाली (जिसे भूप भी कहते हैं) एक औडव–औडव राग है: आरोह और अवरोह दोनों में पाँच सुर — सा रे ग प ध। म और नि पूरी तरह वर्जित हैं। इसे कल्याण थाट में रखा जाता है।

आरोह: सा रे ग प ध सां
अवरोह: सां ध प ग रे सा
वादी: ग; संवादी: ध।

पहचान वाले वाक्यांश: "ग रे सा .ध, सा रे ग", "प ग, ध प ग रे सा", "ग प ध सां"। मंद्र ध से सा पर लौटना (.ध सा) ख़ास तौर पर विशिष्ट है।

भाव: शांत, खुला, प्रसन्न और भक्तिपूर्ण। पारंपरिक समय: शाम।

एक सीख देने वाली तुलना: राग देशकार में भी ठीक यही पाँच सुर हैं, पर उसे बिलावल थाट में रखा जाता है और उसका चलन अलग है — प और ध पर ज़ोर और सप्तक के ऊपरी हिस्से में ज़्यादा चलन। इससे फिर साबित होता है कि राग अपने सुरों से कहीं ज़्यादा है।

भूपाली के सुर कई संस्कृतियों में मिलने वाले मेजर पेंटाटोनिक स्केल जैसे हैं, इसीलिए यह तुरंत जाना-पहचाना लगता है। इसे भूपाली बनाते हैं इसकी चाल और ग की प्रमुखता।

फ़िल्म संबंध: "ज्योति कलश छलके" (भाभी की चूड़ियाँ) आम तौर पर भूपाली पर आधारित बताया जाता है। फ़िल्मी गीतों में फिर भी दूसरे सुर या विचार मिल सकते हैं, इसलिए इसे "आधारित / प्रभावित" समझिए और सुनकर जाँचिए।

क्योंकि इसमें म और नि नहीं हैं, ग→प और ध→सां बड़ी छलाँगें हैं। इन्हें ध्यान से सुर में लगाइए।`,
      },
      whyItMatters:
        'Bhupali trains secure tuning of the core swaras with wider leaps and shows how few notes can create a complete, beautiful raga.',
      traditionNote:
        'Vadi Ga / samvadi Dha is the standard assignment. Bhupali and Deshkar share notes but differ in thaat classification, emphasis and chalan; Shuddh Kalyan also shares Bhupali-like movement but adds Ma and Ni in specific ways. Film examples are cited as based on the raga and may not follow it strictly.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone' },
        { kind: 'sequence', label: "Bhupali aroha: S R G P D S'", notes: ['S', 'R', 'G', 'P', 'D', "S'"], bpm: 70 },
        { kind: 'sequence', label: "Bhupali avaroha: S' D P G R S", notes: ["S'", 'D', 'P', 'G', 'R', 'S'], bpm: 70 },
        { kind: 'sequence', label: 'Characteristic phrase: G R S .D, S R G', notes: ['G', 'R', 'S', '.D', '-', 'S', 'R', 'G'], bpm: 60 },
        { kind: 'sequence', label: 'Phrase: P G, D P G R S', notes: ['P', 'G', '-', 'D', 'P', 'G', 'R', 'S'], bpm: 60 },
      ],
      guidedSteps: [
        'Over the Tanpura Drone, sing S R G P D S\' slowly with the Sargam Player. Notice the leaps G→P and D→S\'.',
        'Sing the avaroha S\' D P G R S.',
        'Sing "G R S .D, S R G" — let the mandra Dha resolve warmly to Sa.',
        'Sing "P G, D P G R S" and let Ga ring as the vadi.',
        'Use the Pitch Matcher on each of S R G P D S\', spending extra time on Pa and Dha.',
        'Record yourself and compare with the demo. Does it sound open and calm?',
      ],
      independentPractice: {
        instructions:
          'Daily: aroha + avaroha × 3 and both phrases × 5 over the drone. Improvise very simple 4–5 note phrases using only S R G P D and return to Sa.',
        durationMin: 15,
        tool: 'sargam',
        pattern: ['S', 'R', 'G', 'P', 'D', "S'", "S'", 'D', 'P', 'G', 'R', 'S'],
        bpm: 70,
      },
      mistakes: [
        { mistake: 'Accidentally adding Ma or Ni when moving between Ga and Pa or Dha and Sa.', fix: 'Practise the leaps G→P and D→S\' slowly; hear the "gap" before singing.' },
        { mistake: 'Singing Dha flat because of the wide leap from Pa.', fix: 'Check Dha with the Pitch Matcher and sing P–D–P slowly.' },
        { mistake: 'Treating Bhupali as "just the pentatonic scale".', fix: 'Learn its phrases and Ga emphasis; compare with how Deshkar would emphasise Pa/Dha.' },
      ],
      quiz: [
        {
          question: 'Which notes does Bhupali use?',
          options: ['S R G m P D N', 'S r G m P d N', 'S R g m P D n', 'S R G P D'],
          answerIndex: 3,
          explanation: 'Bhupali is pentatonic: S R G P D, with no Ma and no Ni.',
        },
        {
          question: 'What are the vadi and samvadi of Bhupali?',
          options: ['Ga and Dha', 'Sa and Pa', 'Re and Pa', 'Ma and Sa'],
          answerIndex: 0,
          explanation: 'Ga is vadi and Dha is samvadi in Bhupali.',
        },
        {
          question: 'Which raga shares the same five notes as Bhupali but has a different chalan?',
          options: ['Yaman', 'Deshkar', 'Bhairav', 'Kafi'],
          answerIndex: 1,
          explanation: 'Deshkar uses S R G P D but emphasises Pa/Dha and moves differently.',
        },
        {
          question: 'What does "audav" mean in the context of Bhupali?',
          options: ['Seven notes', 'Six notes', 'Five notes', 'A morning raga'],
          answerIndex: 2,
          explanation: 'Audav refers to a five-note movement; Bhupali is audav in both ascent and descent.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the five notes of Raag Bhupali plus taar Sa.',
        targets: ['S', 'R', 'G', 'P', 'D', "S'"],
        minAttempts: 12,
        minSuccessPct: 70,
        toleranceCents: 35,
      },
      videoQueries: ['raag bhupali aroha avaroha pakad', 'raag bhoopali vocal alap', 'bollywood songs based on raag bhupali'],
      nextStep: 'Next, Raag Bilawal — the all-shuddh morning raga.',
      estMinutes: 30,
    },
    {
      id: 'l3-raag-bilawal',
      level: 3,
      module: 'Raag Foundations',
      title: 'Raag Bilawal',
      objective:
        'Sing Raag Bilawal\'s notes and characteristic vakra phrases, understanding why a straight shuddh scale alone is not the full raga.',
      explanation: {
        hinglish: `Bilawal thaat mein saare saat swar shuddh hain — S R G m P D N. Yahi woh scale hai jo aapne Level 1 mein sabse pehle seekha tha (Western mein ise major scale jaisa samjhiye). Bhatkhande ji ne Bilawal thaat ko shuddh thaat ki tarah standard maana.

Lekin dhyan dijiye: "S R G m P D N S'" seedha gaana Bilawal thaat ka scale hai — Raag Bilawal ki poori pehchaan nahi. Raag mein khaas tedhe (vakra) raaste hote hain. Aaj kal sabse zyada gaaya jaane wala roop Alhaiya Bilawal hai, aur kai log "Bilawal" kehte hue isi ko maante hain.

Common chalan (Alhaiya Bilawal ke hisaab se):
Aroha: S R G, R G P, D N S' — chadhte waqt Ma ko aksar halka ya chhod dete hain, aur "G m R" jaisa vakra mod aata hai.
Avaroha: S' N D P, m G m R S — utarte waqt "m G m R" jaisa mod, aur kabhi "D n D P" mein komal Ni ka sparsh (yeh Alhaiya ki khaasiyat hai).
Characteristic phrases: "G m R S", "G P D N S'", "D n D P".

Vadi: Dha, Samvadi: Ga (common maanyata; sources mein fark mil sakta hai).
Samay: subah (pehla prahar). Mood: shaant, ujjwal, prasann.

Kyunki Bilawal ke notes "normal" lagte hain, ise sach mein raag ki tarah gaana mushkil hai — sirf scale gaane se kaam nahi chalega. Isliye pehle phrases ko ratiye, phir unhe jodiye. Film songs ke liye "bollywood songs based on raag bilawal" search karke khud suniye.`,
        english: `Bilawal thaat contains all seven notes in their shuddh form — S R G m P D N — the same scale you learned first in Level 1 (comparable to the Western major scale). Bhatkhande treated Bilawal thaat as the reference "all-shuddh" thaat.

But singing "S R G m P D N S'" straight up and down is the Bilawal thaat scale, not the full Raag Bilawal. The raga has characteristic zig-zag (vakra) movements. The form most commonly performed today is Alhaiya Bilawal, which many musicians mean when they say "Bilawal".

A common chalan (following Alhaiya Bilawal):
Aroha: S R G, R G P, D N S' — Ma is often weak or skipped in the ascent, and turns like "G m R" appear.
Avaroha: S' N D P, m G m R S — with turns like "m G m R", and sometimes a touch of komal Ni in "D n D P", a hallmark of Alhaiya Bilawal.
Characteristic phrases: "G m R S", "G P D N S'", "D n D P".

Vadi: Dha; samvadi: Ga (the common assignment; sources vary).
Time: morning (first part of the day). Mood: calm, bright and cheerful.

Because Bilawal's notes sound "ordinary", it is actually subtle to sing as a raga: just running the scale will not convey it. Memorise the phrases first, then connect them.

For film connections, search "bollywood songs based on raag bilawal" and listen critically; film songs often mix ragas.`,
        hindi: `बिलावल थाट में सातों सुर शुद्ध हैं — सा रे ग म प ध नि — यही वह स्केल है जो आपने लेवल 1 में सबसे पहले सीखा था (पश्चिमी मेजर स्केल जैसा)। भातखंडे ने बिलावल थाट को "सब शुद्ध" वाला आधार थाट माना।

लेकिन "सा रे ग म प ध नि सां" सीधा ऊपर-नीचे गाना बिलावल थाट का स्केल है, पूरा राग बिलावल नहीं। राग में विशिष्ट टेढ़ी (वक्र) चालें होती हैं। आजकल सबसे ज़्यादा गाया जाने वाला रूप अल्हैया बिलावल है, और बहुत से संगीतकार "बिलावल" कहते हुए इसी को मानते हैं।

एक प्रचलित चलन (अल्हैया बिलावल के अनुसार):
आरोह: सा रे ग, रे ग प, ध नि सां — आरोह में म अक्सर कमज़ोर या छोड़ा जाता है, और "ग म रे" जैसे मोड़ आते हैं।
अवरोह: सां नि ध प, म ग म रे सा — "म ग म रे" जैसे मोड़ों के साथ, और कभी "ध नि॒ ध प" में कोमल नि का स्पर्श, जो अल्हैया बिलावल की ख़ासियत है।
पहचान वाले वाक्यांश: "ग म रे सा", "ग प ध नि सां", "ध नि॒ ध प"।

वादी: ध; संवादी: ग (प्रचलित मान्यता; स्रोतों में अंतर है)।
समय: सुबह (दिन का पहला प्रहर)। भाव: शांत, उजला और प्रसन्न।

क्योंकि बिलावल के सुर "साधारण" लगते हैं, इसे राग की तरह गाना असल में बारीक काम है: सिर्फ़ स्केल चलाने से राग नहीं आता। पहले वाक्यांश याद कीजिए, फिर उन्हें जोड़िए।

फ़िल्मी संबंधों के लिए "bollywood songs based on raag bilawal" खोजिए और ध्यान से सुनिए; फ़िल्मी गीत अक्सर रागों को मिलाते हैं।`,
      },
      whyItMatters:
        'Bilawal shows clearly that a raga is defined by its phrases, not just its scale — a crucial lesson before learning more ragas.',
      traditionNote:
        'Shuddh Bilawal and Alhaiya Bilawal are distinct ragas in Bilawal thaat; the version here follows the widely taught Alhaiya Bilawal chalan, including the occasional komal Ni in descent. Vadi/samvadi and exact aroha forms vary between texts.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone' },
        { kind: 'sequence', label: "Bilawal thaat scale (not the full raga): S R G m P D N S'", notes: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"], bpm: 80 },
        { kind: 'sequence', label: "Vakra ascent: S R G, R G P, D N S'", notes: ['S', 'R', 'G', '-', 'R', 'G', 'P', '-', 'D', 'N', "S'"], bpm: 70 },
        { kind: 'sequence', label: "Descent with turns: S' N D P, m G m R S", notes: ["S'", 'N', 'D', 'P', '-', 'm', 'G', 'm', 'R', 'S'], bpm: 70 },
        { kind: 'sequence', label: 'Alhaiya touch of komal Ni: D n D P', notes: ['D', 'n', 'D', 'P'], bpm: 60 },
      ],
      guidedSteps: [
        'Play the plain thaat scale in the Sargam Player, then the vakra ascent. Notice how the turns change the character.',
        'Sing "S R G, R G P, D N S\'" over the Tanpura Drone slowly.',
        'Sing "S\' N D P, m G m R S" and feel the turn around Ma and Ga.',
        'Sing "D n D P" gently — a brief touch of komal Ni, then back to shuddh Dha.',
        'Use the Pitch Matcher on S R G m P D N S\', giving extra attention to Dha (vadi).',
        'Record the phrases and compare with the plain scale. Does it sound like a raga now, rather than an exercise?',
      ],
      independentPractice: {
        instructions:
          'Daily: plain scale × 1, then the vakra ascent and descent × 3 each, and "G m R S" × 5. Best practised in the morning if your schedule allows — but any time is fine.',
        durationMin: 15,
        tool: 'sargam',
        pattern: ['S', 'R', 'G', '-', 'R', 'G', 'P', '-', 'D', 'N', "S'", '-', "S'", 'N', 'D', 'P', '-', 'm', 'G', 'm', 'R', 'S'],
        bpm: 70,
      },
      mistakes: [
        { mistake: 'Singing only the straight scale and calling it Raag Bilawal.', fix: 'Practise the vakra phrases; the raga lives in its turns.' },
        { mistake: 'Overusing komal Ni.', fix: 'In Alhaiya Bilawal komal Ni is a brief touch in descent (D n D P); shuddh Ni remains the main Ni.' },
        { mistake: 'Singing Ma too strongly in the ascent.', fix: 'Keep Ma light in the ascent and use it mainly in descending turns like "m G m R".' },
      ],
      quiz: [
        {
          question: 'Which notes does Bilawal thaat contain?',
          options: ['Komal Re and komal Dha', 'Teevra Ma', 'All shuddh notes', 'Komal Ga and komal Ni'],
          answerIndex: 2,
          explanation: 'Bilawal thaat is the all-shuddh thaat.',
        },
        {
          question: 'Why is singing S R G m P D N S\' not enough to present Raag Bilawal?',
          options: ['Because the raga is defined by characteristic (often vakra) phrases, not just its scale', 'Because Bilawal has no Sa', 'Because Bilawal uses teevra Ma', 'Because it must be sung at night'],
          answerIndex: 0,
          explanation: 'A thaat scale is a classification; the raga needs its phrases and emphasis.',
        },
        {
          question: 'When is Bilawal traditionally sung?',
          options: ['Midnight', 'Evening', 'Only during Holi', 'Morning'],
          answerIndex: 3,
          explanation: 'Bilawal is traditionally a morning raga.',
        },
        {
          question: 'In Alhaiya Bilawal, how is komal Ni used?',
          options: ['It replaces shuddh Ni everywhere', 'As a brief touch in descending phrases like D n D P', 'It is never used', 'Only in the ascent'],
          answerIndex: 1,
          explanation: 'Komal Ni appears briefly in descent; shuddh Ni remains primary.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the notes of Raag Bilawal (all shuddh).',
        targets: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"],
        minAttempts: 12,
        minSuccessPct: 70,
        toleranceCents: 35,
      },
      videoQueries: ['raag alhaiya bilawal aroha avaroha pakad', 'raag bilawal vocal lesson', 'bollywood songs based on raag bilawal'],
      nextStep: 'Next, Raag Kafi — komal Ga and komal Ni, beloved in folk and semi-classical music.',
      estMinutes: 30,
    },
    {
      id: 'l3-raag-kafi',
      level: 3,
      module: 'Raag Foundations',
      title: 'Raag Kafi',
      objective:
        'Sing Raag Kafi\'s aroha, avaroha and characteristic phrases with accurate komal Ga and komal Ni.',
      explanation: {
        hinglish: `Kafi thaat ke swar: S R g m P D n — yaani Ga aur Ni komal, baaki shuddh. Raag Kafi isi thaat ka ashray raag hai.

Aroha: S R g m P D n S'
Avaroha: S' n D P m g R S

Vadi: Pa, Samvadi: Sa (yeh common maanyata hai; kuch kitaabon mein alag swar bataye jaate hain).

Characteristic phrases: "S R g R, m g R S", "m P D n D P", "R g m P", "P m g R S". Aksar "R g" aur "m P" ke saath halki meend aur kan swar (chhota sa sparsh) lagte hain.

Kafi semi-classical aur lok sangeet mein bahut lokpriya hai — thumri, hori (Holi ke gaane), kajri, aur Punjabi/Sindhi sufi kalaam mein Kafi ka rang bahut milta hai. Semi-classical mein kabhi-kabhi shuddh Ga ya shuddh Ni bhi rang ke liye aa jaate hain — yeh "raag ka mishran" hai, pure khayal mein aisa kam hota hai.

Mood: shringaar, halka-phulka, kabhi karuna; folk ki mithaas. Paramparik samay aksar raat (madhya ratri) bataya jaata hai, lekin hori aur thumri mein Kafi kabhi bhi gaayi jaati hai.

Western comparison: Kafi ke notes Dorian mode jaise hain. Lekin phir se — raag sirf mode nahi hai.

Sabse common galti: komal Ga ko bahut ooncha gaana (shuddh Ga ki taraf) ya komal Ni ko shuddh Ni bana dena. Pitch Matcher se dono check kijiye. Film songs ke liye "bollywood songs based on raag kafi" search kijiye aur dhyan se suniye.`,
        english: `Kafi thaat uses S R g m P D n — komal Ga and komal Ni, with the other notes shuddh. Raag Kafi is the defining (ashray) raga of this thaat.

Aroha: S R g m P D n S'
Avaroha: S' n D P m g R S

Vadi: Pa; samvadi: Sa (a common assignment; some texts give different notes).

Characteristic phrases: "S R g R, m g R S", "m P D n D P", "R g m P", "P m g R S". Light meends and grace notes (kan swar) around R–g and m–P are typical.

Kafi is beloved in semi-classical and folk forms: thumri, hori (Holi songs), kajri and Punjabi/Sindhi Sufi kalaam often carry Kafi's colour. In lighter forms, shuddh Ga or shuddh Ni may occasionally appear for colour — a mixing that is less common in strict khayal.

Mood: romantic and playful, sometimes tender, with a folk sweetness. Its traditional time is often given as night, but hori and thumri in Kafi are sung freely.

Western comparison: Kafi's notes correspond to the Dorian mode. But again, a raga is more than a mode — its phrases and emphases matter.

The most common mistakes are singing komal Ga too high (drifting toward shuddh Ga) or replacing komal Ni with shuddh Ni out of habit. Check both carefully with the Pitch Matcher.

For film connections, search "bollywood songs based on raag kafi" and listen critically — film songs often mix ragas.`,
        hindi: `काफ़ी थाट के सुर हैं सा रे ग॒ म प ध नि॒ — कोमल ग और कोमल नि, बाकी सुर शुद्ध। राग काफ़ी इस थाट का आश्रय राग है।

आरोह: सा रे ग॒ म प ध नि॒ सां
अवरोह: सां नि॒ ध प म ग॒ रे सा

वादी: प; संवादी: सा (प्रचलित मान्यता; कुछ ग्रंथ अलग सुर बताते हैं)।

पहचान वाले वाक्यांश: "सा रे ग॒ रे, म ग॒ रे सा", "म प ध नि॒ ध प", "रे ग॒ म प", "प म ग॒ रे सा"। रे–ग॒ और म–प के आसपास हल्की मींड और कण स्वर आम हैं।

काफ़ी उपशास्त्रीय और लोक रूपों में बहुत प्रिय है: ठुमरी, होरी (होली के गीत), कजरी और पंजाबी/सिंधी सूफ़ी कलाम में अक्सर काफ़ी का रंग होता है। हल्के रूपों में कभी-कभी रंग के लिए शुद्ध ग या शुद्ध नि भी आ जाते हैं — ऐसा मिश्रण सख़्त ख़याल गायकी में कम होता है।

भाव: शृंगार और चंचलता, कभी कोमल करुणा, लोक की मिठास के साथ। इसका पारंपरिक समय अक्सर रात बताया जाता है, लेकिन काफ़ी में होरी और ठुमरी किसी भी समय गाई जाती हैं।

पश्चिमी तुलना: काफ़ी के सुर डोरियन (Dorian) मोड जैसे हैं। लेकिन फिर से — राग एक मोड से ज़्यादा है; उसके वाक्यांश और ज़ोर मायने रखते हैं।

सबसे आम ग़लतियाँ हैं कोमल ग को बहुत ऊँचा गाना (शुद्ध ग की ओर खिसकना) या आदतवश कोमल नि की जगह शुद्ध नि गाना। दोनों को पिच मैचर से ध्यान से जाँचिए।

फ़िल्मी संबंधों के लिए "bollywood songs based on raag kafi" खोजिए और ध्यान से सुनिए — फ़िल्मी गीत अक्सर रागों को मिलाते हैं।`,
      },
      whyItMatters:
        'Kafi introduces komal Ga and komal Ni, which appear in countless folk, semi-classical and film melodies.',
      traditionNote:
        'Vadi Pa / samvadi Sa is common, but some sources differ. In thumri, hori and folk-based forms Kafi is treated flexibly and may include shuddh Ga/Ni for colour; strict khayal renderings keep to the thaat notes. Time associations for Kafi are applied loosely in light-classical music.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone' },
        { kind: 'sequence', label: "Kafi aroha: S R g m P D n S'", notes: ['S', 'R', 'g', 'm', 'P', 'D', 'n', "S'"], bpm: 70 },
        { kind: 'sequence', label: "Kafi avaroha: S' n D P m g R S", notes: ["S'", 'n', 'D', 'P', 'm', 'g', 'R', 'S'], bpm: 70 },
        { kind: 'sequence', label: 'Phrase: S R g R, m g R S', notes: ['S', 'R', 'g', 'R', '-', 'm', 'g', 'R', 'S'], bpm: 60 },
        { kind: 'compare', label: 'Komal Ga vs shuddh Ga', a: 'g', b: 'G' },
        { kind: 'compare', label: 'Komal Ni vs shuddh Ni', a: 'n', b: 'N' },
      ],
      guidedSteps: [
        'Play both compare demos and sing komal Ga and komal Ni over the Tanpura Drone until they feel familiar.',
        'Sing the aroha and avaroha with the Sargam Player at 70 bpm.',
        'Sing "S R g R, m g R S" slowly, adding a gentle meend from R to g.',
        'Sing "m P D n D P" — let komal Ni be a gentle, slightly melancholic colour.',
        'Use the Pitch Matcher on g and n especially; then on all Kafi notes.',
        'Record a phrase sequence and listen for a komal Ga that creeps sharp.',
      ],
      independentPractice: {
        instructions:
          'Daily: aroha + avaroha × 3, the two phrases × 5, then hum along to a hori or thumri recording in Kafi (search the video queries).',
        durationMin: 15,
        tool: 'sargam',
        pattern: ['S', 'R', 'g', 'm', 'P', 'D', 'n', "S'", "S'", 'n', 'D', 'P', 'm', 'g', 'R', 'S'],
        bpm: 70,
      },
      mistakes: [
        { mistake: 'Komal Ga drifting toward shuddh Ga.', fix: 'Use the compare demo and Pitch Matcher; think "lower and softer" for g.' },
        { mistake: 'Habitually singing shuddh Ni instead of komal Ni.', fix: 'Practise "D n D P" slowly until komal Ni feels natural.' },
        { mistake: 'Assuming every Kafi-flavoured song is pure Raag Kafi.', fix: 'Folk and film songs often mix notes; describe them as "Kafi-influenced".' },
      ],
      quiz: [
        {
          question: 'Which notes are komal in Raag Kafi?',
          options: ['Ga and Ni', 'Re and Dha', 'Only Ni', 'Ma'],
          answerIndex: 0,
          explanation: 'Kafi uses komal Ga and komal Ni; other notes are shuddh.',
        },
        {
          question: 'Which forms commonly use Kafi?',
          options: ['Only dhrupad', 'Only morning bhajans', 'Thumri, hori and folk-based songs', 'Western opera only'],
          answerIndex: 2,
          explanation: 'Kafi is very popular in semi-classical and folk forms such as thumri and hori.',
        },
        {
          question: 'Which Western mode has the same notes as Kafi thaat?',
          options: ['Ionian (major)', 'Dorian', 'Phrygian', 'Lydian'],
          answerIndex: 1,
          explanation: 'Dorian has the same intervals: minor 3rd and minor 7th with major 2nd and 6th.',
        },
        {
          question: 'What is the commonly cited vadi of Kafi?',
          options: ['Ga', 'Re', 'Dha', 'Pa'],
          answerIndex: 3,
          explanation: 'Pa is commonly given as vadi (with Sa as samvadi), though sources vary.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the notes of Raag Kafi, including komal Ga and komal Ni.',
        targets: ['S', 'R', 'g', 'm', 'P', 'D', 'n', "S'"],
        minAttempts: 12,
        minSuccessPct: 70,
        toleranceCents: 35,
      },
      videoQueries: ['raag kafi aroha avaroha pakad', 'raag kafi hori thumri vocal', 'bollywood songs based on raag kafi'],
      nextStep: 'Next, Raag Bhairav — a solemn morning raga with andolan on komal Re and Dha.',
      estMinutes: 30,
    },
    {
      id: 'l3-raag-bhairav',
      level: 3,
      module: 'Raag Foundations',
      title: 'Raag Bhairav',
      objective:
        'Sing Raag Bhairav\'s notes with komal Re and komal Dha, a characteristic phrase, and a gentle andolan.',
      explanation: {
        hinglish: `Bhairav Bhairav thaat ka ashray raag hai, aur subah (pratah kaal, suryoday ke aas-paas) ka sabse prasiddh raag maana jaata hai. Mood: gambhir, bhakti-bhaav, shaant.

Swar: S r G m P d N — Re aur Dha komal, baaki shuddh.
Aroha: S r G m P d N S'
Avaroha: S' N d P m G r S
Vadi: komal Dha, Samvadi: komal Re.

Characteristic phrase: "G m d, d P, G m r, r S" — yahan komal Dha aur komal Re par thoda tikna, aur unhe halka sa jhulana.

Andolan: Bhairav ki jaan. Andolan matlab ek swar par dheema, halka sa jhoolna (gentle, slow oscillation) — gamak jaisa bhaari nahi, bahut naazuk. Bhairav mein komal Re aur komal Dha par andolan hota hai, aur paramparik roop se in swaron ko thoda aur neecha (ati-komal jaisa) lagaya jaata hai. App ka synthesizer equal temperament mein bajata hai, isliye yeh shruti ka fark aur andolan poori tarah nahi dikha sakta — isliye asli gaayakon ko zaroor suniye.

Ek dhyan ki baat: Bhairav mein komal Re ke saath shuddh Ga aur komal Dha ke saath shuddh Ni — yeh bade intervals (r→G aur d→N) hain. Inhe saaf aur sur mein gaana practice maangta hai.

Film connection: "Jago Mohan Pyare" (Jagte Raho) ko aksar Bhairav par aadhaarit bataya jaata hai. Phir bhi, film songs mein raag ka mishran ho sakta hai — khud suniye aur verify kijiye. Dhyan rahe: Ahir Bhairav aur Bairagi Bhairav alag raag hain.`,
        english: `Bhairav is the defining (ashray) raga of Bhairav thaat and among the best-known morning ragas, traditionally sung around dawn. Its mood is serious, devotional and meditative.

Notes: S r G m P d N — komal Re and komal Dha, the rest shuddh.
Aroha: S r G m P d N S'
Avaroha: S' N d P m G r S
Vadi: komal Dha; samvadi: komal Re.

Characteristic phrase: "G m d, d P, G m r, r S" — dwelling on komal Dha and komal Re, with a gentle sway.

Andolan is central to Bhairav: a slow, gentle oscillation on a note — far lighter and slower than gamak. In Bhairav, komal Re and komal Dha are sung with andolan, and traditionally they are intoned slightly lower than the equal-tempered pitch (sometimes described as "ati-komal"). The app's synthesizer uses equal temperament and cannot reproduce this shruti nuance or a true andolan, so listen to real vocalists.

Notice the wide intervals r→G and d→N (each three semitones). Singing them cleanly takes deliberate practice.

Film connection: "Jago Mohan Pyare" (Jagte Raho) is commonly cited as based on Bhairav. Film songs can still mix in other ideas, so verify by listening. Note that Ahir Bhairav and Bairagi Bhairav are different ragas from Bhairav, though related by name.

Because this lesson's pitch check uses equal temperament with a tolerance window, it measures approximate note matching only — not the refined intonation of a trained Bhairav.`,
        hindi: `भैरव, भैरव थाट का आश्रय राग है और सुबह के सबसे प्रसिद्ध रागों में से एक है, जिसे पारंपरिक रूप से भोर के आसपास गाया जाता है। इसका भाव गंभीर, भक्तिपूर्ण और ध्यानमय है।

सुर: सा रे॒ ग म प ध॒ नि — कोमल रे और कोमल ध, बाकी शुद्ध।
आरोह: सा रे॒ ग म प ध॒ नि सां
अवरोह: सां नि ध॒ प म ग रे॒ सा
वादी: कोमल ध; संवादी: कोमल रे।

पहचान वाला वाक्यांश: "ग म ध॒, ध॒ प, ग म रे॒, रे॒ सा" — कोमल ध और कोमल रे पर ठहरते हुए, हल्के झूले के साथ।

आंदोलन भैरव की जान है: किसी सुर पर धीमा, कोमल झूलना — गमक से कहीं हल्का और धीमा। भैरव में कोमल रे और कोमल ध पर आंदोलन होता है, और पारंपरिक रूप से इन्हें इक्वल टेम्परामेंट वाले सुर से थोड़ा नीचे लगाया जाता है (जिसे कभी "अति-कोमल" कहा जाता है)। ऐप का सिंथेसाइज़र इक्वल टेम्परामेंट में बजता है और यह श्रुति की बारीकी या असली आंदोलन नहीं बना सकता, इसलिए असली गायकों को सुनिए।

रे॒→ग और ध॒→नि की बड़ी दूरी पर ध्यान दीजिए (हर एक तीन सेमीटोन)। इन्हें साफ़ गाने के लिए सोच-समझकर अभ्यास चाहिए।

फ़िल्म संबंध: "जागो मोहन प्यारे" (जागते रहो) आम तौर पर भैरव पर आधारित बताया जाता है। फ़िल्मी गीतों में फिर भी दूसरे विचार मिल सकते हैं, इसलिए सुनकर जाँचिए। ध्यान रहे कि अहीर भैरव और बैरागी भैरव, नाम से जुड़े होने के बावजूद, भैरव से अलग राग हैं।

क्योंकि इस पाठ की पिच जाँच इक्वल टेम्परामेंट और एक सहनशीलता सीमा (tolerance) पर चलती है, यह सिर्फ़ अनुमानित सुर-मिलान मापती है — प्रशिक्षित भैरव की बारीक स्वर-लगाव को नहीं।`,
      },
      whyItMatters:
        'Bhairav introduces komal Re and komal Dha, andolan, and the concept of shruti nuance — all essential to the expressive depth of Hindustani music.',
      traditionNote:
        'Vadi komal Dha / samvadi komal Re is the standard assignment. The lowered intonation of r and d and the andolan on them are traditional features that equal-tempered playback can only approximate. Pakad versions differ between texts.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone' },
        { kind: 'sequence', label: "Bhairav aroha: S r G m P d N S'", notes: ['S', 'r', 'G', 'm', 'P', 'd', 'N', "S'"], bpm: 60 },
        { kind: 'sequence', label: "Bhairav avaroha: S' N d P m G r S", notes: ["S'", 'N', 'd', 'P', 'm', 'G', 'r', 'S'], bpm: 60 },
        { kind: 'sequence', label: 'Characteristic phrase: G m d, d P, G m r, r S', notes: ['G', 'm', 'd', '-', 'd', 'P', '-', 'G', 'm', 'r', '-', 'r', 'S'], bpm: 50 },
        { kind: 'note', label: 'Long komal Dha — the app plays it steady; practise a slow, gentle andolan (sway) on it yourself', swara: 'd', durationSec: 6 },
        { kind: 'compare', label: 'Komal Re vs shuddh Re', a: 'r', b: 'R' },
      ],
      guidedSteps: [
        'Play the compare demo; sing komal Re and shuddh Re over the Tanpura Drone and feel the difference.',
        'Sing the aroha slowly with the Sargam Player at 60 bpm. Pay special attention to r→G and d→N.',
        'Sing the avaroha.',
        'Sing "G m d, d P, G m r, r S", holding d and r slightly longer.',
        'Try a very gentle, slow sway on komal Dha — barely moving — then settle on it. Do not shake heavily.',
        'Use the Pitch Matcher on S r G m P d N S\' and record the phrase in the Recording Journal.',
      ],
      independentPractice: {
        instructions:
          'Daily (ideally in the morning): aroha + avaroha × 3, the characteristic phrase × 5 slowly, and 2 minutes of listening to a Bhairav alap.',
        durationMin: 15,
        tool: 'sargam',
        pattern: ['S', 'r', 'G', 'm', 'P', 'd', 'N', "S'", "S'", 'N', 'd', 'P', 'm', 'G', 'r', 'S'],
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Singing komal Re or komal Dha too high (toward shuddh).', fix: 'Use the compare demo and Pitch Matcher; traditionally these sit low, never high.' },
        { mistake: 'Turning andolan into a heavy gamak.', fix: 'Andolan is slow and gentle — a sway, not a shake.' },
        { mistake: 'Confusing Bhairav with Ahir Bhairav.', fix: 'Ahir Bhairav uses komal Ni and shuddh Dha; Bhairav uses komal Dha and shuddh Ni.' },
      ],
      quiz: [
        {
          question: 'Which notes are komal in Raag Bhairav?',
          options: ['Re and Dha', 'Ga and Ni', 'Only Ni', 'Re, Ga, Dha and Ni'],
          answerIndex: 0,
          explanation: 'Bhairav uses komal Re and komal Dha with shuddh Ga, Ma and Ni.',
        },
        {
          question: 'What is andolan?',
          options: ['A fast cluster of notes', 'A slow, gentle oscillation on a note', 'A heavy shake between two notes', 'A rhythmic cycle'],
          answerIndex: 1,
          explanation: 'Andolan is a gentle sway on a note — much lighter and slower than gamak.',
        },
        {
          question: 'When is Bhairav traditionally sung?',
          options: ['Late evening', 'Midnight', 'Around dawn / early morning', 'Afternoon'],
          answerIndex: 2,
          explanation: 'Bhairav is a classic dawn raga by tradition.',
        },
        {
          question: 'What are the vadi and samvadi of Bhairav?',
          options: ['Ga and Ni', 'Pa and Sa', 'Komal Dha and komal Re', 'Ma and Sa'],
          answerIndex: 2,
          explanation: 'Komal Dha (vadi) and komal Re (samvadi) is the standard assignment.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the notes of Raag Bhairav in equal temperament (approximate — the traditional lower intonation of r and d is not measured).',
        targets: ['S', 'r', 'G', 'm', 'P', 'd', 'N', "S'"],
        minAttempts: 12,
        minSuccessPct: 65,
        toleranceCents: 40,
      },
      videoQueries: ['raag bhairav aroha avaroha pakad andolan', 'raag bhairav vocal alap morning', 'bollywood songs based on raag bhairav'],
      nextStep: 'Next, use these ragas to begin simple alap.',
      estMinutes: 30,
    },
    {
      id: 'l3-simple-alap',
      level: 3,
      module: 'Raag Foundations',
      title: 'Your First Simple Alap',
      objective:
        'Sing a slow, free-rhythm alap over the drone, starting from Sa, using "aa", within the notes of Yaman or Bhupali.',
      explanation: {
        hinglish: `Alap raag ki dheemi, bina taal ki (free rhythm) khoj hai. Gaayak tanpura ke saath Sa se shuru karke, swar-swar raag ko kholta hai — jaise ek-ek kamra dekhte hue ghar mein ghoomna.

Simple alap ke niyam (hamare abhyas ke liye):
1. Sa se shuru, Sa par khatam. Har phrase ke baad Sa par lautna.
2. Vowel "aa" (aakaar). Muh khula, gala dheela.
3. Dheere-dheere badhiye: pehle sirf S, R, .N; phir G tak; phir P tak; aur jab comfortable ho tab taar Sa tak.
4. Har nayi note par thoda tikiye, phir meend se neeche lautiye.
5. Koi taal nahi, koi jaldi nahi. Saans ke hisaab se phrases.

Example (Bhupali): "S — R — S, .D S — R G — R S, G P — G R S". Example (Yaman): ".N R S, .N R G — R S, G M G R — .N R S".

Asli classical alap bahut gehra hota hai — usme raag ki poori grammar, vadi-samvadi ka istemaal, alag-alag stages (vilambit badhat), aur saalon ki training hoti hai. Yahan hum sirf pehla kadam rakh rahe hain: drone ke saath sukoon se, sur mein, raag ke notes mein ghoomna.

Galti ho toh koi baat nahi — alap mein "galat" se zyada zaroori hai sunna. Apne aap ko record kijiye aur suniye: kya main Sa par wapas sur mein aata hoon? Kya phrases mein saans ka hisaab theek hai?`,
        english: `Alap is the slow, unmetered (free-rhythm) exploration of a raga. Over the tanpura, the singer begins from Sa and unfolds the raga note by note — like walking through a house, room by room.

Rules for our simple alap practice:
1. Begin on Sa and end on Sa. Return to Sa after each phrase.
2. Use the vowel "aa" (aakaar) with an open, relaxed mouth and throat.
3. Expand gradually: first only S, R and mandra Ni or Dha; then up to Ga; then Pa; and only when comfortable, up to taar Sa.
4. Pause briefly on each new note, then return with a meend.
5. No taal, no hurry. Shape phrases around your breath.

Example (Bhupali): "S — R — S, .D S — R G — R S, G P — G R S".
Example (Yaman): ".N R S, .N R G — R S, G M G R — .N R S".

Real classical alap is far deeper: it embodies the raga's full grammar, the use of vadi and samvadi, a structured gradual expansion (badhat), and years of training. This is a first step: moving calmly, in tune, within a raga's notes over the drone.

Mistakes are fine — in alap, listening matters more than perfection. Record yourself and ask: do I return to Sa in tune? Are my phrases shaped by planned breaths? Do I stay within the raga's notes?`,
        hindi: `आलाप राग की धीमी, बिना ताल की (मुक्त लय) खोज है। तानपुरे के साथ गायक सा से शुरू करके, सुर-दर-सुर राग को खोलता है — जैसे एक-एक कमरा देखते हुए घर में घूमना।

हमारे सरल आलाप अभ्यास के नियम:
1. सा से शुरू और सा पर ख़त्म। हर वाक्यांश के बाद सा पर लौटिए।
2. खुले, ढीले मुँह और गले के साथ "aa" स्वर (आकार) का प्रयोग कीजिए।
3. धीरे-धीरे बढ़िए: पहले सिर्फ़ सा, रे और मंद्र नि या ध; फिर ग तक; फिर प तक; और आराम हो तभी तार सा तक।
4. हर नए सुर पर थोड़ा ठहरिए, फिर मींड के साथ लौटिए।
5. कोई ताल नहीं, कोई जल्दी नहीं। वाक्यांश अपनी साँस के हिसाब से बनाइए।

उदाहरण (भूपाली): "सा — रे — सा, .ध सा — रे ग — रे सा, ग प — ग रे सा"।
उदाहरण (यमन): ".नि रे सा, .नि रे ग — रे सा, ग म॑ ग रे — .नि रे सा"।

असली शास्त्रीय आलाप कहीं ज़्यादा गहरा होता है: उसमें राग का पूरा व्याकरण, वादी-संवादी का प्रयोग, क्रमबद्ध धीमा विस्तार (बढ़त) और वर्षों का प्रशिक्षण होता है। यह पहला क़दम है: ड्रोन के साथ शांति से, सुर में, राग के सुरों में घूमना।

ग़लतियाँ ठीक हैं — आलाप में पूर्णता से ज़्यादा सुनना ज़रूरी है। ख़ुद को रिकॉर्ड कीजिए और पूछिए: क्या मैं सुर में सा पर लौटता हूँ? क्या मेरे वाक्यांश तय साँसों के हिसाब से बने हैं? क्या मैं राग के सुरों के अंदर रहता हूँ?`,
      },
      whyItMatters:
        'Alap builds sur, breath, meend and raga feel all at once, and trains you to sing expressively without leaning on rhythm or lyrics.',
      traditionNote:
        'This is a simplified, beginner\'s alap exercise. Formal alap follows raga grammar closely and develops through structured stages; styles of alap differ across gharanas and between dhrupad and khayal.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone — the foundation of alap' },
        { kind: 'sequence', label: 'Bhupali alap idea: S R S, .D S R G R S', notes: ['S', '-', 'R', '-', 'S', '-', '.D', 'S', '-', 'R', 'G', '-', 'R', 'S'], bpm: 45 },
        { kind: 'sequence', label: 'Yaman alap idea: .N R S, .N R G R S', notes: ['.N', 'R', 'S', '-', '.N', 'R', 'G', '-', 'R', 'S'], bpm: 45 },
        { kind: 'glide', label: 'Returning meend: Ga to Sa', from: 'G', to: 'S', durationSec: 3 },
      ],
      guidedSteps: [
        'Open the Tanpura Drone. Listen for 30 seconds, then sing a long Sa on "aa".',
        'Choose Bhupali or Yaman. Sing phrases using only Sa, Re and mandra Dha/Ni, always returning to Sa.',
        'Add Ga. Rest on it briefly, then meend back to Sa.',
        'Add Pa only when the lower phrases feel secure. Keep each phrase within one comfortable breath.',
        'Record a 2–3 minute alap in the Recording Journal.',
        'Listen back: mark one phrase you liked and one where Sa was out of tune. Be kind — this is a first step.',
      ],
      independentPractice: {
        instructions:
          'Every other day: a 3–5 minute alap over the drone in Bhupali or Yaman, expanding one note further only when the previous range feels secure. Record once a week.',
        durationMin: 10,
        tool: 'drone',
      },
      mistakes: [
        { mistake: 'Rushing through all the notes in the first minute.', fix: 'Expand slowly — the beauty of alap is in patience.' },
        { mistake: 'Accidentally adding notes outside the raga (e.g. Ma in Bhupali).', fix: 'Play the raga\'s notes on the Virtual Keyboard before starting and keep phrases short.' },
        { mistake: 'Falling into a rhythmic pulse as if singing a song.', fix: 'Let notes last as long as feels natural; vary lengths deliberately.' },
      ],
      quiz: [
        {
          question: 'What is alap?',
          options: ['A slow, free-rhythm exploration of a raga', 'A fast taan', 'A tabla composition', 'A Western warm-up'],
          answerIndex: 0,
          explanation: 'Alap is unmetered, gradual exploration of the raga, usually over the drone.',
        },
        {
          question: 'In our simple alap, where should each phrase return?',
          options: ['Taar Sa', 'Pa', 'Anywhere', 'Sa'],
          answerIndex: 3,
          explanation: 'Returning to Sa anchors each phrase and trains tuning.',
        },
        {
          question: 'Which vowel is traditionally used for alap practice (aakaar)?',
          options: ['"ee"', '"aa"', '"oo"', '"mm"'],
          answerIndex: 1,
          explanation: 'Aakaar means singing on the open "aa" vowel.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Self-reported, with a recording. The app cannot judge raga correctness in free alap.',
        items: [
          'I sang a 2–3 minute alap over the drone, starting and ending on Sa.',
          'I stayed within the notes of the raga I chose.',
          'I recorded it, listened back, and noted one strength and one thing to improve.',
        ],
      },
      videoQueries: ['simple alap for beginners hindustani vocal', 'aakaar alap practice tanpura', 'raag bhupali alap beginner'],
      nextStep: 'Next, apply your ear to learning song melodies.',
      estMinutes: 25,
    },

    // ───────────────────────── Module 6: Musicianship ─────────────────────────
    {
      id: 'l3-learning-by-ear',
      level: 3,
      module: 'Musicianship',
      title: 'Learning Melodies by Ear',
      objective:
        'Learn a short melody by ear using chunking, humming before words, and converting phrases into sargam.',
      explanation: {
        hinglish: `Hindustani parampara mein sangeet hamesha "sun kar" seekha gaya hai — guru gaate hain, shishya dohraata hai. Bollywood gaane bhi zyaadatar log kaan se hi seekhte hain. Lekin "bas sunte raho" se zyada achha hai ek system.

1. Chunking: poore gaane ko ek saath mat seekhiye. 2-4 second ke chhote tukde (chunk) banaiye — ek line ya aadhi line.
2. Humming pehle: shabdon ke bina pehle melody ko "mm" ya "la" par gungunaiye. Shabd dimag ka dhyan khinchte hain; pehle sur pakkiye.
3. Sargam-izing: ab woh chunk kaun se swaron mein hai? Apna Sa (song ke key ka Sa) tanpura ya keyboard se dhundhiye, phir har note ko sargam naam dijiye. Virtual Keyboard par try kijiye — sahi lage toh likh lijiye.
4. Shabd jodna: jab melody pakki ho, tab lyrics daaliye (diction lesson yaad kijiye).
5. Jodna (chaining): chunk 1 + chunk 2, phir 1+2+3...

Gaane ka Sa kaise dhundhein? Aksar gaane ki line jis note par "aaram" se khatam hoti hai, woh Sa hota hai. Keyboard par try kijiye.

Shuru mein yeh slow lagega — ek line ki sargam nikaalne mein 10 minute bhi lag sakte hain. Yeh normal hai. Ear Training tool ke saath roz thoda abhyas karne se dheere-dheere tez hoga. Isse aapko gaane ke raag-prabhaav bhi samajh aane lagenge.`,
        english: `Hindustani music has always been taught orally: the guru sings, the student repeats. Most people also learn Bollywood songs by ear. But a method works much better than "just listening again and again".

1. Chunk it: don't learn the whole song at once. Break it into chunks of 2–4 seconds — a line or half-line.
2. Hum first: hum the melody on "mm" or "la" without words. Lyrics compete for your attention; secure the tune first.
3. Sargam-ize it: which swaras is this chunk using? Find the song's Sa with the drone or keyboard, then name each note in sargam. Test your guesses on the Virtual Keyboard and write them down when they match.
4. Add words: once the melody is secure, add the lyrics (apply what you learned about diction).
5. Chain: chunk 1 + chunk 2, then 1 + 2 + 3, and so on.

Finding the song's Sa: phrases often come to rest comfortably on Sa. Try candidate notes on the keyboard until one feels like "home". If the song's key is too high or low for you, transpose by choosing your own Sa and singing the same sargam.

At first this is slow — working out one line in sargam may take ten minutes. That is normal. Regular practice with Ear Training makes it faster, and sargam-izing songs will also help you recognise raga influences in film music.`,
        hindi: `हिंदुस्तानी संगीत हमेशा मौखिक रूप से सिखाया गया है: गुरु गाते हैं, शिष्य दोहराता है। ज़्यादातर लोग बॉलीवुड गाने भी कान से ही सीखते हैं। लेकिन "बार-बार बस सुनते रहने" से एक तरीक़ा कहीं बेहतर काम करता है।

1. टुकड़े कीजिए: पूरा गाना एक साथ मत सीखिए। उसे 2–4 सेकंड के टुकड़ों में बाँटिए — एक पंक्ति या आधी पंक्ति।
2. पहले गुनगुनाइए: बिना शब्दों के "mm" या "la" पर धुन गुनगुनाइए। बोल आपका ध्यान खींचते हैं; पहले धुन पक्की कीजिए।
3. सरगम में बदलिए: यह टुकड़ा किन स्वरों में है? ड्रोन या कीबोर्ड से गाने का सा ढूँढिए, फिर हर सुर को सरगम का नाम दीजिए। अपने अनुमान वर्चुअल कीबोर्ड पर जाँचिए और मेल खाने पर लिख लीजिए।
4. शब्द जोड़िए: धुन पक्की होने पर बोल जोड़िए (उच्चारण के पाठ में जो सीखा, उसे लागू कीजिए)।
5. जोड़ते जाइए: टुकड़ा 1 + टुकड़ा 2, फिर 1 + 2 + 3, और इसी तरह।

गाने का सा ढूँढना: वाक्यांश अक्सर आराम से सा पर आकर रुकते हैं। कीबोर्ड पर संभावित सुर आज़माइए जब तक कोई "घर" जैसा न लगे। अगर गाने का स्केल आपके लिए बहुत ऊँचा या नीचा है, तो अपना सा चुनकर वही सरगम गाइए — यही ट्रांसपोज़ करना है।

शुरू में यह धीमा लगेगा — एक पंक्ति की सरगम निकालने में दस मिनट भी लग सकते हैं। यह सामान्य है। ईयर ट्रेनिंग के साथ नियमित अभ्यास से यह तेज़ होगा, और गानों को सरगम में बदलने से आपको फ़िल्मी संगीत में रागों का प्रभाव पहचानने में भी मदद मिलेगी।`,
      },
      whyItMatters:
        'Learning efficiently by ear lets you pick up any song accurately, transpose it to your key, and connect film melodies to the swaras and ragas you are learning.',
      demos: [
        { kind: 'drone', label: 'Drone to find "home" (Sa)' },
        { kind: 'sequence', label: 'Sample 4-bar melody to learn by ear (chunk 1)', notes: ['S', 'R', 'G', '-', 'G', 'P', 'G', 'R'], bpm: 90 },
        { kind: 'sequence', label: 'Sample 4-bar melody (chunk 2)', notes: ['G', 'R', 'S', '-', 'R', '.N', 'S', '-'], bpm: 90 },
        { kind: 'taal', label: 'Keharwa for keeping time while singing the melody', taal: 'keharwa', bpm: 90, cycles: 4 },
      ],
      guidedSteps: [
        'Play chunk 1 of the sample melody (without looking at the notes). Hum it back 3 times.',
        'Try to name each note in sargam; check your guess on the Virtual Keyboard.',
        'Repeat for chunk 2, then chain chunks 1 + 2 and sing them with the Keharwa demo in Metronome & Taal.',
        'Now pick a simple Bollywood line. Find its Sa on the keyboard, chunk it, hum it, then sargam-ize it in your notebook.',
        'Add lyrics only after the melody is secure.',
        'Do 5 minutes of Ear Training to strengthen interval recognition.',
      ],
      independentPractice: {
        instructions:
          'Learn one 4-bar melody (from a song you like) this week by ear: chunk → hum → sargam → words → chain. Write the sargam down and sing it with the Sargam Player to check.',
        durationMin: 15,
        tool: 'ear-training',
      },
      mistakes: [
        { mistake: 'Trying to learn a whole song in one go.', fix: 'Chunk it into 2–4 second pieces and chain them.' },
        { mistake: 'Learning words and melody at the same time.', fix: 'Hum the melody first; add lyrics later.' },
        { mistake: 'Singing in the original key even when it is too high or low.', fix: 'Choose your own Sa and sing the same sargam — that is what transposing means.' },
      ],
      quiz: [
        {
          question: 'What is "chunking" when learning a melody?',
          options: ['Breaking the melody into short pieces and learning them one at a time', 'Singing loudly', 'Adding ornaments', 'Changing the raga'],
          answerIndex: 0,
          explanation: 'Chunking divides a melody into small, manageable pieces.',
        },
        {
          question: 'Why hum a melody before adding words?',
          options: ['Humming is required by tradition', 'Humming raises your range', 'Lyrics compete for attention; humming secures the tune first', 'It is faster to forget words'],
          answerIndex: 2,
          explanation: 'Separating tune from text makes each easier to learn.',
        },
        {
          question: 'A song is too high for you. What can you do?',
          options: ['Strain to reach it', 'Choose a lower Sa and sing the same sargam (transpose)', 'Skip the high notes', 'Sing it an octave higher'],
          answerIndex: 1,
          explanation: 'Transposing to your own Sa keeps the melody intact and comfortable.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Self-reported: confirm you completed the by-ear process.',
        items: [
          'I learned the sample melody by ear and checked it on the Virtual Keyboard.',
          'I wrote down the sargam of at least one line from a real song.',
          'I can sing a 4-bar melody learned by ear in my own key, in time with Keharwa.',
        ],
      },
      videoQueries: ['how to learn songs by ear singing', 'find sargam notes of bollywood song by ear', 'ear training for singers hindustani sargam'],
      nextStep: 'Next, sing with instrumental accompaniment and review your recordings.',
      estMinutes: 30,
    },
    {
      id: 'l3-accompaniment-and-review',
      level: 3,
      module: 'Musicianship',
      title: 'Singing with Accompaniment & Reviewing Your Recordings',
      objective:
        'Stay in tune and in time with instrumental accompaniment (drone, keyboard, taal) and use the Recording Journal to review practice constructively.',
      explanation: {
        hinglish: `Akele gaana aur instrument ke saath gaana — dono alag skills hain. Instrument ke saath aapko sunna bhi padta hai aur gaana bhi.

Accompaniment ke saath sur mein rehne ke tips:
1. Tanpura/drone sabse pehla saathi hai — woh Sa aur Pa deta hai. Isse "mila kar" gaaiye.
2. Harmonium/keyboard melody ke saath: shuru mein instrument ke saath unison mein gaaiye, phir instrument ki volume kam kijiye, aur aakhir mein sirf drone ke saath.
3. Taal: Metronome & Taal se Keharwa ya Dadra lagaiye. Sam (pehla beat) par dhyan rakhiye — phrase aksar sam par aakar milta hai.
4. Ek kaan instrument par, ek apni awaaz par — headphones ek kaan par hi lagaiye, taaki apni awaaz bhi sun sakein.
5. Karaoke tracks: gaane ka key apne Sa se milaiye; agar zaroorat ho to track ko transpose kijiye.

Recording Journal: har hafte kam se kam ek recording. Sunte waqt kya dhyan dein:
- Sur: Sa, lambe notes, phrase ke end — kya woh sur mein hain?
- Laya: kya main taal ke saath hoon ya aage/peechhe?
- Saans: kahin gasp ya phrase ka toot jaana?
- Tone aur diction: awaaz dabi hui toh nahi? Shabd saaf hain?

Aur sabse zaroori: apne aap par meherbaan rahiye. Apni recorded awaaz sabko pehle ajeeb lagti hai. Har recording mein ek achhi cheez aur ek sudhaar ki cheez likhiye — bas. Purani recordings se tulna kijiye, doosre singers se nahi.`,
        english: `Singing alone and singing with instruments are different skills: with accompaniment you must listen and sing at the same time.

Staying in tune and time with accompaniment:
1. The tanpura/drone is your first partner — it supplies Sa and Pa. Blend with it.
2. With a melody instrument (harmonium/keyboard), first sing in unison with it, then lower its volume, and finally sing with drone only.
3. For rhythm, use Metronome & Taal with Keharwa or Dadra. Track the sam (first beat): phrases often resolve on sam.
4. Keep one ear on the instrument and one on yourself — e.g. one headphone off — so you can hear your own pitch.
5. With karaoke tracks, match the song key to your Sa or transpose the track.

Recording Journal — record at least once a week. When listening back, check:
- Pitch: are Sa, long notes and phrase endings in tune?
- Rhythm: are you with the taal, rushing or dragging?
- Breath: any gasps or broken phrases?
- Tone and diction: pressed or clear? Are words understandable?

Most importantly, be kind to yourself. Nearly everyone finds their recorded voice strange at first, because you normally hear yourself partly through bone conduction. For each recording, write one thing that went well and one thing to improve — that's enough. Compare with your own earlier recordings, not with professional singers.`,
        hindi: `अकेले गाना और वाद्यों के साथ गाना अलग-अलग कौशल हैं: संगत के साथ आपको एक ही समय में सुनना और गाना दोनों पड़ता है।

संगत के साथ सुर और लय में रहने के लिए:
1. तानपुरा/ड्रोन आपका पहला साथी है — वह सा और प देता है। उसके साथ अपनी आवाज़ मिलाइए।
2. धुन बजाने वाले वाद्य (हारमोनियम/कीबोर्ड) के साथ पहले उसके साथ एक सुर में (unison) गाइए, फिर उसकी आवाज़ कम कीजिए, और अंत में सिर्फ़ ड्रोन के साथ गाइए।
3. लय के लिए मेट्रोनोम और ताल में कहरवा या दादरा लगाइए। सम (पहली मात्रा) पर ध्यान रखिए: वाक्यांश अक्सर सम पर आकर मिलते हैं।
4. एक कान वाद्य पर और एक अपनी आवाज़ पर रखिए — जैसे एक हेडफ़ोन हटा दीजिए — ताकि अपना सुर सुन सकें।
5. कराओके ट्रैक के साथ गाने का स्केल अपने सा से मिलाइए या ट्रैक को ट्रांसपोज़ कीजिए।

रिकॉर्डिंग जर्नल — हफ़्ते में कम से कम एक बार रिकॉर्ड कीजिए। सुनते समय जाँचिए:
- सुर: क्या सा, लंबे सुर और वाक्यांशों के अंत सुर में हैं?
- लय: क्या आप ताल के साथ हैं, या आगे भाग रहे हैं या पीछे खिंच रहे हैं?
- साँस: कहीं हाँफना या वाक्यांश का टूटना?
- आवाज़ और उच्चारण: दबी हुई या साफ़? क्या शब्द समझ आते हैं?

सबसे ज़रूरी, अपने प्रति दयालु रहिए। लगभग हर किसी को अपनी रिकॉर्ड की गई आवाज़ शुरू में अजीब लगती है, क्योंकि आम तौर पर आप अपनी आवाज़ कुछ हद तक हड्डियों के ज़रिए (bone conduction) सुनते हैं। हर रिकॉर्डिंग के लिए एक अच्छी बात और एक सुधार की बात लिखिए — बस इतना काफ़ी है। अपनी पुरानी रिकॉर्डिंग से तुलना कीजिए, पेशेवर गायकों से नहीं।`,
      },
      whyItMatters:
        'Real singing happens with accompaniment, and honest, kind self-review is the fastest way to improve between lessons.',
      traditionNote:
        'In Hindustani tradition the harmonium usually follows and supports the vocalist, and the tanpura provides the tonal foundation; Western-style backing tracks with chords are a different setting that may pull your ear differently. Both are useful practice.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone' },
        { kind: 'taal', label: 'Keharwa (8 beats) at a relaxed tempo', taal: 'keharwa', bpm: 80, cycles: 4 },
        { kind: 'taal', label: 'Dadra (6 beats)', taal: 'dadra', bpm: 90, cycles: 4 },
        { kind: 'sequence', label: 'Melody line to sing with taal: S R G P G R S -', notes: ['S', 'R', 'G', 'P', 'G', 'R', 'S', '-'], bpm: 80 },
      ],
      guidedSteps: [
        'Start the Tanpura Drone and the Keharwa taal (Metronome & Taal) at 80 bpm together.',
        'Sing "S R G P G R S" in unison with the Sargam Player, landing Sa on sam.',
        'Mute the Sargam Player and sing the same line with only drone + taal.',
        'Sing the 4-bar melody you learned by ear with drone and taal.',
        'Record it in the Recording Journal. Listen once just for pitch, once for rhythm, once for breath and diction.',
        'Write one strength and one improvement in the journal note. Compare with a recording from a few weeks ago.',
      ],
      independentPractice: {
        instructions:
          'Twice a week: sing one song line or melody with drone + taal and record it. Review with the four-point checklist (pitch, rhythm, breath, tone/diction), noting one positive and one improvement.',
        durationMin: 15,
        tool: 'recorder',
      },
      mistakes: [
        { mistake: 'Letting the accompaniment cover your voice so you cannot hear your pitch.', fix: 'Lower the instrument volume or uncover one ear.' },
        { mistake: 'Listening back only to criticise.', fix: 'Always note one strength alongside one improvement.' },
        { mistake: 'Comparing your recordings with polished studio tracks.', fix: 'Compare with your own earlier recordings to see real progress.' },
      ],
      quiz: [
        {
          question: 'Why keep one ear uncovered when singing with headphones?',
          options: ['To look professional', 'It improves the drone', 'It is a taal rule', 'So you can hear your own voice and pitch'],
          answerIndex: 3,
          explanation: 'Hearing yourself clearly is essential for staying in tune.',
        },
        {
          question: 'What is "sam" in a taal?',
          options: ['The first (most emphasised) beat of the cycle', 'The last beat', 'The khali beat', 'A type of drone'],
          answerIndex: 0,
          explanation: 'Sam is the first beat of the cycle; phrases often resolve there.',
        },
        {
          question: 'When reviewing a recording, the most helpful comparison is with…',
          options: ['Professional studio recordings', 'Your own earlier recordings', "A friend's singing", 'No comparison'],
          answerIndex: 1,
          explanation: 'Comparing with your past self shows genuine progress and keeps motivation healthy.',
        },
        {
          question: 'Why does your recorded voice often sound strange to you?',
          options: ['The microphone is always broken', 'Because you sang off-key', 'You usually hear yourself partly through bone conduction, which changes the sound', 'Recordings change the raga'],
          answerIndex: 2,
          explanation: 'Bone conduction makes your voice sound different to you than to others or a microphone.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Self-reported, using your Recording Journal.',
        items: [
          'I sang a melody with drone and taal, landing on sam.',
          'I recorded it and reviewed pitch, rhythm, breath and tone/diction separately.',
          'I wrote one strength and one improvement without harsh self-criticism.',
        ],
      },
      videoQueries: ['how to sing in tune with harmonium accompaniment', 'singing with karaoke track in your key transpose', 'how to review your own singing recordings'],
      nextStep: 'You are ready for the Level 3 checkpoint. When you pass it, Level 4 opens deeper raga study and song performance.',
      estMinutes: 30,
    },
  ],
  checkpoint: {
    title: 'Level 3 Checkpoint: Ragas, Alap and Musicianship',
    description:
      'This checkpoint measures note matching only: the app checks whether you can match the notes of Raag Yaman and Raag Bhupali within a tolerance. It cannot judge raga grammar, ornaments or expression — those are covered by the honest self-check. You can retry it anytime; there is no penalty and no time limit.',
    requirements: [
      {
        kind: 'pitch-match',
        description: 'Match the notes of Raag Yaman (including mandra Ni and teevra Ma).',
        targets: ['.N', 'R', 'G', 'M', 'D', 'N', "S'"],
        minAttempts: 14,
        minSuccessPct: 70,
        toleranceCents: 35,
      },
      {
        kind: 'pitch-match',
        description: 'Match the notes of Raag Bhupali.',
        targets: ['S', 'R', 'G', 'P', 'D', "S'"],
        minAttempts: 12,
        minSuccessPct: 70,
        toleranceCents: 35,
      },
      {
        kind: 'self-check',
        description: 'Self-reported musicianship check.',
        items: [
          'I sang a simple alap phrase over the drone, starting and ending on Sa, and reviewed my recording.',
          'I can sing a 4-bar melody I learned by ear, in my own key and in time.',
          'I can sing a meend that lands in tune and recognise murki, khatka and gamak by ear.',
          'I practise without forcing high notes and stop if anything hurts.',
        ],
      },
    ],
  },
};
