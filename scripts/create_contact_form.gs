// ============================================================
// 福井ほたる祭り - お問い合わせフォーム 自動生成
// ============================================================
// 
// 【使い方】
// 1. https://script.google.com にアクセス
// 2. 「新しいプロジェクト」をクリック
// 3. このファイルの内容を全選択してコピーし、エディタに貼り付け
// 4. 上部の「▶ 実行」ボタンをクリック
// 5. 実行ログにフォームのURLが表示されるのでコピー
// ============================================================

function createContactForm() {
  // フォーム作成
  var form = FormApp.create('福井ほたる祭り お問い合わせ');
  form.setDescription(
    '福井ほたる祭りへのお問い合わせフォームです。\n' +
    '取材・協賛・出店・その他のご質問など、お気軽にお問い合わせください。\n\n' +
    '※ 回答には数日いただく場合がございます。\n' +
    '※ お急ぎの方は直接お電話ください（XXX-XXXX-XXXX）'
  );
  form.setConfirmationMessage(
    'お問い合わせありがとうございます。\n' +
    '内容を確認の上、担当者よりご連絡いたします。'
  );
  form.setCollectEmail(false);

  // 1. お名前
  form.addTextItem()
    .setTitle('お名前')
    .setRequired(true);

  // 2. メールアドレス
  form.addTextItem()
    .setTitle('メールアドレス')
    .setHelpText('ご返信先のメールアドレス')
    .setRequired(true);

  // 3. 電話番号
  form.addTextItem()
    .setTitle('電話番号')
    .setRequired(false);

  // 4. お問い合わせ種別
  form.addListItem()
    .setTitle('お問い合わせ種別')
    .setChoiceValues([
      '取材について',
      '協賛について',
      '出店について',
      'イベントについて',
      'ほたるの保護活動について',
      'その他'
    ])
    .setRequired(true);

  // 5. お問い合わせ内容
  form.addParagraphTextItem()
    .setTitle('お問い合わせ内容')
    .setRequired(true);

  // ログにURL表示
  Logger.log('=== フォーム作成完了 ===');
  Logger.log('編集URL: ' + form.getEditUrl());
  Logger.log('回答URL: ' + form.getPublishedUrl());
  Logger.log('========================');
  Logger.log('回答URLをホームページのお問い合わせボタンに設定してください');
}
