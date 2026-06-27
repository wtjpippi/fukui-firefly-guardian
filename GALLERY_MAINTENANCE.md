# 📸 ギャラリー運用・メンテナンスマニュアル

このファイルでは、福井ほたる祭り公式サイトのギャラリーページを、2026年度以降もスムーズに更新・運用するための手順を説明します。

---

## 1. ギャラリーの基本構造

現在のギャラリーは以下の2層構造になっています。

1.  **最新の風景（Recent）**: ページ上部に大きく表示される「メイン」のセクション。
2.  **過去の歩み（Archive）**: 下部にカード形式で並ぶ「アーカイブ」のセクション（データがある場合のみ表示）。

---

## 2. 2026年度の写真が揃った時の更新手順

2026年度の開催写真が揃い、ギャラリーを更新する際は、`src/data/mockData.js` の `galleryData` を以下のように編集してください。

### 手順 A：新しいフォルダの作成
1.  `public/images/gallery/2026/` フォルダを新規作成します。
2.  そこに 2026年の写真（例：`img-01.jpg` 〜）を配置します。

### 手順 B：データの追加と移行
`galleryData` 配列の**先頭**に、新しい年度のデータを追加します。

```javascript
export const galleryData = [
  // 【新規】2026年度のデータを先頭（Recent）にする
  {
    year: 'Recent',
    title: '2026年度 開催の様子',
    description: '今年度のほたる祭りの熱気をお届けします。',
    images: [
      { url: '/images/gallery/2026/img-01.jpg', alt: '説明文', title: '写真タイトル' },
      // ...
    ],
    isRecent: true
  },
  // 【移行】これまでの「近年の開催の様子」をアーカイブにする
  {
    year: 2025, // 特定の年度に変更
    title: '第31回（2025年）',
    description: '賑わう屋台や灯籠など、当時の活気あふれる記録です。',
    images: [
      // 元々「Recent」に入っていた画像リストをここに移動
    ],
  }
];
```

**ポイント**:
- 配列の先頭（`isRecent: true`）がページ最上部にフィーチャー表示されます。
- 2番目以降の要素は、自動的にページ下部の「過去の歩み」セクションにカードとして並びます。

---

## 3. 画像管理のルール（推奨）

-   **保存場所**: `public/images/gallery/[年度]/`
-   **推奨サイズ**: 横幅 1200px 〜 1600px 程度（高画質すぎると読み込みが遅くなります）
-   **ファイル名**: `photo-1.jpg` などの連番、または `shishimai.jpg` などの内容がわかる半角英数字。

---

## 4. 運用ポリシー（案）

-   **更新時期**: 毎年のお祭り終了後、1ヶ月以内を目安に「最新」を更新。
-   **選定基準**: 
    - ほたるそのものよりも「お祭りの熱気」「人の笑顔」「地域の伝統（灯籠や神楽）」が伝わるものを優先すると、サイトの雰囲気がより良くなります。
    - 1年度あたり 6枚〜12枚 程度が、レイアウト的に最も綺麗に見えます。

---

## 4. 画像の一括自動圧縮手順

画像ファイルが大きすぎると、サイトの読み込み速度低下や、Vercelの月間転送量（100GB制限）を圧迫する原因になります。

プロジェクトの `scripts/` ディレクトリ内に、画像を自動で最適化するPowerShellスクリプト [compress_images.ps1](file:///c:/Users/DP/Desktop/fukuihotaru/scripts/compress_images.ps1) を用意してあります。

### 🤖 AIアシスタントに依頼して自動実行する場合
フォルダ（`public/images/` の中など）に画像をそのまま置いた状態で、チャットで以下のように指示するだけで、AIが画像の自動圧縮からGitHubへのアップロードまでを全自動で実行します。
> 「画像を追加したので、画像圧縮スクリプト（`scripts/compress_images.ps1`）を実行して、軽量化された写真をGitHubにプッシュしてください」

### 💻 手動で（ご自身のPCで）実行する場合
1. Windows PowerShell を起動します。
2. プロジェクトのフォルダに移動します：
   ```powershell
   cd C:\Users\DP\Desktop\fukuihotaru
   ```
3. スクリプトを実行します（1MBを超える画像が自動で幅1600px・画質75%の軽量なJPGに上書き圧縮されます）：
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/compress_images.ps1
   ```

---

## 5. スマホ「戻る」ボタンによるポップアップ・メニュークローズ制御 (History API)

スマートフォンでの操作時、画像拡大ポップアップ（Lightbox）やスマホ用メニュー画面が開いている状態で「戻る」操作をしても、ページ全体が戻らずにポップアップ類だけがスムーズに閉じるよう、ブラウザ履歴（History API / ハッシュ）と連動した制御を組み込んでいます。

### 🛠️ 実装箇所と仕組み
*   **スマホメニュー**: [Header.jsx](file:///c:/Users/DP/Desktop/fukuihotaru/src/components/Header/Header.jsx)
    *   メニューを開いた際にURL末尾に `#menu` 履歴を追加。戻る操作でハッシュが消えた時（`popstate`）にメニューを閉じます。
*   **お祭りギャラリー**: [Gallery.jsx](file:///c:/Users/DP/Desktop/fukuihotaru/src/pages/Gallery/Gallery.jsx)
    *   画像拡大時に URL に `#gallery` を追加。戻る操作を検知して画像を閉じます。
*   **地元のお店**: [LocalGuide.jsx](file:///c:/Users/DP/Desktop/fukuihotaru/src/pages/LocalGuide/LocalGuide.jsx)
    *   店舗写真拡大時に URL に `#shop-gallery` を追加。同様に戻る操作で画像を閉じます。

今後新しく画面全体を覆うようなポップアップやモーダル、メニューを新規作成する際は、上記ファイルを参考に `popstate` イベントのリスナーを設定してください。

---
このマニュアルを参考に、福井ほたる祭りの歴史を積み重ねていってください！
