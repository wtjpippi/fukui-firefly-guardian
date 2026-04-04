// ============================================================
// 福井ほたる祭り - ガイド付きほたる鑑賞会 予約フォーム 自動生成
// ============================================================
// 
// 【使い方】
// 1. https://script.google.com にアクセス
// 2. 「新しいプロジェクト」をクリック
// 3. このファイルの内容を全選択してコピーし、エディタに貼り付け
//    （元のコードは全部消してからペースト）
// 4. 上部の「▶ 実行」ボタンをクリック
// 5. 初回は権限の確認ダイアログが出るので許可
// 6. 実行ログにフォームのURLが表示されるのでコピー
// ============================================================

function createReservationForm() {
  // フォーム作成
  var form = FormApp.create('ガイド付きほたる鑑賞会 予約フォーム');
  form.setDescription(
    '第31回 福井ほたる祭り\n' +
    'ガイド付きほたる鑑賞会のご予約フォームです。\n\n' +
    '■ 集合時間: 19:30\n' +
    '■ 終了予定: 20:45\n' +
    '■ 参加費: 無料\n' +
    '■ 集合場所: ほたるの里公園\n\n' +
    '※ 定員になり次第、受付を終了させていただきます。\n' +
    '※ 小雨決行、荒天時は中止となります。'
  );
  form.setConfirmationMessage(
    'ご予約ありがとうございます！\n' +
    '当日は19:30までにほたるの里公園にお集まりください。\n' +
    '懐中電灯をご持参ください（足元用、弱い光でお願いします）。'
  );
  form.setCollectEmail(false);

  // 1. お名前
  form.addTextItem()
    .setTitle('お名前')
    .setRequired(true);

  // 2. フリガナ
  form.addTextItem()
    .setTitle('フリガナ')
    .setRequired(true);

  // 3. 電話番号
  form.addTextItem()
    .setTitle('電話番号')
    .setHelpText('当日の緊急連絡用')
    .setRequired(true);

  // 4. メールアドレス
  form.addTextItem()
    .setTitle('メールアドレス')
    .setHelpText('確認のご連絡に使用します（任意）')
    .setRequired(false);

  // 5. 参加希望日
  form.addMultipleChoiceItem()
    .setTitle('参加希望日')
    .setChoiceValues([
      '6月14日（土）',
      '6月15日（日）',
      '6月21日（土）※ほたる祭り当日',
      '6月22日（日）'
    ])
    .setRequired(true);

  // 6. 参加人数（大人）
  form.addListItem()
    .setTitle('参加人数（大人）')
    .setChoiceValues(['1名', '2名', '3名', '4名', '5名', '6名', '7名', '8名', '9名', '10名'])
    .setRequired(true);

  // 7. 参加人数（子ども）
  form.addListItem()
    .setTitle('参加人数（子ども・中学生以下）')
    .setChoiceValues(['0名', '1名', '2名', '3名', '4名', '5名', '6名', '7名', '8名', '9名', '10名'])
    .setRequired(true);

  // 8. 交通手段
  form.addMultipleChoiceItem()
    .setTitle('ご来場の交通手段')
    .setChoiceValues([
      '自家用車',
      '公共交通機関（電車・バス）',
      '送迎・タクシー',
      'その他'
    ])
    .setRequired(true);

  // 9. 備考
  form.addParagraphTextItem()
    .setTitle('備考・ご質問')
    .setHelpText('ご質問やお伝えしたいことがあればご記入ください')
    .setRequired(false);

  // ログにURL表示
  Logger.log('=== フォーム作成完了 ===');
  Logger.log('編集URL: ' + form.getEditUrl());
  Logger.log('回答URL: ' + form.getPublishedUrl());
  Logger.log('========================');
  Logger.log('回答URLをホームページの予約ボタンに設定してください');
}
