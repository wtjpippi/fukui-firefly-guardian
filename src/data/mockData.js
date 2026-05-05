// ほたる飛翔ポイントデータ
// 矢垂川沿いの観賞コースをご案内
export const fireflyPoints = [
  {
    id: 'point-hotaru-1',
    name: '蛍観橋コース　蛍観橋付近',
    lat: 37.760707,
    lng: 138.832346,
    course: '蛍観橋コース',
    status: 'high',
    lastUpdated: '2026-04-01T20:30:00',
    description: '水辺沿いに多数飛翔中',
  },
  {
    id: 'point-donokoshi-1',
    name: '堂ノ腰コース　林道出口',
    lat: 37.756259,
    lng: 138.834314,
    course: '堂ノ腰コース',
    status: 'peak',
    lastUpdated: '2026-04-01T19:28:00',
    description: '今年一番の飛翔スポット',
  },
  {
    id: 'point-donokoshi-2',
    name: '堂ノ腰コース　林道中間',
    lat: 37.756602,
    lng: 138.833343,
    course: '堂ノ腰コース',
    status: 'medium',
    lastUpdated: '2026-03-31T21:15:00',
    description: '少しずつ増えてきています',
  },
  {
    id: 'point-donokoshi-3',
    name: '堂ノ腰コース　林道入口',
    lat: 37.757659,
    lng: 138.832313,
    course: '堂ノ腰コース',
    status: 'medium',
    lastUpdated: '2026-04-01T19:20:00',
    description: '下流側でも見られます',
  },
  {
    id: 'point-donokoshi-4',
    name: 'ほたる遊歩道',
    lat: 37.757668,
    lng: 138.831283,
    course: 'ほたる遊歩道',
    status: 'medium',
    lastUpdated: '2026-04-01T19:10:00',
    description: '草むらに隠れて光っています',
  },
  {
    id: 'point-genpei-1',
    name: '源平橋コース　平家橋下',
    lat: 37.755407,
    lng: 138.835881,
    course: '源平橋コース',
    status: 'low',
    lastUpdated: '2026-04-01T18:50:00',
    description: 'まだほとんど見えません',
  },
  {
    id: 'point-genpei-2',
    name: '源平橋コース　イモ穴橋下',
    lat: 37.756494,
    lng: 138.835350,
    course: '源平橋コース',
    status: 'low',
    lastUpdated: '2026-04-01T18:45:00',
    description: 'まだほとんど見えません',
  },
  {
    id: 'point-genpei-3',
    name: '源平橋コース　イモ穴橋上',
    lat: 37.757093,
    lng: 138.835060,
    course: '源平橋コース',
    status: 'low',
    lastUpdated: '2026-03-31T18:40:00',
    description: 'これからの飛翔に期待です',
  },
  {
    id: 'point-genpei-4',
    name: '源平橋コース　源氏橋上',
    lat: 37.758099,
    lng: 138.834803,
    course: '源平橋コース',
    status: 'low',
    lastUpdated: '2026-04-01T18:35:00',
    description: 'まだ静かな状況です',
  },
];

// 駐車場データ（P1～P8：チラシの駐車場案内に基づく概算座標）
export const parkingLots = [
  {
    id: 'P1',
    name: 'ほたるの里公園',
    lat: 37.759104,
    lng: 138.830527,
    capacity: 65,
    walkTime: '徒歩1分',
    status: 'full',
    hint: '会場至近。例年19時前には満車になります。',
    lastUpdated: '2026-04-01T18:30:00',
  },
  {
    id: 'P2',
    name: '巻農村環境改善センター',
    lat: 37.759236,
    lng: 138.828564,
    capacity: 50,
    walkTime: '徒歩5分',
    status: 'normal',
    hint: '会場至近。P1の次に埋まりやすいです。',
    lastUpdated: '2026-04-01T18:30:00',
  },
  {
    id: 'P3',
    name: '農村改善センター裏',
    lat: 37.759504,
    lng: 138.827936,
    capacity: 20,
    walkTime: '徒歩5分',
    status: 'normal',
    hint: 'やや暗いのであまりおすすめしません。',
    lastUpdated: '2025-06-21T18:00:00',
  },
  {
    id: 'P4',
    name: '角田山登山口（国道側）',
    lat: 37.758811,
    lng: 138.833730,
    capacity: 20,
    walkTime: '徒歩5分',
    status: 'normal',
    hint: '国道側で出入りしやすい中規模駐車場です。',
    lastUpdated: '2025-06-21T18:15:00',
  },
  {
    id: 'P5',
    name: '角田山登山口（登山口側）',
    lat: 37.758849,
    lng: 138.834373,
    capacity: 20,
    walkTime: '徒歩5分',
    status: 'normal',
    hint: '蛍観橋コースに近く、P4と合わせて利用されます。',
    lastUpdated: '2025-06-21T18:00:00',
  },
  {
    id: 'P6',
    name: '旧庄屋佐藤家',
    lat: 37.754993,
    lng: 138.837549,
    capacity: 30,
    walkTime: '徒歩20分',
    status: 'normal',
    hint: '大規模で停めやすい穴場。散策を兼ねてどうぞ。',
    lastUpdated: '2025-06-21T17:30:00',
  },
  {
    id: 'P7',
    name: '福井神社前',
    lat: 37.753248,
    lng: 138.836342,
    capacity: 10,
    walkTime: '徒歩20分',
    status: 'normal',
    hint: '会場からは少し離れますが、飛翔ポイントに近いため観賞メインの方におすすめです。',
    lastUpdated: '2025-06-21T17:30:00',
  },
  {
    id: 'P8',
    name: '福井集落開発センター',
    lat: 37.754418,
    lng: 138.839829,
    capacity: 10,
    walkTime: '徒歩25分',
    status: 'normal',
    hint: '他の駐車場が満車の場合はご利用下さい。',
    lastUpdated: '2025-06-21T17:30:00',
  },
];

// 出店情報
export const vendors = [
  {
    id: 'vendor-1',
    name: 'ほたる茶屋',
    type: 'food',
    items: ['けんさ焼き', '玉こんにゃく', '焼きそば', '豚汁', '鮎の塩焼き', 'BR', '生ビール', 'ソフトドリンク', 'ほか'],
    location: '会場メインエリア',
    isMain: true,
  },
  {
    id: 'vendor-6',
    name: 'あめ屋・本間屋',
    type: 'sweets',
    items: ['ほたるまんじゅう', 'ゆべし'],
    location: '会場メインエリア',
    isMain: true,
  },
  {
    id: 'vendor-5',
    name: 'じょんのび館',
    type: 'sauna',
    items: ['テントサウナ'],
    location: '会場内',
    description: '貸しタオルセットの当日無料チケットを配布！お祭りの前後には温泉でゆっくりどうぞ',
    isMain: false,
  },
  {
    id: 'vendor-3',
    name: '峠乃白梅',
    type: 'sake',
    items: ['地酒各種', '伏流水仕込み日本酒', '自家製めんま'],
    location: '酒販売コーナー',
    description: '伏流水仕込み！地酒の販売',
    isMain: false,
  },
  {
    id: 'vendor-4',
    name: '子どもお楽しみコーナー',
    type: 'kids',
    items: ['おもちゃ釣り', 'お菓子釣り'],
    location: '会場内子どもエリア',
    isMain: true,
  },
];

// イベントスケジュール
export const schedule = [
  {
    time: '17:00',
    title: '開場',
    description: 'ほたる茶屋・各出店がオープン',
    icon: '🏮',
  },
  {
    time: '17:00',
    title: 'じょんのび館',
    description: '会場にて特設テントサウナ体験を実施！',
    icon: '♨️',
  },
  {
    time: '18:30',
    title: '神楽舞の演舞',
    description: '地元福井の神楽倶楽舞による伝統的な神楽舞をお楽しみください',
    icon: '⛩️',
  },
  {
    time: '19:30',
    title: 'ガイド付きほたる観賞会',
    description: '集合19:30、終了20:45。地元ガイドがほたるの生態を解説しながら観賞コースをご案内',
    icon: '🔦',
  },
  {
    time: '21:00',
    title: '閉場',
    description: 'お気をつけてお帰りください',
    icon: '🌙',
  },
];

// FAQ
export const faqData = [
  {
    category: 'イベント・観賞会',
    items: [
      {
        question: 'ガイド付き観賞会の集合場所と時間は？',
        answer: '集合時間は19:30（終了予定20:45）です。集合場所は「ほたるの里公園内 ほたる案内所」へお越しください。',
      },
      {
        question: '観賞会の参加費や定員はありますか？',
        answer: '参加費は無料です。定員は各日20名となっており、定員に達し次第、受付を終了させていただきます。',
      },
      {
        question: '予約は必要ですか？',
        answer: 'はい、事前予約制です。当サイトの予約ページ（Googleフォーム）よりお申し込みください。',
      },
      {
        question: '雨天の場合は中止になりますか？',
        answer: 'ほたる祭りは小雨決行ですが、ガイド付き観賞会は雨天中止（順延の場合あり）となります。中止が決定した場合は、ご予約時に登録いただいたお電話番号へご連絡差し上げます。あわせて公式サイト等でもお知らせいたします。',
      },
      {
        question: '入場料はかかりますか？',
        answer: 'お祭りへの入場は無料です。ほたる茶屋や各出店での飲食・お買い物は有料となります。',
      },
    ],
  },
  {
    category: 'マナー・注意事項',
    items: [
      {
        question: 'フラッシュ撮影はできますか？',
        answer: 'ほたるの生態を守るため、フラッシュ撮影や強い光（懐中電灯など）の使用はご遠慮ください。液晶画面の明るさにもご注意をお願いします。',
      },
      {
        question: 'ペットを連れて行けますか？',
        answer: 'ほたるの生育環境および自然保護のため、会場内へのペット同伴はご遠慮いただいております。',
      },
      {
        question: '虫除け対策はどうすればいいですか？',
        answer: 'ほたるは薬品に弱いため、化学スプレーの使用は避け、長袖・長ズボンの着用による対策をおすすめしています。',
      },
    ],
  },
  {
    category: 'アクセス・駐車場',
    items: [
      {
        question: '駐車場は有料ですか？',
        answer: 'いいえ、会場周辺の駐車場はすべて無料です。場所やリアルタイムの空き状況は、当サイトの「ほたるマップ」からご確認いただけます。',
      },
      {
        question: '公共交通機関での行き方は？',
        answer: 'JR越後線「岩室駅」からタクシーで約10分、または「巻駅」からタクシーで約15分です。夜間はタクシーが混み合うため、事前予約をおすすめします。',
      },
    ],
  },
];

// 監視員レポート（モック）
export const reports = [
  {
    id: 'report-1',
    title: '今年のほたる初確認！',
    date: '2025-06-05',
    author: '田中',
    content: '今年も矢垂川上流でゲンジボタルの初飛翔を確認しました。例年より少し早めの確認です。これから数が増えていくと思います。',
    category: '観測',
  },
  {
    id: 'report-2',
    title: '会場設営が始まりました',
    date: '2025-06-10',
    author: '佐藤',
    content: '6月21日の本祭に向けて、会場の設営作業を開始しました。テント設営、観賞コースの整備を行っています。',
    category: '準備',
  },
  {
    id: 'report-3',
    title: '飛翔数が増えてきました',
    date: '2025-06-15',
    author: '田中',
    content: '蛍観橋コース付近で約50匹のゲンジボタルを確認。堂ノ腰コースでも20匹ほど確認できました。見頃は6月下旬になりそうです。',
    category: '観測',
  },
  {
    id: 'report-4',
    title: '観賞マナーのお願い',
    date: '2025-06-18',
    author: '鈴木',
    content: 'ほたる観賞時は強い光を避け、静かに観賞していただくようお願いいたします。ほたるの生態を守るために皆様のご協力をお願いします。',
    category: 'お知らせ',
  },
];

export const galleryData = [
  {
    year: 2025,
    title: '第31回',
    description: 'ほたるの出現数が多く、多くの来場者で賑わいました。',
    images: [],
  },
  {
    year: 2024,
    title: '第30回 記念大会',
    description: '30回目の節目を迎えた記念大会。過去最多の来場者数を記録。',
    images: [],
  },
  {
    year: 2023,
    title: '第29回',
    description: '好天に恵まれ、多くのほたるが観賞できました。',
    images: [],
  },
  {
    year: 2022,
    title: '第28回',
    description: '3年ぶりの通常開催。多くの来場者で賑わいました。',
    images: [],
  },
];
