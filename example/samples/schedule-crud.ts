/**
 * スケジュール管理操作サンプル（CRUD）
 * 
 * このサンプルでは以下を実演します:
 * - スケジュール一覧取得
 * - 新しいスケジュールの作成
 * - スケジュールの更新
 * - スケジュールの削除
 * - 検索とフィルタリング
 * 
 * 実行方法: npm run example:schedules
 */

import { GroupSessionClient, type CreateScheduleRequest } from '@groupsession/client';

async function scheduleCrudExample() {
  console.log('=== スケジュール管理操作サンプル（CRUD） ===\n');

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

  // 2. 既存のスケジュール一覧取得
  console.log('2. 既存のスケジュール一覧取得中...');
  const existingSchedules = await client.getSchedules({
    page: 1,
    pageSize: 5
  });

  if (existingSchedules.success && existingSchedules.data) {
    console.log(`✓ 既存スケジュール: ${existingSchedules.totalCount}件中 ${existingSchedules.data.length}件表示:`);
    existingSchedules.data.forEach((schedule, index) => {
      console.log(`  ${index + 1}. ${schedule.title}`);
      console.log(`     期間: ${schedule.startDate} ～ ${schedule.endDate}`);
      console.log(`     場所: ${schedule.location || 'なし'}`);
      console.log(`     参加者: ${schedule.attendees.length}人`);
      console.log(`     作成者: ${schedule.createdBy}`);
      console.log('');
    });
  } else {
    console.log('✗ 既存スケジュール取得失敗:', existingSchedules.error);
  }
  console.log('');

  // 3. 新しいスケジュール作成
  console.log('3. 新しいスケジュール作成中...');
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  
  const endTime = new Date(tomorrow);
  endTime.setHours(11, 30, 0, 0);

  const newScheduleData: CreateScheduleRequest = {
    title: 'サンプル会議 - API テスト',
    description: 'GroupSession Client APIのテスト用に作成されたサンプル会議です。',
    startDate: tomorrow.toISOString(),
    endDate: endTime.toISOString(),
    location: '会議室A',
    attendees: ['admin', 'user1', 'user2']
  };

  const createResult = await client.createSchedule(newScheduleData);
  let createdScheduleId: string | undefined;

  if (createResult.success && createResult.data) {
    createdScheduleId = createResult.data.scheduleId;
    console.log('✓ スケジュール作成成功:');
    console.log(`  ID: ${createResult.data.scheduleId}`);
    console.log(`  タイトル: ${createResult.data.title}`);
    console.log(`  開始: ${createResult.data.startDate}`);
    console.log(`  終了: ${createResult.data.endDate}`);
    console.log(`  場所: ${createResult.data.location}`);
    console.log(`  参加者: [${createResult.data.attendees.join(', ')}]`);
    console.log(`  作成日時: ${createResult.data.createdAt}\n`);
  } else {
    console.log('✗ スケジュール作成失敗:', createResult.error, '\n');
  }

  // 4. 作成したスケジュールの詳細取得
  if (createdScheduleId) {
    console.log('4. 作成したスケジュールの詳細取得中...');
    const scheduleDetail = await client.getSchedule(createdScheduleId);
    
    if (scheduleDetail.success && scheduleDetail.data) {
      console.log('✓ スケジュール詳細取得成功:');
      console.log(`  ID: ${scheduleDetail.data.scheduleId}`);
      console.log(`  タイトル: ${scheduleDetail.data.title}`);
      console.log(`  説明: ${scheduleDetail.data.description || 'なし'}`);
      console.log(`  開始: ${scheduleDetail.data.startDate}`);
      console.log(`  終了: ${scheduleDetail.data.endDate}`);
      console.log(`  場所: ${scheduleDetail.data.location || 'なし'}`);
      console.log(`  参加者: [${scheduleDetail.data.attendees.join(', ')}]`);
      console.log(`  作成者: ${scheduleDetail.data.createdBy}`);
      console.log(`  更新日時: ${scheduleDetail.data.updatedAt}\n`);
    } else {
      console.log('✗ スケジュール詳細取得失敗:', scheduleDetail.error, '\n');
    }
  }

  // 5. スケジュールの更新
  if (createdScheduleId) {
    console.log('5. スケジュール更新中...');
    const updateResult = await client.updateSchedule({
      scheduleId: createdScheduleId,
      title: 'サンプル会議 - API テスト（更新済み）',
      description: 'このスケジュールは更新テストで変更されました。',
      location: '会議室B（変更）',
      attendees: ['admin', 'user1', 'user2', 'user3'] // 参加者を追加
    });
    
    if (updateResult.success && updateResult.data) {
      console.log('✓ スケジュール更新成功:');
      console.log(`  ID: ${updateResult.data.scheduleId}`);
      console.log(`  新しいタイトル: ${updateResult.data.title}`);
      console.log(`  新しい説明: ${updateResult.data.description}`);
      console.log(`  新しい場所: ${updateResult.data.location}`);
      console.log(`  参加者: [${updateResult.data.attendees.join(', ')}]`);
      console.log(`  更新日時: ${updateResult.data.updatedAt}\n`);
    } else {
      console.log('✗ スケジュール更新失敗:', updateResult.error, '\n');
    }
  }

  // 6. スケジュール検索
  console.log('6. スケジュール検索中（"API"で検索）...');
  const searchResult = await client.getSchedules({
    query: 'API',
    page: 1,
    pageSize: 10
  });

  if (searchResult.success && searchResult.data) {
    console.log(`✓ 検索結果: ${searchResult.data.length}件`);
    searchResult.data.forEach((schedule, index) => {
      console.log(`  ${index + 1}. ${schedule.title}`);
      console.log(`     期間: ${schedule.startDate} ～ ${schedule.endDate}`);
      if (schedule.description) {
        console.log(`     説明: ${schedule.description.substring(0, 50)}...`);
      }
    });
    console.log('');
  } else {
    console.log('✗ スケジュール検索失敗:', searchResult.error, '\n');
  }

  // 7. 今後のスケジュール取得（日付フィルタリングの例）
  console.log('7. 今後のスケジュール取得中...');
  const futureSchedules = await client.getSchedules({
    page: 1,
    pageSize: 10,
    sortBy: 'startDate',
    sortOrder: 'asc'
  });

  if (futureSchedules.success && futureSchedules.data) {
    const now = new Date();
    const upcoming = futureSchedules.data.filter(schedule => 
      new Date(schedule.startDate) > now
    );
    
    console.log(`✓ 今後のスケジュール: ${upcoming.length}件`);
    upcoming.slice(0, 5).forEach((schedule, index) => {
      console.log(`  ${index + 1}. ${schedule.title}`);
      console.log(`     開始: ${schedule.startDate}`);
      console.log(`     場所: ${schedule.location || 'なし'}`);
    });
    if (upcoming.length > 5) {
      console.log(`  ... 他 ${upcoming.length - 5}件`);
    }
    console.log('');
  } else {
    console.log('✗ 今後のスケジュール取得失敗:', futureSchedules.error, '\n');
  }

  // 8. スケジュールの削除
  if (createdScheduleId) {
    console.log('8. 作成したスケジュールを削除中...');
    const deleteResult = await client.deleteSchedule(createdScheduleId);
    
    if (deleteResult.success) {
      console.log('✓ スケジュール削除成功');
      console.log(`  削除されたスケジュールID: ${createdScheduleId}\n`);
      
      // 削除確認
      console.log('削除確認中...');
      const checkResult = await client.getSchedule(createdScheduleId);
      if (!checkResult.success) {
        console.log('✓ スケジュールが正常に削除されました\n');
      } else {
        console.log('⚠ スケジュールがまだ存在している可能性があります\n');
      }
    } else {
      console.log('✗ スケジュール削除失敗:', deleteResult.error, '\n');
    }
  }

  // ログアウト
  console.log('9. ログアウト中...');
  await client.logout();
  console.log('✓ ログアウト完了\n');

  console.log('=== スケジュール管理操作サンプル完了 ===');
}

// サンプル実行
scheduleCrudExample().catch(error => {
  console.error('サンプル実行中にエラーが発生しました:', error);
  process.exit(1);
});