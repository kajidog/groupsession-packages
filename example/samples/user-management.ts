/**
 * ユーザー管理操作サンプル
 * 
 * このサンプルでは以下を実演します:
 * - 現在のユーザー情報取得
 * - ユーザー一覧取得（ページネーション付き）
 * - 特定ユーザーの詳細取得
 * - ユーザー検索機能
 * 
 * 実行方法: npm run example:users
 */

import { GroupSessionClient } from '@groupsession/client';

async function userManagementExample() {
  console.log('=== ユーザー管理操作サンプル ===\n');

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

  // 2. 現在のユーザー情報取得
  console.log('2. 現在のユーザー情報取得中...');
  const currentUser = await client.getCurrentUser();
  
  if (currentUser.success && currentUser.data) {
    console.log('✓ 現在のユーザー情報:');
    console.log(`  ID: ${currentUser.data.userId}`);
    console.log(`  名前: ${currentUser.data.userName}`);
    console.log(`  メール: ${currentUser.data.email || 'N/A'}`);
    console.log(`  職位: ${currentUser.data.position || 'N/A'}`);
    console.log(`  部署: ${currentUser.data.department || 'N/A'}`);
    console.log(`  アクティブ: ${currentUser.data.active ? 'はい' : 'いいえ'}`);
    console.log(`  最終ログイン: ${currentUser.data.lastLogin || 'N/A'}\n`);
  } else {
    console.log('✗ ユーザー情報取得失敗:', currentUser.error, '\n');
  }

  // 3. ユーザー一覧取得（基本）
  console.log('3. ユーザー一覧取得中（最初の10件）...');
  const users = await client.getUsers({
    page: 1,
    pageSize: 10
  });

  if (users.success && users.data) {
    console.log(`✓ ユーザー一覧取得成功 (${users.totalCount}件中 ${users.data.length}件表示):`);
    users.data.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.userName} (${user.userId}) - ${user.active ? 'アクティブ' : '無効'}`);
    });
    console.log(`  ページ: ${users.page}/${Math.ceil(users.totalCount / users.pageSize)}\n`);
  } else {
    console.log('✗ ユーザー一覧取得失敗:', users.error, '\n');
  }

  // 4. ユーザー検索（名前で検索）
  console.log('4. ユーザー検索中（"admin"で検索）...');
  const searchResult = await client.getUsers({
    query: 'admin',
    page: 1,
    pageSize: 5
  });

  if (searchResult.success && searchResult.data) {
    console.log(`✓ 検索結果: ${searchResult.data.length}件`);
    searchResult.data.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.userName} (${user.userId})`);
      if (user.email) console.log(`     メール: ${user.email}`);
      if (user.department) console.log(`     部署: ${user.department}`);
    });
    console.log('');
  } else {
    console.log('✗ ユーザー検索失敗:', searchResult.error, '\n');
  }

  // 5. 特定ユーザーの詳細取得
  if (users.success && users.data && users.data.length > 0) {
    const targetUserId = users.data[0].userId;
    console.log(`5. 特定ユーザー詳細取得中 (${targetUserId})...`);
    
    const userDetail = await client.getUser(targetUserId);
    
    if (userDetail.success && userDetail.data) {
      console.log('✓ ユーザー詳細取得成功:');
      console.log(`  ID: ${userDetail.data.userId}`);
      console.log(`  名前: ${userDetail.data.userName}`);
      console.log(`  メール: ${userDetail.data.email || 'N/A'}`);
      console.log(`  職位: ${userDetail.data.position || 'N/A'}`);
      console.log(`  部署: ${userDetail.data.department || 'N/A'}`);
      console.log(`  アクティブ: ${userDetail.data.active ? 'はい' : 'いいえ'}`);
      console.log(`  最終ログイン: ${userDetail.data.lastLogin || 'N/A'}\n`);
    } else {
      console.log('✗ ユーザー詳細取得失敗:', userDetail.error, '\n');
    }
  }

  // 6. ページネーション例（2ページ目を取得）
  console.log('6. ページネーション例（2ページ目取得）...');
  const page2Users = await client.getUsers({
    page: 2,
    pageSize: 5,
    sortBy: 'userName',
    sortOrder: 'asc'
  });

  if (page2Users.success && page2Users.data) {
    console.log(`✓ 2ページ目取得成功 (${page2Users.data.length}件):`);
    page2Users.data.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.userName} (${user.userId})`);
    });
    console.log(`  ページ情報: ${page2Users.page}/${Math.ceil(page2Users.totalCount / page2Users.pageSize)}\n`);
  } else if (page2Users.success && page2Users.data?.length === 0) {
    console.log('✓ 2ページ目にはデータがありません\n');
  } else {
    console.log('✗ 2ページ目取得失敗:', page2Users.error, '\n');
  }

  // ログアウト
  console.log('7. ログアウト中...');
  await client.logout();
  console.log('✓ ログアウト完了\n');

  console.log('=== ユーザー管理操作サンプル完了 ===');
}

// サンプル実行
userManagementExample().catch(error => {
  console.error('サンプル実行中にエラーが発生しました:', error);
  process.exit(1);
});