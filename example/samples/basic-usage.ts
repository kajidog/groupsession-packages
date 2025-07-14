/**
 * 基本的な使用方法サンプル
 * 
 * このサンプルでは以下を実演します:
 * - GroupSessionClientの初期化
 * - ログイン・ログアウト
 * - 認証状態の確認
 * - セッション管理
 * 
 * 実行方法: npm run example:basic
 */

import { GroupSessionClient } from '@groupsession/client';

async function basicUsageExample() {
  console.log('=== GroupSession Client 基本使用方法 ===\n');

  // 1. クライアントの初期化
  console.log('1. クライアント初期化中...');
  const client = new GroupSessionClient({
    baseUrl: 'http://localhost:8080/gsession',
    timeout: 30000,
    headers: {
      'User-Agent': 'GroupSession-Example/1.0'
    }
  });
  console.log('✓ クライアント初期化完了\n');

  // 2. ログイン
  console.log('2. ログイン試行中...');
  const loginResult = await client.login({
    userId: 'admin',
    password: 'admin'
  });

  if (loginResult.success) {
    console.log('✓ ログイン成功');
    console.log(`  セッションID: ${client.getSessionId()}\n`);
  } else {
    console.log('✗ ログイン失敗');
    console.log(`  エラー: ${loginResult.message}\n`);
    return;
  }

  // 3. 認証状態の確認
  console.log('3. 認証状態確認中...');
  if (client.isAuthenticated()) {
    console.log('✓ 認証済み状態です\n');
  } else {
    console.log('✗ 未認証状態です\n');
    return;
  }

  // 4. 現在のユーザー情報を取得
  console.log('4. 現在のユーザー情報取得中...');
  const currentUser = await client.getCurrentUser();
  
  if (currentUser.success && currentUser.data) {
    console.log('✓ ユーザー情報取得成功');
    console.log(`  ユーザーID: ${currentUser.data.userId}`);
    console.log(`  ユーザー名: ${currentUser.data.userName}`);
    console.log(`  メール: ${currentUser.data.email || 'N/A'}`);
    console.log(`  部署: ${currentUser.data.department || 'N/A'}\n`);
  } else {
    console.log('✗ ユーザー情報取得失敗');
    console.log(`  エラー: ${currentUser.error}\n`);
  }

  // 5. セッション管理の例
  console.log('5. セッション管理例...');
  const sessionId = client.getSessionId();
  console.log(`  現在のセッションID: ${sessionId}`);
  
  // セッションを一時的にクリア
  client.clearSession();
  console.log('  セッションをクリアしました');
  console.log(`  認証状態: ${client.isAuthenticated() ? '認証済み' : '未認証'}`);
  
  // セッションを復元
  if (sessionId) {
    client.setSessionId(sessionId);
    console.log('  セッションを復元しました');
    console.log(`  認証状態: ${client.isAuthenticated() ? '認証済み' : '未認証'}\n`);
  }

  // 6. ログアウト
  console.log('6. ログアウト中...');
  const logoutResult = await client.logout();
  
  if (logoutResult.success) {
    console.log('✓ ログアウト成功');
    console.log(`  認証状態: ${client.isAuthenticated() ? '認証済み' : '未認証'}\n`);
  } else {
    console.log('✗ ログアウト失敗');
    console.log(`  エラー: ${logoutResult.error}\n`);
  }

  console.log('=== 基本使用方法サンプル完了 ===');
}

// サンプル実行
basicUsageExample().catch(error => {
  console.error('サンプル実行中にエラーが発生しました:', error);
  process.exit(1);
});