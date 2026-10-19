import type { Level } from '../types';

// Level 2 — Building the Voice.
// Standard alankar patterns used below (shuddh scale, madhya saptak up to taar Sa):
const ALANKAR_3: string[] = [
  'S', 'R', 'G', 'R', 'G', 'm', 'G', 'm', 'P', 'm', 'P', 'D', 'P', 'D', 'N', 'D', 'N', "S'",
  "S'", 'N', 'D', 'N', 'D', 'P', 'D', 'P', 'm', 'P', 'm', 'G', 'm', 'G', 'R', 'G', 'R', 'S',
];
const ALANKAR_4: string[] = [
  'S', 'R', 'G', 'm', 'R', 'G', 'm', 'P', 'G', 'm', 'P', 'D', 'm', 'P', 'D', 'N', 'P', 'D', 'N', "S'",
  "S'", 'N', 'D', 'P', 'N', 'D', 'P', 'm', 'D', 'P', 'm', 'G', 'P', 'm', 'G', 'R', 'm', 'G', 'R', 'S',
];
const ALANKAR_SKIP: string[] = [
  'S', 'G', 'R', 'm', 'G', 'P', 'm', 'D', 'P', 'N', 'D', "S'",
  "S'", 'D', 'N', 'P', 'D', 'm', 'P', 'G', 'm', 'R', 'G', 'S',
];
const ALANKAR_DOUBLE: string[] = [
  'S', 'S', 'R', 'R', 'G', 'G', 'm', 'm', 'P', 'P', 'D', 'D', 'N', 'N', "S'", "S'",
  "S'", "S'", 'N', 'N', 'D', 'D', 'P', 'P', 'm', 'm', 'G', 'G', 'R', 'R', 'S', 'S',
];
const SHUDDH_AROHA_AVAROHA: string[] = [
  'S', 'R', 'G', 'm', 'P', 'D', 'N', "S'", "S'", 'N', 'D', 'P', 'm', 'G', 'R', 'S',
];

export const level2: Level = {
  id: 2,
  title: 'Building the Voice',
  subtitle: 'Sargam, alankars, steady sur, the 12 swaras and your first taals',
  suggestedDuration: 'Months 2–3 (flexible guideline)',
  description:
    'In Level 2 you turn the basic sense of Sa into a usable singing voice. You practise sargam with the tanpura, learn the standard alankars (paltas) that every Hindustani student sings, hold long steady notes, meet all 12 swaras and the three saptaks, and learn to clap Teentaal, Keharwa and Dadra. Go slowly: control first, speed later. Time is only a guideline — move on when the skills feel comfortable, not when the calendar says so.',
  lessons: [
    // ───────────────────────── Module 1: Sargam & Steady Sur ─────────────────────────
    {
      id: 'l2-sargam-with-drone',
      level: 2,
      module: 'Sargam & Steady Sur',
      title: 'Sargam Aroha & Avaroha with the Drone',
      objective:
        'Sing the full shuddh sargam up (aroha) and down (avaroha) slowly against the tanpura drone, matching each note.',
      explanation: {
        hinglish:
          'Level 1 mein aapne Sa ko pakadna seekha. Ab poori sargam ki baari hai: S R G m P D N S\' — yeh hai shuddh saptak, jismein saare swar apni natural (shuddh) position par hain. Neeche se upar jaana aroha kehlata hai: Sa Re Ga Ma Pa Dha Ni Sa\'. Upar se neeche aana avaroha kehlata hai: Sa\' Ni Dha Pa Ma Ga Re Sa.\n\nYaad rakhiye, Sa movable hai. Aapne app mein jo bhi Sa chuna hai (jaise C ya D), baaki saare swar usi Sa se measure hote hain. Isliye kisi aur ka Sa copy karne ki zaroorat nahi — apne comfortable Sa par hi gaaiye.\n\nAbhi speed bilkul nahi chahiye. Tanpura Drone on kijiye, ek gehri saans lijiye, aur har swar ko kam se kam 2–3 second tak gaaiye. Pehle swar ko suniye (Sargam Player se), phir gaaiye, phir check kijiye ki voh drone ke saath "baith" raha hai ya nahi. Jab note sahi hota hai, toh drone ke saath ek smooth, shaant feeling aati hai; jab galat hota hai, toh halki si khinchaav ya wobble sunai deti hai.\n\nUpar ka Sa\' (taar Sa) agar mushkil lage, toh force mat kijiye. Tab tak sirf Pa ya Dha tak jaaiye aur wapas aaiye. Range dheere-dheere khulegi — gala strain karke nahi, regular halki practice se.',
        english:
          "In Level 1 you learned to find and hold Sa. Now we take the whole shuddh scale: S R G m P D N S' — every swara in its natural (shuddh) position. Moving upward is called aroha: Sa Re Ga Ma Pa Dha Ni Sa'. Moving downward is called avaroha: Sa' Ni Dha Pa Ma Ga Re Sa.\n\nRemember that Sa is movable. Whatever Sa you chose in the app (C, D, or anything comfortable) becomes home, and every other swara is measured from it. You never need to copy someone else's Sa — sing in the key that suits your voice.\n\nSpeed is not the goal yet. Switch on the Tanpura Drone, take a calm breath, and give each swara two to three seconds. Listen to the note first in the Sargam Player, sing it, then judge whether it settles against the drone. A correct note feels calm and blended with the drone; a wrong one has a slight tension or wobble against it.\n\nIf upper Sa' feels hard to reach, do not force it. For now, go up to Pa or Dha and come back. Range opens gradually through regular, relaxed practice — never by straining the throat.",
        hindi:
          "लेवल 1 में आपने सा को पकड़ना और टिकाना सीखा। अब पूरी शुद्ध सरगम की बारी है: S R G m P D N S' — इसमें हर स्वर अपनी स्वाभाविक (शुद्ध) जगह पर है। नीचे से ऊपर जाना आरोह कहलाता है: सा रे ग म प ध नि सां। ऊपर से नीचे आना अवरोह कहलाता है: सां नि ध प म ग रे सा।\n\nयाद रखिए, सा बदला जा सकता है। ऐप में आपने जो भी सा चुना है (C, D या जो भी आरामदायक हो), वही आपका घर है, और बाकी सब स्वर उसी से नापे जाते हैं। किसी और का सा नकल करने की ज़रूरत नहीं — अपनी आवाज़ के हिसाब से सही सुर में गाइए।\n\nअभी गति (स्पीड) लक्ष्य नहीं है। तानपुरा ड्रोन चालू कीजिए, आराम से साँस लीजिए, और हर स्वर को दो-तीन सेकंड दीजिए। पहले सरगम प्लेयर में स्वर सुनिए, फिर गाइए, फिर परखिए कि वह ड्रोन के साथ \"बैठ\" रहा है या नहीं। सही स्वर ड्रोन के साथ शांत और घुला-मिला लगता है; गलत स्वर में हल्का खिंचाव या डगमगाहट सुनाई देती है।\n\nअगर ऊपर का सां (तार सा) मुश्किल लगे, तो ज़ोर मत लगाइए। अभी प या ध तक जाइए और वापस आइए। रेंज धीरे-धीरे, नियमित और आरामदायक अभ्यास से खुलती है — गले पर ज़ोर डालकर कभी नहीं।",
      },
      whyItMatters:
        'Almost every Bollywood melody and every raga is built from these swaras. Singing the scale accurately against a drone trains your ear and voice to place notes in relation to Sa, which is the foundation of all later work.',
      traditionNote:
        'The app plays notes in 12-tone equal temperament so they line up with keyboards and harmoniums. In traditional Hindustani practice, some swaras are tuned with subtle differences (shrutis) depending on the raga. At this stage equal-tempered sargam is a perfectly good reference; your teacher or later lessons will refine this.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone on your Sa' },
        { kind: 'sequence', label: 'Shuddh aroha (slow)', notes: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"], bpm: 50 },
        { kind: 'sequence', label: 'Shuddh avaroha (slow)', notes: ["S'", 'N', 'D', 'P', 'm', 'G', 'R', 'S'], bpm: 50 },
        { kind: 'note', label: 'Upper Sa (taar Sa) — check if it is comfortable', swara: "S'", durationSec: 3 },
      ],
      guidedSteps: [
        'Open the Tanpura Drone at your chosen Sa and listen for 30 seconds without singing.',
        'Sing a long "Saaa" and settle it against the drone before going further.',
        'In the Sargam Player, play the aroha at 50 bpm. Sing each swara after hearing it, holding it for two beats.',
        'Now sing the aroha alone with only the drone. Use the Pitch Matcher to check each note.',
        'Repeat for the avaroha, paying extra attention to Ga and Re on the way down (they often go flat).',
        'If upper Sa strains, stop at Dha and return — mark this in your Recording Journal and try again in a week.',
        'Record one full aroha + avaroha in the Recording Journal and listen back once.',
      ],
      independentPractice: {
        instructions:
          'With the drone on, sing the full aroha and avaroha slowly, one swara per two beats, five times. Rest 30 seconds between rounds.',
        durationMin: 10,
        tool: 'sargam',
        pattern: SHUDDH_AROHA_AVAROHA,
        bpm: 50,
      },
      mistakes: [
        { mistake: 'Rushing through the scale like a song, without settling each note.', fix: 'Hold every swara for at least two beats and wait until it feels blended with the drone before moving on.' },
        { mistake: 'Pushing loudly for upper Sa.', fix: 'Sing softer as you go up, open the mouth a little more, and stop at Dha if Sa\' strains.' },
        { mistake: 'Descending notes sinking below their place.', fix: 'Think "up" while coming down — keep the breath supported and listen to each note against Sa.' },
      ],
      quiz: [
        {
          question: 'What is "aroha"?',
          options: ['Singing the scale downward', 'Singing the scale upward', 'A type of taal', 'The drone instrument'],
          answerIndex: 1,
          explanation: 'Aroha is the ascending movement (Sa to upper Sa); avaroha is the descending movement.',
        },
        {
          question: 'Which is the correct shuddh avaroha?',
          options: ["S' D N P m G R S", "S' N D P m G R S", "S' N D P G m R S", "S' N P D m G R S"],
          answerIndex: 1,
          explanation: "Descending order is Sa' Ni Dha Pa Ma Ga Re Sa.",
        },
        {
          question: 'Your friend sings Sa on D and you sing Sa on C. Who is right?',
          options: ['Only the one on C, because C is the standard Sa', 'Only the one on D', 'Both — Sa is movable and chosen to suit the voice', 'Neither — Sa must be on A'],
          answerIndex: 2,
          explanation: 'In Indian music Sa is movable. Each singer picks a comfortable tonic and all swaras are measured from it.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match each swara of the shuddh scale against your Sa. If upper Sa is not yet comfortable, sing it softly — never force it.',
        targets: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"],
        minAttempts: 8,
        minSuccessPct: 60,
        toleranceCents: 50,
      },
      videoQueries: ['sargam aroha avaroha with tanpura for beginners hindi', 'sa re ga ma pa slow practice with tanpura'],
      nextStep: 'Next, learn to tune your Sa precisely to the tanpura by listening for "beating".',
      estMinutes: 20,
    },
    {
      id: 'l2-tuning-to-tanpura',
      level: 2,
      module: 'Sargam & Steady Sur',
      title: 'Listening to and Matching the Tanpura',
      objective:
        'Hear the difference between being in tune and out of tune with the drone, using the "beating" effect to correct your Sa and Pa.',
      explanation: {
        hinglish:
          'Tanpura sirf background sound nahi hai — yeh aapka sabse achha teacher hai. Tanpura lagaatar Sa aur Pa (ya kuch ragas mein Ma ya Ni) bajaata hai, aur aapko apna sur us drone ke andar "ghulana" hota hai.\n\nJab aapka Sa drone ke Sa se thoda sa alag hota hai, toh ek halki "waah-waah-waah" jaisi dhadkan sunai deti hai. Isko beating kehte hain. Jitna door aapka sur hai, utni tez beating; jitna paas, utni dheemi. Jab sur bilkul mil jaata hai, beating gayab ho jaati hai aur aisa lagta hai ki aapki awaaz drone mein ghul gayi hai.\n\nPractice aise kijiye: drone on karke "Aaa" par Sa gaaiye. Ab bahut dheere sur ko thoda upar aur thoda neeche kijiye, jaise radio tune karte hain. Dhyan se suniye — kahin ek point aayega jahan sab shaant ho jaata hai. Wahi aapka sahi Sa hai. Phir yahi kaam Pa par kijiye.\n\nShuru mein beating sunna mushkil lagta hai, yeh bilkul normal hai. Aankhein band karke, halki awaaz mein gaaiye — loud gaane se beating sunna aur mushkil ho jaata hai. Pitch Matcher ka use karke confirm kijiye, lekin dheere-dheere apne kaan par bharosa badhaaiye, kyunki stage par ya kisi song mein screen nahi hogi.',
        english:
          "The tanpura is not just background sound — it is your most patient teacher. It sounds Sa and Pa continuously (some ragas use Ma or Ni instead of Pa), and your task is to blend your voice into that drone.\n\nWhen your Sa is slightly off from the drone's Sa, you hear a slow pulsing wobble, a sort of \"wah-wah-wah\". This is called beating. The further apart the two pitches, the faster the beating; the closer they are, the slower it gets. When they match, the beating disappears and your voice seems to melt into the drone.\n\nTry this: with the drone on, sing Sa on \"Aaa\". Now very slowly slide a tiny bit higher and a tiny bit lower, like tuning an old radio. Listen carefully for the spot where everything goes calm. That is your Sa. Then do the same on Pa.\n\nAt first beating is hard to hear — that is completely normal. Close your eyes and sing softly; loud singing makes beating harder to notice. Use the Pitch Matcher to confirm, but gradually learn to trust your ears, because in a real performance or a song there is no screen to look at.",
        hindi:
          "तानपुरा सिर्फ़ पीछे बजने वाली आवाज़ नहीं है — यह आपका सबसे धैर्यवान गुरु है। यह लगातार सा और प बजाता है (कुछ रागों में प की जगह म या नि), और आपका काम अपनी आवाज़ को उस ड्रोन में घोल देना है।\n\nजब आपका सा ड्रोन के सा से थोड़ा अलग होता है, तो एक धीमी धड़कन जैसी डगमगाहट सुनाई देती है — \"वाह-वाह-वाह\" जैसी। इसे बीटिंग कहते हैं। दोनों सुर जितने दूर, बीटिंग उतनी तेज़; जितने पास, उतनी धीमी। जब सुर मिल जाते हैं, बीटिंग गायब हो जाती है और आपकी आवाज़ ड्रोन में घुल जाती है।\n\nऐसे आज़माइए: ड्रोन चालू करके \"आ\" पर सा गाइए। अब बहुत धीरे-धीरे ज़रा-सा ऊपर और ज़रा-सा नीचे जाइए, जैसे पुराना रेडियो ट्यून करते हैं। ध्यान से सुनिए कि किस जगह सब कुछ शांत हो जाता है। वही आपका सा है। फिर यही काम प पर कीजिए।\n\nशुरू में बीटिंग सुनना मुश्किल लगता है — यह बिल्कुल सामान्य है। आँखें बंद करके धीमी आवाज़ में गाइए; ज़ोर से गाने पर बीटिंग पकड़ना और कठिन हो जाता है। पिच मैचर से पुष्टि कीजिए, लेकिन धीरे-धीरे अपने कानों पर भरोसा करना सीखिए, क्योंकि असली प्रस्तुति या गाने में कोई स्क्रीन नहीं होती।",
      },
      whyItMatters:
        'Singers who can hear beating can correct themselves in real time. This self-correction is what makes a voice sound "sureela" (in tune) rather than approximately right.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone — listen before singing' },
        { kind: 'note', label: 'Reference Sa', swara: 'S', durationSec: 4 },
        { kind: 'glide', label: 'Slow slide from mandra Ni (just below Sa) up into Sa — notice where it settles', from: '.N', to: 'S', durationSec: 4 },
        { kind: 'note', label: 'Reference Pa', swara: 'P', durationSec: 4 },
      ],
      guidedSteps: [
        'Open the Tanpura Drone and listen for one full minute. Notice Sa and Pa inside the sound.',
        'Hum Sa softly with lips closed. Adjust slightly until the sound feels steady and calm against the drone.',
        'Open to "Aaa". Slide a few cents up and down on purpose, and notice the beating speed up or slow down.',
        'Find the calmest spot and hold it for 5 seconds. Check it in the Pitch Matcher.',
        'Repeat the same process on Pa.',
        'Try once with eyes closed, then open the Pitch Matcher to see how close you were.',
      ],
      independentPractice: {
        instructions:
          'Alternate Sa and Pa against the drone, holding each for about 5 seconds, listening for the beating to disappear. Ten repetitions each.',
        durationMin: 8,
        tool: 'drone',
        pattern: ['S', '-', 'P', '-', 'S', '-', 'P', '-'],
        bpm: 40,
      },
      mistakes: [
        { mistake: 'Singing too loudly to hear the drone.', fix: 'Sing at a soft-to-medium volume, or raise the drone volume, so you can hear both together.' },
        { mistake: 'Relying only on the screen.', fix: 'First decide by ear, then check on the Pitch Matcher. Your ear is the skill you are building.' },
        { mistake: 'Assuming beating means "very wrong".', fix: 'Slow beating means you are close. Make tiny adjustments, not big jumps.' },
      ],
      quiz: [
        {
          question: 'What does "beating" against the drone tell you?',
          options: ['The drone is broken', 'Your pitch is slightly different from the drone', 'You are singing too softly', 'You are in perfect tune'],
          answerIndex: 1,
          explanation: 'Beating is the wobble created when two nearby but different pitches sound together. It slows and vanishes as they match.',
        },
        {
          question: 'As your Sa gets closer to the drone, the beating becomes…',
          options: ['Faster', 'Louder', 'Slower, then disappears', 'Unchanged'],
          answerIndex: 2,
          explanation: 'Beating speed equals the difference between the two frequencies, so it slows down as you approach the correct pitch.',
        },
        {
          question: 'Which notes does a standard tanpura usually sound?',
          options: ['Sa and Pa (Ma or Ni in some ragas)', 'Only Re and Ga', 'All 12 swaras', 'Only upper Sa'],
          answerIndex: 0,
          explanation: 'The common tuning is Pa-Sa-Sa-lower Sa; for ragas without Pa, the first string is tuned to Ma or Ni.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match Sa and Pa against your drone, holding each note steadily.',
        targets: ['S', 'P'],
        minAttempts: 6,
        minSuccessPct: 65,
        toleranceCents: 45,
      },
      videoQueries: ['how to sing in tune with tanpura beginners', 'tanpura sur milana practice hindi'],
      nextStep: 'Now that you can lock into Sa and Pa, learn to sustain them as long, steady tones.',
      estMinutes: 20,
    },
    {
      id: 'l2-long-tones-sa-pa',
      level: 2,
      module: 'Sargam & Steady Sur',
      title: 'Long Tones on Sa and Pa',
      objective: 'Sustain Sa and Pa steadily for 8–15 seconds with even breath, volume and pitch.',
      explanation: {
        hinglish:
          'Long tone ka matlab hai ek hi swar ko lambe samay tak, bina hile-dule, ek jaise volume mein gaana. Hindustani tradition mein ise aksar "ek sur lagana" ya sur sadhana kehte hain. Yeh simple lagta hai, lekin yahi exercise aawaz ko sabse zyada strong aur steady banati hai.\n\nKaise karein: seedhe baithiye ya khade hoiye, kandhe relax. Pet tak naturally saans lijiye (kandhe uthaaye bina). Ab drone ke saath "Aaa" par Sa shuru kijiye aur saans ko dheere-dheere, barabar chhodte hue sur ko pakde rakhiye. Shuru mein 6–8 second kaafi hain. Dheere-dheere 12–15 second tak jaaiye.\n\nTeen cheezein dhyan mein rakhiye: (1) pitch — sur upar-neeche na ho, (2) volume — shuru mein zor aur end mein khatam aisa na ho, ek jaisa rahe, (3) tone — awaaz saaf rahe, zyada hawa na nikle. End mein jab saans khatam hone lage, sur aksar neeche girta hai; saans khatam hone se pehle hi aaram se rok dijiye.\n\nSa ke baad Pa par yahi kijiye. Pa bhi achal swar hai (kabhi komal ya teevra nahi hota), isliye yeh doosra strong anchor hai. Agar gala sookha ya thaka lage, paani piyein aur ruk jaaiye. Long tones kabhi zor se nahi, hamesha comfortable volume mein.',
        english:
          'A long tone means holding one swara for a long time at a steady pitch and even volume. In Hindustani training this kind of sustained practice is a core part of sur sadhana. It looks simple, but it is one of the most effective exercises for building a stable, strong voice.\n\nHow to do it: sit or stand tall with relaxed shoulders. Breathe low into the belly without lifting the shoulders. With the drone on, start Sa on "Aaa" and release the breath slowly and evenly while holding the pitch. Begin with 6–8 seconds and gradually work up to 12–15 seconds.\n\nWatch three things: (1) pitch — no drifting up or down, (2) volume — not loud at the start and fading at the end, but even throughout, (3) tone — clear, without excess breathiness. Pitch usually sags at the end as air runs out, so finish the note calmly before you are completely out of breath.\n\nThen do the same on Pa. Pa, like Sa, is achal (fixed — it never becomes komal or teevra), so it is your second strong anchor. If your throat feels dry or tired, drink water and stop. Long tones are always practised at a comfortable volume, never pushed.',
        hindi:
          "लंबे सुर (long tone) का मतलब है एक ही स्वर को देर तक, स्थिर सुर और एक-सी आवाज़ में गाना। हिंदुस्तानी तालीम में यह लंबा सुर लगाने का अभ्यास सुर साधना का अहम हिस्सा है। यह आसान दिखता है, लेकिन स्थिर और मज़बूत आवाज़ बनाने के लिए यह सबसे असरदार अभ्यासों में से एक है।\n\nकैसे करें: सीधे बैठिए या खड़े होइए, कंधे ढीले रखिए। कंधे उठाए बिना पेट तक नीचे साँस लीजिए। ड्रोन चालू करके \"आ\" पर सा शुरू कीजिए और सुर को पकड़े रखते हुए साँस धीरे-धीरे, बराबर छोड़िए। 6–8 सेकंड से शुरू कीजिए और धीरे-धीरे 12–15 सेकंड तक पहुँचिए।\n\nतीन बातों पर ध्यान दीजिए: (1) सुर — ऊपर-नीचे न खिसके, (2) आवाज़ का स्तर — शुरू में तेज़ और आख़िर में धीमा नहीं, पूरे समय एक-सा, (3) आवाज़ का रंग — साफ़, बिना ज़्यादा हवा के। साँस ख़त्म होने लगे तो सुर अक्सर नीचे गिरता है, इसलिए साँस पूरी ख़त्म होने से पहले ही आराम से स्वर समाप्त कीजिए।\n\nफिर यही प पर कीजिए। सा की तरह प भी अचल है (कभी कोमल या तीव्र नहीं होता), इसलिए यह आपका दूसरा मज़बूत सहारा है। अगर गला सूखा या थका लगे, पानी पीजिए और रुक जाइए। लंबे सुर हमेशा आरामदायक आवाज़ में गाए जाते हैं, कभी ज़ोर लगाकर नहीं।",
      },
      whyItMatters:
        'Long, steady notes are everywhere in Bollywood songs (line endings, held words) and in classical alaap. Breath control and pitch steadiness built here make every later skill easier.',
      demos: [
        { kind: 'drone', label: 'Drone for long tones' },
        { kind: 'note', label: 'Long Sa (8 seconds)', swara: 'S', durationSec: 8 },
        { kind: 'note', label: 'Long Pa (8 seconds)', swara: 'P', durationSec: 8 },
      ],
      guidedSteps: [
        'Do two minutes of gentle humming to warm up.',
        'Start the Tanpura Drone. Take a low, relaxed breath.',
        'Sing Sa on "Aaa" for 6–8 seconds while watching the Pitch Matcher line — aim for a flat, steady line.',
        'Rest for one full breath, then repeat three times.',
        'Do the same on Pa, three times.',
        'Record one long Sa and one long Pa in the Recording Journal and note how many seconds you held them steadily.',
      ],
      independentPractice: {
        instructions:
          'Five long Sa and five long Pa, each 8–12 seconds, resting between. Keep volume comfortable and stop before you run out of breath.',
        durationMin: 10,
        tool: 'pitch-match',
        pattern: ['S', 'P'],
      },
      mistakes: [
        { mistake: 'Starting loud and fading out.', fix: 'Start at a medium volume and spend the breath evenly, like a slow, steady stream of water.' },
        { mistake: 'Pitch sagging flat at the end of the note.', fix: 'End the note a little earlier while there is still breath support.' },
        { mistake: 'Lifting the shoulders to breathe.', fix: 'Place a hand on the belly and let it expand as you breathe in; keep the shoulders still.' },
      ],
      quiz: [
        {
          question: 'Which two swaras are achal (never komal or teevra)?',
          options: ['Re and Ga', 'Sa and Pa', 'Ma and Ni', 'Ga and Dha'],
          answerIndex: 1,
          explanation: 'Sa and Pa are achal swaras — fixed. The other five can change form.',
        },
        {
          question: 'Your long Sa goes flat at the very end. What is the most likely cause?',
          options: ['The drone is too loud', 'Running out of breath support', 'Singing on "Aaa"', 'Sa is the wrong note'],
          answerIndex: 1,
          explanation: 'Pitch commonly sags as breath support weakens. Finish the note before you are completely empty.',
        },
        {
          question: 'A good long tone has…',
          options: ['Changing pitch for expression', 'Steady pitch and even volume', 'A loud start and soft end', 'As much breath sound as possible'],
          answerIndex: 1,
          explanation: 'The goal of this exercise is control: steady pitch, even volume and a clear tone.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Hold Sa and Pa steadily; each attempt counts if your median pitch is within tolerance.',
        targets: ['S', 'P'],
        minAttempts: 6,
        minSuccessPct: 65,
        toleranceCents: 45,
      },
      videoQueries: ['long tone practice for singers beginners', 'kharaj aur sur sadhana sa pa practice hindi'],
      nextStep: 'Next, extend this steadiness to other swaras in the Pitch Stability lesson.',
      estMinutes: 20,
      safetyNote: 'Long tones should feel easy. If you feel tightness, scratchiness or pain, stop and rest. Never hold notes until you are gasping.',
    },
    {
      id: 'l2-pitch-stability',
      level: 2,
      module: 'Sargam & Steady Sur',
      title: 'Pitch Stability Across the Scale',
      objective: 'Hold Sa, Ga, Pa and upper Sa with a steady line, reducing wobble and drift.',
      explanation: {
        hinglish:
          'Sur ka stable hona matlab: aap jo swar lagaate ho, voh wahi tika rahe. Beginners mein aksar teen problem hoti hain: (1) note shuru karte hi halka sa hilna, (2) beech mein dheere-dheere upar ya neeche khisakna (drift), (3) end mein girna.\n\nIs lesson mein hum Sa ke alawa Ga, Pa aur upar ke Sa\' par stability practice karenge. Ga ek interesting swar hai — beginners usse aksar thoda neeche (flat) gaate hain, khaaskar avaroha mein. Isliye Ga par dhyan se kaam karna zaroori hai.\n\nTechnique: note shuru karne se pehle use mann mein suniye (Sargam Player se ek baar sun lijiye). Phir seedha us note par "land" kijiye — neeche se scoop karke nahi. Jab note lag jaaye, jaw, gardan aur kandhe dheele rakhiye. Tension se awaaz hilti hai. Pitch Matcher par line ko dekhiye — seedhi line chahiye, lehron jaisi nahi.\n\nEk baat clear kar dein: abhi hum jaan-boojhkar vibrato ya andolan nahi kar rahe. Classical music mein kuch ragas mein andolan (dheemi swing) ek sundar technique hai, lekin voh control ke baad aata hai. Pehle seedha, steady sur — baaki sab baad mein.',
        english:
          'Pitch stability means that the swara you sing stays exactly where you placed it. Beginners usually face three issues: (1) a small wobble right at the start, (2) slow drifting up or down in the middle, and (3) dropping at the end.\n\nIn this lesson you practise stability not only on Sa but also on Ga, Pa and upper Sa\'. Ga deserves special attention: beginners often sing it slightly flat, especially when descending.\n\nTechnique: before you start a note, hear it in your head (play it once in the Sargam Player). Then land directly on it — no scooping up from below. Once the note is placed, keep the jaw, neck and shoulders loose; tension makes the voice shake. Watch the Pitch Matcher trace: you want a flat line, not waves.\n\nTo be clear: we are not deliberately adding vibrato or andolan here. In classical music, andolan (a slow, controlled oscillation) is a beautiful ornament used on certain notes in certain ragas, but it comes after control. First a straight, steady note — expression later.',
        hindi:
          "सुर की स्थिरता का मतलब है कि आप जो स्वर लगाएँ, वह ठीक वहीं टिका रहे। शुरुआती गायकों को आमतौर पर तीन दिक्कतें होती हैं: (1) स्वर शुरू करते ही हल्का-सा हिलना, (2) बीच में धीरे-धीरे ऊपर या नीचे खिसकना, और (3) आख़िर में गिर जाना।\n\nइस पाठ में आप सिर्फ़ सा ही नहीं, ग, प और ऊपर के सां पर भी स्थिरता का अभ्यास करेंगे। ग पर ख़ास ध्यान दीजिए: शुरुआती लोग इसे अक्सर थोड़ा नीचे (फ़्लैट) गाते हैं, ख़ासकर उतरते समय।\n\nतरीका: स्वर शुरू करने से पहले उसे मन में सुनिए (सरगम प्लेयर में एक बार बजा लीजिए)। फिर सीधे उसी पर उतरिए — नीचे से घसीटकर नहीं। स्वर लगने के बाद जबड़ा, गर्दन और कंधे ढीले रखिए; तनाव से आवाज़ काँपती है। पिच मैचर की रेखा देखिए: आपको सीधी रेखा चाहिए, लहरें नहीं।\n\nसाफ़ कर दें: यहाँ हम जान-बूझकर वाइब्रेटो या आंदोलन नहीं कर रहे। शास्त्रीय संगीत में आंदोलन (धीमा, नियंत्रित झूला) कुछ रागों के कुछ स्वरों पर लगने वाला सुंदर अलंकरण है, लेकिन वह नियंत्रण के बाद आता है। पहले सीधा, स्थिर सुर — भाव बाद में।",
      },
      whyItMatters:
        'A stable pitch is what listeners hear as "sureela". Without it, ornaments, meend and fast taans will sound messy. With it, even simple melodies sound beautiful.',
      traditionNote:
        'Andolan and vibrato are different: andolan is a slow, raga-specific oscillation in Hindustani music, while vibrato is a regular pitch fluctuation used in Western and film singing. Neither is practised in this lesson.',
      demos: [
        { kind: 'drone', label: 'Drone on Sa' },
        { kind: 'note', label: 'Steady Ga', swara: 'G', durationSec: 5 },
        { kind: 'note', label: 'Steady Pa', swara: 'P', durationSec: 5 },
        { kind: 'sequence', label: 'Sa – Ga – Pa – upper Sa, with a breath-rest after each', notes: ['S', '-', 'G', '-', 'P', '-', "S'", '-'], bpm: 50 },
      ],
      guidedSteps: [
        'Warm up with 2 long Sa notes against the Tanpura Drone.',
        'Play Ga in the Sargam Player, hear it in your head for a moment, then sing it for 5 seconds.',
        'Watch the Pitch Matcher trace: is it flat, rising, or falling? Adjust on the next attempt.',
        'Repeat with Pa and upper Sa (softly — do not push).',
        'Sing S – G – P – S\' – P – G – S, holding each for 4 beats at 50 bpm on the Metronome & Taal tool.',
        'Record the sequence in the Recording Journal and mark which note wobbled most.',
      ],
      independentPractice: {
        instructions: 'Hold each note for 4 beats, focusing on a flat, steady line. Repeat the whole pattern four times.',
        durationMin: 10,
        tool: 'pitch-match',
        pattern: ['S', 'G', 'P', "S'", 'P', 'G', 'S'],
        bpm: 50,
      },
      mistakes: [
        { mistake: 'Ga sung flat (too low), especially coming down from Pa.', fix: 'Compare your Ga with the Sargam Player Ga several times; think of Ga as "bright" and slightly lifted.' },
        { mistake: 'Wobbling caused by a tight jaw or neck.', fix: 'Gently move the jaw loosely before singing, keep the tongue relaxed behind the lower teeth.' },
        { mistake: 'Mistaking a shaky voice for vibrato.', fix: 'Aim for a straight tone first. Controlled vibrato or andolan can be learned later.' },
      ],
      quiz: [
        {
          question: 'What does a steady flat line on the Pitch Matcher indicate?',
          options: ['A stable pitch', 'Vibrato', 'Silence', 'The note is out of tune'],
          answerIndex: 0,
          explanation: 'A flat trace means the pitch is not changing — that is stability. Whether it is also correct depends on where the line sits relative to the target.',
        },
        {
          question: 'Which swara do beginners often sing flat while descending?',
          options: ['Pa', 'Sa', 'Ga', 'Upper Sa'],
          answerIndex: 2,
          explanation: 'Ga (and Re) tend to sag in the avaroha because singers relax their support when coming down.',
        },
        {
          question: 'Andolan in Hindustani music is best described as…',
          options: ['A taal of 16 beats', 'A slow, controlled oscillation used on certain notes of certain ragas', 'A shaky voice due to nerves', 'Singing in the lower octave'],
          answerIndex: 1,
          explanation: 'Andolan is a deliberate ornament, specific to ragas, and quite different from uncontrolled wobble.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match Sa, Ga, Pa and upper Sa with a steady pitch at a tighter tolerance.',
        targets: ['S', 'G', 'P', "S'"],
        minAttempts: 8,
        minSuccessPct: 65,
        toleranceCents: 40,
      },
      videoQueries: ['how to sing with stable pitch beginners exercise', 'sur pakka kaise kare riyaz tips hindi'],
      nextStep: 'With steady notes in place, you are ready for alankars — the classic patterns of Hindustani riyaz.',
      estMinutes: 20,
    },

    // ───────────────────────── Module 2: Alankars & Paltas ─────────────────────────
    {
      id: 'l2-alankars-groups-of-three',
      level: 2,
      module: 'Alankars & Paltas',
      title: 'What Are Alankars? Groups of Three',
      objective: 'Understand what alankars/paltas are and sing the groups-of-three alankar ascending and descending at a slow tempo.',
      explanation: {
        hinglish:
          'Alankar ka seedha matlab hai "gehna" ya sajavat. Music mein alankar ek fixed pattern hota hai jo scale ke har swar se shuru karke repeat kiya jaata hai. Inko paltas bhi kaha jaata hai. Hindustani riyaz mein alankar sabse basic aur zaroori exercise maane jaate hain — inse awaaz flexible hoti hai, sur pakka hota hai aur swar ke beech ke gap ka andaaza aata hai.\n\nPehla alankar: teen-teen swaron ka group.\nAroha: S R G, R G m, G m P, m P D, P D N, D N S\'\nAvaroha: S\' N D, N D P, D P m, P m G, m G R, G R S\n\nDekhiye pattern kaise kaam karta hai — pehle group mein Sa se teen swar, phir ek swar aage badhkar Re se teen swar, phir Ga se. Avaroha bilkul mirror image hai: upar ke Sa se neeche ki taraf teen-teen swar.\n\nPractice tip: har group ke pehle swar par halka sa zor (accent) dijiye — isse groups saaf sunai dete hain aur dimaag mein pattern baith jaata hai. Shuru mein 60 bpm par, ek swar ek beat. Gaate waqt mann mein ya dheere se sargam bolte rahiye. Aakaar (sirf "Aa" par gaana) baad mein karenge; abhi sargam ke naam ke saath gaana seekhne ke liye best hai.',
        english:
          'Alankar literally means "ornament" or decoration. In music, an alankar is a fixed melodic pattern that is repeated starting from each successive swara of the scale. Many teachers also call them paltas. Alankars are the bread and butter of Hindustani riyaz: they make the voice agile, strengthen pitch accuracy and teach you the exact distance between swaras.\n\nYour first alankar uses groups of three:\nAroha: S R G, R G m, G m P, m P D, P D N, D N S\'\nAvaroha: S\' N D, N D P, D P m, P m G, m G R, G R S\n\nNotice the logic: the first group is three notes from Sa, then you step up one swara and sing three notes from Re, then from Ga, and so on. The avaroha is the exact mirror, moving down in groups of three from upper Sa.\n\nPractice tip: give the first note of each group a slight accent. This makes the groups clear and helps your brain lock the pattern in. Start at 60 bpm, one swara per beat. Sing using the sargam names for now; singing the same pattern on "Aa" (aakaar) comes later.',
        hindi:
          "अलंकार का शाब्दिक अर्थ है \"गहना\" या सजावट। संगीत में अलंकार एक तय सुर-पैटर्न है जिसे सप्तक के हर अगले स्वर से शुरू करके दोहराया जाता है। कई गुरु इन्हें पलटा भी कहते हैं। अलंकार हिंदुस्तानी रियाज़ की रोज़ की रोटी हैं: ये आवाज़ को फुर्तीला बनाते हैं, सुर पक्का करते हैं और स्वरों के बीच की सही दूरी सिखाते हैं।\n\nआपका पहला अलंकार तीन-तीन स्वरों के समूह का है:\nआरोह: S R G, R G m, G m P, m P D, P D N, D N S'\nअवरोह: S' N D, N D P, D P m, P m G, m G R, G R S\n\nतर्क समझिए: पहला समूह सा से तीन स्वर, फिर एक स्वर ऊपर बढ़कर रे से तीन स्वर, फिर ग से, और इसी तरह आगे। अवरोह ठीक इसका उल्टा (दर्पण) है — ऊपर के सां से तीन-तीन स्वरों में नीचे उतरना।\n\nअभ्यास का सुझाव: हर समूह के पहले स्वर पर हल्का-सा ज़ोर दीजिए। इससे समूह साफ़ सुनाई देते हैं और पैटर्न दिमाग़ में बैठ जाता है। 60 bpm से शुरू कीजिए, एक मात्रा पर एक स्वर। अभी सरगम के नाम बोलकर गाइए; यही पैटर्न \"आ\" पर (आकार में) गाना बाद में आएगा।",
      },
      whyItMatters:
        'Bollywood melodies constantly move in small step patterns like these. Alankars train the voice to move between notes accurately rather than guessing, and they are the standard daily riyaz in Hindustani music.',
      traditionNote:
        'Names and numbering of alankars vary a lot between teachers and gharanas — what one teacher calls "alankar 2" another may call a "palta" or number differently. The note patterns here are widely used standard ones; the labels are just for this app.',
      demos: [
        { kind: 'sequence', label: 'Groups of three — aroha', notes: ALANKAR_3.slice(0, 18), bpm: 60 },
        { kind: 'sequence', label: 'Groups of three — avaroha', notes: ALANKAR_3.slice(18), bpm: 60 },
        { kind: 'drone', label: 'Drone for alankar practice' },
      ],
      guidedSteps: [
        'Read the pattern aloud (just speak the sargam names) in rhythm, to learn it before singing.',
        'Play the aroha demo in the Sargam Player and sing along at 60 bpm.',
        'Turn off the demo, keep only the Tanpura Drone and Metronome & Taal at 60 bpm, and sing the aroha alone.',
        'Do the same for the avaroha, keeping Ga and Re from sinking.',
        'Sing the full aroha + avaroha twice without stopping.',
        'Record one round in the Recording Journal and check whether each group is clearly accented.',
      ],
      independentPractice: {
        instructions:
          'Sing the full groups-of-three alankar (up and down) at 60 bpm, one swara per beat, three to five times. Only move up to 80 bpm (see the tempo ladder lesson) once you are accurate and relaxed at 60.',
        durationMin: 12,
        tool: 'sargam',
        pattern: ALANKAR_3,
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Losing your place in the pattern.', fix: 'Speak the pattern rhythmically first, and accent the first note of each group.' },
        { mistake: 'Notes becoming approximate as you focus on the pattern.', fix: 'Slow down. Accuracy comes before memorisation and speed.' },
        { mistake: 'Increasing tempo too early.', fix: 'Stay at 60 bpm until you can sing the whole alankar accurately three times in a row.' },
      ],
      quiz: [
        {
          question: 'What comes after "S R G, R G m, G m P" in this alankar?',
          options: ['m P D', 'P D N', 'G P D', 'm D N'],
          answerIndex: 0,
          explanation: 'Each group starts one swara higher than the previous: S, R, G, then m — so m P D.',
        },
        {
          question: 'Another common name for an alankar pattern is…',
          options: ['Theka', 'Palta', 'Avartan', 'Kharaj'],
          answerIndex: 1,
          explanation: 'Alankars are also widely called paltas. Theka and avartan are rhythm terms; kharaj is low-register practice.',
        },
        {
          question: 'The avaroha of the groups-of-three alankar starts with…',
          options: ["S R G", "G R S", "S' N D", "N D P"],
          answerIndex: 2,
          explanation: "The avaroha mirrors the aroha from the top: S' N D, N D P, D P m …",
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the notes used in this alankar, one at a time, to confirm each swara is accurate before you combine them in the pattern.',
        targets: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"],
        minAttempts: 8,
        minSuccessPct: 60,
        toleranceCents: 45,
      },
      videoQueries: ['sargam alankar for beginners hindi', 'alankar 3 swar group practice harmonium'],
      nextStep: 'Next, extend the same idea to groups of four swaras.',
      estMinutes: 25,
    },
    {
      id: 'l2-alankars-groups-of-four',
      level: 2,
      module: 'Alankars & Paltas',
      title: 'Alankar: Groups of Four',
      objective: 'Sing the groups-of-four alankar in aroha and avaroha with accurate notes at 60 bpm.',
      explanation: {
        hinglish:
          'Ab hum alankar ko thoda lamba karte hain — chaar-chaar swaron ke group.\n\nAroha: S R G m, R G m P, G m P D, m P D N, P D N S\'\nAvaroha: S\' N D P, N D P m, D P m G, P m G R, m G R S\n\nTeen wale alankar ki tarah hi logic hai: har group ek swar upar se shuru hota hai. Fark itna hai ki ab har group mein chaar swar hain, isliye saans ki planning zaroori hai. Koshish kijiye ki do groups (8 swar) ek saans mein ho jaayein, phir chupke se saans lijiye. Shuru mein har group ke baad saans lena bhi bilkul theek hai.\n\nChaar ke group ka ek fayda hai — yeh taal ke saath natural fit hota hai. Keharwa aur Teentaal mein vibhag chaar matra ke hote hain, toh ek group = ek vibhag. Yeh rhythm module mein aapke kaam aayega.\n\nDhyan dijiye ki Ma (m) shuddh Ma hai — thoda neeche wala, Ga ke bilkul paas. Beginners kabhi-kabhi Ma ko upar kheench dete hain, jisse voh teevra Ma jaisa sunai deta hai. Sargam Player se Ga aur Ma ko compare karke suniye — dono ke beech sirf ek semitone ka chhota gap hai.\n\nMetronome 60 bpm par rakhiye, ek beat ek swar. Jab tak teen baar lagaatar saaf na ho, tempo mat badhaaiye.',
        english:
          'Now we lengthen the alankar to groups of four swaras.\n\nAroha: S R G m, R G m P, G m P D, m P D N, P D N S\'\nAvaroha: S\' N D P, N D P m, D P m G, P m G R, m G R S\n\nThe logic is the same as groups of three: each group begins one swara higher. The difference is that each group now has four notes, so breath planning matters. Try to sing two groups (eight notes) per breath and take a quiet breath between; breathing after every group is also fine at first.\n\nGroups of four have a bonus: they fit taal naturally. Keharwa and Teentaal are built from vibhags of four matras, so one group equals one vibhag. This will help you in the rhythm module.\n\nPay attention to shuddh Ma (m). It sits very close to Ga — only a semitone above. Beginners sometimes push Ma upward, making it sound like teevra Ma. Compare Ga and Ma in the Sargam Player to hear how small that step is.\n\nSet the Metronome & Taal tool to 60 bpm, one swara per beat. Do not increase the tempo until you can sing it cleanly three times in a row.',
        hindi:
          "अब हम अलंकार को थोड़ा लंबा करते हैं — चार-चार स्वरों के समूह।\n\nआरोह: S R G m, R G m P, G m P D, m P D N, P D N S'\nअवरोह: S' N D P, N D P m, D P m G, P m G R, m G R S\n\nतर्क वही है जो तीन वाले अलंकार में था: हर समूह एक स्वर ऊपर से शुरू होता है। फ़र्क यह है कि अब हर समूह में चार स्वर हैं, इसलिए साँस की योजना ज़रूरी है। कोशिश कीजिए कि दो समूह (आठ स्वर) एक साँस में हों और बीच में चुपचाप साँस लें; शुरू में हर समूह के बाद साँस लेना भी ठीक है।\n\nचार के समूह का एक फ़ायदा है: ये ताल में स्वाभाविक रूप से बैठते हैं। कहरवा और तीनताल चार-चार मात्रा के विभागों से बने हैं, तो एक समूह = एक विभाग। यह ताल वाले मॉड्यूल में काम आएगा।\n\nशुद्ध म (m) पर ध्यान दीजिए। यह ग के बिल्कुल पास है — सिर्फ़ एक सेमीटोन ऊपर। शुरुआती लोग कभी-कभी म को ऊपर खींच देते हैं, जिससे वह तीव्र म जैसा सुनाई देता है। सरगम प्लेयर में ग और म की तुलना करके सुनिए कि यह कदम कितना छोटा है।\n\nमेट्रोनोम और ताल टूल को 60 bpm पर रखिए, एक मात्रा पर एक स्वर। जब तक लगातार तीन बार साफ़ न गा सकें, लय मत बढ़ाइए।",
      },
      whyItMatters:
        'Longer groups build stamina, breath planning and memory for melodic shapes — exactly what you need for singing full song phrases without losing accuracy.',
      demos: [
        { kind: 'sequence', label: 'Groups of four — aroha', notes: ALANKAR_4.slice(0, 20), bpm: 60 },
        { kind: 'sequence', label: 'Groups of four — avaroha', notes: ALANKAR_4.slice(20), bpm: 60 },
        { kind: 'compare', label: 'Ga vs shuddh Ma — a small half-step', a: 'G', b: 'm' },
      ],
      guidedSteps: [
        'Speak the pattern rhythmically once (aroha and avaroha) before singing.',
        'Play the Ga vs Ma comparison and sing both, noticing the small gap.',
        'Sing the aroha along with the Sargam Player at 60 bpm.',
        'Sing it alone with the Tanpura Drone and the Metronome & Taal at 60 bpm, breathing every two groups.',
        'Repeat with the avaroha, keeping Ma and Ga from sinking.',
        'Record the full alankar in the Recording Journal.',
      ],
      independentPractice: {
        instructions: 'Sing the full groups-of-four alankar three to five times at 60 bpm with the drone. Breathe every one or two groups.',
        durationMin: 12,
        tool: 'sargam',
        pattern: ALANKAR_4,
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Running out of breath mid-group and rushing.', fix: 'Plan breaths in advance — breathe after each group if needed, without breaking the beat.' },
        { mistake: 'Ma sung too high (towards teevra Ma).', fix: 'Compare Ga and Ma repeatedly; shuddh Ma is only a half-step above Ga.' },
        { mistake: 'Speeding up unconsciously.', fix: 'Keep the metronome on; if you drift ahead, slow down and listen to the click.' },
      ],
      quiz: [
        {
          question: 'Which group follows "G m P D" in the aroha?',
          options: ['m P D N', 'P D N S\'', 'G P D N', 'R G m P'],
          answerIndex: 0,
          explanation: 'Each group starts one swara higher: after the group from Ga comes the group from Ma — m P D N.',
        },
        {
          question: 'Why do groups of four fit Keharwa and Teentaal nicely?',
          options: ['Both taals have vibhags of four matras', 'Both taals have 4 matras in total', 'They use only four swaras', 'There is no connection'],
          answerIndex: 0,
          explanation: 'Keharwa (4+4) and Teentaal (4+4+4+4) are built from vibhags of four matras.',
        },
        {
          question: 'How far apart are Ga and shuddh Ma?',
          options: ['A whole step (two semitones)', 'A half step (one semitone)', 'Three semitones', 'They are the same note'],
          answerIndex: 1,
          explanation: 'In the shuddh scale, Ga to Ma is a half step, like Ni to upper Sa.',
        },
        {
          question: 'The last group of the avaroha is…',
          options: ['G R S .N', 'm G R S', 'P m G R', 'S R G m'],
          answerIndex: 1,
          explanation: 'The avaroha ends m G R S, landing back on madhya Sa.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the trickier middle swaras of this alankar, especially Ga and shuddh Ma.',
        targets: ['G', 'm', 'P', 'D', 'm', 'G'],
        minAttempts: 8,
        minSuccessPct: 60,
        toleranceCents: 45,
      },
      videoQueries: ['alankar 4 notes sa re ga ma re ga ma pa practice', 'hindustani vocal paltas beginners'],
      nextStep: 'Next you will learn the skip (jump) and doubling alankars.',
      estMinutes: 25,
    },
    {
      id: 'l2-skip-and-double-alankars',
      level: 2,
      module: 'Alankars & Paltas',
      title: 'Skip and Doubling Alankars',
      objective: 'Sing the skip alankar (S G, R m…) and the doubling alankar (S S, R R…) with accurate jumps and clean repeated notes.',
      explanation: {
        hinglish:
          'Do aur zaroori alankar:\n\n1) Skip (jump) alankar — ek swar chhodkar:\nAroha: S G, R m, G P, m D, P N, D S\'\nAvaroha: S\' D, N P, D m, P G, m R, G S\n\nIsmein aap seedhe agle swar par nahi, ek swar chhodkar jaate ho. Yeh ear training ke liye bahut achha hai, kyunki ab beech ka swar sahara nahi deta — aapko dimaag mein interval (do swaron ka faasla) sunna padta hai. Tip: shuru mein beech wala swar mann mein soch lijiye (S [R] G), phir chhalaang lagaaiye.\n\n2) Doubling alankar — har swar do baar:\nAroha: S S, R R, G G, m m, P P, D D, N N, S\' S\'\nAvaroha: S\' S\', N N, D D, P P, m m, G G, R R, S S\n\nYeh simple lagta hai, lekin ismein ek chhupi hui challenge hai: doosri baar wahi swar bilkul wahi pitch par aana chahiye. Aksar doosra note thoda neeche gir jaata hai. Har pair ko halka sa alag kijiye — jaise "Sa-Sa", ek chhota sa naya shuru, lekin same pitch.\n\nDono alankar 60 bpm par, ek beat ek swar. Jab saaf ho jaayein, tab tempo ladder (agla lesson) ki taraf badhiye.',
        english:
          'Two more essential alankars:\n\n1) Skip (jump) alankar — leaving out one swara:\nAroha: S G, R m, G P, m D, P N, D S\'\nAvaroha: S\' D, N P, D m, P G, m R, G S\n\nHere you do not step to the next swara but jump over one. This is excellent ear training: there is no in-between note to lean on, so you must hear the interval (the distance between two swaras) in your mind. Tip: at first, think the skipped note silently (S [R] G) before jumping.\n\n2) Doubling alankar — each swara twice:\nAroha: S S, R R, G G, m m, P P, D D, N N, S\' S\'\nAvaroha: S\' S\', N N, D D, P P, m m, G G, R R, S S\n\nThis looks easy but hides a challenge: the second note must return to exactly the same pitch. Often the repeat sags slightly. Give each pair a gentle re-articulation — "Sa-Sa", a small fresh start on the same pitch.\n\nPractise both at 60 bpm, one swara per beat. Once they are clean, move on to the tempo ladder in the next lesson.',
        hindi:
          "दो और ज़रूरी अलंकार:\n\n1) छलाँग (स्किप) अलंकार — एक स्वर छोड़कर:\nआरोह: S G, R m, G P, m D, P N, D S'\nअवरोह: S' D, N P, D m, P G, m R, G S\n\nइसमें आप अगले स्वर पर नहीं जाते, बल्कि एक स्वर लाँघते हैं। यह कान की तालीम के लिए बहुत अच्छा है: बीच का कोई स्वर सहारा नहीं देता, इसलिए आपको दो स्वरों की दूरी (अंतराल) मन में सुननी पड़ती है। सुझाव: शुरू में छूटे हुए स्वर को मन में सोच लीजिए (S [R] G), फिर छलाँग लगाइए।\n\n2) दोहरा अलंकार — हर स्वर दो बार:\nआरोह: S S, R R, G G, m m, P P, D D, N N, S' S'\nअवरोह: S' S', N N, D D, P P, m m, G G, R R, S S\n\nयह आसान दिखता है, पर इसमें एक छिपी चुनौती है: दूसरी बार स्वर ठीक उसी सुर पर लौटना चाहिए। अक्सर दोहराया हुआ स्वर थोड़ा नीचे गिर जाता है। हर जोड़ी को हल्के से दोबारा उच्चारित कीजिए — \"सा-सा\", उसी सुर पर एक छोटी-सी नई शुरुआत।\n\nदोनों को 60 bpm पर, एक मात्रा पर एक स्वर गाइए। जब ये साफ़ हो जाएँ, तब अगले पाठ की लय-सीढ़ी (टेम्पो लैडर) पर बढ़िए।",
      },
      whyItMatters:
        'Song melodies jump as often as they step. The skip alankar builds reliable interval hearing; the doubling alankar trains you to repeat notes accurately — common in lyrics where several syllables sit on one note.',
      demos: [
        { kind: 'sequence', label: 'Skip alankar — up and down', notes: ALANKAR_SKIP, bpm: 60 },
        { kind: 'sequence', label: 'Doubling alankar — up and down', notes: ALANKAR_DOUBLE, bpm: 60 },
        { kind: 'compare', label: 'The jump Sa to Ga', a: 'S', b: 'G' },
      ],
      guidedSteps: [
        'Play the Sa–Ga comparison and sing the jump several times until it feels sure.',
        'Sing the skip alankar aroha slowly, silently thinking the skipped note before each jump.',
        'Sing the skip avaroha. Check D and m on the way down in the Pitch Matcher.',
        'Now sing the doubling alankar with the Sargam Player at 60 bpm, re-articulating each repeated note.',
        'Sing both alankars with only the Tanpura Drone and the Metronome & Taal.',
        'Record both in the Recording Journal; listen for repeats that sag.',
      ],
      independentPractice: {
        instructions: 'Alternate: skip alankar twice, doubling alankar twice, at 60 bpm. Repeat this set two or three times.',
        durationMin: 12,
        tool: 'sargam',
        pattern: [...ALANKAR_SKIP, ...ALANKAR_DOUBLE],
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Undershooting jumps (landing below the target note).', fix: 'Hear the target in your head first; aim slightly "on top" of the note rather than reaching up to it.' },
        { mistake: 'The second note of a pair sagging flat.', fix: 'Keep breath support steady and re-articulate lightly on the same pitch.' },
        { mistake: 'Sliding between jump notes.', fix: 'Move cleanly from one note to the next; smooth glides are a separate skill.' },
      ],
      quiz: [
        {
          question: 'In the skip alankar, which pair comes after "S G, R m"?',
          options: ['G P', 'm D', 'R G', 'G m'],
          answerIndex: 0,
          explanation: 'Each pair starts one swara higher and skips one: S G, R m, G P, m D…',
        },
        {
          question: 'The skip alankar avaroha begins with…',
          options: ["S' N", "S' D", "N D", "S' P"],
          answerIndex: 1,
          explanation: "Coming down from upper Sa you skip Ni: S' D, then N P, D m…",
        },
        {
          question: 'What is the main challenge in the doubling alankar?',
          options: ['Singing very fast', 'Repeating each note at exactly the same pitch', 'Reaching very low notes', 'Clapping the taal'],
          answerIndex: 1,
          explanation: 'Repeated notes often sag; the exercise trains accurate re-articulation on the same pitch.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the jump targets of the skip alankar, checking each lands accurately.',
        targets: ['S', 'G', 'R', 'm', 'G', 'P', 'm', 'D'],
        minAttempts: 8,
        minSuccessPct: 60,
        toleranceCents: 45,
      },
      videoQueries: ['sa ga re ma ga pa alankar practice', 'sargam alankar double notes sa sa re re practice'],
      nextStep: 'Now learn how and when to increase tempo safely with the tempo ladder.',
      estMinutes: 25,
    },
    {
      id: 'l2-tempo-ladder',
      level: 2,
      module: 'Alankars & Paltas',
      title: 'The Tempo Ladder: Slow, Medium, Faster',
      objective: 'Use a metronome to practise alankars at slow, medium and faster tempos, moving up only after control at the slower speed.',
      explanation: {
        hinglish:
          'Riyaz ka sabse important rule: pehle control, phir speed. Jab tak koi alankar dheere mein bilkul saaf aur relaxed na ho, use tez gaane se sirf galtiyaan pakki hoti hain.\n\nTempo ladder aise kaam karta hai:\n• 60 bpm (slow): har swar ek beat. Yahan sur ki accuracy aur saans par dhyan.\n• 80 bpm (medium): jab 60 par teen baar lagaatar saaf ho jaaye.\n• 100 bpm (faster): jab 80 par bhi teen baar saaf aur aaraam se ho jaaye.\n\nAgar kisi bhi step par sur bigadne lage, gala tight ho, ya aap metronome se aage-peeche ho jaao — ek step neeche aa jaaiye. Yeh haar nahi, sahi riyaz hai. Bade ustaad bhi dheemi laya mein ghanton riyaz karte hain.\n\nMetronome kya hai? Yeh ek machine (ya app tool) hai jo ek jaise, barabar click deta hai — jaise ghadi ki tik-tik. bpm matlab beats per minute: 60 bpm = har second ek click. Metronome & Taal tool kholiye, 60 set kijiye, aur pehle sirf click ke saath taali bajaaiye. Phir alankar gaaiye.\n\nEk aur cheez: tez gaate waqt awaaz halki rakhiye. Speed aur zor ek saath nahi chalte. Light, agile awaaz se hi tez patterns saaf nikalte hain.',
        english:
          'The most important rule of riyaz: control first, speed later. If an alankar is not clean and relaxed slowly, singing it faster only cements mistakes.\n\nThe tempo ladder works like this:\n• 60 bpm (slow): one swara per beat. Focus on accuracy and breath.\n• 80 bpm (medium): only after three clean runs in a row at 60.\n• 100 bpm (faster): only after three clean, relaxed runs at 80.\n\nIf at any step your pitch becomes vague, your throat tightens, or you drift ahead of or behind the click, step back down a rung. That is not failure — it is correct practice. Experienced classical singers spend hours in slow tempo too.\n\nWhat is a metronome? It is a device (or app tool) that produces perfectly even clicks, like a ticking clock. bpm means beats per minute: 60 bpm is one click per second. Open the Metronome & Taal tool, set it to 60, and first just clap with the click. Then sing the alankar.\n\nOne more point: as tempo rises, lighten the voice. Speed and loudness do not go together; quick patterns come out clean from a light, agile voice, not a heavy one.',
        hindi:
          "रियाज़ का सबसे ज़रूरी नियम: पहले नियंत्रण, फिर गति। अगर कोई अलंकार धीमी लय में साफ़ और आरामदायक नहीं है, तो उसे तेज़ गाने से बस गलतियाँ पक्की होती हैं।\n\nलय-सीढ़ी ऐसे काम करती है:\n• 60 bpm (धीमी): एक मात्रा पर एक स्वर। सुर की शुद्धता और साँस पर ध्यान।\n• 80 bpm (मध्यम): तभी, जब 60 पर लगातार तीन बार साफ़ हो जाए।\n• 100 bpm (तेज़): तभी, जब 80 पर भी तीन बार साफ़ और आराम से हो जाए।\n\nअगर किसी भी पायदान पर सुर धुँधला होने लगे, गला कसने लगे, या आप क्लिक से आगे-पीछे होने लगें — एक पायदान नीचे आ जाइए। यह हार नहीं, सही रियाज़ है। अनुभवी शास्त्रीय गायक भी घंटों धीमी लय में अभ्यास करते हैं।\n\nमेट्रोनोम क्या है? यह एक यंत्र (या ऐप टूल) है जो बिल्कुल बराबर क्लिक देता है, जैसे घड़ी की टिक-टिक। bpm का मतलब है beats per minute (प्रति मिनट बीट या क्लिक): 60 bpm यानी हर सेकंड एक क्लिक। मेट्रोनोम और ताल टूल खोलिए, 60 पर रखिए, और पहले सिर्फ़ क्लिक के साथ ताली बजाइए। फिर अलंकार गाइए।\n\nएक बात और: लय बढ़ने पर आवाज़ हल्की कीजिए। गति और ज़ोर साथ नहीं चलते; तेज़ पैटर्न हल्की, फुर्तीली आवाज़ से ही साफ़ निकलते हैं, भारी आवाज़ से नहीं।",
      },
      whyItMatters:
        'Songs come in all tempos. Building speed gradually on top of accuracy gives you agility without sloppiness — and protects the voice from strain.',
      traditionNote:
        'The specific numbers 60/80/100 bpm are a practical guideline for this app, not a traditional rule. The principle — slow, steady practice before speed — is shared by Hindustani and Western teaching alike.',
      demos: [
        { kind: 'sequence', label: 'Groups-of-three alankar at 60 bpm', notes: ALANKAR_3, bpm: 60 },
        { kind: 'sequence', label: 'Same alankar at 80 bpm', notes: ALANKAR_3, bpm: 80 },
        { kind: 'sequence', label: 'Same alankar at 100 bpm', notes: ALANKAR_3, bpm: 100 },
      ],
      guidedSteps: [
        'Open Metronome & Taal at 60 bpm. Clap with the click for 16 beats to feel the pulse.',
        'Sing the groups-of-three alankar at 60 bpm with the Tanpura Drone. Repeat until you get three clean runs in a row.',
        'Raise to 80 bpm. Sing the same alankar, lighter in voice. Need three clean runs before moving on.',
        'Only if 80 is comfortable, try 100 bpm. If pitch gets vague, go back to 80.',
        'Repeat the ladder with the groups-of-four alankar on another day.',
        'Note your highest comfortable tempo for each alankar in the Recording Journal.',
      ],
      independentPractice: {
        instructions:
          'Climb the ladder: 60 bpm until three clean runs, then 80 bpm, then 100 bpm only if 80 was easy. Step back whenever accuracy drops.',
        durationMin: 15,
        tool: 'metronome',
        pattern: ALANKAR_3,
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Jumping to fast tempos because it feels exciting.', fix: 'Follow the three-clean-runs rule at each tempo before moving up.' },
        { mistake: 'Singing louder as tempo increases.', fix: 'Lighten the voice and keep the mouth relaxed as you speed up.' },
        { mistake: 'Ignoring the click and rushing.', fix: 'Clap with the metronome first; if you rush while singing, lower the tempo.' },
      ],
      quiz: [
        {
          question: 'When should you move from 60 bpm to 80 bpm?',
          options: ['After one attempt', 'When you can sing it cleanly and relaxed several times in a row at 60', 'Whenever you feel bored', 'After exactly one week'],
          answerIndex: 1,
          explanation: 'Speed is earned by control. The guideline here is three clean, relaxed runs in a row.',
        },
        {
          question: 'What does 60 bpm mean?',
          options: ['60 notes per second', 'One beat per second', '60 beats per hour', '60 taals per minute'],
          answerIndex: 1,
          explanation: 'bpm = beats per minute; 60 bpm is one click every second.',
        },
        {
          question: 'Your pitch becomes vague at 100 bpm. What should you do?',
          options: ['Push harder', 'Go back to 80 bpm', 'Sing louder', 'Skip to 120 bpm'],
          answerIndex: 1,
          explanation: 'Step down to the last tempo where you had full control and build up again.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'These are self-reported — be honest. A pitch detector cannot judge comfort and evenness at speed.',
        items: [
          'I sang the groups-of-three alankar three times cleanly in a row at 60 bpm.',
          'I sang it comfortably and in time at 80 bpm.',
          'I stepped back to a slower tempo whenever accuracy dropped, instead of pushing on.',
        ],
      },
      videoQueries: ['how to practice alankar with metronome', 'riyaz speed badhane ka tarika alankar'],
      nextStep: 'Next, learn to connect notes smoothly with gentle transitions.',
      estMinutes: 25,
      safetyNote: 'Fast practice should feel light. If your throat tightens or you feel any pain, slow down or stop for the day.',
    },
    {
      id: 'l2-gentle-transitions',
      level: 2,
      module: 'Alankars & Paltas',
      title: 'Gentle Transitions Between Notes',
      objective: 'Connect adjacent swaras smoothly and land precisely, using light glides as an introduction (not yet formal meend).',
      explanation: {
        hinglish:
          'Ab tak humne har swar ko alag-alag, saaf lagaaya. Lekin gaane mein swar aapas mein jude hote hain — ek swar se doosre tak awaaz "behti" hai. Is lesson mein hum seekhenge ki ek swar se agle swar tak smoothly kaise jaayein, bina jhatke ke aur bina galat note par atke.\n\nDo tarah ke transition practice karenge:\n1) Legato (juda hua) — saans todhe bina S se R, R se G. Awaaz continuous rahe, lekin har note par saaf land ho.\n2) Light glide — S se G tak dheere slide, jaise awaaz ek dhalaan par chal rahi ho. End mein target note par bilkul sahi rukna zaroori hai.\n\nZaroori baat: classical music mein meend ek formal aur bahut sundar technique hai, jismein raga ke rules ke hisaab se swaron ke beech khaas tarike se glide kiya jaata hai. Yeh lesson meend nahi hai — yeh sirf uski taraf pehla chhota kadam hai, taaki aawaaz connected rehna seekhe. Formal meend aage ke level mein aayega.\n\nGlide aur "scooping" mein fark samjhiye: glide jaan-boojhkar, controlled aur target tak saaf pahunchta hai. Scooping ek galti hai jismein har note neeche se ghisatkar shuru hota hai. Glide sundar hai, scooping nahi.',
        english:
          'So far you have placed each swara separately and cleanly. In songs, however, swaras are connected — the voice flows from one to the next. In this lesson you learn to move smoothly between notes without jerks and without getting stuck on wrong pitches.\n\nTwo kinds of transitions:\n1) Legato (connected) — S to R, R to G without breaking the breath. The sound is continuous, but each note lands clearly.\n2) Light glide — sliding slowly from S up to G, as if the voice is walking up a ramp. The important part is arriving exactly on the target and stopping there.\n\nImportant: in classical music, meend is a formal and beautiful technique in which the voice glides between swaras in specific ways governed by the raga. This lesson is not meend; it is just a first small step so that your voice learns to stay connected. Formal meend comes in a later level.\n\nUnderstand the difference between a glide and a "scoop": a glide is deliberate, controlled and lands cleanly on its target. A scoop is a habit where every note starts from below and slides up. Glides are expressive; scooping is a fault.',
        hindi:
          "अब तक आपने हर स्वर को अलग-अलग, साफ़ लगाया है। लेकिन गानों में स्वर आपस में जुड़े होते हैं — आवाज़ एक स्वर से अगले तक बहती है। इस पाठ में आप सीखेंगे कि बिना झटके और बिना गलत सुर पर अटके, एक स्वर से दूसरे तक सहजता से कैसे जाएँ।\n\nदो तरह के जोड़:\n1) लेगाटो (जुड़ा हुआ) — साँस तोड़े बिना S से R, R से G। आवाज़ लगातार रहे, पर हर स्वर पर साफ़ उतरे।\n2) हल्का ग्लाइड — S से G तक धीरे-धीरे फिसलना, जैसे आवाज़ किसी ढलान पर चढ़ रही हो। सबसे ज़रूरी है ठीक लक्ष्य स्वर पर पहुँचकर वहीं रुकना।\n\nज़रूरी बात: शास्त्रीय संगीत में मींड एक औपचारिक और बहुत सुंदर तकनीक है, जिसमें राग के नियमों के अनुसार स्वरों के बीच ख़ास तरीके से फिसला जाता है। यह पाठ मींड नहीं है; यह बस पहला छोटा कदम है ताकि आपकी आवाज़ जुड़ी रहना सीखे। औपचारिक मींड आगे के लेवल में आएगी।\n\nग्लाइड और \"स्कूप\" का फ़र्क समझिए: ग्लाइड जान-बूझकर, नियंत्रित होता है और अपने लक्ष्य पर साफ़ उतरता है। स्कूप एक आदत है जिसमें हर स्वर नीचे से घिसटकर ऊपर चढ़ता है। ग्लाइड भावपूर्ण है; स्कूप एक दोष है।",
      },
      whyItMatters:
        'Bollywood singing relies heavily on smooth connections between notes. Learning controlled transitions now prevents the scooping habit and prepares you for meend and expressive phrasing later.',
      traditionNote:
        'This is a simplified exercise. Real meend in Hindustani music follows raga grammar (which notes may be touched, how slowly, in which direction) and is taught carefully over time.',
      demos: [
        { kind: 'glide', label: 'Light glide Sa → Ga', from: 'S', to: 'G', durationSec: 2 },
        { kind: 'glide', label: 'Light glide Pa → Ga (downward)', from: 'P', to: 'G', durationSec: 2 },
        { kind: 'sequence', label: 'Connected (legato) S R G m P m G R S', notes: ['S', 'R', 'G', 'm', 'P', 'm', 'G', 'R', 'S'], bpm: 60 },
      ],
      guidedSteps: [
        'Sing S – R – G – R – S on "Aa" in one breath, connected but landing clearly on each note, with the Tanpura Drone.',
        'Play the Sa → Ga glide demo. Copy it slowly, stopping exactly on Ga.',
        'Check in the Pitch Matcher that the glide ends on Ga, not below or above.',
        'Try a downward glide from Pa to Ga, landing precisely.',
        'Now sing S R G m P m G R S legato at 60 bpm, with no gaps.',
        'Record in the Recording Journal and listen for any notes that start with a scoop from below.',
      ],
      independentPractice: {
        instructions: 'Sing the connected pattern on "Aa" in one breath, then practise five slow glides each of S→G and P→G, landing exactly.',
        durationMin: 10,
        tool: 'pitch-match',
        pattern: ['S', 'R', 'G', 'm', 'P', 'm', 'G', 'R', 'S'],
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Scooping into every note from below.', fix: 'Hear the target first and start the note directly on it; only glide when you choose to.' },
        { mistake: 'Overshooting the target at the end of a glide.', fix: 'Slow the glide down and "brake" as you approach the target.' },
        { mistake: 'Breaking the breath between legato notes.', fix: 'Keep a steady flow of air and change notes without stopping the sound.' },
      ],
      quiz: [
        {
          question: 'What is the key difference between a controlled glide and a scoop?',
          options: ['A glide is louder', 'A glide is deliberate and lands precisely; a scoop is an unintentional slide into every note', 'There is no difference', 'A scoop is used in ragas'],
          answerIndex: 1,
          explanation: 'Glides are chosen and controlled. Scooping is an unintended habit that blurs pitch.',
        },
        {
          question: 'Is the glide exercise in this lesson the same as formal meend?',
          options: ['Yes, exactly the same', 'No — it is a simplified first step; meend follows raga rules', 'Meend is a taal', 'Meend means singing in the low octave'],
          answerIndex: 1,
          explanation: 'Meend is a refined ornament governed by raga grammar. This is only a preparation.',
        },
        {
          question: 'Legato singing means…',
          options: ['Each note detached with silence between', 'Notes connected smoothly without breaking the sound', 'Singing very fast', 'Singing only Sa'],
          answerIndex: 1,
          explanation: 'Legato is connected singing; the breath and tone continue between notes.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the landing notes of the glides and the connected pattern — accurate arrivals matter most.',
        targets: ['S', 'R', 'G', 'm', 'P'],
        minAttempts: 8,
        minSuccessPct: 60,
        toleranceCents: 45,
      },
      videoQueries: ['legato singing exercise beginners', 'meend introduction hindustani vocal beginners'],
      nextStep: 'Now move to rhythm: learn the building blocks of taal and how they differ from a metronome.',
      estMinutes: 20,
    },

    // ───────────────────────── Module 3: Rhythm & Taal ─────────────────────────
    {
      id: 'l2-rhythm-and-taal-basics',
      level: 2,
      module: 'Rhythm & Taal',
      title: 'Rhythm Basics: Matra, Vibhag, Sam, Tali, Khali',
      objective: 'Understand the core taal vocabulary — matra, vibhag, sam, tali, khali, theka, avartan, laya — and how a taal differs from a metronome.',
      explanation: {
        hinglish:
          'Indian music mein rhythm ka system taal kehlata hai. Taal ek fixed cycle hai jo baar-baar ghoomta hai. Iske kuch zaroori shabd:\n\n• Matra — ek beat. Teentaal mein 16 matra hoti hain.\n• Vibhag — matraon ka group (section). Jaise Teentaal = 4+4+4+4.\n• Sam — cycle ki pehli matra, sabse important beat. Notation mein X se dikhaate hain. Gaana aur tabla dono aksar sam par milte hain.\n• Tali — clap wala vibhag; is vibhag ki pehli matra par taali.\n• Khali — "khaali" vibhag; taali ki jagah haath hilaate hain (wave). Notation mein 0. Khali sunne mein halka hota hai aur aapko batata hai ki sam abhi door hai ya paas.\n• Theka — tabla ke bols ka standard pattern jo taal ki pehchaan hai, jaise Keharwa: Dha Ge Na Ti | Na Ka Dhi Na.\n• Avartan — taal ka ek poora cycle (sam se agle sam tak).\n• Laya — tempo. Vilambit = dheema, madhya = beech ka, drut = tez.\n\nMetronome aur taal mein fark: metronome har click ko barabar bajaata hai — usmein koi "pehli beat" ya structure nahi hota. Taal ke andar structure hai: sam par zor, tali par taali, khali par wave, aur theka ke bols. Isliye taal ke saath aap hamesha jaante ho ki cycle mein kahan ho. Metronome steady speed ke liye achha hai; taal musical structure ke liye.',
        english:
          'The rhythm system of Indian music is called taal. A taal is a fixed cycle of beats that repeats. Key terms:\n\n• Matra — one beat. Teentaal has 16 matras.\n• Vibhag — a section or group of matras, e.g. Teentaal = 4+4+4+4.\n• Sam — the first matra of the cycle, the most important beat, marked X in notation. Singers and tabla players typically converge on sam.\n• Tali — a clapped vibhag; you clap on its first matra.\n• Khali — the "empty" vibhag; instead of clapping you wave the hand. Marked 0. It sounds lighter on the tabla and tells you where you are relative to sam.\n• Theka — the standard pattern of tabla syllables (bols) that identifies a taal, e.g. Keharwa: Dha Ge Na Ti | Na Ka Dhi Na.\n• Avartan — one full cycle of the taal, from sam back to sam.\n• Laya — tempo. Vilambit = slow, madhya = medium, drut = fast.\n\nMetronome vs taal: a metronome gives perfectly even clicks with no built-in "first beat" or structure. A taal has structure: weight on sam, claps on tali, waves on khali, and the theka bols. With a taal you always know where you are within the cycle. Use a metronome for steady speed; use taal for musical structure.',
        hindi:
          "भारतीय संगीत में लय की व्यवस्था को ताल कहते हैं। ताल मात्राओं का एक तय चक्र है जो बार-बार दोहराया जाता है। मुख्य शब्द:\n\n• मात्रा — एक बीट। तीनताल में 16 मात्राएँ होती हैं।\n• विभाग — मात्राओं का समूह (हिस्सा), जैसे तीनताल = 4+4+4+4।\n• सम — चक्र की पहली मात्रा, सबसे महत्वपूर्ण बीट; लिपि में X से दिखाते हैं। गायक और तबला वादक आमतौर पर सम पर आकर मिलते हैं।\n• ताली — ताली वाला विभाग; उसकी पहली मात्रा पर ताली बजाते हैं।\n• खाली — \"खाली\" विभाग; ताली की जगह हाथ हिलाते हैं (वेव)। लिपि में 0। तबले पर यह हल्का सुनाई देता है और बताता है कि आप सम से कितनी दूर हैं।\n• ठेका — तबले के बोलों का मानक पैटर्न जिससे ताल पहचानी जाती है, जैसे कहरवा: Dha Ge Na Ti | Na Ka Dhi Na।\n• आवर्तन — ताल का एक पूरा चक्र, सम से अगले सम तक।\n• लय — गति (टेम्पो)। विलंबित = धीमी, मध्य = बीच की, द्रुत = तेज़।\n\nमेट्रोनोम और ताल का फ़र्क: मेट्रोनोम बिल्कुल बराबर क्लिक देता है, उसमें कोई \"पहली बीट\" या ढाँचा नहीं होता। ताल में ढाँचा है: सम पर वज़न, ताली पर ताली, खाली पर वेव, और ठेके के बोल। ताल के साथ आप हमेशा जानते हैं कि चक्र में कहाँ हैं। स्थिर गति के लिए मेट्रोनोम; संगीत के ढाँचे के लिए ताल।",
      },
      whyItMatters:
        'Every song you sing sits on a taal (often Keharwa or Dadra in Bollywood). Knowing where sam and khali fall helps you start lines at the right moment and stay in time with accompaniment.',
      traditionNote:
        'Bhatkhande notation (used in North Indian schools) marks sam as X, khali as 0, and other talis by their number (2, 3…). Some regions use different markings, but the concepts are the same.',
      demos: [
        { kind: 'taal', label: 'Keharwa — listen for sam and khali', taal: 'keharwa', bpm: 80, cycles: 2 },
        { kind: 'taal', label: 'Teentaal at slow laya', taal: 'teentaal', bpm: 60, cycles: 1 },
      ],
      guidedSteps: [
        'Open Metronome & Taal in plain metronome mode at 60 bpm and clap every click — notice that all clicks feel equal.',
        'Switch to Keharwa at 80 bpm. Listen for one avartan, noticing the stronger sam and the lighter khali.',
        'Count aloud "1 2 3 4 5 6 7 8" with Keharwa, saying "sam" on 1 and "khali" on 5.',
        'Speak the Keharwa theka bols along with the tool: Dha Ge Na Ti | Na Ka Dhi Na.',
        'Write the terms matra, vibhag, sam, tali, khali, theka, avartan and laya in your own words in the Recording Journal notes.',
      ],
      independentPractice: {
        instructions: 'Listen to three avartans each of Keharwa and Teentaal, counting matras aloud and saying "sam" on beat 1 of each cycle.',
        durationMin: 10,
        tool: 'taal',
        bpm: 70,
      },
      mistakes: [
        { mistake: 'Thinking khali means silence.', fix: 'Khali is a beat that is played lightly (and waved, not clapped). The rhythm continues.' },
        { mistake: 'Treating every beat as equal, like a metronome.', fix: 'Feel the weight on sam and the shape of the vibhags.' },
        { mistake: 'Confusing laya with taal.', fix: 'Taal is the cycle structure; laya is how fast it goes. The same taal can be vilambit or drut.' },
      ],
      quiz: [
        {
          question: 'What is "sam"?',
          options: ['The khali beat', 'The first and most important matra of the cycle', 'The last beat', 'A tabla bol'],
          answerIndex: 1,
          explanation: 'Sam is matra 1, marked X; the cycle starts and resolves there.',
        },
        {
          question: 'One complete cycle of a taal is called…',
          options: ['Vibhag', 'Avartan', 'Laya', 'Theka'],
          answerIndex: 1,
          explanation: 'An avartan is one full cycle from sam to sam.',
        },
        {
          question: 'Drut laya means…',
          options: ['Slow tempo', 'Medium tempo', 'Fast tempo', 'No tempo'],
          answerIndex: 2,
          explanation: 'Vilambit is slow, madhya medium, drut fast.',
        },
        {
          question: 'What does a taal give you that a plain metronome does not?',
          options: ['A faster tempo', 'A cycle structure with sam, tali and khali', 'Perfect pitch', 'Nothing — they are identical'],
          answerIndex: 1,
          explanation: 'A metronome only gives even pulses; a taal organises them into a structured cycle.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Self-reported: theory and counting skills are checked mainly by the quiz.',
        items: [
          'I can explain matra, vibhag, sam, tali, khali, theka, avartan and laya in my own words.',
          'I counted Keharwa aloud for three avartans and said "sam" on beat 1 each time.',
        ],
      },
      videoQueries: ['taal basics matra vibhag sam khali explained hindi', 'what is theka in tabla beginners'],
      nextStep: 'Now put this into your hands: clap Keharwa and Dadra.',
      estMinutes: 20,
    },
    {
      id: 'l2-keharwa-and-dadra',
      level: 2,
      module: 'Rhythm & Taal',
      title: 'Clapping Keharwa and Dadra',
      objective: 'Clap and wave Keharwa (8 matras) and Dadra (6 matras) while counting aloud and reciting the theka.',
      explanation: {
        hinglish:
          'Bollywood aur light music ke do sabse common taal: Keharwa aur Dadra.\n\nKeharwa — 8 matra, do vibhag (4+4).\nMatra: 1 2 3 4 | 5 6 7 8\nTheka: Dha Ge Na Ti | Na Ka Dhi Na\nMatra 1 = sam (taali, X). Matra 5 = khali (wave, 0).\nKeharwa ka feel seedha, chalta hua hai — bahut saare filmi gaane aur bhajan isi mein hote hain.\n\nDadra — 6 matra, do vibhag (3+3).\nMatra: 1 2 3 | 4 5 6\nTheka: Dha Dhi Na | Dha Tu Na\nMatra 1 = sam (taali, X). Matra 4 = khali (wave, 0).\nDadra ka feel jhoomta hua, waltz jaisa hai — kai romantic aur folk songs isi mein hote hain.\n\nClapping kaise karein: sam par taali, khali par haath ko halka sa side mein hilaaiye (palm upar ki taraf, ya haath ka wave). Baaki matraon par ungliyon se gin sakte hain — jaise anguthe ko ungliyon par touch karna — taaki aap jagah na bhoolein. Saath mein zor se gintiye: "1 2 3 4, 5 6 7 8" ya theka ke bol boliye.\n\nPehle dheemi laya (60–70 bpm) mein, Metronome & Taal tool ke saath. Jab haath aur aawaaz bina soche saath chalne lagein, tab hi speed badhaaiye.',
        english:
          'The two most common taals in Bollywood and light music are Keharwa and Dadra.\n\nKeharwa — 8 matras, two vibhags (4+4).\nMatras: 1 2 3 4 | 5 6 7 8\nTheka: Dha Ge Na Ti | Na Ka Dhi Na\nMatra 1 = sam (clap, X). Matra 5 = khali (wave, 0).\nKeharwa has a straight, walking feel — countless film songs and bhajans use it.\n\nDadra — 6 matras, two vibhags (3+3).\nMatras: 1 2 3 | 4 5 6\nTheka: Dha Dhi Na | Dha Tu Na\nMatra 1 = sam (clap, X). Matra 4 = khali (wave, 0).\nDadra has a lilting, waltz-like sway — common in romantic and folk-flavoured songs.\n\nHow to clap: clap on sam; on khali, gently wave the hand to the side (or turn the palm up). On the other matras you can count on your fingers — for example, touching the thumb to each finger — so you never lose your place. At the same time, count aloud ("1 2 3 4, 5 6 7 8") or recite the theka bols.\n\nStart at a slow laya (60–70 bpm) with the Metronome & Taal tool. Only speed up once hands and voice move together without effort.',
        hindi:
          "बॉलीवुड और सुगम संगीत की दो सबसे आम तालें हैं कहरवा और दादरा।\n\nकहरवा — 8 मात्राएँ, दो विभाग (4+4)।\nमात्राएँ: 1 2 3 4 | 5 6 7 8\nठेका: Dha Ge Na Ti | Na Ka Dhi Na\nमात्रा 1 = सम (ताली, X)। मात्रा 5 = खाली (वेव, 0)।\nकहरवा की चाल सीधी, चलती हुई है — अनगिनत फ़िल्मी गीत और भजन इसी में हैं।\n\nदादरा — 6 मात्राएँ, दो विभाग (3+3)।\nमात्राएँ: 1 2 3 | 4 5 6\nठेका: Dha Dhi Na | Dha Tu Na\nमात्रा 1 = सम (ताली, X)। मात्रा 4 = खाली (वेव, 0)।\nदादरा की चाल झूमती हुई, वॉल्ट्ज़ जैसी है — रोमांटिक और लोक-रंग वाले गीतों में आम।\n\nताली कैसे दें: सम पर ताली; खाली पर हाथ को हल्के से बगल में हिलाइए (या हथेली ऊपर पलटिए)। बाकी मात्राओं पर उँगलियों पर गिन सकते हैं — जैसे अँगूठे से हर उँगली को छूना — ताकि आप जगह न भूलें। साथ ही ज़ोर से गिनिए (\"1 2 3 4, 5 6 7 8\") या ठेके के बोल बोलिए।\n\nधीमी लय (60–70 bpm) में मेट्रोनोम और ताल टूल के साथ शुरू कीजिए। जब हाथ और आवाज़ बिना सोचे साथ चलने लगें, तभी गति बढ़ाइए।",
      },
      whyItMatters:
        'Most Bollywood songs you will sing are in Keharwa or Dadra. Feeling where sam and khali fall helps you enter lines on time and keep steady rhythm with the music.',
      traditionNote:
        'Theka bols can vary slightly between tabla traditions (e.g. Keharwa is sometimes written Dha Ge Na Tin | Na Ke Dhin Na, and Dadra as Dha Dhin Na | Dha Tin Na). The structure — 4+4 with khali on 5, and 3+3 with khali on 4 — is standard.',
      demos: [
        { kind: 'taal', label: 'Keharwa at 70 bpm', taal: 'keharwa', bpm: 70, cycles: 4 },
        { kind: 'taal', label: 'Dadra at 70 bpm', taal: 'dadra', bpm: 70, cycles: 4 },
      ],
      guidedSteps: [
        'Open Metronome & Taal, choose Keharwa at 60 bpm, and just listen to two avartans.',
        'Clap on 1, wave on 5, finger-count the rest, while counting "1 2 3 4 5 6 7 8" aloud.',
        'Now recite the theka bols instead of numbers: Dha Ge Na Ti | Na Ka Dhi Na, still clapping and waving.',
        'Switch to Dadra at 60 bpm. Clap on 1, wave on 4, counting "1 2 3 4 5 6".',
        'Recite the Dadra theka: Dha Dhi Na | Dha Tu Na, with clap and wave.',
        'Raise to 80 bpm only when both feel automatic. Optionally sing S R G m | P m G R over Keharwa, one note per matra.',
      ],
      independentPractice: {
        instructions: 'Five avartans of Keharwa, then five of Dadra, clapping/waving and counting aloud. Then repeat while reciting the theka.',
        durationMin: 10,
        tool: 'taal',
        bpm: 70,
      },
      mistakes: [
        { mistake: 'Clapping on khali.', fix: 'Say "wave" aloud on the khali matra (5 in Keharwa, 4 in Dadra) until the hand learns it.' },
        { mistake: 'Losing count in the middle of the cycle.', fix: 'Use finger-counting on the non-clap matras and count aloud.' },
        { mistake: 'Speeding up while clapping.', fix: 'Keep the Metronome & Taal tool on and stay with it; slow down if needed.' },
      ],
      quiz: [
        {
          question: 'Where is the khali in Keharwa?',
          options: ['Matra 1', 'Matra 3', 'Matra 5', 'Matra 8'],
          answerIndex: 2,
          explanation: 'Keharwa is 4+4: sam on 1, khali on 5.',
        },
        {
          question: 'How many matras does Dadra have, and how are they divided?',
          options: ['8 as 4+4', '6 as 3+3', '16 as 4+4+4+4', '7 as 3+2+2'],
          answerIndex: 1,
          explanation: 'Dadra has 6 matras in two vibhags of 3.',
        },
        {
          question: 'Which is the Dadra theka?',
          options: ['Dha Ge Na Ti | Na Ka Dhi Na', 'Dha Dhi Na | Dha Tu Na', 'Dha Dhin Dhin Dha | Dha Tin Tin Ta', 'Ta Ki Ta | Dha Dhi Na'],
          answerIndex: 1,
          explanation: 'Dadra: Dha Dhi Na | Dha Tu Na. The first option is Keharwa.',
        },
        {
          question: 'In Dadra you wave the hand on matra…',
          options: ['1', '3', '4', '6'],
          answerIndex: 2,
          explanation: 'Khali in Dadra falls on matra 4, the start of the second vibhag.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Self-reported: clapping accuracy is something you judge honestly while playing along with the Metronome & Taal tool.',
        items: [
          'I clapped Keharwa for five avartans with the clap on 1 and wave on 5, counting aloud, without losing my place.',
          'I clapped Dadra for five avartans with the clap on 1 and wave on 4, counting aloud.',
          'I recited both thekas while clapping, in time with the tool.',
        ],
      },
      videoQueries: ['keharwa taal clapping tutorial', 'dadra taal theka clapping hindi'],
      nextStep: 'Next comes Teentaal — the most important taal of Hindustani classical music.',
      estMinutes: 20,
    },
    {
      id: 'l2-teentaal-clapping',
      level: 2,
      module: 'Rhythm & Taal',
      title: 'Clapping Teentaal',
      objective: 'Clap Teentaal (16 matras) with claps on 1, 5, 13 and a wave on 9, counting aloud and reciting the theka.',
      explanation: {
        hinglish:
          'Teentaal Hindustani classical music ka sabse popular taal hai. Naam ka matlab hai "teen taali" — kyunki ismein teen taali hoti hain.\n\nStructure: 16 matra, chaar vibhag (4+4+4+4).\nMatra: 1 2 3 4 | 5 6 7 8 | 9 10 11 12 | 13 14 15 16\nTheka: Dha Dhin Dhin Dha | Dha Dhin Dhin Dha | Dha Tin Tin Ta | Ta Dhin Dhin Dha\nMarks: X (sam, matra 1) | 2 (taali, matra 5) | 0 (khali, matra 9) | 3 (taali, matra 13)\n\nToh taali 1, 5 aur 13 par, aur wave 9 par. Dhyan dijiye ki khali vibhag ke bols "Tin Tin Ta" hain — tabla par yeh halka, bina gunj ke sunai deta hai. Jab aap "Ta Dhin Dhin Dha" (13–16) sunte ho, toh samajh jaate ho ki sam aane wala hai.\n\n16 matra yaad rakhna shuru mein mushkil lagta hai. Isliye har vibhag ke andar finger count kijiye aur zor se gintiye. Vilambit (bahut dheemi) Teentaal classical khayal mein use hoti hai, aur drut Teentaal tez bandishon mein — lekin structure same rehta hai, sirf laya badalti hai.\n\nShuru 60 bpm se kijiye. Agar beech mein bhatak jaayein, toh ruk kar agle sam se phir shuru kijiye.',
        english:
          'Teentaal is the most widely used taal in Hindustani classical music. Its name means "three claps", because it has three talis.\n\nStructure: 16 matras in four vibhags (4+4+4+4).\nMatras: 1 2 3 4 | 5 6 7 8 | 9 10 11 12 | 13 14 15 16\nTheka: Dha Dhin Dhin Dha | Dha Dhin Dhin Dha | Dha Tin Tin Ta | Ta Dhin Dhin Dha\nMarks: X (sam, matra 1) | 2 (tali, matra 5) | 0 (khali, matra 9) | 3 (tali, matra 13)\n\nSo you clap on 1, 5 and 13, and wave on 9. Notice the khali vibhag bols "Tin Tin Ta": on the tabla they sound lighter, without the resonant bass. When you hear "Ta Dhin Dhin Dha" (13–16), you know sam is about to arrive.\n\nSixteen matras can feel long at first, so finger-count within each vibhag and count aloud. Very slow (vilambit) Teentaal is used for some slow khayals, and fast (drut) Teentaal for quicker compositions — but the structure stays the same; only the laya changes.\n\nStart at 60 bpm. If you lose your place, stop and rejoin from the next sam.',
        hindi:
          "तीनताल हिंदुस्तानी शास्त्रीय संगीत की सबसे ज़्यादा प्रयोग होने वाली ताल है। इसके नाम का अर्थ है \"तीन ताली\", क्योंकि इसमें तीन तालियाँ होती हैं।\n\nढाँचा: 16 मात्राएँ, चार विभाग (4+4+4+4)।\nमात्राएँ: 1 2 3 4 | 5 6 7 8 | 9 10 11 12 | 13 14 15 16\nठेका: Dha Dhin Dhin Dha | Dha Dhin Dhin Dha | Dha Tin Tin Ta | Ta Dhin Dhin Dha\nचिह्न: X (सम, मात्रा 1) | 2 (ताली, मात्रा 5) | 0 (खाली, मात्रा 9) | 3 (ताली, मात्रा 13)\n\nयानी ताली 1, 5 और 13 पर, और वेव 9 पर। खाली विभाग के बोल \"Tin Tin Ta\" पर ध्यान दीजिए: तबले पर ये बायाँ (बेस) की गूँज के बिना, हल्के सुनाई देते हैं। जब आप \"Ta Dhin Dhin Dha\" (13–16) सुनते हैं, तो समझ जाते हैं कि सम आने वाला है।\n\nसोलह मात्राएँ शुरू में लंबी लगती हैं, इसलिए हर विभाग के अंदर उँगलियों पर गिनिए और ज़ोर से बोलिए। बहुत धीमा (विलंबित) तीनताल कुछ धीमे ख़यालों में प्रयोग होता है, और तेज़ (द्रुत) तीनताल जल्दी चलने वाली बंदिशों में — लेकिन ढाँचा वही रहता है; सिर्फ़ लय बदलती है।\n\n60 bpm से शुरू कीजिए। अगर जगह भूल जाएँ, तो रुकिए और अगले सम से फिर जुड़िए।",
      },
      whyItMatters:
        'Teentaal is the backbone of classical compositions (bandishes) and appears in many semi-classical and film songs. Clapping it securely is a basic skill expected of every Hindustani student.',
      demos: [
        { kind: 'taal', label: 'Teentaal at 60 bpm', taal: 'teentaal', bpm: 60, cycles: 2 },
        { kind: 'taal', label: 'Teentaal at 90 bpm', taal: 'teentaal', bpm: 90, cycles: 2 },
      ],
      guidedSteps: [
        'Open Metronome & Taal, select Teentaal at 60 bpm, and listen to one avartan, noticing the lighter khali section.',
        'Clap on 1, 5 and 13; wave on 9; finger-count the rest, counting "1 to 16" aloud.',
        'Repeat while reciting the theka bols in place of numbers.',
        'Sing the groups-of-four alankar over Teentaal, one note per matra — each group fits one vibhag. Up and down is 40 notes (ten vibhags), so hold the final Sa through the last two vibhags and land on the next sam.',
        'When three avartans in a row are steady, try 80 bpm.',
        'Record yourself clapping and counting in the Recording Journal and check that claps align with the tool.',
      ],
      independentPractice: {
        instructions: 'Clap and count five avartans of Teentaal at 60–70 bpm, then recite the theka for three more. Finish by singing the groups-of-four alankar over it, holding the final Sa for 8 matras so you arrive back on sam.',
        durationMin: 12,
        tool: 'taal',
        pattern: [...ALANKAR_4, '-', '-', '-', '-', '-', '-', '-', '-'],
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Clapping on matra 9.', fix: 'Matra 9 is khali — always a wave. Say "khali" aloud there at first.' },
        { mistake: 'Forgetting the third clap on 13.', fix: 'Remember "Teen-taal = three claps": 1, 5, 13.' },
        { mistake: 'Rushing the last vibhag towards sam.', fix: 'Keep each matra equal; arriving early on sam is a common habit to watch.' },
      ],
      quiz: [
        {
          question: 'On which matras do you clap in Teentaal?',
          options: ['1, 5, 9, 13', '1, 5, 13', '1, 9', '1, 4, 7, 10'],
          answerIndex: 1,
          explanation: 'Claps (tali) on 1 (sam), 5 and 13; matra 9 is khali — a wave.',
        },
        {
          question: 'How is Teentaal divided?',
          options: ['4+4+4+4', '3+3', '4+4', '2+3+2'],
          answerIndex: 0,
          explanation: 'Teentaal has 16 matras in four vibhags of four.',
        },
        {
          question: 'Which bols belong to the khali vibhag of Teentaal?',
          options: ['Dha Dhin Dhin Dha', 'Dha Tin Tin Ta', 'Dha Ge Na Ti', 'Dha Tu Na'],
          answerIndex: 1,
          explanation: 'Matras 9–12 are Dha Tin Tin Ta, the lighter khali section.',
        },
        {
          question: 'In Bhatkhande notation, what marks are used for Teentaal\'s vibhags?',
          options: ['X 2 0 3', '1 2 3 4', 'X 0 X 0', '0 2 X 3'],
          answerIndex: 0,
          explanation: 'Sam is X, then tali 2, khali 0, tali 3.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Self-reported: be honest about whether your claps stay with the Metronome & Taal tool.',
        items: [
          'I clapped Teentaal for five avartans (claps on 1, 5, 13; wave on 9) while counting aloud, without losing my place.',
          'I recited the Teentaal theka in time while clapping.',
          'I sang an alankar over Teentaal, one note per matra, landing back on sam.',
        ],
      },
      videoQueries: ['teentaal clapping tutorial', 'teentaal theka dha dhin dhin dha explained hindi'],
      nextStep: 'Next, return to pitch: learn all 12 swaras — shuddh, komal and teevra.',
      estMinutes: 20,
    },

    // ───────────────────────── Module 4: Swaras & Saptaks ─────────────────────────
    {
      id: 'l2-shuddh-komal-teevra',
      level: 2,
      module: 'Swaras & Saptaks',
      title: 'The 12 Swaras: Shuddh, Komal and Teevra',
      objective: 'Know all 12 swaras, sing komal Re against shuddh Re, and recognise shuddh vs komal by ear.',
      explanation: {
        hinglish:
          'Ab tak humne sirf saat shuddh swar gaaye. Lekin ek saptak mein kul 12 swar hote hain.\n\n• Sa aur Pa achal hain — yeh kabhi nahi badalte.\n• Re, Ga, Dha, Ni ke do roop hain: shuddh aur komal. Komal matlab "naram" — shuddh se ek semitone neeche. App mein komal ko chhote letter se likhte hain: r, g, d, n.\n• Ma ke do roop hain: shuddh Ma (m) aur teevra Ma (M). Teevra matlab "tez" — shuddh Ma se ek semitone upar.\n\nToh poori list (neeche se upar): S r R g G m M P d D n N — yeh 12 swar.\n\nDhyan dijiye: Ma ulta hai! Re, Ga, Dha, Ni ka "doosra roop" neeche jaata hai (komal), lekin Ma ka doosra roop upar jaata hai (teevra). Yeh beginners ko aksar confuse karta hai.\n\nSunne mein fark: komal swar aksar thoda gambhir, udaas ya gehra feel dete hain; shuddh swar zyada bright. Yeh sirf ek general feeling hai — raga aur context ke saath mood badalta hai. Bollywood mein bhi komal swar har jagah hain: jaise kai sad ya sufi gaanon mein komal Ga aur komal Ni.\n\nPractice: Sargam Player se R aur r ko compare kijiye, phir dono ko gaaiye. Phir G aur g, D aur d, N aur n. Aur m aur M. Ear Training tool mein shuddh/komal pehchaanne ka test kijiye.',
        english:
          'So far you have sung only the seven shuddh swaras. An octave actually contains 12 swaras.\n\n• Sa and Pa are achal (fixed) — they never change.\n• Re, Ga, Dha and Ni each have two forms: shuddh and komal. Komal ("soft") is one semitone below shuddh. In this app komal is written in lowercase: r, g, d, n.\n• Ma has two forms: shuddh Ma (m) and teevra Ma (M). Teevra ("sharp") is one semitone above shuddh Ma.\n\nSo the full list from bottom to top is: S r R g G m M P d D n N — twelve swaras.\n\nNotice that Ma is the odd one out: for Re, Ga, Dha and Ni the altered form goes down (komal), but for Ma it goes up (teevra). This often confuses beginners.\n\nHow they sound: komal swaras often feel a little deeper, more serious or plaintive; shuddh swaras feel brighter. This is only a general impression — mood depends heavily on raga and context. Komal swaras appear throughout Bollywood music too, for example komal Ga and komal Ni in many sad or Sufi-flavoured songs.\n\nPractice: compare R and r in the Sargam Player and sing both. Then G and g, D and d, N and n, and m and M. Finally, test your ear in the Ear Training tool.',
        hindi:
          "अब तक आपने सिर्फ़ सात शुद्ध स्वर गाए हैं। असल में एक सप्तक में 12 स्वर होते हैं।\n\n• सा और प अचल (स्थिर) हैं — ये कभी नहीं बदलते।\n• रे, ग, ध और नि के दो रूप हैं: शुद्ध और कोमल। कोमल (\"नरम\") शुद्ध से एक सेमीटोन नीचे होता है। इस ऐप में कोमल को छोटे अक्षर से लिखते हैं: r, g, d, n।\n• म के दो रूप हैं: शुद्ध म (m) और तीव्र म (M)। तीव्र (\"तेज़\") शुद्ध म से एक सेमीटोन ऊपर होता है।\n\nतो नीचे से ऊपर पूरी सूची है: S r R g G m M P d D n N — बारह स्वर।\n\nध्यान दीजिए कि म सबसे अलग है: रे, ग, ध और नि का बदला हुआ रूप नीचे जाता है (कोमल), लेकिन म का ऊपर जाता है (तीव्र)। इससे शुरुआती लोग अक्सर उलझ जाते हैं।\n\nसुनने में कैसे लगते हैं: कोमल स्वर अक्सर थोड़े गहरे, गंभीर या करुण लगते हैं; शुद्ध स्वर ज़्यादा चमकीले। यह सिर्फ़ एक सामान्य अनुभव है — भाव राग और संदर्भ पर बहुत निर्भर करता है। बॉलीवुड संगीत में भी कोमल स्वर हर जगह हैं, जैसे कई उदास या सूफ़ी रंग के गीतों में कोमल ग और कोमल नि।\n\nअभ्यास: सरगम प्लेयर में R और r की तुलना कीजिए और दोनों गाइए। फिर G और g, D और d, N और n, और m और M। आख़िर में ईयर ट्रेनिंग टूल में अपने कान की परीक्षा लीजिए।",
      },
      whyItMatters:
        'Ragas and many film melodies use komal and teevra swaras. Without them you cannot sing most songs correctly; recognising them by ear is the first step to learning ragas.',
      traditionNote:
        'The app uses equal-tempered semitones for komal and teevra swaras. In raga performance the exact intonation can differ slightly (for example, komal Re in Raag Bhairav is often sung a little lower). These shruti refinements are learned later, ideally with a teacher.',
      demos: [
        { kind: 'compare', label: 'Shuddh Re vs komal Re', a: 'R', b: 'r' },
        { kind: 'compare', label: 'Shuddh Ga vs komal Ga', a: 'G', b: 'g' },
        { kind: 'compare', label: 'Shuddh Ma vs teevra Ma', a: 'm', b: 'M' },
        { kind: 'compare', label: 'Shuddh Ni vs komal Ni', a: 'N', b: 'n' },
        { kind: 'sequence', label: 'All 12 swaras ascending', notes: ['S', 'r', 'R', 'g', 'G', 'm', 'M', 'P', 'd', 'D', 'n', 'N', "S'"], bpm: 60 },
      ],
      guidedSteps: [
        'Play the "All 12 swaras" demo and look at each swara on the Virtual Keyboard as it sounds.',
        'Play the R vs r comparison three times. Sing S – R – S, then S – r – S, with the Tanpura Drone.',
        'Check r in the Pitch Matcher: it should sit one semitone below R.',
        'Repeat the comparison for G/g, D/d and N/n.',
        'Compare m and M; notice that teevra Ma is higher than shuddh Ma.',
        'Take the shuddh-vs-komal test in Ear Training (at least 10 questions).',
      ],
      independentPractice: {
        instructions: 'Sing S R S r S, then S G S g S, against the drone, slowly. Then do 10 questions of shuddh/komal recognition in Ear Training.',
        durationMin: 12,
        tool: 'ear-training',
        pattern: ['S', 'R', 'S', 'r', 'S', '-', 'S', 'G', 'S', 'g', 'S', '-'],
        bpm: 50,
      },
      mistakes: [
        { mistake: 'Thinking teevra Ma is lower than shuddh Ma.', fix: 'Remember: komal goes down (Re, Ga, Dha, Ni), teevra goes up (Ma only).' },
        { mistake: 'Singing komal Re somewhere between r and R.', fix: 'Sing S – r – S slowly with the drone and check the Pitch Matcher; komal Re is very close to Sa.' },
        { mistake: 'Believing komal notes are always "sad".', fix: 'Treat mood descriptions as rough guides; the raga and melody decide the emotion.' },
      ],
      quiz: [
        {
          question: 'Which swaras have komal forms?',
          options: ['Sa, Re, Ga, Pa', 'Re, Ga, Dha, Ni', 'Ma and Pa', 'All seven'],
          answerIndex: 1,
          explanation: 'Re, Ga, Dha and Ni can be komal. Ma becomes teevra instead, and Sa and Pa are fixed.',
        },
        {
          question: 'Teevra Ma is…',
          options: ['One semitone below shuddh Ma', 'One semitone above shuddh Ma', 'The same as Pa', 'Ma in the lower octave'],
          answerIndex: 1,
          explanation: 'Teevra Ma is raised by one semitone; it sits between shuddh Ma and Pa.',
        },
        {
          question: 'How many swaras are there in one saptak including komal and teevra forms?',
          options: ['7', '10', '12', '22'],
          answerIndex: 2,
          explanation: '7 shuddh + 4 komal + 1 teevra = 12. (22 is the traditional number of shrutis, a finer theoretical division.)',
        },
        {
          question: 'In this app, how is komal Dha written?',
          options: ['D', 'd', 'D\'', '.D'],
          answerIndex: 1,
          explanation: 'Lowercase d is komal Dha. D is shuddh Dha; D\' and .D indicate octaves.',
        },
      ],
      practical: {
        kind: 'ear-test',
        description: 'Identify whether you hear the shuddh or komal form of a swara in the Ear Training tool.',
        minQuestions: 10,
        minScorePct: 70,
      },
      videoQueries: ['komal swar kya hote hain shuddh komal teevra explained', '12 swaras hindustani music beginners'],
      nextStep: 'Next, explore the three saptaks and gentle kharaj practice in the lower octave.',
      estMinutes: 25,
    },
    {
      id: 'l2-saptaks-and-kharaj',
      level: 2,
      module: 'Swaras & Saptaks',
      title: 'Mandra, Madhya and Taar Saptak — and Gentle Kharaj',
      objective: 'Understand the three saptaks, avoid octave confusion, and practise short, gentle kharaj (lower-octave) exercises around mandra Pa and Sa.',
      explanation: {
        hinglish:
          'Saptak matlab saat swaron ka set (ek octave). Teen saptak hain:\n• Mandra saptak — neeche wala. Notation: .P, .D, .N (aage dot).\n• Madhya saptak — beech wala, jahan aap zyadatar gaate ho: S R G m P D N.\n• Taar saptak — upar wala: S\', R\', G\' (peeche apostrophe).\n\nMandra .N madhya S ke bilkul neeche hai, aur taar S\' madhya N ke bilkul upar. Ek common galti hai octave confusion — jaise kisi aur ka Sa ek octave upar ya neeche gaana aur sochna ki galat hai. Same naam, alag saptak — dono "Sa" hain. Pitch Matcher batata hai ki aap kis saptak mein ho.\n\nKharaj kya hai? Kharaj ka riyaz mandra saptak mein gehre, dheere swar lagaana hai — aksar mandra Pa ya mandra Sa ke aas-paas. Kai gharane subah ke samay kharaj riyaz karte hain, taaki awaaz mein gehraai aur stability aaye. Lekin alag-alag traditions isko alag tarike se sikhaate hain — kuch bahut neeche tak le jaate hain, kuch sirf halka sa.\n\nBeginners ke liye rules: (1) sirf utna neeche jaaiye jitna aaraam se, halki awaaz mein nikle. (2) Kabhi bhi neeche note ko force mat kijiye ya gala dabaakar "growl" mat kijiye. (3) Session chhota rakhiye — 3 se 5 minute kaafi hai. (4) Agar .P tak nahi pahunch rahe, toh .N aur .D par hi rukiye. Range time ke saath khulti hai.',
        english:
          'A saptak is a set of seven swaras — one octave. There are three:\n• Mandra saptak — the lower octave, written with a leading dot: .P, .D, .N.\n• Madhya saptak — the middle octave where you sing most of the time: S R G m P D N.\n• Taar saptak — the upper octave, written with an apostrophe: S\', R\', G\'.\n\nMandra .N sits just below madhya S, and taar S\' sits just above madhya N. A common error is octave confusion — singing a note an octave above or below the reference and thinking it is wrong (or right). Same name, different saptak. The Pitch Matcher shows which saptak you are in.\n\nWhat is kharaj? Kharaj practice means singing deep, slow notes in the mandra saptak, usually around lower Pa or lower Sa. Many gharanas do kharaj riyaz in the morning to build depth and stability. However, traditions differ — some take it very low, others only gently.\n\nRules for beginners: (1) go only as low as comes out easily at a soft volume; (2) never force or press the throat to produce a low "growl"; (3) keep sessions short — 3 to 5 minutes is enough; (4) if .P is not reachable, stay with .N and .D. Range opens over time.',
        hindi:
          "सप्तक सात स्वरों का समूह है — एक ऑक्टेव। सप्तक तीन हैं:\n• मंद्र सप्तक — नीचे वाला, आगे बिंदी लगाकर लिखा जाता है: .P, .D, .N।\n• मध्य सप्तक — बीच वाला, जहाँ आप ज़्यादातर गाते हैं: S R G m P D N।\n• तार सप्तक — ऊपर वाला, पीछे अपॉस्ट्रॉफ़ी लगाकर: S', R', G'।\n\nमंद्र .N मध्य S के ठीक नीचे है, और तार S' मध्य N के ठीक ऊपर। एक आम गलती है सप्तक का भ्रम — किसी स्वर को संदर्भ से एक सप्तक ऊपर या नीचे गाना और उसे गलत (या सही) समझ लेना। नाम एक, सप्तक अलग। पिच मैचर दिखाता है कि आप किस सप्तक में हैं।\n\nखरज क्या है? खरज के रियाज़ का मतलब है मंद्र सप्तक में गहरे, धीमे स्वर लगाना, आमतौर पर मंद्र प या मंद्र सा के आसपास। कई घराने सुबह खरज का रियाज़ करते हैं ताकि आवाज़ में गहराई और स्थिरता आए। लेकिन परंपराएँ अलग-अलग हैं — कुछ बहुत नीचे तक ले जाते हैं, कुछ सिर्फ़ हल्का-सा।\n\nशुरुआती लोगों के लिए नियम: (1) सिर्फ़ उतना नीचे जाइए जितना धीमी आवाज़ में आसानी से निकले; (2) नीचे का \"घुर्राता\" स्वर निकालने के लिए गले को कभी दबाइए या ज़ोर मत लगाइए; (3) सत्र छोटा रखिए — 3 से 5 मिनट काफ़ी हैं; (4) अगर .P तक नहीं पहुँचते, तो .N और .D पर ही रहिए। रेंज समय के साथ खुलती है।",
      },
      whyItMatters:
        'Many Bollywood songs dip into the lower octave and rise into the upper one. Knowing which saptak you are in avoids confusion, and gentle kharaj builds a fuller, steadier voice.',
      traditionNote:
        'Kharaj practice varies a lot between gharanas and teachers — in how low, how long, and at what time of day. Note also that "mandra/madhya/taar saptak" are pitch ranges relative to your Sa; they are not the same as Western "chest/head voice" registers, which describe how the voice produces sound.',
      demos: [
        { kind: 'sequence', label: 'Mandra notes rising to Sa', notes: ['.P', '.D', '.N', 'S'], bpm: 50 },
        { kind: 'note', label: 'Mandra Pa (gentle kharaj)', swara: '.P', durationSec: 5 },
        { kind: 'compare', label: 'Madhya Sa vs taar Sa — same name, different saptak', a: 'S', b: "S'" },
        { kind: 'sequence', label: 'Across three saptaks', notes: ['.P', '.N', 'S', 'G', 'P', 'N', "S'"], bpm: 50 },
      ],
      guidedSteps: [
        'Play the Sa vs taar Sa comparison and notice that both are "Sa", an octave apart.',
        'Play the mandra demo with the Tanpura Drone. Sing S, then .N, then .D — softly.',
        'Only if comfortable, sing .P and hold it for 4–5 seconds at a soft volume.',
        'Rise back: .P .D .N S. Check each note in the Pitch Matcher, including that it shows the lower octave.',
        'Keep total kharaj time to 3–5 minutes. Stop at once if anything feels pressed.',
        'Record a short kharaj phrase in the Recording Journal to track depth and ease over weeks.',
      ],
      independentPractice: {
        instructions: 'Short kharaj session: sing .P .D .N S and S .N .D .P slowly, softly, 4 beats per note, for 3–5 minutes total. Skip any note that is not comfortable.',
        durationMin: 5,
        tool: 'pitch-match',
        pattern: ['.P', '.D', '.N', 'S', 'S', '.N', '.D', '.P'],
        bpm: 40,
      },
      mistakes: [
        { mistake: 'Pressing the larynx down to force low notes.', fix: 'Stay soft and relaxed; stop at the lowest note that comes out easily.' },
        { mistake: 'Octave confusion — thinking you sang the wrong note when it was the right swara in another saptak.', fix: 'Check the octave shown in the Pitch Matcher, and compare with the S vs S\' demo.' },
        { mistake: 'Long kharaj sessions.', fix: 'Keep it to a few minutes; long low practice can tire the voice.' },
      ],
      quiz: [
        {
          question: 'Which notation shows mandra (lower) Ni?',
          options: ['N', ".N", "N'", 'n'],
          answerIndex: 1,
          explanation: "A leading dot marks the mandra saptak; an apostrophe after the note marks taar; lowercase n is komal Ni.",
        },
        {
          question: 'Kharaj practice for a beginner should be…',
          options: ['As low and loud as possible', 'Gentle, short and never forced', 'Done for an hour every morning', 'Only on taar Sa'],
          answerIndex: 1,
          explanation: 'Kharaj is about relaxed depth. Forcing low notes or very long sessions can strain the voice.',
        },
        {
          question: 'Is mandra saptak the same thing as "chest voice"?',
          options: ['Yes, exactly', 'No — saptak is a pitch range relative to Sa; chest voice is a way the voice produces sound', 'Yes, and taar saptak is falsetto', 'Saptak means vibrato'],
          answerIndex: 1,
          explanation: 'These are different concepts from different systems and should not be equated.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match gentle mandra notes up to Sa. Sing softly; skip mandra Pa if it is not yet comfortable — Sa and .N alone are a fine start.',
        targets: ['.P', '.D', '.N', 'S'],
        minAttempts: 6,
        minSuccessPct: 55,
        toleranceCents: 50,
      },
      videoQueries: ['kharaj ka riyaz kaise kare beginners', 'mandra madhya taar saptak explained hindi'],
      nextStep: 'Finally, learn to recognise and fix the most common pitch mistakes.',
      estMinutes: 20,
      safetyNote: 'Never force low notes. If your voice crackles, presses or feels tired, stop. Kharaj should be brief and soft.',
    },
    {
      id: 'l2-common-pitch-mistakes',
      level: 2,
      module: 'Swaras & Saptaks',
      title: 'Recognising Common Pitch Mistakes',
      objective: 'Identify and correct five common pitch problems: flat descents, sharp straining, scooping, drifting off Sa, and octave confusion.',
      explanation: {
        hinglish:
          'Har singer galtiyaan karta hai — farak sirf itna hai ki achha singer unhe pehchaanta hai aur theek karta hai. Paanch sabse common pitch mistakes:\n\n1) Avaroha mein flat hona — neeche aate waqt swar apni jagah se thoda neeche gir jaate hain, khaaskar Ga aur Re. Fix: neeche aate hue bhi saans ka support rakhiye; mann mein "upar" sochiye.\n\n2) Strain mein sharp hona — upar ke notes par zor lagaane se aawaaz tight hokar zarurat se upar (sharp) chali jaati hai. Fix: volume kam kijiye, jaw dheela, aur upar ke notes halke se.\n\n3) Scooping — har note neeche se ghisatkar shuru karna. Fix: note pehle mann mein suniye, phir seedha uspar land kijiye.\n\n4) Sa se drift hona — gaate-gaate pura scale dheere-dheere upar ya neeche khisak jaata hai, aur end mein aapka Sa drone ke Sa se alag hota hai. Fix: tanpura ko lagaatar suniye, aur har kuch line ke baad Sa par wapas aakar check kijiye.\n\n5) Octave confusion — sahi swar galat saptak mein, ya do saptakon ke beech atakna. Fix: Pitch Matcher par saptak dekhiye; reference note ko apne comfortable saptak mein gaaiye.\n\nApni recording sunna sabse powerful tool hai. Gaate waqt hum khud ko alag sunte hain; recording sach batati hai. Har hafte Recording Journal mein ek alankar record kijiye aur in paanch galtiyon ki checklist se suniye.',
        english:
          'Every singer makes mistakes — the difference is that good singers recognise and correct them. Here are the five most common pitch problems:\n\n1) Going flat when descending — notes sag below their place on the way down, especially Ga and Re. Fix: keep breath support while descending; think "up" as you go down.\n\n2) Going sharp when straining — pushing for high notes tightens the voice and makes it overshoot. Fix: reduce volume, loosen the jaw and approach high notes lightly.\n\n3) Scooping — sliding up into every note from below. Fix: hear the note in your head first, then land directly on it.\n\n4) Drifting off Sa — the whole scale slowly creeps up or down, so by the end your Sa no longer matches the drone. Fix: keep listening to the tanpura and return to Sa every few phrases to check.\n\n5) Octave confusion — singing the right swara in the wrong saptak, or wavering between two octaves. Fix: check the octave on the Pitch Matcher; sing reference notes in your comfortable saptak.\n\nListening to your own recordings is the most powerful tool. We hear ourselves differently while singing; a recording tells the truth. Each week, record one alankar in the Recording Journal and listen with this five-point checklist.',
        hindi:
          "हर गायक गलतियाँ करता है — फ़र्क बस इतना है कि अच्छे गायक उन्हें पहचानकर ठीक करते हैं। ये हैं सुर की पाँच सबसे आम गलतियाँ:\n\n1) उतरते समय फ़्लैट होना — नीचे आते हुए स्वर अपनी जगह से थोड़ा गिर जाते हैं, ख़ासकर ग और रे। उपाय: उतरते समय भी साँस का सहारा बनाए रखिए; नीचे जाते हुए मन में \"ऊपर\" सोचिए।\n\n2) ज़ोर लगाने पर शार्प होना — ऊँचे स्वरों के लिए ज़ोर लगाने से आवाज़ कस जाती है और लक्ष्य से ऊपर निकल जाती है। उपाय: आवाज़ धीमी कीजिए, जबड़ा ढीला रखिए और ऊँचे स्वरों तक हल्के से पहुँचिए।\n\n3) स्कूपिंग — हर स्वर में नीचे से फिसलकर चढ़ना। उपाय: पहले स्वर को मन में सुनिए, फिर सीधे उसी पर उतरिए।\n\n4) सा से भटकना — पूरा सप्तक धीरे-धीरे ऊपर या नीचे खिसक जाता है, और आख़िर तक आपका सा ड्रोन से मेल नहीं खाता। उपाय: तानपुरा लगातार सुनते रहिए और हर कुछ वाक्यांशों के बाद सा पर लौटकर जाँचिए।\n\n5) सप्तक का भ्रम — सही स्वर गलत सप्तक में गाना, या दो सप्तकों के बीच डगमगाना। उपाय: पिच मैचर पर सप्तक देखिए; संदर्भ स्वरों को अपने आरामदायक सप्तक में गाइए।\n\nअपनी रिकॉर्डिंग सुनना सबसे ताक़तवर उपकरण है। गाते समय हम ख़ुद को अलग सुनते हैं; रिकॉर्डिंग सच बताती है। हर हफ़्ते रिकॉर्डिंग जर्नल में एक अलंकार रिकॉर्ड कीजिए और इस पाँच-बिंदु सूची से सुनिए।",
      },
      whyItMatters:
        'Knowing the typical mistakes turns vague "it sounds off" feelings into specific, fixable problems — the key to steady progress without a teacher present every day.',
      demos: [
        { kind: 'sequence', label: 'Avaroha to check for flat descents', notes: ["S'", 'N', 'D', 'P', 'm', 'G', 'R', 'S'], bpm: 60 },
        { kind: 'glide', label: 'What a scoop sounds like (avoid this habit)', from: 'R', to: 'G', durationSec: 1 },
        { kind: 'note', label: 'Clean Ga — landed directly', swara: 'G', durationSec: 3 },
        { kind: 'drone', label: 'Drone for checking Sa drift' },
      ],
      guidedSteps: [
        'Sing the shuddh avaroha with the Tanpura Drone and watch Ga and Re on the Pitch Matcher — are they below the target?',
        'Play the scoop demo, then the clean Ga. Sing Ga five times landing directly, with no slide.',
        'Sing the groups-of-three alankar fully, then immediately sing Sa: does it still match the drone?',
        'Sing upper Sa softly and loudly; notice whether loud singing makes it sharp.',
        'Record one alankar in the Recording Journal and score it against the five-mistake checklist.',
      ],
      independentPractice: {
        instructions: 'Sing the avaroha from upper Sa, checking Ga and Re carefully; then sing an alankar and return to Sa to check for drift. Record and review.',
        durationMin: 12,
        tool: 'recorder',
        pattern: ["S'", 'N', 'D', 'P', 'm', 'G', 'R', 'S', '-', 'S'],
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Judging only from the feeling while singing.', fix: 'Record and listen back — and use the Pitch Matcher as an objective check.' },
        { mistake: 'Trying to fix everything at once.', fix: 'Pick one mistake per week to focus on.' },
        { mistake: 'Getting discouraged by a "bad" recording.', fix: 'Every recording is information. Compare with older recordings to see real progress.' },
      ],
      quiz: [
        {
          question: 'Which notes most commonly go flat in the avaroha?',
          options: ['Sa and Pa', 'Ga and Re', 'Upper Sa only', 'None'],
          answerIndex: 1,
          explanation: 'As singers relax coming down, Ga and Re are especially prone to sagging.',
        },
        {
          question: 'Pushing loudly with throat tension on a high note often makes it…',
          options: ['Flat', 'Sharp', 'Perfectly in tune', 'Lower octave'],
          answerIndex: 1,
          explanation: 'Excess breath pressure and tension tend to push the pitch above the target. (Under-energised, half-hearted high notes tend to fall flat instead.) Lighter, supported singing helps.',
        },
        {
          question: 'After an alankar, your Sa no longer matches the drone. This is called…',
          options: ['Scooping', 'Drifting off Sa', 'Khali', 'Kharaj'],
          answerIndex: 1,
          explanation: 'Gradual drift is common; check by returning to Sa against the tanpura regularly.',
        },
        {
          question: 'Scooping means…',
          options: ['Landing directly on a note', 'Sliding up into notes from below by habit', 'Singing in the taar saptak', 'Clapping on khali'],
          answerIndex: 1,
          explanation: 'Scooping is an unintended slide from below that blurs the start of each note.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the descending notes accurately, without going flat, at a tighter tolerance.',
        targets: ['P', 'm', 'G', 'R', 'S'],
        minAttempts: 10,
        minSuccessPct: 65,
        toleranceCents: 40,
      },
      videoQueries: ['common singing pitch mistakes beginners how to fix', 'why do i sing flat singing tips'],
      nextStep: 'Review weak areas, then attempt the Level 2 checkpoint to unlock Level 3.',
      estMinutes: 20,
    },
  ],
  checkpoint: {
    title: 'Level 2 Checkpoint: Building the Voice',
    description:
      'This checkpoint measures note matching on the full shuddh scale with the microphone, plus honest self-checks of rhythm and alankar control. It measures note matching only, not your overall voice quality or musicality. You can retry it anytime — there is no penalty and no time limit.',
    requirements: [
      {
        kind: 'pitch-match',
        description: 'Match every swara of the shuddh scale against your Sa (upper Sa softly — never forced).',
        targets: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"],
        minAttempts: 16,
        minSuccessPct: 65,
        toleranceCents: 40,
      },
      {
        kind: 'self-check',
        description: 'Self-reported: a pitch detector cannot judge rhythm and ease, so answer honestly.',
        items: [
          'I can clap Teentaal (claps on 1, 5, 13; wave on 9), Keharwa (clap 1, wave 5) and Dadra (clap 1, wave 4) along with the theka while counting aloud.',
          'I can sing at least one alankar (up and down) comfortably and accurately at 80 bpm.',
          'I can name and sing komal Re against shuddh Re, and explain mandra, madhya and taar saptak.',
        ],
      },
    ],
  },
};
