# GroupSession Client サンプルアプリケーション

このディレクトリには、`@groupsession/client` パッケージの使用方法を示すサンプルコードが含まれています。

## 🚀 セットアップ

```bash
# ルートディレクトリから依存関係をインストール
npm install
```

## 📁 サンプル一覧

### 1. 基本的な使用方法 (`basic-usage.ts`)
**実行方法**: `npm run example:basic`

**内容**:
- GroupSessionClientの初期化
- ログイン・ログアウト
- 認証状態の確認
- セッション管理の基本操作

**学習できること**:
- クライアントライブラリの基本的な使い方
- 認証フローの実装方法
- セッション管理のベストプラクティス

---

### 2. ユーザー管理操作 (`user-management.ts`)
**実行方法**: `npm run example:users`

**内容**:
- 現在のユーザー情報取得
- ユーザー一覧取得（ページネーション付き）
- 特定ユーザーの詳細取得
- ユーザー検索機能
- ソート機能の使用例

**学習できること**:
- ユーザー関連APIの全般的な使用方法
- ページネーション処理の実装
- 検索・フィルタリング機能の実装

---

### 3. グループ管理操作 (`group-operations.ts`)
**実行方法**: `npm run example:groups`

**内容**:
- グループ一覧取得
- 特定グループの詳細取得
- グループメンバー取得
- グループ検索機能
- アクティブなグループのフィルタリング

**学習できること**:
- グループ関連APIの使用方法
- メンバー情報の取得と表示
- データフィルタリングの実装例

---

### 4. スケジュール管理操作 (`schedule-crud.ts`)
**実行方法**: `npm run example:schedules`

**内容**:
- スケジュール一覧取得
- 新しいスケジュールの作成
- スケジュールの更新
- スケジュールの削除
- 日付によるフィルタリング

**学習できること**:
- CRUD操作の完全な実装例
- 日付・時刻データの扱い方
- リソースのライフサイクル管理

---

### 5. メッセージ/メール管理 (`messaging.ts`)
**実行方法**: `npm run example:messages`

**内容**:
- メッセージ一覧取得
- 新しいメッセージの送信
- メッセージの詳細取得
- メッセージを既読にする
- メッセージの削除
- 未読メッセージのフィルタリング

**学習できること**:
- メッセージング機能の実装
- CC/BCC機能の使用方法
- 既読・未読状態の管理

---

### 6. エラーハンドリング (`error-handling.ts`)
**実行方法**: `npm run example:errors`

**内容**:
- ネットワークエラーのハンドリング
- 認証エラーのハンドリング
- APIエラーレスポンスの処理
- タイムアウトエラーの処理
- リトライ機能の実装例
- エラー種別の判定方法

**学習できること**:
- 堅牢なエラーハンドリングの実装
- リトライ機能の実装パターン
- エラー種別に応じた適切な処理

## 🛠️ 使用技術

- **TypeScript**: 型安全なコード記述
- **tsx**: TypeScriptファイルの直接実行
- **@groupsession/client**: GroupSession API クライアントライブラリ

## ⚡ 実行方法

各サンプルは個別に実行できます：

```bash
# 基本使用方法
npm run example:basic

# ユーザー管理
npm run example:users

# グループ操作
npm run example:groups

# スケジュール操作
npm run example:schedules

# メッセージング
npm run example:messages

# エラーハンドリング
npm run example:errors
```

## 📋 前提条件

- GroupSessionサーバーが `http://localhost:8080/gsession` で稼働していること
- デフォルトの管理者アカウント（admin/admin）でログイン可能であること

## 🔧 設定のカスタマイズ

各サンプルファイル内で以下の設定を変更できます：

```typescript
const client = new GroupSessionClient({
  baseUrl: 'http://localhost:8080/gsession',  // GroupSessionサーバーのURL
  timeout: 30000,                            // タイムアウト時間（ミリ秒）
  headers: {                                 // 追加のHTTPヘッダー
    'User-Agent': 'Your-App/1.0'
  }
});
```

## 🐛 トラブルシューティング

### サーバー接続エラー
```
✗ ログインに失敗しました: Network error occurred
```
**解決方法**: GroupSessionサーバーが起動していることを確認してください。

### 認証エラー
```
✗ ログインに失敗しました: Unauthorized
```
**解決方法**: ユーザーID・パスワードが正しいことを確認してください。

### タイムアウトエラー
```
✗ Request timeout
```
**解決方法**: `timeout` 設定を大きな値に変更するか、サーバーの応答速度を確認してください。

## 📚 関連ドキュメント

- [GroupSession Client APIドキュメント](../packages/group-session-client/README.md)
- [TypeScript型定義](../packages/group-session-client/src/types.ts)

## 💡 実装のベストプラクティス

1. **エラーハンドリング**: 常に `success` フィールドをチェックする
2. **認証管理**: セッションの有効性を定期的に確認する
3. **ページネーション**: 大量データは適切にページ分割して取得する
4. **タイムアウト設定**: ネットワーク環境に応じて適切な値を設定する
5. **型安全性**: TypeScriptの型定義を活用してバグを防止する

## 🤝 貢献

サンプルコードの改善や新しいサンプルの追加は歓迎します。プルリクエストを送信してください。