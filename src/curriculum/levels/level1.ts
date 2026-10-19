import type { Level } from '../types';

const M_SOUND = 'Understanding Sound & Sur';
const M_SARGAM = 'Sargam: The Language of Notes';
const M_BODY = 'Body, Breath & Vocal Care';
const M_EAR = 'Finding Sa & Training the Ear';

export const level1: Level = {
  id: 1,
  title: 'Foundations',
  subtitle: 'Voice, sur, sargam, breath and your own Sa',
  suggestedDuration: 'Weeks 1–4 (flexible guideline)',
  description:
    'Level 1 builds the ground everything else stands on: what singing physically is, what pitch, swar and sur mean, how sargam works and why Sa is your movable home note. You will learn a comfortable posture, natural breathing, gentle warm-ups and how to look after your voice, then find your own Sa and start training your ear. Go at your own pace: the weeks are only a guideline, and nothing here should ever hurt.',
  lessons: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'l1-what-is-singing',
      level: 1,
      module: M_SOUND,
      title: 'What Is Singing?',
      objective:
        'Understand, in simple terms, how breath, the vocal folds and the spaces of your throat and mouth work together to make a sung sound.',
      explanation: {
        hinglish:
          'Chaliye shuru karte hain ek simple sawaal se: gaana asal mein hai kya? Aapki awaaz ek instrument hai, bilkul jaise bansuri ya sitar, bas yeh instrument aapke andar hai.\n\nIs instrument ke teen hisse samjhiye. Pehla, saans (breath): yeh power supply hai. Fefdon (lungs) se hawa upar aati hai. Doosra, vocal folds: gale mein, voice box (larynx) ke andar do chhoti, naram muscle-tissue ki pattiyan hoti hain. Jab hawa unke beech se guzarti hai, woh bahut tezi se khulti-band hoti hain, yaani vibrate karti hain. Yahi vibration sound banata hai. Teesra, resonance: gala, munh aur naak ke andar ki khaali jagah us chhoti si sound ko bada aur rangeen banati hai, jaise guitar ki body taar ki awaaz ko badhati hai.\n\nJab vocal folds second mein zyada baar vibrate karti hain, sur ooncha lagta hai; kam baar, toh neecha. Bolna aur gaana dono isi system se hote hain. Fark bas itna hai ki gaate waqt hum sur ko lamba pakadte hain, saans ko control karte hain aur sahi sur par tikte hain.\n\nSabse zaroori baat: gaana ek skill hai, koi janm-jaat jaadu nahi. Thoda-thoda roz practice karne se awaaz aur kaan dono behtar hote hain. Kitna jaldi? Yeh har insaan ke liye alag hai, isliye apne aap se compare kariye, doosron se nahi.',
        english:
          'Let us begin with a simple question: what actually is singing? Your voice is a musical instrument, just like a flute or a sitar, except that it lives inside your body.\n\nThink of it in three parts. First, breath: this is the power supply. Air flows up from your lungs. Second, the vocal folds: inside your voice box (larynx) are two small, soft bands of muscle and tissue. When air passes between them they open and close very rapidly, which we call vibrating. That vibration creates the raw sound. Third, resonance: the spaces in your throat, mouth and nose shape and amplify that small buzz into a full voice, much like the wooden body of a guitar amplifies a string.\n\nWhen the vocal folds vibrate more times per second, the sound is higher; fewer times per second, it is lower. Speaking and singing use the same system. The difference is that in singing we sustain notes, manage breath more deliberately, and aim to land on specific pitches.\n\nMost importantly, singing is a skill, not magic you are born with or without. Regular, gentle practice improves both the voice and the ear. How fast? That differs for every person, so compare yourself with your own past self, not with others.',
        hindi:
          'आइए एक सीधे सवाल से शुरू करें: गाना असल में है क्या? आपकी आवाज़ एक वाद्य (instrument) है, बिल्कुल बाँसुरी या सितार की तरह, बस यह वाद्य आपके शरीर के अंदर है।\n\nइसे तीन हिस्सों में समझिए। पहला, साँस: यह बिजली की सप्लाई जैसी है। फेफड़ों से हवा ऊपर आती है। दूसरा, वोकल फ़ोल्ड्स (vocal folds): गले में, स्वर-यंत्र (larynx) के अंदर, मांसपेशी और ऊतक की दो छोटी, नरम पट्टियाँ होती हैं। जब हवा उनके बीच से गुज़रती है, तो वे बहुत तेज़ी से खुलती-बंद होती हैं, यानी कंपन (vibrate) करती हैं। यही कंपन कच्ची आवाज़ बनाता है। तीसरा, गूँज (resonance): गले, मुँह और नाक के अंदर की खाली जगह उस छोटी-सी भिनभिनाहट को भरी-पूरी आवाज़ में बदल देती है, जैसे गिटार की लकड़ी की बॉडी तार की आवाज़ को बढ़ाती है।\n\nजब वोकल फ़ोल्ड्स एक सेकंड में ज़्यादा बार कंपन करते हैं, तो सुर ऊँचा लगता है; कम बार, तो नीचा। बोलना और गाना दोनों इसी व्यवस्था से होते हैं। फ़र्क बस इतना है कि गाते समय हम सुर को लंबा पकड़ते हैं, साँस को ज़्यादा ध्यान से चलाते हैं और तय पिच (pitch) पर टिकने की कोशिश करते हैं।\n\nसबसे ज़रूरी बात: गाना एक हुनर है, कोई जन्म से मिला जादू नहीं। रोज़ थोड़ा, आराम से अभ्यास करने से आवाज़ और कान दोनों बेहतर होते हैं। कितनी जल्दी? यह हर इंसान के लिए अलग है, इसलिए खुद की तुलना अपने पुराने रूप से कीजिए, दूसरों से नहीं।',
      },
      whyItMatters:
        'When you understand that sound comes from breath meeting relaxed vocal folds, you stop trying to force sound from the throat, which is the most common cause of strain in beginners.',
      traditionNote:
        'This is a simplified picture of voice science. Real vocal anatomy is more detailed, but this model is enough to practise safely at the start.',
      demos: [
        { kind: 'note', label: 'A single steady sung note: your Sa', swara: 'S', durationSec: 3 },
        { kind: 'glide', label: 'A smooth slide from low to higher: what faster vibration sounds like', from: 'S', to: 'P', durationSec: 3 },
        { kind: 'drone', label: 'The Tanpura Drone: the steady background sound we will sing with' },
      ],
      guidedSteps: [
        'Sit or stand comfortably. Place one hand lightly on the front of your throat.',
        'Say a relaxed "mmm" as if agreeing with someone. Notice the gentle buzz under your hand: that is your vocal folds vibrating.',
        'Now just breathe out silently. No buzz: air alone does not make voice, the folds must vibrate.',
        'Hum "mmm" again and notice the tingle on your lips and nose: that is resonance.',
        'Play the glide demo and listen to how the sound rises smoothly. Do not sing yet, just listen.',
        'Open the Tanpura Drone and simply listen to it for one minute with your eyes closed.',
      ],
      independentPractice: {
        instructions:
          'Once a day, spend a few minutes with the Tanpura Drone playing quietly. Hum softly on any comfortable sound and feel the buzz on your lips. There is no right or wrong note yet; the goal is to notice breath turning into sound without any pushing.',
        durationMin: 5,
        tool: 'drone',
      },
      mistakes: [
        { mistake: 'Squeezing the throat to make the sound louder.', fix: 'Volume comes from steady breath and resonance, not from tightening. Keep it soft and easy at this stage.' },
        { mistake: 'Believing "I am just not born a singer" after one try.', fix: 'Singing is learnable. Judge progress over weeks, not minutes.' },
        { mistake: 'Holding the breath before making a sound.', fix: 'Let the sound start on a gentle, flowing breath, like a sigh that turns into a hum.' },
      ],
      quiz: [
        {
          question: 'What actually creates the raw sound of your voice?',
          options: ['The tongue hitting the teeth', 'The vocal folds vibrating as air passes through them', 'The lungs vibrating', 'The nose'],
          answerIndex: 1,
          explanation: 'Air from the lungs makes the vocal folds in the larynx vibrate; that vibration is the source of the sound.',
        },
        {
          question: 'If the vocal folds vibrate more times per second, the note sounds…',
          options: ['Lower', 'Louder only', 'Higher'],
          answerIndex: 2,
          explanation: 'More vibrations per second means a higher frequency, which we hear as a higher pitch.',
        },
        {
          question: 'What does resonance do?',
          options: ['Shapes and amplifies the sound using the spaces of the throat, mouth and nose', 'Stops the sound', 'Provides the air', 'Decides the lyrics'],
          answerIndex: 0,
          explanation: 'Like the body of a guitar, your throat, mouth and nasal spaces shape and amplify the buzz of the folds.',
        },
      ],
      videoQueries: ['how the voice works vocal folds explained for beginners', 'awaaz kaise banti hai vocal cords singing hindi'],
      nextStep: 'Next, we will make the words pitch, swar and sur clear, because people often mix them up.',
      estMinutes: 15,
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'l1-sur-swar-pitch',
      level: 1,
      module: M_SOUND,
      title: 'Pitch, Swar and Sur: What Is the Difference?',
      objective:
        'Correctly explain pitch, swar and sur, and know how these words are used both technically and in everyday conversation.',
      explanation: {
        hinglish:
          'Teen shabd aap baar-baar sunenge: pitch, swar aur sur. Inko saaf samajh lena bahut kaam aayega.\n\nPitch: yeh science ka shabd hai. Koi awaaz kitni oonchi ya neechi hai, use pitch kehte hain. Ise Hertz (Hz) mein naapte hain, yaani ek second mein kitni baar vibration hua. Jaise 220 Hz ek note hai aur 440 Hz usse oonchi.\n\nSwar: Indian music mein swar ek defined musical note hai, jiska apna naam aur jagah hai: Sa, Re, Ga, Ma, Pa, Dha, Ni. Swar ka matlab sirf koi bhi random pitch nahi, balki ek tay kiya hua note jo Sa ke hisaab se apni jagah par hai.\n\nSur: roz-marra ki bolchaal mein "sur mein gaana" ka matlab hai tune mein, sahi pitch par gaana. "Uska sur achha hai" matlab uski tunefulness achhi hai. Kabhi-kabhi log sur ko note ke liye bhi bol dete hain, jaise "yeh sur lagao". Yeh loose use hai, galat nahi, bas thoda dheela.\n\nToh short mein: pitch naapne wali cheez hai, swar music ka defined note hai, aur sur zyadatar tune mein hone ka ehsaas hai. Is app mein jab hum kahenge "sur mein raho", matlab target swar ke pitch ke kareeb raho.',
        english:
          'You will hear three words again and again: pitch, swar and sur. Getting them clear now will help a lot.\n\nPitch is a scientific word. It describes how high or low a sound is, and it is measured in Hertz (Hz), the number of vibrations per second. For example, 220 Hz is one note and 440 Hz is a higher one.\n\nSwar (swara) in Indian music is a defined musical note with its own name and place: Sa, Re, Ga, Ma, Pa, Dha, Ni. A swar is not just any random pitch; it is a specific note that sits in a particular position relative to Sa.\n\nSur, in everyday use, mostly means being in tune. "Singing in sur" means singing on the correct pitch; "she has good sur" means she sings tunefully. People also use sur loosely to mean a note, as in "hold this sur". That casual use is common and fine, just less precise.\n\nSo, in short: pitch is the measurable physical quantity, swar is a defined note in the musical system, and sur most often means the sense of being in tune. In this app, when we say "stay in sur", we mean stay close to the pitch of the target swar.',
        hindi:
          'तीन शब्द आप बार-बार सुनेंगे: पिच (pitch), स्वर और सुर। इन्हें अभी साफ़ समझ लेना बहुत काम आएगा।\n\nपिच विज्ञान का शब्द है। कोई आवाज़ कितनी ऊँची या नीची है, उसे पिच कहते हैं। इसे हर्ट्ज़ (Hz) में नापते हैं, यानी एक सेकंड में कितनी बार कंपन हुआ। जैसे 220 Hz एक नोट है और 440 Hz उससे ऊँचा।\n\nस्वर भारतीय संगीत में एक तय संगीत-नोट है, जिसका अपना नाम और जगह है: सा, रे, ग, म, प, ध, नि। स्वर कोई भी मनमानी पिच नहीं है; यह एक ख़ास नोट है जो सा के हिसाब से अपनी जगह पर रहता है।\n\nसुर का रोज़मर्रा में ज़्यादातर मतलब है सही सुर में होना। "सुर में गाना" यानी सही पिच पर गाना; "उसका सुर अच्छा है" यानी वह सुरीला गाती है। लोग ढीले ढंग से सुर को नोट के लिए भी बोल देते हैं, जैसे "यह सुर लगाओ"। यह आम बोलचाल है और ठीक है, बस थोड़ा कम सटीक।\n\nतो संक्षेप में: पिच नापी जाने वाली भौतिक चीज़ है, स्वर संगीत-व्यवस्था का तय नोट है, और सुर ज़्यादातर सही सुर में होने का एहसास है। इस ऐप में जब हम कहें "सुर में रहो", तो मतलब है लक्ष्य वाले स्वर की पिच के पास रहो।',
      },
      whyItMatters:
        'Clear words make clear practice. When the Pitch Matcher shows a number in Hz or cents, you will know it is measuring pitch, while your goal is to land on the right swar, which is what being in sur means.',
      traditionNote:
        'Usage of "sur" and "swar" varies among teachers and regions; some use them almost interchangeably. The distinctions here are the clearest common usage, not a rigid rule.',
      demos: [
        { kind: 'compare', label: 'Two different pitches: Sa and Pa', a: 'S', b: 'P' },
        { kind: 'compare', label: 'The same swar played twice: Sa and Sa', a: 'S', b: 'S' },
        { kind: 'glide', label: 'Pitch changing continuously between Sa and Ga (not separate swars)', from: 'S', to: 'G', durationSec: 3 },
      ],
      guidedSteps: [
        'Play the first compare demo. Notice that the second sound is higher: that is a difference in pitch.',
        'Play the second compare demo. Both sounds are the same swar, Sa, so they sound the same height.',
        'Play the glide demo. The pitch passes through many in-between heights; only certain points on that slide are named swars.',
        'Open the Pitch Matcher and hum any comfortable sound. Watch the number change as you go slightly higher or lower.',
        'Say aloud in your own words: "Pitch is how high or low; swar is a named note; sur means being in tune."',
      ],
      independentPractice: {
        instructions:
          'Open the Pitch Matcher and hum very softly. Slowly slide your hum a little higher and a little lower and watch the reading move. You are only observing that pitch is continuous; do not try to hit any particular note yet.',
        durationMin: 5,
        tool: 'pitch-match',
      },
      mistakes: [
        { mistake: 'Thinking "loud" means "high pitch".', fix: 'Loudness (volume) and pitch are separate. You can sing a high note softly or a low note loudly.' },
        { mistake: 'Assuming any pitch you sing is automatically a swar.', fix: 'A swar is a specific note relative to Sa. Pitches in between are not named swars.' },
        { mistake: 'Feeling embarrassed by the casual use of "sur".', fix: 'Everyday usage is fine. Just know the more precise meanings when you study.' },
      ],
      quiz: [
        {
          question: 'Pitch is measured in…',
          options: ['Decibels (dB)', 'Beats per minute', 'Hertz (Hz)', 'Seconds'],
          answerIndex: 2,
          explanation: 'Pitch corresponds to frequency, measured in Hertz (vibrations per second). Decibels measure loudness.',
        },
        {
          question: 'Which best describes a swar?',
          options: ['Any random sound', 'A defined musical note such as Sa, Re or Ga', 'The loudness of a voice', 'A type of rhythm'],
          answerIndex: 1,
          explanation: 'A swar is a named, defined note in the Indian system, positioned relative to Sa.',
        },
        {
          question: 'When someone says "she sings in sur", they usually mean…',
          options: ['She sings in tune', 'She sings loudly', 'She sings fast', 'She sings in English'],
          answerIndex: 0,
          explanation: 'In everyday usage, being "in sur" means singing in tune, on the correct pitch.',
        },
        {
          question: 'Can you sing a high note softly?',
          options: ['No, high always means loud', 'Yes, pitch and loudness are separate', 'Only men can'],
          answerIndex: 1,
          explanation: 'Pitch (high/low) and volume (soft/loud) are independent qualities of sound.',
        },
      ],
      videoQueries: ['difference between sur and swar explained hindi', 'what is pitch in music for beginners'],
      nextStep: 'Next, we will see how notes are arranged into scales and octaves (saptak).',
      estMinutes: 15,
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'l1-notes-scales-octaves',
      level: 1,
      module: M_SOUND,
      title: 'Notes, Scales and the Saptak',
      objective:
        'Understand what a note, a scale and an octave (saptak) are, and recognise the mandra, madhya and taar saptak.',
      explanation: {
        hinglish:
          'Ek note (swar) ek tay pitch hai jise hum naam dete hain. Jab kuch notes ko ek order mein, neeche se upar, sajaate hain toh use scale kehte hain. Indian music mein seven shuddh swar hain: Sa Re Ga Ma Pa Dha Ni. Inke baad phir Sa aata hai, lekin ooncha wala.\n\nYeh ooncha Sa kyon aisa lagta hai jaise "wahi Sa" ho? Kyunki uski frequency theek double hoti hai. Agar aapka Sa 200 Hz hai, toh upar wala Sa 400 Hz hoga. Kaan ko dono ek hi rang ke lagte hain, bas ek ooncha aur ek neecha. Is doori ko Western music mein octave aur hamare yahan saptak kehte hain, kyunki ismein saat (sapt) swar hote hain.\n\nGaane ke liye teen saptak kaafi kaam aate hain. Madhya saptak: beech wala, jahan aapki zyada gaayaki hogi. Mandra saptak: neeche wala, jise notation mein note ke aage dot lagakar likhte hain, jaise .N. Taar saptak: upar wala, jise apostrophe se likhte hain, jaise S\'.\n\nAbhi ke liye bas itna yaad rakhiye: neeche ka Sa, beech ka Sa, upar ka Sa, sab Sa hi hain, alag-alag manzil par. Aapko teeno saptak poore gaane ki zaroorat nahi; har awaaz ki apni comfortable range hoti hai aur woh dheere-dheere khulti hai.',
        english:
          'A note (swar) is a specific pitch that we give a name to. When we arrange several notes in order from low to high, we call that a scale. In Indian music there are seven shuddh (natural) swars: Sa Re Ga Ma Pa Dha Ni. After Ni comes Sa again, but a higher one.\n\nWhy does that higher Sa feel like "the same" Sa? Because its frequency is exactly double. If your Sa is 200 Hz, the upper Sa is 400 Hz. The ear hears them as the same colour of note, one higher and one lower. This distance is called an octave in Western music and a saptak in Indian music, from "sapt", seven, because it contains seven swars.\n\nThree saptaks matter most for singing. Madhya saptak: the middle octave, where most of your singing will live. Mandra saptak: the lower octave, written in this app with a dot before the note, like .N. Taar saptak: the upper octave, written with an apostrophe after the note, like S\'.\n\nFor now, just remember: lower Sa, middle Sa and upper Sa are all Sa, on different floors of the same building. You do not need to sing all three saptaks fully; every voice has its own comfortable range, and it opens up gradually with practice.',
        hindi:
          'एक नोट (स्वर) एक तय पिच (pitch) है जिसे हम नाम देते हैं। जब कुछ नोट्स को नीचे से ऊपर एक क्रम में सजाते हैं, तो उसे स्केल (scale) कहते हैं। भारतीय संगीत में सात शुद्ध स्वर हैं: सा रे ग म प ध नि। नि के बाद फिर सा आता है, लेकिन ऊँचा वाला।\n\nवह ऊँचा सा "वही सा" क्यों लगता है? क्योंकि उसकी फ़्रीक्वेंसी ठीक दोगुनी होती है। अगर आपका सा 200 Hz है, तो ऊपर वाला सा 400 Hz होगा। कान को दोनों एक ही रंग के लगते हैं, बस एक ऊँचा और एक नीचा। इस दूरी को पश्चिमी संगीत में ऑक्टेव (octave) और हमारे यहाँ सप्तक कहते हैं, "सप्त" यानी सात, क्योंकि इसमें सात स्वर होते हैं।\n\nगाने के लिए तीन सप्तक सबसे काम के हैं। मध्य सप्तक: बीच वाला, जहाँ आपका ज़्यादातर गाना होगा। मंद्र सप्तक: नीचे वाला, जिसे इस ऐप में नोट के आगे बिंदु लगाकर लिखते हैं, जैसे .N। तार सप्तक: ऊपर वाला, जिसे नोट के बाद अपॉस्ट्रॉफ़ी लगाकर लिखते हैं, जैसे S\'।\n\nअभी बस इतना याद रखिए: नीचे का सा, बीच का सा और ऊपर का सा, सब सा ही हैं, एक ही इमारत की अलग-अलग मंज़िलों पर। आपको तीनों सप्तक पूरे गाने की ज़रूरत नहीं; हर आवाज़ की अपनी आरामदायक रेंज होती है, और वह अभ्यास से धीरे-धीरे खुलती है।',
      },
      whyItMatters:
        'Every exercise in this app is written with swars and saptak marks. Knowing that .N is below Sa and S\' is above it lets you read and follow any pattern confidently.',
      traditionNote:
        'This app plays notes in 12-tone equal temperament, the tuning used by keyboards and harmoniums. In formal Hindustani practice, singers tune some swars with subtle micro-adjustments (shrutis) depending on the raga. Equal temperament is a practical simplification for beginners.',
      demos: [
        { kind: 'sequence', label: 'The madhya saptak scale: Sa Re Ga Ma Pa Dha Ni Sa\'', notes: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"], bpm: 60 },
        { kind: 'compare', label: 'Madhya Sa and taar Sa: same note, frequency doubled', a: 'S', b: "S'" },
        { kind: 'sequence', label: 'Three floors of Sa: mandra, madhya, taar', notes: ['.S', '-', 'S', '-', "S'"], bpm: 50 },
        { kind: 'note', label: 'Mandra Ni (just below your Sa)', swara: '.N', durationSec: 2 },
      ],
      guidedSteps: [
        'Play the scale demo and count the notes on your fingers: seven swars, then Sa again.',
        'Play the compare demo of Sa and upper Sa. Notice how they blend, as if they belong together.',
        'Open the Sargam Player and tap S, then S\', then .S. Listen to the three floors of Sa.',
        'Look at the Virtual Keyboard: find Sa, then count up to the next Sa. Notice it is 12 keys (semitones) higher.',
        'Write the three octave marks on paper: .S (mandra), S (madhya), S\' (taar).',
      ],
      independentPractice: {
        instructions:
          'Play the full scale slowly in the Sargam Player a few times while just listening. Then hum only the notes that feel easy and comfortable; skip any that feel high or strained.',
        durationMin: 7,
        tool: 'sargam',
        pattern: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"],
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Thinking upper Sa is a completely different note.', fix: 'It is the same swar one saptak higher, at double the frequency.' },
        { mistake: 'Straining to reach taar Sa on day one.', fix: 'Only sing what is comfortable. Range grows with time; listening counts as practice too.' },
        { mistake: 'Confusing the dot and the apostrophe.', fix: 'Dot before (.N) = lower saptak. Apostrophe after (S\') = upper saptak.' },
      ],
      quiz: [
        {
          question: 'If your Sa is 220 Hz, the taar (upper) Sa is about…',
          options: ['230 Hz', '330 Hz', '440 Hz', '110 Hz'],
          answerIndex: 2,
          explanation: 'Moving up one saptak doubles the frequency: 220 × 2 = 440 Hz. (110 Hz would be mandra Sa.)',
        },
        {
          question: 'How is mandra Ni written in this app?',
          options: ["N'", '.N', 'n', 'N'],
          answerIndex: 1,
          explanation: 'A dot before the letter means mandra (lower) saptak.',
        },
        {
          question: 'Why is it called a saptak?',
          options: ['Because it has seven swars', 'Because it lasts seven seconds', 'Because there are seven octaves'],
          answerIndex: 0,
          explanation: '"Sapt" means seven; a saptak contains the seven swars Sa to Ni.',
        },
      ],
      videoQueries: ['mandra madhya taar saptak explained hindi', 'what is an octave in music frequency doubling'],
      nextStep: 'Next, we will look at sargam itself: the names Sa Re Ga Ma Pa Dha Ni and how to sing them.',
      estMinutes: 15,
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'l1-what-is-sargam',
      level: 1,
      module: M_SARGAM,
      title: 'What Is Sargam?',
      objective:
        'Know the seven swar names in order, their full names, and listen to and hum the sargam from Sa to upper Sa.',
      explanation: {
        hinglish:
          'Sargam ka naam hi pehle chaar swaron se bana hai: Sa, Re, Ga, Ma. Yeh Indian music ki "alphabet" hai. Saat swar hain:\n\nSa (Shadja), Re (Rishabh), Ga (Gandhar), Ma (Madhyam), Pa (Pancham), Dha (Dhaivat), Ni (Nishad). Aur phir Sa\' (taar Sa).\n\nJab hum sargam gaate hain, toh swaron ke naam lekar gaate hain: "Sa Re Ga Ma Pa Dha Ni Sa". Iska fayda yeh hai ki gaate-gaate aapka dimaag yaad rakhta hai ki kaunsa note kaunsa hai. Dheere-dheere naam aur awaaz ek saath jud jaate hain.\n\nIn swaron ko upar jaate hue gaana aaroh kehlata hai (Sa se Sa\' tak), aur neeche aate hue avroh (Sa\' se Sa tak). Aaj hum sirf sunenge aur dheere se gungunaayenge.\n\nEk baat aur: in saat ke alawa kuch swaron ke komal (ek semitone neeche) aur teevra (ek semitone upar) roop bhi hote hain. Jaise komal Re, teevra Ma. Woh hum aage seekhenge. Abhi sirf shuddh (natural) swar, jo kisi bhi Bollywood ya classical gaane ki neev hain.\n\nSargam roz thodi der sunne aur gaane se kaan aur gala dono taiyaar hote hain. Isse jaldbaazi mein mat gaaiye; dheema aur saaf, yahi asli shuruaat hai.',
        english:
          'The word sargam itself comes from the first four swars: Sa, Re, Ga, Ma. It is the alphabet of Indian music. The seven swars are:\n\nSa (Shadja), Re (Rishabh), Ga (Gandhar), Ma (Madhyam), Pa (Pancham), Dha (Dhaivat), Ni (Nishad), followed by Sa\' (upper Sa).\n\nWhen we sing sargam, we sing the names of the notes: "Sa Re Ga Ma Pa Dha Ni Sa". This is powerful because your mind learns which note is which while you sing. Over time, the name and the sound become linked.\n\nSinging the swars going up is called aaroh (Sa to Sa\'), and coming down is avroh (Sa\' to Sa). Today we will mainly listen and hum gently.\n\nOne more thing: besides these seven, some swars have komal (one semitone lower, flat) and teevra (one semitone higher, sharp) forms, such as komal Re and teevra Ma. We will meet those later. For now we use only the shuddh (natural) swars, which form the base of countless Bollywood and classical melodies.\n\nListening to and singing sargam a little every day trains both ear and voice. Do not rush it; slow and clean is the real beginning.',
        hindi:
          '"सरगम" शब्द ही पहले चार स्वरों से बना है: सा, रे, ग, म। यह भारतीय संगीत की वर्णमाला है। सात स्वर हैं:\n\nसा (षड्ज), रे (ऋषभ), ग (गांधार), म (मध्यम), प (पंचम), ध (धैवत), नि (निषाद), और उसके बाद सां (तार सा)।\n\nजब हम सरगम गाते हैं, तो स्वरों के नाम लेकर गाते हैं: "सा रे ग म प ध नि सां"। इसका फ़ायदा यह है कि गाते-गाते आपका दिमाग़ सीखता है कि कौन-सा नोट कौन-सा है। धीरे-धीरे नाम और आवाज़ आपस में जुड़ जाते हैं।\n\nस्वरों को ऊपर जाते हुए गाना आरोह कहलाता है (सा से सां तक), और नीचे आते हुए अवरोह (सां से सा तक)। आज हम ज़्यादातर सुनेंगे और धीरे से गुनगुनाएँगे।\n\nएक बात और: इन सात के अलावा कुछ स्वरों के कोमल (एक सेमिटोन नीचे) और तीव्र (एक सेमिटोन ऊपर) रूप भी होते हैं, जैसे कोमल रे और तीव्र म। वे हम आगे सीखेंगे। अभी हम सिर्फ़ शुद्ध स्वर लेंगे, जो अनगिनत बॉलीवुड और शास्त्रीय धुनों की नींव हैं।\n\nरोज़ थोड़ी देर सरगम सुनने और गाने से कान और आवाज़ दोनों तैयार होते हैं। जल्दबाज़ी मत कीजिए; धीमा और साफ़, यही असली शुरुआत है।',
      },
      whyItMatters:
        'Sargam is how Indian musicians think, write and practise melodies. Being able to name what you sing makes learning songs and ragas far faster later.',
      demos: [
        { kind: 'sequence', label: 'Aaroh: Sa Re Ga Ma Pa Dha Ni Sa\'', notes: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"], bpm: 60 },
        { kind: 'sequence', label: 'Avroh: Sa\' Ni Dha Pa Ma Ga Re Sa', notes: ["S'", 'N', 'D', 'P', 'm', 'G', 'R', 'S'], bpm: 60 },
        { kind: 'sequence', label: 'First three swars, slowly: Sa Re Ga', notes: ['S', 'R', 'G', '-', 'G', 'R', 'S'], bpm: 50 },
      ],
      guidedSteps: [
        'Play the aaroh demo and say the names softly along with it (speak, do not sing).',
        'Play the avroh demo and again say the names along with it.',
        'Turn on the Tanpura Drone. Play the "Sa Re Ga" demo and hum along very softly.',
        'Open the Sargam Player, set a slow tempo (around 50–60 bpm), and play Sa Re Ga Ga Re Sa. Sing the names gently.',
        'If any note feels unclear, replay it alone and hum it before singing the name.',
      ],
      independentPractice: {
        instructions:
          'With the Tanpura Drone on, use the Sargam Player to play Sa Re Ga Ma Pa slowly. Listen once, then sing the names along softly. Repeat 5 times. Stop if anything feels tight.',
        durationMin: 8,
        tool: 'sargam',
        pattern: ['S', 'R', 'G', 'm', 'P', '-', 'P', 'm', 'G', 'R', 'S'],
        bpm: 55,
      },
      mistakes: [
        { mistake: 'Singing the sargam too fast.', fix: 'Use a slow tempo. Accuracy first; speed comes much later.' },
        { mistake: 'Saying the names on one flat pitch.', fix: 'Each name has its own pitch. Listen to each note first, then match it.' },
        { mistake: 'Forcing the higher notes like Dha, Ni and Sa\'.', fix: 'Sing only the part that is comfortable; listen to the rest for now.' },
      ],
      quiz: [
        {
          question: 'What is the correct order of the shuddh swars?',
          options: ['Sa Ga Re Ma Pa Ni Dha', 'Sa Re Ga Ma Pa Dha Ni', 'Sa Re Ma Ga Pa Dha Ni', 'Re Sa Ga Ma Pa Dha Ni'],
          answerIndex: 1,
          explanation: 'The order is Sa Re Ga Ma Pa Dha Ni, then upper Sa.',
        },
        {
          question: 'What is the full name of Pa?',
          options: ['Pancham', 'Madhyam', 'Nishad', 'Dhaivat'],
          answerIndex: 0,
          explanation: 'Pa is Pancham, literally "the fifth" swar.',
        },
        {
          question: 'Singing the swars going up from Sa to upper Sa is called…',
          options: ['Avroh', 'Alaap', 'Aaroh', 'Taan'],
          answerIndex: 2,
          explanation: 'Aaroh is the ascending order; avroh is the descending order.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'With the drone on, sing Sa, Re and Ga one by one. Hold each softly for a couple of seconds. Being close (within about half a semitone) counts as a match.',
        targets: ['S', 'R', 'G'],
        minAttempts: 4,
        minSuccessPct: 50,
        toleranceCents: 50,
      },
      videoQueries: ['sa re ga ma pa dha ni sa for beginners slow', 'sargam kaise seekhe beginners hindi'],
      nextStep: 'Next, we connect sargam to Western note names and see why Sa can move.',
      estMinutes: 20,
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'l1-sargam-and-western-notes',
      level: 1,
      module: M_SARGAM,
      title: 'Movable Sa: Sargam and Western Notes',
      objective:
        'Understand that sargam is relative to a chosen Sa while Western note names (C, D, E…) are fixed pitches, and that Sa and Pa are achal (fixed) once Sa is chosen.',
      explanation: {
        hinglish:
          'Western music mein C, D, E, F, G, A, B fixed notes hain. C ka matlab hamesha ek hi pitch hai, chahe koi bhi gaaye. Lekin sargam relative hai. Sa koi fixed pitch nahi; Sa woh note hai jise aap "ghar" chunte ho. Baaki saare swar us Sa ke hisaab se apni jagah lete hain.\n\nMaan lijiye aapne Sa = C rakha. Toh Re = D, Ga = E, Ma = F, Pa = G, Dha = A, Ni = B. Agar kal aap Sa = D rakhein, toh Re = E, Ga = F#, Ma = G, Pa = A, Dha = B, Ni = C#. Naam wahi, pitch alag! Yeh bilkul Western "do re mi" jaisa hai, jahan "do" bhi move ho sakta hai.\n\nIsi wajah se harmonium wale poochte hain: "Aapka Sa kaunsa hai? Kaali chaar? Safed paanch?" Har singer apni awaaz ke hisaab se Sa chunta hai, aur gaana usi Sa par set hota hai.\n\nSa aur Pa ko achal swar kehte hain, yaani jo hilte nahi. Ek baar Sa chun liya, toh Sa aur Pa ke komal ya teevra roop nahi hote. Baaki swar (Re, Ga, Ma, Dha, Ni) ke roop badal sakte hain, jo aage seekhenge. Tanpura bhi zyadatar Sa aur Pa (ya kabhi Ma) par hi baja hota hai, isliye yeh do aapke sabse pakke saathi hain.',
        english:
          'In Western music, C, D, E, F, G, A and B are fixed notes. C always refers to the same pitch, no matter who sings. Sargam is different: it is relative. Sa is not a fixed pitch; Sa is whichever note you choose as "home", and all the other swars take their places relative to it.\n\nSuppose you choose Sa = C. Then Re = D, Ga = E, Ma = F, Pa = G, Dha = A, Ni = B. If tomorrow you choose Sa = D, then Re = E, Ga = F#, Ma = G, Pa = A, Dha = B, Ni = C#. Same names, different pitches! This is just like movable "do re mi" in Western solfège, where "do" can be any note.\n\nThat is why a harmonium player asks, "What is your Sa? Black four? White five?" Each singer chooses a Sa that suits their voice, and a song is set to that Sa.\n\nSa and Pa are called achal swars, meaning immovable. Once Sa is chosen, Sa and Pa have no komal or teevra versions. The other swars (Re, Ga, Ma, Dha, Ni) can have altered forms, which come later. The tanpura is usually tuned to Sa and Pa (sometimes Ma or Ni instead of Pa), so these two are your most stable reference points.',
        hindi:
          'पश्चिमी संगीत में C, D, E, F, G, A और B तय (fixed) नोट हैं। C का मतलब हमेशा एक ही पिच होती है, चाहे कोई भी गाए। सरगम अलग है: वह सापेक्ष (relative) है। सा कोई तय पिच नहीं; सा वह नोट है जिसे आप "घर" चुनते हैं, और बाक़ी सारे स्वर उसी सा के हिसाब से अपनी जगह लेते हैं।\n\nमान लीजिए आपने सा = C रखा। तो रे = D, ग = E, म = F, प = G, ध = A, नि = B। अगर कल आप सा = D रखें, तो रे = E, ग = F#, म = G, प = A, ध = B, नि = C#। नाम वही, पिच अलग! यह बिल्कुल पश्चिमी "do re mi" (movable do) जैसा है, जहाँ "do" कोई भी नोट हो सकता है।\n\nइसीलिए हारमोनियम बजाने वाले पूछते हैं: "आपका सा कौन-सा है? काली चार? सफ़ेद पाँच?" हर गायक अपनी आवाज़ के हिसाब से सा चुनता है, और गाना उसी सा पर सेट होता है।\n\nसा और प को अचल स्वर कहते हैं, यानी जो हिलते नहीं। एक बार सा चुन लिया, तो सा और प के कोमल या तीव्र रूप नहीं होते। बाक़ी स्वर (रे, ग, म, ध, नि) के बदले हुए रूप हो सकते हैं, जो आगे आएँगे। तानपुरा आमतौर पर सा और प पर मिलाया जाता है (कभी-कभी प की जगह म या नि), इसलिए ये दोनों आपके सबसे पक्के सहारे हैं।',
      },
      whyItMatters:
        'Because Sa is movable, you can sing every exercise and song in a key that fits your voice instead of straining to match someone else\'s pitch.',
      traditionNote:
        'Matching Sa = C to Re = D and so on assumes equal-tempered tuning, as on a keyboard. Hindustani singers may tune certain swars very slightly differently depending on the raga, but the relative-Sa idea is exactly the same.',
      demos: [
        { kind: 'drone', label: 'Tanpura Drone on your Sa (Sa and Pa sounding together)' },
        { kind: 'sequence', label: 'Sargam on your current Sa', notes: ['S', 'R', 'G', 'm', 'P', 'D', 'N', "S'"], bpm: 70 },
        { kind: 'compare', label: 'Sa and Pa: the two achal swars', a: 'S', b: 'P' },
        { kind: 'sequence', label: 'Sa Pa Sa\': the frame of the scale', notes: ['S', '-', 'P', '-', "S'"], bpm: 50 },
      ],
      guidedSteps: [
        'Open the Virtual Keyboard with Sa set to C. Play C D E F G A B C and notice the keyboard labels them Sa Re Ga Ma Pa Dha Ni Sa.',
        'Change your Sa in settings to D (or any other note). Play the sargam demo again: the tune sounds the same, just higher or lower.',
        'On the Virtual Keyboard, find what Re and Pa are now. Say the Western names aloud.',
        'Switch your Sa back to whatever is most comfortable for you.',
        'Turn on the Tanpura Drone and hum Sa, then Pa, then Sa\' if comfortable. Feel how stable Sa and Pa sound with the drone.',
      ],
      independentPractice: {
        instructions:
          'On the Virtual Keyboard, try three different Sa choices and play Sa Re Ga Ma Pa from each. Notice that the melody keeps its shape. Then, with the Tanpura Drone on, hum Sa and Pa gently a few times each.',
        durationMin: 8,
        tool: 'keyboard',
        pattern: ['S', 'R', 'G', 'm', 'P'],
      },
      mistakes: [
        { mistake: 'Thinking Sa always equals C.', fix: 'Sa equals whatever note you choose. C is only one possible Sa.' },
        { mistake: 'Copying a singer\'s Sa that is too high or low for you.', fix: 'Choose your own comfortable Sa; you can transpose any song to it.' },
        { mistake: 'Expecting Pa to have komal or teevra forms.', fix: 'Sa and Pa are achal. Other swars have variants, which you will learn later.' },
      ],
      quiz: [
        {
          question: 'If Sa = C, what is Pa?',
          options: ['F', 'A', 'E', 'G'],
          answerIndex: 3,
          explanation: 'Sa Re Ga Ma Pa = C D E F G, so Pa is G.',
        },
        {
          question: 'If Sa = D, what is Ga (shuddh)?',
          options: ['F#', 'E', 'F', 'G'],
          answerIndex: 0,
          explanation: 'Shuddh Ga is 4 semitones above Sa. Four semitones above D is F#.',
        },
        {
          question: 'Which two swars are achal (fixed once Sa is chosen)?',
          options: ['Re and Ga', 'Sa and Pa', 'Ma and Ni', 'Dha and Ni'],
          answerIndex: 1,
          explanation: 'Sa and Pa have no komal or teevra forms; they are achal swars.',
        },
        {
          question: 'Why is sargam called relative?',
          options: ['Because it changes every day by itself', 'Because each swar is defined in relation to the chosen Sa', 'Because only relatives can sing it'],
          answerIndex: 1,
          explanation: 'Swars are positions relative to Sa; move Sa and they all move together.',
        },
      ],
      videoQueries: ['sargam vs western notes sa re ga ma c d e f explained', 'scale change harmonium safed teen kaali paanch meaning'],
      nextStep: 'Next, we get the body ready: a comfortable singing posture.',
      estMinutes: 20,
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'l1-comfortable-posture',
      level: 1,
      module: M_BODY,
      title: 'A Comfortable Singing Posture',
      objective:
        'Set up a relaxed, balanced posture for singing, whether sitting cross-legged, on a chair or standing.',
      explanation: {
        hinglish:
          'Achha posture ka matlab "fauji ki tarah akad ke baithna" nahi hai. Matlab hai aisa balanced aur relaxed sharir jismein saans aaraam se aa-ja sake aur gala free rahe.\n\nIndian tradition mein zyadatar log zameen par paalthi maar ke (sukhasan) baith ke riyaz karte hain. Kursi par baithna ya khade hona bhi bilkul theek hai. Jo bhi chuniye, yeh cheezein dekhiye:\n\nRidh ki haddi (spine) seedhi par sakht nahi, jaise sir ke upar se ek dhaaga halka sa kheench raha ho. Kandhe neeche aur dheele, kaanon ki taraf utthe hue nahi. Chhaati halki khuli. Gardan seedhi; thuddi (chin) na bahut upar, na bahut neeche. Jab hum oonchi note ke liye thuddi upar karte hain, gala khinchta hai. Jabda (jaw) dheela.\n\nKursi par baithein toh pair zameen par flat, peeth kursi se thodi door. Khade hon toh pair kandhon ki chaudai par, ghutne lock nahi.\n\nPhone ya lyrics dekhte waqt sir neeche jhuk jaata hai, isliye screen ko aankh ke level par rakhiye. Ek aakhri baat: posture ek baar set karke bhool mat jaaiye. Beech-beech mein check kariye ki kandhe phir se upar toh nahi aa gaye.',
        english:
          'Good posture does not mean sitting stiffly like a soldier. It means a balanced, relaxed body in which breath can move freely and the throat stays free.\n\nIn Indian tradition, many people practise sitting cross-legged on the floor (sukhasan). Sitting on a chair or standing is equally fine. Whichever you choose, check these points:\n\nThe spine is tall but not rigid, as if a thread were gently lifting the top of your head. Shoulders are down and loose, not raised towards your ears. The chest is gently open. The neck is long; the chin neither lifted nor tucked down. Lifting the chin to reach a high note stretches and tenses the throat. The jaw is loose.\n\nOn a chair, keep your feet flat on the floor and sit slightly forward, away from the backrest. Standing, keep your feet about shoulder-width apart with knees unlocked.\n\nLooking down at a phone for lyrics drops the head, so raise your screen to eye level. Finally, posture is not something you set once and forget. Check in during practice: shoulders often creep up without you noticing.',
        hindi:
          'अच्छे पोस्चर (posture) का मतलब फ़ौजी की तरह अकड़कर बैठना नहीं है। मतलब है ऐसा संतुलित और ढीला शरीर, जिसमें साँस आराम से आ-जा सके और गला खुला रहे।\n\nभारतीय परंपरा में बहुत लोग ज़मीन पर पालथी मारकर (सुखासन) रियाज़ करते हैं। कुर्सी पर बैठना या खड़े होना भी बिल्कुल ठीक है। जो भी चुनें, ये बातें देखिए:\n\nरीढ़ की हड्डी लंबी हो पर सख़्त नहीं, जैसे सिर के ऊपर से कोई धागा हल्के से खींच रहा हो। कंधे नीचे और ढीले हों, कानों की तरफ़ उठे हुए नहीं। छाती हल्की खुली हो। गर्दन लंबी हो; ठुड्डी न ऊपर उठी, न नीचे दबी। ऊँचे नोट के लिए ठुड्डी उठाने से गला खिंचता और कसता है। जबड़ा ढीला रहे।\n\nकुर्सी पर बैठें तो पैर ज़मीन पर सपाट रखें और पीठ टिकाने के बजाय थोड़ा आगे की ओर बैठें। खड़े हों तो पैर लगभग कंधों की चौड़ाई पर हों और घुटने लॉक न हों।\n\nफ़ोन पर बोल (lyrics) देखते समय सिर नीचे झुक जाता है, इसलिए स्क्रीन को आँखों के स्तर पर रखिए। आख़िरी बात: पोस्चर एक बार सेट करके भूल जाने की चीज़ नहीं है। अभ्यास के बीच-बीच में जाँचते रहिए; कंधे अक्सर बिना पता चले ऊपर चढ़ जाते हैं।',
      },
      whyItMatters:
        'Tension in the shoulders, neck or jaw travels straight to the voice. A relaxed, balanced body makes breathing easier and pitch steadier with no extra effort.',
      traditionNote:
        'Classical riyaz is traditionally done seated on the floor; Western vocal training is usually done standing. Both are valid; choose what lets you stay relaxed and alert.',
      demos: [
        { kind: 'drone', label: 'Tanpura Drone to settle into while you set your posture' },
        { kind: 'note', label: 'Sa to hum once your posture is set', swara: 'S', durationSec: 4 },
      ],
      guidedSteps: [
        'Choose your position: cross-legged on the floor, on a chair with feet flat, or standing.',
        'Roll your shoulders up, back and let them drop. Repeat twice.',
        'Imagine a thread gently lifting the top of your head. Let your neck lengthen without lifting your chin.',
        'Open and close your mouth gently a few times to release your jaw.',
        'Turn on the Tanpura Drone and hum Sa softly. Notice whether anything tightens; if so, release it and hum again.',
        'Glance at a mirror while humming to check your posture.',
      ],
      independentPractice: {
        instructions:
          'Before every practice session this week, take one minute to set your posture using the checklist. Then hum Sa with the Tanpura Drone for a minute, checking shoulders, jaw and chin.',
        durationMin: 3,
        tool: 'drone',
      },
      mistakes: [
        { mistake: 'Lifting the chin to reach higher notes.', fix: 'Keep the chin level. Pitch comes from the vocal folds, not from pointing your head up.' },
        { mistake: 'Sitting rigidly upright with locked muscles.', fix: 'Aim for tall and relaxed, not stiff. You should be able to breathe easily.' },
        { mistake: 'Slumping over a phone to read lyrics.', fix: 'Raise the phone to eye level using a stand or a stack of books.' },
      ],
      quiz: [
        {
          question: 'Which describes good singing posture?',
          options: ['Stiff and fully tensed', 'Tall but relaxed, shoulders down, chin level', 'Slumped forward', 'Chin lifted high'],
          answerIndex: 1,
          explanation: 'Balanced and relaxed lets breath and the throat work freely.',
        },
        {
          question: 'Why avoid lifting the chin for high notes?',
          options: ['It looks rude', 'It stretches and tenses the throat', 'It makes notes lower'],
          answerIndex: 1,
          explanation: 'Tilting the head back tightens the neck and larynx area, making singing harder.',
        },
        {
          question: 'Is sitting cross-legged on the floor acceptable for practice?',
          options: ['No, you must always stand', 'Only for experts', 'Yes, it is the traditional riyaz posture'],
          answerIndex: 2,
          explanation: 'Sitting cross-legged is common in Hindustani practice; standing or chair sitting are also fine.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Tick these honestly after a session. Posture cannot be measured by a microphone, so this is self-reported.',
        items: [
          'I can hum Sa with my shoulders relaxed and down.',
          'My chin stayed level, not lifted, while humming.',
          'My jaw felt loose and my breathing felt easy in this position.',
        ],
      },
      videoQueries: ['correct posture for singing beginners', 'riyaz karne ka sahi posture baithne ka tarika'],
      nextStep: 'Next, we learn natural, relaxed breathing for singing.',
      estMinutes: 12,
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'l1-natural-breathing',
      level: 1,
      module: M_BODY,
      title: 'Natural Breathing for Singing',
      objective:
        'Breathe low and relaxed without over-filling, and release air steadily using a gentle hiss exercise.',
      explanation: {
        hinglish:
          'Gaane ke liye saans koi ajeeb ya mushkil cheez nahi hai. Ek chhote bachche ko sote hue dekhiye: uska pet aaraam se upar-neeche hota hai, kandhe nahi hilte. Wahi natural, neeche wali saans hamein chahiye.\n\nJab aap saans andar lete ho, toh pet aur kamar ke aas-paas ka hissa aaraam se bahar ki taraf failta hai, kyunki diaphragm (fefdon ke neeche ki muscle) neeche jaata hai. Kandhe aur chhaati upar uthana zaroori nahi. Jab saans bahar jaati hai, pet dheere-dheere andar aata hai.\n\nDo galtiyan bahut aam hain. Pehli, bahut zyada saans bhar lena, itna ki sharir tight ho jaaye. Asal mein zaroorat se thoda hi zyada kaafi hai. Doosri, saans ko gale mein rok lena. Saans aur awaaz ek saath, behte hue chalne chahiye.\n\nAaj ka main exercise hai hiss: naak se aaraam se saans lijiye, phir daanton ke beech se halki "sssss" awaaz ke saath dheere-dheere saans chhodiye, jaise taayar se dheere hawa nikal rahi ho. Hiss ek jaisa, smooth rahe. Seconds ginne ke liye Metronome chala sakte hain. Shuruaat mein 10-15 second bhi achha hai. Competition nahi hai; bas smooth aur aaraam se. Agar chakkar aaye, ruk jaaiye aur normal saans lijiye.',
        english:
          'Breathing for singing is not strange or complicated. Watch a small child sleeping: the belly rises and falls easily and the shoulders stay still. That natural, low breath is what we want.\n\nWhen you breathe in, the area around your belly and lower ribs expands gently outward because the diaphragm, the large muscle under your lungs, moves down. You do not need to lift your shoulders or puff up your chest. As you breathe out, the belly comes back in gradually.\n\nTwo mistakes are very common. The first is over-filling: gulping so much air that the body becomes tight. You only need a little more than a normal breath. The second is holding the breath in the throat before singing. Breath and sound should flow together.\n\nToday\'s main exercise is the hiss: breathe in comfortably, then release the air slowly through your teeth on a soft, even "sssss", like air leaking slowly from a tyre. Keep the hiss smooth and steady. You can run the Metronome to count seconds. At first, 10 to 15 seconds is perfectly good. It is not a competition; aim for smooth and easy. If you feel dizzy, stop and breathe normally.',
        hindi:
          'गाने के लिए साँस लेना कोई अजीब या मुश्किल चीज़ नहीं है। किसी छोटे बच्चे को सोते हुए देखिए: उसका पेट आराम से ऊपर-नीचे होता है और कंधे नहीं हिलते। हमें वही स्वाभाविक, नीचे वाली साँस चाहिए।\n\nजब आप साँस अंदर लेते हैं, तो पेट और निचली पसलियों के आसपास का हिस्सा हल्के से बाहर की ओर फैलता है, क्योंकि डायाफ़्राम (diaphragm), यानी फेफड़ों के नीचे की बड़ी मांसपेशी, नीचे जाता है। कंधे उठाने या छाती फुलाने की ज़रूरत नहीं। साँस बाहर जाते समय पेट धीरे-धीरे वापस अंदर आता है।\n\nदो ग़लतियाँ बहुत आम हैं। पहली, ज़रूरत से ज़्यादा साँस भर लेना, इतनी कि शरीर कस जाए। आपको सामान्य साँस से बस थोड़ी ज़्यादा चाहिए। दूसरी, गाने से पहले साँस को गले में रोक लेना। साँस और आवाज़ साथ-साथ बहनी चाहिए।\n\nआज का मुख्य अभ्यास है "हिस" (hiss): आराम से साँस लीजिए, फिर दाँतों के बीच से हल्की, एक-सी "स्स्स्स" आवाज़ के साथ धीरे-धीरे हवा छोड़िए, जैसे टायर से धीरे-धीरे हवा निकल रही हो। हिस को एक-सा और स्मूद रखिए। सेकंड गिनने के लिए मेट्रोनोम (Metronome) चला सकते हैं। शुरुआत में 10 से 15 सेकंड भी बहुत अच्छा है। यह कोई मुक़ाबला नहीं; बस स्मूद और आराम से। अगर चक्कर आए, तो रुक जाइए और सामान्य साँस लीजिए।',
      },
      whyItMatters:
        'Steady breath gives steady pitch. Many wobbly or cracking notes in beginners come from breath running out unevenly or being held tightly in the throat.',
      traditionNote:
        'Terms like "diaphragmatic breathing" are a simplification; breathing involves many muscles working together. The practical goal, relaxed low breathing with steady release, is shared by Hindustani and Western teachers alike.',
      demos: [
        { kind: 'taal', label: 'Steady pulse to count your hiss (Keharwa, slow)', taal: 'keharwa', bpm: 60, cycles: 4 },
        { kind: 'note', label: 'A long, steady Sa: the kind of evenness we want from breath', swara: 'S', durationSec: 6 },
      ],
      guidedSteps: [
        'Sit or stand in your comfortable posture. Place one hand on your belly and one on your upper chest.',
        'Breathe in slowly through the nose. Let the lower hand move outward while the upper hand stays mostly still.',
        'Breathe out slowly through the mouth and feel the belly return. Repeat 4 times.',
        'Open the Metronome & Taal at 60 bpm. Breathe in for 4 beats without over-filling.',
        'Hiss "sssss" evenly and count how many beats it lasts. Do not squeeze out the very last bit of air.',
        'Rest with 2 normal breaths, then repeat the hiss 3 more times.',
        'Finally, turn on the Tanpura Drone and hum Sa on the same steady breath.',
      ],
      independentPractice: {
        instructions:
          'Daily: 4 slow belly breaths, then 4 hisses with the metronome at 60 bpm. Note your comfortable hiss length in the Recording Journal. Do not chase bigger numbers; aim for an even sound.',
        durationMin: 6,
        tool: 'metronome',
        bpm: 60,
      },
      mistakes: [
        { mistake: 'Lifting the shoulders when breathing in.', fix: 'Keep shoulders down; let the belly and lower ribs expand instead.' },
        { mistake: 'Gulping as much air as possible.', fix: 'Take a comfortable breath. Over-filling causes tension and pushes the air out too fast.' },
        { mistake: 'Squeezing out every last bit of air.', fix: 'Stop the hiss while it is still comfortable, then breathe in naturally.' },
      ],
      quiz: [
        {
          question: 'When you breathe in for singing, what should mainly expand?',
          options: ['The shoulders', 'The belly and lower ribs area', 'The neck', 'Nothing should move'],
          answerIndex: 1,
          explanation: 'As the diaphragm moves down, the belly and lower ribs gently expand.',
        },
        {
          question: 'What is the goal of the hiss exercise?',
          options: ['To hiss as loudly as possible', 'To release air slowly and evenly', 'To hold the breath', 'To make the throat tight'],
          answerIndex: 1,
          explanation: 'An even, controlled release of air is the foundation for steady notes.',
        },
        {
          question: 'Is it better to take the biggest possible breath before singing?',
          options: ['Yes, always', 'No, a comfortable breath without over-filling is better', 'Only for low notes'],
          answerIndex: 1,
          explanation: 'Over-filling creates tension. A relaxed, sufficient breath works best.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Breath control is self-reported here. Tick only what is true for you today.',
        items: [
          'I can breathe in with my shoulders staying down.',
          'I can do a smooth, even hiss for at least 10 seconds without strain.',
          'I did not feel dizzy or tight while practising.',
        ],
      },
      videoQueries: ['breathing exercises for singing beginners hiss exercise', 'gaane ke liye saans kaise le hindi'],
      nextStep: 'Next, we put breath and voice together with gentle warm-ups.',
      estMinutes: 15,
      safetyNote: 'If you feel light-headed at any point, stop, sit down and breathe normally. Breathing exercises should never cause dizziness or strain.',
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'l1-gentle-warmups',
      level: 1,
      module: M_BODY,
      title: 'Gentle Vocal Warm-ups',
      objective:
        'Learn a short, safe warm-up routine: yawn-sigh, humming, lip trills and small sirens within a comfortable range.',
      explanation: {
        hinglish:
          'Jaise khelne se pehle stretching karte hain, waise hi gaane se pehle awaaz ko halke se jagana chahiye. Warm-up ka matlab hai muscles ko dheere se, bina zor ke, kaam ke liye taiyaar karna.\n\nHamara chhota routine (5-7 minute):\n\n1. Yawn-sigh: ek aaraam ki ubaasi (yawn) lijiye aur phir upar se neeche ek dheeli "haaah" sigh chhodiye. Isse gala khulta hai aur tension jaata hai.\n\n2. Humming: honth band, daant thode alag, "mmm" par Sa ke aas-paas gungunaaiye. Honthon par jhanjhanahat (buzz) mehsoos honi chahiye.\n\n3. Lip trill: honthon ko dheela chhod ke unke beech se hawa chhodiye, jaise bachche "brrr" karte hain ya motorcycle ki awaaz. Agar honth nahi hil rahe, toh ungliyon se gaalon ko halka sa sahara dijiye. Phir trill karte hue halka sa sur upar-neeche le jaaiye.\n\n4. Sirens: "ng" (jaise "sing" ke end mein) ya "oo" par neeche se upar aur wapas neeche halki slide, jaise door se aati ambulance. Sirf utna jitna aaraam se jaaye.\n\nYaad rakhiye: warm-up ka volume dheema rehna chahiye. Agar kuch bhi chubhe, gala khurdura lage ya dard ho, toh ruk jaaiye. Warm-up thakaane ke liye nahi, jagaane ke liye hai.',
        english:
          'Just as athletes stretch before playing, singers should gently wake up the voice before singing. Warming up means preparing the muscles slowly and without force.\n\nOur short routine (5 to 7 minutes):\n\n1. Yawn-sigh: take a comfortable yawn, then release a loose "haaah" sigh from high to low. This opens the throat and releases tension.\n\n2. Humming: lips closed, teeth slightly apart, hum "mmm" around your Sa. You should feel a buzz on your lips.\n\n3. Lip trill: let your lips relax and blow air through them so they flutter, like a child imitating a motorbike: "brrr". If your lips will not flutter, gently support your cheeks with your fingertips. Then let the pitch move gently up and down while trilling.\n\n4. Sirens: on "ng" (as at the end of "sing") or "oo", slide smoothly from low to a little higher and back down, like a distant ambulance. Go only as far as feels easy.\n\nRemember: warm-ups should be quiet. If anything scratches, feels rough or hurts, stop. A warm-up is meant to wake the voice up, not to tire it out.',
        hindi:
          'जैसे खिलाड़ी खेलने से पहले स्ट्रेचिंग करते हैं, वैसे ही गायक को गाने से पहले आवाज़ को धीरे से जगाना चाहिए। वॉर्म-अप का मतलब है मांसपेशियों को धीरे-धीरे, बिना ज़ोर लगाए, काम के लिए तैयार करना।\n\nहमारा छोटा रूटीन (5 से 7 मिनट):\n\n1. जम्हाई-आह (yawn-sigh): आराम से एक जम्हाई लीजिए, फिर ऊपर से नीचे की ओर एक ढीली "हाऽऽह" छोड़िए। इससे गला खुलता है और तनाव निकलता है।\n\n2. गुनगुनाना (humming): होंठ बंद, दाँत थोड़े अलग, अपने सा के आसपास "म्म्म" गुनगुनाइए। होंठों पर झनझनाहट महसूस होनी चाहिए।\n\n3. लिप ट्रिल (lip trill): होंठ ढीले छोड़कर उनके बीच से हवा फूँकिए ताकि वे फड़फड़ाएँ, जैसे बच्चे मोटरसाइकिल की नक़ल में "ब्र्र्र" करते हैं। अगर होंठ नहीं फड़फड़ा रहे, तो उँगलियों से गालों को हल्का सहारा दीजिए। फिर ट्रिल करते हुए सुर को हल्के से ऊपर-नीचे ले जाइए।\n\n4. सायरन (sirens): "ङ" (जैसे अंग्रेज़ी "sing" के आख़िर में) या "ऊ" पर नीचे से थोड़ा ऊपर और वापस नीचे स्मूद स्लाइड कीजिए, जैसे दूर से आती एम्बुलेंस। सिर्फ़ उतना ही जाइए जितना आसान लगे।\n\nयाद रखिए: वॉर्म-अप धीमी आवाज़ में होना चाहिए। अगर कुछ भी चुभे, खुरदुरा लगे या दर्द हो, तो रुक जाइए। वॉर्म-अप आवाज़ को जगाने के लिए है, थकाने के लिए नहीं।',
      },
      whyItMatters:
        'Warm-ups reduce the risk of strain, improve coordination between breath and voice, and make your first notes of practice smoother and more in tune.',
      traditionNote:
        'Lip trills and sirens come from Western vocal pedagogy. Traditional Hindustani riyaz often begins with long, steady notes on Sa (Sa-sadhana), and some teachers add slow kharaj riyaz, long notes in the low mandra saptak. Both are useful; this app combines them gently.',
      demos: [
        { kind: 'note', label: 'Hum on Sa', swara: 'S', durationSec: 5 },
        { kind: 'glide', label: 'A small siren shape: Sa up to Ga and back', from: 'S', to: 'G', durationSec: 2 },
        { kind: 'glide', label: 'A slightly larger siren: Sa up to Pa', from: 'S', to: 'P', durationSec: 3 },
        { kind: 'glide', label: 'Sigh shape: from Pa down to Sa', from: 'P', to: 'S', durationSec: 3 },
      ],
      guidedSteps: [
        'Set your posture and take 2 relaxed breaths.',
        'Do 3 yawn-sighs, letting the sound fall gently from mid to low.',
        'Turn on the Tanpura Drone. Hum "mmm" on Sa for 3 breaths, feeling the buzz on your lips.',
        'Do 3 lip trills on one comfortable pitch, then 3 lip trills that slide up and down a little.',
        'Play the "Sa up to Ga" glide demo and copy it on "ng" or "oo" 3 times.',
        'If comfortable, copy the "Sa up to Pa" glide 3 times. Skip it if it feels high.',
        'Finish with 2 easy hums on Sa.',
      ],
      independentPractice: {
        instructions:
          'Do this routine before every practice session: 3 yawn-sighs, 3 hums on Sa, 6 lip trills, 6 small sirens. Keep the volume soft. Use the Tanpura Drone for the hums.',
        durationMin: 6,
        tool: 'drone',
      },
      mistakes: [
        { mistake: 'Warming up loudly.', fix: 'Warm-ups should be soft and easy. Volume comes later.' },
        { mistake: 'Making sirens too wide too soon.', fix: 'Start small (Sa to Ga) and widen only if it feels effortless.' },
        { mistake: 'Giving up on lip trills because the lips do not flutter.', fix: 'Support your cheeks with your fingertips and use a little more steady air. Humming also works if trills are hard.' },
      ],
      quiz: [
        {
          question: 'What is the main purpose of a warm-up?',
          options: ['To tire the voice', 'To gently prepare the voice and reduce strain', 'To sing as high as possible', 'To show off'],
          answerIndex: 1,
          explanation: 'Warm-ups gently wake up the muscles and coordinate breath and voice.',
        },
        {
          question: 'If your lips will not flutter during a lip trill, you can…',
          options: ['Push harder from the throat', 'Gently support your cheeks with your fingertips', 'Stop singing forever'],
          answerIndex: 1,
          explanation: 'Supporting the cheeks reduces lip tension and helps the flutter start.',
        },
        {
          question: 'How loud should warm-ups usually be?',
          options: ['As loud as possible', 'Soft and comfortable', 'Whispered only'],
          answerIndex: 1,
          explanation: 'Soft, easy sound is safest. Whispering is actually not restful for the voice either.',
        },
        {
          question: 'If something scratches or hurts during a warm-up, you should…',
          options: ['Continue to build strength', 'Stop and rest', 'Sing louder to clear it'],
          answerIndex: 1,
          explanation: 'Pain or scratchiness is a signal to stop. Never sing through pain.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Warm-ups are about comfort, which only you can feel. Tick honestly.',
        items: [
          'I completed yawn-sighs, hums, lip trills and small sirens.',
          'Everything stayed soft and nothing hurt or scratched.',
          'My voice felt the same or easier afterwards, not tired.',
        ],
      },
      videoQueries: ['gentle vocal warm up for beginners lip trills humming', 'singing se pehle warm up kaise kare hindi'],
      nextStep: 'Next, we learn how to look after your voice and recognise warning signs.',
      estMinutes: 12,
      safetyNote: 'Never sing through pain. If a warm-up causes discomfort, scratchiness or pain, stop and rest your voice.',
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'l1-vocal-care',
      level: 1,
      module: M_BODY,
      title: 'Caring for Your Voice',
      objective:
        'Know daily habits that keep the voice healthy and the warning signs that mean you should stop and get medical advice.',
      explanation: {
        hinglish:
          'Aapki vocal folds bahut naazuk hain aur aapki poori zindagi kaam aani hain, isliye unka khayal rakhna riyaz ka hissa hai.\n\nPaani: din bhar thoda-thoda paani peejiye. Vocal folds ko andar se namee (hydration) chahiye. Gaate waqt saath mein paani rakhiye. Bahut thanda paani zaroori nahi; normal ya halka gunguna theek hai. Bhaap (steam) lena bhi kai logon ko aaraam deta hai.\n\nAaraam: chhote sessions behtar hain. Shuruaat mein 15-20 minute ka riyaz, beech mein break ke saath, kaafi hai. Achhi neend awaaz ke liye bahut zaroori hai. Shor mein chillaana, ghanton tak zor se baat karna, aur gala saaf karne ke liye baar-baar khaansna (throat clearing) awaaz ko thakaate hain. Gala saaf karne ki jagah ek ghoont paani ya halki si nigalna try kariye.\n\nKhatre ke signal: gaate waqt ya baad mein dard; awaaz baith jaana (hoarseness) jo aaraam ke baad bhi lagbhag do hafte (2 weeks) mein theek na ho; awaaz achanak chali jaana; ya gaate waqt kuch atakne jaisa lagna. Aisa ho toh gaana band kariye aur awaaz ko aaraam dijiye. Agar hoarseness lagbhag do hafte se zyada rahe, toh doctor ya ENT specialist ko dikhaaiye; achanak awaaz chali jaaye, ya nigalne ya saans lene mein takleef ho, toh intezaar mat kariye, jaldi dikhaaiye. Dard ke saath gaana kabhi "practice" nahi hota.\n\nYeh app medical advice nahi deti; koi bhi doubt ho toh doctor se poochiye.',
        english:
          'Your vocal folds are delicate and need to last you a lifetime, so caring for them is part of practice.\n\nWater: sip water throughout the day. Vocal folds need hydration from the inside. Keep water near you while practising. It does not need to be ice-cold; room temperature or slightly warm is fine. Many people also find steam inhalation soothing.\n\nRest: short sessions are better. At first, 15 to 20 minutes of practice with breaks is plenty. Good sleep matters a lot for the voice. Shouting over noise, talking loudly for hours, and frequent throat clearing all tire the voice. Instead of clearing your throat, try a sip of water or a gentle swallow.\n\nWarning signs: pain while or after singing; hoarseness that does not clear up with rest; sudden loss of voice; or a feeling of something catching or straining. If any of these happen, stop singing and rest your voice. If hoarseness lasts more than about two weeks, see a doctor or an ENT (ear, nose and throat) specialist; for sudden voice loss, or pain or difficulty swallowing or breathing, do not wait, get checked promptly. Singing through pain is never "good practice".\n\nThis app does not give medical advice; if you are ever unsure, ask a doctor.',
        hindi:
          'आपके वोकल फ़ोल्ड्स नाज़ुक हैं और इन्हें पूरी ज़िंदगी चलना है, इसलिए इनकी देखभाल भी रियाज़ का हिस्सा है।\n\nपानी: दिन भर थोड़ा-थोड़ा पानी पीते रहिए। वोकल फ़ोल्ड्स को अंदर से नमी (hydration) चाहिए। अभ्यास करते समय पानी पास रखिए। बर्फ़ जैसा ठंडा होना ज़रूरी नहीं; सामान्य या हल्का गुनगुना ठीक है। बहुत लोगों को भाप लेने से भी आराम मिलता है।\n\nआराम: छोटे सेशन बेहतर हैं। शुरुआत में बीच में ब्रेक के साथ 15 से 20 मिनट का अभ्यास काफ़ी है। अच्छी नींद आवाज़ के लिए बहुत ज़रूरी है। शोर में चिल्लाना, घंटों ज़ोर से बात करना और बार-बार गला साफ़ करना (खखारना) आवाज़ को थकाते हैं। गला साफ़ करने की जगह पानी का एक घूँट या हल्का-सा निगलना आज़माइए।\n\nख़तरे के संकेत: गाते समय या बाद में दर्द; आवाज़ बैठ जाना (hoarseness) जो आराम से ठीक न हो; अचानक आवाज़ चली जाना; या गाते समय कुछ अटकने या खिंचने जैसा लगना। ऐसा हो तो गाना बंद कीजिए और आवाज़ को आराम दीजिए। अगर आवाज़ लगभग दो हफ़्ते से ज़्यादा बैठी रहे, तो डॉक्टर या ENT (कान, नाक, गला) विशेषज्ञ को दिखाइए; अचानक आवाज़ चली जाए, या निगलने या साँस लेने में दर्द या तकलीफ़ हो, तो इंतज़ार मत कीजिए, जल्दी जाँच कराइए। दर्द के साथ गाना कभी "अच्छा अभ्यास" नहीं होता।\n\nयह ऐप चिकित्सा सलाह नहीं देता; कभी भी शक हो तो डॉक्टर से पूछिए।',
      },
      whyItMatters:
        'Steady progress needs a healthy voice. A few days of rest at the right time can prevent weeks of trouble.',
      demos: [
        { kind: 'note', label: 'A gentle, easy Sa: the effort level to aim for', swara: 'S', durationSec: 4 },
        { kind: 'drone', label: 'Tanpura Drone for a calm, short cool-down hum' },
      ],
      guidedSteps: [
        'Fill a water bottle and keep it beside your practice spot.',
        'Decide your session length for this week: 15–20 minutes, with a short break in the middle.',
        'Notice how often you clear your throat today. Each time, try a sip of water or a swallow instead.',
        'At the end of practice, cool down with 1 minute of soft humming on Sa with the Tanpura Drone.',
        'Write a quick note in the Recording Journal about how your voice felt (fresh, tired, scratchy).',
      ],
      independentPractice: {
        instructions:
          'For one week, after each practice, record one sentence of speech and a short hum in the Recording Journal and note how your voice feels. This builds awareness of what is normal for you, so you notice early if something changes.',
        durationMin: 3,
        tool: 'recorder',
      },
      mistakes: [
        { mistake: 'Practising for hours on the first days.', fix: 'Keep sessions short and regular. Daily 15–20 minutes beats one long session.' },
        { mistake: 'Singing through a sore or hoarse throat.', fix: 'Rest the voice. If hoarseness lasts more than about two weeks, see a doctor or ENT.' },
        { mistake: 'Whispering a lot to "save" the voice.', fix: 'Forced whispering can strain the voice too. Rest means quiet, or gentle normal speech.' },
        { mistake: 'Habitual throat clearing.', fix: 'Swallow or sip water instead; repeated clearing irritates the vocal folds.' },
      ],
      quiz: [
        {
          question: 'Your throat hurts while singing. What should you do?',
          options: ['Push through it to get stronger', 'Stop and rest; see a doctor if it does not settle', 'Sing higher', 'Drink ice water and continue'],
          answerIndex: 1,
          explanation: 'Pain is a warning sign. Stop, rest, and seek medical advice if it persists.',
        },
        {
          question: 'Which habit is gentlest for the voice?',
          options: ['Frequent throat clearing', 'Shouting over loud music', 'Sipping water through the day', 'Long practice with no breaks'],
          answerIndex: 2,
          explanation: 'Hydration supports healthy vocal folds; the others tire or irritate them.',
        },
        {
          question: 'Who should you see for persistent hoarseness or voice loss?',
          options: ['A doctor or ENT specialist', 'Nobody, it always goes away', 'A dentist'],
          answerIndex: 0,
          explanation: 'An ENT (ear, nose and throat) specialist is the right expert for voice problems.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'These are habits, so this check is self-reported.',
        items: [
          'I keep water nearby when I practise.',
          'I keep my sessions short with breaks.',
          'I know the warning signs (pain, lasting hoarseness, voice loss) and will stop and seek advice if they appear.',
        ],
      },
      videoQueries: ['vocal health tips for singers hydration rest', 'awaaz ki dekhbhal singers ke liye tips hindi'],
      nextStep: 'Now your body is ready. Next, we find your own comfortable Sa.',
      estMinutes: 10,
      safetyNote:
        'Stop singing if you feel pain. Hoarseness lasting more than about two weeks should be checked by a doctor or ENT specialist; sudden loss of voice, or pain or difficulty when swallowing or breathing, should be checked promptly. This app does not replace medical advice.',
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'l1-find-your-sa',
      level: 1,
      module: M_EAR,
      title: 'Finding Your Comfortable Sa',
      objective:
        'Choose a comfortable Sa for your voice using your speaking voice, humming and the Tanpura Drone, and match it steadily.',
      explanation: {
        hinglish:
          'Ab sabse mazedaar kaam: apna Sa dhoondhna. Yaad hai, Sa movable hai, toh aapko kisi aur ka Sa copy karne ki zaroorat nahi.\n\nTareeka simple hai. Pehle, aaraam se bolke dekhiye: "Haan ji, namaste". Aapki normal bolne wali awaaz ka area aksar ek achha starting point hota hai. Phir usi area mein halka sa "mmm" hum kariye, bina zor ke. Pitch Matcher bataayega ki aap kis note ke aas-paas hain.\n\nAb Tanpura Drone ko us note ke kareeb wale Sa par set kariye. Uske saath "Sa" aaraam se gaaiye. Phir ek-do note upar aur neeche wale Sa try kariye. Achha Sa woh hai jahan: Sa aaraam se, bina dabaaye nikle; neeche thoda space ho (mandra Ni, Dha tak); aur upar Pa tak bina khinche pahunch sakein, aur halke se taar Sa tak bhi (Level 1 checkpoint mein Sa, Pa aur taar Sa maange jaate hain).\n\nLog kehte hain "ladkon ka Sa yeh, ladkiyon ka woh". Hum aisa label nahi lagaate. Har awaaz alag hai, aur range bahut vary karti hai. Aapka Sa wahi jo aapke liye aaraamdaayak hai.\n\nShuruaat mein Sa thoda neeche chun lena behtar hai; baad mein badal sakte hain. Kabhi zor mat lagaaiye. Pitch Matcher par needle bilkul centre par na aaye toh tension nahi; paas aana bhi achhi shuruaat hai.',
        english:
          'Now the exciting part: finding your own Sa. Remember, Sa is movable, so you never need to copy someone else\'s.\n\nThe method is simple. First, speak comfortably: "Hello, how are you?" The area of your normal speaking voice is often a good starting point. Then hum a gentle "mmm" in that same area, without pushing. The Pitch Matcher will show which note you are near.\n\nNow set the Tanpura Drone to a Sa close to that note and sing "Sa" easily with it. Then try a Sa one or two semitones higher and lower. A good Sa is one where: Sa comes out easily without pressing; you have a little room below (down to mandra Ni or Dha); and you can reach Pa above without stretching, and ideally upper Sa softly too (the Level 1 checkpoint asks for Sa, Pa and upper Sa).\n\nPeople sometimes say "men use this Sa, women use that one". We do not use such labels. Every voice is different, and comfortable ranges vary widely. Your Sa is simply the one that feels comfortable for you.\n\nAt the start it is better to choose a slightly lower Sa; you can always change it later. Never force. If the Pitch Matcher needle is not exactly centred, do not worry; getting close is a good beginning.',
        hindi:
          'अब सबसे मज़ेदार काम: अपना सा ढूँढना। याद रखिए, सा चल (movable) है, इसलिए आपको किसी और का सा कॉपी करने की ज़रूरत नहीं।\n\nतरीक़ा आसान है। पहले आराम से कुछ बोलिए: "हाँ जी, नमस्ते, आप कैसे हैं?" आपकी सामान्य बोलने वाली आवाज़ का इलाक़ा अक्सर अच्छा शुरुआती बिंदु होता है। फिर उसी इलाक़े में बिना ज़ोर लगाए हल्का "म्म्म" गुनगुनाइए। पिच मैचर (Pitch Matcher) बताएगा कि आप किस नोट के आसपास हैं।\n\nअब तानपुरा ड्रोन को उस नोट के पास वाले सा पर सेट कीजिए और उसके साथ आराम से "सा" गाइए। फिर एक-दो सेमिटोन ऊपर और नीचे वाले सा भी आज़माइए। अच्छा सा वह है जहाँ: सा बिना दबाए आसानी से निकले; नीचे थोड़ी जगह हो (मंद्र नि या ध तक); ऊपर प तक बिना खिंचे पहुँच सकें, और हो सके तो हल्के से तार सा तक भी (Level 1 चेकपॉइंट में सा, प और तार सा माँगे जाते हैं)।\n\nलोग कभी-कभी कहते हैं "आदमियों का सा यह, औरतों का वह"। हम ऐसे लेबल नहीं लगाते। हर आवाज़ अलग है, और आरामदायक रेंज में बहुत फ़र्क होता है। आपका सा बस वही है जो आपके लिए आरामदायक हो।\n\nशुरुआत में थोड़ा नीचा सा चुनना बेहतर है; बाद में कभी भी बदल सकते हैं। कभी ज़ोर मत लगाइए। अगर पिच मैचर की सुई ठीक बीच में न आए, तो चिंता मत कीजिए; पास पहुँचना भी अच्छी शुरुआत है।',
      },
      whyItMatters:
        'Every exercise, drone and demo in the app uses your Sa. A comfortable Sa means you practise in the healthiest, most natural part of your voice.',
      traditionNote:
        'Harmonium players often name Sa by key position, such as "safed ek" (white 1 = C) or "kaali do" (black 2 = D#/E♭). This app shows Western note names; both describe the same pitches.',
      demos: [
        { kind: 'drone', label: 'Tanpura Drone on your currently chosen Sa' },
        { kind: 'note', label: 'Your Sa, held', swara: 'S', durationSec: 4 },
        { kind: 'sequence', label: 'Range check around Sa: Dha Ni Sa Re Ga Ma Pa', notes: ['.D', '.N', 'S', 'R', 'G', 'm', 'P'], bpm: 50 },
      ],
      guidedSteps: [
        'Warm up briefly with hums and lip trills.',
        'Speak a short sentence naturally, then hum "mmm" in the same area. Open the Pitch Matcher and note which note it shows.',
        'Set your Sa in settings to that note (or the nearest one). Turn on the Tanpura Drone.',
        'Sing a soft "Saaa" for 3–4 seconds with the drone. Repeat 3 times.',
        'Play the range-check demo. Can you hum mandra Dha/Ni below and Pa above comfortably? If the top feels tight, lower your Sa by one or two semitones; if the bottom is a mumble, raise it.',
        'When it feels easy, open the Pitch Matcher and match Sa several times.',
      ],
      independentPractice: {
        instructions:
          'Daily: with the Tanpura Drone on, sing long, soft Sa notes on "aa" for 5 minutes, resting between each. Check yourself in the Pitch Matcher every few attempts. Adjust your Sa if it ever feels strained.',
        durationMin: 7,
        tool: 'pitch-match',
        pattern: ['S'],
      },
      mistakes: [
        { mistake: 'Choosing a high Sa because a favourite singer uses it.', fix: 'Your Sa should fit your voice. Songs can be transposed to your Sa.' },
        { mistake: 'Pressing to make Sa louder or brighter.', fix: 'Sing Sa softly first; tone and volume develop over time.' },
        { mistake: 'Changing Sa every day.', fix: 'Once you find a comfortable Sa, keep it for a few weeks so your ear gets used to it.' },
        { mistake: 'Getting upset that the needle wobbles.', fix: 'Small wobbles are normal. Aim for "mostly near the centre".' },
      ],
      quiz: [
        {
          question: 'What is a good starting point for finding your Sa?',
          options: ['The highest note you can scream', 'The area of your comfortable speaking voice', 'Whatever your favourite singer uses', 'Always C'],
          answerIndex: 1,
          explanation: 'Your relaxed speaking and humming area is a sensible, comfortable starting point.',
        },
        {
          question: 'If Pa feels strained with your chosen Sa, you should…',
          options: ['Push harder', 'Lower your Sa a little', 'Raise your Sa', 'Skip practice'],
          answerIndex: 1,
          explanation: 'A lower Sa brings Pa down too, making it more comfortable.',
        },
        {
          question: 'Is your Sa decided by your gender?',
          options: ['Yes, strictly', 'No, it depends on your individual comfortable range', 'Only for children'],
          answerIndex: 1,
          explanation: 'Voices vary widely; choose Sa by comfort, not by labels.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'With the drone on, sing and hold Sa softly. Each attempt counts as matched if it stays within about half a semitone on average. Rest between attempts.',
        targets: ['S'],
        minAttempts: 5,
        minSuccessPct: 60,
        toleranceCents: 50,
      },
      videoQueries: ['how to find your singing scale for beginners hindi', 'apna sa kaise dhoondhe harmonium scale', 'how to find your comfortable key for singing'],
      nextStep: 'Next, we train the ear to tell whether two notes are the same or different.',
      estMinutes: 20,
      safetyNote: 'Never force your voice to find Sa. If anything feels tight or painful, stop and choose a lower, easier Sa.',
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'l1-same-or-different',
      level: 1,
      module: M_EAR,
      title: 'Ear Training: Same or Different?',
      objective:
        'Reliably tell whether two notes played one after another are the same pitch or different.',
      explanation: {
        hinglish:
          'Gaana pehle kaan se shuru hota hai, gale se nahi. Agar kaan sun hi na paaye ki do note alag hain, toh gala unhe alag kaise gaayega? Isliye ab hum ear training karenge.\n\nExercise simple hai: do note ek ke baad ek bajenge. Aapko bataana hai, "same" ya "different". Shuru mein farq bada hoga, jaise Sa aur Pa, jo aasaani se pakda jaata hai. Phir chhota hoga, jaise Sa aur Re, ya Ga aur Ma, jo paas-paas hain.\n\nKuch tips: aankhein band karke suniye. Pehle note ko mann mein "pakad" ke rakhiye, jaise ek photo. Doosra note aaye toh compare kariye: kya woh upar gaya, neeche gaya, ya wahin raha? Agar confuse hon, dono notes ko halke se hum karke dekhiye; kai baar gala kaan ki madad karta hai.\n\nGalat jawab se bilkul ghabraaiye nahi. Har galti kaan ko kuch sikhaati hai. Kuch log shuru mein chhote farq ko nahi pakad paate, aur yeh bilkul normal hai. Roz kuch minute practice se yeh kaabiliyat zaroor badhti hai.\n\nYaad rakhiye, yeh test pitch ka hai, volume ka nahi. Ek note thoda zor se lag sakta hai, phir bhi pitch same ho sakti hai.',
        english:
          'Singing begins in the ear, not the throat. If your ear cannot tell that two notes are different, your voice cannot reliably sing them differently. So now we train the ear.\n\nThe exercise is simple: two notes play one after another, and you decide "same" or "different". At first the difference will be large, like Sa and Pa, which is easy to catch. Later it becomes smaller, like Sa and Re, or Ga and Ma, which are close neighbours.\n\nSome tips: close your eyes while listening. Hold the first note in your mind, like a snapshot. When the second note arrives, compare: did it go up, go down, or stay put? If you are unsure, hum both notes softly; often the voice helps the ear.\n\nDo not worry about wrong answers. Every mistake teaches the ear something. Some people find small differences hard at first, and that is completely normal. A few minutes of daily practice steadily improves this ability.\n\nRemember, this test is about pitch, not volume. One note may seem slightly louder and still be the same pitch.',
        hindi:
          'गाना पहले कान से शुरू होता है, गले से नहीं। अगर कान यह न सुन पाए कि दो नोट अलग हैं, तो आवाज़ उन्हें भरोसे से अलग कैसे गाएगी? इसलिए अब हम कान की ट्रेनिंग (ear training) करेंगे।\n\nअभ्यास आसान है: दो नोट एक के बाद एक बजेंगे, और आपको बताना है "same" (एक जैसे) या "different" (अलग)। शुरू में फ़र्क बड़ा होगा, जैसे सा और प, जो आसानी से पकड़ में आता है। बाद में फ़र्क छोटा होगा, जैसे सा और रे, या ग और म, जो पास-पास के पड़ोसी हैं।\n\nकुछ टिप्स: सुनते समय आँखें बंद कर लीजिए। पहले नोट को मन में एक तस्वीर की तरह पकड़कर रखिए। दूसरा नोट आए तो तुलना कीजिए: क्या वह ऊपर गया, नीचे गया या वहीं रहा? अगर उलझन हो, तो दोनों नोट धीरे से गुनगुनाकर देखिए; कई बार आवाज़ कान की मदद करती है।\n\nग़लत जवाबों से बिल्कुल मत घबराइए। हर ग़लती कान को कुछ सिखाती है। कुछ लोगों को शुरू में छोटे फ़र्क पकड़ना मुश्किल लगता है, और यह बिल्कुल सामान्य है। रोज़ कुछ मिनट के अभ्यास से यह क्षमता लगातार बढ़ती है।\n\nयाद रखिए, यह टेस्ट पिच का है, आवाज़ की तेज़ी (volume) का नहीं। एक नोट थोड़ा तेज़ लग सकता है, फिर भी पिच वही हो सकती है।',
      },
      whyItMatters:
        'Hearing small pitch differences is what lets you notice when you are off-sur and correct yourself. It is the foundation of singing in tune.',
      demos: [
        { kind: 'compare', label: 'Example 1: Sa and Pa (clearly different)', a: 'S', b: 'P' },
        { kind: 'compare', label: 'Example 2: Sa and Sa (same)', a: 'S', b: 'S' },
        { kind: 'compare', label: 'Example 3: Sa and Re (close, but different)', a: 'S', b: 'R' },
        { kind: 'compare', label: 'Example 4: Ga and Ma (very close neighbours)', a: 'G', b: 'm' },
        { kind: 'compare', label: 'Example 5: Pa and Pa (same)', a: 'P', b: 'P' },
      ],
      guidedSteps: [
        'Play each example demo once with your eyes closed. Guess before reading the label.',
        'For the "different" examples, ask: did the second note go up or down?',
        'Hum the two notes of Example 3 softly to feel the difference in your voice too.',
        'Open Ear Training and choose the same/different mode. Answer 10 questions slowly.',
        'Replay any question you got wrong and listen again before moving on.',
      ],
      independentPractice: {
        instructions:
          'Do one round of 10 same/different questions in Ear Training every day. Write your score in the Recording Journal and watch the trend over a week, not a single day.',
        durationMin: 5,
        tool: 'ear-training',
      },
      mistakes: [
        { mistake: 'Answering too quickly.', fix: 'Take a breath after the second note, replay if allowed, then decide.' },
        { mistake: 'Confusing loudness with pitch.', fix: 'Focus only on high or low, not on loud or soft.' },
        { mistake: 'Feeling discouraged by a low score.', fix: 'Ear skills grow with regular practice. Compare with your own scores from last week.' },
      ],
      quiz: [
        {
          question: 'Which pair is the hardest to tell apart?',
          options: ['Sa and Pa', 'Sa and upper Sa', 'Ga and Ma'],
          answerIndex: 2,
          explanation: 'Ga and Ma are only one semitone apart in the shuddh scale, the smallest step here.',
        },
        {
          question: 'Why train the ear before singing more?',
          options: ['Because you must hear differences to sing them accurately', 'It is not important', 'To sing louder'],
          answerIndex: 0,
          explanation: 'Accurate singing depends on accurately hearing pitch.',
        },
        {
          question: 'If one note sounds louder but the same height, the pitches are…',
          options: ['Different', 'The same', 'Impossible to tell'],
          answerIndex: 1,
          explanation: 'Loudness does not change pitch. Same height means same pitch.',
        },
      ],
      practical: {
        kind: 'ear-test',
        description: 'Answer at least 10 same/different questions in Ear Training and score 70% or more. You can retry as many times as you like.',
        minQuestions: 10,
        minScorePct: 70,
      },
      videoQueries: ['ear training for beginners same or different pitch', 'sur pehchanna kaise seekhe ear training hindi'],
      nextStep: 'Next, we join the ear and voice: listen first, then sing.',
      estMinutes: 15,
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'l1-listen-before-singing',
      level: 1,
      module: M_EAR,
      title: 'Listen First, Then Sing',
      objective:
        'Use the four-step method (listen, hum internally, sing softly, adjust) to match Sa, Re and Ga.',
      explanation: {
        hinglish:
          'Beginners ki sabse badi aadat hoti hai: note baja nahi ki turant zor se gaa diya. Isse aksar sur thoda idhar-udhar ho jaata hai. Ek behtar tareeka hai, char step mein:\n\n1. Suno: note ko dhyaan se, poora suniye. Gaana nahi, sirf sunna.\n\n2. Mann mein gungunao (internal hum): bina awaaz ke, dimaag mein us note ko "gaaiye". Jaise koi gaana dimaag mein bajta hai. Isse aapka dimaag pehle se taiyaar ho jaata hai.\n\n3. Dheere se gaao: ab halki, soft awaaz mein note gaaiye. Soft gaane se gala relaxed rehta hai aur sur adjust karna aasaan hota hai.\n\n4. Adjust karo: suniye ki aapki awaaz drone ke saath mil rahi hai ya nahi. Jab sur sahi hota hai toh awaaz drone mein "ghul" jaati hai, ek smooth feeling aati hai. Agar thoda "ladhai" jaisa lage (ek wobble ya beat), toh dheere se thoda upar ya neeche jaaiye. Pitch Matcher bhi madad karega.\n\nYeh tareeka Indian guru-shishya parampara mein bhi hai: guru gaate hain, shishya dhyaan se sunta hai, phir dohraata hai. Aaj hum isse Sa, Re aur Ga par karenge. Jaldi nahi; har note ko apna time dijiye.',
        english:
          'The most common beginner habit is singing a note loudly the instant it plays. This often makes the pitch land slightly off. A better method has four steps:\n\n1. Listen: hear the note fully and attentively. No singing, only listening.\n\n2. Hum internally: without any sound, "sing" the note in your head, the way a song plays in your mind. This prepares your brain before your voice moves.\n\n3. Sing softly: now sing the note with a light, soft voice. Singing softly keeps the throat relaxed and makes small corrections easier.\n\n4. Adjust: listen to whether your voice blends with the drone. When you are in tune, your voice seems to melt into the drone with a smooth feeling. If it feels like a "fight", a wobble or beating sound, move gently up or down a little. The Pitch Matcher will help too.\n\nThis method mirrors the Indian guru-shishya tradition: the teacher sings, the student listens closely, then repeats. Today we apply it to Sa, Re and Ga. No rushing; give every note its time.',
        hindi:
          'शुरुआती गायकों की सबसे आम आदत है: नोट बजते ही तुरंत ज़ोर से गा देना। इससे अक्सर सुर थोड़ा इधर-उधर लगता है। एक बेहतर तरीक़ा है, चार कदमों में:\n\n1. सुनिए: नोट को ध्यान से, पूरा सुनिए। गाना नहीं, सिर्फ़ सुनना।\n\n2. मन में गुनगुनाइए: बिना कोई आवाज़ निकाले, उस नोट को दिमाग़ में "गाइए", जैसे कोई गाना मन में बजता है। इससे आवाज़ निकलने से पहले दिमाग़ तैयार हो जाता है।\n\n3. धीरे से गाइए: अब हल्की, नरम आवाज़ में नोट गाइए। धीरे गाने से गला ढीला रहता है और छोटे सुधार करना आसान होता है।\n\n4. सुधारिए (adjust): सुनिए कि आपकी आवाज़ ड्रोन के साथ मिल रही है या नहीं। जब सुर सही होता है, तो आवाज़ ड्रोन में घुलती-सी लगती है, एक स्मूद एहसास आता है। अगर "लड़ाई" जैसा लगे, यानी एक हिलती या धड़कती (beating) आवाज़, तो धीरे से थोड़ा ऊपर या नीचे जाइए। पिच मैचर भी मदद करेगा।\n\nयह तरीक़ा भारतीय गुरु-शिष्य परंपरा जैसा ही है: गुरु गाते हैं, शिष्य ध्यान से सुनता है, फिर दोहराता है। आज हम इसे सा, रे और ग पर करेंगे। जल्दी नहीं; हर नोट को उसका समय दीजिए।',
      },
      whyItMatters:
        'Listening before singing turns guessing into aiming. It builds the habit that keeps you in sur when you later learn songs.',
      traditionNote:
        'The "beating" you hear when two pitches are slightly apart is a real acoustic effect. Fine tuning by ear against the tanpura is how Hindustani singers traditionally learn sur, long before any electronic tuner existed.',
      demos: [
        { kind: 'note', label: 'Listen: Sa', swara: 'S', durationSec: 4 },
        { kind: 'note', label: 'Listen: Re', swara: 'R', durationSec: 4 },
        { kind: 'note', label: 'Listen: Ga', swara: 'G', durationSec: 4 },
        { kind: 'sequence', label: 'Call pattern with gaps for you to answer', notes: ['S', '-', '-', 'R', '-', '-', 'G', '-', '-'], bpm: 50 },
      ],
      guidedSteps: [
        'Turn on the Tanpura Drone. Play "Listen: Sa" and just listen.',
        'Silently imagine Sa for 2–3 seconds.',
        'Sing Sa softly on "aa" and listen for it blending with the drone.',
        'If it wobbles against the drone, slide gently until it smooths out. Check with the Pitch Matcher.',
        'Repeat the same four steps for Re, then Ga.',
        'Play the call pattern demo and sing each note in the gap after it.',
      ],
      independentPractice: {
        instructions:
          'With the Sargam Player at a slow tempo, play Sa Re Ga with gaps. In each gap: imagine the note, then sing it softly. Do 5 rounds, then check with the Pitch Matcher.',
        durationMin: 8,
        tool: 'sargam',
        pattern: ['S', '-', 'R', '-', 'G', '-', 'R', '-', 'S', '-'],
        bpm: 50,
      },
      mistakes: [
        { mistake: 'Singing the instant the note starts.', fix: 'Wait. Listen fully, imagine it, then sing.' },
        { mistake: 'Singing loudly to "find" the note.', fix: 'Softer singing makes pitch easier to adjust.' },
        { mistake: 'Staring only at the Pitch Matcher.', fix: 'Use your ears first and the screen to confirm. The goal is to rely on your ears.' },
      ],
      quiz: [
        {
          question: 'What is the correct order of the four steps?',
          options: ['Sing loudly, listen, adjust, hum', 'Listen, hum internally, sing softly, adjust', 'Adjust, sing, listen, hum'],
          answerIndex: 1,
          explanation: 'Listen → hum internally → sing softly → adjust.',
        },
        {
          question: 'A wobbling or beating sound against the drone usually means…',
          options: ['You are exactly in tune', 'Your pitch is slightly off', 'The drone is broken'],
          answerIndex: 1,
          explanation: 'Beating happens when two pitches are close but not equal; adjust until it smooths out.',
        },
        {
          question: 'Why sing softly at first?',
          options: ['It keeps the throat relaxed and makes adjusting easier', 'Soft singing is always wrong', 'So no one can hear you'],
          answerIndex: 0,
          explanation: 'Soft, relaxed singing allows fine pitch adjustments without strain.',
        },
      ],
      practical: {
        kind: 'pitch-match',
        description: 'Using listen → imagine → sing softly → adjust, match Sa, Re and Ga with the drone. Within about half a semitone counts as a match.',
        targets: ['S', 'R', 'G'],
        minAttempts: 6,
        minSuccessPct: 55,
        toleranceCents: 50,
      },
      videoQueries: ['how to match pitch singing beginners tips', 'sur mein kaise gaye pitch matching hindi'],
      nextStep: 'Finally, we explore your comfortable range gently, without pushing.',
      estMinutes: 20,
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'l1-exploring-range',
      level: 1,
      module: M_EAR,
      title: 'Exploring Your Comfortable Range',
      objective:
        'Gently discover the span of notes you can sing comfortably around your Sa, without labels and without pushing.',
      explanation: {
        hinglish:
          'Range matlab kitne neeche se kitne upar tak aap aaraam se gaa sakte ho. Yahan "aaraam se" sabse zaroori shabd hai. Hum yeh nahi dhoondh rahe ki aap kitna oonchi cheekh maar sakte ho; hum woh area dhoondh rahe hain jahan awaaz khushi se, bina zor ke chalti hai.\n\nKai jagah log turant label laga dete hain: "yeh male voice hai, yeh female". Hum aisa nahi karte. Range har insaan mein alag hoti hai, aur practice se badalti bhi hai. Aapki range aapki hai, bas.\n\nKaise explore karein? Sa se shuru kijiye. Phir Sa Re Ga Ma Pa dheere-dheere upar jaaiye, aur jahan bhi awaaz patli, tight ya mushkil lagne lage, wahin ruk jaaiye. Wahi aapki aaj ki comfortable top hai. Phir Sa se neeche: Ni, Dha, Pa (mandra). Jahan awaaz bahut dheemi, khurdari ya "ghur-ghur" ho jaaye, wahan ruk jaaiye.\n\nGlide (siren) se bhi pata chalta hai: halke "oo" par upar-neeche slide kariye aur dekhiye awaaz kahan smooth hai.\n\nAaj ki range likh lijiye. Yeh koi limit nahi, bas aaj ki tasveer hai. Warm-up, achhi neend aur roz ka riyaz range ko dheere-dheere aaraam se badhaate hain. Kabhi bhi upar ya neeche zabardasti mat kariye.',
        english:
          'Range means how low and how high you can sing comfortably. "Comfortably" is the key word. We are not looking for the highest note you can shriek; we are looking for the area where your voice moves happily, without force.\n\nMany people quickly attach labels like "this is a male voice, that is a female voice". We do not. Comfortable range varies from person to person and also changes with practice. Your range is simply yours.\n\nHow to explore? Start on Sa. Move slowly up through Sa Re Ga Ma Pa, and wherever your voice starts to feel thin, tight or effortful, stop there. That is your comfortable top for today. Then go down from Sa: Ni, Dha, Pa in the mandra saptak. Where your voice becomes very faint, gravelly or rumbly, stop.\n\nGentle glides (sirens) also help: slide softly on "oo" and notice where the sound stays smooth.\n\nWrite down today\'s range. It is not a limit, just a snapshot. Warm-ups, good sleep and regular practice let range grow gradually and comfortably. Never force your voice higher or lower.',
        hindi:
          'रेंज (range) का मतलब है आप कितने नीचे से कितने ऊपर तक आराम से गा सकते हैं। यहाँ "आराम से" सबसे ज़रूरी शब्द है। हम यह नहीं ढूँढ रहे कि आप सबसे ऊँची चीख़ कितनी मार सकते हैं; हम वह इलाक़ा ढूँढ रहे हैं जहाँ आपकी आवाज़ ख़ुशी से, बिना ज़ोर के चलती है।\n\nबहुत लोग जल्दी से लेबल लगा देते हैं, जैसे "यह मर्दाना आवाज़ है, वह ज़नाना"। हम ऐसा नहीं करते। आरामदायक रेंज हर इंसान में अलग होती है और अभ्यास से बदलती भी है। आपकी रेंज बस आपकी है।\n\nकैसे खोजें? सा से शुरू कीजिए। फिर सा रे ग म प धीरे-धीरे ऊपर जाइए, और जहाँ भी आवाज़ पतली, कसी हुई या मेहनत वाली लगने लगे, वहीं रुक जाइए। वही आज का आपका आरामदायक ऊपरी सिरा है। फिर सा से नीचे जाइए: मंद्र सप्तक के नि, ध, प। जहाँ आवाज़ बहुत धीमी, खुरदुरी या घरघराती हो जाए, वहाँ रुक जाइए।\n\nहल्के ग्लाइड (सायरन) से भी पता चलता है: नरम "ऊ" पर ऊपर-नीचे स्लाइड कीजिए और देखिए कि आवाज़ कहाँ स्मूद रहती है।\n\nआज की रेंज लिख लीजिए। यह कोई सीमा नहीं, बस आज की तस्वीर है। वॉर्म-अप, अच्छी नींद और नियमित अभ्यास से रेंज धीरे-धीरे और आराम से बढ़ती है। कभी भी आवाज़ को ज़बरदस्ती ऊपर या नीचे मत ले जाइए।',
      },
      whyItMatters:
        'Knowing your comfortable range helps you choose a good Sa, pick songs that suit you, and avoid strain from singing outside your current ability.',
      traditionNote:
        'Western teachers describe registers (chest voice, head voice) and voice types (soprano, tenor, etc.); Hindustani practice instead thinks in saptaks relative to Sa. These are different frameworks, and Level 1 does not need either label system: just comfort.',
      demos: [
        { kind: 'sequence', label: 'Gentle climb: Sa Re Ga Ma Pa', notes: ['S', 'R', 'G', 'm', 'P', '-', 'P', 'm', 'G', 'R', 'S'], bpm: 50 },
        { kind: 'sequence', label: 'Gentle descent: Sa Ni Dha Pa (mandra)', notes: ['S', '.N', '.D', '.P', '-', '.P', '.D', '.N', 'S'], bpm: 50 },
        { kind: 'glide', label: 'Soft siren from mandra Pa up to Pa', from: '.P', to: 'P', durationSec: 4 },
      ],
      guidedSteps: [
        'Do your full warm-up routine first.',
        'Turn on the Tanpura Drone and sing Sa softly.',
        'Play the gentle climb demo and sing along on "aa" only as far as is comfortable. Note the last easy note.',
        'Play the gentle descent demo and sing along downwards, stopping where the voice gets faint or rough.',
        'Use the Pitch Matcher to check your lowest and highest comfortable notes, and write them in the Recording Journal.',
        'If the top is below Pa or the bottom is above mandra Ni, consider adjusting your Sa slightly in settings.',
      ],
      independentPractice: {
        instructions:
          'Once this week (not daily), repeat this gentle range check after warming up and record your easy top and bottom notes in the Recording Journal. Stay soft. Compare after a few weeks.',
        durationMin: 6,
        tool: 'pitch-match',
        pattern: ['.P', '.D', '.N', 'S', 'R', 'G', 'm', 'P'],
      },
      mistakes: [
        { mistake: 'Pushing for the highest possible note.', fix: 'Stop at the last easy note. Range grows through relaxation, not force.' },
        { mistake: 'Labelling your voice by gender.', fix: 'Range is individual. Use your measured comfortable notes instead of labels.' },
        { mistake: 'Testing range without warming up.', fix: 'Always warm up first; a cold voice gives a smaller, tenser range.' },
      ],
      quiz: [
        {
          question: 'Your comfortable range is best described as…',
          options: ['The highest note you can scream', 'The span of notes you can sing easily without strain', 'Decided by your gender', 'Fixed for life'],
          answerIndex: 1,
          explanation: 'Comfortable range is about easy, healthy singing, and it can grow with practice.',
        },
        {
          question: 'Your voice gets thin and tight at Ma. What should you do?',
          options: ['Push to Pa anyway', 'Stop at Ga or Ma and note it as today\'s top', 'Shout'],
          answerIndex: 1,
          explanation: 'Stop where it becomes effortful. Forcing risks strain.',
        },
        {
          question: 'How does range typically grow?',
          options: ['Overnight by forcing', 'Gradually, with warm-ups, rest and regular relaxed practice', 'It never changes'],
          answerIndex: 1,
          explanation: 'Range develops slowly through healthy, regular practice.',
        },
      ],
      practical: {
        kind: 'self-check',
        description: 'Range exploration is about comfort, so this is self-reported.',
        items: [
          'I warmed up before exploring my range.',
          'I stopped at my last comfortable note going up and going down, without pushing.',
          'I wrote down my comfortable lowest and highest notes.',
        ],
      },
      videoQueries: ['how to find your vocal range safely beginners', 'apni vocal range kaise pata kare hindi'],
      nextStep: 'You have covered all of Level 1. Take the Level 1 checkpoint when you feel ready; you can retry it anytime.',
      estMinutes: 15,
      safetyNote: 'Never force your voice higher or lower. Stop at the first sign of strain, tightness or pain.',
    },
  ],
  checkpoint: {
    title: 'Level 1 Checkpoint: Sa, Pa and a Listening Ear',
    description:
      'To unlock Level 2, match the frame of your scale (Sa, Pa and upper Sa) with the drone, and pass a same/different listening test. This checkpoint measures pitch-matching and pitch discrimination only, not your overall singing quality, tone or musicality. If upper Sa feels strained, lower your Sa in settings first. You can retry anytime, as often as you like.',
    requirements: [
      {
        kind: 'pitch-match',
        description: "Match Sa, Pa and upper Sa (S, P, S') with the Tanpura Drone. Within about half a semitone counts as a match.",
        targets: ['S', 'P', "S'"],
        minAttempts: 8,
        minSuccessPct: 60,
        toleranceCents: 50,
      },
      {
        kind: 'ear-test',
        description: 'Answer at least 10 same/different questions in Ear Training with a score of 75% or more.',
        minQuestions: 10,
        minScorePct: 75,
      },
    ],
  },
};
