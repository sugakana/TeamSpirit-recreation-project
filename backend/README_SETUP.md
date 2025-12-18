# バックエンドセットアップガイド

## 前提条件

- Node.js（v14以上）
- MySQL（v8.0以上）
- npm または yarn

## セットアップ手順

### 1. 依存関係のインストール

```bash
cd backend
npm install
```

### 2. 環境変数ファイル（.env）の作成

`backend/.env`ファイルを作成して、以下の内容を設定してください：

```env
# MySQL接続設定
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=teamspirit_db

# サーバー設定
PORT=3000
```

**重要**: `DB_PASSWORD`を実際のMySQLパスワードに変更してください。

### 3. MySQLデータベースの準備

```bash
# MySQLに接続してデータベースとテーブルを作成
mysql -u root -p < docs/entities/mysql_table_design.sql
```

または、MySQLクライアントで直接実行：

```bash
mysql -u root -p
source docs/entities/mysql_table_design.sql
```

### 4. サーバー起動

```bash
cd backend
npm start
```

開発モード（自動リロード）で起動する場合：

```bash
npm run dev
```

### 5. 動作確認

バックエンドサーバーが正常に起動すると、コンソールに以下のメッセージが表示されます：

**成功時:**
```
環境変数の読み込み確認:
  DB_HOST: localhost
  DB_PORT: 3306
  DB_USER: root
  DB_PASSWORD: ***設定済み***
  DB_NAME: teamspirit_db
Server is running on port 3000
Health check: http://localhost:3000/api/health
MySQL接続成功
接続情報: { host: 'localhost', port: 3306, database: 'teamspirit_db', user: 'root' }
```

ブラウザで以下にアクセスして、サーバーが起動しているか確認：

- http://localhost:3000/api/health

正常な場合、以下のJSONが返されます：
```json
{"status":"OK","message":"Server is running"}
```

## API エンドポイント

### 認証API

#### POST /api/auth/login
ユーザー認証を行います。

**リクエスト:**
```json
{
  "employeeId": "000001",
  "password": "Password@1234"
}
```

**レスポンス（成功）:**
```json
{
  "success": true,
  "employeeId": "000001",
  "employeeName": "山田 太郎",
  "message": "ログインに成功しました。"
}
```

**レスポンス（失敗）:**
```json
{
  "success": false,
  "message": "社員コードまたはパスワードが違います。"
}
```

### 勤怠API

#### GET /api/attendance/monthly/:employeeId/:yearMonth
指定した従業員の月次勤怠データを取得します。

**パラメータ:**
- `employeeId`: 社員コード（例: 000001）
- `yearMonth`: 年月（例: 2025-12）

#### POST /api/attendance/clock-in
出勤打刻を記録します。

#### POST /api/attendance/clock-out
退勤打刻を記録します。

## トラブルシューティング

### よくあるエラーと対処法

#### エラー: `ECONNREFUSED`
- **原因**: MySQLサーバーが起動していない
- **対処**: MySQLサーバーを起動してください
  ```bash
  # Windowsの場合
  net start MySQL80
  
  # Macの場合
  brew services start mysql
  
  # Linuxの場合
  sudo systemctl start mysql
  ```

#### エラー: `ER_ACCESS_DENIED_ERROR`
- **原因**: ユーザー名またはパスワードが間違っている
- **対処**: `.env`ファイルの`DB_USER`と`DB_PASSWORD`を確認してください

#### エラー: `ER_BAD_DB_ERROR`
- **原因**: データベース`teamspirit_db`が存在しない
- **対処**: `mysql_table_design.sql`を実行してデータベースを作成してください

#### エラー: `password: '***未設定***'`
- **原因**: `.env`ファイルが存在しない、または`DB_PASSWORD`が設定されていない
- **対処**: `backend/.env`ファイルを作成して、MySQLパスワードを設定してください

#### エラー: `Port 3000 is already in use`
- **原因**: ポート3000が既に使用されている
- **対処**: `.env`ファイルで別のポート番号を指定してください
  ```env
  PORT=3001
  ```

### デバッグモード

詳細なログを表示する場合は、`NODE_ENV`を設定してください：

```bash
# Windows
set NODE_ENV=development
npm start

# Mac/Linux
NODE_ENV=development npm start
```

## セキュリティに関する注意事項

1. **本番環境では必ずパスワードをハッシュ化してください**
   - 現在の実装は開発用です
   - bcryptなどを使用してパスワードをハッシュ化することを推奨します

2. **環境変数ファイルをGitにコミットしないでください**
   - `.env`ファイルは`.gitignore`に含まれています
   - 機密情報が漏洩しないように注意してください

3. **CORS設定を適切に行ってください**
   - 本番環境では特定のオリジンのみを許可するように設定してください

## 次のステップ

バックエンドのセットアップが完了したら、フロントエンドのセットアップを行ってください。
詳細は`README_IMPLEMENTATION.md`を参照してください。




