/**
 * メッセージ/メール管理操作サンプル
 * 
 * このサンプルでは以下を実演します:
 * - メッセージ一覧取得
 * - 新しいメッセージの送信
 * - メッセージの詳細取得
 * - メッセージを既読にする
 * - メッセージの削除
 * - 検索とフィルタリング
 * 
 * 実行方法: npm run example:messages
 */

import { GroupSessionClient, type SendMessageRequest } from '@groupsession/client';

async function messagingExample() {
  console.log('=== メッセージ/メール管理操作サンプル ===\n');

  // クライアント初期化とログイン
  const client = new GroupSessionClient({
    baseUrl: 'http://localhost:8080/gsession',
    timeout: 30000
  });

  console.log('1. ログイン中...');
  const loginResult = await client.login({
    userId: 'admin',
    password: 'admin'
  });

  if (!loginResult.success) {
    console.log('✗ ログインに失敗しました:', loginResult.message);
    return;
  }
  console.log('✓ ログイン成功\n');

  // 2. 既存のメッセージ一覧取得
  console.log('2. 既存のメッセージ一覧取得中...');
  const existingMessages = await client.getMessages({
    page: 1,
    pageSize: 5
  });

  if (existingMessages.success && existingMessages.data) {
    console.log(`✓ 既存メッセージ: ${existingMessages.totalCount}件中 ${existingMessages.data.length}件表示:`);
    existingMessages.data.forEach((message, index) => {
      console.log(`  ${index + 1}. ${message.subject}`);
      console.log(`     差出人: ${message.from}`);
      console.log(`     宛先: [${message.to.join(', ')}]`);
      if (message.cc && message.cc.length > 0) {
        console.log(`     CC: [${message.cc.join(', ')}]`);
      }
      console.log(`     送信日時: ${message.sentAt}`);
      console.log(`     既読: ${message.read ? 'はい' : 'いいえ'}`);
      console.log(`     本文: ${message.body.substring(0, 50)}...`);
      console.log('');
    });
  } else {
    console.log('✗ 既存メッセージ取得失敗:', existingMessages.error);
  }
  console.log('');

  // 3. 新しいメッセージ送信
  console.log('3. 新しいメッセージを送信中...');
  
  const newMessage: SendMessageRequest = {
    subject: 'API テストメッセージ',
    body: `こんにちは！

これはGroupSession Client APIのテスト用に送信されたメッセージです。

テスト内容:
- 基本的なメッセージ送信
- CC機能のテスト
- 日本語文字列の正しい送信

送信日時: ${new Date().toISOString()}

このメッセージは自動テストで生成されました。`,
    to: ['admin'],
    cc: ['user1', 'user2'],
    bcc: ['user3']
  };

  const sendResult = await client.sendMessage(newMessage);
  let sentMessageId: string | undefined;

  if (sendResult.success && sendResult.data) {
    sentMessageId = sendResult.data.messageId;
    console.log('✓ メッセージ送信成功:');
    console.log(`  ID: ${sendResult.data.messageId}`);
    console.log(`  件名: ${sendResult.data.subject}`);
    console.log(`  差出人: ${sendResult.data.from}`);
    console.log(`  宛先: [${sendResult.data.to.join(', ')}]`);
    if (sendResult.data.cc && sendResult.data.cc.length > 0) {
      console.log(`  CC: [${sendResult.data.cc.join(', ')}]`);
    }
    if (sendResult.data.bcc && sendResult.data.bcc.length > 0) {
      console.log(`  BCC: [${sendResult.data.bcc.join(', ')}]`);
    }
    console.log(`  送信日時: ${sendResult.data.sentAt}`);
    console.log(`  既読: ${sendResult.data.read ? 'はい' : 'いいえ'}\n`);
  } else {
    console.log('✗ メッセージ送信失敗:', sendResult.error, '\n');
  }

  // 4. 送信したメッセージの詳細取得
  if (sentMessageId) {
    console.log('4. 送信したメッセージの詳細取得中...');
    const messageDetail = await client.getMessage(sentMessageId);
    
    if (messageDetail.success && messageDetail.data) {
      console.log('✓ メッセージ詳細取得成功:');
      console.log(`  ID: ${messageDetail.data.messageId}`);
      console.log(`  件名: ${messageDetail.data.subject}`);
      console.log(`  差出人: ${messageDetail.data.from}`);
      console.log(`  宛先: [${messageDetail.data.to.join(', ')}]`);
      console.log(`  送信日時: ${messageDetail.data.sentAt}`);
      console.log(`  既読: ${messageDetail.data.read ? 'はい' : 'いいえ'}`);
      console.log(`  本文:\n${messageDetail.data.body}\n`);
    } else {
      console.log('✗ メッセージ詳細取得失敗:', messageDetail.error, '\n');
    }
  }

  // 5. メッセージ検索
  console.log('5. メッセージ検索中（"API"で検索）...');
  const searchResult = await client.getMessages({
    query: 'API',
    page: 1,
    pageSize: 10
  });

  if (searchResult.success && searchResult.data) {
    console.log(`✓ 検索結果: ${searchResult.data.length}件`);
    searchResult.data.forEach((message, index) => {
      console.log(`  ${index + 1}. ${message.subject}`);
      console.log(`     差出人: ${message.from}`);
      console.log(`     送信日時: ${message.sentAt}`);
      console.log(`     既読: ${message.read ? 'はい' : 'いいえ'}`);
      console.log('');
    });
  } else {
    console.log('✗ メッセージ検索失敗:', searchResult.error, '\n');
  }

  // 6. 未読メッセージのフィルタリング
  console.log('6. 未読メッセージ取得中...');
  const allMessages = await client.getMessages({ pageSize: 50 }); // 大きなページサイズで取得
  
  if (allMessages.success && allMessages.data) {
    const unreadMessages = allMessages.data.filter(message => !message.read);
    console.log(`✓ 未読メッセージ: ${unreadMessages.length}件`);
    unreadMessages.slice(0, 3).forEach((message, index) => {
      console.log(`  ${index + 1}. ${message.subject}`);
      console.log(`     差出人: ${message.from}`);
      console.log(`     送信日時: ${message.sentAt}`);
    });
    if (unreadMessages.length > 3) {
      console.log(`  ... 他 ${unreadMessages.length - 3}件`);
    }
    console.log('');
  } else {
    console.log('✗ 全メッセージ取得失敗:', allMessages.error, '\n');
  }

  // 7. メッセージを既読にする
  if (sentMessageId) {
    console.log('7. メッセージを既読にする...');
    const markReadResult = await client.markMessageAsRead(sentMessageId);
    
    if (markReadResult.success) {
      console.log('✓ メッセージを既読にしました');
      
      // 既読確認
      const updatedMessage = await client.getMessage(sentMessageId);
      if (updatedMessage.success && updatedMessage.data) {
        console.log(`  既読ステータス: ${updatedMessage.data.read ? '既読' : '未読'}\n`);
      }
    } else {
      console.log('✗ 既読マーク失敗:', markReadResult.error, '\n');
    }
  }

  // 8. 最新メッセージの表示
  console.log('8. 最新メッセージ取得中...');
  const latestMessages = await client.getMessages({
    page: 1,
    pageSize: 3,
    sortBy: 'sentAt',
    sortOrder: 'desc'
  });

  if (latestMessages.success && latestMessages.data) {
    console.log('✓ 最新メッセージ（3件）:');
    latestMessages.data.forEach((message, index) => {
      console.log(`  ${index + 1}. ${message.subject}`);
      console.log(`     差出人: ${message.from}`);
      console.log(`     送信日時: ${message.sentAt}`);
      console.log(`     既読: ${message.read ? 'はい' : 'いいえ'}`);
      console.log('');
    });
  } else {
    console.log('✗ 最新メッセージ取得失敗:', latestMessages.error, '\n');
  }

  // 9. メッセージの削除
  if (sentMessageId) {
    console.log('9. 送信したメッセージを削除中...');
    const deleteResult = await client.deleteMessage(sentMessageId);
    
    if (deleteResult.success) {
      console.log('✓ メッセージ削除成功');
      console.log(`  削除されたメッセージID: ${sentMessageId}\n`);
      
      // 削除確認
      console.log('削除確認中...');
      const checkResult = await client.getMessage(sentMessageId);
      if (!checkResult.success) {
        console.log('✓ メッセージが正常に削除されました\n');
      } else {
        console.log('⚠ メッセージがまだ存在している可能性があります\n');
      }
    } else {
      console.log('✗ メッセージ削除失敗:', deleteResult.error, '\n');
    }
  }

  // ログアウト
  console.log('10. ログアウト中...');
  await client.logout();
  console.log('✓ ログアウト完了\n');

  console.log('=== メッセージ/メール管理操作サンプル完了 ===');
}

// サンプル実行
messagingExample().catch(error => {
  console.error('サンプル実行中にエラーが発生しました:', error);
  process.exit(1);
});