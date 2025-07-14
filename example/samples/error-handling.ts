/**
 * エラーハンドリングパターンサンプル
 * 
 * このサンプルでは以下を実演します:
 * - ネットワークエラーのハンドリング
 * - 認証エラーのハンドリング
 * - APIエラーレスポンスの処理
 * - タイムアウトエラーの処理
 * - リトライ機能の実装例
 * - エラー種別の判定方法
 * 
 * 実行方法: npm run example:errors
 */

import { GroupSessionClient } from '@groupsession/client';

async function errorHandlingExample() {
  console.log('=== エラーハンドリングパターンサンプル ===\n');

  // 1. 基本的なエラーハンドリング
  console.log('1. 基本的なエラーハンドリングの例\n');

  // 正常なクライアント
  const validClient = new GroupSessionClient({
    baseUrl: 'http://localhost:8080/gsession',
    timeout: 30000
  });

  // 1-1. 認証エラーのハンドリング
  console.log('1-1. 認証エラーのハンドリング（無効な認証情報）');
  const invalidLogin = await validClient.login({
    userId: 'invalid_user',
    password: 'wrong_password'
  });

  if (!invalidLogin.success) {
    console.log('✓ 認証エラーが正しく処理されました');
    console.log(`   エラーメッセージ: ${invalidLogin.message}`);
  } else {
    console.log('⚠ 予期しない成功レスポンス');
  }
  console.log('');

  // 1-2. 未認証状態でのAPI呼び出し
  console.log('1-2. 未認証状態でのAPI呼び出し');
  const unauthenticatedCall = await validClient.getCurrentUser();
  
  if (!unauthenticatedCall.success) {
    console.log('✓ 未認証エラーが正しく処理されました');
    console.log(`   エラーメッセージ: ${unauthenticatedCall.error}`);
    console.log(`   認証状態: ${validClient.isAuthenticated() ? '認証済み' : '未認証'}`);
  } else {
    console.log('⚠ 予期しない成功レスポンス（認証チェックが機能していない可能性）');
  }
  console.log('');

  // 2. ネットワークエラーのハンドリング
  console.log('2. ネットワークエラーのハンドリング\n');

  // 2-1. 無効なURL
  console.log('2-1. 無効なURLでのエラーハンドリング');
  const invalidUrlClient = new GroupSessionClient({
    baseUrl: 'http://invalid-host:9999/gsession',
    timeout: 5000 // 短いタイムアウトで素早くテスト
  });

  const networkError = await invalidUrlClient.login({
    userId: 'admin',
    password: 'admin'
  });

  if (!networkError.success) {
    console.log('✓ ネットワークエラーが正しく処理されました');
    console.log(`   エラーメッセージ: ${networkError.message}`);
  } else {
    console.log('⚠ 予期しない成功レスポンス');
  }
  console.log('');

  // 2-2. タイムアウトエラー
  console.log('2-2. タイムアウトエラーのテスト');
  const shortTimeoutClient = new GroupSessionClient({
    baseUrl: 'http://localhost:8080/gsession',
    timeout: 1 // 非常に短いタイムアウト
  });

  const timeoutError = await shortTimeoutClient.login({
    userId: 'admin',
    password: 'admin'
  });

  if (!timeoutError.success) {
    console.log('✓ タイムアウトエラーが処理されました');
    console.log(`   エラーメッセージ: ${timeoutError.message}`);
  } else {
    console.log('✓ リクエストが予想より早く完了しました（サーバーが非常に高速）');
  }
  console.log('');

  // 3. 正常ログイン後のエラーハンドリング
  console.log('3. 正常ログイン後のエラーハンドリング\n');

  console.log('3-1. 正常ログイン実行中...');
  const normalLogin = await validClient.login({
    userId: 'admin',
    password: 'admin'
  });

  if (normalLogin.success) {
    console.log('✓ 正常ログイン成功\n');

    // 3-2. 存在しないリソースの取得
    console.log('3-2. 存在しないユーザーの取得');
    const nonExistentUser = await validClient.getUser('non_existent_user_12345');
    
    if (!nonExistentUser.success) {
      console.log('✓ 存在しないリソースエラーが正しく処理されました');
      console.log(`   エラーメッセージ: ${nonExistentUser.error}`);
    } else {
      console.log('⚠ 予期しない成功レスポンス（存在しないはずのユーザーが取得された）');
    }
    console.log('');

    // 3-3. 存在しないスケジュールの削除
    console.log('3-3. 存在しないスケジュールの削除');
    const deleteNonExistent = await validClient.deleteSchedule('non_existent_schedule_12345');
    
    if (!deleteNonExistent.success) {
      console.log('✓ 存在しないリソース削除エラーが正しく処理されました');
      console.log(`   エラーメッセージ: ${deleteNonExistent.error}`);
    } else {
      console.log('⚠ 予期しない成功レスポンス（存在しないスケジュールの削除が成功）');
    }
    console.log('');

    // 3-4. 無効なデータでのスケジュール作成
    console.log('3-4. 無効なデータでのスケジュール作成');
    const invalidSchedule = await validClient.createSchedule({
      title: '', // 空のタイトル
      startDate: 'invalid-date', // 無効な日付形式
      endDate: 'invalid-date'
    });
    
    if (!invalidSchedule.success) {
      console.log('✓ バリデーションエラーが正しく処理されました');
      console.log(`   エラーメッセージ: ${invalidSchedule.error}`);
    } else {
      console.log('⚠ 予期しない成功レスポンス（無効なデータでスケジュール作成が成功）');
    }
    console.log('');

  } else {
    console.log('✗ 正常ログインに失敗:', normalLogin.message);
    console.log('以降のテストをスキップします\n');
  }

  // 4. リトライ機能の実装例
  console.log('4. リトライ機能の実装例\n');

  async function retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`   試行 ${attempt}/${maxRetries}...`);
        const result = await requestFn();
        
        // 成功判定（APIレスポンスの場合）
        if (typeof result === 'object' && result !== null && 'success' in result) {
          if ((result as any).success) {
            console.log(`   ✓ 試行 ${attempt} で成功`);
            return result;
          }
          lastError = (result as any).error || 'API呼び出し失敗';
        } else {
          return result;
        }
      } catch (error) {
        lastError = error;
        console.log(`   ✗ 試行 ${attempt} で失敗:`, error instanceof Error ? error.message : String(error));
      }
      
      if (attempt < maxRetries) {
        console.log(`   ${delayMs}ms 待機中...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    throw new Error(`${maxRetries}回の試行後も失敗: ${lastError}`);
  }

  // リトライ機能のテスト（不安定な接続をシミュレート）
  console.log('4-1. リトライ機能テスト（存在しないリソースで必ず失敗）');
  try {
    await retryRequest(
      () => validClient.getUser('definitely_non_existent_user'),
      3,
      500
    );
  } catch (error) {
    console.log('✓ リトライ後もエラーが正しく処理されました');
    console.log(`   最終エラー: ${error instanceof Error ? error.message : String(error)}`);
  }
  console.log('');

  // 5. エラー種別の判定例
  console.log('5. エラー種別の判定例\n');

  function categorizeError(error: string | undefined): string {
    if (!error) return '不明なエラー';
    
    const errorLower = error.toLowerCase();
    
    if (errorLower.includes('network') || errorLower.includes('connection')) {
      return 'ネットワークエラー';
    } else if (errorLower.includes('timeout')) {
      return 'タイムアウトエラー';
    } else if (errorLower.includes('unauthorized') || errorLower.includes('401')) {
      return '認証エラー';
    } else if (errorLower.includes('forbidden') || errorLower.includes('403')) {
      return '権限エラー';
    } else if (errorLower.includes('not found') || errorLower.includes('404')) {
      return 'リソース未発見エラー';
    } else if (errorLower.includes('validation') || errorLower.includes('invalid')) {
      return 'バリデーションエラー';
    } else {
      return 'サーバーエラー';
    }
  }

  // エラー種別判定のテスト
  const testErrors = [
    'Network error occurred',
    'Request timeout',
    'Unauthorized access',
    'User not found',
    'Invalid date format',
    'Internal server error'
  ];

  console.log('5-1. エラー種別判定テスト:');
  testErrors.forEach((error, index) => {
    const category = categorizeError(error);
    console.log(`   ${index + 1}. "${error}" → ${category}`);
  });
  console.log('');

  // ログアウト
  if (validClient.isAuthenticated()) {
    console.log('6. ログアウト中...');
    await validClient.logout();
    console.log('✓ ログアウト完了\n');
  }

  console.log('=== エラーハンドリングパターンサンプル完了 ===');
  console.log('\n💡 実装のポイント:');
  console.log('  - 常に success フィールドをチェックする');
  console.log('  - エラーメッセージを適切にユーザーに表示する');
  console.log('  - ネットワークエラーは再試行を検討する');
  console.log('  - 認証エラーは再ログインを促す');
  console.log('  - タイムアウト値を適切に設定する');
}

// サンプル実行
errorHandlingExample().catch(error => {
  console.error('サンプル実行中にエラーが発生しました:', error);
  process.exit(1);
});