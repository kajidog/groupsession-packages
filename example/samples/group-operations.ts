/**
 * グループ管理操作サンプル
 * 
 * このサンプルでは以下を実演します:
 * - グループ一覧取得
 * - 特定グループの詳細取得
 * - グループメンバー取得
 * - グループ検索機能
 * - ページネーション処理
 * 
 * 実行方法: npm run example:groups
 */

import { GroupSessionClient } from '@groupsession/client';

async function groupOperationsExample() {
  console.log('=== グループ管理操作サンプル ===\n');

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

  // 2. グループ一覧取得
  console.log('2. グループ一覧取得中...');
  const groups = await client.getGroups({
    page: 1,
    pageSize: 10
  });

  if (groups.success && groups.data) {
    console.log(`✓ グループ一覧取得成功 (${groups.totalCount}件中 ${groups.data.length}件表示):`);
    groups.data.forEach((group, index) => {
      console.log(`  ${index + 1}. ${group.groupName} (${group.groupId})`);
      console.log(`     メンバー数: ${group.members.length}人`);
      console.log(`     アクティブ: ${group.active ? 'はい' : 'いいえ'}`);
      if (group.description) {
        console.log(`     説明: ${group.description}`);
      }
      console.log('');
    });
    console.log(`  ページ: ${groups.page}/${Math.ceil(groups.totalCount / groups.pageSize)}\n`);
  } else {
    console.log('✗ グループ一覧取得失敗:', groups.error, '\n');
  }

  // 3. グループ検索
  console.log('3. グループ検索中（"開発"で検索）...');
  const searchResult = await client.getGroups({
    query: '開発',
    page: 1,
    pageSize: 5
  });

  if (searchResult.success && searchResult.data) {
    console.log(`✓ 検索結果: ${searchResult.data.length}件`);
    searchResult.data.forEach((group, index) => {
      console.log(`  ${index + 1}. ${group.groupName} (${group.groupId})`);
      console.log(`     メンバー数: ${group.members.length}人`);
      if (group.description) {
        console.log(`     説明: ${group.description}`);
      }
    });
    console.log('');
  } else if (searchResult.success && searchResult.data?.length === 0) {
    console.log('✓ 検索結果: 該当するグループが見つかりませんでした\n');
  } else {
    console.log('✗ グループ検索失敗:', searchResult.error, '\n');
  }

  // 4. 特定グループの詳細取得
  if (groups.success && groups.data && groups.data.length > 0) {
    const targetGroupId = groups.data[0].groupId;
    console.log(`4. 特定グループ詳細取得中 (${targetGroupId})...`);
    
    const groupDetail = await client.getGroup(targetGroupId);
    
    if (groupDetail.success && groupDetail.data) {
      console.log('✓ グループ詳細取得成功:');
      console.log(`  ID: ${groupDetail.data.groupId}`);
      console.log(`  名前: ${groupDetail.data.groupName}`);
      console.log(`  説明: ${groupDetail.data.description || 'なし'}`);
      console.log(`  アクティブ: ${groupDetail.data.active ? 'はい' : 'いいえ'}`);
      console.log(`  メンバー数: ${groupDetail.data.members.length}人`);
      console.log(`  メンバーID一覧: [${groupDetail.data.members.join(', ')}]\n`);
    } else {
      console.log('✗ グループ詳細取得失敗:', groupDetail.error, '\n');
    }

    // 5. グループメンバー詳細取得
    console.log(`5. グループメンバー詳細取得中 (${targetGroupId})...`);
    const groupMembers = await client.getGroupMembers(targetGroupId);
    
    if (groupMembers.success && groupMembers.data) {
      console.log('✓ グループメンバー詳細取得成功:');
      console.log(`  メンバー数: ${groupMembers.data.length}人`);
      groupMembers.data.forEach((member, index) => {
        console.log(`  ${index + 1}. ${member.userName} (${member.userId})`);
        if (member.email) console.log(`     メール: ${member.email}`);
        if (member.department) console.log(`     部署: ${member.department}`);
        if (member.position) console.log(`     職位: ${member.position}`);
        console.log(`     アクティブ: ${member.active ? 'はい' : 'いいえ'}`);
        console.log('');
      });
    } else {
      console.log('✗ グループメンバー取得失敗:', groupMembers.error, '\n');
    }
  }

  // 6. ソート機能のデモ
  console.log('6. ソート機能デモ（名前順）...');
  const sortedGroups = await client.getGroups({
    page: 1,
    pageSize: 5,
    sortBy: 'groupName',
    sortOrder: 'asc'
  });

  if (sortedGroups.success && sortedGroups.data) {
    console.log('✓ ソート済みグループ一覧（名前昇順）:');
    sortedGroups.data.forEach((group, index) => {
      console.log(`  ${index + 1}. ${group.groupName} (${group.groupId})`);
    });
    console.log('');
  } else {
    console.log('✗ ソート済みグループ取得失敗:', sortedGroups.error, '\n');
  }

  // 7. アクティブなグループのみフィルタリング例
  console.log('7. アクティブグループ一覧...');
  const allGroups = await client.getGroups({ pageSize: 100 }); // 大きなページサイズで全件取得を試行
  
  if (allGroups.success && allGroups.data) {
    const activeGroups = allGroups.data.filter(group => group.active);
    console.log(`✓ アクティブグループ: ${activeGroups.length}件`);
    activeGroups.slice(0, 5).forEach((group, index) => { // 最初の5件のみ表示
      console.log(`  ${index + 1}. ${group.groupName} (メンバー: ${group.members.length}人)`);
    });
    if (activeGroups.length > 5) {
      console.log(`  ... 他 ${activeGroups.length - 5}件`);
    }
    console.log('');
  } else {
    console.log('✗ アクティブグループ取得失敗:', allGroups.error, '\n');
  }

  // ログアウト
  console.log('8. ログアウト中...');
  await client.logout();
  console.log('✓ ログアウト完了\n');

  console.log('=== グループ管理操作サンプル完了 ===');
}

// サンプル実行
groupOperationsExample().catch(error => {
  console.error('サンプル実行中にエラーが発生しました:', error);
  process.exit(1);
});