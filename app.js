// ════════════════════════════════════════════════
//  localStorage 키 상수
// ════════════════════════════════════════════════
const LS = {
    RECORDS     : 'jvocab_records',
    HISTORY     : 'jvocab_history',
    LEVEL       : 'jvocab_level',
    CUSTOM_WORDS: 'jvocab_custom_words',
    DELETED_IDS : 'jvocab_deleted_ids',
    RECENT_IDS  : 'jvocab_recent_ids',
};

// ════════════════════════════════════════════════
//  localStorage 헬퍼
// ════════════════════════════════════════════════
function lsSave(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch(e) {
        console.warn('localStorage 저장 실패:', e);
    }
}

function lsLoad(key, fallback) {
    try {
        const v = localStorage.getItem(key);
        return v !== null ? JSON.parse(v) : fallback;
    } catch(e) {
        return fallback;
    }
}

// ════════════════════════════════════════════════
//  토스트
// ════════════════════════════════════════════════
function showToast(msg, duration = 1800) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), duration);
}

// ════════════════════════════════════════════════
//  TTS (Web Speech API)
// ════════════════════════════════════════════════
const TTS = {
    synth  : window.speechSynthesis,
    voice  : null,
    current: null,

    findVoice() {
        const voices = this.synth.getVoices();
        this.voice =
            voices.find(v => v.lang === 'ja-JP') ||
            voices.find(v => v.lang.startsWith('ja')) ||
            null;
    },

    speak(text, onStart, onEnd) {
        if (!this.synth) return;
        this.synth.cancel();

        const utter    = new SpeechSynthesisUtterance(text);
        utter.lang     = 'ja-JP';
        utter.rate     = 0.9;
        utter.pitch    = 1.0;

        if (this.voice) utter.voice = this.voice;

        utter.onstart = () => { if (onStart) onStart(); };
        utter.onend   = () => { if (onEnd)   onEnd();   };
        utter.onerror = () => { if (onEnd)   onEnd();   };

        this.synth.speak(utter);
    },

    stop() {
        if (this.synth) this.synth.cancel();
    }
};

if (window.speechSynthesis) {
    TTS.findVoice();
    window.speechSynthesis.onvoiceschanged = () => TTS.findVoice();
}

function ttsSpeak() {
    const word = examWords[currentIndex];
    if (!word) return;

    const card = document.getElementById('wordCard');
    card.classList.add('tts-playing');

    TTS.speak(
        word.kanji,
        null,
        () => card.classList.remove('tts-playing')
    );
}

function ttsSpeakWord(text, btnEl) {
    const prev = document.querySelector('.tts-btn.playing');
    if (prev) prev.classList.remove('playing');

    if (btnEl) btnEl.classList.add('playing');

    TTS.speak(
        text,
        null,
        () => { if (btnEl) btnEl.classList.remove('playing'); }
    );
}

// ════════════════════════════════════════════════
//  기본 단어 데이터 (N5~N1)
//  형식: 한 줄 10개
// ════════════════════════════════════════════════
const DEFAULT_WORDS = [

// ── N5 ──────────────────────────────────────────
{id:1001,kanji:'食べる',hiragana:'たべる',korean:'먹다',level:'N5'},{id:1002,kanji:'飲む',hiragana:'のむ',korean:'마시다',level:'N5'},{id:1003,kanji:'見る',hiragana:'みる',korean:'보다',level:'N5'},{id:1004,kanji:'行く',hiragana:'いく',korean:'가다',level:'N5'},{id:1005,kanji:'来る',hiragana:'くる',korean:'오다',level:'N5'},{id:1006,kanji:'話す',hiragana:'はなす',korean:'말하다',level:'N5'},{id:1007,kanji:'聞く',hiragana:'きく',korean:'듣다/묻다',level:'N5'},{id:1008,kanji:'書く',hiragana:'かく',korean:'쓰다',level:'N5'},{id:1009,kanji:'読む',hiragana:'よむ',korean:'읽다',level:'N5'},{id:1010,kanji:'買う',hiragana:'かう',korean:'사다',level:'N5'},
{id:1011,kanji:'水',hiragana:'みず',korean:'물',level:'N5'},{id:1012,kanji:'山',hiragana:'やま',korean:'산',level:'N5'},{id:1013,kanji:'川',hiragana:'かわ',korean:'강',level:'N5'},{id:1014,kanji:'空',hiragana:'そら',korean:'하늘',level:'N5'},{id:1015,kanji:'花',hiragana:'はな',korean:'꽃',level:'N5'},{id:1016,kanji:'学校',hiragana:'がっこう',korean:'학교',level:'N5'},{id:1017,kanji:'先生',hiragana:'せんせい',korean:'선생님',level:'N5'},{id:1018,kanji:'友達',hiragana:'ともだち',korean:'친구',level:'N5'},{id:1019,kanji:'家族',hiragana:'かぞく',korean:'가족',level:'N5'},{id:1020,kanji:'電車',hiragana:'でんしゃ',korean:'전철',level:'N5'},
{id:1021,kanji:'時間',hiragana:'じかん',korean:'시간',level:'N5'},{id:1022,kanji:'今日',hiragana:'きょう',korean:'오늘',level:'N5'},{id:1023,kanji:'明日',hiragana:'あした',korean:'내일',level:'N5'},{id:1024,kanji:'昨日',hiragana:'きのう',korean:'어제',level:'N5'},{id:1025,kanji:'大きい',hiragana:'おおきい',korean:'크다',level:'N5'},{id:1026,kanji:'小さい',hiragana:'ちいさい',korean:'작다',level:'N5'},{id:1027,kanji:'高い',hiragana:'たかい',korean:'높다/비싸다',level:'N5'},{id:1028,kanji:'安い',hiragana:'やすい',korean:'싸다',level:'N5'},{id:1029,kanji:'新しい',hiragana:'あたらしい',korean:'새롭다',level:'N5'},{id:1030,kanji:'古い',hiragana:'ふるい',korean:'오래되다',level:'N5'},
{id:1031,kanji:'良い',hiragana:'いい',korean:'좋다',level:'N5'},{id:1032,kanji:'悪い',hiragana:'わるい',korean:'나쁘다',level:'N5'},{id:1033,kanji:'暑い',hiragana:'あつい',korean:'덥다',level:'N5'},{id:1034,kanji:'寒い',hiragana:'さむい',korean:'춥다',level:'N5'},{id:1035,kanji:'難しい',hiragana:'むずかしい',korean:'어렵다',level:'N5'},{id:1036,kanji:'易しい',hiragana:'やさしい',korean:'쉽다',level:'N5'},{id:1037,kanji:'遠い',hiragana:'とおい',korean:'멀다',level:'N5'},{id:1038,kanji:'近い',hiragana:'ちかい',korean:'가깝다',level:'N5'},{id:1039,kanji:'忙しい',hiragana:'いそがしい',korean:'바쁘다',level:'N5'},{id:1040,kanji:'面白い',hiragana:'おもしろい',korean:'재미있다',level:'N5'},
{id:1041,kanji:'会う',hiragana:'あう',korean:'만나다',level:'N5'},{id:1042,kanji:'開ける',hiragana:'あける',korean:'열다',level:'N5'},{id:1043,kanji:'遊ぶ',hiragana:'あそぶ',korean:'놀다',level:'N5'},{id:1044,kanji:'洗う',hiragana:'あらう',korean:'씻다',level:'N5'},{id:1045,kanji:'歩く',hiragana:'あるく',korean:'걷다',level:'N5'},{id:1046,kanji:'入れる',hiragana:'いれる',korean:'넣다',level:'N5'},{id:1047,kanji:'起きる',hiragana:'おきる',korean:'일어나다',level:'N5'},{id:1048,kanji:'泳ぐ',hiragana:'およぐ',korean:'헤엄치다',level:'N5'},{id:1049,kanji:'終わる',hiragana:'おわる',korean:'끝나다',level:'N5'},{id:1050,kanji:'貸す',hiragana:'かす',korean:'빌려주다',level:'N5'},
{id:1051,kanji:'借りる',hiragana:'かりる',korean:'빌리다',level:'N5'},{id:1052,kanji:'閉める',hiragana:'しめる',korean:'닫다',level:'N5'},{id:1053,kanji:'知る',hiragana:'しる',korean:'알다',level:'N5'},{id:1054,kanji:'死ぬ',hiragana:'しぬ',korean:'죽다',level:'N5'},{id:1055,kanji:'座る',hiragana:'すわる',korean:'앉다',level:'N5'},{id:1056,kanji:'作る',hiragana:'つくる',korean:'만들다',level:'N5'},{id:1057,kanji:'撮る',hiragana:'とる',korean:'찍다',level:'N5'},{id:1058,kanji:'笑う',hiragana:'わらう',korean:'웃다',level:'N5'},{id:1059,kanji:'忘れる',hiragana:'わすれる',korean:'잊어버리다',level:'N5'},{id:1060,kanji:'分かる',hiragana:'わかる',korean:'알다/이해하다',level:'N5'},
{id:1061,kanji:'待つ',hiragana:'まつ',korean:'기다리다',level:'N5'},{id:1062,kanji:'持つ',hiragana:'もつ',korean:'들다/가지다',level:'N5'},{id:1063,kanji:'休む',hiragana:'やすむ',korean:'쉬다',level:'N5'},{id:1064,kanji:'寝る',hiragana:'ねる',korean:'자다',level:'N5'},{id:1065,kanji:'入る',hiragana:'はいる',korean:'들어가다',level:'N5'},{id:1066,kanji:'出る',hiragana:'でる',korean:'나가다',level:'N5'},{id:1067,kanji:'帰る',hiragana:'かえる',korean:'돌아가다',level:'N5'},{id:1068,kanji:'起こす',hiragana:'おこす',korean:'깨우다',level:'N5'},{id:1069,kanji:'教える',hiragana:'おしえる',korean:'가르치다',level:'N5'},{id:1070,kanji:'答える',hiragana:'こたえる',korean:'대답하다',level:'N5'},
{id:1071,kanji:'父',hiragana:'ちち',korean:'아버지',level:'N5'},{id:1072,kanji:'母',hiragana:'はは',korean:'어머니',level:'N5'},{id:1073,kanji:'兄',hiragana:'あに',korean:'오빠/형',level:'N5'},{id:1074,kanji:'姉',hiragana:'あね',korean:'언니/누나',level:'N5'},{id:1075,kanji:'弟',hiragana:'おとうと',korean:'남동생',level:'N5'},{id:1076,kanji:'妹',hiragana:'いもうと',korean:'여동생',level:'N5'},{id:1077,kanji:'子供',hiragana:'こども',korean:'아이',level:'N5'},{id:1078,kanji:'学生',hiragana:'がくせい',korean:'학생',level:'N5'},{id:1079,kanji:'銀行',hiragana:'ぎんこう',korean:'은행',level:'N5'},{id:1080,kanji:'病院',hiragana:'びょういん',korean:'병원',level:'N5'},
{id:1081,kanji:'駅',hiragana:'えき',korean:'역',level:'N5'},{id:1082,kanji:'家',hiragana:'いえ',korean:'집',level:'N5'},{id:1083,kanji:'部屋',hiragana:'へや',korean:'방',level:'N5'},{id:1084,kanji:'上',hiragana:'うえ',korean:'위',level:'N5'},{id:1085,kanji:'下',hiragana:'した',korean:'아래',level:'N5'},{id:1086,kanji:'前',hiragana:'まえ',korean:'앞',level:'N5'},{id:1087,kanji:'後ろ',hiragana:'うしろ',korean:'뒤',level:'N5'},{id:1088,kanji:'右',hiragana:'みぎ',korean:'오른쪽',level:'N5'},{id:1089,kanji:'左',hiragana:'ひだり',korean:'왼쪽',level:'N5'},{id:1090,kanji:'中',hiragana:'なか',korean:'안/중간',level:'N5'},
{id:1091,kanji:'本',hiragana:'ほん',korean:'책',level:'N5'},{id:1092,kanji:'辞書',hiragana:'じしょ',korean:'사전',level:'N5'},{id:1093,kanji:'時計',hiragana:'とけい',korean:'시계',level:'N5'},{id:1094,kanji:'傘',hiragana:'かさ',korean:'우산',level:'N5'},{id:1095,kanji:'鞄',hiragana:'かばん',korean:'가방',level:'N5'},{id:1096,kanji:'電話',hiragana:'でんわ',korean:'전화',level:'N5'},{id:1097,kanji:'御飯',hiragana:'ごはん',korean:'밥',level:'N5'},{id:1098,kanji:'お茶',hiragana:'おちゃ',korean:'차',level:'N5'},{id:1099,kanji:'コーヒー',hiragana:'こーひー',korean:'커피',level:'N5'},{id:1100,kanji:'パン',hiragana:'ぱん',korean:'빵',level:'N5'},
{id:1101,kanji:'肉',hiragana:'にく',korean:'고기',level:'N5'},{id:1102,kanji:'魚',hiragana:'さかな',korean:'생선',level:'N5'},{id:1103,kanji:'野菜',hiragana:'やさい',korean:'채소',level:'N5'},{id:1104,kanji:'果物',hiragana:'くだもの',korean:'과일',level:'N5'},{id:1105,kanji:'卵',hiragana:'たまご',korean:'달걀',level:'N5'},{id:1106,kanji:'牛乳',hiragana:'ぎゅうにゅう',korean:'우유',level:'N5'},{id:1107,kanji:'砂糖',hiragana:'さとう',korean:'설탕',level:'N5'},{id:1108,kanji:'塩',hiragana:'しお',korean:'소금',level:'N5'},{id:1109,kanji:'今',hiragana:'いま',korean:'지금',level:'N5'},{id:1110,kanji:'朝',hiragana:'あさ',korean:'아침',level:'N5'},
{id:1111,kanji:'昼',hiragana:'ひる',korean:'낮',level:'N5'},{id:1112,kanji:'夜',hiragana:'よる',korean:'밤',level:'N5'},{id:1113,kanji:'春',hiragana:'はる',korean:'봄',level:'N5'},{id:1114,kanji:'夏',hiragana:'なつ',korean:'여름',level:'N5'},{id:1115,kanji:'秋',hiragana:'あき',korean:'가을',level:'N5'},{id:1116,kanji:'冬',hiragana:'ふゆ',korean:'겨울',level:'N5'},{id:1117,kanji:'東',hiragana:'ひがし',korean:'동쪽',level:'N5'},{id:1118,kanji:'西',hiragana:'にし',korean:'서쪽',level:'N5'},{id:1119,kanji:'南',hiragana:'みなみ',korean:'남쪽',level:'N5'},{id:1120,kanji:'北',hiragana:'きた',korean:'북쪽',level:'N5'},
{id:1121,kanji:'赤',hiragana:'あか',korean:'빨간색',level:'N5'},{id:1122,kanji:'青',hiragana:'あお',korean:'파란색',level:'N5'},{id:1123,kanji:'白',hiragana:'しろ',korean:'흰색',level:'N5'},{id:1124,kanji:'黒',hiragana:'くろ',korean:'검은색',level:'N5'},{id:1125,kanji:'黄色',hiragana:'きいろ',korean:'노란색',level:'N5'},{id:1126,kanji:'緑',hiragana:'みどり',korean:'초록색',level:'N5'},{id:1127,kanji:'名前',hiragana:'なまえ',korean:'이름',level:'N5'},{id:1128,kanji:'言葉',hiragana:'ことば',korean:'말/언어',level:'N5'},{id:1129,kanji:'声',hiragana:'こえ',korean:'목소리',level:'N5'},{id:1130,kanji:'顔',hiragana:'かお',korean:'얼굴',level:'N5'},
{id:1131,kanji:'目',hiragana:'め',korean:'눈',level:'N5'},{id:1132,kanji:'耳',hiragana:'みみ',korean:'귀',level:'N5'},{id:1133,kanji:'口',hiragana:'くち',korean:'입',level:'N5'},{id:1134,kanji:'鼻',hiragana:'はな',korean:'코',level:'N5'},{id:1135,kanji:'手',hiragana:'て',korean:'손',level:'N5'},{id:1136,kanji:'足',hiragana:'あし',korean:'발/다리',level:'N5'},{id:1137,kanji:'頭',hiragana:'あたま',korean:'머리',level:'N5'},{id:1138,kanji:'体',hiragana:'からだ',korean:'몸',level:'N5'},{id:1139,kanji:'心',hiragana:'こころ',korean:'마음',level:'N5'},{id:1140,kanji:'痛い',hiragana:'いたい',korean:'아프다',level:'N5'},
{id:1141,kanji:'熱い',hiragana:'あつい',korean:'뜨겁다',level:'N5'},{id:1142,kanji:'冷たい',hiragana:'つめたい',korean:'차갑다',level:'N5'},{id:1143,kanji:'重い',hiragana:'おもい',korean:'무겁다',level:'N5'},{id:1144,kanji:'軽い',hiragana:'かるい',korean:'가볍다',level:'N5'},{id:1145,kanji:'長い',hiragana:'ながい',korean:'길다',level:'N5'},{id:1146,kanji:'短い',hiragana:'みじかい',korean:'짧다',level:'N5'},{id:1147,kanji:'広い',hiragana:'ひろい',korean:'넓다',level:'N5'},{id:1148,kanji:'狭い',hiragana:'せまい',korean:'좁다',level:'N5'},{id:1149,kanji:'多い',hiragana:'おおい',korean:'많다',level:'N5'},{id:1150,kanji:'少ない',hiragana:'すくない',korean:'적다',level:'N5'},
{id:1151,kanji:'早い',hiragana:'はやい',korean:'이르다/빠르다',level:'N5'},{id:1152,kanji:'遅い',hiragana:'おそい',korean:'늦다/느리다',level:'N5'},{id:1153,kanji:'強い',hiragana:'つよい',korean:'강하다',level:'N5'},{id:1154,kanji:'弱い',hiragana:'よわい',korean:'약하다',level:'N5'},{id:1155,kanji:'美しい',hiragana:'うつくしい',korean:'아름답다',level:'N5'},{id:1156,kanji:'嬉しい',hiragana:'うれしい',korean:'기쁘다',level:'N5'},{id:1157,kanji:'悲しい',hiragana:'かなしい',korean:'슬프다',level:'N5'},{id:1158,kanji:'楽しい',hiragana:'たのしい',korean:'즐겁다',level:'N5'},{id:1159,kanji:'怖い',hiragana:'こわい',korean:'무섭다',level:'N5'},{id:1160,kanji:'恥ずかしい',hiragana:'はずかしい',korean:'부끄럽다',level:'N5'},
{id:1161,kanji:'眠い',hiragana:'ねむい',korean:'졸리다',level:'N5'},{id:1162,kanji:'疲れる',hiragana:'つかれる',korean:'피곤하다',level:'N5'},{id:1163,kanji:'走る',hiragana:'はしる',korean:'달리다',level:'N5'},{id:1164,kanji:'飛ぶ',hiragana:'とぶ',korean:'날다',level:'N5'},{id:1165,kanji:'泣く',hiragana:'なく',korean:'울다',level:'N5'},{id:1166,kanji:'怒る',hiragana:'おこる',korean:'화내다',level:'N5'},{id:1167,kanji:'困る',hiragana:'こまる',korean:'곤란하다',level:'N5'},{id:1168,kanji:'急ぐ',hiragana:'いそぐ',korean:'서두르다',level:'N5'},{id:1169,kanji:'頑張る',hiragana:'がんばる',korean:'힘내다',level:'N5'},{id:1170,kanji:'思う',hiragana:'おもう',korean:'생각하다',level:'N5'},
{id:1171,kanji:'考える',hiragana:'かんがえる',korean:'생각하다(깊이)',level:'N5'},{id:1172,kanji:'使う',hiragana:'つかう',korean:'사용하다',level:'N5'},{id:1173,kanji:'切る',hiragana:'きる',korean:'자르다',level:'N5'},{id:1174,kanji:'引く',hiragana:'ひく',korean:'당기다',level:'N5'},{id:1175,kanji:'押す',hiragana:'おす',korean:'밀다',level:'N5'},{id:1176,kanji:'投げる',hiragana:'なげる',korean:'던지다',level:'N5'},{id:1177,kanji:'拾う',hiragana:'ひろう',korean:'줍다',level:'N5'},{id:1178,kanji:'置く',hiragana:'おく',korean:'놓다',level:'N5'},{id:1179,kanji:'取る',hiragana:'とる',korean:'잡다/가져가다',level:'N5'},{id:1180,kanji:'送る',hiragana:'おくる',korean:'보내다',level:'N5'},
{id:1181,kanji:'届く',hiragana:'とどく',korean:'닿다/도착하다',level:'N5'},{id:1182,kanji:'始まる',hiragana:'はじまる',korean:'시작되다',level:'N5'},{id:1183,kanji:'止まる',hiragana:'とまる',korean:'멈추다',level:'N5'},{id:1184,kanji:'変わる',hiragana:'かわる',korean:'바뀌다',level:'N5'},{id:1185,kanji:'続く',hiragana:'つづく',korean:'계속되다',level:'N5'},{id:1186,kanji:'国',hiragana:'くに',korean:'나라',level:'N5'},{id:1187,kanji:'日本',hiragana:'にほん',korean:'일본',level:'N5'},{id:1188,kanji:'韓国',hiragana:'かんこく',korean:'한국',level:'N5'},{id:1189,kanji:'英語',hiragana:'えいご',korean:'영어',level:'N5'},{id:1190,kanji:'日本語',hiragana:'にほんご',korean:'일본어',level:'N5'},
{id:1191,kanji:'人',hiragana:'ひと',korean:'사람',level:'N5'},{id:1192,kanji:'男',hiragana:'おとこ',korean:'남자',level:'N5'},{id:1193,kanji:'女',hiragana:'おんな',korean:'여자',level:'N5'},{id:1194,kanji:'皆',hiragana:'みんな',korean:'모두',level:'N5'},{id:1195,kanji:'誰',hiragana:'だれ',korean:'누구',level:'N5'},{id:1196,kanji:'何',hiragana:'なに',korean:'무엇',level:'N5'},{id:1197,kanji:'いつ',hiragana:'いつ',korean:'언제',level:'N5'},{id:1198,kanji:'どこ',hiragana:'どこ',korean:'어디',level:'N5'},{id:1199,kanji:'なぜ',hiragana:'なぜ',korean:'왜',level:'N5'},{id:1200,kanji:'大学',hiragana:'だいがく',korean:'대학교',level:'N5'},
{id:1201,kanji:'図書館',hiragana:'としょかん',korean:'도서관',level:'N5'},{id:1202,kanji:'掃除',hiragana:'そうじ',korean:'청소',level:'N5'},{id:1203,kanji:'洗濯',hiragana:'せんたく',korean:'세탁',level:'N5'},{id:1204,kanji:'料理',hiragana:'りょうり',korean:'요리',level:'N5'},{id:1205,kanji:'買い物',hiragana:'かいもの',korean:'쇼핑',level:'N5'},{id:1206,kanji:'散歩',hiragana:'さんぽ',korean:'산책',level:'N5'},{id:1207,kanji:'旅行',hiragana:'りょこう',korean:'여행',level:'N5'},{id:1208,kanji:'写真',hiragana:'しゃしん',korean:'사진',level:'N5'},{id:1209,kanji:'音楽',hiragana:'おんがく',korean:'음악',level:'N5'},{id:1210,kanji:'映画',hiragana:'えいが',korean:'영화',level:'N5'},
{id:1211,kanji:'試合',hiragana:'しあい',korean:'경기',level:'N5'},{id:1212,kanji:'勝つ',hiragana:'かつ',korean:'이기다',level:'N5'},{id:1213,kanji:'負ける',hiragana:'まける',korean:'지다',level:'N5'},{id:1214,kanji:'練習',hiragana:'れんしゅう',korean:'연습',level:'N5'},{id:1215,kanji:'授業',hiragana:'じゅぎょう',korean:'수업',level:'N5'},{id:1216,kanji:'宿題',hiragana:'しゅくだい',korean:'숙제',level:'N5'},{id:1217,kanji:'試験',hiragana:'しけん',korean:'시험',level:'N5'},{id:1218,kanji:'合格',hiragana:'ごうかく',korean:'합격',level:'N5'},{id:1219,kanji:'卒業',hiragana:'そつぎょう',korean:'졸업',level:'N5'},{id:1220,kanji:'入学',hiragana:'にゅうがく',korean:'입학',level:'N5'},
{id:1221,kanji:'勉強',hiragana:'べんきょう',korean:'공부',level:'N5'},{id:1222,kanji:'病気',hiragana:'びょうき',korean:'병',level:'N5'},{id:1223,kanji:'薬',hiragana:'くすり',korean:'약',level:'N5'},{id:1224,kanji:'医者',hiragana:'いしゃ',korean:'의사',level:'N5'},{id:1225,kanji:'熱',hiragana:'ねつ',korean:'열',level:'N5'},{id:1226,kanji:'風邪',hiragana:'かぜ',korean:'감기',level:'N5'},{id:1227,kanji:'お金',hiragana:'おかね',korean:'돈',level:'N5'},{id:1228,kanji:'値段',hiragana:'ねだん',korean:'가격',level:'N5'},{id:1229,kanji:'無料',hiragana:'むりょう',korean:'무료',level:'N5'},{id:1230,kanji:'割引',hiragana:'わりびき',korean:'할인',level:'N5'},
{id:1231,kanji:'冷蔵庫',hiragana:'れいぞうこ',korean:'냉장고',level:'N5'},{id:1232,kanji:'洗濯機',hiragana:'せんたくき',korean:'세탁기',level:'N5'},{id:1233,kanji:'エアコン',hiragana:'えあこん',korean:'에어컨',level:'N5'},{id:1234,kanji:'パソコン',hiragana:'ぱそこん',korean:'컴퓨터',level:'N5'},{id:1235,kanji:'スマホ',hiragana:'すまほ',korean:'스마트폰',level:'N5'},{id:1236,kanji:'仕事',hiragana:'しごと',korean:'일/직업',level:'N5'},{id:1237,kanji:'会社',hiragana:'かいしゃ',korean:'회사',level:'N5'},{id:1238,kanji:'給料',hiragana:'きゅうりょう',korean:'급료',level:'N5'},{id:1239,kanji:'すし',hiragana:'すし',korean:'초밥',level:'N5'},{id:1240,kanji:'味噌汁',hiragana:'みそしる',korean:'된장국',level:'N5'},
{id:1241,kanji:'自転車',hiragana:'じてんしゃ',korean:'자전거',level:'N5'},{id:1242,kanji:'車',hiragana:'くるま',korean:'자동차',level:'N5'},{id:1243,kanji:'飛行機',hiragana:'ひこうき',korean:'비행기',level:'N5'},{id:1244,kanji:'船',hiragana:'ふね',korean:'배',level:'N5'},{id:1245,kanji:'地下鉄',hiragana:'ちかてつ',korean:'지하철',level:'N5'},{id:1246,kanji:'予約する',hiragana:'よやくする',korean:'예약하다',level:'N5'},{id:1247,kanji:'注文する',hiragana:'ちゅうもんする',korean:'주문하다',level:'N5'},{id:1248,kanji:'決める',hiragana:'きめる',korean:'결정하다',level:'N5'},{id:1249,kanji:'選ぶ',hiragana:'えらぶ',korean:'선택하다',level:'N5'},{id:1250,kanji:'比べる',hiragana:'くらべる',korean:'비교하다',level:'N5'},
{id:1251,kanji:'調べる',hiragana:'しらべる',korean:'조사하다',level:'N5'},{id:1252,kanji:'探す',hiragana:'さがす',korean:'찾다',level:'N5'},{id:1253,kanji:'見つける',hiragana:'みつける',korean:'발견하다',level:'N5'},{id:1254,kanji:'壊す',hiragana:'こわす',korean:'부수다',level:'N5'},{id:1255,kanji:'直す',hiragana:'なおす',korean:'고치다',level:'N5'},{id:1256,kanji:'増える',hiragana:'ふえる',korean:'늘다',level:'N5'},{id:1257,kanji:'減る',hiragana:'へる',korean:'줄다',level:'N5'},{id:1258,kanji:'つける',hiragana:'つける',korean:'켜다',level:'N5'},{id:1259,kanji:'消す',hiragana:'けす',korean:'끄다/지우다',level:'N5'},{id:1260,kanji:'晴れる',hiragana:'はれる',korean:'맑다',level:'N5'},
{id:1261,kanji:'曇る',hiragana:'くもる',korean:'흐리다',level:'N5'},{id:1262,kanji:'降る',hiragana:'ふる',korean:'내리다',level:'N5'},{id:1263,kanji:'暖かい',hiragana:'あたたかい',korean:'따뜻하다',level:'N5'},{id:1264,kanji:'涼しい',hiragana:'すずしい',korean:'시원하다',level:'N5'},{id:1265,kanji:'正しい',hiragana:'ただしい',korean:'올바르다',level:'N5'},{id:1266,kanji:'同じ',hiragana:'おなじ',korean:'같다',level:'N5'},{id:1267,kanji:'違う',hiragana:'ちがう',korean:'다르다',level:'N5'},{id:1268,kanji:'大切だ',hiragana:'たいせつだ',korean:'소중하다',level:'N5'},{id:1269,kanji:'大丈夫だ',hiragana:'だいじょうぶだ',korean:'괜찮다',level:'N5'},{id:1270,kanji:'必要だ',hiragana:'ひつようだ',korean:'필요하다',level:'N5'},
{id:1271,kanji:'危険だ',hiragana:'きけんだ',korean:'위험하다',level:'N5'},{id:1272,kanji:'安全だ',hiragana:'あんぜんだ',korean:'안전하다',level:'N5'},{id:1273,kanji:'泊まる',hiragana:'とまる',korean:'묵다/숙박하다',level:'N5'},{id:1274,kanji:'集まる',hiragana:'あつまる',korean:'모이다',level:'N5'},{id:1275,kanji:'生まれる',hiragana:'うまれる',korean:'태어나다',level:'N5'},{id:1276,kanji:'働く',hiragana:'はたらく',korean:'일하다',level:'N5'},{id:1277,kanji:'払う',hiragana:'はらう',korean:'지불하다',level:'N5'},{id:1278,kanji:'優しい',hiragana:'やさしい',korean:'다정하다',level:'N5'},{id:1279,kanji:'厳しい',hiragana:'きびしい',korean:'엄격하다',level:'N5'},{id:1280,kanji:'懐かしい',hiragana:'なつかしい',korean:'그립다',level:'N5'},
{id:1281,kanji:'羨ましい',hiragana:'うらやましい',korean:'부럽다',level:'N5'},{id:1282,kanji:'甘い',hiragana:'あまい',korean:'달다',level:'N5'},{id:1283,kanji:'辛い',hiragana:'からい',korean:'맵다',level:'N5'},{id:1284,kanji:'苦い',hiragana:'にがい',korean:'쓰다',level:'N5'},{id:1285,kanji:'酸っぱい',hiragana:'すっぱい',korean:'시다',level:'N5'},{id:1286,kanji:'美味しい',hiragana:'おいしい',korean:'맛있다',level:'N5'},{id:1287,kanji:'見える',hiragana:'みえる',korean:'보이다',level:'N5'},{id:1288,kanji:'聞こえる',hiragana:'きこえる',korean:'들리다',level:'N5'},{id:1289,kanji:'感じる',hiragana:'かんじる',korean:'느끼다',level:'N5'},{id:1290,kanji:'覚える',hiragana:'おぼえる',korean:'외우다/기억하다',level:'N5'},
{id:1291,kanji:'信じる',hiragana:'しんじる',korean:'믿다',level:'N5'},{id:1292,kanji:'助ける',hiragana:'たすける',korean:'돕다',level:'N5'},{id:1293,kanji:'謝る',hiragana:'あやまる',korean:'사과하다',level:'N5'},{id:1294,kanji:'諦める',hiragana:'あきらめる',korean:'포기하다',level:'N5'},{id:1295,kanji:'続ける',hiragana:'つづける',korean:'계속하다',level:'N5'},{id:1296,kanji:'始める',hiragana:'はじめる',korean:'시작하다',level:'N5'},{id:1297,kanji:'楽しむ',hiragana:'たのしむ',korean:'즐기다',level:'N5'},{id:1298,kanji:'驚く',hiragana:'おどろく',korean:'놀라다',level:'N5'},{id:1299,kanji:'空港',hiragana:'くうこう',korean:'공항',level:'N5'},{id:1300,kanji:'郵便局',hiragana:'ゆうびんきょく',korean:'우체국',level:'N5'},
{id:1301,kanji:'警察',hiragana:'けいさつ',korean:'경찰',level:'N5'},{id:1302,kanji:'階段',hiragana:'かいだん',korean:'계단',level:'N5'},{id:1303,kanji:'出発',hiragana:'しゅっぱつ',korean:'출발',level:'N5'},{id:1304,kanji:'到着',hiragana:'とうちゃく',korean:'도착',level:'N5'},{id:1305,kanji:'荷物',hiragana:'にもつ',korean:'짐',level:'N5'},{id:1306,kanji:'質問',hiragana:'しつもん',korean:'질문',level:'N5'},{id:1307,kanji:'返事',hiragana:'へんじ',korean:'답장/대답',level:'N5'},{id:1308,kanji:'紹介',hiragana:'しょうかい',korean:'소개',level:'N5'},{id:1309,kanji:'挨拶',hiragana:'あいさつ',korean:'인사',level:'N5'},{id:1310,kanji:'誕生日',hiragana:'たんじょうび',korean:'생일',level:'N5'},
{id:1311,kanji:'プレゼント',hiragana:'ぷれぜんと',korean:'선물',level:'N5'},{id:1312,kanji:'希望',hiragana:'きぼう',korean:'희망',level:'N5'},{id:1313,kanji:'夢',hiragana:'ゆめ',korean:'꿈',level:'N5'},{id:1314,kanji:'目標',hiragana:'もくひょう',korean:'목표',level:'N5'},{id:1315,kanji:'成功',hiragana:'せいこう',korean:'성공',level:'N5'},{id:1316,kanji:'失敗',hiragana:'しっぱい',korean:'실패',level:'N5'},{id:1317,kanji:'努力',hiragana:'どりょく',korean:'노력',level:'N5'},{id:1318,kanji:'挑戦',hiragana:'ちょうせん',korean:'도전',level:'N5'},{id:1319,kanji:'記憶',hiragana:'きおく',korean:'기억',level:'N5'},{id:1320,kanji:'思い出',hiragana:'おもいで',korean:'추억',level:'N5'},
{id:1321,kanji:'未来',hiragana:'みらい',korean:'미래',level:'N5'},{id:1322,kanji:'過去',hiragana:'かこ',korean:'과거',level:'N5'},{id:1323,kanji:'現在',hiragana:'げんざい',korean:'현재',level:'N5'},{id:1324,kanji:'喜び',hiragana:'よろこび',korean:'기쁨',level:'N5'},{id:1325,kanji:'悲しみ',hiragana:'かなしみ',korean:'슬픔',level:'N5'},{id:1326,kanji:'怒り',hiragana:'いかり',korean:'분노',level:'N5'},{id:1327,kanji:'一番',hiragana:'いちばん',korean:'제일/가장',level:'N5'},{id:1328,kanji:'自分',hiragana:'じぶん',korean:'자신/스스로',level:'N5'},{id:1329,kanji:'皆さん',hiragana:'みなさん',korean:'여러분',level:'N5'},{id:1330,kanji:'色々',hiragana:'いろいろ',korean:'여러 가지',level:'N5'},
{id:1331,kanji:'たくさん',hiragana:'たくさん',korean:'많이',level:'N5'},{id:1332,kanji:'全部',hiragana:'ぜんぶ',korean:'전부',level:'N5'},{id:1333,kanji:'全然',hiragana:'ぜんぜん',korean:'전혀',level:'N5'},{id:1334,kanji:'本当に',hiragana:'ほんとうに',korean:'정말로',level:'N5'},{id:1335,kanji:'月曜日',hiragana:'げつようび',korean:'월요일',level:'N5'},{id:1336,kanji:'火曜日',hiragana:'かようび',korean:'화요일',level:'N5'},{id:1337,kanji:'水曜日',hiragana:'すいようび',korean:'수요일',level:'N5'},{id:1338,kanji:'木曜日',hiragana:'もくようび',korean:'목요일',level:'N5'},{id:1339,kanji:'金曜日',hiragana:'きんようび',korean:'금요일',level:'N5'},{id:1340,kanji:'土曜日',hiragana:'どようび',korean:'토요일',level:'N5'},
{id:1341,kanji:'日曜日',hiragana:'にちようび',korean:'일요일',level:'N5'},{id:1342,kanji:'一',hiragana:'いち',korean:'일(1)',level:'N5'},{id:1343,kanji:'二',hiragana:'に',korean:'이(2)',level:'N5'},{id:1344,kanji:'三',hiragana:'さん',korean:'삼(3)',level:'N5'},{id:1345,kanji:'四',hiragana:'し/よん',korean:'사(4)',level:'N5'},{id:1346,kanji:'五',hiragana:'ご',korean:'오(5)',level:'N5'},{id:1347,kanji:'六',hiragana:'ろく',korean:'육(6)',level:'N5'},{id:1348,kanji:'七',hiragana:'しち/なな',korean:'칠(7)',level:'N5'},{id:1349,kanji:'八',hiragana:'はち',korean:'팔(8)',level:'N5'},{id:1350,kanji:'九',hiragana:'く/きゅう',korean:'구(9)',level:'N5'},
{id:1351,kanji:'十',hiragana:'じゅう',korean:'십(10)',level:'N5'},{id:1352,kanji:'百',hiragana:'ひゃく',korean:'백(100)',level:'N5'},{id:1353,kanji:'千',hiragana:'せん',korean:'천(1000)',level:'N5'},{id:1354,kanji:'万',hiragana:'まん',korean:'만(10000)',level:'N5'},{id:1355,kanji:'木',hiragana:'き',korean:'나무',level:'N5'},{id:1356,kanji:'石',hiragana:'いし',korean:'돌',level:'N5'},{id:1357,kanji:'月',hiragana:'つき',korean:'달',level:'N5'},{id:1358,kanji:'星',hiragana:'ほし',korean:'별',level:'N5'},{id:1359,kanji:'太陽',hiragana:'たいよう',korean:'태양',level:'N5'},{id:1360,kanji:'雨',hiragana:'あめ',korean:'비',level:'N5'},
{id:1361,kanji:'雪',hiragana:'ゆき',korean:'눈',level:'N5'},{id:1362,kanji:'風',hiragana:'かぜ',korean:'바람',level:'N5'},{id:1363,kanji:'海',hiragana:'うみ',korean:'바다',level:'N5'},{id:1364,kanji:'島',hiragana:'しま',korean:'섬',level:'N5'},{id:1365,kanji:'犬',hiragana:'いぬ',korean:'개',level:'N5'},{id:1366,kanji:'猫',hiragana:'ねこ',korean:'고양이',level:'N5'},{id:1367,kanji:'鳥',hiragana:'とり',korean:'새',level:'N5'},{id:1368,kanji:'馬',hiragana:'うま',korean:'말',level:'N5'},{id:1369,kanji:'牛',hiragana:'うし',korean:'소',level:'N5'},{id:1370,kanji:'豚',hiragana:'ぶた',korean:'돼지',level:'N5'},
{id:1371,kanji:'服',hiragana:'ふく',korean:'옷',level:'N5'},{id:1372,kanji:'靴',hiragana:'くつ',korean:'신발',level:'N5'},{id:1373,kanji:'帽子',hiragana:'ぼうし',korean:'모자',level:'N5'},{id:1374,kanji:'眼鏡',hiragana:'めがね',korean:'안경',level:'N5'},{id:1375,kanji:'財布',hiragana:'さいふ',korean:'지갑',level:'N5'},{id:1376,kanji:'鍵',hiragana:'かぎ',korean:'열쇠',level:'N5'},{id:1377,kanji:'手紙',hiragana:'てがみ',korean:'편지',level:'N5'},{id:1378,kanji:'窓',hiragana:'まど',korean:'창문',level:'N5'},{id:1379,kanji:'机',hiragana:'つくえ',korean:'책상',level:'N5'},{id:1380,kanji:'椅子',hiragana:'いす',korean:'의자',level:'N5'},
{id:1381,kanji:'ベッド',hiragana:'べっど',korean:'침대',level:'N5'},{id:1382,kanji:'台所',hiragana:'だいどころ',korean:'부엌',level:'N5'},{id:1383,kanji:'お風呂',hiragana:'おふろ',korean:'욕조/목욕',level:'N5'},{id:1384,kanji:'玄関',hiragana:'げんかん',korean:'현관',level:'N5'},{id:1385,kanji:'庭',hiragana:'にわ',korean:'정원',level:'N5'},{id:1386,kanji:'道',hiragana:'みち',korean:'길',level:'N5'},{id:1387,kanji:'橋',hiragana:'はし',korean:'다리',level:'N5'},{id:1388,kanji:'公園',hiragana:'こうえん',korean:'공원',level:'N5'},{id:1389,kanji:'店',hiragana:'みせ',korean:'가게',level:'N5'},{id:1390,kanji:'好きだ',hiragana:'すきだ',korean:'좋아하다',level:'N5'},
{id:1391,kanji:'嫌いだ',hiragana:'きらいだ',korean:'싫어하다',level:'N5'},{id:1392,kanji:'静かだ',hiragana:'しずかだ',korean:'조용하다',level:'N5'},{id:1393,kanji:'元気だ',hiragana:'げんきだ',korean:'건강하다',level:'N5'},{id:1394,kanji:'便利だ',hiragana:'べんりだ',korean:'편리하다',level:'N5'},{id:1395,kanji:'綺麗だ',hiragana:'きれいだ',korean:'예쁘다/깨끗하다',level:'N5'},{id:1396,kanji:'有名だ',hiragana:'ゆうめいだ',korean:'유명하다',level:'N5'},{id:1397,kanji:'親切だ',hiragana:'しんせつだ',korean:'친절하다',level:'N5'},{id:1398,kanji:'とても',hiragana:'とても',korean:'매우',level:'N5'},{id:1399,kanji:'少し',hiragana:'すこし',korean:'조금',level:'N5'},{id:1400,kanji:'ゆっくり',hiragana:'ゆっくり',korean:'천천히',level:'N5'},
{id:1401,kanji:'すぐに',hiragana:'すぐに',korean:'즉시',level:'N5'},{id:1402,kanji:'いつも',hiragana:'いつも',korean:'언제나',level:'N5'},{id:1403,kanji:'時々',hiragana:'ときどき',korean:'때때로',level:'N5'},{id:1404,kanji:'一緒に',hiragana:'いっしょに',korean:'함께',level:'N5'},{id:1405,kanji:'もっと',hiragana:'もっと',korean:'좀 더',level:'N5'},{id:1406,kanji:'ちょうど',hiragana:'ちょうど',korean:'딱/마침',level:'N5'},{id:1407,kanji:'得意だ',hiragana:'とくいだ',korean:'자신 있다',level:'N5'},{id:1408,kanji:'苦手だ',hiragana:'にがてだ',korean:'서툴다',level:'N5'},{id:1409,kanji:'大好きだ',hiragana:'だいすきだ',korean:'매우 좋아하다',level:'N5'},{id:1410,kanji:'気をつける',hiragana:'きをつける',korean:'조심하다',level:'N5'},
{id:1411,kanji:'間に合う',hiragana:'まにあう',korean:'시간에 맞다',level:'N5'},{id:1412,kanji:'役に立つ',hiragana:'やくにたつ',korean:'도움이 되다',level:'N5'},{id:1413,kanji:'上手だ',hiragana:'じょうずだ',korean:'잘하다',level:'N5'},{id:1414,kanji:'下手だ',hiragana:'へただ',korean:'서툴다',level:'N5'},{id:1415,kanji:'去年',hiragana:'きょねん',korean:'작년',level:'N5'},{id:1416,kanji:'今年',hiragana:'ことし',korean:'올해',level:'N5'},{id:1417,kanji:'来年',hiragana:'らいねん',korean:'내년',level:'N5'},{id:1418,kanji:'先週',hiragana:'せんしゅう',korean:'지난주',level:'N5'},{id:1419,kanji:'今週',hiragana:'こんしゅう',korean:'이번 주',level:'N5'},{id:1420,kanji:'来週',hiragana:'らいしゅう',korean:'다음 주',level:'N5'},
{id:1421,kanji:'テレビ',hiragana:'てれび',korean:'텔레비전',level:'N5'},{id:1422,kanji:'ラジオ',hiragana:'らじお',korean:'라디오',level:'N5'},{id:1423,kanji:'カメラ',hiragana:'かめら',korean:'카메라',level:'N5'},{id:1424,kanji:'ノート',hiragana:'のーと',korean:'노트',level:'N5'},{id:1425,kanji:'ホテル',hiragana:'ほてる',korean:'호텔',level:'N5'},{id:1426,kanji:'トイレ',hiragana:'といれ',korean:'화장실',level:'N5'},{id:1427,kanji:'バス',hiragana:'ばす',korean:'버스',level:'N5'},{id:1428,kanji:'タクシー',hiragana:'たくしー',korean:'택시',level:'N5'},{id:1429,kanji:'スポーツ',hiragana:'すぽーつ',korean:'스포츠',level:'N5'},{id:1430,kanji:'ゲーム',hiragana:'げーむ',korean:'게임',level:'N5'},
{id:1431,kanji:'インターネット',hiragana:'いんたーねっと',korean:'인터넷',level:'N5'},{id:1432,kanji:'メール',hiragana:'めーる',korean:'이메일',level:'N5'},{id:1433,kanji:'住所',hiragana:'じゅうしょ',korean:'주소',level:'N5'},{id:1434,kanji:'色',hiragana:'いろ',korean:'색',level:'N5'},{id:1435,kanji:'形',hiragana:'かたち',korean:'모양',level:'N5'},{id:1436,kanji:'大きさ',hiragana:'おおきさ',korean:'크기',level:'N5'},{id:1437,kanji:'重さ',hiragana:'おもさ',korean:'무게',level:'N5'},{id:1438,kanji:'長さ',hiragana:'ながさ',korean:'길이',level:'N5'},{id:1439,kanji:'高さ',hiragana:'たかさ',korean:'높이',level:'N5'},{id:1440,kanji:'可能性',hiragana:'かのうせい',korean:'가능성',level:'N5'},
{id:1441,kanji:'重要性',hiragana:'じゅうようせい',korean:'중요성',level:'N5'},{id:1442,kanji:'試す',hiragana:'ためす',korean:'시험해보다',level:'N5'},{id:1443,kanji:'お願いします',hiragana:'おねがいします',korean:'부탁합니다',level:'N5'},{id:1444,kanji:'ありがとう',hiragana:'ありがとう',korean:'감사해요',level:'N5'},{id:1445,kanji:'すみません',hiragana:'すみません',korean:'죄송합니다',level:'N5'},{id:1446,kanji:'よろしく',hiragana:'よろしく',korean:'잘 부탁해요',level:'N5'},{id:1447,kanji:'おはよう',hiragana:'おはよう',korean:'안녕(아침)',level:'N5'},{id:1448,kanji:'こんにちは',hiragana:'こんにちは',korean:'안녕(낮)',level:'N5'},{id:1449,kanji:'こんばんは',hiragana:'こんばんは',korean:'안녕(저녁)',level:'N5'},{id:1450,kanji:'おやすみ',hiragana:'おやすみ',korean:'잘 자요',level:'N5'},
{id:1451,kanji:'さようなら',hiragana:'さようなら',korean:'안녕히 가세요',level:'N5'},{id:1452,kanji:'いただきます',hiragana:'いただきます',korean:'잘 먹겠습니다',level:'N5'},{id:1453,kanji:'ごちそうさま',hiragana:'ごちそうさま',korean:'잘 먹었습니다',level:'N5'},{id:1454,kanji:'お疲れ様',hiragana:'おつかれさま',korean:'수고했어요',level:'N5'},{id:1455,kanji:'いってきます',hiragana:'いってきます',korean:'다녀오겠습니다',level:'N5'},{id:1456,kanji:'ただいま',hiragana:'ただいま',korean:'다녀왔습니다',level:'N5'},{id:1457,kanji:'本当ですか',hiragana:'ほんとうですか',korean:'정말이에요?',level:'N5'},{id:1458,kanji:'どういたしまして',hiragana:'どういたしまして',korean:'천만에요',level:'N5'},{id:1459,kanji:'失礼します',hiragana:'しつれいします',korean:'실례합니다',level:'N5'},{id:1460,kanji:'大丈夫',hiragana:'だいじょうぶ',korean:'괜찮아',level:'N5'},
{id:1461,kanji:'そうですか',hiragana:'そうですか',korean:'그렇군요',level:'N5'},{id:1462,kanji:'なるほど',hiragana:'なるほど',korean:'그렇군요/과연',level:'N5'},{id:1463,kanji:'確かに',hiragana:'たしかに',korean:'확실히',level:'N5'},{id:1464,kanji:'様々',hiragana:'さまざま',korean:'다양한',level:'N5'},{id:1465,kanji:'大抵',hiragana:'たいてい',korean:'대개',level:'N5'},{id:1466,kanji:'お互い',hiragana:'おたがい',korean:'서로',level:'N5'},{id:1467,kanji:'他人',hiragana:'たにん',korean:'타인',level:'N5'},{id:1468,kanji:'仲良し',hiragana:'なかよし',korean:'사이 좋음',level:'N5'},{id:1469,kanji:'気になる',hiragana:'きになる',korean:'신경 쓰이다',level:'N5'},{id:1470,kanji:'楽になる',hiragana:'らくになる',korean:'편해지다',level:'N5'},
{id:1471,kanji:'上手になる',hiragana:'じょうずになる',korean:'잘하게 되다',level:'N5'},{id:1472,kanji:'疲れ',hiragana:'つかれ',korean:'피로',level:'N5'},{id:1473,kanji:'笑い',hiragana:'わらい',korean:'웃음',level:'N5'},{id:1474,kanji:'痛み',hiragana:'いたみ',korean:'아픔',level:'N5'},{id:1475,kanji:'楽しさ',hiragana:'たのしさ',korean:'즐거움',level:'N5'},{id:1476,kanji:'美しさ',hiragana:'うつくしさ',korean:'아름다움',level:'N5'},{id:1477,kanji:'優しさ',hiragana:'やさしさ',korean:'다정함',level:'N5'},{id:1478,kanji:'強さ',hiragana:'つよさ',korean:'강함',level:'N5'},{id:1479,kanji:'大切にする',hiragana:'たいせつにする',korean:'소중히 하다',level:'N5'},{id:1480,kanji:'一緒',hiragana:'いっしょ',korean:'함께',level:'N5'},
{id:1481,kanji:'どんな',hiragana:'どんな',korean:'어떤',level:'N5'},{id:1482,kanji:'こんな',hiragana:'こんな',korean:'이런',level:'N5'},{id:1483,kanji:'そんな',hiragana:'そんな',korean:'그런',level:'N5'},{id:1484,kanji:'あんな',hiragana:'あんな',korean:'저런',level:'N5'},{id:1485,kanji:'先月',hiragana:'せんげつ',korean:'지난달',level:'N5'},{id:1486,kanji:'来月',hiragana:'らいげつ',korean:'다음 달',level:'N5'},{id:1487,kanji:'一月',hiragana:'いちがつ',korean:'1월',level:'N5'},{id:1488,kanji:'二月',hiragana:'にがつ',korean:'2월',level:'N5'},{id:1489,kanji:'三月',hiragana:'さんがつ',korean:'3월',level:'N5'},{id:1490,kanji:'六月',hiragana:'ろくがつ',korean:'6월',level:'N5'},
{id:1491,kanji:'十二月',hiragana:'じゅうにがつ',korean:'12월',level:'N5'},{id:1492,kanji:'じゃあね',hiragana:'じゃあね',korean:'잘 있어/그럼 또',level:'N5'},{id:1493,kanji:'する',hiragana:'する',korean:'하다',level:'N5'},{id:1494,kanji:'言う',hiragana:'いう',korean:'말하다',level:'N5'},{id:1495,kanji:'つまらない',hiragana:'つまらない',korean:'재미없다',level:'N5'},{id:1496,kanji:'元気',hiragana:'げんき',korean:'건강하다, 활기차다',level:'N5'},{id:1497,kanji:'静か',hiragana:'しずか',korean:'조용하다',level:'N5'},{id:1498,kanji:'好き',hiragana:'すき',korean:'좋아하다',level:'N5'},{id:1499,kanji:'嫌い',hiragana:'きらい',korean:'싫어하다',level:'N5'},{id:1500,kanji:'暇',hiragana:'ひま',korean:'한가하다',level:'N5'},
{id:1501,kanji:'隣',hiragana:'となり',korean:'옆',level:'N5'},{id:1502,kanji:'外',hiragana:'そと',korean:'밖',level:'N5'},{id:1503,kanji:'ここ',hiragana:'ここ',korean:'여기',level:'N5'},{id:1504,kanji:'そこ',hiragana:'そこ',korean:'거기',level:'N5'},{id:1505,kanji:'あそこ',hiragana:'あそこ',korean:'저기',level:'N5'},{id:1506,kanji:'にぎやか',hiragana:'にぎやか',korean:'번화하다, 활기차다',level:'N5'},{id:1507,kanji:'子',hiragana:'こ',korean:'아이',level:'N5'},{id:1508,kanji:'日',hiragana:'ひ/にち',korean:'날, 해',level:'N5'},{id:1509,kanji:'火',hiragana:'ひ/か',korean:'불, 화요일',level:'N5'},{id:1510,kanji:'金',hiragana:'かね/きん',korean:'돈, 금요일',level:'N5'},
{id:1511,kanji:'土',hiragana:'つち/ど',korean:'흙, 토요일',level:'N5'},{id:1512,kanji:'天',hiragana:'てん',korean:'하늘',level:'N5'},{id:1513,kanji:'気',hiragana:'き',korean:'기운, 기분',level:'N5'},{id:1514,kanji:'電',hiragana:'でん',korean:'전기',level:'N5'},{id:1515,kanji:'学',hiragana:'がく/まなぶ',korean:'배우다, 학문',level:'N5'},{id:1516,kanji:'校',hiragana:'こう',korean:'학교(교)',level:'N5'},{id:1517,kanji:'生',hiragana:'せい/いきる',korean:'살다, 학생',level:'N5'},{id:1518,kanji:'先',hiragana:'せん',korean:'먼저, 선생',level:'N5'},{id:1519,kanji:'年',hiragana:'とし/ねん',korean:'해, 년',level:'N5'},{id:1520,kanji:'時',hiragana:'とき/じ',korean:'시간',level:'N5'},
{id:1521,kanji:'分',hiragana:'ふん/ぶん',korean:'분',level:'N5'},{id:1522,kanji:'半',hiragana:'はん',korean:'반',level:'N5'},{id:1523,kanji:'名',hiragana:'な/めい',korean:'이름',level:'N5'},{id:1524,kanji:'語',hiragana:'ご',korean:'언어',level:'N5'},{id:1525,kanji:'セール',hiragana:'セール',korean:'세일',level:'N5'},{id:1526,kanji:'箱',hiragana:'はこ',korean:'상자',level:'N5'},{id:1527,kanji:'店員',hiragana:'てんいん',korean:'점원',level:'N5'},{id:1528,kanji:'教室',hiragana:'きょうしつ',korean:'교실',level:'N5'},{id:1529,kanji:'乗る',hiragana:'のる',korean:'타다',level:'N5'},{id:1530,kanji:'降りる',hiragana:'おりる',korean:'내리다',level:'N5'},
{id:1531,kanji:'近く',hiragana:'ちかく',korean:'근처',level:'N5'},{id:1532,kanji:'毎日',hiragana:'まいにち',korean:'매일',level:'N5'},{id:1533,kanji:'所',hiragana:'ところ',korean:'장소',level:'N5'},{id:1534,kanji:'疲れた',hiragana:'つかれた',korean:'피곤하다',level:'N5'},{id:1535,kanji:'いってらっしゃい',hiragana:'いってらっしゃい',korean:'잘 다녀와',level:'N5'},{id:1536,kanji:'おかえりなさい',hiragana:'おかえりなさい',korean:'어서 와요',level:'N5'},{id:1537,kanji:'いらっしゃいませ',hiragana:'いらっしゃいませ',korean:'어서 오세요',level:'N5'},{id:1538,kanji:'はじめまして',hiragana:'はじめまして',korean:'처음 뵙겠습니다',level:'N5'},{id:1539,kanji:'よろしくおねがいします',hiragana:'よろしくおねがいします',korean:'잘 부탁드립니다',level:'N5'},{id:1540,kanji:'ごめんなさい',hiragana:'ごめんなさい',korean:'미안해요',level:'N5'},
{id:1541,kanji:'いいですね',hiragana:'いいですね',korean:'좋네요, 괜찮네요',level:'N5'},{id:1542,kanji:'いいえ',hiragana:'いいえ',korean:'아니요',level:'N5'},{id:1543,kanji:'赤い',hiragana:'あかい',korean:'빨갛다, 붉다',level:'N5'},{id:1544,kanji:'後',hiragana:'あと',korean:'뒤, 나중',level:'N5'},{id:1545,kanji:'外国',hiragana:'がいこく',korean:'외국',level:'N5'},{id:1546,kanji:'火よう日',hiragana:'かようび',korean:'화요일(火曜日)',level:'N5'},{id:1547,kanji:'金よう日',hiragana:'きんようび',korean:'금요일(金曜日)',level:'N5'},{id:1548,kanji:'午後',hiragana:'ごご',korean:'오후',level:'N5'},{id:1549,kanji:'今月',hiragana:'こんげつ',korean:'이번 달',level:'N5'},{id:1550,kanji:'四月',hiragana:'しがつ',korean:'4월',level:'N5'},
{id:1551,kanji:'七月',hiragana:'しちがつ',korean:'7월',level:'N5'},{id:1552,kanji:'七時',hiragana:'しちじ',korean:'7시',level:'N5'},{id:1553,kanji:'白い',hiragana:'しろい',korean:'희다, 하얗다',level:'N5'},{id:1554,kanji:'千円',hiragana:'せんえん',korean:'1000엔',level:'N5'},{id:1555,kanji:'出す',hiragana:'だす',korean:'내다, 제출하다',level:'N5'},{id:1556,kanji:'十日',hiragana:'とおか',korean:'10일',level:'N5'},{id:1557,kanji:'土よう日',hiragana:'どようび',korean:'토요일(土曜日)',level:'N5'},{id:1558,kanji:'何人',hiragana:'なんにん',korean:'몇 명',level:'N5'},{id:1559,kanji:'見せる',hiragana:'みせる',korean:'보이다, 보여주다',level:'N5'},{id:1560,kanji:'木よう日',hiragana:'もくようび',korean:'목요일(木曜日)',level:'N5'},
{id:1561,kanji:'有名',hiragana:'ゆうめい',korean:'유명함',level:'N5'},{id:1562,kanji:'アパート',hiragana:'アパート',korean:'아파트',level:'N5'},{id:1563,kanji:'一昨年',hiragana:'おととし',korean:'재작년',level:'N5'},{id:1564,kanji:'お風呂に入る',hiragana:'おふろにはいる',korean:'목욕하다',level:'N5'},{id:1565,kanji:'かぶる',hiragana:'かぶる',korean:'(모자를) 쓰다',level:'N5'},{id:1566,kanji:'汚い',hiragana:'きたない',korean:'더럽다, 지저분하다',level:'N5'},{id:1567,kanji:'切符',hiragana:'きっぷ',korean:'표, 티켓',level:'N5'},{id:1568,kanji:'紅茶',hiragana:'こうちゃ',korean:'홍차',level:'N5'},{id:1569,kanji:'こちらこそ',hiragana:'こちらこそ',korean:'저야말로',level:'N5'},{id:1570,kanji:'質問する',hiragana:'しつもんする',korean:'질문하다',level:'N5'},
{id:1571,kanji:'シャワーを浴びる',hiragana:'シャワーをあびる',korean:'샤워하다',level:'N5'},{id:1572,kanji:'上手',hiragana:'じょうず',korean:'능숙함, 잘함',level:'N5'},{id:1573,kanji:'スカート',hiragana:'スカート',korean:'스커트, 치마',level:'N5'},{id:1574,kanji:'セーター',hiragana:'セーター',korean:'스웨터',level:'N5'},{id:1575,kanji:'それでは',hiragana:'それでは',korean:'그럼',level:'N5'},{id:1576,kanji:'大切',hiragana:'たいせつ',korean:'중요함, 소중함',level:'N5'},{id:1577,kanji:'たぶん',hiragana:'たぶん',korean:'아마',level:'N5'},{id:1578,kanji:'でも',hiragana:'でも',korean:'하지만, 그렇지만',level:'N5'},{id:1579,kanji:'どうぞよろしく',hiragana:'どうぞよろしく',korean:'잘 부탁합니다',level:'N5'},{id:1580,kanji:'習う',hiragana:'ならう',korean:'배우다, 익히다',level:'N5'},
{id:1581,kanji:'何個',hiragana:'なんこ',korean:'몇 개',level:'N5'},{id:1582,kanji:'登る',hiragana:'のぼる',korean:'(산을) 오르다',level:'N5'},{id:1583,kanji:'履く',hiragana:'はく',korean:'(바지를) 입다, (신발・양말을) 신다',level:'N5'},{id:1584,kanji:'貼る',hiragana:'はる',korean:'붙이다',level:'N5'},{id:1585,kanji:'ピアノ',hiragana:'ピアノ',korean:'피아노',level:'N5'},{id:1586,kanji:'吹く',hiragana:'ふく',korean:'(바람이) 불다',level:'N5'},{id:1587,kanji:'二日',hiragana:'ふつか',korean:'2일, 초이틀',level:'N5'},{id:1588,kanji:'便利',hiragana:'べんり',korean:'편리함',level:'N5'},{id:1589,kanji:'ほしい',hiragana:'ほしい',korean:'가지고 싶다',level:'N5'},{id:1590,kanji:'本屋',hiragana:'ほんや',korean:'책방, 서점',level:'N5'},
{id:1591,kanji:'毎週',hiragana:'まいしゅう',korean:'매주',level:'N5'},{id:1592,kanji:'曲がる',hiragana:'まがる',korean:'돌다, (방향을) 틀다',level:'N5'},{id:1593,kanji:'また',hiragana:'また',korean:'또',level:'N5'},{id:1594,kanji:'八日',hiragana:'ようか',korean:'8일, 여드레',level:'N5'},{id:1595,kanji:'若い',hiragana:'わかい',korean:'젊다',level:'N5'},{id:1596,kanji:'渡す',hiragana:'わたす',korean:'건네다',level:'N5'},{id:1597,kanji:'渡る',hiragana:'わたる',korean:'건너다',level:'N5'},{id:1598,kanji:'レストラン',hiragana:'レストラン',korean:'레스토랑',level:'N5'},{id:1599,kanji:'明るい',hiragana:'あかるい',korean:'밝다',level:'N5'},{id:1600,kanji:'暗い',hiragana:'くらい',korean:'어둡다',level:'N5'},
{id:1601,kanji:'六日',hiragana:'むいか',korean:'6일',level:'N5'},{id:1602,kanji:'子ども',hiragana:'こども',korean:'아이, 어린이',level:'N5'},{id:1603,kanji:'ご飯',hiragana:'ごはん',korean:'밥, 식사',level:'N5'},{id:1604,kanji:'うれしい',hiragana:'うれしい',korean:'기쁘다',level:'N5'},{id:1605,kanji:'おいしい',hiragana:'おいしい',korean:'맛있다',level:'N5'},{id:1606,kanji:'本',hiragana:'ほん',korean:'책, 본',level:'N5'},{id:1607,kanji:'水',hiragana:'みず/すい',korean:'물, 수요일',level:'N5'},{id:1608,kanji:'うれしい',hiragana:'うれしい',korean:'기쁘다',level:'N5'},

// ── N4 (일단합격 JLPT N4 단어장) ──────────────────
{id:2001,kanji:'開ける',hiragana:'あける',korean:'(문을) 열다',level:'N4'},{id:2002,kanji:'味',hiragana:'あじ',korean:'맛',level:'N4'},{id:2003,kanji:'頭',hiragana:'あたま',korean:'머리',level:'N4'},{id:2004,kanji:'暑い',hiragana:'あつい',korean:'덥다',level:'N4'},{id:2005,kanji:'歩く',hiragana:'あるく',korean:'걷다',level:'N4'},{id:2006,kanji:'安心',hiragana:'あんしん',korean:'안심',level:'N4'},{id:2007,kanji:'以外',hiragana:'いがい',korean:'이외',level:'N4'},{id:2008,kanji:'池',hiragana:'いけ',korean:'연못',level:'N4'},{id:2009,kanji:'医者',hiragana:'いしゃ',korean:'의사',level:'N4'},{id:2010,kanji:'急ぐ',hiragana:'いそぐ',korean:'서두르다',level:'N4'},
{id:2011,kanji:'妹',hiragana:'いもうと',korean:'여동생',level:'N4'},{id:2012,kanji:'色',hiragana:'いろ',korean:'색',level:'N4'},{id:2013,kanji:'歌',hiragana:'うた',korean:'노래',level:'N4'},{id:2014,kanji:'海',hiragana:'うみ',korean:'바다',level:'N4'},{id:2015,kanji:'運動',hiragana:'うんどう',korean:'운동',level:'N4'},{id:2016,kanji:'英語',hiragana:'えいご',korean:'영어',level:'N4'},{id:2017,kanji:'多い',hiragana:'おおい',korean:'많다',level:'N4'},{id:2018,kanji:'送る',hiragana:'おくる',korean:'보내다',level:'N4'},{id:2019,kanji:'重い',hiragana:'おもい',korean:'무겁다',level:'N4'},{id:2020,kanji:'終わる',hiragana:'おわる',korean:'끝나다',level:'N4'},
{id:2021,kanji:'音楽',hiragana:'おんがく',korean:'음악',level:'N4'},{id:2022,kanji:'返す',hiragana:'かえす',korean:'돌려주다',level:'N4'},{id:2023,kanji:'帰る',hiragana:'かえる',korean:'돌아가(오)다',level:'N4'},{id:2024,kanji:'貸す',hiragana:'かす',korean:'빌려주다',level:'N4'},{id:2025,kanji:'風',hiragana:'かぜ',korean:'바람',level:'N4'},{id:2026,kanji:'家族',hiragana:'かぞく',korean:'가족',level:'N4'},{id:2027,kanji:'通う',hiragana:'かよう',korean:'다니다, 통학하다',level:'N4'},{id:2028,kanji:'体',hiragana:'からだ',korean:'몸',level:'N4'},{id:2029,kanji:'借りる',hiragana:'かりる',korean:'빌리다',level:'N4'},{id:2030,kanji:'考える',hiragana:'かんがえる',korean:'생각하다',level:'N4'},
{id:2031,kanji:'気分',hiragana:'きぶん',korean:'기분',level:'N4'},{id:2032,kanji:'着物',hiragana:'きもの',korean:'옷, 일본 전통 의상',level:'N4'},{id:2033,kanji:'急に',hiragana:'きゅうに',korean:'갑자기',level:'N4'},{id:2034,kanji:'教室',hiragana:'きょうしつ',korean:'교실',level:'N4'},{id:2035,kanji:'去年',hiragana:'きょねん',korean:'작년',level:'N4'},{id:2036,kanji:'着る',hiragana:'きる',korean:'(옷을) 입다',level:'N4'},{id:2037,kanji:'銀行',hiragana:'ぎんこう',korean:'은행',level:'N4'},{id:2038,kanji:'近所',hiragana:'きんじょ',korean:'근처, 부근',level:'N4'},{id:2039,kanji:'黒い',hiragana:'くろい',korean:'검다',level:'N4'},{id:2040,kanji:'計画',hiragana:'けいかく',korean:'계획',level:'N4'},
{id:2041,kanji:'研究',hiragana:'けんきゅう',korean:'연구',level:'N4'},{id:2042,kanji:'公園',hiragana:'こうえん',korean:'공원',level:'N4'},{id:2043,kanji:'工場',hiragana:'こうじょう',korean:'공장',level:'N4'},{id:2044,kanji:'声',hiragana:'こえ',korean:'목소리',level:'N4'},{id:2045,kanji:'今度',hiragana:'こんど',korean:'지난번, 이번, 다음번',level:'N4'},{id:2046,kanji:'魚',hiragana:'さかな',korean:'생선, 물고기',level:'N4'},{id:2047,kanji:'産業',hiragana:'さんぎょう',korean:'산업',level:'N4'},{id:2048,kanji:'仕事',hiragana:'しごと',korean:'일, 업무',level:'N4'},{id:2049,kanji:'質問',hiragana:'しつもん',korean:'질문',level:'N4'},{id:2050,kanji:'自転車',hiragana:'じてんしゃ',korean:'자전거',level:'N4'},
{id:2051,kanji:'品物',hiragana:'しなもの',korean:'물건',level:'N4'},{id:2052,kanji:'死ぬ',hiragana:'しぬ',korean:'죽다',level:'N4'},{id:2053,kanji:'自分',hiragana:'じぶん',korean:'자기, 자신',level:'N4'},{id:2054,kanji:'写真家',hiragana:'しゃしんか',korean:'사진가',level:'N4'},{id:2055,kanji:'住所',hiragana:'じゅうしょ',korean:'주소',level:'N4'},{id:2056,kanji:'出発',hiragana:'しゅっぱつ',korean:'출발',level:'N4'},{id:2057,kanji:'食堂',hiragana:'しょくどう',korean:'식당',level:'N4'},{id:2058,kanji:'食料品',hiragana:'しょくりょうひん',korean:'식료품',level:'N4'},{id:2059,kanji:'知る',hiragana:'しる',korean:'알다',level:'N4'},{id:2060,kanji:'人口',hiragana:'じんこう',korean:'인구',level:'N4'},
{id:2061,kanji:'親切',hiragana:'しんせつ',korean:'친절함',level:'N4'},{id:2062,kanji:'進む',hiragana:'すすむ',korean:'나아가다, 진보하다',level:'N4'},{id:2063,kanji:'住む',hiragana:'すむ',korean:'살다, 거주하다',level:'N4'},{id:2064,kanji:'西洋',hiragana:'せいよう',korean:'서양',level:'N4'},{id:2065,kanji:'世界',hiragana:'せかい',korean:'세계',level:'N4'},{id:2066,kanji:'説明',hiragana:'せつめい',korean:'설명',level:'N4'},{id:2067,kanji:'世話',hiragana:'せわ',korean:'돌봄, 폐, 신세',level:'N4'},{id:2068,kanji:'祖母',hiragana:'そぼ',korean:'조모, 할머니',level:'N4'},{id:2069,kanji:'空',hiragana:'そら',korean:'하늘',level:'N4'},{id:2070,kanji:'台所',hiragana:'だいどころ',korean:'부엌',level:'N4'},
{id:2071,kanji:'建物',hiragana:'たてもの',korean:'건물',level:'N4'},{id:2072,kanji:'楽しい',hiragana:'たのしい',korean:'즐겁다',level:'N4'},{id:2073,kanji:'足りる',hiragana:'たりる',korean:'족하다, 충분하다',level:'N4'},{id:2074,kanji:'力',hiragana:'ちから',korean:'힘',level:'N4'},{id:2075,kanji:'茶色',hiragana:'ちゃいろ',korean:'갈색',level:'N4'},{id:2076,kanji:'注意',hiragana:'ちゅうい',korean:'주의',level:'N4'},{id:2077,kanji:'地理',hiragana:'ちり',korean:'지리',level:'N4'},{id:2078,kanji:'使う',hiragana:'つかう',korean:'사용하다',level:'N4'},{id:2079,kanji:'着く',hiragana:'つく',korean:'도착하다',level:'N4'},{id:2080,kanji:'強い',hiragana:'つよい',korean:'강하다, 세다',level:'N4'},
{id:2081,kanji:'手紙',hiragana:'てがみ',korean:'편지',level:'N4'},{id:2082,kanji:'通る',hiragana:'とおる',korean:'통과하다, 지나다',level:'N4'},{id:2083,kanji:'特に',hiragana:'とくに',korean:'특히',level:'N4'},{id:2084,kanji:'特別',hiragana:'とくべつ',korean:'특별',level:'N4'},{id:2085,kanji:'図書館',hiragana:'としょかん',korean:'도서관',level:'N4'},{id:2086,kanji:'止まる',hiragana:'とまる',korean:'멈추다',level:'N4'},{id:2087,kanji:'鳥',hiragana:'とり',korean:'새',level:'N4'},{id:2088,kanji:'夏',hiragana:'なつ',korean:'여름',level:'N4'},{id:2089,kanji:'運ぶ',hiragana:'はこぶ',korean:'옮기다',level:'N4'},{id:2090,kanji:'走る',hiragana:'はしる',korean:'달리다',level:'N4'},
{id:2091,kanji:'働く',hiragana:'はたらく',korean:'일하다',level:'N4'},{id:2092,kanji:'早い',hiragana:'はやい',korean:'이르다, 빠르다',level:'N4'},{id:2093,kanji:'早く',hiragana:'はやく',korean:'일찍, 빨리',level:'N4'},{id:2094,kanji:'春',hiragana:'はる',korean:'봄',level:'N4'},{id:2095,kanji:'病院',hiragana:'びょういん',korean:'병원',level:'N4'},{id:2096,kanji:'広い',hiragana:'ひろい',korean:'넓다',level:'N4'},{id:2097,kanji:'服',hiragana:'ふく',korean:'옷',level:'N4'},{id:2098,kanji:'不便',hiragana:'ふべん',korean:'불편함',level:'N4'},{id:2099,kanji:'古い',hiragana:'ふるい',korean:'오래되다, 낡다',level:'N4'},{id:2100,kanji:'勉強',hiragana:'べんきょう',korean:'공부',level:'N4'},
{id:2101,kanji:'毎朝',hiragana:'まいあさ',korean:'매일 아침',level:'N4'},{id:2102,kanji:'町',hiragana:'まち',korean:'도회, 거리, 번화가',level:'N4'},{id:2103,kanji:'待つ',hiragana:'まつ',korean:'기다리다',level:'N4'},{id:2104,kanji:'店',hiragana:'みせ',korean:'가게',level:'N4'},{id:2105,kanji:'野菜',hiragana:'やさい',korean:'야채',level:'N4'},{id:2106,kanji:'安い',hiragana:'やすい',korean:'싸다',level:'N4'},{id:2107,kanji:'夕方',hiragana:'ゆうがた',korean:'저녁',level:'N4'},{id:2108,kanji:'有名',hiragana:'ゆうめい',korean:'유명함',level:'N4'},{id:2109,kanji:'用意',hiragana:'ようい',korean:'준비, 대비, 주의',level:'N4'},{id:2110,kanji:'洋服',hiragana:'ようふく',korean:'양복, 서양식 옷',level:'N4'},
{id:2111,kanji:'夜',hiragana:'よる',korean:'밤',level:'N4'},{id:2112,kanji:'弱い',hiragana:'よわい',korean:'약하다',level:'N4'},{id:2113,kanji:'料理',hiragana:'りょうり',korean:'요리',level:'N4'},{id:2114,kanji:'旅館',hiragana:'りょかん',korean:'여관',level:'N4'},{id:2115,kanji:'旅行',hiragana:'りょこう',korean:'여행',level:'N4'},{id:2116,kanji:'悪い',hiragana:'わるい',korean:'나쁘다, 안 좋다',level:'N4'},{id:2117,kanji:'会う',hiragana:'あう',korean:'만나다',level:'N4'},{id:2118,kanji:'青い',hiragana:'あおい',korean:'파랗다',level:'N4'},{id:2119,kanji:'赤い',hiragana:'あかい',korean:'빨갛다, 붉다',level:'N4'},{id:2120,kanji:'明るい',hiragana:'あかるい',korean:'밝다',level:'N4'},
{id:2121,kanji:'秋',hiragana:'あき',korean:'가을',level:'N4'},{id:2122,kanji:'新しい',hiragana:'あたらしい',korean:'새롭다',level:'N4'},{id:2123,kanji:'集まる',hiragana:'あつまる',korean:'모이다',level:'N4'},{id:2124,kanji:'姉',hiragana:'あね',korean:'언니, 누나',level:'N4'},{id:2125,kanji:'洗う',hiragana:'あらう',korean:'씻다',level:'N4'},{id:2126,kanji:'歩く',hiragana:'あるく',korean:'걷다',level:'N4'},{id:2127,kanji:'言う',hiragana:'いう',korean:'말하다',level:'N4'},{id:2128,kanji:'急ぐ',hiragana:'いそぐ',korean:'서두르다',level:'N4'},{id:2129,kanji:'犬',hiragana:'いぬ',korean:'개',level:'N4'},{id:2130,kanji:'歌',hiragana:'うた',korean:'노래',level:'N4'},
{id:2131,kanji:'売る',hiragana:'うる',korean:'팔다',level:'N4'},{id:2132,kanji:'駅',hiragana:'えき',korean:'역',level:'N4'},{id:2133,kanji:'起きる',hiragana:'おきる',korean:'일어나다',level:'N4'},{id:2134,kanji:'教える',hiragana:'おしえる',korean:'가르치다',level:'N4'},{id:2135,kanji:'弟',hiragana:'おとうと',korean:'남동생',level:'N4'},{id:2136,kanji:'同じ',hiragana:'おなじ',korean:'같음, 동일함',level:'N4'},{id:2137,kanji:'思い出す',hiragana:'おもいだす',korean:'생각해내다',level:'N4'},{id:2138,kanji:'買う',hiragana:'かう',korean:'사다, 구입하다',level:'N4'},{id:2139,kanji:'牛肉',hiragana:'ぎゅうにく',korean:'쇠고기',level:'N4'},{id:2140,kanji:'暗い',hiragana:'くらい',korean:'어둡다',level:'N4'},
{id:2141,kanji:'答える',hiragana:'こたえる',korean:'대답하다',level:'N4'},{id:2142,kanji:'小鳥',hiragana:'ことり',korean:'작은 새',level:'N4'},{id:2143,kanji:'十分',hiragana:'じゅうぶん',korean:'충분히',level:'N4'},{id:2144,kanji:'正しい',hiragana:'ただしい',korean:'바르다, 옳다',level:'N4'},{id:2145,kanji:'建てる',hiragana:'たてる',korean:'(건물을) 세우다, 짓다',level:'N4'},{id:2146,kanji:'地図',hiragana:'ちず',korean:'지도',level:'N4'},{id:2147,kanji:'作る',hiragana:'つくる',korean:'만들다',level:'N4'},{id:2148,kanji:'時計',hiragana:'とけい',korean:'시계',level:'N4'},{id:2149,kanji:'習う',hiragana:'ならう',korean:'익히다, 배우다',level:'N4'},{id:2150,kanji:'飲む',hiragana:'のむ',korean:'마시다, 삼키다',level:'N4'},
{id:2151,kanji:'始まる',hiragana:'はじまる',korean:'시작되다',level:'N4'},{id:2152,kanji:'間に合う',hiragana:'まにあう',korean:'제시간에 맞추다',level:'N4'},{id:2153,kanji:'持つ',hiragana:'もつ',korean:'가지다, 들다',level:'N4'},{id:2154,kanji:'別れる',hiragana:'わかれる',korean:'헤어지다',level:'N4'},{id:2155,kanji:'アイディア',hiragana:'あいでぃあ',korean:'아이디어',level:'N4'},{id:2156,kanji:'謝る',hiragana:'あやまる',korean:'사과하다',level:'N4'},{id:2157,kanji:'アルバイト',hiragana:'あるばいと',korean:'아르바이트',level:'N4'},{id:2158,kanji:'安全',hiragana:'あんぜん',korean:'안전함',level:'N4'},{id:2159,kanji:'案内',hiragana:'あんない',korean:'안내',level:'N4'},{id:2160,kanji:'以下',hiragana:'いか',korean:'이하',level:'N4'},
{id:2161,kanji:'植える',hiragana:'うえる',korean:'(나무를) 심다',level:'N4'},{id:2162,kanji:'打つ',hiragana:'うつ',korean:'부딪치다',level:'N4'},{id:2163,kanji:'腕',hiragana:'うで',korean:'팔',level:'N4'},{id:2164,kanji:'お祝い',hiragana:'おいわい',korean:'축하 선물',level:'N4'},{id:2165,kanji:'屋上',hiragana:'おくじょう',korean:'옥상',level:'N4'},{id:2166,kanji:'お釣り',hiragana:'おつり',korean:'거스름돈',level:'N4'},{id:2167,kanji:'おもちゃ',hiragana:'おもちゃ',korean:'장난감',level:'N4'},{id:2168,kanji:'折れる',hiragana:'おれる',korean:'꺾이다, 접히다',level:'N4'},{id:2169,kanji:'会場',hiragana:'かいじょう',korean:'회장(장소)',level:'N4'},{id:2170,kanji:'鏡',hiragana:'かがみ',korean:'거울',level:'N4'},
{id:2171,kanji:'固い',hiragana:'かたい',korean:'딱딱하다',level:'N4'},{id:2172,kanji:'壁',hiragana:'かべ',korean:'벽',level:'N4'},{id:2173,kanji:'噛む',hiragana:'かむ',korean:'씹다',level:'N4'},{id:2174,kanji:'関係',hiragana:'かんけい',korean:'관계',level:'N4'},{id:2175,kanji:'機会',hiragana:'きかい',korean:'기회',level:'N4'},{id:2176,kanji:'技術',hiragana:'ぎじゅつ',korean:'기술',level:'N4'},{id:2177,kanji:'競争',hiragana:'きょうそう',korean:'경쟁',level:'N4'},{id:2178,kanji:'興味',hiragana:'きょうみ',korean:'흥미, 관심',level:'N4'},{id:2179,kanji:'比べる',hiragana:'くらべる',korean:'비교하다',level:'N4'},{id:2180,kanji:'怖い',hiragana:'こわい',korean:'무섭다',level:'N4'},
{id:2181,kanji:'坂',hiragana:'さか',korean:'언덕',level:'N4'},{id:2182,kanji:'触る',hiragana:'さわる',korean:'만지다',level:'N4'},{id:2183,kanji:'残念',hiragana:'ざんねん',korean:'유감스러움, 섭섭함',level:'N4'},{id:2184,kanji:'失敗',hiragana:'しっぱい',korean:'실패, 실수',level:'N4'},{id:2185,kanji:'失礼',hiragana:'しつれい',korean:'실례임',level:'N4'},{id:2186,kanji:'邪魔',hiragana:'じゃま',korean:'거추장스러움',level:'N4'},{id:2187,kanji:'準備',hiragana:'じゅんび',korean:'준비',level:'N4'},{id:2188,kanji:'招待',hiragana:'しょうたい',korean:'초대',level:'N4'},{id:2189,kanji:'成功',hiragana:'せいこう',korean:'성공',level:'N4'},{id:2190,kanji:'生産',hiragana:'せいさん',korean:'생산',level:'N4'},
{id:2191,kanji:'先輩',hiragana:'せんぱい',korean:'선배',level:'N4'},{id:2192,kanji:'相談',hiragana:'そうだん',korean:'상담',level:'N4'},{id:2193,kanji:'確かに',hiragana:'たしかに',korean:'분명히, 확실하게',level:'N4'},{id:2194,kanji:'足す',hiragana:'たす',korean:'더하다',level:'N4'},{id:2195,kanji:'出す',hiragana:'だす',korean:'내다, 제출하다',level:'N4'},{id:2196,kanji:'暖房',hiragana:'だんぼう',korean:'난방',level:'N4'},{id:2197,kanji:'中止',hiragana:'ちゅうし',korean:'중지',level:'N4'},{id:2198,kanji:'直す',hiragana:'なおす',korean:'고치다',level:'N4'},{id:2199,kanji:'治る',hiragana:'なおる',korean:'(병이) 낫다',level:'N4'},{id:2200,kanji:'苦い',hiragana:'にがい',korean:'(맛이) 쓰다',level:'N4'},
{id:2201,kanji:'日本製',hiragana:'にほんせい',korean:'일본제(품)',level:'N4'},{id:2202,kanji:'熱心',hiragana:'ねっしん',korean:'열심임',level:'N4'},{id:2203,kanji:'眠い',hiragana:'ねむい',korean:'졸리다',level:'N4'},{id:2204,kanji:'喉',hiragana:'のど',korean:'목(구멍)',level:'N4'},{id:2205,kanji:'恥ずかしい',hiragana:'はずかしい',korean:'부끄럽다',level:'N4'},{id:2206,kanji:'引き出し',hiragana:'ひきだし',korean:'서랍',level:'N4'},{id:2207,kanji:'太る',hiragana:'ふとる',korean:'뚱뚱해지다',level:'N4'},{id:2208,kanji:'貿易',hiragana:'ぼうえき',korean:'무역',level:'N4'},{id:2209,kanji:'放送',hiragana:'ほうそう',korean:'방송',level:'N4'},{id:2210,kanji:'翻訳',hiragana:'ほんやく',korean:'번역',level:'N4'},
{id:2211,kanji:'見つかる',hiragana:'みつかる',korean:'발견되다',level:'N4'},{id:2212,kanji:'珍しい',hiragana:'めずらしい',korean:'진귀하다, 드물다',level:'N4'},{id:2213,kanji:'役に立つ',hiragana:'やくにたつ',korean:'도움이 되다',level:'N4'},{id:2214,kanji:'柔らかい',hiragana:'やわらかい',korean:'부드럽다',level:'N4'},{id:2215,kanji:'予約',hiragana:'よやく',korean:'예약',level:'N4'},{id:2216,kanji:'寄る',hiragana:'よる',korean:'들르다',level:'N4'},{id:2217,kanji:'利用',hiragana:'りよう',korean:'이용',level:'N4'},{id:2218,kanji:'連絡',hiragana:'れんらく',korean:'연락',level:'N4'},{id:2219,kanji:'謝る',hiragana:'あやまる',korean:'사과하다',level:'N4'},{id:2220,kanji:'安全',hiragana:'あんぜん',korean:'안전함',level:'N4'},
{id:2221,kanji:'意見',hiragana:'いけん',korean:'의견',level:'N4'},{id:2222,kanji:'おとなしい',hiragana:'おとなしい',korean:'얌전하다',level:'N4'},{id:2223,kanji:'驚く',hiragana:'おどろく',korean:'놀라다',level:'N4'},{id:2224,kanji:'お礼',hiragana:'おれい',korean:'감사 인사',level:'N4'},{id:2225,kanji:'片付ける',hiragana:'かたづける',korean:'정리하다, 치우다',level:'N4'},{id:2226,kanji:'機会',hiragana:'きかい',korean:'기회',level:'N4'},{id:2227,kanji:'きびしい',hiragana:'きびしい',korean:'엄하다, 엄격하다',level:'N4'},{id:2228,kanji:'原因',hiragana:'げんいん',korean:'원인',level:'N4'},{id:2229,kanji:'元気',hiragana:'げんき',korean:'건강함',level:'N4'},{id:2230,kanji:'故障',hiragana:'こしょう',korean:'고장',level:'N4'},
{id:2231,kanji:'差し上げる',hiragana:'さしあげる',korean:'드리다',level:'N4'},{id:2232,kanji:'さびしい',hiragana:'さびしい',korean:'쓸쓸하다, 외롭다',level:'N4'},{id:2233,kanji:'寒い',hiragana:'さむい',korean:'춥다',level:'N4'},{id:2234,kanji:'叱る',hiragana:'しかる',korean:'꾸짖다',level:'N4'},{id:2235,kanji:'支度',hiragana:'したく',korean:'준비, 채비',level:'N4'},{id:2236,kanji:'閉める',hiragana:'しめる',korean:'(문 따위를) 닫다',level:'N4'},{id:2237,kanji:'捨てる',hiragana:'すてる',korean:'버리다',level:'N4'},{id:2238,kanji:'洗濯',hiragana:'せんたく',korean:'세탁',level:'N4'},{id:2239,kanji:'育てる',hiragana:'そだてる',korean:'기르다, 키우다',level:'N4'},{id:2240,kanji:'大抵',hiragana:'たいてい',korean:'대체로',level:'N4'},
{id:2241,kanji:'中止',hiragana:'ちゅうし',korean:'중지',level:'N4'},{id:2242,kanji:'伝える',hiragana:'つたえる',korean:'전하다, 전달하다',level:'N4'},{id:2243,kanji:'適当',hiragana:'てきとう',korean:'적당함',level:'N4'},{id:2244,kanji:'とうとう',hiragana:'とうとう',korean:'드디어, 마침내',level:'N4'},{id:2245,kanji:'途中',hiragana:'とちゅう',korean:'도중',level:'N4'},{id:2246,kanji:'似合う',hiragana:'にあう',korean:'어울리다',level:'N4'},{id:2247,kanji:'熱',hiragana:'ねつ',korean:'열',level:'N4'},{id:2248,kanji:'プレゼント',hiragana:'ぷれぜんと',korean:'선물',level:'N4'},{id:2249,kanji:'返事',hiragana:'へんじ',korean:'대답',level:'N4'},{id:2250,kanji:'真面目',hiragana:'まじめ',korean:'진지함, 성실함',level:'N4'},
{id:2251,kanji:'迎える',hiragana:'むかえる',korean:'맞이하다',level:'N4'},{id:2252,kanji:'喜ぶ',hiragana:'よろこぶ',korean:'기뻐하다',level:'N4'},{id:2253,kanji:'沸かす',hiragana:'わかす',korean:'(물을) 끓이다',level:'N4'},{id:2254,kanji:'番組',hiragana:'ばんぐみ',korean:'(방송) 프로그램',level:'N4'},{id:2255,kanji:'ゲーム',hiragana:'げーむ',korean:'게임',level:'N4'},{id:2256,kanji:'郊外',hiragana:'こうがい',korean:'교외',level:'N4'},{id:2257,kanji:'細かい',hiragana:'こまかい',korean:'잘다, 세세하다',level:'N4'},{id:2258,kanji:'さっき',hiragana:'さっき',korean:'아까',level:'N4'},{id:2259,kanji:'パートタイム',hiragana:'ぱーとたいむ',korean:'파트타임',level:'N4'},{id:2260,kanji:'なるべく',hiragana:'なるべく',korean:'되도록, 가능한 한',level:'N4'},


// ── N3 (일단합격 JLPT N3 단어장) ──────────────────
{id:3001,kanji:'岩',hiragana:'いわ',korean:'바위',level:'N3'},{id:3002,kanji:'通勤',hiragana:'つうきん',korean:'통근',level:'N3'},{id:3003,kanji:'努力',hiragana:'どりょく',korean:'노력',level:'N3'},{id:3004,kanji:'発見',hiragana:'はっけん',korean:'발견',level:'N3'},{id:3005,kanji:'得意な',hiragana:'とくいな',korean:'자신 있는, 잘하는',level:'N3'},{id:3006,kanji:'表す',hiragana:'あらわす',korean:'나타내다',level:'N3'},{id:3007,kanji:'包む',hiragana:'つつむ',korean:'포장하다',level:'N3'},{id:3008,kanji:'息',hiragana:'いき',korean:'숨',level:'N3'},{id:3009,kanji:'空席',hiragana:'くうせき',korean:'공석, 빈자리',level:'N3'},{id:3010,kanji:'失業',hiragana:'しつぎょう',korean:'실업',level:'N3'},
{id:3011,kanji:'夫婦',hiragana:'ふうふ',korean:'부부',level:'N3'},{id:3012,kanji:'移す',hiragana:'うつす',korean:'옮기다',level:'N3'},{id:3013,kanji:'組む',hiragana:'くむ',korean:'짜다, 맞추다',level:'N3'},{id:3014,kanji:'順番',hiragana:'じゅんばん',korean:'순서, 순번',level:'N3'},{id:3015,kanji:'苦労',hiragana:'くろう',korean:'고생',level:'N3'},{id:3016,kanji:'応募',hiragana:'おうぼ',korean:'응모',level:'N3'},{id:3017,kanji:'首都',hiragana:'しゅと',korean:'수도',level:'N3'},{id:3018,kanji:'単語',hiragana:'たんご',korean:'단어',level:'N3'},{id:3019,kanji:'地球',hiragana:'ちきゅう',korean:'지구',level:'N3'},{id:3020,kanji:'発表',hiragana:'はっぴょう',korean:'발표',level:'N3'},
{id:3021,kanji:'遅れる',hiragana:'おくれる',korean:'늦다',level:'N3'},{id:3022,kanji:'協力',hiragana:'きょうりょく',korean:'협력',level:'N3'},{id:3023,kanji:'疑問',hiragana:'ぎもん',korean:'의문, 질문',level:'N3'},{id:3024,kanji:'過去',hiragana:'かこ',korean:'과거',level:'N3'},{id:3025,kanji:'到着',hiragana:'とうちゃく',korean:'도착',level:'N3'},{id:3026,kanji:'折る',hiragana:'おる',korean:'접다, 굽히다',level:'N3'},{id:3027,kanji:'情報',hiragana:'じょうほう',korean:'정보',level:'N3'},{id:3028,kanji:'値段',hiragana:'ねだん',korean:'가격',level:'N3'},{id:3029,kanji:'深い',hiragana:'ふかい',korean:'깊다',level:'N3'},{id:3030,kanji:'返す',hiragana:'かえす',korean:'돌려주다',level:'N3'},
{id:3031,kanji:'表面',hiragana:'ひょうめん',korean:'표면',level:'N3'},{id:3032,kanji:'汗',hiragana:'あせ',korean:'땀',level:'N3'},{id:3033,kanji:'配る',hiragana:'くばる',korean:'나누어 주다',level:'N3'},{id:3034,kanji:'完成',hiragana:'かんせい',korean:'완성',level:'N3'},{id:3035,kanji:'島',hiragana:'しま',korean:'섬',level:'N3'},{id:3036,kanji:'困る',hiragana:'こまる',korean:'곤란하다',level:'N3'},{id:3037,kanji:'平日',hiragana:'へいじつ',korean:'평일',level:'N3'},{id:3038,kanji:'卒業',hiragana:'そつぎょう',korean:'졸업',level:'N3'},{id:3039,kanji:'固い',hiragana:'かたい',korean:'딱딱하다',level:'N3'},{id:3040,kanji:'短い',hiragana:'みじかい',korean:'짧다',level:'N3'},
{id:3041,kanji:'他人',hiragana:'たにん',korean:'타인',level:'N3'},{id:3042,kanji:'示す',hiragana:'しめす',korean:'나타내다',level:'N3'},{id:3043,kanji:'外科',hiragana:'げか',korean:'외과',level:'N3'},{id:3044,kanji:'笑顔',hiragana:'えがお',korean:'웃는 얼굴, 미소',level:'N3'},{id:3045,kanji:'以降',hiragana:'いこう',korean:'이후',level:'N3'},{id:3046,kanji:'横断',hiragana:'おうだん',korean:'횡단',level:'N3'},{id:3047,kanji:'合図',hiragana:'あいず',korean:'신호',level:'N3'},{id:3048,kanji:'苦しい',hiragana:'くるしい',korean:'괴롭다',level:'N3'},{id:3049,kanji:'出張',hiragana:'しゅっちょう',korean:'출장',level:'N3'},{id:3050,kanji:'席',hiragana:'せき',korean:'좌석',level:'N3'},
{id:3051,kanji:'根',hiragana:'ね',korean:'뿌리',level:'N3'},{id:3052,kanji:'事情',hiragana:'じじょう',korean:'사정',level:'N3'},{id:3053,kanji:'通知',hiragana:'つうち',korean:'통지',level:'N3'},{id:3054,kanji:'選手',hiragana:'せんしゅ',korean:'선수',level:'N3'},{id:3055,kanji:'実力',hiragana:'じつりょく',korean:'실력',level:'N3'},{id:3056,kanji:'生える',hiragana:'はえる',korean:'나다, 돋아나다',level:'N3'},{id:3057,kanji:'各地',hiragana:'かくち',korean:'각지',level:'N3'},{id:3058,kanji:'貯金',hiragana:'ちょきん',korean:'저금',level:'N3'},{id:3059,kanji:'留守',hiragana:'るす',korean:'부재',level:'N3'},{id:3060,kanji:'浅い',hiragana:'あさい',korean:'얕다',level:'N3'},
{id:3061,kanji:'文章',hiragana:'ぶんしょう',korean:'문장',level:'N3'},{id:3062,kanji:'改札',hiragana:'かいさつ',korean:'개찰',level:'N3'},{id:3063,kanji:'笑う',hiragana:'わらう',korean:'웃다',level:'N3'},{id:3064,kanji:'商業',hiragana:'しょうぎょう',korean:'상업',level:'N3'},{id:3065,kanji:'覚える',hiragana:'おぼえる',korean:'외우다, 기억하다',level:'N3'},{id:3066,kanji:'広告',hiragana:'こうこく',korean:'광고',level:'N3'},{id:3067,kanji:'相手',hiragana:'あいて',korean:'상대',level:'N3'},{id:3068,kanji:'大会',hiragana:'たいかい',korean:'대회',level:'N3'},{id:3069,kanji:'割れる',hiragana:'われる',korean:'깨지다, 나누어지다',level:'N3'},{id:3070,kanji:'集中',hiragana:'しゅうちゅう',korean:'집중',level:'N3'},
{id:3071,kanji:'食器',hiragana:'しょっき',korean:'식기',level:'N3'},{id:3072,kanji:'横',hiragana:'よこ',korean:'옆, 가로',level:'N3'},{id:3073,kanji:'自然',hiragana:'しぜん',korean:'자연',level:'N3'},{id:3074,kanji:'替える',hiragana:'かえる',korean:'교체하다',level:'N3'},{id:3075,kanji:'応用',hiragana:'おうよう',korean:'응용',level:'N3'},{id:3076,kanji:'一般的な',hiragana:'いっぱんてきな',korean:'일반적인',level:'N3'},{id:3077,kanji:'検査',hiragana:'けんさ',korean:'검사',level:'N3'},{id:3078,kanji:'厚い',hiragana:'あつい',korean:'두껍다',level:'N3'},{id:3079,kanji:'呼吸',hiragana:'こきゅう',korean:'호흡',level:'N3'},{id:3080,kanji:'美しい',hiragana:'うつくしい',korean:'아름답다',level:'N3'},
{id:3081,kanji:'創造',hiragana:'そうぞう',korean:'창조',level:'N3'},{id:3082,kanji:'汚れる',hiragana:'よごれる',korean:'더러워지다',level:'N3'},{id:3083,kanji:'朝食',hiragana:'ちょうしょく',korean:'조식, 아침 식사',level:'N3'},{id:3084,kanji:'首',hiragana:'くび',korean:'목',level:'N3'},{id:3085,kanji:'経営学',hiragana:'けいえいがく',korean:'경영학',level:'N3'},{id:3086,kanji:'分類',hiragana:'ぶんるい',korean:'분류',level:'N3'},{id:3087,kanji:'干す',hiragana:'ほす',korean:'(널어) 말리다',level:'N3'},{id:3088,kanji:'血液型',hiragana:'けつえきがた',korean:'혈액형',level:'N3'},{id:3089,kanji:'湖',hiragana:'みずうみ',korean:'호수',level:'N3'},{id:3090,kanji:'変化',hiragana:'へんか',korean:'변화',level:'N3'},
{id:3091,kanji:'伝える',hiragana:'つたえる',korean:'전달하다',level:'N3'},{id:3092,kanji:'荷物',hiragana:'にもつ',korean:'짐',level:'N3'},{id:3093,kanji:'平均',hiragana:'へいきん',korean:'평균',level:'N3'},{id:3094,kanji:'支給する',hiragana:'しきゅうする',korean:'지급하다',level:'N3'},{id:3095,kanji:'丸い',hiragana:'まるい',korean:'둥글다',level:'N3'},{id:3096,kanji:'個人',hiragana:'こじん',korean:'개인',level:'N3'},{id:3097,kanji:'方向',hiragana:'ほうこう',korean:'방향',level:'N3'},{id:3098,kanji:'申し込み',hiragana:'もうしこみ',korean:'신청',level:'N3'},{id:3099,kanji:'はかる',hiragana:'はかる',korean:'재다, 측정하다',level:'N3'},{id:3100,kanji:'独立',hiragana:'どくりつ',korean:'독립',level:'N3'},
{id:3101,kanji:'折れる',hiragana:'おれる',korean:'부러지다, 꺾이다',level:'N3'},{id:3102,kanji:'観客',hiragana:'かんきゃく',korean:'관객',level:'N3'},{id:3103,kanji:'払う',hiragana:'はらう',korean:'지불하다',level:'N3'},{id:3104,kanji:'加える',hiragana:'くわえる',korean:'추가하다',level:'N3'},{id:3105,kanji:'訓練',hiragana:'くんれん',korean:'훈련',level:'N3'},{id:3106,kanji:'豆',hiragana:'まめ',korean:'콩',level:'N3'},{id:3107,kanji:'共通',hiragana:'きょうつう',korean:'공통',level:'N3'},{id:3108,kanji:'税金',hiragana:'ぜいきん',korean:'세금',level:'N3'},{id:3109,kanji:'汚い',hiragana:'きたない',korean:'더럽다',level:'N3'},{id:3110,kanji:'商品',hiragana:'しょうひん',korean:'상품',level:'N3'},
{id:3111,kanji:'冷える',hiragana:'ひえる',korean:'차가워지다, 식다',level:'N3'},{id:3112,kanji:'早退',hiragana:'そうたい',korean:'조퇴',level:'N3'},{id:3113,kanji:'転ぶ',hiragana:'ころぶ',korean:'구르다',level:'N3'},{id:3114,kanji:'主要',hiragana:'しゅよう',korean:'주요',level:'N3'},{id:3115,kanji:'直接',hiragana:'ちょくせつ',korean:'직접',level:'N3'},{id:3116,kanji:'燃える',hiragana:'もえる',korean:'타다, 불타다',level:'N3'},{id:3117,kanji:'位置',hiragana:'いち',korean:'위치',level:'N3'},{id:3118,kanji:'計算',hiragana:'けいさん',korean:'계산',level:'N3'},{id:3119,kanji:'回す',hiragana:'まわす',korean:'돌리다',level:'N3'},{id:3120,kanji:'禁煙',hiragana:'きんえん',korean:'금연',level:'N3'},
{id:3121,kanji:'結ぶ',hiragana:'むすぶ',korean:'잇다, 묶다',level:'N3'},{id:3122,kanji:'手術',hiragana:'しゅじゅつ',korean:'수술',level:'N3'},{id:3123,kanji:'正常',hiragana:'せいじょう',korean:'정상',level:'N3'},{id:3124,kanji:'血液',hiragana:'けつえき',korean:'혈액',level:'N3'},{id:3125,kanji:'追う',hiragana:'おう',korean:'뒤쫓다',level:'N3'},{id:3126,kanji:'降りる',hiragana:'おりる',korean:'내리다',level:'N3'},{id:3127,kanji:'身長',hiragana:'しんちょう',korean:'신장, 키',level:'N3'},{id:3128,kanji:'物語',hiragana:'ものがたり',korean:'이야기',level:'N3'},{id:3129,kanji:'成績',hiragana:'せいせき',korean:'성적',level:'N3'},{id:3130,kanji:'楽器',hiragana:'がっき',korean:'악기',level:'N3'},
{id:3131,kanji:'専門家',hiragana:'せんもんか',korean:'전문가',level:'N3'},{id:3132,kanji:'制服',hiragana:'せいふく',korean:'제복, 교복',level:'N3'},{id:3133,kanji:'内側',hiragana:'うちがわ',korean:'안쪽',level:'N3'},{id:3134,kanji:'過ごす',hiragana:'すごす',korean:'지내다, 보내다',level:'N3'},{id:3135,kanji:'案内',hiragana:'あんない',korean:'안내',level:'N3'},{id:3136,kanji:'解決',hiragana:'かいけつ',korean:'해결',level:'N3'},{id:3137,kanji:'気温',hiragana:'きおん',korean:'기온',level:'N3'},{id:3138,kanji:'健康',hiragana:'けんこう',korean:'건강',level:'N3'},{id:3139,kanji:'大量',hiragana:'たいりょう',korean:'대량',level:'N3'},{id:3140,kanji:'痛い',hiragana:'いたい',korean:'아프다',level:'N3'},
{id:3141,kanji:'現在',hiragana:'げんざい',korean:'현재',level:'N3'},{id:3142,kanji:'自由',hiragana:'じゆう',korean:'자유',level:'N3'},{id:3143,kanji:'法律',hiragana:'ほうりつ',korean:'법률',level:'N3'},{id:3144,kanji:'観光',hiragana:'かんこう',korean:'관광',level:'N3'},{id:3145,kanji:'涙',hiragana:'なみだ',korean:'눈물',level:'N3'},{id:3146,kanji:'守る',hiragana:'まもる',korean:'지키다',level:'N3'},{id:3147,kanji:'週刊誌',hiragana:'しゅうかんし',korean:'주간지',level:'N3'},{id:3148,kanji:'相談',hiragana:'そうだん',korean:'상담',level:'N3'},{id:3149,kanji:'自信',hiragana:'じしん',korean:'자신(자신감)',level:'N3'},{id:3150,kanji:'温める',hiragana:'あたためる',korean:'따뜻하게 하다',level:'N3'},
{id:3151,kanji:'原料',hiragana:'げんりょう',korean:'원료',level:'N3'},{id:3152,kanji:'帰宅',hiragana:'きたく',korean:'귀가',level:'N3'},{id:3153,kanji:'育てる',hiragana:'そだてる',korean:'키우다, 기르다',level:'N3'},{id:3154,kanji:'記録',hiragana:'きろく',korean:'기록',level:'N3'},{id:3155,kanji:'歯',hiragana:'は',korean:'이, 치아',level:'N3'},{id:3156,kanji:'復習',hiragana:'ふくしゅう',korean:'복습',level:'N3'},{id:3157,kanji:'信じる',hiragana:'しんじる',korean:'믿다',level:'N3'},{id:3158,kanji:'遅い',hiragana:'おそい',korean:'느리다, 늦다',level:'N3'},{id:3159,kanji:'容器',hiragana:'ようき',korean:'용기(그릇)',level:'N3'},{id:3160,kanji:'疲れる',hiragana:'つかれる',korean:'피로하다',level:'N3'},
{id:3161,kanji:'重ねる',hiragana:'かさねる',korean:'거듭하다',level:'N3'},{id:3162,kanji:'残業',hiragana:'ざんぎょう',korean:'잔업',level:'N3'},{id:3163,kanji:'停電',hiragana:'ていでん',korean:'정전',level:'N3'},{id:3164,kanji:'独身',hiragana:'どくしん',korean:'독신',level:'N3'},{id:3165,kanji:'逃げる',hiragana:'にげる',korean:'달아나다, 도망치다',level:'N3'},{id:3166,kanji:'消す',hiragana:'けす',korean:'끄다, 지우다',level:'N3'},{id:3167,kanji:'欠席',hiragana:'けっせき',korean:'결석',level:'N3'},{id:3168,kanji:'細かい',hiragana:'こまかい',korean:'자세하다, 작다',level:'N3'},{id:3169,kanji:'若い',hiragana:'わかい',korean:'젊다',level:'N3'},{id:3170,kanji:'複数',hiragana:'ふくすう',korean:'복수(여러 개)',level:'N3'},
{id:3171,kanji:'減少',hiragana:'げんしょう',korean:'감소',level:'N3'},{id:3172,kanji:'駐車',hiragana:'ちゅうしゃ',korean:'주차',level:'N3'},{id:3173,kanji:'移る',hiragana:'うつる',korean:'옮기다',level:'N3'},{id:3174,kanji:'温泉',hiragana:'おんせん',korean:'온천',level:'N3'},{id:3175,kanji:'雑誌',hiragana:'ざっし',korean:'잡지',level:'N3'},{id:3176,kanji:'恋しい',hiragana:'こいしい',korean:'그립다',level:'N3'},{id:3177,kanji:'仮定する',hiragana:'かていする',korean:'가정하다',level:'N3'},{id:3178,kanji:'正解',hiragana:'せいかい',korean:'정답',level:'N3'},{id:3179,kanji:'関心',hiragana:'かんしん',korean:'관심',level:'N3'},{id:3180,kanji:'投げる',hiragana:'なげる',korean:'던지다',level:'N3'},
{id:3181,kanji:'原因',hiragana:'げんいん',korean:'원인',level:'N3'},{id:3182,kanji:'勤める',hiragana:'つとめる',korean:'근무하다',level:'N3'},{id:3183,kanji:'規則',hiragana:'きそく',korean:'규칙',level:'N3'},{id:3184,kanji:'借りる',hiragana:'かりる',korean:'빌리다',level:'N3'},{id:3185,kanji:'欠点',hiragana:'けってん',korean:'결점',level:'N3'},{id:3186,kanji:'緑',hiragana:'みどり',korean:'초록, 녹색',level:'N3'},{id:3187,kanji:'願う',hiragana:'ねがう',korean:'바라다, 부탁하다',level:'N3'},{id:3188,kanji:'焼く',hiragana:'やく',korean:'굽다, 태우다',level:'N3'},{id:3189,kanji:'波',hiragana:'なみ',korean:'파도',level:'N3'},{id:3190,kanji:'速い',hiragana:'はやい',korean:'빠르다',level:'N3'},
{id:3191,kanji:'満足',hiragana:'まんぞく',korean:'만족',level:'N3'},{id:3192,kanji:'輸出',hiragana:'ゆしゅつ',korean:'수출',level:'N3'},{id:3193,kanji:'眠る',hiragana:'ねむる',korean:'자다, 잠들다',level:'N3'},{id:3194,kanji:'頭痛',hiragana:'ずつう',korean:'두통',level:'N3'},{id:3195,kanji:'葉',hiragana:'は',korean:'잎, 이파리',level:'N3'},{id:3196,kanji:'期待',hiragana:'きたい',korean:'기대',level:'N3'},{id:3197,kanji:'預ける',hiragana:'あずける',korean:'맡기다, 위임하다',level:'N3'},{id:3198,kanji:'経由',hiragana:'けいゆ',korean:'경유',level:'N3'},{id:3199,kanji:'秒',hiragana:'びょう',korean:'초(시간)',level:'N3'},{id:3200,kanji:'飛ぶ',hiragana:'とぶ',korean:'날다',level:'N3'},
{id:3201,kanji:'坂道',hiragana:'さかみち',korean:'언덕길, 비탈길',level:'N3'},{id:3202,kanji:'違う',hiragana:'ちがう',korean:'다르다, 틀리다',level:'N3'},{id:3203,kanji:'関係',hiragana:'かんけい',korean:'관계',level:'N3'},{id:3204,kanji:'教師',hiragana:'きょうし',korean:'교사',level:'N3'},{id:3205,kanji:'カタログ',hiragana:'かたろぐ',korean:'카탈로그',level:'N3'},{id:3206,kanji:'感じる',hiragana:'かんじる',korean:'느끼다',level:'N3'},{id:3207,kanji:'家賃',hiragana:'やちん',korean:'집세',level:'N3'},{id:3208,kanji:'しまう',hiragana:'しまう',korean:'치우다, 안에 넣다',level:'N3'},{id:3209,kanji:'最新',hiragana:'さいしん',korean:'최신',level:'N3'},{id:3210,kanji:'しばる',hiragana:'しばる',korean:'묶다',level:'N3'},
{id:3211,kanji:'キャンセル',hiragana:'きゃんせる',korean:'취소',level:'N3'},{id:3212,kanji:'感動',hiragana:'かんどう',korean:'감동',level:'N3'},{id:3213,kanji:'うっかり',hiragana:'うっかり',korean:'깜빡, 무심코',level:'N3'},{id:3214,kanji:'りっぱな',hiragana:'りっぱな',korean:'훌륭한',level:'N3'},{id:3215,kanji:'早めに',hiragana:'はやめに',korean:'일찌감치',level:'N3'},{id:3216,kanji:'半日',hiragana:'はんにち',korean:'반나절',level:'N3'},{id:3217,kanji:'扱う',hiragana:'あつかう',korean:'다루다, 취급하다',level:'N3'},{id:3218,kanji:'希望',hiragana:'きぼう',korean:'희망',level:'N3'},{id:3219,kanji:'迷う',hiragana:'まよう',korean:'헤매다, 망설이다',level:'N3'},{id:3220,kanji:'体力',hiragana:'たいりょく',korean:'체력',level:'N3'},
{id:3221,kanji:'不満',hiragana:'ふまん',korean:'불만',level:'N3'},{id:3222,kanji:'申込書',hiragana:'もうしこみしょ',korean:'신청서',level:'N3'},{id:3223,kanji:'複雑な',hiragana:'ふくざつな',korean:'복잡한',level:'N3'},{id:3224,kanji:'流れる',hiragana:'ながれる',korean:'흐르다',level:'N3'},{id:3225,kanji:'インタビュー',hiragana:'いんたびゅー',korean:'인터뷰',level:'N3'},{id:3226,kanji:'主張',hiragana:'しゅちょう',korean:'주장',level:'N3'},{id:3227,kanji:'整理',hiragana:'せいり',korean:'정리',level:'N3'},{id:3228,kanji:'ためる',hiragana:'ためる',korean:'모으다, 담다',level:'N3'},{id:3229,kanji:'清潔な',hiragana:'せいけつな',korean:'청결한',level:'N3'},{id:3230,kanji:'あわせる',hiragana:'あわせる',korean:'합치다',level:'N3'},
{id:3231,kanji:'冗談',hiragana:'じょうだん',korean:'농담',level:'N3'},{id:3232,kanji:'さっそく',hiragana:'さっそく',korean:'즉시',level:'N3'},{id:3233,kanji:'両替',hiragana:'りょうがえ',korean:'환전',level:'N3'},{id:3234,kanji:'前後',hiragana:'ぜんご',korean:'전후, 앞뒤',level:'N3'},{id:3235,kanji:'影響',hiragana:'えいきょう',korean:'영향',level:'N3'},{id:3236,kanji:'しっかり',hiragana:'しっかり',korean:'단단히, 꽉, 제대로',level:'N3'},{id:3237,kanji:'ながれ',hiragana:'ながれ',korean:'흐름',level:'N3'},{id:3238,kanji:'外食',hiragana:'がいしょく',korean:'외식',level:'N3'},{id:3239,kanji:'差',hiragana:'さ',korean:'차이, 차',level:'N3'},{id:3240,kanji:'意志',hiragana:'いし',korean:'의지',level:'N3'},
{id:3241,kanji:'別れる',hiragana:'わかれる',korean:'헤어지다, 작별하다',level:'N3'},{id:3242,kanji:'応援',hiragana:'おうえん',korean:'응원',level:'N3'},{id:3243,kanji:'のばす',hiragana:'のばす',korean:'연장하다, 연기하다',level:'N3'},{id:3244,kanji:'ふる',hiragana:'ふる',korean:'흔들다',level:'N3'},{id:3245,kanji:'想像',hiragana:'そうぞう',korean:'상상',level:'N3'},{id:3246,kanji:'むく',hiragana:'むく',korean:'(껍질을) 벗기다',level:'N3'},{id:3247,kanji:'かれる',hiragana:'かれる',korean:'시들다',level:'N3'},{id:3248,kanji:'がっかりする',hiragana:'がっかりする',korean:'낙심하다',level:'N3'},{id:3249,kanji:'ヒント',hiragana:'ひんと',korean:'힌트',level:'N3'},{id:3250,kanji:'なつかしい',hiragana:'なつかしい',korean:'그립다',level:'N3'},
{id:3251,kanji:'代金',hiragana:'だいきん',korean:'대금(비용)',level:'N3'},{id:3252,kanji:'しつこい',hiragana:'しつこい',korean:'끈질기다',level:'N3'},{id:3253,kanji:'片方',hiragana:'かたほう',korean:'한쪽',level:'N3'},{id:3254,kanji:'かわく',hiragana:'かわく',korean:'마르다',level:'N3'},{id:3255,kanji:'渋滞',hiragana:'じゅうたい',korean:'정체(밀리는 상태)',level:'N3'},{id:3256,kanji:'おかしい',hiragana:'おかしい',korean:'이상하다',level:'N3'},{id:3257,kanji:'交換',hiragana:'こうかん',korean:'교환',level:'N3'},{id:3258,kanji:'リサイクル',hiragana:'りさいくる',korean:'리사이클, 재활용',level:'N3'},{id:3259,kanji:'うわさ',hiragana:'うわさ',korean:'소문',level:'N3'},{id:3260,kanji:'主に',hiragana:'おもに',korean:'주로',level:'N3'},
{id:3261,kanji:'不安',hiragana:'ふあん',korean:'불안',level:'N3'},{id:3262,kanji:'なるべく',hiragana:'なるべく',korean:'가급적',level:'N3'},{id:3263,kanji:'とじる',hiragana:'とじる',korean:'닫다, (눈을) 감다',level:'N3'},{id:3264,kanji:'たたむ',hiragana:'たたむ',korean:'접다, 개다',level:'N3'},{id:3265,kanji:'調子',hiragana:'ちょうし',korean:'상태',level:'N3'},{id:3266,kanji:'緩い',hiragana:'ゆるい',korean:'느슨하다, 완만하다',level:'N3'},{id:3267,kanji:'経つ',hiragana:'たつ',korean:'지나다, 경과하다',level:'N3'},{id:3268,kanji:'突然',hiragana:'とつぜん',korean:'돌연, 갑자기',level:'N3'},{id:3269,kanji:'物価',hiragana:'ぶっか',korean:'물가',level:'N3'},{id:3270,kanji:'追いつく',hiragana:'おいつく',korean:'따라잡다',level:'N3'},
{id:3271,kanji:'おぼれる',hiragana:'おぼれる',korean:'물에 빠지다',level:'N3'},{id:3272,kanji:'材料',hiragana:'ざいりょう',korean:'재료',level:'N3'},{id:3273,kanji:'別々に',hiragana:'べつべつに',korean:'따로따로',level:'N3'},{id:3274,kanji:'引き受ける',hiragana:'ひきうける',korean:'받아들이다',level:'N3'},{id:3275,kanji:'自慢する',hiragana:'じまんする',korean:'자랑하다',level:'N3'},{id:3276,kanji:'分ける',hiragana:'わける',korean:'나누다, 구분하다',level:'N3'},{id:3277,kanji:'お祝い',hiragana:'おいわい',korean:'축하',level:'N3'},{id:3278,kanji:'方法',hiragana:'ほうほう',korean:'방법',level:'N3'},{id:3279,kanji:'積極的な',hiragana:'せっきょくてきな',korean:'적극적인',level:'N3'},{id:3280,kanji:'資源',hiragana:'しげん',korean:'자원',level:'N3'},
{id:3281,kanji:'印象',hiragana:'いんしょう',korean:'인상',level:'N3'},{id:3282,kanji:'我慢する',hiragana:'がまんする',korean:'참다',level:'N3'},{id:3283,kanji:'記念',hiragana:'きねん',korean:'기념',level:'N3'},{id:3284,kanji:'使用料',hiragana:'しようりょう',korean:'사용료',level:'N3'},{id:3285,kanji:'あきる',hiragana:'あきる',korean:'질리다, 식상하다',level:'N3'},{id:3286,kanji:'目標',hiragana:'もくひょう',korean:'목표',level:'N3'},{id:3287,kanji:'覚める',hiragana:'さめる',korean:'(잠) 깨다, 정신 들다',level:'N3'},{id:3288,kanji:'テーマ',hiragana:'てーま',korean:'주제, 테마',level:'N3'},{id:3289,kanji:'穴',hiragana:'あな',korean:'구멍, 구덩이',level:'N3'},{id:3290,kanji:'合計',hiragana:'ごうけい',korean:'합계',level:'N3'},
{id:3291,kanji:'悔しい',hiragana:'くやしい',korean:'분하다, 억울하다',level:'N3'},{id:3292,kanji:'ぶつける',hiragana:'ぶつける',korean:'부딪다, 들이받다',level:'N3'},{id:3293,kanji:'感覚',hiragana:'かんかく',korean:'감각',level:'N3'},{id:3294,kanji:'くせ',hiragana:'くせ',korean:'버릇',level:'N3'},{id:3295,kanji:'ふらふら',hiragana:'ふらふら',korean:'비틀비틀, 휘청휘청',level:'N3'},{id:3296,kanji:'当日',hiragana:'とうじつ',korean:'당일',level:'N3'},{id:3297,kanji:'守る',hiragana:'まもる',korean:'지키다',level:'N3'},{id:3298,kanji:'順番',hiragana:'じゅんばん',korean:'순번, 차례',level:'N3'},{id:3299,kanji:'文句',hiragana:'もんく',korean:'불평, 잔소리',level:'N3'},{id:3300,kanji:'代表的な',hiragana:'だいひょうてきな',korean:'대표적인',level:'N3'},
{id:3301,kanji:'栄養',hiragana:'えいよう',korean:'영양',level:'N3'},{id:3302,kanji:'隠す',hiragana:'かくす',korean:'숨기다',level:'N3'},{id:3303,kanji:'割合',hiragana:'わりあい',korean:'비율',level:'N3'},{id:3304,kanji:'そっくり',hiragana:'そっくり',korean:'똑같이 생김',level:'N3'},{id:3305,kanji:'観察',hiragana:'かんさつ',korean:'관찰',level:'N3'},{id:3306,kanji:'破れる',hiragana:'やぶれる',korean:'찢어지다, 파손되다',level:'N3'},{id:3307,kanji:'料金',hiragana:'りょうきん',korean:'요금',level:'N3'},{id:3308,kanji:'編む',hiragana:'あむ',korean:'짜다, 뜨개질하다',level:'N3'},{id:3309,kanji:'戦う',hiragana:'たたかう',korean:'싸우다',level:'N3'},{id:3310,kanji:'興味',hiragana:'きょうみ',korean:'흥미',level:'N3'},
{id:3311,kanji:'香り',hiragana:'かおり',korean:'향기',level:'N3'},{id:3312,kanji:'演奏',hiragana:'えんそう',korean:'연주',level:'N3'},{id:3313,kanji:'防ぐ',hiragana:'ふせぐ',korean:'막다, 방지하다',level:'N3'},{id:3314,kanji:'盛んな',hiragana:'さかんな',korean:'왕성한, 활발한',level:'N3'},{id:3315,kanji:'うまい',hiragana:'うまい',korean:'능숙하다',level:'N3'},{id:3316,kanji:'チャレンジ',hiragana:'ちゃれんじ',korean:'챌린지, 도전',level:'N3'},{id:3317,kanji:'流行',hiragana:'りゅうこう',korean:'유행',level:'N3'},{id:3318,kanji:'断る',hiragana:'ことわる',korean:'거절하다',level:'N3'},{id:3319,kanji:'惜しい',hiragana:'おしい',korean:'아깝다, 아쉽다',level:'N3'},{id:3320,kanji:'傷',hiragana:'きず',korean:'상처',level:'N3'},
{id:3321,kanji:'頼る',hiragana:'たよる',korean:'의지하다',level:'N3'},{id:3322,kanji:'特長',hiragana:'とくちょう',korean:'특징',level:'N3'},{id:3323,kanji:'イメージ',hiragana:'いめーじ',korean:'이미지',level:'N3'},{id:3324,kanji:'囲む',hiragana:'かこむ',korean:'포위하다',level:'N3'},{id:3325,kanji:'許す',hiragana:'ゆるす',korean:'용서하다, 허락하다',level:'N3'},{id:3326,kanji:'姿勢',hiragana:'しせい',korean:'자세',level:'N3'},{id:3327,kanji:'確かめる',hiragana:'たしかめる',korean:'확인하다',level:'N3'},{id:3328,kanji:'農業',hiragana:'のうぎょう',korean:'농업',level:'N3'},{id:3329,kanji:'沈む',hiragana:'しずむ',korean:'가라앉다',level:'N3'},{id:3330,kanji:'内緒',hiragana:'ないしょ',korean:'비밀',level:'N3'},
{id:3331,kanji:'底',hiragana:'そこ',korean:'바닥',level:'N3'},{id:3332,kanji:'比較',hiragana:'ひかく',korean:'비교',level:'N3'},{id:3333,kanji:'平均',hiragana:'へいきん',korean:'평균',level:'N3'},{id:3334,kanji:'マナー',hiragana:'まなー',korean:'매너',level:'N3'},{id:3335,kanji:'呼びかける',hiragana:'よびかける',korean:'부르다',level:'N3'},{id:3336,kanji:'目的',hiragana:'もくてき',korean:'목적',level:'N3'},{id:3337,kanji:'床',hiragana:'ゆか',korean:'바닥, 마루',level:'N3'},{id:3338,kanji:'完成',hiragana:'かんせい',korean:'완성',level:'N3'},{id:3339,kanji:'列',hiragana:'れつ',korean:'줄',level:'N3'},{id:3340,kanji:'苦しい',hiragana:'くるしい',korean:'괴롭다',level:'N3'},
{id:3341,kanji:'登場',hiragana:'とうじょう',korean:'등장',level:'N3'},{id:3342,kanji:'ずいぶん',hiragana:'ずいぶん',korean:'상당히',level:'N3'},{id:3343,kanji:'落ち着く',hiragana:'おちつく',korean:'자리잡다, 안정되다',level:'N3'},{id:3344,kanji:'申請',hiragana:'しんせい',korean:'신청',level:'N3'},{id:3345,kanji:'染み',hiragana:'しみ',korean:'얼룩',level:'N3'},{id:3346,kanji:'指示',hiragana:'しじ',korean:'지시',level:'N3'},{id:3347,kanji:'見送る',hiragana:'みおくる',korean:'배웅하다',level:'N3'},{id:3348,kanji:'植える',hiragana:'うえる',korean:'심다',level:'N3'},{id:3349,kanji:'正直な',hiragana:'しょうじきな',korean:'정직한',level:'N3'},{id:3350,kanji:'性格',hiragana:'せいかく',korean:'성격',level:'N3'},
{id:3351,kanji:'受け入れる',hiragana:'うけいれる',korean:'받아들이다',level:'N3'},{id:3352,kanji:'そろそろ',hiragana:'そろそろ',korean:'슬슬',level:'N3'},{id:3353,kanji:'緊張',hiragana:'きんちょう',korean:'긴장',level:'N3'},{id:3354,kanji:'暗記',hiragana:'あんき',korean:'암기',level:'N3'},{id:3355,kanji:'通り過ぎる',hiragana:'とおりすぎる',korean:'지나가다',level:'N3'},{id:3356,kanji:'訪問',hiragana:'ほうもん',korean:'방문',level:'N3'},{id:3357,kanji:'翻訳',hiragana:'ほんやく',korean:'번역',level:'N3'},{id:3358,kanji:'募集',hiragana:'ぼしゅう',korean:'모집',level:'N3'},{id:3359,kanji:'空',hiragana:'から',korean:'빈 상태',level:'N3'},{id:3360,kanji:'活動',hiragana:'かつどう',korean:'활동',level:'N3'},
{id:3361,kanji:'行き先',hiragana:'ゆきさき',korean:'목적지, 행선지',level:'N3'},{id:3362,kanji:'経由',hiragana:'けいゆ',korean:'경유',level:'N3'},{id:3363,kanji:'建設',hiragana:'けんせつ',korean:'건설',level:'N3'},{id:3364,kanji:'身につける',hiragana:'みにつける',korean:'익히다, 터득하다',level:'N3'},{id:3365,kanji:'発生',hiragana:'はっせい',korean:'발생',level:'N3'},{id:3366,kanji:'にぎる',hiragana:'にぎる',korean:'움켜쥐다',level:'N3'},{id:3367,kanji:'だるい',hiragana:'だるい',korean:'나른하다',level:'N3'},{id:3368,kanji:'早退',hiragana:'そうたい',korean:'조퇴',level:'N3'},{id:3369,kanji:'進歩',hiragana:'しんぽ',korean:'진보',level:'N3'},{id:3370,kanji:'余る',hiragana:'あまる',korean:'남다',level:'N3'},
{id:3371,kanji:'効果',hiragana:'こうか',korean:'효과',level:'N3'},{id:3372,kanji:'こぼす',hiragana:'こぼす',korean:'쏟다, 엎지르다',level:'N3'},{id:3373,kanji:'内容',hiragana:'ないよう',korean:'내용',level:'N3'},{id:3374,kanji:'発展',hiragana:'はってん',korean:'발전',level:'N3'},{id:3375,kanji:'伝わる',hiragana:'つたわる',korean:'전달되다',level:'N3'},{id:3376,kanji:'どなる',hiragana:'どなる',korean:'고함을 지르다',level:'N3'},{id:3377,kanji:'期限',hiragana:'きげん',korean:'기한',level:'N3'},{id:3378,kanji:'たまる',hiragana:'たまる',korean:'쌓이다',level:'N3'},{id:3379,kanji:'縮小',hiragana:'しゅくしょう',korean:'축소',level:'N3'},{id:3380,kanji:'制限',hiragana:'せいげん',korean:'제한',level:'N3'},
{id:3381,kanji:'話しかける',hiragana:'はなしかける',korean:'말을 걸다',level:'N3'},{id:3382,kanji:'離す',hiragana:'はなす',korean:'떼어내다, 분리하다',level:'N3'},{id:3383,kanji:'移動',hiragana:'いどう',korean:'이동',level:'N3'},{id:3384,kanji:'預ける',hiragana:'あずける',korean:'맡기다',level:'N3'},{id:3385,kanji:'新鮮な',hiragana:'しんせんな',korean:'신선한',level:'N3'},{id:3386,kanji:'清潔な',hiragana:'せいけつな',korean:'깨끗한',level:'N3'},{id:3387,kanji:'混ぜる',hiragana:'まぜる',korean:'섞다',level:'N3'},{id:3388,kanji:'親しい',hiragana:'したしい',korean:'친하다',level:'N3'},{id:3389,kanji:'締め切り',hiragana:'しめきり',korean:'마감',level:'N3'},{id:3390,kanji:'ゆでる',hiragana:'ゆでる',korean:'삶다',level:'N3'},
{id:3391,kanji:'渋滞',hiragana:'じゅうたい',korean:'정체(밀리는 상태)',level:'N3'},{id:3392,kanji:'似合う',hiragana:'にあう',korean:'어울리다',level:'N3'},{id:3393,kanji:'消費',hiragana:'しょうひ',korean:'소비',level:'N3'},{id:3394,kanji:'急に',hiragana:'きゅうに',korean:'갑자기',level:'N3'},{id:3395,kanji:'沸騰',hiragana:'ふっとう',korean:'비등',level:'N3'},{id:3396,kanji:'まげる',hiragana:'まげる',korean:'구부리다, 굽히다',level:'N3'},{id:3397,kanji:'慰める',hiragana:'なぐさめる',korean:'위로하다',level:'N3'},{id:3398,kanji:'分類',hiragana:'ぶんるい',korean:'분류',level:'N3'},{id:3399,kanji:'引き受ける',hiragana:'ひきうける',korean:'떠맡다, 인수하다',level:'N3'},{id:3400,kanji:'滞在',hiragana:'たいざい',korean:'체재',level:'N3'},
{id:3401,kanji:'どきどき',hiragana:'どきどき',korean:'두근두근',level:'N3'},{id:3402,kanji:'かれる',hiragana:'かれる',korean:'시들다',level:'N3'},{id:3403,kanji:'減少',hiragana:'げんしょう',korean:'감소',level:'N3'},{id:3404,kanji:'中古',hiragana:'ちゅうこ',korean:'중고',level:'N3'},{id:3405,kanji:'断る',hiragana:'ことわる',korean:'거절하다',level:'N3'},{id:3406,kanji:'受け取る',hiragana:'うけとる',korean:'받다, 수취하다',level:'N3'},{id:3407,kanji:'ぶらぶら',hiragana:'ぶらぶら',korean:'어슬렁어슬렁, 천천히',level:'N3'},{id:3408,kanji:'どきどき',hiragana:'どきどき',korean:'두근두근',level:'N3'},{id:3409,kanji:'自動的な',hiragana:'じどうてきな',korean:'자동적인',level:'N3'},{id:3410,kanji:'からから',hiragana:'からから',korean:'바싹바싹(몹시 건조한 모습)',level:'N3'},

// ── N2 ──────────────────────────────────────────
{id:4001,kanji:'憧れる',hiragana:'あこがれる',korean:'동경하다',level:'N2'},{id:4002,kanji:'味わう',hiragana:'あじわう',korean:'맛보다',level:'N2'},{id:4003,kanji:'預かる',hiragana:'あずかる',korean:'맡다',level:'N2'},{id:4004,kanji:'焦る',hiragana:'あせる',korean:'초조해하다',level:'N2'},{id:4005,kanji:'与える',hiragana:'あたえる',korean:'주다, 수여하다',level:'N2'},{id:4006,kanji:'温める',hiragana:'あたためる',korean:'데우다',level:'N2'},{id:4007,kanji:'当たる',hiragana:'あたる',korean:'맞다, 해당하다',level:'N2'},{id:4008,kanji:'扱う',hiragana:'あつかう',korean:'취급하다',level:'N2'},{id:4009,kanji:'暴れる',hiragana:'あばれる',korean:'난폭하게 굴다',level:'N2'},{id:4010,kanji:'溢れる',hiragana:'あふれる',korean:'넘쳐나다',level:'N2'},
{id:4011,kanji:'甘やかす',hiragana:'あまやかす',korean:'응석 부리게 하다',level:'N2'},{id:4012,kanji:'編む',hiragana:'あむ',korean:'짜다, 뜨개질하다',level:'N2'},{id:4013,kanji:'謝る',hiragana:'あやまる',korean:'사과하다',level:'N2'},{id:4014,kanji:'荒れる',hiragana:'あれる',korean:'거칠어지다',level:'N2'},{id:4015,kanji:'慌てる',hiragana:'あわてる',korean:'당황하다',level:'N2'},{id:4016,kanji:'生かす',hiragana:'いかす',korean:'살리다, 활용하다',level:'N2'},{id:4017,kanji:'維持する',hiragana:'いじする',korean:'유지하다',level:'N2'},{id:4018,kanji:'至る',hiragana:'いたる',korean:'이르다',level:'N2'},{id:4019,kanji:'一致する',hiragana:'いっちする',korean:'일치하다',level:'N2'},{id:4020,kanji:'祈る',hiragana:'いのる',korean:'빌다, 기원하다',level:'N2'},
{id:4021,kanji:'祝う',hiragana:'いわう',korean:'축하하다',level:'N2'},{id:4022,kanji:'植える',hiragana:'うえる',korean:'심다',level:'N2'},{id:4023,kanji:'承る',hiragana:'うけたまわる',korean:'삼가 듣다',level:'N2'},{id:4024,kanji:'失う',hiragana:'うしなう',korean:'잃어버리다',level:'N2'},{id:4025,kanji:'薄れる',hiragana:'うすれる',korean:'엷어지다',level:'N2'},{id:4026,kanji:'疑う',hiragana:'うたがう',korean:'의심하다',level:'N2'},{id:4027,kanji:'打ち明ける',hiragana:'うちあける',korean:'고백하다',level:'N2'},{id:4028,kanji:'映す',hiragana:'うつす',korean:'비추다',level:'N2'},{id:4029,kanji:'訴える',hiragana:'うったえる',korean:'고소하다, 호소하다',level:'N2'},{id:4030,kanji:'奪う',hiragana:'うばう',korean:'빼앗다',level:'N2'},
{id:4031,kanji:'埋める',hiragana:'うめる',korean:'묻다, 메우다',level:'N2'},{id:4032,kanji:'裏切る',hiragana:'うらぎる',korean:'배반하다',level:'N2'},{id:4033,kanji:'占う',hiragana:'うらなう',korean:'점치다',level:'N2'},{id:4034,kanji:'売り切れる',hiragana:'うりきれる',korean:'품절되다',level:'N2'},{id:4035,kanji:'追い込む',hiragana:'おいこむ',korean:'몰아넣다',level:'N2'},{id:4036,kanji:'追いつく',hiragana:'おいつく',korean:'따라잡다',level:'N2'},{id:4037,kanji:'追う',hiragana:'おう',korean:'좇다',level:'N2'},{id:4038,kanji:'覆う',hiragana:'おおう',korean:'덮다, 씌우다',level:'N2'},{id:4039,kanji:'犯す',hiragana:'おかす',korean:'죄를 범하다',level:'N2'},{id:4040,kanji:'補う',hiragana:'おぎなう',korean:'보충하다',level:'N2'},
{id:4041,kanji:'贈る',hiragana:'おくる',korean:'선물하다',level:'N2'},{id:4042,kanji:'抑える',hiragana:'おさえる',korean:'억누르다',level:'N2'},{id:4043,kanji:'収める',hiragana:'おさめる',korean:'거두다, 담다',level:'N2'},{id:4044,kanji:'納める',hiragana:'おさめる',korean:'납입하다',level:'N2'},{id:4045,kanji:'恐れる',hiragana:'おそれる',korean:'두려워하다',level:'N2'},{id:4046,kanji:'落ち着く',hiragana:'おちつく',korean:'침착하다, 안정되다',level:'N2'},{id:4047,kanji:'訪れる',hiragana:'おとずれる',korean:'방문하다',level:'N2'},{id:4048,kanji:'劣る',hiragana:'おとる',korean:'뒤떨어지다',level:'N2'},{id:4049,kanji:'驚く',hiragana:'おどろく',korean:'놀라다',level:'N2'},{id:4050,kanji:'抱える',hiragana:'かかえる',korean:'안다, 떠맡다',level:'N2'},
{id:4051,kanji:'輝く',hiragana:'かがやく',korean:'빛나다',level:'N2'},{id:4052,kanji:'係る',hiragana:'かかわる',korean:'관련되다',level:'N2'},{id:4053,kanji:'限る',hiragana:'かぎる',korean:'한정하다',level:'N2'},{id:4054,kanji:'欠く',hiragana:'かく',korean:'부족하다',level:'N2'},{id:4055,kanji:'隠す',hiragana:'かくす',korean:'숨기다',level:'N2'},{id:4056,kanji:'重ねる',hiragana:'かさねる',korean:'겹치다',level:'N2'},{id:4057,kanji:'貸し出す',hiragana:'かしだす',korean:'대출하다',level:'N2'},{id:4058,kanji:'稼ぐ',hiragana:'かせぐ',korean:'벌다',level:'N2'},{id:4059,kanji:'傾く',hiragana:'かたむく',korean:'기울다',level:'N2'},{id:4060,kanji:'偏る',hiragana:'かたよる',korean:'치우치다',level:'N2'},
{id:4061,kanji:'語る',hiragana:'かたる',korean:'말하다',level:'N2'},{id:4062,kanji:'叶う',hiragana:'かなう',korean:'이루어지다',level:'N2'},{id:4063,kanji:'庇う',hiragana:'かばう',korean:'감싸다',level:'N2'},{id:4064,kanji:'我慢する',hiragana:'がまんする',korean:'참다',level:'N2'},{id:4065,kanji:'乾く',hiragana:'かわく',korean:'마르다',level:'N2'},{id:4066,kanji:'観察する',hiragana:'かんさつする',korean:'관찰하다',level:'N2'},{id:4067,kanji:'乾燥する',hiragana:'かんそうする',korean:'건조하다',level:'N2'},{id:4068,kanji:'刻む',hiragana:'きざむ',korean:'새기다',level:'N2'},{id:4069,kanji:'競う',hiragana:'きそう',korean:'경쟁하다',level:'N2'},{id:4070,kanji:'鍛える',hiragana:'きたえる',korean:'단련하다',level:'N2'},
{id:4071,kanji:'急増する',hiragana:'きゅうぞうする',korean:'급증하다',level:'N2'},{id:4072,kanji:'区切る',hiragana:'くぎる',korean:'구분하다',level:'N2'},{id:4073,kanji:'崩れる',hiragana:'くずれる',korean:'무너지다',level:'N2'},{id:4074,kanji:'悔やむ',hiragana:'くやむ',korean:'후회하다',level:'N2'},{id:4075,kanji:'繰り返す',hiragana:'くりかえす',korean:'반복하다',level:'N2'},{id:4076,kanji:'削る',hiragana:'けずる',korean:'깎다, 삭감하다',level:'N2'},{id:4077,kanji:'貢献する',hiragana:'こうけんする',korean:'공헌하다',level:'N2'},{id:4078,kanji:'超える',hiragana:'こえる',korean:'넘다',level:'N2'},{id:4079,kanji:'凍る',hiragana:'こおる',korean:'얼다',level:'N2'},{id:4080,kanji:'克服する',hiragana:'こくふくする',korean:'극복하다',level:'N2'},
{id:4081,kanji:'焦げる',hiragana:'こげる',korean:'타다',level:'N2'},{id:4082,kanji:'試みる',hiragana:'こころみる',korean:'시도해 보다',level:'N2'},{id:4083,kanji:'異なる',hiragana:'ことなる',korean:'다르다',level:'N2'},{id:4084,kanji:'断る',hiragana:'ことわる',korean:'거절하다',level:'N2'},{id:4085,kanji:'転ぶ',hiragana:'ころぶ',korean:'넘어지다',level:'N2'},{id:4086,kanji:'探す',hiragana:'さがす',korean:'찾다',level:'N2'},{id:4087,kanji:'逆らう',hiragana:'さからう',korean:'거스르다',level:'N2'},{id:4088,kanji:'叫ぶ',hiragana:'さけぶ',korean:'외치다',level:'N2'},{id:4089,kanji:'避ける',hiragana:'さける',korean:'피하다',level:'N2'},{id:4090,kanji:'下げる',hiragana:'さげる',korean:'내리다',level:'N2'},
{id:4091,kanji:'支える',hiragana:'ささえる',korean:'지탱하다',level:'N2'},{id:4092,kanji:'差し上げる',hiragana:'さしあげる',korean:'드리다',level:'N2'},{id:4093,kanji:'指す',hiragana:'さす',korean:'가리키다',level:'N2'},{id:4094,kanji:'誘う',hiragana:'さそう',korean:'권유하다',level:'N2'},{id:4095,kanji:'妨げる',hiragana:'さまたげる',korean:'방해하다',level:'N2'},{id:4096,kanji:'騒ぐ',hiragana:'さわぐ',korean:'떠들다',level:'N2'},{id:4097,kanji:'仕上げる',hiragana:'しあげる',korean:'일을 끝내다',level:'N2'},{id:4098,kanji:'持参する',hiragana:'じさんする',korean:'지참하다',level:'N2'},{id:4099,kanji:'沈む',hiragana:'しずむ',korean:'가라앉다',level:'N2'},{id:4100,kanji:'湿る',hiragana:'しめる',korean:'습기차다',level:'N2'},
{id:4101,kanji:'招待する',hiragana:'しょうたいする',korean:'초대하다',level:'N2'},{id:4102,kanji:'救う',hiragana:'すくう',korean:'구하다',level:'N2'},{id:4103,kanji:'優れる',hiragana:'すぐれる',korean:'우수하다',level:'N2'},{id:4104,kanji:'勧める',hiragana:'すすめる',korean:'권하다, 추천하다',level:'N2'},{id:4105,kanji:'捨てる',hiragana:'すてる',korean:'버리다',level:'N2'},{id:4106,kanji:'済む',hiragana:'すむ',korean:'끝나다',level:'N2'},{id:4107,kanji:'狭める',hiragana:'せばめる',korean:'좁히다',level:'N2'},{id:4108,kanji:'迫る',hiragana:'せまる',korean:'다가오다',level:'N2'},{id:4109,kanji:'遭遇する',hiragana:'そうぐうする',korean:'조우하다',level:'N2'},{id:4110,kanji:'添える',hiragana:'そえる',korean:'첨부하다',level:'N2'},
{id:4111,kanji:'属する',hiragana:'ぞくする',korean:'속하다',level:'N2'},{id:4112,kanji:'注ぐ',hiragana:'そそぐ',korean:'붓다',level:'N2'},{id:4113,kanji:'備える',hiragana:'そなえる',korean:'준비하다',level:'N2'},{id:4114,kanji:'染める',hiragana:'そめる',korean:'물들이다',level:'N2'},{id:4115,kanji:'揃う',hiragana:'そろう',korean:'갖추어지다',level:'N2'},{id:4116,kanji:'耐える',hiragana:'たえる',korean:'참다, 인내하다',level:'N2'},{id:4117,kanji:'倒す',hiragana:'たおす',korean:'쓰러뜨리다',level:'N2'},{id:4118,kanji:'倒れる',hiragana:'たおれる',korean:'쓰러지다',level:'N2'},{id:4119,kanji:'確かめる',hiragana:'たしかめる',korean:'확인하다',level:'N2'},{id:4120,kanji:'経つ',hiragana:'たつ',korean:'지나다',level:'N2'},
{id:4121,kanji:'達する',hiragana:'たっする',korean:'달하다',level:'N2'},{id:4122,kanji:'頼む',hiragana:'たのむ',korean:'부탁하다',level:'N2'},{id:4123,kanji:'黙る',hiragana:'だまる',korean:'침묵하다',level:'N2'},{id:4124,kanji:'保つ',hiragana:'たもつ',korean:'유지하다',level:'N2'},{id:4125,kanji:'近づく',hiragana:'ちかづく',korean:'다가가다',level:'N2'},{id:4126,kanji:'縮む',hiragana:'ちぢむ',korean:'줄어들다',level:'N2'},{id:4127,kanji:'散らす',hiragana:'ちらす',korean:'흩뜨리다',level:'N2'},{id:4128,kanji:'費やす',hiragana:'ついやす',korean:'다 소비하다',level:'N2'},{id:4129,kanji:'通じる',hiragana:'つうじる',korean:'통하다',level:'N2'},{id:4130,kanji:'捕まる',hiragana:'つかまる',korean:'붙잡히다',level:'N2'},
{id:4131,kanji:'就く',hiragana:'つく',korean:'취임하다',level:'N2'},{id:4132,kanji:'続く',hiragana:'つづく',korean:'계속되다',level:'N2'},{id:4133,kanji:'務める',hiragana:'つとめる',korean:'임무를 맡다',level:'N2'},{id:4134,kanji:'繋がる',hiragana:'つながる',korean:'연결되다',level:'N2'},{id:4135,kanji:'潰れる',hiragana:'つぶれる',korean:'망하다',level:'N2'},{id:4136,kanji:'詰まる',hiragana:'つまる',korean:'막히다',level:'N2'},{id:4137,kanji:'積み重ねる',hiragana:'つみかさねる',korean:'겹겹이 쌓다',level:'N2'},{id:4138,kanji:'積む',hiragana:'つむ',korean:'쌓다',level:'N2'},{id:4139,kanji:'詰め込む',hiragana:'つめこむ',korean:'채워 넣다',level:'N2'},{id:4140,kanji:'連れる',hiragana:'つれる',korean:'동반하다',level:'N2'},
{id:4141,kanji:'出来上がる',hiragana:'できあがる',korean:'완성되다',level:'N2'},{id:4142,kanji:'適応する',hiragana:'てきおうする',korean:'적응하다',level:'N2'},{id:4143,kanji:'徹底する',hiragana:'てっていする',korean:'철저하다',level:'N2'},{id:4144,kanji:'転じる',hiragana:'てんじる',korean:'바뀌다',level:'N2'},{id:4145,kanji:'伝染する',hiragana:'でんせんする',korean:'전염되다',level:'N2'},{id:4146,kanji:'問い合わせる',hiragana:'といあわせる',korean:'문의하다',level:'N2'},{id:4147,kanji:'溶かす',hiragana:'とかす',korean:'녹이다',level:'N2'},{id:4148,kanji:'届ける',hiragana:'とどける',korean:'배달하다, 신고하다',level:'N2'},{id:4149,kanji:'整える',hiragana:'ととのえる',korean:'정돈하다',level:'N2'},{id:4150,kanji:'伴う',hiragana:'ともなう',korean:'동반하다',level:'N2'},
{id:4151,kanji:'取り上げる',hiragana:'とりあげる',korean:'채택하다',level:'N2'},{id:4152,kanji:'取り扱う',hiragana:'とりあつかう',korean:'취급하다',level:'N2'},{id:4153,kanji:'取り入れる',hiragana:'とりいれる',korean:'받아들이다',level:'N2'},{id:4154,kanji:'取り組む',hiragana:'とりくむ',korean:'몰두하다',level:'N2'},{id:4155,kanji:'取り除く',hiragana:'とりのぞく',korean:'제거하다',level:'N2'},{id:4156,kanji:'眺める',hiragana:'ながめる',korean:'바라보다',level:'N2'},{id:4157,kanji:'嘆く',hiragana:'なげく',korean:'한탄하다',level:'N2'},{id:4158,kanji:'納得する',hiragana:'なっとくする',korean:'납득하다',level:'N2'},{id:4159,kanji:'悩む',hiragana:'なやむ',korean:'고민하다',level:'N2'},{id:4160,kanji:'鳴る',hiragana:'なる',korean:'울리다',level:'N2'},
{id:4161,kanji:'慣れる',hiragana:'なれる',korean:'익숙하다',level:'N2'},{id:4162,kanji:'担う',hiragana:'になう',korean:'짊어지다',level:'N2'},{id:4163,kanji:'抜く',hiragana:'ぬく',korean:'뽑다',level:'N2'},{id:4164,kanji:'願う',hiragana:'ねがう',korean:'바라다',level:'N2'},{id:4165,kanji:'逃す',hiragana:'のがす',korean:'놓치다',level:'N2'},{id:4166,kanji:'伸ばす',hiragana:'のばす',korean:'늘리다',level:'N2'},{id:4167,kanji:'伸びる',hiragana:'のびる',korean:'늘다',level:'N2'},{id:4168,kanji:'述べる',hiragana:'のべる',korean:'진술하다',level:'N2'},{id:4169,kanji:'拝見する',hiragana:'はいけんする',korean:'보다(겸양)',level:'N2'},{id:4170,kanji:'測る',hiragana:'はかる',korean:'측량하다',level:'N2'},
{id:4171,kanji:'吐き出す',hiragana:'はきだす',korean:'내뱉다',level:'N2'},{id:4172,kanji:'励む',hiragana:'はげむ',korean:'힘쓰다',level:'N2'},{id:4173,kanji:'外す',hiragana:'はずす',korean:'떼다, 풀다',level:'N2'},{id:4174,kanji:'外れる',hiragana:'はずれる',korean:'벗겨지다',level:'N2'},{id:4175,kanji:'果たす',hiragana:'はたす',korean:'완수하다',level:'N2'},{id:4176,kanji:'離れる',hiragana:'はなれる',korean:'멀어지다',level:'N2'},{id:4177,kanji:'省く',hiragana:'はぶく',korean:'생략하다',level:'N2'},{id:4178,kanji:'冷える',hiragana:'ひえる',korean:'차가워지다',level:'N2'},{id:4179,kanji:'引き受ける',hiragana:'ひきうける',korean:'떠맡다',level:'N2'},{id:4180,kanji:'引き渡す',hiragana:'ひきわたす',korean:'넘겨주다',level:'N2'},
{id:4181,kanji:'広げる',hiragana:'ひろげる',korean:'넓히다',level:'N2'},{id:4182,kanji:'増える',hiragana:'ふえる',korean:'늘다',level:'N2'},{id:4183,kanji:'深める',hiragana:'ふかめる',korean:'깊게 하다',level:'N2'},{id:4184,kanji:'含む',hiragana:'ふくむ',korean:'포함하다',level:'N2'},{id:4185,kanji:'膨らむ',hiragana:'ふくらむ',korean:'부풀다',level:'N2'},{id:4186,kanji:'防ぐ',hiragana:'ふせぐ',korean:'막다',level:'N2'},{id:4187,kanji:'踏み出す',hiragana:'ふみだす',korean:'내딛다',level:'N2'},{id:4188,kanji:'踏む',hiragana:'ふむ',korean:'밟다',level:'N2'},{id:4189,kanji:'振り返る',hiragana:'ふりかえる',korean:'돌이켜보다',level:'N2'},{id:4190,kanji:'振り込む',hiragana:'ふりこむ',korean:'납입하다',level:'N2'},
{id:4191,kanji:'振り向く',hiragana:'ふりむく',korean:'뒤돌아보다',level:'N2'},{id:4192,kanji:'触れる',hiragana:'ふれる',korean:'닿다, 만지다',level:'N2'},{id:4193,kanji:'隔てる',hiragana:'へだてる',korean:'사이를 두다',level:'N2'},{id:4194,kanji:'減る',hiragana:'へる',korean:'줄다',level:'N2'},{id:4195,kanji:'保存する',hiragana:'ほぞんする',korean:'보존하다',level:'N2'},{id:4196,kanji:'参る',hiragana:'まいる',korean:'오다(겸양)',level:'N2'},{id:4197,kanji:'任せる',hiragana:'まかせる',korean:'맡기다',level:'N2'},{id:4198,kanji:'負ける',hiragana:'まける',korean:'지다',level:'N2'},{id:4199,kanji:'混ぜる',hiragana:'まぜる',korean:'섞다',level:'N2'},{id:4200,kanji:'纏める',hiragana:'まとめる',korean:'정리하다',level:'N2'},
{id:4201,kanji:'惑わす',hiragana:'まどわす',korean:'현혹시키다',level:'N2'},{id:4202,kanji:'招く',hiragana:'まねく',korean:'초대하다',level:'N2'},{id:4203,kanji:'迷う',hiragana:'まよう',korean:'망설이다',level:'N2'},{id:4204,kanji:'見い出す',hiragana:'みいだす',korean:'찾아내다',level:'N2'},{id:4205,kanji:'磨く',hiragana:'みがく',korean:'닦다, 연마하다',level:'N2'},{id:4206,kanji:'満たす',hiragana:'みたす',korean:'채우다',level:'N2'},{id:4207,kanji:'乱れる',hiragana:'みだれる',korean:'흐트러지다',level:'N2'},{id:4208,kanji:'見直す',hiragana:'みなおす',korean:'재검토하다',level:'N2'},{id:4209,kanji:'見慣れる',hiragana:'みなれる',korean:'눈에 익숙하다',level:'N2'},{id:4210,kanji:'見分ける',hiragana:'みわける',korean:'분간하다',level:'N2'},
{id:4211,kanji:'結ぶ',hiragana:'むすぶ',korean:'맺다, 묶다',level:'N2'},{id:4212,kanji:'恵まれる',hiragana:'めぐまれる',korean:'혜택받다',level:'N2'},{id:4213,kanji:'目指す',hiragana:'めざす',korean:'지향하다',level:'N2'},{id:4214,kanji:'申し上げる',hiragana:'もうしあげる',korean:'말씀드리다',level:'N2'},{id:4215,kanji:'燃える',hiragana:'もえる',korean:'타다',level:'N2'},{id:4216,kanji:'潜る',hiragana:'もぐる',korean:'잠수하다',level:'N2'},{id:4217,kanji:'用いる',hiragana:'もちいる',korean:'쓰다, 이용하다',level:'N2'},{id:4218,kanji:'基づく',hiragana:'もとづく',korean:'근거하다',level:'N2'},{id:4219,kanji:'求める',hiragana:'もとめる',korean:'구하다',level:'N2'},{id:4220,kanji:'催す',hiragana:'もよおす',korean:'개최하다',level:'N2'},
{id:4221,kanji:'盛り上がる',hiragana:'もりあがる',korean:'고조되다',level:'N2'},{id:4222,kanji:'漏れる',hiragana:'もれる',korean:'새다',level:'N2'},{id:4223,kanji:'養う',hiragana:'やしなう',korean:'기르다',level:'N2'},{id:4224,kanji:'破れる',hiragana:'やぶれる',korean:'찢어지다',level:'N2'},{id:4225,kanji:'譲る',hiragana:'ゆずる',korean:'양보하다',level:'N2'},{id:4226,kanji:'輸入する',hiragana:'ゆにゅうする',korean:'수입하다',level:'N2'},{id:4227,kanji:'許す',hiragana:'ゆるす',korean:'용서하다',level:'N2'},{id:4228,kanji:'緩む',hiragana:'ゆるむ',korean:'느슨해지다',level:'N2'},{id:4229,kanji:'汚れる',hiragana:'よごれる',korean:'더러워지다',level:'N2'},{id:4230,kanji:'寄せる',hiragana:'よせる',korean:'다가오다',level:'N2'},
{id:4231,kanji:'呼び止める',hiragana:'よびとめる',korean:'불러 세우다',level:'N2'},{id:4232,kanji:'寄る',hiragana:'よる',korean:'들르다',level:'N2'},{id:4233,kanji:'略す',hiragana:'りゃくす',korean:'생략하다',level:'N2'},{id:4234,kanji:'湧く',hiragana:'わく',korean:'끓다',level:'N2'},{id:4235,kanji:'渡る',hiragana:'わたる',korean:'건너다',level:'N2'},{id:4236,kanji:'割り込む',hiragana:'わりこむ',korean:'끼어들다',level:'N2'},{id:4237,kanji:'厚い',hiragana:'あつい',korean:'두껍다',level:'N2'},{id:4238,kanji:'怪しい',hiragana:'あやしい',korean:'수상하다',level:'N2'},{id:4239,kanji:'荒い',hiragana:'あらい',korean:'거칠다',level:'N2'},{id:4240,kanji:'痛ましい',hiragana:'いたましい',korean:'가엽다',level:'N2'},
{id:4241,kanji:'薄暗い',hiragana:'うすぐらい',korean:'어슴푸레하다',level:'N2'},{id:4242,kanji:'思いがけない',hiragana:'おもいがけない',korean:'뜻밖이다',level:'N2'},{id:4243,kanji:'重苦しい',hiragana:'おもくるしい',korean:'답답하다',level:'N2'},{id:4244,kanji:'浅い',hiragana:'あさい',korean:'얕다',level:'N2'},{id:4245,kanji:'慌ただしい',hiragana:'あわただしい',korean:'분주하다',level:'N2'},{id:4246,kanji:'幼い',hiragana:'おさない',korean:'어리다',level:'N2'},{id:4247,kanji:'恐ろしい',hiragana:'おそろしい',korean:'두렵다',level:'N2'},{id:4248,kanji:'危うい',hiragana:'あやうい',korean:'위태롭다',level:'N2'},{id:4249,kanji:'厳しい',hiragana:'きびしい',korean:'엄하다',level:'N2'},{id:4250,kanji:'悔しい',hiragana:'くやしい',korean:'분하다',level:'N2'},
{id:4251,kanji:'詳しい',hiragana:'くわしい',korean:'상세하다',level:'N2'},{id:4252,kanji:'険しい',hiragana:'けわしい',korean:'험하다',level:'N2'},{id:4253,kanji:'細かい',hiragana:'こまかい',korean:'세세하다',level:'N2'},{id:4254,kanji:'寂しい',hiragana:'さびしい',korean:'쓸쓸하다',level:'N2'},{id:4255,kanji:'騒がしい',hiragana:'さわがしい',korean:'떠들썩하다',level:'N2'},{id:4256,kanji:'鋭い',hiragana:'するどい',korean:'예리하다',level:'N2'},{id:4257,kanji:'騒々しい',hiragana:'そうぞうしい',korean:'시끄럽다',level:'N2'},{id:4258,kanji:'頼もしい',hiragana:'たのもしい',korean:'든든하다',level:'N2'},{id:4259,kanji:'乏しい',hiragana:'とぼしい',korean:'빈곤하다',level:'N2'},{id:4260,kanji:'辛い',hiragana:'つらい',korean:'괴롭다',level:'N2'},
{id:4261,kanji:'力強い',hiragana:'ちからづよい',korean:'힘차다',level:'N2'},{id:4262,kanji:'情けない',hiragana:'なさけない',korean:'한심하다',level:'N2'},{id:4263,kanji:'名高い',hiragana:'なだかい',korean:'유명하다',level:'N2'},{id:4264,kanji:'懐かしい',hiragana:'なつかしい',korean:'그립다',level:'N2'},{id:4265,kanji:'憎い',hiragana:'にくい',korean:'밉다',level:'N2'},{id:4266,kanji:'鈍い',hiragana:'にぶい',korean:'둔하다',level:'N2'},{id:4267,kanji:'温い',hiragana:'ぬるい',korean:'미지근하다',level:'N2'},{id:4268,kanji:'望ましい',hiragana:'のぞましい',korean:'바람직하다',level:'N2'},{id:4269,kanji:'激しい',hiragana:'はげしい',korean:'격하다',level:'N2'},{id:4270,kanji:'貧しい',hiragana:'まずしい',korean:'가난하다',level:'N2'},
{id:4271,kanji:'眩しい',hiragana:'まぶしい',korean:'눈부시다',level:'N2'},{id:4272,kanji:'丸い',hiragana:'まるい',korean:'둥글다',level:'N2'},{id:4273,kanji:'珍しい',hiragana:'めずらしい',korean:'흔치않다',level:'N2'},{id:4274,kanji:'申し訳ない',hiragana:'もうしわけない',korean:'죄송하다',level:'N2'},{id:4275,kanji:'物足りない',hiragana:'ものたりない',korean:'부족하다',level:'N2'},{id:4276,kanji:'柔らかい',hiragana:'やわらかい',korean:'부드럽다',level:'N2'},{id:4277,kanji:'緩い',hiragana:'ゆるい',korean:'완만하다',level:'N2'},{id:4278,kanji:'若々しい',hiragana:'わかわかしい',korean:'아주 젊다',level:'N2'},{id:4279,kanji:'曖昧だ',hiragana:'あいまいだ',korean:'애매하다',level:'N2'},{id:4280,kanji:'明らかだ',hiragana:'あきらかだ',korean:'명백하다',level:'N2'},
{id:4281,kanji:'安易だ',hiragana:'あんいだ',korean:'안이하다',level:'N2'},{id:4282,kanji:'大げさだ',hiragana:'おおげさだ',korean:'과장되다',level:'N2'},{id:4283,kanji:'大ざっぱだ',hiragana:'おおざっぱだ',korean:'대충이다',level:'N2'},{id:4284,kanji:'穏やかだ',hiragana:'おだやかだ',korean:'온화하다',level:'N2'},{id:4285,kanji:'快晴だ',hiragana:'かいせいだ',korean:'쾌청하다',level:'N2'},{id:4286,kanji:'勝手だ',hiragana:'かってだ',korean:'제멋대로다',level:'N2'},{id:4287,kanji:'簡潔だ',hiragana:'かんけつだ',korean:'간결하다',level:'N2'},{id:4288,kanji:'頑丈だ',hiragana:'がんじょうだ',korean:'튼튼하다',level:'N2'},{id:4289,kanji:'簡略だ',hiragana:'かんりゃくだ',korean:'간략하다',level:'N2'},{id:4290,kanji:'危険だ',hiragana:'きけんだ',korean:'위험하다',level:'N2'},
{id:4291,kanji:'貴重だ',hiragana:'きちょうだ',korean:'귀중하다',level:'N2'},{id:4292,kanji:'強烈だ',hiragana:'きょうれつだ',korean:'강렬하다',level:'N2'},{id:4293,kanji:'気楽だ',hiragana:'きらくだ',korean:'마음 편하다',level:'N2'},{id:4294,kanji:'好調だ',hiragana:'こうちょうだ',korean:'순조롭다',level:'N2'},{id:4295,kanji:'幸いだ',hiragana:'さいわいだ',korean:'다행이다',level:'N2'},{id:4296,kanji:'盛んだ',hiragana:'さかんだ',korean:'번성하다',level:'N2'},{id:4297,kanji:'残念だ',hiragana:'ざんねんだ',korean:'유감이다',level:'N2'},{id:4298,kanji:'地味だ',hiragana:'じみだ',korean:'수수하다',level:'N2'},{id:4299,kanji:'重要だ',hiragana:'じゅうようだ',korean:'중요하다',level:'N2'},{id:4300,kanji:'正直だ',hiragana:'しょうじきだ',korean:'정직하다',level:'N2'},
{id:4301,kanji:'深刻だ',hiragana:'しんこくだ',korean:'심각하다',level:'N2'},{id:4302,kanji:'慎重だ',hiragana:'しんちょうだ',korean:'신중하다',level:'N2'},{id:4303,kanji:'素直だ',hiragana:'すなおだ',korean:'솔직하다',level:'N2'},{id:4304,kanji:'清潔だ',hiragana:'せいけつだ',korean:'청결하다',level:'N2'},{id:4305,kanji:'率直だ',hiragana:'そっちょくだ',korean:'솔직하다',level:'N2'},{id:4306,kanji:'粗末だ',hiragana:'そまつだ',korean:'허술하다',level:'N2'},{id:4307,kanji:'退屈だ',hiragana:'たいくつだ',korean:'지루하다',level:'N2'},{id:4308,kanji:'対等だ',hiragana:'たいとうだ',korean:'대등하다',level:'N2'},{id:4309,kanji:'平だ',hiragana:'たいらだ',korean:'평평하다',level:'N2'},{id:4310,kanji:'確かだ',hiragana:'たしかだ',korean:'확실하다',level:'N2'},
{id:4311,kanji:'多大だ',hiragana:'ただいだ',korean:'많고 크다',level:'N2'},{id:4312,kanji:'多様だ',hiragana:'たようだ',korean:'다양하다',level:'N2'},{id:4313,kanji:'丁寧だ',hiragana:'ていねいだ',korean:'정중하다',level:'N2'},{id:4314,kanji:'適切だ',hiragana:'てきせつだ',korean:'적절하다',level:'N2'},{id:4315,kanji:'同様だ',hiragana:'どうようだ',korean:'마찬가지다',level:'N2'},{id:4316,kanji:'得意だ',hiragana:'とくいだ',korean:'잘하다',level:'N2'},{id:4317,kanji:'苦手だ',hiragana:'にがてだ',korean:'못하다',level:'N2'},{id:4318,kanji:'賑やかだ',hiragana:'にぎやかだ',korean:'번화하다',level:'N2'},{id:4319,kanji:'派手だ',hiragana:'はでだ',korean:'화려하다',level:'N2'},{id:4320,kanji:'複雑だ',hiragana:'ふくざつだ',korean:'복잡하다',level:'N2'},
{id:4321,kanji:'不思議だ',hiragana:'ふしぎだ',korean:'불가사의하다',level:'N2'},{id:4322,kanji:'不調だ',hiragana:'ふちょうだ',korean:'부진하다',level:'N2'},{id:4323,kanji:'物騒だ',hiragana:'ぶっそうだ',korean:'어수선하다',level:'N2'},{id:4324,kanji:'平気だ',hiragana:'へいきだ',korean:'태연하다',level:'N2'},{id:4325,kanji:'平凡だ',hiragana:'へいぼんだ',korean:'평범하다',level:'N2'},{id:4326,kanji:'豊富だ',hiragana:'ほうふだ',korean:'풍부하다',level:'N2'},{id:4327,kanji:'見事だ',hiragana:'みごとだ',korean:'훌륭하다',level:'N2'},{id:4328,kanji:'妙だ',hiragana:'みょうだ',korean:'묘하다',level:'N2'},{id:4329,kanji:'無駄だ',hiragana:'むだだ',korean:'쓸데없다',level:'N2'},{id:4330,kanji:'迷惑だ',hiragana:'めいわくだ',korean:'민폐이다',level:'N2'},
{id:4331,kanji:'面倒だ',hiragana:'めんどうだ',korean:'귀찮다',level:'N2'},{id:4332,kanji:'豊かだ',hiragana:'ゆたかだ',korean:'풍족하다',level:'N2'},{id:4333,kanji:'余計だ',hiragana:'よけいだ',korean:'쓸데없다',level:'N2'},{id:4334,kanji:'利口だ',hiragana:'りこうだ',korean:'영리하다',level:'N2'},{id:4335,kanji:'立派だ',hiragana:'りっぱだ',korean:'훌륭하다',level:'N2'},{id:4336,kanji:'冷静だ',hiragana:'れいせいだ',korean:'냉철하다',level:'N2'},{id:4337,kanji:'愛用',hiragana:'あいよう',korean:'애용',level:'N2'},{id:4338,kanji:'印象',hiragana:'いんしょう',korean:'인상',level:'N2'},{id:4339,kanji:'引用',hiragana:'いんよう',korean:'인용',level:'N2'},{id:4340,kanji:'売上',hiragana:'うりあげ',korean:'매상',level:'N2'},
{id:4341,kanji:'遠慮',hiragana:'えんりょ',korean:'사양',level:'N2'},{id:4342,kanji:'温暖',hiragana:'おんだん',korean:'온난',level:'N2'},{id:4343,kanji:'解決',hiragana:'かいけつ',korean:'해결',level:'N2'},{id:4344,kanji:'解消',hiragana:'かいしょう',korean:'해소',level:'N2'},{id:4345,kanji:'拡充',hiragana:'かくじゅう',korean:'확충',level:'N2'},{id:4346,kanji:'確認',hiragana:'かくにん',korean:'확인',level:'N2'},{id:4347,kanji:'価値',hiragana:'かち',korean:'가치',level:'N2'},{id:4348,kanji:'活発',hiragana:'かっぱつ',korean:'활발',level:'N2'},{id:4349,kanji:'活躍',hiragana:'かつやく',korean:'활약',level:'N2'},{id:4350,kanji:'勧誘',hiragana:'かんゆう',korean:'권유',level:'N2'},
{id:4351,kanji:'規格',hiragana:'きかく',korean:'규격',level:'N2'},{id:4352,kanji:'企業',hiragana:'きぎょう',korean:'기업',level:'N2'},{id:4353,kanji:'技術',hiragana:'ぎじゅつ',korean:'기술',level:'N2'},{id:4354,kanji:'議論',hiragana:'ぎろん',korean:'논의',level:'N2'},{id:4355,kanji:'緊張',hiragana:'きんちょう',korean:'긴장',level:'N2'},{id:4356,kanji:'傾向',hiragana:'けいこう',korean:'경향',level:'N2'},{id:4357,kanji:'現状',hiragana:'げんじょう',korean:'현상',level:'N2'},{id:4358,kanji:'講義',hiragana:'こうぎ',korean:'강의',level:'N2'},{id:4359,kanji:'購入',hiragana:'こうにゅう',korean:'구입',level:'N2'},{id:4360,kanji:'好評',hiragana:'こうひょう',korean:'호평',level:'N2'},
{id:4361,kanji:'採用',hiragana:'さいよう',korean:'채용',level:'N2'},{id:4362,kanji:'資源',hiragana:'しげん',korean:'자원',level:'N2'},{id:4363,kanji:'姿勢',hiragana:'しせい',korean:'자세',level:'N2'},{id:4364,kanji:'指導',hiragana:'しどう',korean:'지도',level:'N2'},{id:4365,kanji:'地元',hiragana:'じもと',korean:'그 고장',level:'N2'},{id:4366,kanji:'循環',hiragana:'じゅんかん',korean:'순환',level:'N2'},{id:4367,kanji:'状況',hiragana:'じょうきょう',korean:'상황',level:'N2'},{id:4368,kanji:'条件',hiragana:'じょうけん',korean:'조건',level:'N2'},{id:4369,kanji:'証拠',hiragana:'しょうこ',korean:'증거',level:'N2'},{id:4370,kanji:'詳細',hiragana:'しょうさい',korean:'상세',level:'N2'},
{id:4371,kanji:'象徴',hiragana:'しょうちょう',korean:'상징',level:'N2'},{id:4372,kanji:'診断',hiragana:'しんだん',korean:'진단',level:'N2'},{id:4373,kanji:'進歩',hiragana:'しんぽ',korean:'진보',level:'N2'},{id:4374,kanji:'信頼',hiragana:'しんらい',korean:'신뢰',level:'N2'},{id:4375,kanji:'製造',hiragana:'せいぞう',korean:'제조',level:'N2'},{id:4376,kanji:'制約',hiragana:'せいやく',korean:'제약',level:'N2'},{id:4377,kanji:'責任',hiragana:'せきにん',korean:'책임',level:'N2'},{id:4378,kanji:'設置',hiragana:'せっち',korean:'설치',level:'N2'},{id:4379,kanji:'宣伝',hiragana:'せんでん',korean:'선전',level:'N2'},{id:4380,kanji:'専念',hiragana:'せんねん',korean:'전념',level:'N2'},
{id:4381,kanji:'増加',hiragana:'ぞうか',korean:'증가',level:'N2'},{id:4382,kanji:'態度',hiragana:'たいど',korean:'태도',level:'N2'},{id:4383,kanji:'担当',hiragana:'たんとう',korean:'담당',level:'N2'},{id:4384,kanji:'長所',hiragana:'ちょうしょ',korean:'장점',level:'N2'},{id:4385,kanji:'調節',hiragana:'ちょうせつ',korean:'조절',level:'N2'},{id:4386,kanji:'特徴',hiragana:'とくちょう',korean:'특징',level:'N2'},{id:4387,kanji:'特定',hiragana:'とくてい',korean:'특정',level:'N2'},{id:4388,kanji:'特別',hiragana:'とくべつ',korean:'특별',level:'N2'},{id:4389,kanji:'土地',hiragana:'とち',korean:'토지',level:'N2'},{id:4390,kanji:'波',hiragana:'なみ',korean:'파도',level:'N2'},
{id:4391,kanji:'涙',hiragana:'なみだ',korean:'눈물',level:'N2'},{id:4392,kanji:'温もり',hiragana:'ぬくもり',korean:'온기',level:'N2'},{id:4393,kanji:'値段',hiragana:'ねだん',korean:'가격',level:'N2'},{id:4394,kanji:'農産物',hiragana:'のうさんぶつ',korean:'농산물',level:'N2'},{id:4395,kanji:'能率',hiragana:'のうりつ',korean:'능률',level:'N2'},{id:4396,kanji:'把握',hiragana:'はあく',korean:'파악',level:'N2'},{id:4397,kanji:'配達',hiragana:'はいたつ',korean:'배달',level:'N2'},{id:4398,kanji:'俳優',hiragana:'はいゆう',korean:'배우',level:'N2'},{id:4399,kanji:'配慮',hiragana:'はいりょ',korean:'배려',level:'N2'},{id:4400,kanji:'破壊',hiragana:'はかい',korean:'파괴',level:'N2'},
{id:4401,kanji:'肌',hiragana:'はだ',korean:'피부',level:'N2'},{id:4402,kanji:'発揮',hiragana:'はっき',korean:'발휘',level:'N2'},{id:4403,kanji:'発行',hiragana:'はっこう',korean:'발행',level:'N2'},{id:4404,kanji:'発送',hiragana:'はっそう',korean:'발송',level:'N2'},{id:4405,kanji:'発売',hiragana:'はつばい',korean:'발매',level:'N2'},{id:4406,kanji:'幅',hiragana:'はば',korean:'폭',level:'N2'},{id:4407,kanji:'範囲',hiragana:'はんい',korean:'범위',level:'N2'},{id:4408,kanji:'反映',hiragana:'はんえい',korean:'반영',level:'N2'},{id:4409,kanji:'半額',hiragana:'はんがく',korean:'반액',level:'N2'},{id:4410,kanji:'半減',hiragana:'はんげん',korean:'반감',level:'N2'},
{id:4411,kanji:'判断',hiragana:'はんだん',korean:'판단',level:'N2'},{id:4412,kanji:'反応',hiragana:'はんのう',korean:'반응',level:'N2'},{id:4413,kanji:'販売',hiragana:'はんばい',korean:'판매',level:'N2'},{id:4414,kanji:'筆者',hiragana:'ひっしゃ',korean:'필자',level:'N2'},{id:4415,kanji:'飛躍的',hiragana:'ひやくてき',korean:'비약적',level:'N2'},{id:4416,kanji:'費用',hiragana:'ひよう',korean:'비용',level:'N2'},{id:4417,kanji:'評価',hiragana:'ひょうか',korean:'평가',level:'N2'},{id:4418,kanji:'風景',hiragana:'ふうけい',korean:'풍경',level:'N2'},{id:4419,kanji:'不可欠',hiragana:'ふかけつ',korean:'불가결',level:'N2'},{id:4420,kanji:'不足',hiragana:'ふそく',korean:'부족',level:'N2'},
{id:4421,kanji:'負担',hiragana:'ふたん',korean:'부담',level:'N2'},{id:4422,kanji:'普遍的',hiragana:'ふへんてき',korean:'보편적',level:'N2'},{id:4423,kanji:'不良品',hiragana:'ふりょうひん',korean:'불량품',level:'N2'},{id:4424,kanji:'分析',hiragana:'ぶんせき',korean:'분석',level:'N2'},{id:4425,kanji:'弊社',hiragana:'へいしゃ',korean:'자기 회사의 겸칭',level:'N2'},{id:4426,kanji:'平和',hiragana:'へいわ',korean:'평화',level:'N2'},{id:4427,kanji:'変換',hiragana:'へんかん',korean:'변환',level:'N2'},{id:4428,kanji:'変更',hiragana:'へんこう',korean:'변경',level:'N2'},{id:4429,kanji:'法律',hiragana:'ほうりつ',korean:'법률',level:'N2'},{id:4430,kanji:'保護者',hiragana:'ほごしゃ',korean:'보호자',level:'N2'},
{id:4431,kanji:'募集',hiragana:'ぼしゅう',korean:'모집',level:'N2'},{id:4432,kanji:'本質',hiragana:'ほんしつ',korean:'본질',level:'N2'},{id:4433,kanji:'本物',hiragana:'ほんもの',korean:'진짜',level:'N2'},{id:4434,kanji:'見た目',hiragana:'みため',korean:'겉모습',level:'N2'},{id:4435,kanji:'魅力',hiragana:'みりょく',korean:'매력',level:'N2'},{id:4436,kanji:'名刺',hiragana:'めいし',korean:'명함',level:'N2'},{id:4437,kanji:'模型',hiragana:'もけい',korean:'모형',level:'N2'},{id:4438,kanji:'模範',hiragana:'もはん',korean:'모범',level:'N2'},{id:4439,kanji:'遊園地',hiragana:'ゆうえんち',korean:'유원지',level:'N2'},{id:4440,kanji:'有効',hiragana:'ゆうこう',korean:'유효',level:'N2'},
{id:4441,kanji:'優勝',hiragana:'ゆうしょう',korean:'우승',level:'N2'},{id:4442,kanji:'夢',hiragana:'ゆめ',korean:'꿈',level:'N2'},{id:4443,kanji:'要求',hiragana:'ようきゅう',korean:'요구',level:'N2'},{id:4444,kanji:'様子',hiragana:'ようす',korean:'모습, 모양',level:'N2'},{id:4445,kanji:'世の中',hiragana:'よのなか',korean:'세상',level:'N2'},{id:4446,kanji:'余裕',hiragana:'よゆう',korean:'여유',level:'N2'},{id:4447,kanji:'楽天的',hiragana:'らくてんてき',korean:'낙천적',level:'N2'},{id:4448,kanji:'利益',hiragana:'りえき',korean:'이익',level:'N2'},{id:4449,kanji:'利点',hiragana:'りてん',korean:'이점',level:'N2'},{id:4450,kanji:'歴史',hiragana:'れきし',korean:'역사',level:'N2'},
{id:4451,kanji:'割引',hiragana:'わりびき',korean:'할인',level:'N2'},{id:4452,kanji:'相変わらず',hiragana:'あいかわらず',korean:'변함없이',level:'N2'},{id:4453,kanji:'相次いで',hiragana:'あいついで',korean:'잇따라',level:'N2'},{id:4454,kanji:'改めて',hiragana:'あらためて',korean:'다시, 재차',level:'N2'},{id:4455,kanji:'案外',hiragana:'あんがい',korean:'의외로',level:'N2'},{id:4456,kanji:'生き生き',hiragana:'いきいき',korean:'생생한 모양',level:'N2'},{id:4457,kanji:'一応',hiragana:'いちおう',korean:'일단',level:'N2'},{id:4458,kanji:'一斉に',hiragana:'いっせいに',korean:'일제히',level:'N2'},{id:4459,kanji:'一体',hiragana:'いったい',korean:'대체',level:'N2'},{id:4460,kanji:'今にも',hiragana:'いまにも',korean:'금방이라도',level:'N2'},
{id:4461,kanji:'大いに',hiragana:'おおいに',korean:'크게, 매우',level:'N2'},{id:4462,kanji:'各々',hiragana:'おのおの',korean:'각각',level:'N2'},{id:4463,kanji:'思わず',hiragana:'おもわず',korean:'무심코',level:'N2'},{id:4464,kanji:'必ず',hiragana:'かならず',korean:'반드시, 꼭',level:'N2'},{id:4465,kanji:'必ずしも',hiragana:'かならずしも',korean:'반드시 ~인 것은 아니다',level:'N2'},{id:4466,kanji:'偶然',hiragana:'ぐうぜん',korean:'우연히',level:'N2'},{id:4467,kanji:'幸いに',hiragana:'さいわいに',korean:'다행히',level:'N2'},{id:4468,kanji:'先ほど',hiragana:'さきほど',korean:'아까',level:'N2'},{id:4469,kanji:'早速',hiragana:'さっそく',korean:'즉시',level:'N2'},{id:4470,kanji:'様々',hiragana:'さまざま',korean:'여러 가지',level:'N2'},
{id:4471,kanji:'強いて',hiragana:'しいて',korean:'굳이',level:'N2'},{id:4472,kanji:'直に',hiragana:'じかに',korean:'직접',level:'N2'},{id:4473,kanji:'次第に',hiragana:'しだいに',korean:'점점',level:'N2'},{id:4474,kanji:'実に',hiragana:'じつに',korean:'실제로',level:'N2'},{id:4475,kanji:'十分',hiragana:'じゅうぶん',korean:'충분',level:'N2'},{id:4476,kanji:'徐々に',hiragana:'じょじょに',korean:'서서히',level:'N2'},{id:4477,kanji:'少なくとも',hiragana:'すくなくとも',korean:'적어도',level:'N2'},{id:4478,kanji:'絶対に',hiragana:'ぜったいに',korean:'절대로',level:'N2'},{id:4479,kanji:'相当',hiragana:'そうとう',korean:'상당히',level:'N2'},{id:4480,kanji:'続々',hiragana:'ぞくぞく',korean:'속속',level:'N2'},
{id:4481,kanji:'大抵',hiragana:'たいてい',korean:'대체로',level:'N2'},{id:4482,kanji:'絶えず',hiragana:'たえず',korean:'끊임없이',level:'N2'},{id:4483,kanji:'多少',hiragana:'たしょう',korean:'다소',level:'N2'},{id:4484,kanji:'直ちに',hiragana:'ただちに',korean:'즉시',level:'N2'},{id:4485,kanji:'単なる',hiragana:'たんなる',korean:'단순한',level:'N2'},{id:4486,kanji:'着々',hiragana:'ちゃくちゃく',korean:'착착',level:'N2'},{id:4487,kanji:'常に',hiragana:'つねに',korean:'항상',level:'N2'},{id:4488,kanji:'突然',hiragana:'とつぜん',korean:'돌연, 갑자기',level:'N2'},{id:4489,kanji:'何しろ',hiragana:'なにしろ',korean:'아무튼',level:'N2'},{id:4490,kanji:'何とか',hiragana:'なんとか',korean:'어떻게든',level:'N2'},
{id:4491,kanji:'果たして',hiragana:'はたして',korean:'과연',level:'N2'},{id:4492,kanji:'再び',hiragana:'ふたたび',korean:'다시, 재차',level:'N2'},{id:4493,kanji:'別々',hiragana:'べつべつ',korean:'따로따로',level:'N2'},{id:4494,kanji:'全く',hiragana:'まったく',korean:'전혀',level:'N2'},{id:4495,kanji:'最も',hiragana:'もっとも',korean:'가장',level:'N2'},{id:4496,kanji:'元々',hiragana:'もともと',korean:'원래',level:'N2'},{id:4497,kanji:'余計',hiragana:'よけい',korean:'한층 더',level:'N2'},{id:4498,kanji:'相互',hiragana:'そうご',korean:'상호',level:'N2'},{id:4499,kanji:'規模',hiragana:'きぼ',korean:'규모',level:'N2'},{id:4500,kanji:'景色',hiragana:'けしき',korean:'경치',level:'N2'},
{id:4501,kanji:'尊重する',hiragana:'そんちょうする',korean:'존중하다',level:'N2'},{id:4502,kanji:'治療',hiragana:'ちりょう',korean:'치료',level:'N2'},{id:4503,kanji:'防災',hiragana:'ぼうさい',korean:'방재',level:'N2'},{id:4504,kanji:'装置',hiragana:'そうち',korean:'장치',level:'N2'},{id:4505,kanji:'返却',hiragana:'へんきゃく',korean:'반납',level:'N2'},{id:4506,kanji:'削除',hiragana:'さくじょ',korean:'삭제',level:'N2'},{id:4507,kanji:'焦点',hiragana:'しょうてん',korean:'초점',level:'N2'},{id:4508,kanji:'撮影',hiragana:'さつえい',korean:'촬영',level:'N2'},{id:4509,kanji:'破片',hiragana:'はへん',korean:'파편',level:'N2'},{id:4510,kanji:'戻す',hiragana:'もどす',korean:'되돌리다',level:'N2'},
{id:4511,kanji:'継続',hiragana:'けいぞく',korean:'계속',level:'N2'},{id:4512,kanji:'圧勝',hiragana:'あっしょう',korean:'압승',level:'N2'},{id:4513,kanji:'除く',hiragana:'のぞく',korean:'제외하다',level:'N2'},{id:4514,kanji:'傷む',hiragana:'いたむ',korean:'상하다',level:'N2'},{id:4515,kanji:'貿易',hiragana:'ぼうえき',korean:'무역',level:'N2'},{id:4516,kanji:'拒否',hiragana:'きょひ',korean:'거부',level:'N2'},{id:4517,kanji:'囲む',hiragana:'かこむ',korean:'둘러싸다',level:'N2'},{id:4518,kanji:'油断',hiragana:'ゆだん',korean:'방심',level:'N2'},{id:4519,kanji:'損害',hiragana:'そんがい',korean:'손해',level:'N2'},{id:4520,kanji:'行事',hiragana:'ぎょうじ',korean:'행사',level:'N2'},
{id:4521,kanji:'現象',hiragana:'げんしょう',korean:'현상',level:'N2'},{id:4522,kanji:'批評',hiragana:'ひひょう',korean:'비평',level:'N2'},{id:4523,kanji:'容姿',hiragana:'ようし',korean:'용모, 외모',level:'N2'},{id:4524,kanji:'願望',hiragana:'がんぼう',korean:'소망',level:'N2'},{id:4525,kanji:'握る',hiragana:'にぎる',korean:'쥐다',level:'N2'},{id:4526,kanji:'密閉',hiragana:'みっぺい',korean:'밀폐',level:'N2'},{id:4527,kanji:'絞る',hiragana:'しぼる',korean:'짜다',level:'N2'},{id:4528,kanji:'垂直',hiragana:'すいちょく',korean:'수직',level:'N2'},{id:4529,kanji:'求人',hiragana:'きゅうじん',korean:'구인',level:'N2'},{id:4530,kanji:'冷蔵庫',hiragana:'れいぞうこ',korean:'냉장고',level:'N2'},
{id:4531,kanji:'総額',hiragana:'そうがく',korean:'총액',level:'N2'},{id:4532,kanji:'抽選',hiragana:'ちゅうせん',korean:'추첨',level:'N2'},{id:4533,kanji:'企画',hiragana:'きかく',korean:'기획',level:'N2'},{id:4534,kanji:'再度',hiragana:'さいど',korean:'두 번, 재차',level:'N2'},{id:4535,kanji:'処理',hiragana:'しょり',korean:'처리',level:'N2'},{id:4536,kanji:'憎む',hiragana:'にくむ',korean:'미워하다',level:'N2'},{id:4537,kanji:'刺激',hiragana:'しげき',korean:'자극',level:'N2'},{id:4538,kanji:'恥',hiragana:'はじ',korean:'부끄러움',level:'N2'},{id:4539,kanji:'等しい',hiragana:'ひとしい',korean:'같다',level:'N2'},{id:4540,kanji:'軽傷',hiragana:'けいしょう',korean:'가벼운 부상',level:'N2'},
{id:4541,kanji:'映る',hiragana:'うつる',korean:'비치다',level:'N2'},{id:4542,kanji:'下旬',hiragana:'げじゅん',korean:'하순',level:'N2'},{id:4543,kanji:'比較的',hiragana:'ひかくてき',korean:'비교적',level:'N2'},{id:4544,kanji:'下降',hiragana:'かこう',korean:'하강',level:'N2'},{id:4545,kanji:'著しい',hiragana:'いちじるしい',korean:'현저하다',level:'N2'},{id:4546,kanji:'声援',hiragana:'せいえん',korean:'성원',level:'N2'},{id:4547,kanji:'介護',hiragana:'かいご',korean:'간병',level:'N2'},{id:4548,kanji:'賛否',hiragana:'さんぴ',korean:'찬반',level:'N2'},{id:4549,kanji:'記憶',hiragana:'きおく',korean:'기억',level:'N2'},{id:4550,kanji:'偉大',hiragana:'いだい',korean:'위대',level:'N2'},
{id:4551,kanji:'途端に',hiragana:'とたんに',korean:'갑자기',level:'N2'},{id:4552,kanji:'素材',hiragana:'そざい',korean:'소재',level:'N2'},{id:4553,kanji:'警備',hiragana:'けいび',korean:'경비',level:'N2'},{id:4554,kanji:'世間',hiragana:'せけん',korean:'세상',level:'N2'},{id:4555,kanji:'勇ましい',hiragana:'いさましい',korean:'용감하다',level:'N2'},{id:4556,kanji:'運賃',hiragana:'うんちん',korean:'운임',level:'N2'},{id:4557,kanji:'分担',hiragana:'ぶんたん',korean:'분담',level:'N2'},{id:4558,kanji:'転勤',hiragana:'てんきん',korean:'전근',level:'N2'},{id:4559,kanji:'栽培',hiragana:'さいばい',korean:'재배',level:'N2'},{id:4560,kanji:'評判',hiragana:'ひょうばん',korean:'평판',level:'N2'},
{id:4561,kanji:'視野',hiragana:'しや',korean:'시야',level:'N2'},{id:4562,kanji:'改善',hiragana:'かいぜん',korean:'개선',level:'N2'},{id:4563,kanji:'活気',hiragana:'かっき',korean:'활기',level:'N2'},{id:4564,kanji:'辞退',hiragana:'じたい',korean:'사퇴',level:'N2'},{id:4565,kanji:'改正',hiragana:'かいせい',korean:'개정',level:'N2'},{id:4566,kanji:'夢中',hiragana:'むちゅう',korean:'열중',level:'N2'},{id:4567,kanji:'意欲',hiragana:'いよく',korean:'의욕',level:'N2'},{id:4568,kanji:'導入',hiragana:'どうにゅう',korean:'도입',level:'N2'},{id:4569,kanji:'訂正',hiragana:'ていせい',korean:'정정',level:'N2'},{id:4570,kanji:'予測',hiragana:'よそく',korean:'예측',level:'N2'},
{id:4571,kanji:'完了',hiragana:'かんりょう',korean:'완료',level:'N2'},{id:4572,kanji:'通過',hiragana:'つうか',korean:'통과',level:'N2'},{id:4573,kanji:'報道',hiragana:'ほうどう',korean:'보도',level:'N2'},{id:4574,kanji:'省略',hiragana:'しょうりゃく',korean:'생략',level:'N2'},{id:4575,kanji:'口調',hiragana:'くちょう',korean:'어조, 말투',level:'N2'},{id:4576,kanji:'役目',hiragana:'やくめ',korean:'임무',level:'N2'},{id:4577,kanji:'礼儀',hiragana:'れいぎ',korean:'예의',level:'N2'},{id:4578,kanji:'開催',hiragana:'かいさい',korean:'개최',level:'N2'},{id:4579,kanji:'出世',hiragana:'しゅっせ',korean:'출세',level:'N2'},{id:4580,kanji:'伝統',hiragana:'でんとう',korean:'전통',level:'N2'},
{id:4581,kanji:'管理',hiragana:'かんり',korean:'관리',level:'N2'},{id:4582,kanji:'登録',hiragana:'とうろく',korean:'등록',level:'N2'},{id:4583,kanji:'福祉',hiragana:'ふくし',korean:'복지',level:'N2'},{id:4584,kanji:'討論',hiragana:'とうろん',korean:'토론',level:'N2'},{id:4585,kanji:'収穫',hiragana:'しゅうかく',korean:'수확',level:'N2'},{id:4586,kanji:'抵抗',hiragana:'ていこう',korean:'저항',level:'N2'},{id:4587,kanji:'組織',hiragana:'そしき',korean:'조직',level:'N2'},{id:4588,kanji:'講師',hiragana:'こうし',korean:'강사',level:'N2'},{id:4589,kanji:'指摘',hiragana:'してき',korean:'지적',level:'N2'},{id:4590,kanji:'参照',hiragana:'さんしょう',korean:'참조',level:'N2'},
{id:4591,kanji:'保証',hiragana:'ほしょう',korean:'보증',level:'N2'},{id:4592,kanji:'症状',hiragana:'しょうじょう',korean:'증상',level:'N2'},{id:4593,kanji:'硬貨',hiragana:'こうか',korean:'동전',level:'N2'},{id:4594,kanji:'在籍',hiragana:'ざいせき',korean:'재적',level:'N2'},{id:4595,kanji:'領収書',hiragana:'りょうしゅうしょ',korean:'영수증',level:'N2'},{id:4596,kanji:'帰省',hiragana:'きせい',korean:'귀성',level:'N2'},{id:4597,kanji:'拡張',hiragana:'かくちょう',korean:'확장',level:'N2'},{id:4598,kanji:'乱暴',hiragana:'らんぼう',korean:'난폭',level:'N2'},{id:4599,kanji:'弱点',hiragana:'じゃくてん',korean:'약점',level:'N2'},{id:4600,kanji:'廃止',hiragana:'はいし',korean:'폐지',level:'N2'},
{id:4601,kanji:'矛盾',hiragana:'むじゅん',korean:'모순',level:'N2'},{id:4602,kanji:'交代',hiragana:'こうたい',korean:'교대',level:'N2'},{id:4603,kanji:'合同',hiragana:'ごうどう',korean:'합동',level:'N2'},{id:4604,kanji:'掲示',hiragana:'けいじ',korean:'게시',level:'N2'},{id:4605,kanji:'補足',hiragana:'ほそく',korean:'보충',level:'N2'},{id:4606,kanji:'反省',hiragana:'はんせい',korean:'반성',level:'N2'},{id:4607,kanji:'頂上',hiragana:'ちょうじょう',korean:'정상',level:'N2'},{id:4608,kanji:'分解',hiragana:'ぶんかい',korean:'분해',level:'N2'},{id:4609,kanji:'論争',hiragana:'ろんそう',korean:'논쟁',level:'N2'},{id:4610,kanji:'演説',hiragana:'えんぜつ',korean:'연설',level:'N2'},
{id:4611,kanji:'保存',hiragana:'ほぞん',korean:'보존',level:'N2'},{id:4612,kanji:'日課',hiragana:'にっか',korean:'일과',level:'N2'},{id:4613,kanji:'多彩',hiragana:'たさい',korean:'다채',level:'N2'},{id:4614,kanji:'初歩',hiragana:'しょほ',korean:'초보',level:'N2'},{id:4615,kanji:'特殊',hiragana:'とくしゅ',korean:'특수',level:'N2'},{id:4616,kanji:'充満',hiragana:'じゅうまん',korean:'충만',level:'N2'},{id:4617,kanji:'欠陥',hiragana:'けっかん',korean:'결함',level:'N2'},{id:4618,kanji:'引退',hiragana:'いんたい',korean:'은퇴',level:'N2'},{id:4619,kanji:'展開',hiragana:'てんかい',korean:'전개',level:'N2'},{id:4620,kanji:'急激',hiragana:'きゅうげき',korean:'급격',level:'N2'},
{id:4621,kanji:'世代',hiragana:'せだい',korean:'세대',level:'N2'},{id:4622,kanji:'頑固',hiragana:'がんこ',korean:'완고',level:'N2'},{id:4623,kanji:'中断',hiragana:'ちゅうだん',korean:'중단',level:'N2'},{id:4624,kanji:'早期',hiragana:'そうき',korean:'조기',level:'N2'},{id:4625,kanji:'発達',hiragana:'はったつ',korean:'발달',level:'N2'},{id:4626,kanji:'延長',hiragana:'えんちょう',korean:'연장',level:'N2'},{id:4627,kanji:'上達',hiragana:'じょうたつ',korean:'숙달',level:'N2'},{id:4628,kanji:'残高',hiragana:'ざんだか',korean:'잔액',level:'N2'},{id:4629,kanji:'共有',hiragana:'きょうゆう',korean:'공유',level:'N2'},{id:4630,kanji:'鑑賞',hiragana:'かんしょう',korean:'감상',level:'N2'},
{id:4631,kanji:'充実',hiragana:'じゅうじつ',korean:'충실',level:'N2'},{id:4632,kanji:'鮮明',hiragana:'せんめい',korean:'선명',level:'N2'},{id:4633,kanji:'定年',hiragana:'ていねん',korean:'정년',level:'N2'},{id:4634,kanji:'従う',hiragana:'したがう',korean:'따르다',level:'N2'},{id:4635,kanji:'争う',hiragana:'あらそう',korean:'다투다',level:'N2'},{id:4636,kanji:'敬う',hiragana:'うやまう',korean:'존경하다',level:'N2'},{id:4637,kanji:'束ねる',hiragana:'たばねる',korean:'묶다',level:'N2'},{id:4638,kanji:'散る',hiragana:'ちる',korean:'흩어지다',level:'N2'},{id:4639,kanji:'混じる',hiragana:'まじる',korean:'섞이다',level:'N2'},{id:4640,kanji:'薄める',hiragana:'うすめる',korean:'희석하다',level:'N2'},
{id:4641,kanji:'固める',hiragana:'かためる',korean:'굳히다',level:'N2'},{id:4642,kanji:'雇う',hiragana:'やとう',korean:'고용하다',level:'N2'},{id:4643,kanji:'蓄える',hiragana:'たくわえる',korean:'비축하다',level:'N2'},{id:4644,kanji:'濁る',hiragana:'にごる',korean:'탁해지다',level:'N2'},{id:4645,kanji:'衰える',hiragana:'おとろえる',korean:'쇠퇴하다',level:'N2'},{id:4646,kanji:'面する',hiragana:'めんする',korean:'마주 대하다',level:'N2'},{id:4647,kanji:'腫れる',hiragana:'はれる',korean:'붓다',level:'N2'},{id:4648,kanji:'さびる',hiragana:'さびる',korean:'녹슬다',level:'N2'},{id:4649,kanji:'しみる',hiragana:'しみる',korean:'스며들다',level:'N2'},{id:4650,kanji:'めくる',hiragana:'めくる',korean:'넘기다',level:'N2'},
{id:4651,kanji:'破る',hiragana:'やぶる',korean:'찢다',level:'N2'},{id:4652,kanji:'散らかる',hiragana:'ちらかる',korean:'어질러지다',level:'N2'},{id:4653,kanji:'散らかす',hiragana:'ちらかす',korean:'어지르다',level:'N2'},{id:4654,kanji:'塞ぐ',hiragana:'ふさぐ',korean:'막다',level:'N2'},{id:4655,kanji:'畳む',hiragana:'たたむ',korean:'접다',level:'N2'},{id:4656,kanji:'尽きる',hiragana:'つきる',korean:'소진되다',level:'N2'},{id:4657,kanji:'暮らす',hiragana:'くらす',korean:'살다',level:'N2'},{id:4658,kanji:'飛び散る',hiragana:'とびちる',korean:'사방에 흩날리다',level:'N2'},{id:4659,kanji:'乗り継ぐ',hiragana:'のりつぐ',korean:'갈아타다',level:'N2'},{id:4660,kanji:'生じる',hiragana:'しょうじる',korean:'생기다',level:'N2'},
{id:4661,kanji:'引き止める',hiragana:'ひきとめる',korean:'만류하다',level:'N2'},{id:4662,kanji:'打ち消す',hiragana:'うちけす',korean:'부정하다',level:'N2'},{id:4663,kanji:'思い込む',hiragana:'おもいこむ',korean:'믿다, 마음먹다',level:'N2'},{id:4664,kanji:'受け入れる',hiragana:'うけいれる',korean:'받아들이다',level:'N2'},{id:4665,kanji:'絡まる',hiragana:'からまる',korean:'얽히다',level:'N2'},{id:4666,kanji:'うつむく',hiragana:'うつむく',korean:'고개를 숙이다',level:'N2'},{id:4667,kanji:'ささやく',hiragana:'ささやく',korean:'속삭이다',level:'N2'},{id:4668,kanji:'つまずく',hiragana:'つまずく',korean:'걸려 넘어지다',level:'N2'},{id:4669,kanji:'もてなす',hiragana:'もてなす',korean:'대접하다',level:'N2'},{id:4670,kanji:'うなずく',hiragana:'うなずく',korean:'고개를 끄덕이다',level:'N2'},
{id:4671,kanji:'いだく',hiragana:'いだく',korean:'품다',level:'N2'},{id:4672,kanji:'まねる',hiragana:'まねる',korean:'흉내내다',level:'N2'},{id:4673,kanji:'溶け込む',hiragana:'とけこむ',korean:'녹아들다',level:'N2'},{id:4674,kanji:'飛びつく',hiragana:'とびつく',korean:'달려들다',level:'N2'},{id:4675,kanji:'こそこそ',hiragana:'こそこそ',korean:'살금살금',level:'N2'},{id:4676,kanji:'ぶらぶら',hiragana:'ぶらぶら',korean:'어슬렁어슬렁',level:'N2'},{id:4677,kanji:'ぼんやり',hiragana:'ぼんやり',korean:'멍하게',level:'N2'},{id:4678,kanji:'さっぱり',hiragana:'さっぱり',korean:'전혀',level:'N2'},{id:4679,kanji:'のんびり',hiragana:'のんびり',korean:'한가로이',level:'N2'},{id:4680,kanji:'ぎりぎり',hiragana:'ぎりぎり',korean:'아슬아슬',level:'N2'},
{id:4681,kanji:'ぎっしり',hiragana:'ぎっしり',korean:'가득',level:'N2'},{id:4682,kanji:'ごちゃごちゃ',hiragana:'ごちゃごちゃ',korean:'어수선하게',level:'N2'},{id:4683,kanji:'ひそひそ',hiragana:'ひそひそ',korean:'소근소근',level:'N2'},{id:4684,kanji:'じろじろ',hiragana:'じろじろ',korean:'빤히',level:'N2'},{id:4685,kanji:'ぞろぞろ',hiragana:'ぞろぞろ',korean:'졸졸',level:'N2'},{id:4686,kanji:'ぐったり',hiragana:'ぐったり',korean:'매우 지친 모습',level:'N2'},{id:4687,kanji:'たっぷり',hiragana:'たっぷり',korean:'듬뿍',level:'N2'},{id:4688,kanji:'すっきり',hiragana:'すっきり',korean:'후련하게',level:'N2'},{id:4689,kanji:'びっしょり',hiragana:'びっしょり',korean:'흠뻑',level:'N2'},{id:4690,kanji:'にっこり',hiragana:'にっこり',korean:'생긋',level:'N2'},
{id:4691,kanji:'はきはき',hiragana:'はきはき',korean:'확실한 모양',level:'N2'},{id:4692,kanji:'うとうと',hiragana:'うとうと',korean:'꾸벅꾸벅',level:'N2'},{id:4693,kanji:'かさかさ',hiragana:'かさかさ',korean:'꺼칠꺼칠',level:'N2'},{id:4694,kanji:'こつこつと',hiragana:'こつこつと',korean:'꾸준하게',level:'N2'},{id:4695,kanji:'ごろごろ',hiragana:'ごろごろ',korean:'뒹굴뒹굴',level:'N2'},{id:4696,kanji:'あいにく',hiragana:'あいにく',korean:'공교롭게도',level:'N2'},{id:4697,kanji:'かえって',hiragana:'かえって',korean:'도리어, 오히려',level:'N2'},{id:4698,kanji:'たちまち',hiragana:'たちまち',korean:'금세',level:'N2'},{id:4699,kanji:'とっくに',hiragana:'とっくに',korean:'진작에',level:'N2'},{id:4700,kanji:'あらかじめ',hiragana:'あらかじめ',korean:'미리',level:'N2'},
{id:4701,kanji:'いきなり',hiragana:'いきなり',korean:'갑자기',level:'N2'},{id:4702,kanji:'そそっかしい',hiragana:'そそっかしい',korean:'경솔하다',level:'N2'},{id:4703,kanji:'ふさわしい',hiragana:'ふさわしい',korean:'어울리다',level:'N2'},{id:4704,kanji:'たくましい',hiragana:'たくましい',korean:'씩씩하다',level:'N2'},{id:4705,kanji:'だらしない',hiragana:'だらしない',korean:'단정하지 못하다',level:'N2'},{id:4706,kanji:'やかましい',hiragana:'やかましい',korean:'시끄럽다',level:'N2'},{id:4707,kanji:'まれな',hiragana:'まれな',korean:'드문',level:'N2'},{id:4708,kanji:'なだらかな',hiragana:'なだらかな',korean:'완만한',level:'N2'},{id:4709,kanji:'鮮やかな',hiragana:'あざやかな',korean:'선명한',level:'N2'},{id:4710,kanji:'陽気な',hiragana:'ようきな',korean:'명랑한',level:'N2'},
{id:4711,kanji:'善良な',hiragana:'ぜんりょうな',korean:'선량한',level:'N2'},{id:4712,kanji:'積極的な',hiragana:'せっきょくてきな',korean:'적극적인',level:'N2'},{id:4713,kanji:'典型的な',hiragana:'てんけいてきな',korean:'전형적인',level:'N2'},{id:4714,kanji:'用心深い',hiragana:'ようじんぶかい',korean:'조심성이 많다',level:'N2'},{id:4715,kanji:'湿っぽい',hiragana:'しめっぽい',korean:'눅눅하다',level:'N2'},{id:4716,kanji:'ずうずうしい',hiragana:'ずうずうしい',korean:'뻔뻔스럽다',level:'N2'},{id:4717,kanji:'厚かましい',hiragana:'あつかましい',korean:'뻔뻔하다',level:'N2'},{id:4718,kanji:'卑怯な',hiragana:'ひきょうな',korean:'비겁한',level:'N2'},{id:4719,kanji:'臆病だ',hiragana:'おくびょうだ',korean:'겁이 많다',level:'N2'},{id:4720,kanji:'勘定',hiragana:'かんじょう',korean:'지불, 계산',level:'N2'},
{id:4721,kanji:'欲',hiragana:'よく',korean:'욕심',level:'N2'},{id:4722,kanji:'気配',hiragana:'けはい',korean:'기미, 분위기',level:'N2'},{id:4723,kanji:'苦情',hiragana:'くじょう',korean:'불평',level:'N2'},{id:4724,kanji:'名所',hiragana:'めいしょ',korean:'명소',level:'N2'},{id:4725,kanji:'体格',hiragana:'たいかく',korean:'체격',level:'N2'},{id:4726,kanji:'特色',hiragana:'とくしょく',korean:'특색',level:'N2'},{id:4727,kanji:'用途',hiragana:'ようと',korean:'용도',level:'N2'},{id:4728,kanji:'行方',hiragana:'ゆくえ',korean:'행방',level:'N2'},{id:4729,kanji:'見解',hiragana:'けんかい',korean:'견해',level:'N2'},{id:4730,kanji:'場面',hiragana:'ばめん',korean:'장면',level:'N2'},
{id:4731,kanji:'概要',hiragana:'がいよう',korean:'개요',level:'N2'},{id:4732,kanji:'限界',hiragana:'げんかい',korean:'한계',level:'N2'},{id:4733,kanji:'機能',hiragana:'きのう',korean:'기능',level:'N2'},{id:4734,kanji:'格好',hiragana:'かっこう',korean:'모습, 모양',level:'N2'},{id:4735,kanji:'比例',hiragana:'ひれい',korean:'비례',level:'N2'},{id:4736,kanji:'方針',hiragana:'ほうしん',korean:'방침',level:'N2'},{id:4737,kanji:'人柄',hiragana:'ひとがら',korean:'인품',level:'N2'},{id:4738,kanji:'用心',hiragana:'ようじん',korean:'조심',level:'N2'},{id:4739,kanji:'指図',hiragana:'さしず',korean:'지시',level:'N2'},{id:4740,kanji:'合図',hiragana:'あいず',korean:'신호',level:'N2'},
{id:4741,kanji:'妥当な',hiragana:'だとうな',korean:'타당한',level:'N2'},{id:4742,kanji:'手軽な',hiragana:'てがるな',korean:'간편한',level:'N2'},{id:4743,kanji:'催促',hiragana:'さいそく',korean:'재촉',level:'N2'},{id:4744,kanji:'支持',hiragana:'しじ',korean:'지지',level:'N2'},{id:4745,kanji:'打ち合わせ',hiragana:'うちあわせ',korean:'협의',level:'N2'},{id:4746,kanji:'言い訳',hiragana:'いいわけ',korean:'변명',level:'N2'},{id:4747,kanji:'後悔',hiragana:'こうかい',korean:'후회',level:'N2'},{id:4748,kanji:'話題',hiragana:'わだい',korean:'화제',level:'N2'},{id:4749,kanji:'契機',hiragana:'けいき',korean:'계기',level:'N2'},{id:4750,kanji:'確保',hiragana:'かくほ',korean:'확보',level:'N2'},
{id:4751,kanji:'節約',hiragana:'せつやく',korean:'절약',level:'N2'},{id:4752,kanji:'解約',hiragana:'かいやく',korean:'해약',level:'N2'},{id:4753,kanji:'交渉',hiragana:'こうしょう',korean:'교섭',level:'N2'},{id:4754,kanji:'接続',hiragana:'せつぞく',korean:'접속',level:'N2'},{id:4755,kanji:'普及',hiragana:'ふきゅう',korean:'보급',level:'N2'},{id:4756,kanji:'続出',hiragana:'ぞくしゅつ',korean:'속출',level:'N2'},{id:4757,kanji:'設備',hiragana:'せつび',korean:'설비',level:'N2'},{id:4758,kanji:'進出',hiragana:'しんしゅつ',korean:'진출',level:'N2'},{id:4759,kanji:'援助',hiragana:'えんじょ',korean:'원조',level:'N2'},{id:4760,kanji:'批判',hiragana:'ひはん',korean:'비판',level:'N2'},
{id:4761,kanji:'混乱',hiragana:'こんらん',korean:'혼란',level:'N2'},{id:4762,kanji:'距離',hiragana:'きょり',korean:'거리',level:'N2'},{id:4763,kanji:'添付',hiragana:'てんぷ',korean:'첨부',level:'N2'},{id:4764,kanji:'点検',hiragana:'てんけん',korean:'점검',level:'N2'},{id:4765,kanji:'受講',hiragana:'じゅこう',korean:'수강',level:'N2'},{id:4766,kanji:'実践',hiragana:'じっせん',korean:'실천',level:'N2'},{id:4767,kanji:'衣装',hiragana:'いしょう',korean:'의상',level:'N2'},{id:4768,kanji:'演技',hiragana:'えんぎ',korean:'연기',level:'N2'},{id:4769,kanji:'違反',hiragana:'いはん',korean:'위반',level:'N2'},{id:4770,kanji:'損失',hiragana:'そんしつ',korean:'손실',level:'N2'},
{id:4771,kanji:'研修',hiragana:'けんしゅう',korean:'연수',level:'N2'},{id:4772,kanji:'勢い',hiragana:'いきおい',korean:'기세',level:'N2'},{id:4773,kanji:'疲労',hiragana:'ひろう',korean:'피로',level:'N2'},{id:4774,kanji:'避難',hiragana:'ひなん',korean:'피난',level:'N2'},{id:4775,kanji:'投票',hiragana:'とうひょう',korean:'투표',level:'N2'},{id:4776,kanji:'志望',hiragana:'しぼう',korean:'지망',level:'N2'},{id:4777,kanji:'短編',hiragana:'たんぺん',korean:'단편',level:'N2'},{id:4778,kanji:'精算',hiragana:'せいさん',korean:'정산',level:'N2'},{id:4779,kanji:'趣味',hiragana:'しゅみ',korean:'취미',level:'N2'},{id:4780,kanji:'系統',hiragana:'けいとう',korean:'계통',level:'N2'},
{id:4781,kanji:'作成',hiragana:'さくせい',korean:'작성',level:'N2'},{id:4782,kanji:'開設',hiragana:'かいせつ',korean:'개설',level:'N2'},{id:4783,kanji:'優秀な',hiragana:'ゆうしゅうな',korean:'우수한',level:'N2'},{id:4784,kanji:'新ただ',hiragana:'あらただ',korean:'새롭다',level:'N2'},{id:4785,kanji:'著しい',hiragana:'いちじるしい',korean:'두드러지다',level:'N2'},


// ── N1 (일단합격 JLPT N1 단어장) ──────────────────
{id:5001,kanji:'潤う',hiragana:'うるおう',korean:'축축해지다, 윤택해지다',level:'N1'},{id:5002,kanji:'極めて',hiragana:'きわめて',korean:'매우, 지극히',level:'N1'},{id:5003,kanji:'契約',hiragana:'けいやく',korean:'계약',level:'N1'},{id:5004,kanji:'推理',hiragana:'すいり',korean:'추리',level:'N1'},{id:5005,kanji:'壊す',hiragana:'こわす',korean:'부수다, 망가뜨리다',level:'N1'},{id:5006,kanji:'締める',hiragana:'しめる',korean:'(끈을) 매다',level:'N1'},{id:5007,kanji:'手薄な',hiragana:'てうすな',korean:'허술한, 불충분한',level:'N1'},{id:5008,kanji:'練る',hiragana:'ねる',korean:'반죽하다, (계획 등을) 다듬다',level:'N1'},{id:5009,kanji:'華々しい',hiragana:'はなばなしい',korean:'화려하다',level:'N1'},{id:5010,kanji:'繁盛',hiragana:'はんじょう',korean:'번성, 번창',level:'N1'},
{id:5011,kanji:'伴奏',hiragana:'ばんそう',korean:'반주',level:'N1'},{id:5012,kanji:'本筋',hiragana:'ほんすじ',korean:'본론, 본 줄거리',level:'N1'},{id:5013,kanji:'閲覧',hiragana:'えつらん',korean:'열람',level:'N1'},{id:5014,kanji:'合併',hiragana:'がっぺい',korean:'합병',level:'N1'},{id:5015,kanji:'肝心な',hiragana:'かんじんな',korean:'중요한',level:'N1'},{id:5016,kanji:'兆し',hiragana:'きざし',korean:'징조, 조짐',level:'N1'},{id:5017,kanji:'考慮',hiragana:'こうりょ',korean:'고려',level:'N1'},{id:5018,kanji:'根拠',hiragana:'こんきょ',korean:'근거',level:'N1'},{id:5019,kanji:'遮る',hiragana:'さえぎる',korean:'차단하다',level:'N1'},{id:5020,kanji:'釈明',hiragana:'しゃくめい',korean:'석명(해명, 설명)',level:'N1'},
{id:5021,kanji:'鈍る',hiragana:'にぶる',korean:'둔해지다, 무디어지다',level:'N1'},{id:5022,kanji:'逃れる',hiragana:'のがれる',korean:'벗어나다, 피하다',level:'N1'},{id:5023,kanji:'漠然と',hiragana:'ばくぜんと',korean:'막연하게',level:'N1'},{id:5024,kanji:'利益',hiragana:'りえき',korean:'이익',level:'N1'},{id:5025,kanji:'改革',hiragana:'かいかく',korean:'개혁',level:'N1'},{id:5026,kanji:'覆す',hiragana:'くつがえす',korean:'뒤집어엎다',level:'N1'},{id:5027,kanji:'克明に',hiragana:'こくめいに',korean:'극명하게',level:'N1'},{id:5028,kanji:'群衆',hiragana:'ぐんしゅう',korean:'군중',level:'N1'},{id:5029,kanji:'心地よい',hiragana:'ここちよい',korean:'기분 좋다, 상쾌하다',level:'N1'},{id:5030,kanji:'費やす',hiragana:'ついやす',korean:'사용하다, 소비하다',level:'N1'},
{id:5031,kanji:'手際',hiragana:'てぎわ',korean:'일처리 솜씨, 수완',level:'N1'},{id:5032,kanji:'踏襲する',hiragana:'とうしゅうする',korean:'답습하다',level:'N1'},{id:5033,kanji:'名誉',hiragana:'めいよ',korean:'명예',level:'N1'},{id:5034,kanji:'網羅',hiragana:'もうら',korean:'망라',level:'N1'},{id:5035,kanji:'由緒',hiragana:'ゆいしょ',korean:'유서, 내력',level:'N1'},{id:5036,kanji:'枠',hiragana:'わく',korean:'틀, 테두리',level:'N1'},{id:5037,kanji:'跡地',hiragana:'あとち',korean:'철거 부지',level:'N1'},{id:5038,kanji:'憤り',hiragana:'いきどおり',korean:'분노',level:'N1'},{id:5039,kanji:'憩い',hiragana:'いこい',korean:'휴식',level:'N1'},{id:5040,kanji:'おろかな',hiragana:'おろかな',korean:'어리석은',level:'N1'},
{id:5041,kanji:'緩和',hiragana:'かんわ',korean:'완화',level:'N1'},{id:5042,kanji:'巧妙な',hiragana:'こうみょうな',korean:'교묘한',level:'N1'},{id:5043,kanji:'趣旨',hiragana:'しゅし',korean:'취지',level:'N1'},{id:5044,kanji:'需要',hiragana:'じゅよう',korean:'수요',level:'N1'},{id:5045,kanji:'貫く',hiragana:'つらぬく',korean:'관철하다',level:'N1'},{id:5046,kanji:'日夜',hiragana:'にちや',korean:'밤낮, 늘',level:'N1'},{id:5047,kanji:'把握',hiragana:'はあく',korean:'파악',level:'N1'},{id:5048,kanji:'貧富',hiragana:'ひんぷ',korean:'빈부',level:'N1'},{id:5049,kanji:'否めない',hiragana:'いなめない',korean:'부정할 수 없다',level:'N1'},{id:5050,kanji:'概略',hiragana:'がいりゃく',korean:'개략',level:'N1'},
{id:5051,kanji:'凝縮',hiragana:'ぎょうしゅく',korean:'응축',level:'N1'},{id:5052,kanji:'厳正な',hiragana:'げんせいな',korean:'엄정한',level:'N1'},{id:5053,kanji:'拒む',hiragana:'こばむ',korean:'거부하다',level:'N1'},{id:5054,kanji:'遂行',hiragana:'すいこう',korean:'수행',level:'N1'},{id:5055,kanji:'健やかな',hiragana:'すこやかな',korean:'건강한',level:'N1'},{id:5056,kanji:'漂う',hiragana:'ただよう',korean:'떠돌다, 감돌다',level:'N1'},{id:5057,kanji:'中枢',hiragana:'ちゅうすう',korean:'중추',level:'N1'},{id:5058,kanji:'督促',hiragana:'とくそく',korean:'독촉',level:'N1'},{id:5059,kanji:'臨む',hiragana:'のぞむ',korean:'임하다, 직면하다',level:'N1'},{id:5060,kanji:'躍進',hiragana:'やくしん',korean:'약진',level:'N1'},
{id:5061,kanji:'値する',hiragana:'あたいする',korean:'~할 가치가 있다',level:'N1'},{id:5062,kanji:'淡い',hiragana:'あわい',korean:'연하다, 흐리다',level:'N1'},{id:5063,kanji:'画一的な',hiragana:'かくいつてきな',korean:'획일적인',level:'N1'},{id:5064,kanji:'興奮',hiragana:'こうふん',korean:'흥분',level:'N1'},{id:5065,kanji:'慕われる',hiragana:'したわれる',korean:'추앙받다, 존경받다',level:'N1'},{id:5066,kanji:'承諾',hiragana:'しょうだく',korean:'승낙',level:'N1'},{id:5067,kanji:'随時',hiragana:'ずいじ',korean:'수시로',level:'N1'},{id:5068,kanji:'添付',hiragana:'てんぷ',korean:'첨부',level:'N1'},{id:5069,kanji:'唱える',hiragana:'となえる',korean:'외치다, 주장하다',level:'N1'},{id:5070,kanji:'励む',hiragana:'はげむ',korean:'힘쓰다',level:'N1'},
{id:5071,kanji:'破損',hiragana:'はそん',korean:'파손',level:'N1'},{id:5072,kanji:'変遷',hiragana:'へんせん',korean:'변천',level:'N1'},{id:5073,kanji:'賢い',hiragana:'かしこい',korean:'똑똑하다',level:'N1'},{id:5074,kanji:'偏る',hiragana:'かたよる',korean:'치우치다, 편향되다',level:'N1'},{id:5075,kanji:'鑑定',hiragana:'かんてい',korean:'감정(판정)',level:'N1'},{id:5076,kanji:'顕著な',hiragana:'けんちょな',korean:'현저한',level:'N1'},{id:5077,kanji:'樹木',hiragana:'じゅもく',korean:'수목(커다란 나무)',level:'N1'},{id:5078,kanji:'人脈',hiragana:'じんみゃく',korean:'인맥',level:'N1'},{id:5079,kanji:'廃れる',hiragana:'すたれる',korean:'쇠퇴하다',level:'N1'},{id:5080,kanji:'相場',hiragana:'そうば',korean:'시세',level:'N1'},
{id:5081,kanji:'多岐',hiragana:'たき',korean:'다기, 다방면',level:'N1'},{id:5082,kanji:'蓄える',hiragana:'たくわえる',korean:'저축하다, 비축하다',level:'N1'},{id:5083,kanji:'陳列',hiragana:'ちんれつ',korean:'진열',level:'N1'},{id:5084,kanji:'華やかな',hiragana:'はなやかな',korean:'화려한',level:'N1'},{id:5085,kanji:'潤す',hiragana:'うるおす',korean:'축축하게 하다, 적시다',level:'N1'},{id:5086,kanji:'傾斜',hiragana:'けいしゃ',korean:'경사, 기울기',level:'N1'},{id:5087,kanji:'殺菌',hiragana:'さっきん',korean:'살균',level:'N1'},{id:5088,kanji:'託す',hiragana:'たくす',korean:'맡기다, 부탁하다',level:'N1'},{id:5089,kanji:'暴露',hiragana:'ばくろ',korean:'폭로',level:'N1'},{id:5090,kanji:'阻む',hiragana:'そばむ',korean:'저지하다, 가로막다',level:'N1'},
{id:5091,kanji:'開拓',hiragana:'かいたく',korean:'개척',level:'N1'},{id:5092,kanji:'復興',hiragana:'ふっこう',korean:'부흥',level:'N1'},{id:5093,kanji:'怠る',hiragana:'おこたる',korean:'소홀히 하다',level:'N1'},{id:5094,kanji:'了承',hiragana:'りょうしょう',korean:'승낙, 양해',level:'N1'},{id:5095,kanji:'巡り',hiragana:'めぐり',korean:'순회',level:'N1'},{id:5096,kanji:'指図',hiragana:'さしず',korean:'지시',level:'N1'},{id:5097,kanji:'回顧',hiragana:'かいこ',korean:'회고',level:'N1'},{id:5098,kanji:'偽り',hiragana:'いつわり',korean:'거짓, 허구',level:'N1'},{id:5099,kanji:'嫌悪感',hiragana:'けんおかん',korean:'혐오감',level:'N1'},{id:5100,kanji:'自粛',hiragana:'じしゅく',korean:'자숙',level:'N1'},
{id:5101,kanji:'戒める',hiragana:'いましめる',korean:'훈계하다, 금지하다',level:'N1'},{id:5102,kanji:'丘陵',hiragana:'きゅうりょう',korean:'구릉',level:'N1'},{id:5103,kanji:'豪快に',hiragana:'ごうかいに',korean:'호쾌하게',level:'N1'},{id:5104,kanji:'忍耐',hiragana:'にんたい',korean:'인내',level:'N1'},{id:5105,kanji:'募る',hiragana:'つのる',korean:'모집하다, (정도가) 심해지다',level:'N1'},{id:5106,kanji:'膨大な',hiragana:'ぼうだいな',korean:'방대한',level:'N1'},{id:5107,kanji:'滞る',hiragana:'とどこおる',korean:'밀리다, 정체되다',level:'N1'},{id:5108,kanji:'驚嘆する',hiragana:'きょうたんする',korean:'경탄하다, 놀라다',level:'N1'},{id:5109,kanji:'猛烈に',hiragana:'もうれつに',korean:'맹렬히',level:'N1'},{id:5110,kanji:'克服する',hiragana:'こくふくする',korean:'극복하다',level:'N1'},
{id:5111,kanji:'崩れる',hiragana:'くずれる',korean:'무너지다, 흐트러지다',level:'N1'},{id:5112,kanji:'繁殖',hiragana:'はんしょく',korean:'번식',level:'N1'},{id:5113,kanji:'履歴',hiragana:'りれき',korean:'이력',level:'N1'},{id:5114,kanji:'映える',hiragana:'はえる',korean:'아름답게 빛나다, 잘 어울리다',level:'N1'},{id:5115,kanji:'披露する',hiragana:'ひろうする',korean:'피로하다, 공개하다',level:'N1'},{id:5116,kanji:'砕ける',hiragana:'くだける',korean:'부서지다',level:'N1'},{id:5117,kanji:'執着する',hiragana:'しゅうちゃくする',korean:'집착하다',level:'N1'},{id:5118,kanji:'債務',hiragana:'さいむ',korean:'채무',level:'N1'},{id:5119,kanji:'貢献する',hiragana:'こうけんする',korean:'공헌하다',level:'N1'},{id:5120,kanji:'潔い',hiragana:'いさぎよい',korean:'(미련 없이) 깨끗하다',level:'N1'},
{id:5121,kanji:'干渉する',hiragana:'かんしょうする',korean:'간섭하다',level:'N1'},{id:5122,kanji:'粘る',hiragana:'ねばる',korean:'끈기 있게 버티다',level:'N1'},{id:5123,kanji:'促す',hiragana:'うながす',korean:'재촉하다, 촉구하다',level:'N1'},{id:5124,kanji:'措置',hiragana:'そち',korean:'조치',level:'N1'},{id:5125,kanji:'振興',hiragana:'しんこう',korean:'진흥',level:'N1'},{id:5126,kanji:'遺憾に',hiragana:'いかんに',korean:'유감스럽게',level:'N1'},{id:5127,kanji:'閉鎖する',hiragana:'へいさする',korean:'폐쇄하다',level:'N1'},{id:5128,kanji:'心遣い',hiragana:'こころづかい',korean:'배려',level:'N1'},{id:5129,kanji:'憤る',hiragana:'いきどおる',korean:'분노하다, 분개하다',level:'N1'},{id:5130,kanji:'治癒する',hiragana:'ちゆする',korean:'치유하다',level:'N1'},
{id:5131,kanji:'錯覚',hiragana:'さっかく',korean:'착각',level:'N1'},{id:5132,kanji:'尊い',hiragana:'とうとい',korean:'소중하다, 존귀하다',level:'N1'},{id:5133,kanji:'枯渇',hiragana:'こかつ',korean:'고갈',level:'N1'},{id:5134,kanji:'慰める',hiragana:'なぐさめる',korean:'위로하다, 달래다',level:'N1'},{id:5135,kanji:'克明に',hiragana:'こくめいに',korean:'극명하게',level:'N1'},{id:5136,kanji:'緊迫する',hiragana:'きんぱくする',korean:'긴박하다',level:'N1'},{id:5137,kanji:'勇敢に',hiragana:'ゆうかんに',korean:'용감하게',level:'N1'},{id:5138,kanji:'忠告',hiragana:'ちゅうこく',korean:'충고',level:'N1'},{id:5139,kanji:'慕う',hiragana:'したう',korean:'그리워하다, 따르다',level:'N1'},{id:5140,kanji:'施錠する',hiragana:'せじょうする',korean:'자물쇠를 채우다, 잠그다',level:'N1'},
{id:5141,kanji:'沈下',hiragana:'ちんか',korean:'침하',level:'N1'},{id:5142,kanji:'阻む',hiragana:'はばむ',korean:'저지하다, 막다',level:'N1'},{id:5143,kanji:'監督',hiragana:'かんとく',korean:'감독',level:'N1'},{id:5144,kanji:'派生',hiragana:'はせい',korean:'파생',level:'N1'},{id:5145,kanji:'透ける',hiragana:'すける',korean:'비쳐보이다',level:'N1'},{id:5146,kanji:'恩恵',hiragana:'おんけい',korean:'은혜',level:'N1'},{id:5147,kanji:'如実に',hiragana:'にょじつに',korean:'여실히',level:'N1'},{id:5148,kanji:'騒然',hiragana:'そうぜん',korean:'떠들썩한 모습',level:'N1'},{id:5149,kanji:'諭す',hiragana:'さとす',korean:'잘 타이르다',level:'N1'},{id:5150,kanji:'秩序',hiragana:'ちつじょ',korean:'질서',level:'N1'},
{id:5151,kanji:'潜伏',hiragana:'せんぷく',korean:'잠복',level:'N1'},{id:5152,kanji:'朗らかな',hiragana:'ほがらかな',korean:'명랑한',level:'N1'},{id:5153,kanji:'軌跡',hiragana:'きせき',korean:'궤적',level:'N1'},{id:5154,kanji:'偏り',hiragana:'かたより',korean:'치우침, 편향',level:'N1'},{id:5155,kanji:'矛盾',hiragana:'むじゅん',korean:'모순',level:'N1'},{id:5156,kanji:'誇張する',hiragana:'こちょうする',korean:'과장하다',level:'N1'},{id:5157,kanji:'賄う',hiragana:'まかなう',korean:'식사를 제공하다, 조달하다',level:'N1'},{id:5158,kanji:'軽率な',hiragana:'けいそつな',korean:'경솔한',level:'N1'},{id:5159,kanji:'腐敗',hiragana:'ふはい',korean:'부패',level:'N1'},{id:5160,kanji:'粗い',hiragana:'あらい',korean:'거칠다',level:'N1'},
{id:5161,kanji:'粘膜',hiragana:'ねんまく',korean:'점막',level:'N1'},{id:5162,kanji:'寿命',hiragana:'じゅみょう',korean:'수명',level:'N1'},{id:5163,kanji:'誓約書',hiragana:'せいやくしょ',korean:'서약서',level:'N1'},{id:5164,kanji:'絶叫',hiragana:'ぜっきょう',korean:'절규',level:'N1'},{id:5165,kanji:'背後',hiragana:'はいご',korean:'배후',level:'N1'},{id:5166,kanji:'抱負',hiragana:'ほうふ',korean:'포부',level:'N1'},{id:5167,kanji:'侮る',hiragana:'あなどる',korean:'무시하다',level:'N1'},{id:5168,kanji:'筋道',hiragana:'すじみち',korean:'조리, 사리',level:'N1'},{id:5169,kanji:'奔放な',hiragana:'ほんぽうな',korean:'분방한',level:'N1'},{id:5170,kanji:'円滑な',hiragana:'えんかつな',korean:'원활한',level:'N1'},
{id:5171,kanji:'及ぼす',hiragana:'およぼす',korean:'(영향을) 미치다, 끼치다',level:'N1'},{id:5172,kanji:'完結',hiragana:'かんけつ',korean:'완결',level:'N1'},{id:5173,kanji:'念願',hiragana:'ねんがん',korean:'염원',level:'N1'},{id:5174,kanji:'背景',hiragana:'はいけい',korean:'배경',level:'N1'},{id:5175,kanji:'フォローする',hiragana:'ふぉろーする',korean:'보조하다, 지원하다',level:'N1'},{id:5176,kanji:'本音',hiragana:'ほんね',korean:'본심, 속내',level:'N1'},{id:5177,kanji:'綿密な',hiragana:'めんみつな',korean:'면밀한',level:'N1'},{id:5178,kanji:'やんわり',hiragana:'やんわり',korean:'부드럽게, 살며시',level:'N1'},{id:5179,kanji:'逸材',hiragana:'いつざい',korean:'일재, 뛰어난 인재',level:'N1'},{id:5180,kanji:'実情',hiragana:'じつじょう',korean:'실정, 실제 사정',level:'N1'},
{id:5181,kanji:'修復',hiragana:'しゅうふく',korean:'수복, 복원',level:'N1'},{id:5182,kanji:'強み',hiragana:'つよみ',korean:'강점',level:'N1'},{id:5183,kanji:'ニュアンス',hiragana:'にゅあんす',korean:'뉘앙스',level:'N1'},{id:5184,kanji:'弾む',hiragana:'はずむ',korean:'튀다, 들뜨다',level:'N1'},{id:5185,kanji:'抜粋',hiragana:'ばっすい',korean:'발췌',level:'N1'},{id:5186,kanji:'不備',hiragana:'ふび',korean:'불비, 미비',level:'N1'},{id:5187,kanji:'平行',hiragana:'へいこう',korean:'평행',level:'N1'},{id:5188,kanji:'無謀な',hiragana:'むぼうな',korean:'무모한',level:'N1'},{id:5189,kanji:'言い張る',hiragana:'いいはる',korean:'우겨대다, 주장하다',level:'N1'},{id:5190,kanji:'大筋',hiragana:'おおすじ',korean:'요점, 대강',level:'N1'},
{id:5191,kanji:'改訂版',hiragana:'かいていばん',korean:'개정판',level:'N1'},{id:5192,kanji:'加工する',hiragana:'かこうする',korean:'가공하다',level:'N1'},{id:5193,kanji:'急遽',hiragana:'きゅうきょ',korean:'급거, 갑작스럽게',level:'N1'},{id:5194,kanji:'究明する',hiragana:'きゅうめいする',korean:'규명하다',level:'N1'},{id:5195,kanji:'寄与',hiragana:'きよ',korean:'기여',level:'N1'},{id:5196,kanji:'妥協',hiragana:'だきょう',korean:'타협',level:'N1'},{id:5197,kanji:'ハードル',hiragana:'はーどる',korean:'허들, 장애물',level:'N1'},{id:5198,kanji:'人出',hiragana:'ひとで',korean:'인파',level:'N1'},{id:5199,kanji:'紛らわしい',hiragana:'まぎらわしい',korean:'혼란스럽다',level:'N1'},{id:5200,kanji:'催す',hiragana:'もよおす',korean:'개최하다',level:'N1'},
{id:5201,kanji:'和らぐ',hiragana:'やわらぐ',korean:'누그러지다',level:'N1'},{id:5202,kanji:'一任',hiragana:'いちにん',korean:'일임(모두 맡김)',level:'N1'},{id:5203,kanji:'腕前',hiragana:'うでまえ',korean:'솜씨, 실력',level:'N1'},{id:5204,kanji:'強硬に',hiragana:'きょうこうに',korean:'강경하게',level:'N1'},{id:5205,kanji:'じめじめする',hiragana:'じめじめする',korean:'축축하다',level:'N1'},{id:5206,kanji:'そわそわ',hiragana:'そわそわ',korean:'안절부절못하는 모습',level:'N1'},{id:5207,kanji:'立て替える',hiragana:'たてかえる',korean:'대신하여 지불하다',level:'N1'},{id:5208,kanji:'ためらう',hiragana:'ためらう',korean:'주저하다, 망설이다',level:'N1'},{id:5209,kanji:'とりわけ',hiragana:'とりわけ',korean:'특히',level:'N1'},{id:5210,kanji:'担う',hiragana:'になう',korean:'짊어지다, 떠맡다',level:'N1'},
{id:5211,kanji:'念頭',hiragana:'ねんとう',korean:'염두',level:'N1'},{id:5212,kanji:'無性に',hiragana:'むしょうに',korean:'몹시, 까닭 없이',level:'N1'},{id:5213,kanji:'異色',hiragana:'いしょく',korean:'이색, 매우 특색 있음',level:'N1'},{id:5214,kanji:'おびただしい',hiragana:'おびただしい',korean:'엄청나다, 수량이 매우 많다',level:'N1'},{id:5215,kanji:'可決',hiragana:'かけつ',korean:'가결',level:'N1'},{id:5216,kanji:'食い止める',hiragana:'くいとめる',korean:'저지하다, 막다',level:'N1'},{id:5217,kanji:'駆使する',hiragana:'くしする',korean:'구사하다',level:'N1'},{id:5218,kanji:'心細い',hiragana:'こころぼそい',korean:'불안하다',level:'N1'},{id:5219,kanji:'支障',hiragana:'ししょう',korean:'지장',level:'N1'},{id:5220,kanji:'絶大な',hiragana:'ぜつだいな',korean:'지대한',level:'N1'},
{id:5221,kanji:'てきぱき',hiragana:'てきぱき',korean:'척척',level:'N1'},{id:5222,kanji:'ノルマ',hiragana:'のるま',korean:'노르마, 업무 할당량',level:'N1'},{id:5223,kanji:'揺らぐ',hiragana:'ゆらぐ',korean:'흔들리다',level:'N1'},{id:5224,kanji:'予断',hiragana:'よだん',korean:'예단',level:'N1'},{id:5225,kanji:'おおらかな',hiragana:'おおらかな',korean:'대범한',level:'N1'},{id:5226,kanji:'該当する',hiragana:'がいとうする',korean:'해당하다',level:'N1'},{id:5227,kanji:'稼働',hiragana:'かどう',korean:'가동',level:'N1'},{id:5228,kanji:'起伏',hiragana:'きふく',korean:'기복',level:'N1'},{id:5229,kanji:'強制',hiragana:'きょうせい',korean:'강제',level:'N1'},{id:5230,kanji:'くよくよ',hiragana:'くよくよ',korean:'끙끙(사소한 일을 걱정하는 모습)',level:'N1'},
{id:5231,kanji:'合意',hiragana:'ごうい',korean:'합의',level:'N1'},{id:5232,kanji:'しいて',hiragana:'しいて',korean:'억지로, 굳이',level:'N1'},{id:5233,kanji:'すさまじい',hiragana:'すさまじい',korean:'대단하다, 무시무시하다',level:'N1'},{id:5234,kanji:'直面する',hiragana:'ちょくめんする',korean:'직면하다',level:'N1'},{id:5235,kanji:'取り戻す',hiragana:'とりもどす',korean:'되찾다, 회복하다',level:'N1'},{id:5236,kanji:'幅広い',hiragana:'はばひろい',korean:'폭넓다',level:'N1'},{id:5237,kanji:'紛れる',hiragana:'まぎれる',korean:'뒤섞이다',level:'N1'},{id:5238,kanji:'愛着',hiragana:'あいちゃく',korean:'애착',level:'N1'},{id:5239,kanji:'一掃',hiragana:'いっそう',korean:'일소(모두 제거함)',level:'N1'},{id:5240,kanji:'基盤',hiragana:'きばん',korean:'기반',level:'N1'},
{id:5241,kanji:'教訓',hiragana:'きょうくん',korean:'교훈',level:'N1'},{id:5242,kanji:'切り出す',hiragana:'きりだす',korean:'말을 꺼내다',level:'N1'},{id:5243,kanji:'染みる',hiragana:'しみる',korean:'스며들다, 배다',level:'N1'},{id:5244,kanji:'すんなり',hiragana:'すんなり',korean:'수월하게, 순조롭게',level:'N1'},{id:5245,kanji:'センス',hiragana:'せんす',korean:'센스',level:'N1'},{id:5246,kanji:'尽くす',hiragana:'つくす',korean:'애쓰다, 있는 힘을 다하다',level:'N1'},{id:5247,kanji:'ノウハウ',hiragana:'のうはう',korean:'노하우',level:'N1'},{id:5248,kanji:'頻繁に',hiragana:'ひんぱんに',korean:'빈번하게',level:'N1'},{id:5249,kanji:'へとへと',hiragana:'へとへと',korean:'기진맥진',level:'N1'},{id:5250,kanji:'流出',hiragana:'りゅうしゅつ',korean:'유출',level:'N1'},
{id:5251,kanji:'一環',hiragana:'いっかん',korean:'일환',level:'N1'},{id:5252,kanji:'コンスタントに',hiragana:'こんすたんとに',korean:'일정하게, 꾸준하게',level:'N1'},{id:5253,kanji:'たたえる',hiragana:'たたえる',korean:'칭찬하다, 찬양하다',level:'N1'},{id:5254,kanji:'念願',hiragana:'ねんがん',korean:'염원',level:'N1'},{id:5255,kanji:'もっぱら',hiragana:'もっぱら',korean:'오로지, 한결같이',level:'N1'},{id:5256,kanji:'よみがえる',hiragana:'よみがえる',korean:'되살아나다, 소생하다',level:'N1'},{id:5257,kanji:'打診',hiragana:'だしん',korean:'타진',level:'N1'},{id:5258,kanji:'経歴',hiragana:'けいれき',korean:'경력',level:'N1'},{id:5259,kanji:'弾く',hiragana:'はじく',korean:'튀기다, 튕겨내다',level:'N1'},{id:5260,kanji:'逸脱',hiragana:'いつだつ',korean:'일탈',level:'N1'},
{id:5261,kanji:'いとも',hiragana:'いとも',korean:'매우, 아주',level:'N1'},{id:5262,kanji:'まちまち',hiragana:'まちまち',korean:'가지각색',level:'N1'},{id:5263,kanji:'在庫',hiragana:'ざいこ',korean:'재고',level:'N1'},{id:5264,kanji:'リスク',hiragana:'りすく',korean:'리스크, 위험',level:'N1'},{id:5265,kanji:'堅実な',hiragana:'けんじつな',korean:'견실한',level:'N1'},{id:5266,kanji:'遮断',hiragana:'しゃだん',korean:'차단',level:'N1'},{id:5267,kanji:'がらりと',hiragana:'がらりと',korean:'싹 (바뀌다)',level:'N1'},{id:5268,kanji:'なだめる',hiragana:'なだめる',korean:'달래다',level:'N1'},{id:5269,kanji:'言及',hiragana:'げんきゅう',korean:'언급',level:'N1'},{id:5270,kanji:'解除',hiragana:'かいじょ',korean:'해제',level:'N1'},
{id:5271,kanji:'レイアウト',hiragana:'れいあうと',korean:'레이아웃',level:'N1'},{id:5272,kanji:'起用',hiragana:'きよう',korean:'기용',level:'N1'},{id:5273,kanji:'駆けつける',hiragana:'かけつける',korean:'달려가다',level:'N1'},{id:5274,kanji:'多角的な',hiragana:'たかくてきな',korean:'다각적인',level:'N1'},{id:5275,kanji:'盛大に',hiragana:'せいだいに',korean:'성대하게',level:'N1'},{id:5276,kanji:'せかせかと',hiragana:'せかせかと',korean:'조급히, 분주히',level:'N1'},{id:5277,kanji:'センサー',hiragana:'せんさー',korean:'센서',level:'N1'},{id:5278,kanji:'壮大な',hiragana:'そうだいな',korean:'장대한',level:'N1'},{id:5279,kanji:'ここちよく',hiragana:'ここちよく',korean:'기분 좋게, 쾌적하게',level:'N1'},{id:5280,kanji:'従事',hiragana:'じゅうじ',korean:'종사하다',level:'N1'},
{id:5281,kanji:'にじむ',hiragana:'にじむ',korean:'번지다, 스며들다',level:'N1'},{id:5282,kanji:'禁物',hiragana:'きんもつ',korean:'금물',level:'N1'},{id:5283,kanji:'ひしひしと',hiragana:'ひしひしと',korean:'절실히, 절절히',level:'N1'},{id:5284,kanji:'表明',hiragana:'ひょうめい',korean:'표명',level:'N1'},{id:5285,kanji:'精力的に',hiragana:'せいりょくてきに',korean:'정력적으로',level:'N1'},{id:5286,kanji:'気がかり',hiragana:'きがかり',korean:'걱정, 불안, 근심',level:'N1'},{id:5287,kanji:'推移',hiragana:'すいい',korean:'추이',level:'N1'},{id:5288,kanji:'危ぶむ',hiragana:'あやぶむ',korean:'불안해하다, 위험하게 생각하다',level:'N1'},{id:5289,kanji:'ずっしりと',hiragana:'ずっしりと',korean:'묵직한 모습',level:'N1'},{id:5290,kanji:'歴然としている',hiragana:'れきぜんとしている',korean:'역력하다, 뚜렷하다',level:'N1'},
{id:5291,kanji:'クレーム',hiragana:'くれーむ',korean:'클레임, 불만',level:'N1'},{id:5292,kanji:'経緯',hiragana:'けいい',korean:'경위',level:'N1'},{id:5293,kanji:'みっちり',hiragana:'みっちり',korean:'착실히, 충분히',level:'N1'},{id:5294,kanji:'撤去',hiragana:'てっきょ',korean:'철거',level:'N1'},{id:5295,kanji:'うずうず',hiragana:'うずうず',korean:'근질근질(좀이 쑤시는 모양)',level:'N1'},{id:5296,kanji:'却下する',hiragana:'きゃっかする',korean:'각하하다',level:'N1'},{id:5297,kanji:'旺盛だ',hiragana:'おうせいだ',korean:'왕성하다',level:'N1'},{id:5298,kanji:'施す',hiragana:'ほどこす',korean:'베풀다, (가공 등을) 하다',level:'N1'},{id:5299,kanji:'余波',hiragana:'よは',korean:'여파',level:'N1'},{id:5300,kanji:'目先',hiragana:'めさき',korean:'눈앞',level:'N1'},
{id:5301,kanji:'ぎくしゃくする',hiragana:'ぎくしゃくする',korean:'원활하지 못하다',level:'N1'},{id:5302,kanji:'存続',hiragana:'そんぞく',korean:'존속',level:'N1'},{id:5303,kanji:'風習',hiragana:'ふうしゅう',korean:'풍습',level:'N1'},{id:5304,kanji:'もどかしい',hiragana:'もどかしい',korean:'답답하다, 안타깝다',level:'N1'},{id:5305,kanji:'熟知',hiragana:'じゅくち',korean:'숙지',level:'N1'},{id:5306,kanji:'拗れる',hiragana:'こじれる',korean:'(일이) 꼬이다',level:'N1'},{id:5307,kanji:'めきめき',hiragana:'めきめき',korean:'두드러지게, 눈에 띄게',level:'N1'},{id:5308,kanji:'軽快な',hiragana:'けいかいな',korean:'경쾌한',level:'N1'},{id:5309,kanji:'サイクル',hiragana:'さいくる',korean:'사이클',level:'N1'},{id:5310,kanji:'仲裁',hiragana:'ちゅうさい',korean:'중재',level:'N1'},
{id:5311,kanji:'しわざ',hiragana:'しわざ',korean:'짓, 소행',level:'N1'},{id:5312,kanji:'発覚',hiragana:'はっかく',korean:'발각',level:'N1'},{id:5313,kanji:'すべすべ',hiragana:'すべすべ',korean:'매끈매끈한 모양',level:'N1'},{id:5314,kanji:'かみ合う',hiragana:'かみあう',korean:'(의견, 생각 등이) 맞다',level:'N1'},{id:5315,kanji:'保護',hiragana:'ほご',korean:'보호',level:'N1'},{id:5316,kanji:'忠実に',hiragana:'ちゅうじつに',korean:'충실히',level:'N1'},{id:5317,kanji:'すくう',hiragana:'すくう',korean:'(액체 등을) 뜨다',level:'N1'},{id:5318,kanji:'食い込む',hiragana:'くいこむ',korean:'파고들다',level:'N1'},{id:5319,kanji:'てっきり',hiragana:'てっきり',korean:'틀림없이 (~인 줄 알다)',level:'N1'},{id:5320,kanji:'自立',hiragana:'じりつ',korean:'자립',level:'N1'},
{id:5321,kanji:'還元',hiragana:'かんげん',korean:'환원',level:'N1'},{id:5322,kanji:'どんより',hiragana:'どんより',korean:'날씨가 잔뜩 흐린 모양',level:'N1'},{id:5323,kanji:'ネック',hiragana:'ねっく',korean:'장애물, 걸림돌',level:'N1'},{id:5324,kanji:'発散',hiragana:'はっさん',korean:'발산',level:'N1'},{id:5325,kanji:'紛らわしい',hiragana:'まぎらわしい',korean:'헷갈리다',level:'N1'},{id:5326,kanji:'行き届く',hiragana:'ゆきとどく',korean:'구석구석 빈틈없이 미치다',level:'N1'},{id:5327,kanji:'快挙',hiragana:'かいきょ',korean:'쾌거',level:'N1'},{id:5328,kanji:'助長',hiragana:'じょちょう',korean:'조장',level:'N1'},{id:5329,kanji:'見返り',hiragana:'みかえり',korean:'보답, 보상',level:'N1'},{id:5330,kanji:'結成',hiragana:'けっせい',korean:'결성',level:'N1'},
{id:5331,kanji:'手配',hiragana:'てはい',korean:'준비, 수배',level:'N1'},{id:5332,kanji:'つくづく',hiragana:'つくづく',korean:'절실히, 뼈저리게',level:'N1'},{id:5333,kanji:'解ほぐれる',hiragana:'ほぐれる',korean:'(매듭, 긴장 등이) 풀리다',level:'N1'},{id:5334,kanji:'根底',hiragana:'こんてい',korean:'근저, 근본',level:'N1'},{id:5335,kanji:'返上',hiragana:'へんじょう',korean:'반납, 반려',level:'N1'},{id:5336,kanji:'取り次ぐ',hiragana:'とりつぐ',korean:'(전화를) 연결하다',level:'N1'},{id:5337,kanji:'交錯する',hiragana:'こうさくする',korean:'뒤섞여 엇갈리다',level:'N1'},{id:5338,kanji:'難航',hiragana:'なんこう',korean:'난항',level:'N1'},{id:5339,kanji:'手足まとい',hiragana:'てあしまとい',korean:'방해, 훼방, 걸림돌',level:'N1'},{id:5340,kanji:'適応',hiragana:'てきおう',korean:'적응',level:'N1'},
{id:5341,kanji:'掲げる',hiragana:'かかげる',korean:'내걸다',level:'N1'},{id:5342,kanji:'踏襲',hiragana:'とうしゅう',korean:'답습',level:'N1'},{id:5343,kanji:'足止め',hiragana:'あしどめ',korean:'발이 묶임',level:'N1'},{id:5344,kanji:'払拭',hiragana:'ふっしょく',korean:'불식',level:'N1'},{id:5345,kanji:'とっさに',hiragana:'とっさに',korean:'순간적으로',level:'N1'},{id:5346,kanji:'いやみ',hiragana:'いやみ',korean:'불쾌한 언행',level:'N1'},{id:5347,kanji:'皮肉',hiragana:'ひにく',korean:'비꼼, 빈정거림',level:'N1'},{id:5348,kanji:'丹念に',hiragana:'たんねんに',korean:'정성껏, 꼼꼼하게',level:'N1'},{id:5349,kanji:'じっくりと',hiragana:'じっくりと',korean:'정성껏, 곰곰이',level:'N1'},{id:5350,kanji:'なじむ',hiragana:'なじむ',korean:'친숙해지다, 정들다',level:'N1'},
{id:5351,kanji:'はかどる',hiragana:'はかどる',korean:'진척되다',level:'N1'},{id:5352,kanji:'張り合う',hiragana:'はりあう',korean:'겨루다, 경쟁하다',level:'N1'},{id:5353,kanji:'まばらだ',hiragana:'まばらだ',korean:'드문드문 있다',level:'N1'},{id:5354,kanji:'見合わせる',hiragana:'みあわせる',korean:'보류하다',level:'N1'},{id:5355,kanji:'ルーズな',hiragana:'るーずな',korean:'느슨한, 단정치 못한',level:'N1'},{id:5356,kanji:'朗報',hiragana:'ろうほう',korean:'낭보, 희소식',level:'N1'},{id:5357,kanji:'わずらわしい',hiragana:'わずらわしい',korean:'성가시다, 번거롭다',level:'N1'},{id:5358,kanji:'あっけない',hiragana:'あっけない',korean:'어이없다',level:'N1'},{id:5359,kanji:'ありきたりの',hiragana:'ありきたりの',korean:'흔한',level:'N1'},{id:5360,kanji:'画期的な',hiragana:'かっきてきな',korean:'획기적인',level:'N1'},
{id:5361,kanji:'コントラスト',hiragana:'こんとらすと',korean:'콘트라스트, 대비',level:'N1'},{id:5362,kanji:'シビアな',hiragana:'しびあな',korean:'엄격한, 어려운',level:'N1'},{id:5363,kanji:'手がかり',hiragana:'てがかり',korean:'단서, 실마리',level:'N1'},{id:5364,kanji:'にわかには',hiragana:'にわかには',korean:'갑자기는, 바로는',level:'N1'},{id:5365,kanji:'もくろむ',hiragana:'もくろむ',korean:'계획하다, 꾀하다',level:'N1'},{id:5366,kanji:'落胆する',hiragana:'らくたんする',korean:'낙담하다',level:'N1'},{id:5367,kanji:'歴然としている',hiragana:'れきぜんとしている',korean:'역연하다, 또렷하다',level:'N1'},{id:5368,kanji:'おっくうだ',hiragana:'おっくうだ',korean:'귀찮다',level:'N1'},{id:5369,kanji:'おのずと',hiragana:'おのずと',korean:'저절로, 자연히',level:'N1'},{id:5370,kanji:'簡素だ',hiragana:'かんそだ',korean:'간소하다',level:'N1'},
{id:5371,kanji:'けなされる',hiragana:'けなされる',korean:'비난을 받다',level:'N1'},{id:5372,kanji:'しきりに',hiragana:'しきりに',korean:'자꾸, 연달아',level:'N1'},{id:5373,kanji:'触発される',hiragana:'しょくはつされる',korean:'촉발되다',level:'N1'},{id:5374,kanji:'すがすがしい',hiragana:'すがすがしい',korean:'상쾌하다, 시원하다',level:'N1'},{id:5375,kanji:'スケール',hiragana:'すけーる',korean:'스케일, 규모',level:'N1'},{id:5376,kanji:'先方',hiragana:'せんぽう',korean:'상대',level:'N1'},{id:5377,kanji:'断念する',hiragana:'だんねんする',korean:'단념하다',level:'N1'},{id:5378,kanji:'当面',hiragana:'とうめん',korean:'당면, 당분간',level:'N1'},{id:5379,kanji:'密かに',hiragana:'ひそかに',korean:'은밀하게',level:'N1'},{id:5380,kanji:'あらかじめ',hiragana:'あらかじめ',korean:'미리',level:'N1'},
{id:5381,kanji:'裏づけ',hiragana:'うらづけ',korean:'뒷받침, 증거',level:'N1'},{id:5382,kanji:'おおむね',hiragana:'おおむね',korean:'대체로, 대강',level:'N1'},{id:5383,kanji:'仰天する',hiragana:'ぎょうてんする',korean:'경악하다, 몹시 놀라다',level:'N1'},{id:5384,kanji:'ことごとく',hiragana:'ことごとく',korean:'전부',level:'N1'},{id:5385,kanji:'雑踏',hiragana:'ざっとう',korean:'혼잡',level:'N1'},{id:5386,kanji:'従来の',hiragana:'じゅうらいの',korean:'종래의',level:'N1'},{id:5387,kanji:'すべ',hiragana:'すべ',korean:'방법',level:'N1'},{id:5388,kanji:'せかす',hiragana:'せかす',korean:'재촉하다',level:'N1'},{id:5389,kanji:'バックアップ',hiragana:'ばっくあっぷ',korean:'백업, 지원',level:'N1'},{id:5390,kanji:'抜群だ',hiragana:'ばつぐんだ',korean:'발군이다, 뛰어나다',level:'N1'},
{id:5391,kanji:'メカニズム',hiragana:'めかにずむ',korean:'메커니즘, 구조',level:'N1'},{id:5392,kanji:'案の定',hiragana:'あんのじょう',korean:'역시, 예상대로',level:'N1'},{id:5393,kanji:'いたって',hiragana:'いたって',korean:'지극히',level:'N1'},{id:5394,kanji:'打ち込む',hiragana:'うちこむ',korean:'몰입하다, 몰두하다',level:'N1'},{id:5395,kanji:'お手上げだ',hiragana:'おてあげだ',korean:'두 손 들었다, 속수무책이다',level:'N1'},{id:5396,kanji:'回想する',hiragana:'かいそうする',korean:'회상하다',level:'N1'},{id:5397,kanji:'格段に',hiragana:'かくだんに',korean:'현격하게',level:'N1'},{id:5398,kanji:'気掛かり',hiragana:'きがかり',korean:'걱정, 근심',level:'N1'},{id:5399,kanji:'ストレートに',hiragana:'すとれーとに',korean:'직설적으로',level:'N1'},{id:5400,kanji:'手分けする',hiragana:'てわけする',korean:'분담하다',level:'N1'},
{id:5401,kanji:'不用意な',hiragana:'ふよういな',korean:'부주의한',level:'N1'},{id:5402,kanji:'無償',hiragana:'むしょう',korean:'무상',level:'N1'},{id:5403,kanji:'厄介な',hiragana:'やっかいな',korean:'귀찮은',level:'N1'},{id:5404,kanji:'ありふれる',hiragana:'ありふれる',korean:'흔하다',level:'N1'},{id:5405,kanji:'糸口',hiragana:'いとぐち',korean:'실마리',level:'N1'},{id:5406,kanji:'うろたえる',hiragana:'うろたえる',korean:'허둥거리다, 당황하다',level:'N1'},{id:5407,kanji:'互角だ',hiragana:'ごかくだ',korean:'호각이다, 백중세다',level:'N1'},{id:5408,kanji:'誇張',hiragana:'こちょう',korean:'과장',level:'N1'},{id:5409,kanji:'錯覚する',hiragana:'さっかくする',korean:'착각하다',level:'N1'},{id:5410,kanji:'殺到する',hiragana:'さっとうする',korean:'쇄도하다',level:'N1'},
{id:5411,kanji:'仕上がる',hiragana:'しあがる',korean:'마무리되다, 완성되다',level:'N1'},{id:5412,kanji:'助言',hiragana:'じょげん',korean:'조언',level:'N1'},{id:5413,kanji:'不意に',hiragana:'ふいに',korean:'갑자기',level:'N1'},{id:5414,kanji:'弁解する',hiragana:'べんかいする',korean:'변명하다',level:'N1'},{id:5415,kanji:'安堵する',hiragana:'あんどする',korean:'안도하다',level:'N1'},{id:5416,kanji:'意気込み',hiragana:'いきごみ',korean:'열의, 패기',level:'N1'},{id:5417,kanji:'意欲',hiragana:'いよく',korean:'의욕',level:'N1'},{id:5418,kanji:'おびえる',hiragana:'おびえる',korean:'겁을 내다',level:'N1'},{id:5419,kanji:'かねがね',hiragana:'かねがね',korean:'전부터',level:'N1'},{id:5420,kanji:'かろうじて',hiragana:'かろうじて',korean:'겨우, 간신히',level:'N1'},
{id:5421,kanji:'故意に',hiragana:'こいに',korean:'고의로',level:'N1'},{id:5422,kanji:'ささいな',hiragana:'ささいな',korean:'사소한',level:'N1'},{id:5423,kanji:'自尊心',hiragana:'じそんしん',korean:'자존심',level:'N1'},{id:5424,kanji:'戸惑う',hiragana:'とまどう',korean:'어리둥절해하다, 당황하다',level:'N1'},{id:5425,kanji:'端的に',hiragana:'たんてきに',korean:'단적으로',level:'N1'},{id:5426,kanji:'わずらわしい',hiragana:'わずらわしい',korean:'번거로운',level:'N1'},{id:5427,kanji:'詫びる',hiragana:'わびる',korean:'사과하다',level:'N1'},{id:5428,kanji:'うすうす',hiragana:'うすうす',korean:'희미하게, 어렴풋이',level:'N1'},{id:5429,kanji:'照会する',hiragana:'しょうかいする',korean:'조회하다',level:'N1'},{id:5430,kanji:'難点',hiragana:'なんてん',korean:'난점',level:'N1'},
{id:5431,kanji:'入念に',hiragana:'にゅうねんに',korean:'꼼꼼하게, 정성들여',level:'N1'},{id:5432,kanji:'粘り強く',hiragana:'ねばりづよく',korean:'끈기 있게',level:'N1'},{id:5433,kanji:'むっとする',hiragana:'むっとする',korean:'부루퉁해지다',level:'N1'},{id:5434,kanji:'抱負',hiragana:'ほうふ',korean:'포부',level:'N1'},{id:5435,kanji:'決意',hiragana:'けつい',korean:'결의',level:'N1'},{id:5436,kanji:'ゆとり',hiragana:'ゆとり',korean:'여유',level:'N1'},{id:5437,kanji:'若干',hiragana:'じゃっかん',korean:'약간',level:'N1'},{id:5438,kanji:'撤回する',hiragana:'てっかいする',korean:'철회하다',level:'N1'},{id:5439,kanji:'張り合う',hiragana:'はりあう',korean:'경쟁하다',level:'N1'},{id:5440,kanji:'かたくなな',hiragana:'かたくなな',korean:'완고함, 고집스러움',level:'N1'},
{id:5441,kanji:'すみやかに',hiragana:'すみやかに',korean:'신속히',level:'N1'},{id:5442,kanji:'漠然としている',hiragana:'ばくぜんとしている',korean:'막연하다',level:'N1'},{id:5443,kanji:'妨害する',hiragana:'ぼうがいする',korean:'방해하다',level:'N1'},{id:5444,kanji:'エレガントな',hiragana:'えれがんとな',korean:'우아한, 고상한',level:'N1'},{id:5445,kanji:'つかの間の',hiragana:'つかのまの',korean:'짧은, 잠깐 동안의',level:'N1'},{id:5446,kanji:'しくじる',hiragana:'しくじる',korean:'실수하다, 실패하다',level:'N1'},{id:5447,kanji:'めいめいに',hiragana:'めいめいに',korean:'각각에게, 각자에게',level:'N1'},{id:5448,kanji:'克明に',hiragana:'こくめいに',korean:'극명하게, 정확하고 자세하게',level:'N1'},{id:5449,kanji:'手立て',hiragana:'てだて',korean:'방법, 수단',level:'N1'},{id:5450,kanji:'ありありと',hiragana:'ありありと',korean:'똑똑히, 뚜렷이',level:'N1'},
{id:5451,kanji:'返事をしぶる',hiragana:'へんじをしぶる',korean:'대답하기를 꺼리다, 주저하다',level:'N1'},{id:5452,kanji:'コンパクトな',hiragana:'こんぱくとな',korean:'콤팩트한, 소형인',level:'N1'},{id:5453,kanji:'極力',hiragana:'きょくりょく',korean:'될 수 있는 한, 힘껏',level:'N1'},{id:5454,kanji:'つぶやく',hiragana:'つぶやく',korean:'중얼거리다',level:'N1'},{id:5455,kanji:'不審な',hiragana:'ふしんな',korean:'수상한, 의심스러운',level:'N1'},{id:5456,kanji:'ばてる',hiragana:'ばてる',korean:'지치다, 녹초가 되다',level:'N1'},{id:5457,kanji:'まっとうする',hiragana:'まっとうする',korean:'다하다, 완수하다',level:'N1'},{id:5458,kanji:'異例の',hiragana:'いれいの',korean:'이례인',level:'N1'},{id:5459,kanji:'ルーズな',hiragana:'るーずな',korean:'루즈한, 칠칠맞은',level:'N1'},{id:5460,kanji:'つぶさに',hiragana:'つぶさに',korean:'자세하게, 빠짐없이',level:'N1'},
{id:5461,kanji:'脈絡',hiragana:'みゃくらく',korean:'맥락, 연관',level:'N1'},{id:5462,kanji:'吟味',hiragana:'ぎんみ',korean:'음미, 자세히 조사함',level:'N1'},{id:5463,kanji:'エキスパート',hiragana:'えきすぱーと',korean:'전문가',level:'N1'},{id:5464,kanji:'凝視する',hiragana:'ぎょうしする',korean:'응시하다',level:'N1'},{id:5465,kanji:'架空',hiragana:'かくう',korean:'가공',level:'N1'},{id:5466,kanji:'寡黙な',hiragana:'かもくな',korean:'과묵한',level:'N1'},{id:5467,kanji:'紛糾する',hiragana:'ふんきゅうする',korean:'분규하다',level:'N1'},{id:5468,kanji:'ずれ込む',hiragana:'ずれこむ',korean:'늦춰지다, 미루어지다',level:'N1'},{id:5469,kanji:'ろくに',hiragana:'ろくに',korean:'제대로, 변변히',level:'N1'},{id:5470,kanji:'寄与',hiragana:'きよ',korean:'기여',level:'N1'},
{id:5471,kanji:'絶賛する',hiragana:'ぜっさんする',korean:'절찬하다, 극구 칭찬하다',level:'N1'},{id:5472,kanji:'くつろぐ',hiragana:'くつろぐ',korean:'느긋이 편하게 쉬다',level:'N1'},{id:5473,kanji:'うやむやに',hiragana:'うやむやに',korean:'흐지부지하게, 애매하게',level:'N1'},{id:5474,kanji:'出馬する',hiragana:'しゅつばする',korean:'출마하다',level:'N1'},{id:5475,kanji:'お手上げだ',hiragana:'おてあげだ',korean:'어쩔 도리가 없다',level:'N1'},{id:5476,kanji:'触発される',hiragana:'しょくはつされる',korean:'촉발되다',level:'N1'},{id:5477,kanji:'閉口する',hiragana:'へいこうする',korean:'난처하다, 기막히다',level:'N1'},{id:5478,kanji:'気ままな',hiragana:'きままな',korean:'제 마음대로인',level:'N1'},{id:5479,kanji:'若干',hiragana:'じゃっかん',korean:'약간',level:'N1'},{id:5480,kanji:'手分け',hiragana:'てわけ',korean:'분담, 나눔',level:'N1'},
{id:5481,kanji:'てきぱきと',hiragana:'てきぱきと',korean:'척척',level:'N1'},{id:5482,kanji:'調達する',hiragana:'ちょうたつする',korean:'조달하다',level:'N1'},{id:5483,kanji:'温和な',hiragana:'おんわな',korean:'온화한',level:'N1'},{id:5484,kanji:'拮抗する',hiragana:'きっこうする',korean:'팽팽하다',level:'N1'},{id:5485,kanji:'風当たり',hiragana:'かぜあたり',korean:'비난',level:'N1'},{id:5486,kanji:'あどけない',hiragana:'あどけない',korean:'천진난만하다',level:'N1'},{id:5487,kanji:'懸念する',hiragana:'けねんする',korean:'걱정하다, 우려하다',level:'N1'},{id:5488,kanji:'やつれる',hiragana:'やつれる',korean:'여위다, 수척해지다',level:'N1'},{id:5489,kanji:'奮闘する',hiragana:'ふんとうする',korean:'분투하다',level:'N1'},{id:5490,kanji:'不慮の',hiragana:'ふりょの',korean:'뜻밖의, 예상 밖의',level:'N1'},
{id:5491,kanji:'根こそぎ',hiragana:'ねこそぎ',korean:'전부, 모조리',level:'N1'},{id:5492,kanji:'没頭する',hiragana:'ぼっとうする',korean:'몰두하다',level:'N1'},{id:5493,kanji:'尺度',hiragana:'しゃくど',korean:'척도, 기준',level:'N1'},{id:5494,kanji:'わずらわしい',hiragana:'わずらわしい',korean:'귀찮다, 성가시다',level:'N1'},{id:5495,kanji:'肝心な',hiragana:'かんじんな',korean:'가장 중요한',level:'N1'},{id:5496,kanji:'はかどる',hiragana:'はかどる',korean:'일이 잘 되고 있다',level:'N1'},{id:5497,kanji:'辛抱する',hiragana:'しんぼうする',korean:'참다, 견디다',level:'N1'},{id:5498,kanji:'しきたり',hiragana:'しきたり',korean:'관습, 관례',level:'N1'},{id:5499,kanji:'工面する',hiragana:'くめんする',korean:'(돈을) 마련하다',level:'N1'},{id:5500,kanji:'間柄',hiragana:'あいだがら',korean:'사이, 관계',level:'N1'},




];

// ════════════════════════════════════════════════
//  상태 초기화
// ════════════════════════════════════════════════
let records       = lsLoad(LS.RECORDS, {});
let examHistory   = lsLoad(LS.HISTORY, []);
let recentIds     = lsLoad(LS.RECENT_IDS, []);
let selectedLevel = lsLoad(LS.LEVEL, 'N5');

examHistory = examHistory.map(h => ({ ...h, date: new Date(h.date) }));

const customWords = lsLoad(LS.CUSTOM_WORDS, []);
const deletedIds  = lsLoad(LS.DELETED_IDS, []);

let words = [
    ...DEFAULT_WORDS.filter(w => !deletedIds.includes(w.id)),
    ...customWords,
];

let nextId = words.length > 0 ? Math.max(...words.map(w => w.id)) + 1 : 9000;

const RECENT_WINDOW = 40;
const PAGE_SIZE     = 30;

let activeTab         = 'tabHome';
let manageFilterLevel = 'ALL';
let sortMode          = 'none';
let pendingLevel      = null;
let examWords         = [];
let currentIndex      = 0;
let examResults       = [];

let filteredCache = [];
let loadedCount   = 0;
let isLoading     = false;
let listObserver  = null;

// ════════════════════════════════════════════════
//  저장 함수
// ════════════════════════════════════════════════
function saveRecords()       { lsSave(LS.RECORDS,      records);                        }
function saveHistory()       { lsSave(LS.HISTORY,      examHistory);                   }
function saveRecentIds()     { lsSave(LS.RECENT_IDS,   recentIds);                     }
function saveLevel()         { lsSave(LS.LEVEL,        selectedLevel);                 }
function saveCustomWords()   { lsSave(LS.CUSTOM_WORDS, words.filter(w => w.id >= 9000)); }
function saveDeletedIds(ids) { lsSave(LS.DELETED_IDS,  ids);                           }

// ════════════════════════════════════════════════
//  가중치 알고리즘
// ════════════════════════════════════════════════
function calcWeight(word) {
    const rec = records[word.id];
    let w;

    if (!rec || rec.total === 0) {
        w = 10;
    } else {
        const r = rec.correct / rec.total;
        if      (r === 0) w = 12;
        else if (r < 0.4) w = 10;
        else if (r < 0.6) w = 6;
        else if (r < 0.8) w = 3;
        else              w = 1;
    }

    const idx = recentIds.indexOf(word.id);
    if (idx !== -1) w *= Math.max(0.05, 1 - (recentIds.length - idx) / RECENT_WINDOW);

    return Math.max(w, 0.05);
}

function weightedSample(pool, n) {
    const sel = [];
    const rem = [...pool];

    for (let i = 0; i < n && rem.length > 0; i++) {
        const ws  = rem.map(w => calcWeight(w));
        const tot = ws.reduce((a, b) => a + b, 0);
        let rand  = Math.random() * tot;
        let idx   = 0;

        for (let j = 0; j < ws.length; j++) {
            rand -= ws[j];
            if (rand <= 0) { idx = j; break; }
        }

        sel.push(rem[idx]);
        rem.splice(idx, 1);
    }

    return sel;
}

// ════════════════════════════════════════════════
//  탭 전환
// ════════════════════════════════════════════════
function isExamInProgress() {
    return document.getElementById('examActive').style.display !== 'none';
}

function switchTab(tabId) {
    TTS.stop();

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navMap = { tabHome: 'nav-home', tabExam: 'nav-exam', tabList: 'nav-list', tabRecord: 'nav-record' };
    if (navMap[tabId]) document.getElementById(navMap[tabId]).classList.add('active');

    activeTab = tabId;

    document.getElementById('levelPill').classList.toggle('hidden', tabId !== 'tabExam');
    document.getElementById('addFab').classList.toggle('visible', tabId === 'tabList');

    if (tabId === 'tabList')   setTimeout(() => initListM(), 50);
    if (tabId === 'tabRecord') renderRecordM();
    if (tabId === 'tabHome')   { updateHomeSummary(); renderRecentM(); }

    document.getElementById('content').scrollTo(0, 0);
}

// ════════════════════════════════════════════════
//  레벨 선택
// ════════════════════════════════════════════════
function selectLevel(lv) {
    selectedLevel = lv;

    document.querySelectorAll('#levelGrid .level-btn-m').forEach(b =>
        b.classList.toggle('active', b.textContent === lv)
    );
    document.querySelectorAll('#examLevelGrid .exam-level-btn').forEach(b =>
        b.classList.toggle('active', b.textContent === lv)
    );

    document.getElementById('levelPill').textContent = lv + ' ▾';

    ['N5', 'N4', 'N3', 'N2', 'N1'].forEach(l => {
        const el = document.getElementById('lopt-' + l);
        if (el) el.classList.toggle('selected', l === lv);
    });

    saveLevel();
}

function selectLevelExam(lv) { selectLevel(lv); }
function applyInitialLevel() { selectLevel(selectedLevel); }

function openLevelSheet() {
    document.getElementById('levelSheetOverlay').classList.add('open');
}

function closeLevelSheet(e) {
    if (e.target === document.getElementById('levelSheetOverlay')) {
        document.getElementById('levelSheetOverlay').classList.remove('open');
    }
}

function requestLevelChange(lv) {
    document.getElementById('levelSheetOverlay').classList.remove('open');
    if (lv === selectedLevel) return;

    if (isExamInProgress()) {
        pendingLevel = lv;
        document.getElementById('confirmOverlay').classList.add('open');
    } else {
        selectLevel(lv);
    }
}

function confirmLevelChange() {
    document.getElementById('confirmOverlay').classList.remove('open');
    if (pendingLevel) {
        TTS.stop();
        selectLevel(pendingLevel);
        pendingLevel = null;
        document.getElementById('examActive').style.display = 'none';
        document.getElementById('examResult').style.display = 'none';
        document.getElementById('examReady').style.display  = 'block';
    }
}

function cancelLevelChange() {
    pendingLevel = null;
    document.getElementById('confirmOverlay').classList.remove('open');
}

// ════════════════════════════════════════════════
//  홈 통계
// ════════════════════════════════════════════════
function updateHomeSummary() {
    const t = examHistory.length;
    document.getElementById('sumTotal').textContent = t + '회';

    if (t > 0) {
        const tc = examHistory.reduce((s, h) => s + h.correct, 0);
        const tq = examHistory.reduce((s, h) => s + h.total, 0);
        document.getElementById('sumAvg').textContent  = Math.round(tc / tq * 100) + '%';
        document.getElementById('sumBest').textContent = Math.max(...examHistory.map(h => h.pct)) + '%';
    } else {
        document.getElementById('sumAvg').textContent  = '—';
        document.getElementById('sumBest').textContent = '—';
    }

    const el = document.getElementById('statCards');

    if (t === 0) {
        el.innerHTML = `
            <div class="no-data-card">
                <div class="no-data-card-label">📊 학습 현황</div>
                <div class="no-data-card-desc">아직 시험 기록이 없습니다.<br>지금 바로 시작해보세요! 💪</div>
            </div>`;
        return;
    }

    const tc   = examHistory.reduce((s, h) => s + h.correct, 0);
    const tq   = examHistory.reduce((s, h) => s + h.total, 0);
    const avg  = Math.round(tc / tq * 100);
    const best = Math.max(...examHistory.map(h => h.pct));

    el.innerHTML = `
        <div class="stat-cards">
            <div class="stat-card">
                <div class="stat-card-label">🎯 전체 정답률</div>
                <div class="stat-card-value green">${avg}<small style="font-size:.5em;font-weight:600;">%</small></div>
                <div class="stat-card-sub">${tc}/${tq} 정답</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-label">✏️ 선택 레벨</div>
                <div class="stat-card-value blue" style="font-size:1.2em;">${selectedLevel}</div>
            </div>
        </div>`;
}

function renderRecentM() {
    const el = document.getElementById('recentList');

    if (!examHistory.length) {
        el.innerHTML = '<div class="recent-empty">아직 기록이 없어요 📝<br>첫 시험을 시작해보세요!</div>';
        return;
    }

    el.innerHTML = '';
    examHistory.slice(0, 3).forEach((h, i) => {
        const div     = document.createElement('div');
        div.className = 'recent-item';
        div.onclick   = () => { switchTab('tabRecord'); setTimeout(() => openDetailM(i), 100); };
        div.innerHTML = `
            <div class="recent-item-left">
                <div class="recent-item-date">🕐 ${formatDateM(h.date)}</div>
                <div class="recent-item-info">
                    <span class="recent-level-tag">${h.level}</span>
                    <span class="recent-item-title">${h.total}문제</span>
                </div>
            </div>
            <span class="score-badge-sm ${getScoreClass(h.pct)}">${h.pct}%</span>
            <span class="recent-arrow">›</span>`;
        el.appendChild(div);
    });
}

// ════════════════════════════════════════════════
//  시험
// ════════════════════════════════════════════════
function startExam() {
    const pool = words.filter(w => w.level === selectedLevel);
    if (!pool.length) { alert('단어가 없습니다.'); return; }

    examWords    = weightedSample(pool, Math.min(20, pool.length));
    currentIndex = 0;
    examResults  = [];

    switchTab('tabExam');
    document.getElementById('examReady').style.display  = 'none';
    document.getElementById('examActive').style.display = 'block';
    document.getElementById('examResult').style.display = 'none';
    renderExamM();
}

function renderExamM() {
    TTS.stop();
    document.getElementById('wordCard').classList.remove('tts-playing');

    const w = examWords[currentIndex];
    document.getElementById('wJp').textContent   = w.kanji;
    document.getElementById('wHira').textContent = w.hiragana;
    document.getElementById('wKr').textContent   = w.korean;
    document.getElementById('wKr').classList.remove('visible');
    document.getElementById('showBtn').style.display = 'block';
    document.getElementById('ansRow').classList.remove('visible');

    const pct = currentIndex / examWords.length * 100;
    document.getElementById('progBar').style.width  = pct + '%';
    document.getElementById('progText').textContent = (currentIndex + 1) + ' / ' + examWords.length;

    setTimeout(() => ttsSpeak(), 300);
}

function showMeaning() {
    document.getElementById('wKr').classList.add('visible');
    document.getElementById('showBtn').style.display = 'none';
    document.getElementById('ansRow').classList.add('visible');
}

function answer(correct) {
    TTS.stop();

    const w = examWords[currentIndex];
    examResults.push({ word: w, correct });

    if (!records[w.id]) records[w.id] = { correct: 0, total: 0 };
    records[w.id].total++;
    if (correct) records[w.id].correct++;
    saveRecords();

    recentIds = recentIds.filter(id => id !== w.id);
    recentIds.push(w.id);
    if (recentIds.length > RECENT_WINDOW) recentIds.shift();
    saveRecentIds();

    currentIndex++;
    if (currentIndex >= examWords.length) showResultM();
    else renderExamM();
}

function showResultM() {
    TTS.stop();

    const cc  = examResults.filter(r => r.correct).length;
    const tot = examResults.length;
    const pct = Math.round(cc / tot * 100);

    const newRecord = {
        id      : Date.now(),
        date    : new Date(),
        level   : selectedLevel,
        correct : cc,
        total   : tot,
        pct,
        results : examResults.map(r => ({
            word   : { kanji: r.word.kanji, hiragana: r.word.hiragana, korean: r.word.korean },
            correct: r.correct,
        })),
    };
    examHistory.unshift(newRecord);
    saveHistory();

    document.getElementById('examActive').style.display = 'none';
    document.getElementById('examResult').style.display = 'block';
    document.getElementById('resultScore').textContent  = `${cc} / ${tot}  (${pct}%)`;

    const tbody = document.getElementById('resultBody');
    tbody.innerHTML = '';
    examResults.forEach((r, i) => {
        const tr      = document.createElement('tr');
        tr.innerHTML  = `
            <td>${i + 1}</td>
            <td>${r.word.kanji}</td>
            <td>${r.word.hiragana}</td>
            <td>${r.word.korean}</td>
            <td class="${r.correct ? 'r-ok' : 'r-ng'}">${r.correct ? '⭕' : '❌'}</td>`;
        tbody.appendChild(tr);
    });

    showToast(`시험 완료! ${pct}% 🎉`);
}

function backToHome() {
    TTS.stop();
    document.getElementById('examActive').style.display = 'none';
    document.getElementById('examResult').style.display = 'none';
    document.getElementById('examReady').style.display  = 'block';
    switchTab('tabHome');
}

// ════════════════════════════════════════════════
//  단어 목록
// ════════════════════════════════════════════════
function buildFilteredM() {
    const s = (document.getElementById('searchM').value || '').trim().toLowerCase();
    let arr = (manageFilterLevel === 'ALL')
        ? words.slice()
        : words.filter(w => w.level === manageFilterLevel);

    if (s) {
        arr = arr.filter(w =>
            w.kanji.includes(s) || w.hiragana.includes(s) || w.korean.includes(s)
        );
    }

    if (sortMode !== 'none') {
        arr.sort((a, b) => {
            const ra = getRateV(a.id);
            const rb = getRateV(b.id);
            if (ra === -1 && rb === -1) return 0;
            if (ra === -1) return 1;
            if (rb === -1) return -1;
            return sortMode === 'asc' ? ra - rb : rb - ra;
        });
    }

    return arr;
}

function getRateV(id) {
    const r = records[id];
    return (!r || r.total === 0) ? -1 : r.correct / r.total;
}

function getRateTagM(id) {
    const r = records[id];
    if (!r || r.total === 0) return `<span class="rate-tag rate-none">미응시</span>`;
    const pct = Math.round(r.correct / r.total * 100);
    const cls = pct < 40 ? 'rate-low' : pct < 70 ? 'rate-mid' : 'rate-high';
    return `<span class="rate-tag ${cls}">${pct}%</span>`;
}

function updateWordCountBar() {
    const total = filteredCache.length;
    document.getElementById('wordCountBadge').textContent = total.toLocaleString() + '개';

    const sub = document.getElementById('wordCountSub');
    if (manageFilterLevel === 'ALL') {
        sub.textContent = ['N5', 'N4', 'N3', 'N2', 'N1']
            .map(lv => `${lv}: ${filteredCache.filter(w => w.level === lv).length}`)
            .join(' · ');
    } else {
        sub.textContent = manageFilterLevel + ' 레벨';
    }
}

function createWordRowM(w, displayIndex) {
    const div     = document.createElement('div');
    div.className = 'word-row-m';
    div.innerHTML = `
        <span class="word-idx">${displayIndex}</span>
        <div class="word-row-main">
            <div class="word-row-top">
                <span class="word-lv-tag">${w.level}</span>
                <span class="word-kanji-m">${w.kanji}</span>
                <span class="word-hira-m">${w.hiragana}</span>
            </div>
            <div class="word-mean-m">${w.korean}</div>
        </div>
        <div>${getRateTagM(w.id)}</div>
        <button class="tts-btn" onclick="ttsSpeakWord('${w.kanji.replace(/'/g, "\\'")}', this)" title="발음 듣기">🔊</button>
        <button class="del-btn-m" onclick="deleteWordM(${w.id})">삭제</button>`;
    return div;
}

function appendListPage() {
    if (isLoading) return;
    const slice = filteredCache.slice(loadedCount, loadedCount + PAGE_SIZE);
    if (!slice.length) return;

    isLoading = true;
    const wrap   = document.getElementById('wordListM');
    const loader = document.createElement('div');
    loader.id         = 'mLoader';
    loader.style.cssText = 'text-align:center;padding:12px;color:var(--pink-light);font-size:0.8em;';
    loader.textContent   = '⏳ 불러오는 중...';
    wrap.appendChild(loader);

    setTimeout(() => {
        document.getElementById('mLoader')?.remove();
        slice.forEach((w, i) => wrap.appendChild(createWordRowM(w, loadedCount + i + 1)));
        loadedCount += slice.length;
        updateListStatus();
        isLoading = false;
    }, 80);
}

function updateListStatus() {
    const el = document.getElementById('listStatus');
    const t  = filteredCache.length;
    if (!t) { el.textContent = ''; return; }
    el.textContent = loadedCount >= t
        ? `전체 ${t.toLocaleString()}개 표시 완료 ✓`
        : `${loadedCount.toLocaleString()} / ${t.toLocaleString()}개 — 스크롤하면 더 보기`;
}

function setupListObserver() {
    if (listObserver) { listObserver.disconnect(); listObserver = null; }
    const sentinel = document.getElementById('listSentinel');
    listObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !isLoading && loadedCount < filteredCache.length) {
            appendListPage();
        }
    }, { root: document.getElementById('content'), threshold: 0.1 });
    listObserver.observe(sentinel);
}

function initListM() {
    TTS.stop();
    if (listObserver) { listObserver.disconnect(); listObserver = null; }

    filteredCache = buildFilteredM();
    loadedCount   = 0;
    isLoading     = false;

    const wrap = document.getElementById('wordListM');
    wrap.innerHTML = '';
    updateWordCountBar();

    if (!filteredCache.length) {
        wrap.innerHTML = '<div style="text-align:center;color:var(--gray);padding:30px;font-size:0.84em;">단어가 없습니다.</div>';
        document.getElementById('listStatus').textContent          = '';
        document.getElementById('wordCountBadge').textContent = '0개';
        document.getElementById('wordCountSub').textContent   = '';
        return;
    }

    filteredCache.slice(0, PAGE_SIZE).forEach((w, i) => wrap.appendChild(createWordRowM(w, i + 1)));
    loadedCount = Math.min(PAGE_SIZE, filteredCache.length);
    updateListStatus();
    requestAnimationFrame(() => setupListObserver());
}

function onSearchM() { initListM(); }

function toggleSortM() {
    sortMode = (sortMode === 'asc') ? 'desc' : 'asc';
    const btn   = document.getElementById('sortM');
    const arrow = document.getElementById('sortArrowM');
    btn.classList.remove('asc', 'desc');
    if (sortMode === 'asc') {
        btn.classList.add('asc');
        arrow.textContent = '↑';
    } else {
        btn.classList.add('desc');
        arrow.textContent = '↓';
    }
    initListM();
}

function filterM(lv) {
    manageFilterLevel = lv;
    document.querySelectorAll('#filterRow .filter-chip').forEach(c =>
        c.classList.toggle('active',
            (lv === 'ALL' && c.textContent === '전체') || c.textContent === lv
        )
    );
    initListM();
}

function deleteWordM(id) {
    if (!confirm('삭제하시겠습니까?')) return;

    const isDefault = DEFAULT_WORDS.some(w => w.id === id);
    words     = words.filter(w => w.id !== id);
    recentIds = recentIds.filter(i => i !== id);
    delete records[id];

    if (isDefault) {
        const deleted = lsLoad(LS.DELETED_IDS, []);
        deleted.push(id);
        saveDeletedIds(deleted);
    } else {
        saveCustomWords();
    }

    saveRecords();
    saveRecentIds();
    showToast('단어를 삭제했습니다.');
    initListM();
}

function openAddModal()  { document.getElementById('addOverlay').classList.add('open'); }
function closeAddModal() { document.getElementById('addOverlay').classList.remove('open'); }

function closeAddM(e) {
    if (e.target === document.getElementById('addOverlay')) closeAddModal();
}

function addWordM() {
    const kanji    = document.getElementById('addKanji').value.trim();
    const hiragana = document.getElementById('addHiragana').value.trim();
    const korean   = document.getElementById('addKorean').value.trim();
    const level    = document.getElementById('addLevel').value;

    if (!kanji || !hiragana || !korean) { alert('모든 항목을 입력해주세요.'); return; }

    const newWord = { id: nextId++, kanji, hiragana, korean, level };
    words.push(newWord);
    saveCustomWords();

    document.getElementById('addKanji').value    = '';
    document.getElementById('addHiragana').value = '';
    document.getElementById('addKorean').value   = '';

    closeAddModal();
    showToast('단어를 추가했습니다! 💾');
    initListM();
}

// ════════════════════════════════════════════════
//  기록 탭
// ════════════════════════════════════════════════
function formatDateM(date) {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getScoreClass(pct) {
    return pct >= 80 ? 'score-great' : pct >= 50 ? 'score-good' : 'score-poor';
}

function renderRecordM() {
    const el = document.getElementById('recList');

    if (!examHistory.length) {
        el.innerHTML = '<div class="rec-empty">아직 기록이 없어요 📝<br>첫 시험을 시작해보세요!</div>';
        return;
    }

    el.innerHTML = '';
    examHistory.forEach((h, i) => {
        const div     = document.createElement('div');
        div.className = 'rec-item-m';
        div.onclick   = () => openDetailM(i);
        div.innerHTML = `
            <div class="rec-item-left">
                <div class="rec-date-m">🕐 ${formatDateM(h.date)}</div>
                <div class="rec-info-m">
                    <span class="rec-level-tag">${h.level}</span>
                    <span class="rec-title-m">단어 시험 · ${h.total}문제</span>
                </div>
            </div>
            <div class="rec-right">
                <div class="score-badge-sm ${getScoreClass(h.pct)}">${h.pct}%</div>
                <div class="rec-score-det">${h.correct}/${h.total} 정답</div>
            </div>
            <span class="rec-arrow-m">›</span>`;
        el.appendChild(div);
    });
}

function openDetailM(idx) {
    const h = examHistory[idx];
    document.getElementById('detailTitle').textContent = `${h.level} 단어 시험 정오표`;
    document.getElementById('detailMeta').textContent  = `🕐 ${formatDateM(h.date)}`;
    document.getElementById('detailScore').textContent = `${h.correct} / ${h.total} 정답 (${h.pct}%)`;

    const tbody = document.getElementById('detailBody');
    tbody.innerHTML = '';
    h.results.forEach((r, i) => {
        const tr      = document.createElement('tr');
        tr.innerHTML  = `
            <td>${i + 1}</td>
            <td>${r.word.kanji}</td>
            <td>${r.word.hiragana}</td>
            <td>${r.word.korean}</td>
            <td class="${r.correct ? 'r-ok' : 'r-ng'}">${r.correct ? '⭕' : '❌'}</td>`;
        tbody.appendChild(tr);
    });

    document.getElementById('detailOverlay').classList.add('open');
}

function closeDetailModal() {
    document.getElementById('detailOverlay').classList.remove('open');
}

function closeDetailM(e) {
    if (e.target === document.getElementById('detailOverlay')) closeDetailModal();
}

// ════════════════════════════════════════════════
//  앱 초기화
// ════════════════════════════════════════════════
(function init() {
    applyInitialLevel();
    updateHomeSummary();
    renderRecentM();
    showToast('💾 이전 학습 기록을 불러왔습니다!', 2200);
})();
