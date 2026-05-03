-- ============================================
-- 福井ほたる祭り データベース初期セットアップ
-- Supabase SQL Editor で実行してください
-- ============================================

-- ① 飛翔ポイントテーブル
CREATE TABLE firefly_points (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  course TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL DEFAULT 'low' CHECK (status IN ('peak', 'high', 'medium', 'low')),
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT
);

-- ② 駐車場テーブル
CREATE TABLE parking_lots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  capacity INTEGER NOT NULL,
  walk_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'normal' CHECK (status IN ('normal', 'available', 'limited', 'full')),
  hint TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT
);

-- ③ 活動レポートテーブル
CREATE TABLE activity_reports (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'お知らせ' CHECK (category IN ('観測', '準備', 'お知らせ', 'イベント')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ④ 管理画面パスワードテーブル（共通パスワード方式）
CREATE TABLE admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- ============================================
-- Row Level Security (RLS) の設定
-- 「誰でも読める、書き込みも anon キーで可能」にする
-- ============================================

ALTER TABLE firefly_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- 全テーブルの読み取りを許可
CREATE POLICY "誰でも読み取り可" ON firefly_points FOR SELECT USING (true);
CREATE POLICY "誰でも読み取り可" ON parking_lots FOR SELECT USING (true);
CREATE POLICY "誰でも読み取り可" ON activity_reports FOR SELECT USING (true);
CREATE POLICY "誰でも読み取り可" ON admin_settings FOR SELECT USING (true);

-- 管理用の書き込みを許可（anon キーでの更新・挿入・削除）
CREATE POLICY "管理用書き込み" ON firefly_points FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "管理用書き込み" ON parking_lots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "管理用書き込み" ON activity_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "管理用書き込み" ON admin_settings FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 初期データの投入
-- ============================================

-- 管理画面パスワード（Supabase SQL Editor で直接設定してください）
-- UPDATE admin_settings SET value = '（パスワード）' WHERE key = 'admin_password';

-- 飛翔ポイント初期データ
INSERT INTO firefly_points (id, name, course, lat, lng, status, description, updated_at) VALUES
  ('point-hotaru-1', '蛍観橋コース　蛍観橋付近', '蛍観橋コース', 37.760707, 138.832346, 'high', '水辺沿いに多数飛翔中', '2026-04-01T20:30:00+09:00'),
  ('point-donokoshi-1', '堂ノ腰コース　林道出口', '堂ノ腰コース', 37.756259, 138.834314, 'peak', '今年一番の飛翔スポット', '2026-04-01T19:28:00+09:00'),
  ('point-donokoshi-2', '堂ノ腰コース　林道中間', '堂ノ腰コース', 37.756602, 138.833343, 'medium', '少しずつ増えてきています', '2026-03-31T21:15:00+09:00'),
  ('point-donokoshi-3', '堂ノ腰コース　林道入口', '堂ノ腰コース', 37.757659, 138.832313, 'medium', '下流側でも見られます', '2026-04-01T19:20:00+09:00'),
  ('point-donokoshi-4', 'ほたる遊歩道', 'ほたる遊歩道', 37.757668, 138.831283, 'medium', '草むらに隠れて光っています', '2026-04-01T19:10:00+09:00'),
  ('point-genpei-1', '源平橋コース　平家橋下', '源平橋コース', 37.755407, 138.835881, 'low', 'まだほとんど見えません', '2026-04-01T18:50:00+09:00'),
  ('point-genpei-2', '源平橋コース　イモ穴橋下', '源平橋コース', 37.756494, 138.835350, 'low', 'まだほとんど見えません', '2026-04-01T18:45:00+09:00'),
  ('point-genpei-3', '源平橋コース　イモ穴橋上', '源平橋コース', 37.757093, 138.835060, 'low', 'これからの飛翔に期待です', '2026-03-31T18:40:00+09:00'),
  ('point-genpei-4', '源平橋コース　源氏橋上', '源平橋コース', 37.758099, 138.834803, 'low', 'まだ静かな状況です', '2026-04-01T18:35:00+09:00');

-- 駐車場初期データ
INSERT INTO parking_lots (id, name, lat, lng, capacity, walk_time, status, hint, updated_at) VALUES
  ('P1', 'ほたるの里公園', 37.759104, 138.830527, 65, '徒歩1分', 'full', '会場至近。例年19時前には満車になります。', '2026-04-01T18:30:00+09:00'),
  ('P2', '巻農村環境改善センター', 37.759236, 138.828564, 50, '徒歩5分', 'normal', '会場至近。P1の次に埋まりやすいです。', '2026-04-01T18:30:00+09:00'),
  ('P3', '農村改善センター裏', 37.759504, 138.827936, 20, '徒歩5分', 'normal', 'やや暗いのであまりおすすめしません。', '2025-06-21T18:00:00+09:00'),
  ('P4', '角田山登山口（国道側）', 37.758811, 138.833730, 20, '徒歩5分', 'normal', '国道側で出入りしやすい中規模駐車場です。', '2025-06-21T18:15:00+09:00'),
  ('P5', '角田山登山口（登山口側）', 37.758849, 138.834373, 20, '徒歩5分', 'normal', '蛍観橋コースに近く、P4と合わせて利用されます。', '2025-06-21T18:00:00+09:00'),
  ('P6', '旧庄屋佐藤家', 37.754993, 138.837549, 30, '徒歩20分', 'normal', '大規模で停めやすい穴場。散策を兼ねてどうぞ。', '2025-06-21T17:30:00+09:00'),
  ('P7', '福井神社前', 37.753248, 138.836342, 10, '徒歩20分', 'normal', '会場からは少し離れますが、飛翔ポイントに近いため観賞メインの方におすすめです。', '2025-06-21T17:30:00+09:00'),
  ('P8', '福井集落開発センター', 37.754418, 138.839829, 10, '徒歩25分', 'normal', '他の駐車場が満車の場合はご利用下さい。', '2025-06-21T17:30:00+09:00');

-- 活動レポート初期データ
INSERT INTO activity_reports (title, date, author, content, category) VALUES
  ('今年のほたる初確認！', '2025-06-05', '田中', '今年も矢垂川上流でゲンジボタルの初飛翔を確認しました。例年より少し早めの確認です。これから数が増えていくと思います。', '観測'),
  ('会場設営が始まりました', '2025-06-10', '佐藤', '6月21日の本祭に向けて、会場の設営作業を開始しました。テント設営、観賞コースの整備を行っています。', '準備'),
  ('飛翔数が増えてきました', '2025-06-15', '田中', '蛍観橋コース付近で約50匹のゲンジボタルを確認。堂ノ腰コースでも20匹ほど確認できました。見頃は6月下旬になりそうです。', '観測'),
  ('観賞マナーのお願い', '2025-06-18', '鈴木', 'ほたる観賞時は強い光を避け、静かに観賞していただくようお願いいたします。ほたるの生態を守るために皆様のご協力をお願いします。', 'お知らせ');
