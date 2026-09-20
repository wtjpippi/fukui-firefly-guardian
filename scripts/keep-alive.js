// scripts/keep-alive.js
// Supabaseの自動休止（スリープ）を防止するため、表画面に影響しない裏のダミースロットをランダム更新するスクリプト

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("エラー: SUPABASE_URL または SUPABASE_ANON_KEY が設定されていません。");
  process.exit(1);
}

// 表の画面（Home, Map等）では id: 'current' しか取得しないため、
// 以下の system_heartbeat_* スロットは一般ユーザーの画面には一切影響を与えません。
const SLOTS = [
  'system_heartbeat_1',
  'system_heartbeat_2',
  'system_heartbeat_3',
  'system_heartbeat_4',
  'system_heartbeat_5'
];

async function runHeartbeat() {
  // 5つのスロットから毎回ランダムに1つを選択して更新（単調なアクセスを回避）
  const randomIndex = Math.floor(Math.random() * SLOTS.length);
  const targetSlot = SLOTS[randomIndex];
  
  const now = new Date().toISOString();
  const randomHash = Math.random().toString(36).substring(2, 10);
  const payload = {
    id: targetSlot,
    comment: `keepalive-pulse-${randomHash}`,
    updated_at: now
  };

  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/viewing_info`;

  console.log(`[Keep-Alive] 実行開始: ${targetSlot} へ書き込みます (時刻: ${now})...`);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Keep-Alive] エラー発生 (HTTP ${response.status}): ${errorText}`);
    process.exit(1);
  }

  console.log(`[Keep-Alive] 成功! ${targetSlot} の更新が完了しました (HTTP ${response.status})`);
}

runHeartbeat().catch((err) => {
  console.error("[Keep-Alive] 予期せぬエラー:", err);
  process.exit(1);
});
