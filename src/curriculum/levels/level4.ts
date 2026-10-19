import type { Level } from '../types';

/**
 * LEVEL 4 — Advanced Foundations.
 * Final level of the app's curriculum. It widens the learner's toolkit
 * (faster patterns, layakari, improvisation, style, mic/recording, performance)
 * and hands them a sustainable, lifelong practice plan.
 */
export const level4: Level = {
  id: 4,
  title: 'Advanced Foundations',
  subtitle: 'Speed, rhythm, improvisation, style and performance',
  suggestedDuration: 'Month 7 onward (flexible guideline)',
  description:
    'Level 4 builds on everything so far: vakra and grouped alankars, raga-based patterns in Bhupali and Yaman, taans at controlled speed, layakari (dugun, tigun, chaugun) and tihai, raga-bound improvisation, long-phrase control, tasteful ornamentation, expression across Bollywood eras, basic harmony, microphone and recording technique, karaoke, stage confidence and performance preparation. It ends with building your own style and a long-term practice plan. Move at your own pace — speed always comes after accuracy.',
  lessons: [
    // ───────────────────────── Module 1: Advanced Alankars ─────────────────────────
    {
      id: 'l4-vakra-grouped-alankars',
      level: 4,
      module: 'Advanced Alankars',
      title: 'Vakra Alankars and Groups of 5 and 6',
      objective:
        'Sing zig-zag (vakra) alankars and note-groups of 5 and 6 cleanly in Bilawal (all shuddh notes) at a slow, steady tempo.',
      explanation: {
        hinglish:
          "Ab tak aapne seedhe alankar gaaye — jaise S R G, R G m. Level 4 mein hum unhe thoda tedha-medha banayenge. 'Vakra' ka matlab hai tedha ya zig-zag. Vakra alankar mein notes seedhe upar nahi jaate, beech mein ek kadam peeche aate hain. Jaise: S G R m G P m D P N D S'. Yahan har baar ek note skip karke, phir ek note neeche aakar aage badhte hain.\n\nDoosra naya idea hai groups of 5 aur 6. Group of 5 ka example: S R S R G | R G R G m | G m G m P | m P m P D | P D P D N | D N D N S'. Har group ek note upar shift hota hai. Group of 6 ka example: S R G m G R | R G m P m G | G m P D P m — chaar note upar jaao, do note wapas aao.\n\nYeh patterns dimaag aur gale dono ko train karte hain. Odd groups (5 wale) rhythm mein thode ajeeb lagte hain, kyunki beat ke saath har baar alag jagah se shuru hote hain — isi se aapki laya ki pakad mazboot hoti hai.\n\nNiyam simple hai: pehle Sargam Player mein suniye, phir dheere (60 BPM ya kam) sargam bolkar gaaiye, phir akaar mein. Har note ka sur saaf hona chahiye — notes aapas mein ghulne nahi chahiye. Speed baad mein aayegi; abhi sirf saaf aur sahi.",
        english:
          "So far your alankars have moved in straight lines, like S R G, R G m. In Level 4 we bend them. 'Vakra' means crooked or zig-zag. In a vakra alankar the line does not climb directly; it steps back before moving on. For example: S G R m G P m D P N D S'. Each cell jumps up a third and then steps back down one note before the next cell begins.\n\nThe second new idea is grouping notes in 5s and 6s. A group-of-5 pattern: S R S R G | R G R G m | G m G m P | m P m P D | P D P D N | D N D N S'. Each group starts one note higher than the last. A group-of-6 pattern: S R G m G R | R G m P m G | G m P D P m — climb four notes, come back two.\n\nThese patterns train both memory and voice. Groups of 5 feel unusual against a 4-beat pulse because each group starts at a different place in the beat cycle, which strengthens your sense of laya (tempo and rhythmic placement).\n\nThe method stays the same: listen in the Sargam Player, sing slowly in sargam (60 BPM or slower), then sing in akaar ('aa'). Every note must be clearly pitched and separate — no smearing between notes. Speed comes later; for now aim only for clean and correct.",
        hindi:
          "अब तक आपके अलंकार सीधी रेखा में चलते थे, जैसे S R G, R G m। लेवल 4 में हम उन्हें मोड़ेंगे। 'वक्र' का अर्थ है टेढ़ा या ज़िग-ज़ैग। वक्र अलंकार में स्वर सीधे ऊपर नहीं चढ़ते; आगे बढ़ने से पहले एक कदम पीछे आते हैं। उदाहरण: S G R m G P m D P N D S'। हर हिस्से में स्वर एक तीसरे स्वर तक कूदता है और फिर एक स्वर नीचे आता है, उसके बाद अगला हिस्सा शुरू होता है।\n\nदूसरा नया विचार है स्वरों को 5 और 6 के समूहों में गाना। 5 का समूह: S R S R G | R G R G m | G m G m P | m P m P D | P D P D N | D N D N S'। हर समूह पिछले से एक स्वर ऊपर से शुरू होता है। 6 का समूह: S R G m G R | R G m P m G | G m P D P m — चार स्वर ऊपर चढ़िए, दो वापस आइए।\n\nये पैटर्न याददाश्त और आवाज़ दोनों को प्रशिक्षित करते हैं। 4 की गिनती के साथ 5 के समूह अजीब लगते हैं, क्योंकि हर समूह ताल-चक्र में अलग जगह से शुरू होता है — इसी से आपकी लय (गति और ताल में सही जगह) की पकड़ मज़बूत होती है।\n\nतरीका वही है: पहले सरगम प्लेयर में सुनिए, फिर धीरे-धीरे (60 BPM या कम) सरगम बोलकर गाइए, फिर आकार ('आ') में। हर स्वर साफ़ और अलग होना चाहिए — स्वर आपस में घुलने नहीं चाहिए। गति बाद में आएगी; अभी केवल साफ़ और सही गाने पर ध्यान दीजिए।",
      },
      whyItMatters:
        'Zig-zag and odd-grouped patterns break the habit of only singing scales in straight lines. Real melodies, both classical and film, jump and turn back constantly, so these alankars prepare your ear and voice for actual music.',
      traditionNote:
        'Different teachers and gharanas use different alankar sets and names; there is no single official list. Some call grouped patterns "paltas". The patterns here are standard practice shapes, not compositions from any particular tradition.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone on your Sa' },
        { kind: 'sequence', label: "Vakra: S G R m G P m D P N D S'", notes: ['S', 'G', 'R', 'm', 'G', 'P', 'm', 'D', 'P', 'N', 'D', "S'"], bpm: 72 },
        { kind: 'sequence', label: 'Group of 5 (first three groups)', notes: ['S', 'R', 'S', 'R', 'G', 'R', 'G', 'R', 'G', 'm', 'G', 'm', 'G', 'm', 'P'], bpm: 80 },
        { kind: 'sequence', label: 'Group of 6 (first three groups)', notes: ['S', 'R', 'G', 'm', 'G', 'R', 'R', 'G', 'm', 'P', 'm', 'G', 'G', 'm', 'P', 'D', 'P', 'm'], bpm: 80 },
      ],
      guidedSteps: [
        'Open the Tanpura Drone and settle on your Sa for 30 seconds with a soft "aa".',
        "Play the vakra demo in the Sargam Player twice without singing. Notice the 'jump up, step back' shape.",
        'Sing the vakra pattern in sargam at 60 BPM using the Metronome & Taal tool, one note per beat.',
        'Sing the group-of-5 pattern, saying the first note of each group slightly stronger so you feel where groups begin.',
        'Sing the group-of-6 pattern ascending, then try its mirror descending from S\' (S\' N D P D N, N D P m P D, ...).',
        'Repeat your strongest pattern in akaar and record one take in the Recording Journal.',
        'Check a few notes (especially m and N) in the Pitch Matcher.',
      ],
      independentPractice: {
        instructions:
          'Practise the group-of-5 pattern up and down, one note per beat at 60 BPM, three rounds in sargam and two in akaar. Increase by 5 BPM only after two fully clean rounds.',
        durationMin: 15,
        tool: 'sargam',
        pattern: ['S', 'R', 'S', 'R', 'G', 'R', 'G', 'R', 'G', 'm', 'G', 'm', 'G', 'm', 'P', 'm', 'P', 'm', 'P', 'D', 'P', 'D', 'P', 'D', 'N', 'D', 'N', 'D', 'N', "S'"],
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Losing track of which group you are in and skipping or repeating a group.', fix: 'Say the starting note of each group aloud first (S, R, G, m...) as a map, then sing. Accent the first note of every group.' },
        { mistake: 'Shuddh Ma drifting sharp toward teevra Ma in the zig-zag.', fix: 'Compare m and M on the Virtual Keyboard, then check your m in the Pitch Matcher before each session.' },
        { mistake: 'Speeding up mid-pattern because the shape feels familiar.', fix: 'Keep the metronome on for every round. Speed is earned, not assumed.' },
      ],
      quiz: [
        { question: "What does 'vakra' mean in the context of alankars and ragas?", options: ['Fast', 'Lower octave', 'Very slow', 'Crooked / zig-zag'], answerIndex: 3, explanation: 'Vakra means crooked: the line turns back on itself instead of climbing straight.' },
        { question: 'In the group-of-5 pattern S R S R G | R G R G m, what is the next group?', options: ['G m G m P', 'm P m P D', 'G R G R S', 'R G m P D'], answerIndex: 0, explanation: 'Each group starts one note higher, so after the R group comes the G group: G m G m P.' },
        { question: 'Why do groups of 5 feel unusual against a 4-beat count?', options: ['They use komal notes', 'Each group begins at a different point in the beat cycle', 'They must be sung in taar saptak', 'They have no Sa'], answerIndex: 1, explanation: 'Five does not divide evenly into four, so group starts shift against the beat, which trains rhythmic awareness.' },
        { question: 'What should you prioritise first with a new alankar?', options: ['Maximum speed', 'Loud volume', 'Clean, correct notes at a slow tempo', 'Adding murkis'], answerIndex: 2, explanation: 'Accuracy at slow tempo is the foundation; speed built on unclear notes just repeats the errors faster.' },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the notes used in the vakra and grouped alankars (Bilawal, one octave).',
        targets: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"],
        minAttempts: 12,
        minSuccessPct: 70,
        toleranceCents: 30,
      },
      videoQueries: ['vakra alankar Hindustani vocal practice', 'alankar palta group of 5 notes sargam practice', 'advanced sargam alankar for singers'],
      nextStep: 'Next, apply alankar thinking to raga scales: Bhupali and Yaman.',
      estMinutes: 30,
    },
    {
      id: 'l4-raga-alankars-bhupali-yaman',
      level: 4,
      module: 'Advanced Alankars',
      title: 'Alankars in Bhupali and Yaman Notes',
      objective:
        'Sing alankar patterns restricted to the notes of Raga Bhupali (S R G P D) and Raga Yaman (with teevra Ma), keeping each raga\'s note set accurate.',
      explanation: {
        hinglish:
          "Ab alankar ko raga ke notes ke andar gaate hain. Isse do fayde hain: aapka gala raga ke notes ka aadi hota hai, aur aapka kaan galat note ko turant pakadne lagta hai.\n\nRaga Bhupali paanch notes ka raga hai: S R G P D. Ismein Ma aur Ni nahi lagte. Ek simple alankar: S R G, R G P, G P D, P D S' — aur neeche: S' D P, D P G, P G R, G R S. Dhyan rahe, 'G P' ke beech koi Ma nahi aana chahiye — yeh chhalaang hai.\n\nRaga Yaman mein saare shuddh notes hain, bas Ma teevra (M) hai. Yaman ka aaroh aksar .N R G M D N S' aise gaya jaata hai — shuruaat mein Sa aur Pa ko halka chhod kar. Avaroh: S' N D P M G R S. Alankar example: .N R G, R G M, G M D, M D N, D N S'.\n\nSabse common galti hai teevra Ma ko shuddh Ma bana dena, ya ulta. Virtual Keyboard par m aur M baar-baar suniye — farak sirf ek semitone ka hai, par raga ka poora mood badal jaata hai.\n\nYaad rakhiye: yeh alankar practice ke liye simplified hain. Asli raga sirf notes ka set nahi hota — usmein chalan, pakad, aur kuch notes par zyada ruknaa bhi hota hai. Woh guru ke saath gehraai se seekhne ki cheez hai.",
        english:
          "Now we sing alankars inside a raga's note set. This trains your voice to live in that raga, and it trains your ear to notice immediately when a wrong note slips in.\n\nRaga Bhupali is pentatonic: S R G P D. Ma and Ni are omitted. A simple alankar: S R G, R G P, G P D, P D S' — and down: S' D P, D P G, P G R, G R S. Notice that G to P is a leap; no Ma should sneak in between.\n\nRaga Yaman uses all seven notes with teevra Ma (M) instead of shuddh Ma. Its ascent is commonly sung as .N R G M D N S', lightly skipping Sa and Pa at the start of phrases. Descent: S' N D P M G R S. An alankar example: .N R G, R G M, G M D, M D N, D N S'.\n\nThe most common error is singing shuddh Ma where teevra Ma belongs (or vice versa). Listen to m and M back to back on the Virtual Keyboard. The difference is just one semitone, but it changes the whole colour of the raga.\n\nImportant: these are simplified practice patterns. A real raga is more than a note set — it has a characteristic movement (chalan), signature phrases (pakad), resting notes and rules of emphasis. Those are learned in depth with a teacher; these alankars just make the notes familiar in your voice.",
        hindi:
          "अब हम अलंकार किसी राग के स्वरों के भीतर गाएँगे। इससे आपकी आवाज़ उस राग में रमने लगती है, और आपका कान गलत स्वर आते ही उसे तुरंत पकड़ना सीखता है।\n\nराग भूपाली पाँच स्वरों (पेंटाटोनिक) का राग है: S R G P D। इसमें म और नि नहीं लगते। एक सरल अलंकार: S R G, R G P, G P D, P D S' — और नीचे: S' D P, D P G, P G R, G R S। ध्यान दीजिए, G से P एक छलाँग है; बीच में कोई म नहीं आना चाहिए।\n\nराग यमन में सातों स्वर लगते हैं, पर शुद्ध म की जगह तीव्र म (M) लगता है। इसका आरोह अक्सर .N R G M D N S' की तरह गाया जाता है, यानी वाक्यांश की शुरुआत में सा और प को हल्का छोड़कर। अवरोह: S' N D P M G R S। अलंकार का उदाहरण: .N R G, R G M, G M D, M D N, D N S'।\n\nसबसे आम गलती है तीव्र म की जगह शुद्ध म गाना (या उल्टा)। वर्चुअल कीबोर्ड पर m और M को एक के बाद एक सुनिए। अंतर सिर्फ़ एक सेमीटोन का है, पर इससे राग का पूरा रंग बदल जाता है।\n\nज़रूरी बात: ये अभ्यास के लिए सरल पैटर्न हैं। असली राग केवल स्वरों का समूह नहीं होता — उसकी अपनी चाल (चलन), पहचान वाले वाक्यांश (पकड़), ठहराव के स्वर और ज़ोर देने के नियम होते हैं। ये सब गुरु के साथ गहराई से सीखे जाते हैं; ये अलंकार बस स्वरों को आपकी आवाज़ में परिचित बनाते हैं।",
      },
      whyItMatters:
        'Raga-specific alankars make the notes of a raga automatic, which is the groundwork for improvisation later in this level and for classical-based film songs.',
      traditionNote:
        "Aaroh/avaroh and chalan of Yaman and Bhupali are taught with small variations across gharanas and teachers (for example, how often Sa and Pa are used in Yaman's ascent). Treat the versions here as common, simplified references.",
      demos: [
        { kind: 'drone', label: 'Tanpura drone on your Sa' },
        { kind: 'sequence', label: "Bhupali alankar up: S R G, R G P, G P D, P D S'", notes: ['S', 'R', 'G', 'R', 'G', 'P', 'G', 'P', 'D', 'P', 'D', "S'"], bpm: 72 },
        { kind: 'sequence', label: "Yaman alankar up: .N R G, R G M, G M D, M D N, D N S'", notes: ['.N', 'R', 'G', 'R', 'G', 'M', 'G', 'M', 'D', 'M', 'D', 'N', 'D', 'N', "S'"], bpm: 72 },
        { kind: 'compare', label: 'Shuddh Ma vs teevra Ma', a: 'm', b: 'M' },
      ],
      guidedSteps: [
        'Start the Tanpura Drone. Sing S R G P D S\' slowly to fix Bhupali\'s five notes in your ear.',
        'Play the Bhupali alankar demo in the Sargam Player, then sing along in sargam at 60–72 BPM.',
        'Sing it descending: S\' D P, D P G, P G R, G R S.',
        'Use the compare demo on the Virtual Keyboard to hear m vs M three times.',
        'Sing the Yaman alankar slowly, landing carefully on M each time.',
        'Check your M and N in the Pitch Matcher.',
        'Record one Bhupali and one Yaman pattern in the Recording Journal and listen for stray notes.',
      ],
      independentPractice: {
        instructions:
          'Alternate days: Bhupali alankar up and down (5 rounds), then Yaman alankar up and down (5 rounds), one note per beat. Sing in sargam first, then akaar.',
        durationMin: 15,
        tool: 'sargam',
        pattern: ['.N', 'R', 'G', 'R', 'G', 'M', 'G', 'M', 'D', 'M', 'D', 'N', 'D', 'N', "S'", "S'", 'N', 'D', 'N', 'D', 'P', 'D', 'P', 'M', 'P', 'M', 'G', 'M', 'G', 'R', 'G', 'R', 'S'],
        bpm: 66,
      },
      mistakes: [
        { mistake: 'Sneaking a Ma into Bhupali between G and P.', fix: 'Practise the leap G–P alone ten times against the drone before singing the full pattern.' },
        { mistake: 'Singing shuddh Ma in Yaman out of habit.', fix: 'Before each Yaman session, sing G M G M against the drone and check M in the Pitch Matcher.' },
        { mistake: 'Thinking that singing these alankars means you "know" the raga.', fix: 'Treat them as note familiarisation. Listen to recordings of the raga and, ideally, learn its chalan from a teacher.' },
      ],
      quiz: [
        { question: 'Which notes does Raga Bhupali use?', options: ['S R G m P D N', 'S R G P D', 'S r G m P d N', 'S R g m P D n'], answerIndex: 1, explanation: 'Bhupali is pentatonic: Sa, Re, Ga, Pa, Dha (Ma and Ni omitted).' },
        { question: 'Which Ma is used in Raga Yaman?', options: ['Shuddh Ma (m)', 'Both equally', 'Teevra Ma (M)', 'No Ma at all'], answerIndex: 2, explanation: 'Yaman uses teevra Ma; all other notes are shuddh.' },
        { question: 'How far apart are shuddh Ma and teevra Ma?', options: ['One semitone', 'A whole tone', 'A perfect fifth', 'An octave'], answerIndex: 0, explanation: 'Teevra Ma is one semitone above shuddh Ma.' },
        { question: 'Is singing raga alankars the same as performing a raga?', options: ['Yes, the note set is the whole raga', 'No — a raga also has chalan, pakad and rules of emphasis', 'Yes, if sung fast', 'Only in Bollywood'], answerIndex: 1, explanation: 'A raga is defined by its movement and characteristic phrases, not only its notes.' },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the Yaman notes, including teevra Ma, against the drone.',
        targets: ['.N', 'R', 'G', 'M', 'D', 'N', "S'"],
        minAttempts: 12,
        minSuccessPct: 70,
        toleranceCents: 30,
      },
      videoQueries: ['Raag Bhupali aaroh avaroh alankar practice', 'Raag Yaman alankar sargam practice teevra ma', 'Yaman vs Bhupali difference explained'],
      nextStep: 'Next: taans — running these notes faster with control.',
      estMinutes: 30,
    },
    // ───────────────────────── Module 2: Taans and Speed ─────────────────────────
    {
      id: 'l4-sapaat-taans',
      level: 4,
      module: 'Taans and Speed',
      title: 'Introduction to Taans: Sapaat and Alankarik',
      objective:
        'Understand what a taan is and sing a simple sapaat (straight) taan and an alankarik (patterned) taan in akaar, slowly and with clear notes.',
      explanation: {
        hinglish:
          "Taan ka matlab hai tez gati mein gaaye gaye notes ki ladi. Classical gaayaki mein taan aksar akaar ('aa') mein gaayi jaati hai. Bollywood mein bhi kai semi-classical gaanon mein chhoti taanein ya fast runs sunne milte hain.\n\nKuch types samajhiye:\n• Sapaat taan — seedha upar aur seedha neeche, jaise S R G m P D N S' N D P m G R S.\n• Alankarik taan — alankar ke pattern par bani taan, jaise S R G R, R G m G, G m P m...\n• Kut taan — notes ko tedhe-medhe, mixed order mein gaana (jaise S G R m G P...). Yeh zyada mushkil hai.\n\nTaan ki asli shuruaat dheemi gati se hoti hai. Har note alag aur sur mein hona chahiye, chahe kitna bhi tez gaayein. Agar notes ek blur jaise sunai dein, matlab speed zyada hai.\n\nTaan ke liye gala halka rakhna hota hai — volume kam, saans steady, jabda (jaw) relaxed. Kai log taan ke time pet ya gale ko jor se dabaate hain — isse awaaz tight ho jaati hai aur thakaan aati hai. Yaad rakhiye: taan ka kaam power nahi, agility hai.\n\nShuruaat: Metronome par 60 BPM, har beat par ek note. Phir har beat par do note. Jab do-teen din tak saaf lage, tab 5 BPM badhaiye.",
        english:
          "A taan is a run of notes sung at a fast tempo. In classical singing taans are usually sung in akaar ('aa'). Many semi-classical film songs also contain short taans or quick runs.\n\nA few types to know:\n• Sapaat taan — a straight run up and down, e.g. S R G m P D N S' N D P m G R S.\n• Alankarik taan — a taan built from an alankar pattern, e.g. S R G R, R G m G, G m P m...\n• Kut taan — notes in a mixed, zig-zag order (e.g. S G R m G P...). These are harder.\n\nEvery taan begins slowly. Each note must stay separate and in tune at every speed. If the notes blur into a smear, the tempo is too high for now.\n\nTaans need a light voice: moderate-to-soft volume, steady breath, relaxed jaw. Many beginners squeeze the throat or brace the abdomen hard during runs, which makes the sound tight and tiring. A taan is about agility, not force.\n\nMethod: Metronome at 60 BPM, one note per beat. Then two notes per beat. Increase by about 5 BPM only after the pattern has felt clean for two or three days. Many teachers also add a light 'a-a-a' articulation from the breath (not from the throat) to separate notes; experiment gently and stop if anything feels strained.",
        hindi:
          "तान तेज़ गति में गाए गए स्वरों की एक लड़ी है। शास्त्रीय गायन में तानें आमतौर पर आकार ('आ') में गाई जाती हैं। कई उप-शास्त्रीय फ़िल्मी गानों में भी छोटी तानें या तेज़ रन सुनाई देते हैं।\n\nकुछ प्रकार जान लीजिए:\n• सपाट तान — सीधे ऊपर और सीधे नीचे, जैसे S R G m P D N S' N D P m G R S।\n• अलंकारिक तान — किसी अलंकार के पैटर्न पर बनी तान, जैसे S R G R, R G m G, G m P m...\n• कूट तान — स्वर मिले-जुले, टेढ़े-मेढ़े क्रम में (जैसे S G R m G P...)। ये ज़्यादा कठिन होती हैं।\n\nहर तान धीमी गति से शुरू होती है। हर गति पर हर स्वर अलग और सुर में रहना चाहिए। अगर स्वर आपस में धुंधले होकर एक घसीट जैसे लगें, तो अभी के लिए गति बहुत तेज़ है।\n\nतान के लिए हल्की आवाज़ चाहिए: मध्यम से धीमा वॉल्यूम, स्थिर साँस, ढीला जबड़ा। कई शुरुआती लोग तान के समय गला भींच लेते हैं या पेट को ज़ोर से कस लेते हैं, जिससे आवाज़ कसी हुई और थकी हुई लगती है। तान का काम ताकत नहीं, फुर्ती है।\n\nतरीका: मेट्रोनोम 60 BPM पर, हर बीट पर एक स्वर। फिर हर बीट पर दो स्वर। जब पैटर्न दो-तीन दिन तक साफ़ लगे, तभी लगभग 5 BPM बढ़ाइए। कई गुरु स्वरों को अलग करने के लिए साँस से (गले से नहीं) हल्का 'अ-अ-अ' उच्चारण भी जोड़ते हैं; इसे धीरे-धीरे आज़माइए और ज़रा भी खिंचाव लगे तो रुक जाइए।",
      },
      whyItMatters:
        'Taans develop vocal agility, which makes fast film-song passages and classical improvisations possible without strain or pitch blur.',
      traditionNote:
        'Taan types and names vary between gharanas (e.g. some styles favour gamak taans with a heavier oscillation, others very light, clear "dana-dar" taans). This lesson only introduces the simplest forms; formal taan training needs a teacher.',
      demos: [
        { kind: 'sequence', label: 'Sapaat taan (slow)', notes: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'", 'N', 'D', 'P', 'm', 'G', 'R', 'S'], bpm: 90 },
        { kind: 'sequence', label: 'Sapaat taan (faster)', notes: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'", 'N', 'D', 'P', 'm', 'G', 'R', 'S'], bpm: 160 },
        { kind: 'sequence', label: 'Alankarik taan: S R G R, R G m G, G m P m, m P D P', notes: ['S', 'R', 'G', 'R', 'R', 'G', 'm', 'G', 'G', 'm', 'P', 'm', 'm', 'P', 'D', 'P'], bpm: 120 },
      ],
      guidedSteps: [
        'Warm up with 3 minutes of humming and gentle sirens; never start taans cold.',
        'Play the slow sapaat taan demo and sing along in sargam.',
        'Sing it in akaar at 60 BPM, one note per beat, on the Metronome & Taal tool.',
        'Move to two notes per beat at the same 60 BPM. Keep volume moderate.',
        'Try the alankarik taan slowly in akaar.',
        'Record a take in the Recording Journal; on playback, check whether every note is audible.',
      ],
      independentPractice: {
        instructions:
          'Sapaat taan in akaar, two notes per beat at 60 BPM (equal to 120 notes per minute). Five clean repetitions, rest, then five of the alankarik taan. Raise tempo only after clean days.',
        durationMin: 12,
        tool: 'metronome',
        pattern: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'", 'N', 'D', 'P', 'm', 'G', 'R', 'S'],
        bpm: 120,
      },
      mistakes: [
        { mistake: 'Notes blurring together into a slide.', fix: 'Drop the tempo until each note is distinct; think of tiny "steps", not a ramp.' },
        { mistake: 'Throat squeezing or getting louder as the taan speeds up.', fix: 'Sing at moderate volume and keep the jaw loose. If it tightens, stop and go slower.' },
        { mistake: 'Rushing past the top note S\' and going flat there.', fix: 'Practise only the top half (P D N S\' N D P) slowly, checking S\' in the Pitch Matcher.' },
      ],
      quiz: [
        { question: 'What is a sapaat taan?', options: ['A taan that moves straight up and/or down the scale', 'A slow glide between two notes', 'A rhythmic cycle', 'A taan without Sa'], answerIndex: 0, explanation: 'Sapaat means flat/straight: the notes move in sequence without zig-zag.' },
        { question: 'Taans in classical singing are most often sung in...', options: ['Lyrics only', 'Akaar (the "aa" vowel)', 'Humming only', 'Falsetto only'], answerIndex: 1, explanation: 'Akaar keeps the vowel open and consistent so notes are clear.' },
        { question: 'If your fast taan sounds like a smear, what should you do?', options: ['Sing louder', 'Add vibrato', 'Slow down until each note is distinct', 'Skip the hard notes'], answerIndex: 2, explanation: 'Clarity at a lower tempo is the only reliable path to clarity at a higher tempo.' },
        { question: 'Which is a kut taan?', options: ['S R G m P D N S\'', 'Notes in a mixed, zig-zag order such as S G R m G P', 'A taan sung on one note', 'A taan sung only descending'], answerIndex: 1, explanation: 'Kut taans combine notes in non-sequential order.' },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the notes of the sapaat taan accurately before you take them to speed.',
        targets: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"],
        minAttempts: 12,
        minSuccessPct: 70,
        toleranceCents: 30,
      },
      videoQueries: ['sapaat taan practice for beginners Hindustani vocal', 'how to practice taans slowly akaar', 'alankarik taan examples sargam'],
      nextStep: 'Next: building speed systematically while keeping pitch accurate.',
      estMinutes: 30,
      safetyNote:
        'Taans are athletic. Warm up first, keep volume moderate, and stop if you feel scratchiness, pain or hoarseness. Never push through strain to reach a tempo.',
    },
    {
      id: 'l4-pitch-accuracy-speed',
      level: 4,
      module: 'Taans and Speed',
      title: 'Pitch Accuracy at Higher Speeds',
      objective:
        'Use a metronome "ladder" to raise the tempo of a pattern step by step while keeping every note in tune.',
      explanation: {
        hinglish:
          "Speed badhane ka ek pakka tareeka hai — 'metronome ladder'. Ek pattern chuniye, jaise S R G m, R G m P, G m P D, m P D N, P D N S'. Pehle 60 BPM par ek note per beat gaaiye. Phir har beat par do note. Agar teen baar lagatar saaf aur sur mein gaa liya, toh 4–5 BPM badhaiye. Jahan galti hone lage, wahan se do kadam neeche aakar wahi tempo kuch din practice kariye.\n\nTez gaate waqt pitch kyun bigadti hai? Kuch kaaran:\n• Dimaag notes ko 'sochne' se pehle hi gala aage nikal jaata hai.\n• Upar ke notes par saans aur support kam ho jaata hai, toh woh flat ho jaate hain.\n• Jaw aur jeebh tight ho jaate hain.\n\nUpay: tez pattern ko 'chunks' mein todiye. Pehle sirf pehle chaar note saaf, phir agle chaar. Kabhi-kabhi rhythm badal kar practice kariye — jaise long-short (S—R G—m) ya short-long — isse har note par dhyan jaata hai.\n\nRecording sabse bada teacher hai. Tez gaate waqt hum khud ko sahi sunte hain, par playback par sach pata chalta hai. Recording Journal mein dheemi aur tez dono version record karke compare kariye.\n\nYaad rakhiye — Pitch Matcher har ek tez note ko pakad nahi paata, isliye pitch check slow version mein kariye aur speed ko recording se judge kariye.",
        english:
          "The reliable way to build speed is a 'metronome ladder'. Pick a pattern, e.g. S R G m, R G m P, G m P D, m P D N, P D N S'. Start at 60 BPM, one note per beat, then two notes per beat. After three consecutive clean, in-tune repetitions, raise the tempo by 4–5 BPM. When errors appear, step back two rungs and stay there for a few days.\n\nWhy does pitch slip at speed?\n• The voice runs ahead of the mind's 'map' of the notes.\n• Breath support drops on upper notes, so they go flat.\n• The jaw and tongue tense up.\n\nRemedies: practise in chunks — first four notes clean, then the next four, then join them. Practise with altered rhythms (long-short: S—R G—m, or short-long) so that every note gets attention at least once. This is a common technique in both Indian and Western training.\n\nRecording is your most honest teacher. While singing fast we tend to hear what we intended; playback shows what actually happened. Record slow and fast versions in the Recording Journal and compare.\n\nA practical note on the app: a pitch detector needs a short, steady sound to measure accurately, so it cannot reliably judge each note of a very fast run. Check pitch on the slow version with the Pitch Matcher, and judge speed clarity by listening to recordings.",
        hindi:
          "गति बढ़ाने का भरोसेमंद तरीका है 'मेट्रोनोम लैडर' (सीढ़ी)। एक पैटर्न चुनिए, जैसे S R G m, R G m P, G m P D, m P D N, P D N S'। 60 BPM पर हर बीट पर एक स्वर से शुरू कीजिए, फिर हर बीट पर दो स्वर। लगातार तीन बार साफ़ और सुर में गा लेने के बाद गति 4–5 BPM बढ़ाइए। जहाँ गलतियाँ होने लगें, वहाँ से दो सीढ़ी नीचे आइए और कुछ दिन वहीं अभ्यास कीजिए।\n\nतेज़ गाते समय सुर क्यों बिगड़ता है?\n• आवाज़ दिमाग़ के स्वरों के 'नक्शे' से आगे निकल जाती है।\n• ऊपर के स्वरों पर साँस का सहारा कम हो जाता है, इसलिए वे उतरे हुए (फ़्लैट) हो जाते हैं।\n• जबड़ा और जीभ कस जाते हैं।\n\nउपाय: टुकड़ों में अभ्यास कीजिए — पहले चार स्वर साफ़, फिर अगले चार, फिर दोनों को जोड़िए। बदली हुई लय में अभ्यास कीजिए (लंबा-छोटा: S—R G—m, या छोटा-लंबा), ताकि हर स्वर पर कम से कम एक बार पूरा ध्यान जाए। यह भारतीय और पश्चिमी, दोनों तरह के प्रशिक्षण में आम तकनीक है।\n\nरिकॉर्डिंग आपका सबसे ईमानदार शिक्षक है। तेज़ गाते समय हम वही सुनते हैं जो हम गाना चाहते थे; प्लेबैक बताता है कि असल में क्या हुआ। रिकॉर्डिंग जर्नल में धीमा और तेज़ दोनों संस्करण रिकॉर्ड करके तुलना कीजिए।\n\nऐप के बारे में एक व्यावहारिक बात: पिच डिटेक्टर को सही नापने के लिए थोड़ी देर तक स्थिर आवाज़ चाहिए, इसलिए वह बहुत तेज़ रन के हर स्वर को भरोसे से नहीं परख सकता। धीमे संस्करण पर पिच मैचर से सुर जाँचिए, और तेज़ गति की स्पष्टता रिकॉर्डिंग सुनकर परखिए।",
      },
      whyItMatters:
        'Speed without accuracy just repeats mistakes faster. A ladder method lets you gain tempo safely and measurably over weeks.',
      demos: [
        { kind: 'sequence', label: 'Chunk pattern at 80 BPM', notes: ['S', 'R', 'G', 'm', 'R', 'G', 'm', 'P', 'G', 'm', 'P', 'D', 'm', 'P', 'D', 'N', 'P', 'D', 'N', "S'"], bpm: 80 },
        { kind: 'sequence', label: 'Same pattern at 140 BPM', notes: ['S', 'R', 'G', 'm', 'R', 'G', 'm', 'P', 'G', 'm', 'P', 'D', 'm', 'P', 'D', 'N', 'P', 'D', 'N', "S'"], bpm: 140 },
        { kind: 'sequence', label: 'Same pattern at 200 BPM', notes: ['S', 'R', 'G', 'm', 'R', 'G', 'm', 'P', 'G', 'm', 'P', 'D', 'm', 'P', 'D', 'N', 'P', 'D', 'N', "S'"], bpm: 200 },
      ],
      guidedSteps: [
        'Write your starting tempo in the Recording Journal notes (e.g. "60 BPM, 2 notes/beat").',
        'Sing the chunk pattern at 60 BPM, one note per beat, in sargam on the Metronome & Taal tool.',
        'Switch to two notes per beat. Do three clean repetitions.',
        'Raise by 4–5 BPM. Repeat until the first error, then go down two steps.',
        'Practise the pattern with a long-short rhythm once, then short-long once.',
        'Record your final tempo in akaar and listen back.',
        'Check P, N and S\' in the Pitch Matcher, as upper notes go flat most often at speed.',
      ],
      independentPractice: {
        instructions:
          'Daily ladder on the chunk pattern: start 10 BPM below yesterday\'s best, climb by 4–5 BPM per three clean repetitions, stop at the first strain. Log your top clean tempo.',
        durationMin: 15,
        tool: 'metronome',
        pattern: ['S', 'R', 'G', 'm', 'R', 'G', 'm', 'P', 'G', 'm', 'P', 'D', 'm', 'P', 'D', 'N', 'P', 'D', 'N', "S'"],
        bpm: 100,
      },
      mistakes: [
        { mistake: 'Jumping 20–30 BPM at once.', fix: 'Small steps of 4–5 BPM. Gains of a few BPM per week are normal and healthy.' },
        { mistake: 'Practising only at your edge tempo, so mistakes become habits.', fix: 'Spend most repetitions slightly below your best tempo, and only a few at the edge.' },
        { mistake: 'Upper notes going flat at speed.', fix: 'Keep breath flowing through the top; practise the top chunk alone and check S\' in the Pitch Matcher.' },
      ],
      quiz: [
        { question: 'In the metronome ladder, when do you raise the tempo?', options: ['After three consecutive clean, in-tune repetitions', 'Every repetition', 'When you feel bored', 'Only once a month'], answerIndex: 0, explanation: 'Consistency at one tempo shows you are ready for the next rung.' },
        { question: 'Why practise with long-short and short-long rhythms?', options: ['To make the song sound jazzy', 'So that every note receives focused attention', 'To avoid the metronome', 'To sing louder'], answerIndex: 1, explanation: 'Varying rhythm forces each note to be placed deliberately at least once.' },
        { question: 'How should you check pitch for a very fast run in this app?', options: ['Only with the Pitch Matcher at full speed', 'Pitch does not matter at speed', 'Check pitch on the slow version and judge fast clarity by recording', 'Ask the metronome'], answerIndex: 2, explanation: 'Pitch detectors need steady tones; fast runs are better judged by listening back.' },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the upper notes that tend to go flat at speed.',
        targets: ['G', 'P', 'D', 'N', "S'"],
        minAttempts: 14,
        minSuccessPct: 72,
        toleranceCents: 30,
      },
      videoQueries: ['how to sing fast runs in tune vocal exercise', 'metronome practice method increase speed singing', 'taan speed practice riyaz tips'],
      nextStep: 'Next: rhythm in multiples — dugun, tigun, chaugun and tihai.',
      estMinutes: 25,
      safetyNote: 'Tempo goals are never worth strain. If your throat tightens, stop, sip water, and continue at a slower tempo another day.',
    },
    // ───────────────────────── Module 3: Rhythm and Layakari ─────────────────────────
    {
      id: 'l4-layakari-tihai',
      level: 4,
      module: 'Rhythm and Layakari',
      title: 'Layakari: Dugun, Tigun, Chaugun and Tihai',
      objective:
        'Sing a sargam pattern at 1, 2, 3 and 4 notes per matra against a steady taal, and sing a simple tihai that lands on sam.',
      explanation: {
        hinglish:
          "Layakari ka matlab hai laya (tempo) ke saath khelna — taal ki speed same rehti hai, par aap ek matra mein kitne note gaate hain, woh badalta hai.\n\n• Thah / barabar laya: 1 note per matra.\n• Dugun: 2 notes per matra (double).\n• Tigun: 3 notes per matra (triple).\n• Chaugun: 4 notes per matra (quadruple).\n\nZaroori baat: taal tez nahi hota! Metronome ya theka wahi rehta hai, sirf notes ki ginti badalti hai. Tigun sabse mushkil lagta hai kyunki 3 notes ko ek beat mein barabar baantna padta hai — 'ta-ki-ta' bolkar practice kariye.\n\nTihai: ek phrase ko teen baar gaana, is tarah ki teesri baar ka aakhri note sam (taal ki pehli matra) par gire. Tihai se ek prakar ka 'final' ya conclusion ka ehsaas aata hai — classical aur film music dono mein milta hai.\n\nTeentaal (16 matra) mein ek simple tihai: phrase 'P G R S' (har note ek matra), beech mein ek matra ka gap. Total: 4 + 1 + 4 + 1 + 4 = 14 matra. Agar aap matra 4 se shuru karein, toh aakhri S agle cycle ki matra 1 — yaani sam — par girega. Ginti kariye: 4 se 17 tak, aur 17 = agla sam.\n\nPehle haath se taali dekar ginti kariye, phir Metronome & Taal tool ke saath.",
        english:
          "Layakari means playing with laya (tempo and rhythmic density). The taal keeps the same speed; what changes is how many notes you place in each matra (beat).\n\n• Thah / barabar: 1 note per matra.\n• Dugun: 2 notes per matra.\n• Tigun: 3 notes per matra.\n• Chaugun: 4 notes per matra.\n\nKey point: the taal does not speed up. The theka or metronome stays constant; only the number of notes per beat changes. Tigun usually feels hardest because three notes must be spaced evenly in one beat — speak 'ta-ki-ta' to feel it.\n\nA tihai is a phrase repeated three times so that the final note of the third repetition lands on sam (the first matra of the cycle). It creates a strong sense of arrival and is used in both classical music and film music.\n\nA simple tihai in teentaal (16 matras): the phrase 'P G R S', one note per matra, with a one-matra gap between repetitions. Total length: 4 + 1 + 4 + 1 + 4 = 14 matras. If you start on matra 4, the final S falls on matra 17 — which is matra 1 of the next cycle, i.e. sam. Count it: 4, 5, 6, 7 (phrase), 8 (gap), 9–12 (phrase), 13 (gap), 14, 15, 16, 1 (phrase, ending on sam).\n\nCount with hand claps first, then with the Metronome & Taal tool.",
        hindi:
          "लयकारी का अर्थ है लय (गति और स्वरों के घनत्व) के साथ खेलना। ताल की गति वही रहती है; बदलता यह है कि आप हर मात्रा (बीट) में कितने स्वर रखते हैं।\n\n• ठाह / बराबर: हर मात्रा में 1 स्वर।\n• दुगुन: हर मात्रा में 2 स्वर।\n• तिगुन: हर मात्रा में 3 स्वर।\n• चौगुन: हर मात्रा में 4 स्वर।\n\nमुख्य बात: ताल तेज़ नहीं होता। ठेका या मेट्रोनोम एक जैसा रहता है; केवल हर बीट में स्वरों की संख्या बदलती है। तिगुन अक्सर सबसे कठिन लगता है, क्योंकि तीन स्वरों को एक बीट में बराबर बाँटना होता है — इसे महसूस करने के लिए 'त-कि-ट' बोलिए।\n\nतिहाई एक वाक्यांश है जिसे तीन बार दोहराया जाता है, ताकि तीसरी बार का आख़िरी स्वर सम (ताल-चक्र की पहली मात्रा) पर आए। इससे 'पहुँचने' का गहरा एहसास होता है, और यह शास्त्रीय और फ़िल्मी संगीत दोनों में इस्तेमाल होती है।\n\nतीनताल (16 मात्रा) में एक सरल तिहाई: वाक्यांश 'P G R S', हर स्वर एक मात्रा का, और हर दोहराव के बीच एक मात्रा का अंतराल। कुल लंबाई: 4 + 1 + 4 + 1 + 4 = 14 मात्राएँ। अगर आप मात्रा 4 से शुरू करें, तो आख़िरी S मात्रा 17 पर आता है — जो अगले चक्र की मात्रा 1, यानी सम है। गिनकर देखिए: 4, 5, 6, 7 (वाक्यांश), 8 (अंतराल), 9–12 (वाक्यांश), 13 (अंतराल), 14, 15, 16, 1 (वाक्यांश, सम पर अंत)।\n\nपहले हाथ से ताली देकर गिनिए, फिर मेट्रोनोम और ताल टूल के साथ।",
      },
      whyItMatters:
        'Layakari gives you rhythmic control and confidence, so fast passages sit exactly on the beat and endings land precisely on sam.',
      traditionNote:
        'Advanced layakari includes ratios like aad (3 in 2) and kuaad (5 in 4) and complex tihais (e.g. chakradar). This lesson covers only simple whole-number multiples and a basic tihai.',
      demos: [
        { kind: 'taal', label: 'Teentaal theka at slow tempo', taal: 'teentaal', bpm: 60, cycles: 2 },
        { kind: 'sequence', label: 'Thah: S R G m P D N S\' (1 per beat at 60)', notes: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"], bpm: 60 },
        { kind: 'sequence', label: 'Dugun of the same (2 per beat → 120)', notes: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"], bpm: 120 },
        { kind: 'sequence', label: 'Chaugun (4 per beat → 240)', notes: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"], bpm: 240 },
        { kind: 'sequence', label: 'Tihai phrase: P G R S - P G R S - P G R S', notes: ['P', 'G', 'R', 'S', '-', 'P', 'G', 'R', 'S', '-', 'P', 'G', 'R', 'S'], bpm: 80 },
      ],
      guidedSteps: [
        'Open the Metronome & Taal tool on teentaal at 60 BPM. Clap and count 1–16, saying "sam" on 1.',
        'Sing S R G m P D N S\' one note per matra (thah).',
        'Without changing the tempo, sing two notes per matra (dugun).',
        'Speak "ta-ki-ta" per beat, then sing three notes per matra (tigun).',
        'Sing four notes per matra (chaugun) — slow the taal to 50 BPM if needed.',
        'Sing the tihai starting at matra 4 and check the final S lands on sam.',
        'Record a take of thah → dugun → chaugun in the Recording Journal and check the beat alignment.',
      ],
      independentPractice: {
        instructions:
          'With teentaal at 60 BPM, sing the scale in thah, dugun, tigun and chaugun without stopping the taal (one 16-matra cycle each, repeating the scale up and down as needed to fill the cycle). Then sing the tihai from matra 4 three times. If tigun or chaugun wobbles, practise it at 50 BPM.',
        durationMin: 15,
        tool: 'taal',
        pattern: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"],
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Speeding up the taal when switching to dugun.', fix: 'Keep the Metronome & Taal tool running at a fixed tempo; only your note density changes.' },
        { mistake: 'Uneven tigun (two quick notes and one long).', fix: 'Speak "ta-ki-ta" with equal syllables before singing; record and listen.' },
        { mistake: 'Tihai ending one matra before or after sam.', fix: 'Count the gaps out loud. Write the matra numbers above the phrase before singing.' },
      ],
      quiz: [
        { question: 'In dugun, how many notes are sung per matra?', options: ['1', '2', '3', '4'], answerIndex: 1, explanation: 'Dugun means double: two notes per matra.' },
        { question: 'When you move from thah to chaugun, what happens to the taal tempo?', options: ['It becomes four times faster', 'It halves', 'It stays the same', 'It stops'], answerIndex: 2, explanation: 'The taal is constant; you sing four notes in each matra.' },
        { question: 'What is a tihai?', options: ['A three-beat taal', 'A type of ornament', 'Three singers in harmony', 'A phrase repeated three times, ending on sam'], answerIndex: 3, explanation: 'A tihai repeats a phrase three times so the last note arrives on sam.' },
        { question: 'A 4-matra phrase with 1-matra gaps, repeated three times, takes how many matras?', options: ['12', '13', '14', '16'], answerIndex: 2, explanation: '4 + 1 + 4 + 1 + 4 = 14 matras.' },
        { question: 'In teentaal, starting that 14-matra tihai on which matra makes it end on sam?', options: ['Matra 1', 'Matra 3', 'Matra 4', 'Matra 9'], answerIndex: 2, explanation: 'Starting on 4, the last note is on matra 17, which is sam of the next cycle.' },
      ],
      practical: {
        kind: 'self-check',
        description: 'Rhythmic placement is judged by listening, not by the pitch detector.',
        items: [
          'I sang the scale in thah, dugun and chaugun against teentaal without the taal tempo changing.',
          'I sang tigun with three even notes per matra at least at 50 BPM.',
          'I sang the P G R S tihai from matra 4 and the final S landed on sam.',
          'I recorded one layakari take in the Recording Journal and checked alignment on playback.',
        ],
      },
      videoQueries: ['layakari dugun tigun chaugun explained', 'tihai in teentaal explained for vocalists', 'teentaal dugun practice sargam'],
      nextStep: 'Next: start improvising within a raga.',
      estMinutes: 35,
    },
    // ───────────────────────── Module 4: Improvisation and Phrase Control ─────────────────────────
    {
      id: 'l4-improvisation-basics',
      level: 4,
      module: 'Improvisation and Phrase Control',
      title: 'Improvisation Basics Within a Raga',
      objective:
        'Create short original phrases using only the notes of Raga Bhupali, using a question–answer (call and response) structure that resolves to Sa.',
      explanation: {
        hinglish:
          "Improvisation ka matlab 'kuch bhi gaa dena' nahi hai. Hindustani sangeet mein improvisation hamesha raga ke niyamon ke andar hota hai — jaise ek bhasha ke shabdon se apna naya vaakya banana.\n\nShuruaat Bhupali se kariye, kyunki iske sirf paanch note hain: S R G P D. Inmein koi 'galat' note nahi lagta, isliye dimaag sirf creativity par focus kar sakta hai.\n\nQuestion–answer technique:\n• Sawaal (question) phrase kisi 'khule' note par khatam hota hai — jaise G ya P. Aisa lagta hai baat abhi poori nahi hui. Example: S R G - P G.\n• Jawaab (answer) phrase Sa par aakar 'ghar' pahunchta hai. Example: G R S .D S -.\n\nNiyam:\n1. Chhote phrases — 3 se 6 notes.\n2. Har phrase ke baad saans aur thoda silence. Silence bhi music ka hissa hai.\n3. Pehle sirf 3 notes (S R G) se improvise kariye, phir P, phir D jodiye.\n4. Ek phrase ko repeat karke thoda badaliye — yeh 'development' kehlaata hai.\n\nTanpura Drone chalaiye aur dheere-dheere gaaiye, jaise aalaap. Galti hogi, phrases ajeeb lagenge — bilkul normal hai. Recording sunkar dekhiye kaun se phrases sundar lage aur unhe yaad rakhiye.\n\nYaad rahe: yeh ek simplified shuruaat hai. Asli raga vistaar (aalaap, bandish ka vistaar) mein raga ke chalan aur pakad ka gehra gyaan chahiye, jo guru se seekha jaata hai.",
        english:
          "Improvisation does not mean singing anything at all. In Hindustani music, improvisation always happens inside the rules of a raga — like building your own sentences from the vocabulary and grammar of a language.\n\nStart with Raga Bhupali, because it has only five notes: S R G P D. It has no komal or teevra notes, and as long as you stay on these five notes (leaving out Ma and Ni) any slow phrase sounds 'in the raga', so your mind can focus on making phrases.\n\nQuestion–answer technique:\n• A question phrase ends on an 'open' note such as G or P, so it feels unfinished. Example: S R G - P G.\n• An answer phrase comes home to Sa. Example: G R S .D S -.\n\nGuidelines:\n1. Keep phrases short — 3 to 6 notes.\n2. Breathe and leave a moment of silence after each phrase. Silence is part of music.\n3. Begin with only three notes (S R G), then add P, then D, then mandra .D.\n4. Repeat a phrase with one small change — this is how ideas develop.\n\nPlay the Tanpura Drone and sing slowly, in the spirit of a simple aalaap. Many phrases will feel clumsy at first; that is normal. Record yourself, notice which phrases you like, and keep them.\n\nNote: this is a simplified entry point. Real raga elaboration (aalaap, bandish vistaar) depends on deep knowledge of the raga's chalan and pakad, which is best learned from a teacher and from extensive listening to good recordings of the raga.",
        hindi:
          "इम्प्रोवाइज़ेशन (उपज) का मतलब कुछ भी गा देना नहीं है। हिंदुस्तानी संगीत में उपज हमेशा राग के नियमों के भीतर होती है — जैसे किसी भाषा के शब्दों और व्याकरण से अपने नए वाक्य बनाना।\n\nराग भूपाली से शुरू कीजिए, क्योंकि इसमें केवल पाँच स्वर हैं: S R G P D। इसमें कोई कोमल या तीव्र स्वर नहीं है, और जब तक आप इन्हीं पाँच स्वरों पर रहते हैं (म और नि छोड़कर), हर धीमा वाक्यांश 'राग में' लगता है, इसलिए आपका ध्यान वाक्यांश बनाने पर रह सकता है।\n\nसवाल–जवाब तकनीक:\n• सवाल वाला वाक्यांश किसी 'खुले' स्वर, जैसे G या P, पर ख़त्म होता है, इसलिए वह अधूरा लगता है। उदाहरण: S R G - P G।\n• जवाब वाला वाक्यांश सा पर 'घर' लौट आता है। उदाहरण: G R S .D S -।\n\nदिशानिर्देश:\n1. वाक्यांश छोटे रखिए — 3 से 6 स्वर।\n2. हर वाक्यांश के बाद साँस लीजिए और थोड़ा मौन छोड़िए। मौन भी संगीत का हिस्सा है।\n3. पहले केवल तीन स्वरों (S R G) से शुरू कीजिए, फिर P जोड़िए, फिर D, फिर मंद्र .D।\n4. किसी वाक्यांश को एक छोटे बदलाव के साथ दोहराइए — विचार इसी तरह आगे बढ़ते हैं।\n\nतानपुरा ड्रोन चलाइए और एक सरल आलाप की तरह धीरे-धीरे गाइए। शुरू में कई वाक्यांश बेढंगे लगेंगे; यह बिल्कुल सामान्य है। ख़ुद को रिकॉर्ड कीजिए, देखिए कौन-से वाक्यांश अच्छे लगे, और उन्हें याद रखिए।\n\nध्यान दें: यह एक सरल शुरुआत है। असली राग-विस्तार (आलाप, बंदिश का विस्तार) राग के चलन और पकड़ के गहरे ज्ञान पर निर्भर करता है, जो गुरु से और राग की अच्छी रिकॉर्डिंग खूब सुनकर सबसे अच्छी तरह सीखा जाता है।",
      },
      whyItMatters:
        'Improvising within a raga turns scale knowledge into musical language. It also builds the confidence to make small, tasteful variations in songs instead of copying every detail.',
      traditionNote:
        'In formal training, improvisation is learned gradually through aalaap and bandish under a guru, absorbing raga-specific phrases. Question–answer phrasing is a teaching simplification that helps beginners start.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone on your Sa' },
        { kind: 'sequence', label: 'Question phrase: S R G - P G', notes: ['S', 'R', 'G', '-', 'P', 'G'], bpm: 60 },
        { kind: 'sequence', label: 'Answer phrase: G R S .D S', notes: ['G', 'R', 'S', '.D', 'S', '-'], bpm: 60 },
        { kind: 'sequence', label: "Longer Bhupali idea: G P D S' D P G R S", notes: ['G', 'P', 'D', "S'", '-', 'D', 'P', 'G', 'R', 'S'], bpm: 66 },
      ],
      guidedSteps: [
        'Start the Tanpura Drone. Sing S R G P D S\' and back slowly once.',
        'Play the question and answer demos in the Sargam Player and sing them back.',
        'Using only S R G, sing five of your own phrases, each ending on S.',
        'Add P: make three question phrases ending on G or P, each followed by an answer ending on S.',
        'Add D and mandra .D, and create a 1-minute slow improvisation in akaar.',
        'Record it in the Recording Journal. Mark your two favourite phrases.',
        'Check any doubtful notes (especially D and .D) in the Pitch Matcher.',
      ],
      independentPractice: {
        instructions:
          'Daily: 2 minutes of Bhupali question–answer improvisation with the drone, in sargam then akaar. Keep one "phrase notebook" entry per day in the Recording Journal.',
        durationMin: 12,
        tool: 'drone',
        pattern: ['S', 'R', 'G', 'P', 'D', "S'", 'D', 'P', 'G', 'R', 'S', '.D', 'S'],
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Accidentally singing Ma or Ni in Bhupali.', fix: 'Sing slowly; if you hear a stray note, return to S R G only and rebuild.' },
        { mistake: 'Endless, breathless phrases with no shape.', fix: 'Limit phrases to 3–6 notes, breathe after each, and end clearly on S or a chosen resting note.' },
        { mistake: 'Freezing because you fear sounding "wrong".', fix: 'Within Bhupali notes, any slow phrase is a valid experiment. Record, review, keep the good ones.' },
      ],
      quiz: [
        { question: 'In Hindustani music, improvisation happens...', options: ['Within the notes and rules of the raga', 'With any notes at all', 'Only in film songs', 'Only with lyrics'], answerIndex: 0, explanation: 'The raga provides the notes and movement rules; improvisation is creativity inside them.' },
        { question: 'A "question" phrase usually ends on...', options: ['Sa, for a sense of arrival', 'An open note like G or P, so it feels unfinished', 'A rest only', 'Teevra Ma'], answerIndex: 1, explanation: 'Ending away from Sa creates tension that an "answer" resolves.' },
        { question: 'Why start improvising in Bhupali?', options: ['It has the most notes', 'It uses only komal notes', 'It has no Sa', 'It has just five shuddh notes (no komal or teevra notes) to keep track of'], answerIndex: 3, explanation: 'With only S R G P D (Ma and Ni left out), beginners can focus on phrase-making.' },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Match the Bhupali notes you use when improvising, including mandra Dha.',
        targets: ['.D', 'S', 'R', 'G', 'P', 'D', "S'"],
        minAttempts: 12,
        minSuccessPct: 70,
        toleranceCents: 30,
      },
      videoQueries: ['Raag Bhupali aalaap for beginners', 'how to improvise in a raga beginner vocal', 'call and response singing practice Indian classical'],
      nextStep: 'Next: controlling long phrases with breath planning and dynamics.',
      estMinutes: 30,
    },
    {
      id: 'l4-advanced-phrase-control',
      level: 4,
      module: 'Improvisation and Phrase Control',
      title: 'Advanced Phrase Control: Long Lines and Dynamics',
      objective:
        'Plan breaths for long phrases, sustain notes steadily, and shape a held note with a controlled crescendo and decrescendo without pitch drift.',
      explanation: {
        hinglish:
          "Lambe phrase gaana sirf zyada saans lene ka khel nahi hai — yeh saans ko samajhdaari se kharch karne ka khel hai.\n\nBreath planning: gaana seekhne se pehle lyrics ya sargam par pencil se saans ke nishaan lagaiye (jaise '/' ya 'V'). Saans hamesha shabd ya phrase ke natural break par leni chahiye, shabd ke beech mein nahi. Agar ek line bahut lambi hai, toh pehle se tay kariye ki ek chhoti 'chupke wali saans' (catch breath) kahan lenge.\n\nSaans ki shuruaat mein hi saari hawa phenk dena common galti hai. Socho ki hawa ek dheemi, barabar dhaar hai — phrase ke end tak bachi rehni chahiye.\n\nDynamics: ek note ko dheere se shuru karke badhana (crescendo) aur phir kam karna (decrescendo) — yeh ek classic control exercise hai — Western training mein ise 'messa di voce' kehte hain. Sabse badi chunauti: volume badalte waqt pitch stable rakhna. Aksar log volume badhane par sharp aur kam karne par flat ho jaate hain.\n\nExercise: Tanpura Drone par S par 8 count tak — 1–4 badhaiye, 5–8 ghataaiye. Phir G aur P par. Pitch Matcher mein dekhiye ki suii sthir hai ya nahi.\n\nLamba phrase: S R G m P m G R S ek saans mein, dheemi laya mein. Dhire-dhire tempo kam karke phrase ko lamba kariye.\n\nKabhi bhi chakkar aaye ya gala tight lage, toh ruk jaaiye. Saans ka control samay ke saath badhta hai, zabardasti se nahi.",
        english:
          "Long phrases are not just about taking a bigger breath; they are about spending breath wisely.\n\nBreath planning: before learning a song or pattern, mark breath points in pencil ('/' or 'V'). Breathe at natural phrase or word boundaries, never in the middle of a word. If a line is very long, decide in advance where a small, quick 'catch breath' will go.\n\nA common error is dumping a lot of air in the first second. Think of the breath as a slow, even stream that must last to the end of the phrase.\n\nDynamics: starting a note softly, swelling it (crescendo) and then fading it (decrescendo) is a classic control exercise — in Western training it is related to 'messa di voce'. The challenge is keeping pitch stable while volume changes; many singers go sharp as they get louder and flat as they get softer.\n\nExercise: on the Tanpura Drone, hold S for 8 counts — swell on 1–4, fade on 5–8. Repeat on G and P. Watch the Pitch Matcher to see whether your pitch stays centred.\n\nLong phrase: sing S R G m P m G R S on one breath at a slow tempo. Over days, slow the tempo further so the same phrase demands more control.\n\nIf you feel dizzy, light-headed or tight in the throat, stop and rest. Breath control grows with consistent, relaxed practice, not with forcing.",
        hindi:
          "लंबे वाक्यांश सिर्फ़ बड़ी साँस लेने की बात नहीं हैं; वे साँस को समझदारी से ख़र्च करने की बात हैं।\n\nसाँस की योजना: कोई गाना या पैटर्न सीखने से पहले पेंसिल से साँस लेने की जगहें चिह्नित कीजिए ('/' या 'V')। साँस वाक्यांश या शब्द की स्वाभाविक सीमा पर लीजिए, कभी किसी शब्द के बीच में नहीं। अगर कोई पंक्ति बहुत लंबी है, तो पहले से तय कर लीजिए कि एक छोटी, तेज़ 'कैच ब्रेथ' कहाँ लेंगे।\n\nएक आम गलती है पहले ही सेकंड में बहुत सारी हवा निकाल देना। साँस को एक धीमी, बराबर धारा समझिए जो वाक्यांश के अंत तक चलनी चाहिए।\n\nडायनामिक्स: किसी स्वर को धीरे से शुरू करके बढ़ाना (क्रेसेंडो) और फिर धीमा करना (डिक्रेसेंडो) एक क्लासिक नियंत्रण अभ्यास है — पश्चिमी प्रशिक्षण में इसे 'मेसा दि वोचे' (messa di voce) से जोड़ा जाता है। चुनौती है वॉल्यूम बदलते समय सुर को स्थिर रखना; कई गायक तेज़ होने पर चढ़ जाते हैं (शार्प) और धीमे होने पर उतर जाते हैं (फ़्लैट)।\n\nअभ्यास: तानपुरा ड्रोन पर S को 8 गिनती तक रोकिए — 1–4 पर बढ़ाइए, 5–8 पर घटाइए। फिर G और P पर दोहराइए। पिच मैचर में देखिए कि आपका सुर बीच में टिका रहता है या नहीं।\n\nलंबा वाक्यांश: S R G m P m G R S को धीमी गति में एक साँस में गाइए। कुछ दिनों में गति और धीमी कीजिए, ताकि वही वाक्यांश ज़्यादा नियंत्रण माँगे।\n\nअगर चक्कर आए, सिर हल्का लगे या गला कसा हुआ लगे, तो रुककर आराम कीजिए। साँस का नियंत्रण नियमित, ढीले-ढाले अभ्यास से बढ़ता है, ज़बरदस्ती से नहीं।",
      },
      whyItMatters:
        'Many Bollywood ballads and classical phrases require long, smooth lines. Planned breaths and stable pitch through dynamics make singing sound effortless and expressive.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone on your Sa' },
        { kind: 'note', label: 'Hold Sa (practise swell and fade)', swara: 'S', durationSec: 8 },
        { kind: 'note', label: 'Hold Pa (practise swell and fade)', swara: 'P', durationSec: 8 },
        { kind: 'sequence', label: 'One-breath phrase: S R G m P m G R S', notes: ['S', 'R', 'G', 'm', 'P', 'm', 'G', 'R', 'S'], bpm: 50 },
      ],
      guidedSteps: [
        'Lie or stand relaxed; take three slow low breaths, feeling the waist and lower ribs expand.',
        'With the Tanpura Drone, hold S for 8 counts: swell over 1–4, fade over 5–8. Watch the Pitch Matcher.',
        'Repeat on G and P. Note which note drifts most.',
        'Sing the one-breath phrase at 60 BPM, then 50, then 44 using the Metronome & Taal tool.',
        'Take a song you know, write the lyrics outline (not full lyrics) and mark breath points.',
        'Record the song line with planned breaths in the Recording Journal and listen for gasps or late breaths.',
      ],
      independentPractice: {
        instructions:
          'Daily: three swell-and-fade holds on S, G, P (8 counts each), then the one-breath phrase at the slowest tempo you can manage comfortably. Log the tempo.',
        durationMin: 12,
        tool: 'pitch-match',
        pattern: ['S', 'R', 'G', 'm', 'P', 'm', 'G', 'R', 'S'],
        bpm: 50,
      },
      mistakes: [
        { mistake: 'Going sharp on the crescendo and flat on the decrescendo.', fix: 'Practise smaller dynamic changes first while watching the Pitch Matcher; widen the range gradually.' },
        { mistake: 'Breathing in the middle of a word.', fix: 'Mark breath points before singing and rehearse them like notes.' },
        { mistake: 'Using up most of the air at the start of the phrase.', fix: 'Start with a gentle onset and imagine a thin, steady stream of air.' },
      ],
      quiz: [
        { question: 'Where should breaths usually be placed in a song?', options: ['Anywhere you run out', 'In the middle of long words', 'At natural phrase or word boundaries', 'Only at the end of the song'], answerIndex: 2, explanation: 'Breathing at phrase boundaries preserves meaning and musical flow.' },
        { question: 'What is the main technical challenge of swelling and fading a held note?', options: ['Keeping the pitch stable while volume changes', 'Singing faster', 'Changing vowels', 'Using falsetto'], answerIndex: 0, explanation: 'Volume changes tend to pull pitch sharp or flat; stability is the goal.' },
        { question: 'If you feel light-headed during breath exercises, you should...', options: ['Push through', 'Breathe faster', 'Stop and rest', 'Hold your breath longer'], answerIndex: 2, explanation: 'Light-headedness means you should stop; control develops gradually.' },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Hold steady pitch on the notes you used for swell-and-fade practice.',
        targets: ['S', 'G', 'P', 'm'],
        minAttempts: 10,
        minSuccessPct: 72,
        toleranceCents: 25,
      },
      videoQueries: ['messa di voce exercise for beginners', 'breath planning for singers long phrases', 'how to sustain long notes singing without going flat'],
      nextStep: 'Next: using ornaments in the right context.',
      estMinutes: 25,
      safetyNote: 'Never hold your breath to the point of strain or dizziness. Relax the neck and shoulders, and stop if anything hurts.',
    },
    // ───────────────────────── Module 5: Ornamentation, Expression and Harmony ─────────────────────────
    {
      id: 'l4-ornamentation-context',
      level: 4,
      module: 'Ornamentation, Expression and Harmony',
      title: 'Ornamentation in Context: Taste and Restraint',
      objective:
        'Decide when meend, murki, kan swar and harkat suit a phrase in Bollywood vs classical singing, and apply them sparingly and in tune.',
      explanation: {
        hinglish:
          "Pichhle levels mein aapne meend, kan, murki jaise ornaments seekhe. Ab sawaal hai — kab lagayein aur kab nahi?\n\nChhota sa recap:\n• Meend — ek note se doosre note tak smooth glide.\n• Kan swar — mukhya note se pehle ek bahut chhota 'touch' note.\n• Murki — teen-chaar notes ka chhota, tez, ghumaavdaar cluster.\n• Harkat — chhoti tez ornamentation ke liye Bollywood mein aam taur par istemaal hone wala shabd.\n\nClassical mein ornaments raga ke niyamon se jude hote hain. Jaise kisi raga mein ek khaas meend us raga ki pehchaan hoti hai, aur kisi doosre raga mein wahi meend galat lag sakti hai.\n\nBollywood mein ornaments gaane ke mood aur arrangement par depend karte hain. Ek semi-classical ya ghazal-type gaana murkiyon se sundar lagta hai. Ek simple romantic pop ya rock gaane mein zyada murkiyan gaane ko bhaari aur dikhaave wala bana deti hain.\n\nTaste ke niyam:\n1. Pehle gaana bina ornament ke, bilkul saaf, sur mein gaaiye.\n2. Original recording dhyan se suniye — ornament kahan hai, kahan nahi.\n3. Ek line mein ek ya do ornament kaafi hain. 'Kam hi zyada hai.'\n4. Ornament ke start aur end ke note dono sur mein hone chahiye — warna woh sirf 'galat note' lagta hai.\n5. Lyrics ka arth samjhiye; ornament bhav ko support kare, distract na kare.\n\nRecording Journal mein ek line ko teen tarah gaaiye — plain, ek ornament, bahut saare ornaments — aur khud sunkar decide kariye.",
        english:
          "You have already met ornaments like meend, kan and murki. The question now is when to use them — and when not to.\n\nQuick recap:\n• Meend — a smooth glide from one note to another.\n• Kan swar — a very brief grace note touched before the main note.\n• Murki — a short, quick cluster of three or four notes turning around a note.\n• Harkat — a term commonly used in film-music circles for small quick embellishments.\n\nIn classical music, ornaments are tied to the raga. A particular meend can be part of one raga's identity and sound wrong in another raga.\n\nIn Bollywood, ornaments follow the song's mood, era and arrangement. A semi-classical or ghazal-style song often welcomes murkis; a simple romantic pop or rock-style song can sound heavy and show-offy with too many.\n\nPrinciples of taste:\n1. First sing the song plain, clean and in tune.\n2. Listen closely to the original recording — where are the ornaments, and where is the line deliberately plain?\n3. One or two ornaments per line is usually plenty. Less is often more.\n4. The start and end notes of every ornament must be in tune; otherwise it just sounds like a wrong note.\n5. Understand the lyric; an ornament should support the feeling, not distract from it.\n\nIn the Recording Journal, sing one line three ways — plain, with one ornament, and heavily ornamented — then judge honestly which serves the song.",
        hindi:
          "आप मींड, कण और मुरकी जैसे अलंकरण पहले ही सीख चुके हैं। अब सवाल है कि उन्हें कब लगाएँ — और कब नहीं।\n\nछोटा-सा दोहराव:\n• मींड — एक स्वर से दूसरे स्वर तक एक सहज फिसलन।\n• कण स्वर — मुख्य स्वर से पहले छुआ गया एक बहुत छोटा स्वर।\n• मुरकी — किसी स्वर के चारों ओर घूमता तीन-चार स्वरों का छोटा, तेज़ समूह।\n• हरकत — फ़िल्मी संगीत की दुनिया में छोटे, तेज़ अलंकरणों के लिए आमतौर पर इस्तेमाल होने वाला शब्द।\n\nशास्त्रीय संगीत में अलंकरण राग से बंधे होते हैं। कोई ख़ास मींड एक राग की पहचान का हिस्सा हो सकती है और दूसरे राग में गलत लग सकती है।\n\nबॉलीवुड में अलंकरण गाने के मूड, दौर और अरेंजमेंट के हिसाब से चलते हैं। उप-शास्त्रीय या ग़ज़ल जैसे गाने में मुरकियाँ अक्सर अच्छी लगती हैं; एक सीधे-सादे रोमांटिक पॉप या रॉक जैसे गाने में बहुत ज़्यादा मुरकियाँ उसे भारी और दिखावटी बना सकती हैं।\n\nरुचि (टेस्ट) के सिद्धांत:\n1. पहले गाना बिना अलंकरण के, साफ़ और सुर में गाइए।\n2. मूल रिकॉर्डिंग ध्यान से सुनिए — अलंकरण कहाँ हैं, और कहाँ पंक्ति जानबूझकर सादी रखी गई है?\n3. एक पंक्ति में एक या दो अलंकरण आमतौर पर काफ़ी हैं। अक्सर कम ही ज़्यादा होता है।\n4. हर अलंकरण के शुरू और अंत के स्वर सुर में होने चाहिए; वरना वह बस एक गलत स्वर जैसा लगता है।\n5. बोलों का अर्थ समझिए; अलंकरण भाव को सहारा दे, उससे ध्यान न भटकाए।\n\nरिकॉर्डिंग जर्नल में एक पंक्ति को तीन तरह गाइए — सादी, एक अलंकरण के साथ, और बहुत सारे अलंकरणों के साथ — फिर ईमानदारी से तय कीजिए कि कौन-सा गाने के साथ न्याय करता है।",
      },
      whyItMatters:
        'Ornaments are what make singing sound "Indian" and expressive, but overuse or misplacement is one of the most common signs of an inexperienced singer. Judgement matters as much as technique.',
      traditionNote:
        'Terminology varies: some musicians use "harkat" and "murki" loosely or interchangeably, and classical styles differ greatly in how much ornamentation they favour. Use these definitions as practical working terms.',
      demos: [
        { kind: 'glide', label: 'Meend: P down to G', from: 'P', to: 'G', durationSec: 2 },
        { kind: 'glide', label: 'Meend: S up to R', from: 'S', to: 'R', durationSec: 1.5 },
        { kind: 'sequence', label: 'Murki-like turn around G: m G R G', notes: ['m', 'G', 'R', 'G'], bpm: 200 },
        { kind: 'sequence', label: 'Same landing plain (no murki): m G', notes: ['m', '-', 'G', '-', '-'], bpm: 70 },
      ],
      guidedSteps: [
        'Play the meend demos, then sing each glide slowly against the Tanpura Drone, checking start and end notes in the Pitch Matcher.',
        'Play the murki demo at full speed, then slow it down in the Sargam Player and sing it clearly.',
        'Pick a film song you know well. Listen to the original and note (on paper) where ornaments occur.',
        'Sing one line plain three times until it is fully in tune.',
        'Sing the same line with one ornament only, then with many. Record all three in the Recording Journal.',
        'Listen back after a short break and write which version best serves the lyric.',
      ],
      independentPractice: {
        instructions:
          'Practise the murki turn m G R G slowly then faster (Metronome & Taal tool), 10 rounds. Then apply "plain → one ornament" to two lines of a song you know.',
        durationMin: 12,
        tool: 'sargam',
        pattern: ['m', 'G', 'R', 'G', '-', 'P', 'm', 'G', 'm', '-'],
        bpm: 90,
      },
      mistakes: [
        { mistake: 'Adding murkis to every line of every song.', fix: 'Default to plain. Add an ornament only where it clearly supports the emotion or the original style.' },
        { mistake: 'Sloppy ornaments where the landing note is off pitch.', fix: 'Slow the ornament right down; check the final note in the Pitch Matcher.' },
        { mistake: 'Using raga-style meends in a song whose melody is clearly Western or pop-based.', fix: 'Match the ornament style to the song\'s genre and arrangement.' },
      ],
      quiz: [
        { question: 'What is a meend?', options: ['A quick 4-note cluster', 'A smooth glide between notes', 'A rhythmic cycle', 'A pause'], answerIndex: 1, explanation: 'Meend is a continuous glide connecting notes.' },
        { question: 'What is a sensible first step before ornamenting a song?', options: ['Add as many murkis as possible', 'Sing it plain, clean and in tune', 'Change the key randomly', 'Speed it up'], answerIndex: 1, explanation: 'Ornaments sit on a solid, in-tune melody; without that, they sound like errors.' },
        { question: 'In classical music, ornament choice is strongly guided by...', options: ['The raga', 'The microphone', 'The singer\'s age', 'Nothing in particular'], answerIndex: 0, explanation: 'Each raga has characteristic ornaments and movements.' },
        { question: 'A heavily ornamented line in a simple pop-style film song often sounds...', options: ['Always better', 'Heavy or distracting', 'More in tune', 'Faster'], answerIndex: 1, explanation: 'Restraint usually suits simpler styles; ornaments should serve the song.' },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Ornaments must start and land on accurate notes; match the notes used in the meend and murki demos.',
        targets: ['R', 'G', 'm', 'P'],
        minAttempts: 10,
        minSuccessPct: 70,
        toleranceCents: 30,
      },
      videoQueries: ['murki vs meend vs khatka explained singing', 'how to sing harkat murki bollywood songs', 'when to use ornaments in Indian singing'],
      nextStep: 'Next: expression and stylistic interpretation across eras.',
      estMinutes: 30,
    },
    {
      id: 'l4-expression-bhav-styles',
      level: 4,
      module: 'Ornamentation, Expression and Harmony',
      title: 'Expression, Bhav and Bollywood Styles Across Eras',
      objective:
        'Interpret a song\'s meaning (bhav) through tone, dynamics, timing and diction, and recognise general stylistic traits of different eras of Hindi film music.',
      explanation: {
        hinglish:
          "Sur aur taal sahi hone ke baad sabse badi baat hai — bhav. Ek hi gaana sahi notes ke saath bhi bejaan lag sakta hai, agar gaayak ko shabdon ka matlab mehsoos na ho.\n\nBhav lane ke tools:\n• Arth samajhna — gaane ki kahani kya hai? Kaun gaa raha hai, kisse, kis haalat mein? Mushkil shabdon ka matlab dhoondhiye (khaas kar Urdu shabd ghazal aur purane gaanon mein).\n• Tone colour — halki, saansdar (breathy) awaaz komalta ke liye; bhari, bright awaaz josh ke liye.\n• Dynamics — har line ek hi volume mein nahi. Kuch shabdon par zor, kuch par narmi.\n• Timing — kabhi thoda ruk kar shabd ko jagah dena.\n• Uchcharan (diction) — saaf Hindi/Urdu uchcharan; nukta wale shabdon par dhyan.\n\nEras ke general traits (bahut simplified):\n• Purana daur (1950s–60s): melody-pradhan, kaafi gaane raga-aadharit ya lok sangeet se prerit, saaf uchcharan, orchestra ke saath.\n• 1970s–80s: zyada variety — disco/pop influence, jazzy arrangements, light-hearted aur energetic gaane bhi.\n• 1990s: badi melodious romantic soundtracks, synthesizer-heavy arrangements.\n• 2000s ke baad: Sufi-rock, hip-hop, indie-pop jaise mix; mic ke paas intimate, conversational gaayaki bhi common.\n\nYeh sirf mote taur par trends hain — har daur mein har tarah ka gaana bana. Kisi gaane ko seekhte waqt us original ki style suniye, phir apna sachcha bhav laaiye.",
        english:
          "Once pitch and rhythm are secure, the next big step is bhav — emotional meaning. A song can be note-perfect and still sound lifeless if the singer does not feel the words.\n\nTools of expression:\n• Meaning — what is the story? Who is singing to whom, in what situation? Look up unfamiliar words (especially Urdu words common in ghazals and older film songs).\n• Tone colour — a lighter, slightly breathy tone for tenderness; a fuller, brighter tone for excitement or determination.\n• Dynamics — not every line at the same volume. Lean into some words, soften others.\n• Timing — occasionally giving a word a little extra space (while staying with the accompaniment).\n• Diction — clear Hindi/Urdu pronunciation, including sounds like the nukta in words such as 'zindagi'.\n\nGeneral stylistic tendencies by era (heavily simplified):\n• 1950s–60s: melody-centred; many songs based on ragas or folk forms; clear diction; orchestral accompaniment.\n• 1970s–80s: wider variety — pop, disco and jazz influences alongside melodic songs; more playful, energetic numbers.\n• 1990s: lush melodic romantic soundtracks with synthesizer-heavy arrangements.\n• 2000s onward: blends such as Sufi-rock, hip-hop and indie-pop; intimate, close-mic, conversational singing became common.\n\nThese are broad trends, not rules — every era produced every kind of song. When learning a song, study the style of its original recording, then bring your own honest feeling to it.",
        hindi:
          "जब सुर और लय पक्के हो जाएँ, तो अगला बड़ा कदम है भाव — भावनात्मक अर्थ। एक गाना हर स्वर में सही होकर भी बेजान लग सकता है, अगर गायक शब्दों को महसूस न करे।\n\nअभिव्यक्ति के साधन:\n• अर्थ — कहानी क्या है? कौन किससे, किस हालत में गा रहा है? अनजान शब्दों का अर्थ खोजिए (ख़ासकर ग़ज़लों और पुराने फ़िल्मी गानों में आम उर्दू शब्द)।\n• स्वर का रंग (टोन कलर) — कोमलता के लिए हल्की, थोड़ी साँसदार आवाज़; जोश या दृढ़ता के लिए भरी, चमकदार आवाज़।\n• डायनामिक्स — हर पंक्ति एक ही वॉल्यूम पर नहीं। कुछ शब्दों पर ज़ोर दीजिए, कुछ को नरम कीजिए।\n• टाइमिंग — कभी-कभी किसी शब्द को थोड़ी अतिरिक्त जगह देना (संगत के साथ बने रहते हुए)।\n• उच्चारण — साफ़ हिंदी/उर्दू उच्चारण, जिसमें 'ज़िंदगी' जैसे शब्दों में नुक़्ते वाली ध्वनियाँ भी शामिल हैं।\n\nदौर के अनुसार सामान्य शैलीगत रुझान (बहुत सरल रूप में):\n• 1950–60 का दशक: धुन-प्रधान; कई गाने राग या लोक-संगीत पर आधारित; साफ़ उच्चारण; ऑर्केस्ट्रा की संगत।\n• 1970–80 का दशक: ज़्यादा विविधता — मधुर गानों के साथ पॉप, डिस्को और जैज़ का प्रभाव; ज़्यादा चंचल, ऊर्जावान गाने।\n• 1990 का दशक: भरपूर मधुर रोमांटिक साउंडट्रैक, सिंथेसाइज़र-प्रधान अरेंजमेंट के साथ।\n• 2000 के बाद: सूफ़ी-रॉक, हिप-हॉप और इंडी-पॉप जैसे मिश्रण; माइक के पास से अंतरंग, बातचीत जैसी गायकी आम हुई।\n\nये मोटे रुझान हैं, नियम नहीं — हर दौर में हर तरह के गाने बने। कोई गाना सीखते समय उसकी मूल रिकॉर्डिंग की शैली समझिए, फिर उसमें अपना सच्चा भाव लाइए।",
      },
      whyItMatters:
        'Listeners connect with feeling first. Understanding lyrics and stylistic context turns accurate singing into communication.',
      traditionNote:
        'In Hindustani classical music, rasa and bhav are central concepts discussed in depth in traditional aesthetics. Era descriptions here are broad generalisations meant to guide listening, not historical rules.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone on your Sa' },
        { kind: 'sequence', label: 'Neutral phrase to colour three ways: G m P - m G R S', notes: ['G', 'm', 'P', '-', 'm', 'G', 'R', 'S'], bpm: 60 },
      ],
      guidedSteps: [
        'Choose a song you can already sing in tune. Write a two-sentence summary of its story and emotion.',
        'Look up the meaning of every word you are unsure of.',
        'Sing the demo phrase in akaar three ways: tender, joyful, sad. Record each in the Recording Journal.',
        'Mark on your lyric outline two words to emphasise and one place to soften.',
        'Listen to the original recording and note its era traits: arrangement, tone, ornaments, diction.',
        'Record the song with your planned expression and compare it with an earlier "notes only" take.',
      ],
      independentPractice: {
        instructions:
          'This week, pick songs from two different eras. For each, write the meaning, mark emphasis and breath points, and record one expressive take in the Recording Journal.',
        durationMin: 20,
        tool: 'recorder',
      },
      mistakes: [
        { mistake: 'Over-acting: exaggerated sobs or breathiness on every line.', fix: 'Choose two or three key moments for strong colour; keep the rest natural.' },
        { mistake: 'Singing words you do not understand.', fix: 'Translate every unfamiliar word before recording.' },
        { mistake: 'Copying vocal mannerisms without the feeling behind them.', fix: 'Ask "why" the original singer shaped a line that way, then express that intention in your own voice.' },
      ],
      quiz: [
        { question: 'What does "bhav" refer to in singing?', options: ['The tempo', 'The microphone type', 'The highest note', 'The emotional meaning and feeling expressed'], answerIndex: 3, explanation: 'Bhav is the emotion conveyed through the performance.' },
        { question: 'Which is a useful first step toward expressive singing?', options: ['Understand the meaning of the lyrics and the situation', 'Sing louder throughout', 'Add vibrato on every note', 'Speed up the song'], answerIndex: 0, explanation: 'Meaning guides every other expressive choice.' },
        { question: 'How should the era descriptions in this lesson be used?', options: ['As strict rules', 'As broad tendencies to guide listening', 'To decide which songs are "correct"', 'To avoid older songs'], answerIndex: 1, explanation: 'Every era had many styles; trends are generalisations.' },
      ],
      practical: {
        kind: 'self-check',
        description: 'Expression cannot be measured by the pitch detector. Be honest with yourself.',
        items: [
          'I wrote the meaning and emotional situation of a song I am learning.',
          'I recorded the same phrase in at least two different emotional colours and could hear the difference.',
          'I recorded an expressive take of a song in the Recording Journal and compared it with an earlier take.',
        ],
      },
      videoQueries: ['how to sing with emotion bhav Hindi songs', 'Hindi film music history by decade documentary', 'Urdu pronunciation for singers nukta'],
      nextStep: 'Next: basic harmony — how chords relate to the melodies you sing.',
      estMinutes: 30,
    },
    {
      id: 'l4-harmony-basics',
      level: 4,
      module: 'Ornamentation, Expression and Harmony',
      title: 'Basic Harmony: Intervals, Chords and Singing in Thirds',
      objective:
        'Understand intervals and simple chords, how Bollywood arrangements use harmony while Hindustani music is melodic and drone-based, and sing a simple harmony line a third above a melody.',
      explanation: {
        hinglish:
          "Hindustani classical sangeet mukhya roop se melodic hai — ek samay par ek melody, aur peeche Tanpura ka drone (S aur P, ya kuch ragas mein m ya N). Chords badalte nahi; har note Sa ke saath apna rishta banata hai.\n\nBollywood arrangements alag hain. Wahan guitar, piano, strings chords bajate hain — yaani teen ya zyada notes ek saath. Isse 'harmony' kehte hain.\n\nInterval = do notes ke beech ki doori:\n• S se komal g = minor third (3 semitone)\n• S se G = major third (4 semitone)\n• S se P = perfect fifth (7 semitone)\n• S se S' = octave (12 semitone)\n\nChord: Major chord = S G P (Sa par bana). Minor chord = S g P. Agar Sa = C, toh S G P = C major. R m D = D minor, P N R' = G major — yeh Bilawal (major scale) ke andar ke chords hain.\n\nHarmony line in thirds: melody ke har note se 'do scale steps upar' wala note gaaiye. Bilawal mein: S → G, R → m, G → P, m → D, P → N. Toh agar melody hai S R G R S, toh harmony hogi G m P m G.\n\nYeh mushkil kyun hai? Kyunki doosri awaaz aapko melody ki taraf kheenchti hai. Practice: Virtual Keyboard par melody bajaiye ya Sargam Player mein melody chalaiye, aur aap harmony gaaiye. Pehle bahut dheere.\n\nYaad rahe: classical riyaz mein aap Tanpura ke saath hi gaayenge; harmony ka gyaan Bollywood, choir aur studio work mein kaam aata hai.",
        english:
          "Hindustani classical music is fundamentally melodic: one melodic line at a time, over a tanpura drone (Sa and Pa, or in some ragas Ma or Ni). There are no changing chords; each note is heard in relation to Sa.\n\nBollywood arrangements are different. Guitars, keyboards and strings play chords — three or more notes at once — and the chords change under the melody. This is harmony.\n\nAn interval is the distance between two notes:\n• S to komal g = minor third (3 semitones)\n• S to G = major third (4 semitones)\n• S to P = perfect fifth (7 semitones)\n• S to S' = octave (12 semitones)\n\nChords: a major triad on Sa is S G P; a minor triad is S g P. If Sa = C, S G P is C major. Within Bilawal (the major scale), R m D forms D minor and P N R' forms G major.\n\nSinging a harmony line in thirds: for each melody note, sing the note two scale steps above it. In Bilawal: S → G, R → m, G → P, m → D, P → N. So if the melody is S R G R S, the harmony is G m P m G. Note that these diatonic thirds are a mix of major and minor thirds.\n\nWhy is it hard? The other voice pulls you toward the melody. Practise by playing the melody in the Sargam Player or on the Virtual Keyboard while you sing the harmony — very slowly at first.\n\nYour classical riyaz stays with the tanpura. Harmony awareness helps in film-style songs, duets, choirs and studio backing vocals.",
        hindi:
          "हिंदुस्तानी शास्त्रीय संगीत मूल रूप से मेलोडिक (स्वर-माधुर्य पर आधारित) है: एक समय में एक धुन, तानपुरे के ड्रोन पर (सा और प, या कुछ रागों में म या नि)। इसमें बदलते हुए कॉर्ड नहीं होते; हर स्वर सा के संबंध में सुना जाता है।\n\nबॉलीवुड के अरेंजमेंट अलग हैं। गिटार, कीबोर्ड और स्ट्रिंग्स कॉर्ड बजाते हैं — यानी एक साथ तीन या ज़्यादा स्वर — और धुन के नीचे कॉर्ड बदलते रहते हैं। इसे हार्मनी कहते हैं।\n\nइंटरवल यानी दो स्वरों के बीच की दूरी:\n• S से कोमल g = माइनर थर्ड (3 सेमीटोन)\n• S से G = मेजर थर्ड (4 सेमीटोन)\n• S से P = परफ़ेक्ट फ़िफ़्थ (7 सेमीटोन)\n• S से S' = सप्तक/ऑक्टेव (12 सेमीटोन)\n\nकॉर्ड: सा पर बना मेजर ट्रायड है S G P; माइनर ट्रायड है S g P। अगर सा = C हो, तो S G P, C मेजर है। बिलावल (मेजर स्केल) के भीतर R m D, D माइनर बनाता है और P N R', G मेजर।\n\nथर्ड में हार्मनी लाइन गाना: धुन के हर स्वर के लिए उससे दो स्केल-स्टेप ऊपर वाला स्वर गाइए। बिलावल में: S → G, R → m, G → P, m → D, P → N। तो अगर धुन S R G R S है, तो हार्मनी G m P m G होगी। ध्यान दें कि स्केल के भीतर के ये थर्ड कुछ मेजर और कुछ माइनर होते हैं।\n\nयह कठिन क्यों है? दूसरी आवाज़ आपको धुन की ओर खींचती है। सरगम प्लेयर या वर्चुअल कीबोर्ड पर धुन बजाइए और साथ में हार्मनी गाइए — शुरू में बहुत धीरे।\n\nआपका शास्त्रीय रियाज़ तानपुरे के साथ ही रहेगा। हार्मनी की समझ फ़िल्मी गानों, युगल गीतों, कोरस और स्टूडियो बैकिंग वोकल्स में काम आती है।",
      },
      whyItMatters:
        'Knowing how melody relates to chords helps you choose keys, stay in tune against changing backing tracks, and sing backing or duet harmonies.',
      traditionNote:
        'Hindustani music deliberately does not use functional chord harmony; its richness comes from raga, ornamentation and the drone. Harmony here is a Western concept used widely in film arrangements.',
      demos: [
        { kind: 'compare', label: 'Major third: S and G', a: 'S', b: 'G' },
        { kind: 'compare', label: 'Minor third: S and komal g', a: 'S', b: 'g' },
        { kind: 'compare', label: 'Perfect fifth: S and P', a: 'S', b: 'P' },
        { kind: 'sequence', label: 'Melody: S R G R S', notes: ['S', 'R', 'G', 'R', 'S'], bpm: 60 },
        { kind: 'sequence', label: 'Harmony a third above: G m P m G', notes: ['G', 'm', 'P', 'm', 'G'], bpm: 60 },
      ],
      guidedSteps: [
        'Play the three interval comparisons on the Virtual Keyboard and sing both notes of each.',
        'Play S, G, P one after another on the Virtual Keyboard to hear the major triad; then S, g, P for minor.',
        'Sing the harmony line G m P m G alone until secure, checking notes in the Pitch Matcher.',
        'Loop the melody S R G R S in the Sargam Player and sing the harmony against it.',
        'Swap: sing the melody while the app plays the harmony line.',
        'Record yourself singing harmony against the melody in the Recording Journal and check for drifting into unison.',
      ],
      independentPractice: {
        instructions:
          'Loop the melody S R G m P m G R S in the Sargam Player and sing the third-above line G m P D N D P m G. Five slow rounds, then try in akaar.',
        durationMin: 12,
        tool: 'sargam',
        pattern: ['G', 'm', 'P', 'D', 'N', 'D', 'P', 'm', 'G'],
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Slipping onto the melody notes while singing harmony.', fix: 'Learn the harmony line alone first, practise at a soft volume, and cover one ear lightly to hear yourself.' },
        { mistake: 'Assuming every third is the same size.', fix: 'In the major scale, some thirds are major (4 semitones) and some minor (3); trust the scale notes rather than a fixed distance.' },
        { mistake: 'Trying to add chords to classical riyaz.', fix: 'Keep classical practice with the tanpura drone; use harmony practice as a separate skill.' },
      ],
      quiz: [
        { question: 'How many semitones are in a major third?', options: ['3', '4', '5', '7'], answerIndex: 1, explanation: 'A major third spans 4 semitones, like S to G.' },
        { question: 'Which notes form a major triad on Sa?', options: ['S g P', 'S R G', 'S G P', 'S m D'], answerIndex: 2, explanation: 'Root, major third and perfect fifth: S G P.' },
        { question: 'Hindustani classical music is primarily...', options: ['Chord-based', 'Melodic, over a drone', 'Harmonised in four parts', 'Without a tonic'], answerIndex: 1, explanation: 'A raga unfolds as melody against a constant drone, not changing chords.' },
        { question: 'In Bilawal, singing a third above the melody note R gives...', options: ['G', 'm', 'P', 'S'], answerIndex: 1, explanation: 'Two scale steps above R (R → G → m) is m.' },
      ],
      practical: {
        kind: 'self-check',
        description: 'Holding a harmony against another line is a feel skill the pitch detector cannot assess in context.',
        items: [
          'I can sing the S–G, S–g and S–P intervals after hearing Sa.',
          'I sang the third-above harmony line against the playing melody without slipping into unison for at least three rounds.',
          'I recorded a harmony take in the Recording Journal and reviewed it.',
        ],
      },
      videoQueries: ['how to sing harmony in thirds beginner', 'intervals ear training major third perfect fifth', 'why Indian classical music uses drone not chords'],
      nextStep: 'Next: microphone technique.',
      estMinutes: 30,
    },
    // ───────────────────────── Module 6: Mic, Recording and Accompaniment ─────────────────────────
    {
      id: 'l4-microphone-technique',
      level: 4,
      module: 'Mic, Recording and Accompaniment',
      title: 'Microphone Technique',
      objective:
        'Control mic distance and angle to manage proximity effect, plosives and loud notes, so your voice sounds even and clear on a microphone.',
      explanation: {
        hinglish:
          "Mic ek magnifying glass jaisa hai — aapki awaaz ki har achhi aur buri baat ko bada kar deta hai. Isliye mic par gaana ek alag skill hai.\n\nDistance: zyada tar vocal mics ke liye mooh se lagbhag ek mutthi se ek haath ki chaudai (roughly 5–20 cm) shuru karne ke liye theek hai. Mic aur room ke hisaab se adjust kariye.\n\nProximity effect: directional (cardioid) mic ke bahut paas jaane par bass (neeche ki frequencies) badh jaati hain — awaaz bhari aur garam lagti hai. Isko soft, intimate lines ke liye use kar sakte hain, par zyada paas hone se awaaz 'boomy' ho jaati hai.\n\nPlosives: 'p', 'b', 'ph', 'bh' jaise akshar hawa ka jhonka phenkte hain jo mic mein 'pop' karta hai — jaise 'pyaar', 'bahut', 'phir'. Upay: pop filter, ya mic ko thoda side se (off-axis) rakhiye, mooh ke seedhe saamne nahi.\n\nDynamics on mic: zor se gaate waqt (khaas kar upar ke notes) mic se thoda peeche hatiye; dheemi, narm line par thoda paas aaiye. Isse volume barabar lagta hai. Isse 'mic working' kehte hain.\n\nHandheld mic: mic ko body (handle) se pakdiye, grille (upar ka jaali wala hissa) ko haath se mat dhakiye — isse awaaz kharab aur feedback ka khatra badhta hai. Mic ko speaker (monitor) ki taraf point mat kariye — feedback (cheekh jaisi awaaz) aa sakti hai.\n\nPractice ke liye phone ka mic bhi chalega — Recording Journal mein alag distance par record karke farak suniye.",
        english:
          "A microphone is like a magnifying glass: it enlarges everything good and bad about your sound. Singing on mic is a skill of its own.\n\nDistance: for most vocal mics, somewhere around a fist to a hand-span from the mouth (roughly 5–20 cm) is a reasonable starting point. Adjust for the mic and the room.\n\nProximity effect: with directional (e.g. cardioid) mics, moving very close boosts the low frequencies, making the voice warmer and heavier. It can be used deliberately for soft, intimate lines, but too close sounds boomy and muddy.\n\nPlosives: consonants such as 'p', 'b', 'ph' and 'bh' push a burst of air that 'pops' in the mic — think of words like 'pyaar', 'bahut', 'phir'. Remedies: use a pop filter, or angle the mic slightly off-axis (a little to the side) rather than directly in front of the mouth.\n\nDynamics on mic: back away slightly on loud, high notes and move a little closer on soft lines. This 'mic technique' keeps the overall level more even and protects listeners' ears and the recording from distortion.\n\nHandheld mics: hold the body, not the grille. Cupping the grille changes the tone and increases feedback risk. Do not point the mic at monitor speakers, which can cause a howling feedback loop.\n\nEven a phone mic is fine for practising: record the same line at different distances in the Recording Journal and listen to the differences.",
        hindi:
          "माइक्रोफ़ोन एक आवर्धक लेंस (मैग्निफ़ाइंग ग्लास) जैसा है: यह आपकी आवाज़ की हर अच्छी और बुरी बात को बड़ा कर देता है। माइक पर गाना अपने आप में एक अलग कौशल है।\n\nदूरी: ज़्यादातर वोकल माइक के लिए मुँह से लगभग एक मुट्ठी से एक बित्ते (हाथ के फैलाव) तक की दूरी (मोटे तौर पर 5–20 सेमी) शुरुआत के लिए ठीक है। माइक और कमरे के अनुसार इसे बदलिए।\n\nप्रॉक्सिमिटी इफ़ेक्ट: डायरेक्शनल (जैसे कार्डियोइड) माइक के बहुत पास जाने पर नीचे की फ़्रीक्वेंसी (बेस) बढ़ जाती हैं, जिससे आवाज़ गर्म और भारी लगती है। इसका इस्तेमाल धीमी, अंतरंग पंक्तियों के लिए जानबूझकर किया जा सकता है, पर बहुत पास होने पर आवाज़ गूँजदार और धुंधली (बूमी) हो जाती है।\n\nप्लोसिव: 'प', 'ब', 'फ' और 'भ' जैसे व्यंजन हवा का एक झोंका फेंकते हैं जो माइक में 'पॉप' करता है — जैसे 'प्यार', 'बहुत', 'फिर' शब्दों में। उपाय: पॉप फ़िल्टर लगाइए, या माइक को मुँह के ठीक सामने रखने के बजाय थोड़ा तिरछा (ऑफ़-एक्सिस, ज़रा-सा बगल में) रखिए।\n\nमाइक पर डायनामिक्स: तेज़, ऊँचे स्वरों पर माइक से थोड़ा पीछे हटिए और धीमी पंक्तियों पर थोड़ा पास आइए। यह 'माइक तकनीक' कुल वॉल्यूम को ज़्यादा बराबर रखती है और सुनने वालों के कानों और रिकॉर्डिंग को डिस्टॉर्शन से बचाती है।\n\nहैंडहेल्ड माइक: माइक को उसकी बॉडी (हैंडल) से पकड़िए, ग्रिल (ऊपर का जालीदार हिस्सा) से नहीं। ग्रिल को हथेली से ढकने पर आवाज़ बदल जाती है और फ़ीडबैक का ख़तरा बढ़ता है। माइक को मॉनिटर स्पीकर की ओर मत कीजिए, इससे चीख़ जैसा फ़ीडबैक लूप बन सकता है।\n\nअभ्यास के लिए फ़ोन का माइक भी काफ़ी है: रिकॉर्डिंग जर्नल में एक ही पंक्ति को अलग-अलग दूरी से रिकॉर्ड कीजिए और अंतर सुनिए।",
      },
      whyItMatters:
        'Most performances and recordings today happen on a microphone. Good mic technique makes a voice sound polished and avoids pops, boominess and distortion.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone for mic experiments' },
        { kind: 'sequence', label: 'Soft-to-loud test phrase: S G P S\' P G S', notes: ['S', 'G', 'P', "S'", 'P', 'G', 'S'], bpm: 60 },
      ],
      guidedSteps: [
        'Place your phone or mic at a hand-span distance. Record the test phrase in the Recording Journal.',
        'Record it again very close (about 3 cm) and once far (about 50 cm). Compare bass and clarity.',
        'Record a few words with strong "p" and "b" sounds straight-on, then with the mic angled slightly to the side. Listen for pops.',
        'Sing the soft-to-loud phrase, moving slightly back on S\' and closer on the soft ending.',
        'Choose your best distance and note it in the Recording Journal.',
      ],
      independentPractice: {
        instructions:
          'Record one song verse three times at different distances and with mic movement on loud notes. Write which version sounds most even.',
        durationMin: 15,
        tool: 'recorder',
      },
      mistakes: [
        { mistake: 'Staying glued to the mic during loud high notes, causing distortion.', fix: 'Pull back a few centimetres on loud passages.' },
        { mistake: 'Popping on "p" and "b" sounds.', fix: 'Use a pop filter or angle the mic slightly off-axis.' },
        { mistake: 'Cupping the mic grille.', fix: 'Hold the handle; keep the grille uncovered.' },
      ],
      quiz: [
        { question: 'What is the proximity effect?', options: ['Feedback from speakers', 'A delay in monitoring', 'A bass boost when singing very close to a directional mic', 'Distortion from low battery'], answerIndex: 2, explanation: 'Directional mics emphasise low frequencies as the source gets closer.' },
        { question: 'Which helps reduce plosive pops?', options: ['Singing louder', 'A pop filter or slight off-axis angle', 'Cupping the grille', 'Pointing the mic at the speaker'], answerIndex: 1, explanation: 'Both stop the air burst from hitting the capsule directly.' },
        { question: 'On a loud high note, you should usually...', options: ['Move closer to the mic', 'Cover the mic', 'Turn the gain up', 'Move slightly away from the mic'], answerIndex: 3, explanation: 'Backing off keeps the level even and avoids distortion.' },
      ],
      practical: {
        kind: 'self-check',
        description: 'Mic technique is judged by listening to your recordings.',
        items: [
          'I recorded the same phrase at three distances and could hear the proximity effect.',
          'I reduced plosive pops by using a pop filter or angling the mic.',
          'I recorded a take using mic movement on loud and soft passages and reviewed it in the Recording Journal.',
        ],
      },
      videoQueries: ['microphone technique for singers proximity effect', 'how to avoid plosives when singing pop filter', 'handheld mic technique live vocals'],
      nextStep: 'Next: recording technique at home.',
      estMinutes: 25,
    },
    {
      id: 'l4-recording-technique',
      level: 4,
      module: 'Mic, Recording and Accompaniment',
      title: 'Recording Technique at Home',
      objective:
        'Set up a simple home recording: a suitable room, headphones, safe input levels without clipping, comfortable monitoring and multiple takes.',
      explanation: {
        hinglish:
          "Ghar par achhi recording ke liye mehenga studio zaroori nahi. Kuch simple baatein bahut farak laati hain.\n\nRoom: khaali, pakke deewaron wala kamra goonjta hai (echo). Pardon, gaddon, kapdon se bhari almari wala kamra better hai. Kai log almari ke saamne khade hokar record karte hain. Pankha, AC, fridge ki awaaz band kariye.\n\nHeadphones: backing track speaker par chalaoge toh woh bhi mic mein aa jaayega (bleed). Closed-back headphones use kariye.\n\nGain staging: mic ka input level (gain) aisa rakhiye ki sabse zor wale part mein bhi meter laal (0 dBFS) tak na pahunche. Clipping hone par awaaz phat jaati hai aur baad mein theek nahi hoti. Ek aam suggestion: normal gaane par peaks lagbhag -18 se -12 dBFS ke aas-paas, aur sabse loud part -6 dBFS ke neeche. Pehle sabse loud line gaakar level set kariye.\n\nMonitoring: headphone mein apni awaaz aur track ka balance aisa ho ki aap apne aap ko saaf sun sakein. Agar apni awaaz delay se sunai de (latency), toh app/interface ki 'direct monitoring' ya kam buffer setting dekhiye.\n\nTakes: ek perfect take ki ummeed mat rakhiye. 3–5 takes record kariye, beech mein paani piyiye. Har take ka naam ya note likhiye. Baad mein fresh kaan se suniye.\n\nRecording Journal practice ke liye hai — har hafte ek recording save kariye, mahino baad apni progress khud sunenge.",
        english:
          "Good home recordings don't need an expensive studio. A few basics make a big difference.\n\nRoom: an empty room with hard walls echoes. A room with curtains, a bed, cushions or a wardrobe full of clothes sounds drier and better. Many home singers record facing an open wardrobe. Turn off fans, AC and other noise sources where possible.\n\nHeadphones: if the backing track plays through speakers, the mic records it too (bleed). Use closed-back headphones while recording.\n\nGain staging: set the mic input level (gain) so that even your loudest phrase never reaches the top of the meter (0 dBFS). Clipping causes harsh distortion that cannot be fixed afterwards. A common guideline is normal singing peaking somewhere around -18 to -12 dBFS, with the loudest moments staying below about -6 dBFS. Set the level while singing your loudest line, not your softest.\n\nMonitoring: balance your voice and the track in your headphones so you can hear yourself clearly; poor monitoring often causes pitch problems. If you hear your voice delayed (latency), look for 'direct monitoring' on your interface or a lower buffer setting in your software.\n\nTakes: don't expect one perfect take. Record 3–5 takes, sip water between them, label each with a quick note, and listen later with fresh ears.\n\nUse the Recording Journal to save one representative take each week. Months later, comparing them is one of the most motivating and honest progress checks you can do.",
        hindi:
          "घर पर अच्छी रिकॉर्डिंग के लिए महँगे स्टूडियो की ज़रूरत नहीं। कुछ बुनियादी बातें बड़ा फ़र्क़ लाती हैं।\n\nकमरा: सख़्त दीवारों वाला ख़ाली कमरा गूँजता है। पर्दों, बिस्तर, गद्दियों या कपड़ों से भरी अलमारी वाला कमरा ज़्यादा सूखा (कम गूँज वाला) और बेहतर सुनाई देता है। घर पर गाने वाले कई लोग खुली अलमारी के सामने खड़े होकर रिकॉर्ड करते हैं। जहाँ संभव हो, पंखा, AC और शोर के दूसरे स्रोत बंद कीजिए।\n\nहेडफ़ोन: अगर बैकिंग ट्रैक स्पीकर पर बजेगा, तो माइक उसे भी रिकॉर्ड कर लेगा (ब्लीड)। रिकॉर्डिंग के समय क्लोज़्ड-बैक हेडफ़ोन इस्तेमाल कीजिए।\n\nगेन स्टेजिंग: माइक का इनपुट लेवल (गेन) ऐसा रखिए कि आपका सबसे तेज़ वाक्यांश भी मीटर के शीर्ष (0 dBFS) तक न पहुँचे। क्लिपिंग से कर्कश डिस्टॉर्शन होता है जिसे बाद में ठीक नहीं किया जा सकता। एक आम दिशानिर्देश है कि सामान्य गायन के पीक लगभग -18 से -12 dBFS के आसपास रहें, और सबसे तेज़ हिस्से लगभग -6 dBFS से नीचे। लेवल अपनी सबसे तेज़ पंक्ति गाते हुए सेट कीजिए, सबसे धीमी नहीं।\n\nमॉनिटरिंग: हेडफ़ोन में अपनी आवाज़ और ट्रैक का संतुलन ऐसा रखिए कि आप ख़ुद को साफ़ सुन सकें; ख़राब मॉनिटरिंग से अक्सर सुर की समस्याएँ होती हैं। अगर आपकी आवाज़ देर से सुनाई दे (लेटेंसी), तो अपने इंटरफ़ेस पर 'डायरेक्ट मॉनिटरिंग' या सॉफ़्टवेयर में कम बफ़र सेटिंग देखिए।\n\nटेक: एक ही परफ़ेक्ट टेक की उम्मीद मत रखिए। 3–5 टेक रिकॉर्ड कीजिए, बीच में पानी के घूँट लीजिए, हर टेक पर छोटा-सा नोट लिखिए, और बाद में ताज़ा कानों से सुनिए।\n\nरिकॉर्डिंग जर्नल में हर हफ़्ते एक प्रतिनिधि टेक सेव कीजिए। महीनों बाद इनकी तुलना करना प्रगति को परखने का सबसे प्रेरक और ईमानदार तरीका है।",
      },
      whyItMatters:
        'Recordings are your mirror for improvement and your way to share singing. Clean, unclipped recordings let you judge your voice accurately.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone to sing a level-check phrase' },
        { kind: 'sequence', label: 'Level-check phrase (loudest part at the top): S G P S\'', notes: ['S', 'G', 'P', "S'", '-', "S'", 'P', 'G', 'S'], bpm: 60 },
      ],
      guidedSteps: [
        'Choose the quietest, softest-furnished spot available and switch off noisy appliances if you can.',
        'Put on headphones for any backing track or Tanpura Drone.',
        'Sing your loudest line and adjust the input level so it stays clearly below the maximum.',
        'Record three takes of a short phrase or verse in the Recording Journal with a short rest between them.',
        'Listen back the next day. Note the best take and one thing to improve.',
      ],
      independentPractice: {
        instructions:
          'Make one "weekly record" in the Recording Journal: same warm-up phrase plus one song verse, recorded with the same setup each week so comparisons are fair.',
        durationMin: 20,
        tool: 'recorder',
      },
      mistakes: [
        { mistake: 'Setting the level on a soft line, then clipping on the chorus.', fix: 'Always set gain while singing the loudest part.' },
        { mistake: 'Playing the backing track through speakers while recording.', fix: 'Use closed-back headphones to avoid bleed.' },
        { mistake: 'Judging a take immediately after singing it.', fix: 'Listen again later with fresh ears, ideally the next day.' },
      ],
      quiz: [
        { question: 'What is clipping?', options: ['Distortion when the signal exceeds the maximum level', 'A pleasant echo', 'A type of microphone', 'A singing ornament'], answerIndex: 0, explanation: 'Clipping happens when the signal hits 0 dBFS; it is harsh and usually unfixable.' },
        { question: 'Why use headphones while recording with a backing track?', options: ['To look professional', 'To stop the track bleeding into the vocal mic', 'To sing louder', 'To increase latency'], answerIndex: 1, explanation: 'Headphones keep the backing track off your vocal recording.' },
        { question: 'Which room usually sounds better for home vocals?', options: ['An empty tiled bathroom', 'A large empty hall', 'A kitchen with the fridge running', 'A room with soft furnishings like curtains and clothes'], answerIndex: 3, explanation: 'Soft materials absorb reflections and reduce echo.' },
      ],
      practical: {
        kind: 'self-check',
        description: 'Recording quality is assessed by listening, not by pitch detection.',
        items: [
          'I set my recording level while singing my loudest line and the take did not clip.',
          'I recorded with headphones and there was no audible backing-track bleed.',
          'I recorded at least three takes and chose the best one after listening later.',
        ],
      },
      videoQueries: ['how to record vocals at home beginner', 'gain staging vocals avoid clipping', 'home vocal booth wardrobe recording tips'],
      nextStep: 'Next: singing with karaoke and accompaniment in the right key.',
      estMinutes: 25,
    },
    {
      id: 'l4-karaoke-accompaniment',
      level: 4,
      module: 'Mic, Recording and Accompaniment',
      title: 'Singing with Karaoke and Accompaniment',
      objective:
        'Find a song\'s Sa, choose or transpose a legitimate karaoke track to a key that suits your range, and sing in sync with the accompaniment.',
      explanation: {
        hinglish:
          "Karaoke ke saath gaana bahut mazedaar hai, par sahi key chunna zaroori hai. Original key aapke liye bahut upar ya neeche ho sakti hai — aur galat key mein gaana gale par zor daalta hai.\n\nStep 1 — song ka Sa dhoondhiye: original gaana sunte hue Virtual Keyboard par woh note dhoondhiye jo 'ghar' jaisa lagta hai, jahan gaana aakar rukta hai. Woh aksar song ka Sa hota hai.\n\nStep 2 — song ki range dekhiye: sabse neecha aur sabse ooncha note kaunsa hai? Kya aap dono aaram se gaa sakte hain?\n\nStep 3 — transpose: agar upar ke notes mushkil hain, toh key ko 1–3 semitone neeche kariye. Bahut se karaoke apps aur players mein 'key' ya 'pitch' control hota hai. Har semitone ek note ka farak hai. Do ya teen se zyada badalne par track kabhi-kabhi ajeeb sunai de sakta hai.\n\nLegitimate tracks: sirf licensed karaoke apps, official karaoke releases, ya woh tracks use kariye jo legally available hain. YouTube se audio rip karna aksar platform ki terms aur copyright ke khilaaf hota hai — mat kariye. Lyrics bhi legitimate source se dekhiye.\n\nSync: intro ke beats giniye, pehli line kab shuru hoti hai yeh pakka kariye. Accompaniment ke saath ek baar sirf sun kar 'mann mein' gaaiye, phir gaaiye.\n\nLive accompaniment (harmonium, guitar) ke saath: musician ko apna Sa ya key batayiye, jaise 'mera Sa C# hai' ya 'song A mein chahiye'.",
        english:
          "Singing with karaoke is great practice, but choosing the right key is essential. The original key may be too high or low for you, and singing in the wrong key strains the voice.\n\nStep 1 — find the song's Sa: while listening to the original, find on the Virtual Keyboard the note that feels like 'home', where phrases come to rest. That is usually the song's Sa (tonic).\n\nStep 2 — check the range: what are the lowest and highest notes? Can you sing both comfortably, not just reach them?\n\nStep 3 — transpose: if the high notes are a struggle, lower the key by 1–3 semitones. Many karaoke apps and players have a 'key' or 'pitch' control; each step is one semitone. Large shifts can make some tracks sound artificial.\n\nUse legitimate tracks only: licensed karaoke apps, official karaoke releases, or tracks you are permitted to use. Ripping audio from YouTube usually violates the platform's terms and copyright — don't do it. Read lyrics from legitimate sources too.\n\nSync: count the intro beats and know exactly when the first line starts. Listen once while singing silently in your head, then sing aloud.\n\nWith live accompaniment (harmonium, keyboard, guitar), tell the musician your key clearly — for example, 'my Sa is C#' or 'I'd like this song in A'.",
        hindi:
          "कराओके के साथ गाना बढ़िया अभ्यास है, पर सही की (स्केल) चुनना ज़रूरी है। मूल की आपके लिए बहुत ऊँची या नीची हो सकती है, और गलत की में गाने से आवाज़ पर ज़ोर पड़ता है।\n\nचरण 1 — गाने का सा खोजिए: मूल गाना सुनते हुए वर्चुअल कीबोर्ड पर वह स्वर खोजिए जो 'घर' जैसा लगे, जहाँ वाक्यांश आकर ठहरते हैं। वही आमतौर पर गाने का सा (टॉनिक) होता है।\n\nचरण 2 — रेंज देखिए: सबसे नीचा और सबसे ऊँचा स्वर कौन-सा है? क्या आप दोनों को आराम से गा सकते हैं, सिर्फ़ छू ही नहीं लेते?\n\nचरण 3 — ट्रांसपोज़ कीजिए: अगर ऊँचे स्वर मुश्किल लगें, तो की को 1–3 सेमीटोन नीचे कीजिए। कई कराओके ऐप और प्लेयर में 'की' या 'पिच' कंट्रोल होता है; हर कदम एक सेमीटोन का होता है। बहुत ज़्यादा बदलाव से कुछ ट्रैक बनावटी सुनाई दे सकते हैं।\n\nकेवल वैध ट्रैक इस्तेमाल कीजिए: लाइसेंस वाले कराओके ऐप, आधिकारिक कराओके रिलीज़, या वे ट्रैक जिन्हें इस्तेमाल करने की आपको अनुमति है। YouTube से ऑडियो निकालना (रिप करना) आमतौर पर प्लेटफ़ॉर्म की शर्तों और कॉपीराइट का उल्लंघन है — ऐसा मत कीजिए। बोल भी वैध स्रोतों से पढ़िए।\n\nतालमेल: इंट्रो की बीट गिनिए और ठीक-ठीक जानिए कि पहली पंक्ति कब शुरू होती है। एक बार मन ही मन गाते हुए सुनिए, फिर ज़ोर से गाइए।\n\nलाइव संगत (हारमोनियम, कीबोर्ड, गिटार) के साथ, संगतकार को अपनी की साफ़ बताइए — जैसे, 'मेरा सा C# है' या 'मुझे यह गाना A में चाहिए'।",
      },
      whyItMatters:
        'Singing in a key that suits your voice is the single easiest way to sound better and avoid strain. Working with accompaniment is how songs are actually performed.',
      demos: [
        { kind: 'compare', label: 'One semitone apart: S vs komal r', a: 'S', b: 'r' },
        { kind: 'compare', label: 'Two semitones apart: S vs R', a: 'S', b: 'R' },
        { kind: 'taal', label: 'Keharwa groove (common in film songs)', taal: 'keharwa', bpm: 90, cycles: 2 },
      ],
      guidedSteps: [
        'Choose a song you know. Listen to the original and find its Sa on the Virtual Keyboard.',
        'Find the song\'s lowest and highest notes on the keyboard and test them gently with your voice.',
        'Open a legitimate karaoke track for the song and adjust the key if the top notes feel strained.',
        'Count the intro along with the Metronome & Taal tool or by tapping, and mark the entry point.',
        'Sing through once with headphones and record in the Recording Journal.',
        'Listen back: was the key comfortable? Were entries on time? Adjust and try again.',
      ],
      independentPractice: {
        instructions:
          'Pick two songs, find each song\'s Sa and range, and choose a comfortable key for each using a legitimate karaoke track. Record one verse of each.',
        durationMin: 20,
        tool: 'keyboard',
      },
      mistakes: [
        { mistake: 'Always singing in the original key even when it strains.', fix: 'Transpose 1–3 semitones toward comfort; the song will still sound like itself.' },
        { mistake: 'Using ripped audio from video sites.', fix: 'Use licensed karaoke apps or official karaoke releases.' },
        { mistake: 'Entering late after the intro.', fix: 'Count the intro bars and practise entries separately.' },
      ],
      quiz: [
        { question: 'How do you usually identify a song\'s Sa?', options: ['The highest note', 'The note that feels like "home" where phrases rest', 'The first note of the intro always', 'The loudest note'], answerIndex: 1, explanation: 'The tonic is the resting point that phrases resolve to.' },
        { question: 'Lowering a karaoke track by 2 semitones means...', options: ['Every note is two semitones lower', 'Only the chorus changes', 'The tempo halves', 'The lyrics change'], answerIndex: 0, explanation: 'Transposition shifts all pitches by the same amount.' },
        { question: 'Which karaoke source is appropriate?', options: ['Audio ripped from a video site', 'A licensed karaoke app or official karaoke release', 'Any file shared in a group chat', 'Recording the film from a cinema'], answerIndex: 1, explanation: 'Respect copyright by using legitimate, licensed tracks.' },
      ],
      practical: {
        kind: 'self-check',
        description: 'Key choice and sync are judged by your comfort and recordings.',
        items: [
          'I found the Sa of a song I want to sing using the Virtual Keyboard.',
          'I chose a key where the highest note felt comfortable, not just reachable.',
          'I recorded a verse with a legitimate karaoke track and entered on time.',
        ],
      },
      videoQueries: ['how to find the key of a song by ear', 'how to choose the right key for your voice singing', 'karaoke transpose key change tips for singers'],
      nextStep: 'Next: building stage confidence.',
      estMinutes: 30,
      safetyNote: 'If a song only works for you by pushing or shouting the top notes, lower the key. A comfortable key is good technique, not a compromise.',
    },
    // ───────────────────────── Module 7: Performance ─────────────────────────
    {
      id: 'l4-stage-confidence',
      level: 4,
      module: 'Performance',
      title: 'Stage Confidence and Performance Anxiety',
      objective:
        'Understand performance anxiety as a normal response and use preparation, breathing and gradual exposure to sing confidently for others.',
      explanation: {
        hinglish:
          "Logon ke saamne gaane se pehle dil tez dhadakna, haath kaanpna, gala sookhna — yeh bilkul normal hai. Bahut se experienced performers bhi aisa mehsoos karte hain. Yeh sharir ka 'alert' mode hai; isse poori tarah khatam karna zaroori nahi, bas sambhaalna seekhna hai.\n\nConfidence ke teen pillar:\n1. Taiyaari — jo gaana aap neend mein bhi gaa sakte hain, uspe ghabraahat kam hoti hai. Gaana itna practise kariye ki pehli line, mushkil part aur ending automatic ho jaayein.\n2. Saans — gaane se pehle dheemi saans: 4 count andar, thoda ruk kar, 6 count bahar. Lambi bahar wali saans sharir ko shaant karti hai.\n3. Dheere-dheere exposure — pehle ek dost ya parivaar ke ek sadasya ke saamne. Phir 3–4 logon ke saamne. Phir ek chhoti mehfil ya online live. Har baar thoda bada.\n\nUpyogi baatein:\n• Galti hogi — chalte rahiye. Zyaadatar sunne wale chhoti galti notice bhi nahi karte.\n• Dhyan apne aap se hata kar gaane ke arth aur sunne walon par rakhiye.\n• Pehle 'mock performance' kariye — khade hokar, phone record karte hue, bina rukke poora gaana.\n• Paani paas rakhiye, gala sookha lage toh ek ghoont.\n\nAgar anxiety itni zyada hai ki rozmarra ki zindagi par asar padta hai, toh kisi qualified professional se baat karna samajhdaari hai.",
        english:
          "A racing heart, shaky hands and a dry mouth before singing for others are completely normal. Many experienced performers feel them too. It is the body's alert response; the goal is not to eliminate it but to manage it.\n\nThree pillars of confidence:\n1. Preparation — songs you know deeply cause less fear. Practise until the first line, the hardest passage and the ending are automatic.\n2. Breathing — before singing, breathe slowly: in for 4 counts, a brief pause, out for 6. Longer exhales tend to calm the body.\n3. Gradual exposure — first sing for one friend or family member, then three or four people, then a small gathering or an online live session. Make each step a little bigger.\n\nHelpful habits:\n• Mistakes will happen — keep going. Most listeners won't notice small slips.\n• Shift attention from yourself to the song's meaning and to the listeners.\n• Do 'mock performances': stand up, start recording on your phone, and sing the whole song without stopping.\n• Keep water nearby and take a sip if your mouth feels dry.\n\nIf anxiety is severe enough to affect daily life, speaking with a qualified professional is a sensible step.",
        hindi:
          "दूसरों के सामने गाने से पहले तेज़ धड़कन, काँपते हाथ और सूखा मुँह — ये बिल्कुल सामान्य हैं। कई अनुभवी कलाकार भी ऐसा महसूस करते हैं। यह शरीर की सतर्कता वाली प्रतिक्रिया है; लक्ष्य इसे पूरी तरह ख़त्म करना नहीं, बल्कि संभालना है।\n\nआत्मविश्वास के तीन स्तंभ:\n1. तैयारी — जो गाने आप गहराई से जानते हैं, उनमें डर कम लगता है। तब तक अभ्यास कीजिए जब तक पहली पंक्ति, सबसे कठिन हिस्सा और अंत अपने आप न निकलने लगें।\n2. साँस — गाने से पहले धीरे-धीरे साँस लीजिए: 4 गिनती तक अंदर, थोड़ा ठहराव, 6 गिनती तक बाहर। लंबी बाहर वाली साँस आमतौर पर शरीर को शांत करती है।\n3. धीरे-धीरे सामना — पहले किसी एक दोस्त या परिवार के सदस्य के लिए गाइए, फिर तीन-चार लोगों के लिए, फिर किसी छोटी महफ़िल या ऑनलाइन लाइव सत्र में। हर कदम थोड़ा बड़ा रखिए।\n\nउपयोगी आदतें:\n• गलतियाँ होंगी — चलते रहिए। ज़्यादातर श्रोता छोटी चूक पर ध्यान भी नहीं देते।\n• ध्यान अपने आप से हटाकर गाने के अर्थ और श्रोताओं पर लगाइए।\n• 'मॉक परफ़ॉर्मेंस' कीजिए: खड़े होइए, फ़ोन पर रिकॉर्डिंग शुरू कीजिए, और बिना रुके पूरा गाना गाइए।\n• पास में पानी रखिए और मुँह सूखा लगे तो एक घूँट लीजिए।\n\nअगर घबराहट इतनी ज़्यादा है कि रोज़मर्रा की ज़िंदगी पर असर डालती है, तो किसी योग्य विशेषज्ञ से बात करना समझदारी भरा कदम है।",
      },
      whyItMatters:
        'Many capable singers never share their voice because of fear. Managing nerves lets your practice reach real listeners.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone for calm pre-performance breathing and humming' },
        { kind: 'note', label: 'Grounding hum on Sa', swara: 'S', durationSec: 6 },
      ],
      guidedSteps: [
        'Do the 4-in, 6-out breathing for one minute with the Tanpura Drone playing.',
        'Hum gently on Sa for six seconds, three times.',
        'Stand up and do a mock performance: start a recording in the Recording Journal and sing a full song without stopping.',
        'Note one thing that went well and one to improve — not ten.',
        'Plan your first small-audience performance (one or two people) within the next two weeks.',
      ],
      independentPractice: {
        instructions:
          'Do two mock performances this week (standing, recorded, no restarts), then sing one song for one trusted person. Write how you felt before, during and after.',
        durationMin: 20,
        tool: 'recorder',
      },
      mistakes: [
        { mistake: 'Stopping and restarting after a small mistake.', fix: 'In mock performances, never stop. Practise recovering mid-song.' },
        { mistake: 'Making your first performance a large audience.', fix: 'Build up gradually from one listener to more.' },
        { mistake: 'Treating nerves as proof you are not ready.', fix: 'Nerves are normal; judge readiness by preparation, not by the absence of fear.' },
      ],
      quiz: [
        { question: 'Performance nerves are...', options: ['A sign you should quit', 'Only felt by beginners', 'A normal response that can be managed', 'Always harmful'], answerIndex: 2, explanation: 'Even professionals feel nerves; management is the skill.' },
        { question: 'Which breathing pattern is suggested to calm down?', options: ['Fast shallow breaths', 'In for 4, out for 6', 'Holding the breath for 30 seconds', 'Breathing only through the mouth quickly'], answerIndex: 1, explanation: 'Slow breathing with a longer exhale tends to calm the body.' },
        { question: 'What is a "mock performance"?', options: ['A full, recorded run-through without stopping, as if for an audience', 'Singing badly on purpose', 'Mocking other singers', 'Lip-syncing'], answerIndex: 0, explanation: 'It rehearses the conditions of a real performance.' },
      ],
      practical: {
        kind: 'self-check',
        description: 'Confidence is personal and self-reported.',
        items: [
          'I did at least two recorded mock performances without stopping.',
          'I sang a full song for at least one other person.',
          'I wrote down one positive and one improvement point after performing.',
        ],
      },
      videoQueries: ['how to overcome stage fright singing', 'performance anxiety breathing techniques musicians', 'tips for first singing performance'],
      nextStep: 'Next: preparing a performance from song choice to recovery.',
      estMinutes: 25,
    },
    {
      id: 'l4-performance-preparation',
      level: 4,
      module: 'Performance',
      title: 'Performance Preparation: From Song Choice to Recovery',
      objective:
        'Plan a performance: choose suitable songs, follow a rehearsal timeline, warm up properly on the day, and rest the voice afterwards.',
      explanation: {
        hinglish:
          "Achha performance stage par nahi, hafton pehle shuru hota hai.\n\nSong selection:\n• Aisa gaana chuniye jo aapki range mein aaraam se baithta ho — sabse mushkil gaana nahi, sabse 'aapka' gaana.\n• Mood aur audience ka dhyan rakhiye — shaadi, college fest, ghar ki mehfil, sab alag hain.\n• Ek se zyada gaane hon toh order sochiye: shuruaat ek confident gaane se, beech mein variety, ant achha.\n\nRehearsal plan (example, 3–4 hafte):\n• Hafta 1: notes, lyrics, key final. Breath points mark kariye.\n• Hafta 2: mushkil parts ko alag se practise. Track ke saath sync.\n• Hafta 3: poore run-throughs, khade hokar, record karke. Mock performance.\n• Aakhri din: halki practice, zyada nahi. Achhi neend.\n\nPerformance ke din:\n• Halka khaana, paani pehle se piyiye (sirf us waqt nahi).\n• 15–20 minute warm-up: humming, lip trills, sirens, gaane ke chhote hisse — poora gaana baar-baar nahi.\n• Sound check mein mic distance aur monitor level check kariye.\n\nRecovery: performance ke baad zor se baat karna ya chillaana kam kariye, paani piyiye, gale ko aaram dijiye. Agar hoarseness kuch dinon (lagbhag do hafte) se zyada rahe, toh doctor (ENT) se milna chahiye.",
        english:
          "A good performance starts weeks before the stage.\n\nSong selection:\n• Choose songs that sit comfortably in your range — not the hardest song you know, but the one that is most 'yours'.\n• Consider the occasion and audience: a wedding, a college fest and a living-room gathering differ.\n• For a set, plan the order: open with a confident song, add variety in the middle, finish strongly.\n\nRehearsal plan (example, 3–4 weeks):\n• Week 1: notes, lyrics, key confirmed; breath points marked.\n• Week 2: drill the difficult passages separately; sync with the track.\n• Week 3: full run-throughs standing, recorded; mock performances.\n• Day before: light practice only, and good sleep.\n\nOn the day:\n• Eat lightly and hydrate in the days and hours before, not just at the last minute.\n• Warm up for 15–20 minutes: humming, lip trills, sirens, and short sections of your songs — not full songs over and over.\n• At sound check, confirm your mic distance and that you can hear yourself in the monitors.\n\nRecovery: afterwards, avoid shouting or long loud conversations, drink water and let your voice rest. If hoarseness lasts more than about two weeks, consult a doctor (ENT specialist).",
        hindi:
          "एक अच्छी प्रस्तुति मंच से हफ़्तों पहले शुरू होती है।\n\nगाने का चुनाव:\n• ऐसे गाने चुनिए जो आपकी रेंज में आराम से बैठें — आपका सबसे कठिन गाना नहीं, बल्कि वह जो सबसे ज़्यादा 'आपका' हो।\n• मौके और श्रोताओं का ध्यान रखिए: शादी, कॉलेज फ़ेस्ट और घर की महफ़िल, सब अलग होते हैं।\n• एक से ज़्यादा गानों के लिए क्रम सोचिए: शुरुआत एक आत्मविश्वास भरे गाने से, बीच में विविधता, और अंत दमदार।\n\nरिहर्सल योजना (उदाहरण, 3–4 हफ़्ते):\n• हफ़्ता 1: स्वर, बोल और की तय; साँस की जगहें चिह्नित।\n• हफ़्ता 2: कठिन हिस्सों का अलग से अभ्यास; ट्रैक के साथ तालमेल।\n• हफ़्ता 3: खड़े होकर पूरे रन-थ्रू, रिकॉर्ड करते हुए; मॉक परफ़ॉर्मेंस।\n• एक दिन पहले: केवल हल्का अभ्यास, और अच्छी नींद।\n\nप्रस्तुति के दिन:\n• हल्का खाइए और पिछले दिनों और घंटों में पानी पीते रहिए, सिर्फ़ आख़िरी समय पर नहीं।\n• 15–20 मिनट वॉर्म-अप कीजिए: हमिंग, लिप ट्रिल, साइरन, और अपने गानों के छोटे हिस्से — पूरे गाने बार-बार नहीं।\n• साउंड चेक में अपनी माइक दूरी पक्की कीजिए और देखिए कि मॉनिटर में आप ख़ुद को सुन पा रहे हैं।\n\nरिकवरी: बाद में चिल्लाने या देर तक ज़ोर से बात करने से बचिए, पानी पीजिए और आवाज़ को आराम दीजिए। अगर आवाज़ का बैठना (होर्सनेस) लगभग दो हफ़्ते से ज़्यादा रहे, तो डॉक्टर (ENT विशेषज्ञ) से सलाह लीजिए।",
      },
      whyItMatters:
        'Structured preparation turns performance from a gamble into a repeatable process and protects your voice before and after.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone for warm-up' },
        { kind: 'glide', label: 'Warm-up siren: S up to P', from: 'S', to: 'P', durationSec: 3 },
        { kind: 'sequence', label: 'Warm-up scale: S R G m P m G R S', notes: ['S', 'R', 'G', 'm', 'P', 'm', 'G', 'R', 'S'], bpm: 80 },
      ],
      guidedSteps: [
        'Shortlist three songs and check each one\'s range on the Virtual Keyboard.',
        'Pick one song and write a three-week rehearsal calendar in the Recording Journal notes.',
        'Design your personal 15-minute warm-up using the Tanpura Drone and Sargam Player.',
        'Do a full dress rehearsal: warm-up, then the song standing with your chosen accompaniment, recorded.',
        'Write a short recovery plan: water, rest, quiet voice the next day.',
      ],
      independentPractice: {
        instructions:
          'Follow your rehearsal calendar for one song. Every day: warm-up, focused work on one difficult passage, then one full run-through.',
        durationMin: 25,
        tool: 'recorder',
      },
      mistakes: [
        { mistake: 'Choosing a song mainly to impress, beyond your current comfortable range.', fix: 'Choose songs you can sing well on an average day, not only on your best day.' },
        { mistake: 'Singing the full set many times on performance day and tiring the voice.', fix: 'Warm up with exercises and short sections; save energy for the performance.' },
        { mistake: 'Shouting and talking loudly at the after-party.', fix: 'Plan vocal rest after performing.' },
      ],
      quiz: [
        { question: 'What is a good criterion for choosing a performance song?', options: ['The hardest song you know', 'A song that sits comfortably in your range and suits the occasion', 'Whatever is trending, regardless of range', 'The longest song possible'], answerIndex: 1, explanation: 'Comfort and fit lead to confident, healthy performances.' },
        { question: 'What should the day-before practice look like?', options: ['A marathon session', 'No warm-up ever', 'Learning a new song', 'Light practice and good sleep'], answerIndex: 3, explanation: 'Freshness matters more than last-minute cramming.' },
        { question: 'Hoarseness lasting more than about two weeks should be...', options: ['Ignored', 'Treated by singing more', 'Checked by a doctor (ENT)', 'Fixed by whispering all day'], answerIndex: 2, explanation: 'Persistent hoarseness needs medical evaluation.' },
      ],
      practical: {
        kind: 'self-check',
        description: 'Preparation is self-reported; be honest.',
        items: [
          'I chose a performance song that is comfortable in my range.',
          'I wrote and followed a rehearsal plan for at least two weeks.',
          'I did a full recorded dress rehearsal including my warm-up.',
        ],
      },
      videoQueries: ['how to prepare for a singing performance', 'vocal warm up before performance 15 minutes', 'vocal rest after performance tips'],
      nextStep: 'Next: developing your own singing style.',
      estMinutes: 25,
      safetyNote: 'Do not perform through pain or sudden voice loss. Cancelling one performance is better than injuring your voice.',
    },
    // ───────────────────────── Module 8: Your Lifelong Path ─────────────────────────
    {
      id: 'l4-personal-singing-style',
      level: 4,
      module: 'Your Lifelong Path',
      title: 'Building Your Individual Singing Style',
      objective:
        'Move from imitation to interpretation: learn respectfully from original recordings while developing choices that reflect your own voice.',
      explanation: {
        hinglish:
          "Har bada gaayak shuruaat mein kisi aur ki nakal se seekhta hai — yeh galat nahi, yeh seekhne ka natural tareeka hai. Par imitation (nakal) aur interpretation (apni samajh) mein farak hai.\n\nImitation: original ke har note, har murki, har saans ko copy karna. Yeh shuru mein kaafi kuch sikhaata hai — phrasing, diction, ornaments.\n\nInterpretation: gaane ki aatma ko samajh kar, apni awaaz ke hisaab se choices lena. Jaise ek line thodi narm gaana, ek jagah ornament hata dena, ya key apni awaaz ke hisaab se rakhna.\n\nApni style kaise dhoondhein:\n1. Apni awaaz ki taakat pehchaniye — kya aapki awaaz neeche garam hai? Upar bright hai? Narm gaanon mein achhi lagti hai?\n2. Alag-alag gaayakon aur eras ko suniye — sirf ek ki nakal mat kariye. Kai sources se seekhne par ek mix banta hai jo aapka hota hai.\n3. Ek gaane ke do version record kariye — ek original jaisa, ek apne tareeke se. Dono ko imaandaari se suniye.\n4. Apni natural awaaz mein gaaiye — kisi ki awaaz ki texture ko zabardasti copy karne se gale par zor pad sakta hai.\n\nRespect: cover karte waqt original composer, lyricist aur singer ko credit dijiye. Melody aur lyrics ka mool roop sammaan se rakhiye, aur public posting ke liye platform ke copyright rules follow kariye.\n\nStyle ek din mein nahi banti — saalon ki practice, sunne aur experiment se dheere-dheere ubharti hai.",
        english:
          "Almost every singer begins by imitating others — that is a natural way to learn. But imitation and interpretation are different.\n\nImitation means copying every note, ornament and breath of the original. Early on, this teaches a lot: phrasing, diction, ornament technique.\n\nInterpretation means understanding the heart of the song and making choices that suit your voice — singing a line more softly, leaving out an ornament, or choosing a key that fits you.\n\nFinding your style:\n1. Identify your voice's strengths. Is your lower range warm? Is your upper range bright? Do you shine in gentle songs or energetic ones?\n2. Listen widely across singers, genres and eras rather than copying one person. Learning from many sources produces a blend that becomes yours.\n3. Record two versions of a song — one close to the original, one with your own choices. Listen honestly to both.\n4. Sing with your natural voice. Forcing yourself to copy another singer's vocal texture (for example an artificially husky or nasal sound) can strain your voice.\n\nRespect: when performing covers, credit the composer, lyricist and original singer. Keep the melody and lyrics essentially intact, and follow platform rules on copyright when posting publicly.\n\nStyle does not appear in a day; it emerges gradually from years of practice, listening and experimentation.",
        hindi:
          "लगभग हर गायक दूसरों की नकल से शुरुआत करता है — यह सीखने का स्वाभाविक तरीका है। पर नकल और व्याख्या (इंटरप्रिटेशन) अलग-अलग हैं।\n\nनकल का मतलब है मूल गाने के हर स्वर, अलंकरण और साँस को कॉपी करना। शुरुआत में इससे बहुत कुछ सीखने को मिलता है: फ़्रेज़िंग, उच्चारण, अलंकरण की तकनीक।\n\nव्याख्या का मतलब है गाने की आत्मा को समझकर ऐसे फ़ैसले लेना जो आपकी आवाज़ के अनुकूल हों — किसी पंक्ति को ज़्यादा नरमी से गाना, कोई अलंकरण छोड़ देना, या अपने लिए सही की चुनना।\n\nअपनी शैली कैसे खोजें:\n1. अपनी आवाज़ की ख़ूबियाँ पहचानिए। क्या नीचे की रेंज गर्म है? ऊपर की रेंज चमकदार है? आप कोमल गानों में खिलते हैं या ऊर्जावान गानों में?\n2. किसी एक व्यक्ति की नकल करने के बजाय अलग-अलग गायकों, शैलियों और दौरों को खूब सुनिए। कई स्रोतों से सीखने पर एक मिश्रण बनता है जो आपका अपना होता है।\n3. एक गाने के दो संस्करण रिकॉर्ड कीजिए — एक मूल के करीब, एक अपने फ़ैसलों के साथ। दोनों को ईमानदारी से सुनिए।\n4. अपनी स्वाभाविक आवाज़ में गाइए। किसी दूसरे गायक की आवाज़ की बनावट (जैसे बनावटी भारी या नाक से निकली आवाज़) ज़बरदस्ती कॉपी करने से आवाज़ पर ज़ोर पड़ सकता है।\n\nसम्मान: कवर गाते समय संगीतकार, गीतकार और मूल गायक को श्रेय दीजिए। धुन और बोल को मूल रूप में बनाए रखिए, और सार्वजनिक रूप से पोस्ट करते समय प्लेटफ़ॉर्म के कॉपीराइट नियमों का पालन कीजिए।\n\nशैली एक दिन में नहीं बनती; यह वर्षों के अभ्यास, सुनने और प्रयोग से धीरे-धीरे उभरती है।",
      },
      whyItMatters:
        'A recognisable, honest style makes your singing memorable and sustainable, because it is built on your voice rather than a copy of someone else\'s.',
      traditionNote:
        'In the guru–shishya tradition, a student first absorbs the teacher\'s style deeply before developing individuality; gharana identity is itself a shared style. Individual expression within a tradition is valued, but it grows out of disciplined learning.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone' },
        { kind: 'sequence', label: 'Phrase to interpret your way: P m G R G - R S', notes: ['P', 'm', 'G', 'R', 'G', '-', 'R', 'S'], bpm: 60 },
      ],
      guidedSteps: [
        'List three singers you admire and, for each, one specific quality you like (e.g. diction, softness, rhythm).',
        'Sing the demo phrase in akaar three different ways (dynamics, timing, one ornament). Record each in the Recording Journal.',
        'Choose a song. Record a version close to the original.',
        'Record a second version with at least two deliberate choices of your own.',
        'Listen to both a day later. Which feels more honest and comfortable?',
      ],
      independentPractice: {
        instructions:
          'Over two weeks, create an "imitation vs interpretation" pair for two songs. Note your deliberate choices and how they felt to sing.',
        durationMin: 20,
        tool: 'recorder',
      },
      mistakes: [
        { mistake: 'Copying another singer\'s voice texture in a way that strains your throat.', fix: 'Learn their phrasing and expression, but sing with your own healthy natural tone.' },
        { mistake: 'Changing a song so much that it loses its melody and meaning.', fix: 'Keep the melody essentially intact; interpret through dynamics, tone and small choices.' },
        { mistake: 'Listening to only one singer or one era.', fix: 'Build a varied listening list across eras and styles.' },
      ],
      quiz: [
        { question: 'What is the difference between imitation and interpretation?', options: ['There is none', 'Imitation copies details; interpretation makes your own choices based on understanding', 'Interpretation means changing the lyrics', 'Imitation is always wrong'], answerIndex: 1, explanation: 'Both are useful; interpretation builds on what imitation teaches.' },
        { question: 'Why avoid forcing another singer\'s vocal texture?', options: ['It can strain your voice', 'It is illegal', 'Microphones cannot record it', 'It changes the tempo'], answerIndex: 0, explanation: 'Your healthy natural tone is the safest base for style.' },
        { question: 'When performing a cover publicly, you should...', options: ['Claim it as your composition', 'Change all the lyrics', 'Credit the original creators and follow copyright rules', 'Never mention the song name'], answerIndex: 2, explanation: 'Respect for creators includes credit and legal compliance.' },
      ],
      practical: {
        kind: 'self-check',
        description: 'Style is personal; this check is self-reported.',
        items: [
          'I recorded an imitation version and an interpretation version of the same song.',
          'I can name two deliberate choices that make my version my own.',
          'I wrote down two or three strengths of my voice.',
        ],
      },
      videoQueries: ['how to find your own singing style', 'cover song interpretation tips singers', 'imitation vs originality learning to sing'],
      nextStep: 'Final lesson: designing your personalised long-term practice plan.',
      estMinutes: 25,
    },
    {
      id: 'l4-long-term-practice-plan',
      level: 4,
      module: 'Your Lifelong Path',
      title: 'Your Personalised Long-Term Practice Plan',
      objective:
        'Design a balanced weekly riyaz plan with warm-up, technique, raga/alankar work, repertoire, rest days and periodic self-review, and decide how to get feedback from a human teacher.',
      explanation: {
        hinglish:
          "Gaana ek lifelong safar hai. Is app ka aakhri level khatam karna 'finish line' nahi — balki ab aap khud apni riyaz design kar sakte hain.\n\nEk balanced daily session (example, 30–45 min):\n• Warm-up (5–8 min): humming, lip trills, sirens, Tanpura ke saath Sa.\n• Sur sadhana (5–10 min): kharaj/mandra se madhya tak long notes, Pitch Matcher check.\n• Technique (8–10 min): alankar, taans ka metronome ladder.\n• Raga / improvisation (5–10 min): Bhupali ya Yaman mein chhote phrases.\n• Repertoire (10–15 min): ek-do gaane, expression aur mic work ke saath.\n• Cool-down (2–3 min): halki humming.\n\nHafte ka balance: har din sab kuch zaroori nahi. Jaise — Mon/Thu: technique heavy; Tue/Fri: repertoire heavy; Wed/Sat: raga aur improvisation; Sunday ya koi ek din: aaram ya sirf halka sunna. Rest days aawaaz ke liye zaroori hain.\n\nSelf-review: har hafte ek recording save kariye. Har mahine purani recording se compare kariye aur 2–3 goals update kariye. Goals specific rakhiye — 'better singing' nahi, balki 'Yaman alankar 90 BPM par saaf' ya 'ek gaana 1 semitone neeche comfortable key mein perform karna'.\n\nHuman teacher: Pitch Matcher sirf sur ki match check karta hai. Woh aapka tone, vowel shape, tension, raga ka chalan, ornaments ki khoobsurti, bhav — yeh sab nahi pakad sakta. Ek achha guru ya vocal teacher (online ya offline) aapko woh feedback dega. Kabhi-kabhi ek-do lessons bhi bahut madad karte hain.\n\nAur sabse zaroori: gale mein dard, lamba hoarseness ya awaaz ka achaanak badalna ho, toh riyaz rokiye aur ENT doctor se miliye.",
        english:
          "Singing is a lifelong journey. Finishing this app's final level is not a finish line; it means you can now design your own riyaz.\n\nA balanced daily session (example, 30–45 minutes):\n• Warm-up (5–8 min): humming, lip trills, sirens, Sa with the tanpura.\n• Sur sadhana (5–10 min): long notes from mandra to madhya, checked in the Pitch Matcher.\n• Technique (8–10 min): alankars, the taan metronome ladder.\n• Raga / improvisation (5–10 min): short phrases in Bhupali or Yaman.\n• Repertoire (10–15 min): one or two songs, with expression and mic work.\n• Cool-down (2–3 min): gentle humming.\n\nWeekly balance: you don't need everything every day. For example — Mon/Thu technique-heavy; Tue/Fri repertoire-heavy; Wed/Sat raga and improvisation; and at least one lighter day for rest or listening only. Rest days matter for the voice, just as for any muscle-based skill.\n\nSelf-review: save one recording per week. Each month, compare with older recordings and update two or three specific goals — not 'sing better', but 'Yaman alankar clean at 90 BPM' or 'perform one song in a comfortable key'.\n\nA human teacher: the Pitch Matcher only checks whether your notes match. It cannot hear tone quality, vowel shape, tension, raga chalan, the beauty of ornaments or bhav. A good guru or vocal teacher, online or in person, can give that feedback. Even occasional lessons help a lot.\n\nAbove all: if you have throat pain, hoarseness lasting more than about two weeks, or a sudden change in your voice, stop practising and consult an ENT doctor.",
        hindi:
          "गाना जीवन भर की यात्रा है। इस ऐप का आख़िरी लेवल पूरा करना कोई 'फ़िनिश लाइन' नहीं है; इसका मतलब है कि अब आप अपना रियाज़ ख़ुद बना सकते हैं।\n\nएक संतुलित दैनिक सत्र (उदाहरण, 30–45 मिनट):\n• वॉर्म-अप (5–8 मिनट): हमिंग, लिप ट्रिल, साइरन, तानपुरे के साथ सा।\n• सुर साधना (5–10 मिनट): मंद्र से मध्य सप्तक तक लंबे स्वर, पिच मैचर में जाँच के साथ।\n• तकनीक (8–10 मिनट): अलंकार, तान की मेट्रोनोम सीढ़ी।\n• राग / उपज (5–10 मिनट): भूपाली या यमन में छोटे वाक्यांश।\n• गाने (10–15 मिनट): एक-दो गाने, भाव और माइक तकनीक के साथ।\n• कूल-डाउन (2–3 मिनट): हल्की हमिंग।\n\nहफ़्ते का संतुलन: हर दिन सब कुछ ज़रूरी नहीं। उदाहरण — सोम/गुरु तकनीक पर ज़ोर; मंगल/शुक्र गानों पर ज़ोर; बुध/शनि राग और उपज; और कम से कम एक हल्का दिन आराम या सिर्फ़ सुनने के लिए। किसी भी मांसपेशी-आधारित कौशल की तरह, आवाज़ के लिए भी आराम के दिन ज़रूरी हैं।\n\nस्व-समीक्षा: हर हफ़्ते एक रिकॉर्डिंग सेव कीजिए। हर महीने पुरानी रिकॉर्डिंग से तुलना कीजिए और दो-तीन ठोस लक्ष्य अपडेट कीजिए — 'बेहतर गाना' नहीं, बल्कि 'यमन अलंकार 90 BPM पर साफ़' या 'एक गाना आरामदायक की में प्रस्तुत करना'।\n\nमानव शिक्षक: पिच मैचर केवल यह जाँचता है कि आपके स्वर मेल खाते हैं या नहीं। वह आवाज़ की गुणवत्ता, स्वरों (वॉवेल) का आकार, तनाव, राग का चलन, अलंकरणों की सुंदरता या भाव नहीं सुन सकता। एक अच्छे गुरु या वोकल टीचर, ऑनलाइन या आमने-सामने, यह फ़ीडबैक दे सकते हैं। कभी-कभार की क्लास भी बहुत मदद करती है।\n\nसबसे ज़रूरी: अगर गले में दर्द हो, आवाज़ लगभग दो हफ़्ते से ज़्यादा बैठी रहे, या आवाज़ में अचानक बदलाव आए, तो अभ्यास रोकिए और ENT डॉक्टर से सलाह लीजिए।",
      },
      whyItMatters:
        'Consistent, balanced practice over years matters far more than any single lesson. A plan you can actually follow keeps progress steady and the voice healthy.',
      traditionNote:
        'Traditional riyaz under a guru can be very demanding and highly individual. Plans here are general templates; a teacher can tailor practice to your voice, goals and chosen tradition.',
      demos: [
        { kind: 'drone', label: 'Tanpura drone for your daily riyaz' },
        { kind: 'taal', label: 'Teentaal for layakari practice', taal: 'teentaal', bpm: 70, cycles: 1 },
        { kind: 'sequence', label: 'Daily check scale: S R G m P D N S\' N D P m G R S', notes: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'", 'N', 'D', 'P', 'm', 'G', 'R', 'S'], bpm: 90 },
      ],
      guidedSteps: [
        'Write your current goals: one technical, one raga/improvisation, one repertoire, one performance goal.',
        'Draft a weekly timetable with at least one lighter or rest day.',
        'Do one full session following your plan, using the Tanpura Drone, Pitch Matcher, Sargam Player and Metronome & Taal.',
        'Record a "baseline" take in the Recording Journal: warm-up scale plus one song.',
        'Set a monthly review date to compare recordings and update goals.',
        'Research local or online vocal teachers and note one or two options for a trial lesson.',
      ],
      independentPractice: {
        instructions:
          'Follow your personal plan for four weeks. Save one weekly recording, and at the end of the month compare it with your baseline and adjust your goals.',
        durationMin: 40,
        tool: 'drone',
        pattern: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'", 'N', 'D', 'P', 'm', 'G', 'R', 'S'],
        bpm: 90,
      },
      mistakes: [
        { mistake: 'Planning two-hour daily sessions that are impossible to sustain.', fix: 'Choose a duration you can keep up five or six days a week; consistency beats intensity.' },
        { mistake: 'Practising only favourite songs and skipping technique.', fix: 'Give each riyaz component its place across the week.' },
        { mistake: 'Relying only on the app for feedback.', fix: 'Get periodic feedback from a human teacher on tone, style and raga treatment.' },
      ],
      quiz: [
        { question: 'What can the Pitch Matcher NOT judge?', options: ['Whether a note matches the target pitch', 'Tone quality, tension and bhav', 'Which note you sang', 'Cents deviation'], answerIndex: 1, explanation: 'Pitch detection measures pitch only; a human teacher is needed for tone, style and expression.' },
        { question: 'Why include rest or lighter days?', options: ['Rest is wasted time', 'To forget technique', 'Only beginners need rest', 'The voice needs recovery to stay healthy and improve'], answerIndex: 3, explanation: 'Recovery protects the voice and supports long-term progress.' },
        { question: 'Which goal is the most useful to track?', options: ['"Sing better"', '"Yaman alankar clean at 90 BPM"', '"Become famous"', '"Never make mistakes"'], answerIndex: 1, explanation: 'Specific, measurable goals can be reviewed and updated.' },
        { question: 'Finishing Level 4 means...', options: ['You have finished learning to sing', 'You have strong foundations to continue a lifelong practice', 'You no longer need warm-ups', 'You should stop recording'], answerIndex: 1, explanation: 'Singing is lifelong; this level gives you the tools to keep growing.' },
      ],
      practical: {
        kind: 'self-check',
        description: 'Your plan is personal; report honestly.',
        items: [
          'I wrote a weekly practice plan that includes warm-up, technique, raga work, repertoire and at least one lighter/rest day.',
          'I recorded a baseline take in the Recording Journal and set a monthly review date.',
          'I identified at least one option for getting feedback from a human teacher.',
        ],
      },
      videoQueries: ['daily riyaz routine Hindustani vocal', 'how to structure vocal practice session', 'how to find a good vocal teacher online'],
      nextStep: 'Complete the Advanced Foundations Review checkpoint, then keep following and refining your plan.',
      estMinutes: 30,
      safetyNote: 'Persistent hoarseness (more than about two weeks), pain, or sudden voice changes need medical attention from an ENT doctor. Never sing through pain.',
    },
  ],
  checkpoint: {
    title: 'Advanced Foundations Review',
    description:
      'This review checks that you can match notes across a full-octave scale reliably and confirms (by honest self-report) that you have performed or recorded a full song and created your own practice plan. Completing it does not mean you are "finished" — singing is a lifelong practice, and the best singers keep learning for decades. The pitch check measures note matching only; it cannot judge tone, style, raga treatment or expression, so we strongly recommend working with a human teacher for detailed feedback as you continue.',
    requirements: [
      {
        kind: 'pitch-match',
        description: 'Match the notes of a full Bilawal scale including mandra Ni and taar Sa, plus teevra Ma.',
        targets: ['.N', 'S', 'R', 'G', 'm', 'M', 'P', 'D', 'N', "S'"],
        minAttempts: 16,
        minSuccessPct: 75,
        toleranceCents: 30,
      },
      {
        kind: 'self-check',
        description: 'Performance and planning milestones (self-reported).',
        items: [
          'I performed a full song for at least one person, or recorded a complete full-song take in the Recording Journal and reviewed it.',
          'I created a personal long-term practice plan with rest days and a monthly self-review.',
        ],
      },
    ],
  },
};
