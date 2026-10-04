// scripts/export-data.js
// Supabaseから全テーブルのデータと画像をローカルに完全バックアップするスクリプト

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bcxgspobwkorzhhysuyb.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjeGdzcG9id2tvcnpoaHlzdXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNTEyNjAsImV4cCI6MjA5MDgyNzI2MH0.xAOaxSENOxtHieegrbZkOhThCUxfrPsni7P1-LaIvhU';

const headers = {
  apikey: supabaseKey,
  Authorization: `Bearer ${supabaseKey}`
};

const tables = [
  'activity_reports',
  'firefly_points',
  'parking_lots',
  'viewing_info',
  'course_routes'
];

async function fetchTable(table) {
  const url = `${supabaseUrl}/rest/v1/${table}?select=*`;
  console.log(`Fetching ${table}...`);
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${table}: ${res.statusText}`);
  }
  return await res.json();
}

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Failed to download image ${url}: ${res.status}`);
      return false;
    }
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    return true;
  } catch (err) {
    console.warn(`Error downloading ${url}:`, err.message);
    return false;
  }
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const imagesDir = path.join(projectRoot, 'public', 'images', 'reports');
  const backupDir = path.join(projectRoot, 'src', 'data', 'backup');

  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const database = {};

  for (const table of tables) {
    database[table] = await fetchTable(table);
    fs.writeFileSync(
      path.join(backupDir, `${table}.json`),
      JSON.stringify(database[table], null, 2),
      'utf-8'
    );
    console.log(`✓ Saved ${table}.json (${database[table].length} records)`);
  }

  // 画像ダウンロード＆パス置換
  console.log('\n--- Downloading report images ---');
  const reports = database['activity_reports'] || [];
  const processedReports = [];

  for (const report of reports) {
    const copy = { ...report };
    const allImages = [];

    // image_url または images/image_urls を集める
    if (copy.image_url) allImages.push(copy.image_url);
    if (Array.isArray(copy.images)) allImages.push(...copy.images);
    if (Array.isArray(copy.image_urls)) allImages.push(...copy.image_urls);

    const uniqueImages = [...new Set(allImages.filter(Boolean))];
    const localImages = [];

    for (const imgUrl of uniqueImages) {
      if (imgUrl.startsWith('http')) {
        const urlObj = new URL(imgUrl);
        const fileName = path.basename(urlObj.pathname);
        const destFile = path.join(imagesDir, fileName);

        if (!fs.existsSync(destFile)) {
          console.log(`Downloading: ${fileName}`);
          await downloadImage(imgUrl, destFile);
        } else {
          console.log(`Already exists: ${fileName}`);
        }
        localImages.push(`/images/reports/${fileName}`);
      } else {
        localImages.push(imgUrl);
      }
    }

    if (localImages.length > 0) {
      copy.image_url = localImages[0];
      copy.images = localImages;
      copy.image_urls = localImages;
    }

    processedReports.push(copy);
  }

  database['activity_reports'] = processedReports;

  // staticBackupData.js を生成
  const staticDataJsContent = `// 自動生成されたオフシーズン用静的バックアップデータ
// 最終エクスポート日時: ${new Date().toISOString()}

export const staticBackupData = ${JSON.stringify(database, null, 2)};
`;

  fs.writeFileSync(
    path.join(projectRoot, 'src', 'data', 'staticBackupData.js'),
    staticDataJsContent,
    'utf-8'
  );

  console.log('\n✓ Generated src/data/staticBackupData.js successfully!');
}

main().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
