# TeamSpirit勤怠管理システム - バックエンドAPI

## 概要

TeamSpirit勤怠管理システムのバックエンドAPIサーバーです。Node.js + Express + MySQL2を使用して実装されています。

## 機能

### ホーム画面API

- **認証**
  - ログイン認証（社員コード + パスワード）
  
- **お知らせ**
  - お知らせ情報取得（最大4件）
  
- **勤怠打刻**
  - 出勤打刻
  - 定時出勤打刻（9:00）
  - 退勤打刻
  - 定時退勤打刻（17:30）
  - 中断・再開（休憩時間記録）
  - 勤務場所設定
  
- **マスタデータ**
  - 勤務場所マスタ取得
  - ジョブマスタ取得
  - 休暇種別マスタ取得

詳細は `backend/docs/API_SPECIFICATION.md` を参照してください。

## 技術スタック

- **Node.js**: v18以上推奨
- **Express**: 4.x
- **MySQL2**: 3.x（Promise API使用）
- **MySQL**: 8.0以上
- **dotenv**: 環境変数管理
- **cors**: CORS対応

## ディレクトリ構成

```
backend/
├── config/
│   └── database.js          # データベース接続設定
├── routes/
│   ├── auth.js              # 認証API
│   ├── attendance.js        # 勤怠記録API
│   ├── notifications.js     # お知らせAPI
│   └── master.js            # マスタデータAPI
├── docs/
│   └── API_SPECIFICATION.md # API仕様書
├── server.js                # サーバーエントリーポイント
├── package.json             # 依存関係定義
├── .env                     # 環境変数（要作成）
└── README.md                # このファイル
```

## セットアップ

### 1. 依存パッケージのインストール

```bash
cd backend
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成し、以下の内容を設定してください：

```env
# データベース接続設定
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=teamspirit_db

# サーバー設定
PORT=3000
NODE_ENV=development
```

**注意**: 
- `DB_PASSWORD`には実際のMySQLのrootパスワードを設定してください
- `.env`ファイルは`.gitignore`に含まれており、Gitにコミットされません

### 3. データベースのセットアップ

MySQLサーバーを起動し、以下のSQLスクリプトを実行してください：

```bash
mysql -u root -p < ../docs/entities/mysql_table_design.sql
```

このスクリプトは以下を実行します：
- データベース `teamspirit_db` の作成
- 必要なテーブルの作成
- サンプルデータの投入

### 4. サーバーの起動

```bash
npm start
```

サーバーが起動すると、以下のメッセージが表示されます：

```
環境変数の読み込み確認:
  DB_HOST: localhost
  DB_PORT: 3306
  DB_USER: root
  DB_PASSWORD: ***設定済み***
  DB_NAME: teamspirit_db
MySQL接続成功
接続情報: { host: 'localhost', port: 3306, database: 'teamspirit_db', user: 'root' }
Server is running on port 3000
Health check: http://localhost:3000/api/health
```

### 5. 動作確認

ブラウザまたはcurlでヘルスチェックエンドポイントにアクセス：

```bash
curl http://localhost:3000/api/health
```

レスポンス：
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## API エンドポイント

### 認証

- `POST /api/auth/login` - ログイン認証

### お知らせ

- `GET /api/notifications` - お知らせ情報取得

### 勤怠記録

- `GET /api/attendance/today` - 当日の勤怠情報取得
- `POST /api/attendance/clock-in` - 出勤打刻
- `POST /api/attendance/clock-in-scheduled` - 定時出勤打刻
- `POST /api/attendance/clock-out` - 退勤打刻（中断開始も兼ねる）
- `POST /api/attendance/clock-out-scheduled` - 定時退勤打刻
- `PUT /api/attendance/work-location` - 勤務場所設定

### マスタデータ

- `GET /api/master/work-locations` - 勤務場所マスタ取得
- `GET /api/master/jobs` - ジョブマスタ取得
- `GET /api/master/vacation-types` - 休暇種別マスタ取得

詳細は `backend/docs/API_SPECIFICATION.md` を参照してください。

## テストユーザー

サンプルデータとして以下のユーザーが登録されています：

| 社員コード | パスワード | 従業員名 | 部署 |
|-----------|-----------|---------|------|
| 000001 | Password@1234 | 山田 太郎 | 開発部 |
| 000002 | Password@1234 | 佐藤 花子 | 開発部 |
| 000003 | Password@1234 | 鈴木 次郎 | 営業部 |

## 開発

### デバッグモード

環境変数 `NODE_ENV=development` を設定すると、詳細なエラーメッセージが表示されます。

### ログ

- データベース接続エラーは詳細情報とともにコンソールに出力されます
- API呼び出しエラーは `console.error()` で出力されます

### トランザクション管理

打刻処理などの重要な操作はトランザクションで保護されています：

```javascript
const connection = await db.getConnection();
try {
  await connection.beginTransaction();
  // ... 処理 ...
  await connection.commit();
} catch (error) {
  await connection.rollback();
  // ... エラー処理 ...
} finally {
  connection.release();
}
```

## トラブルシューティング

### データベース接続エラー

**エラー**: `ECONNREFUSED`

**原因**: MySQLサーバーが起動していない

**解決方法**: MySQLサーバーを起動してください
```bash
# Windows
net start MySQL80

# macOS/Linux
sudo systemctl start mysql
```

---

**エラー**: `ER_ACCESS_DENIED_ERROR`

**原因**: データベースのユーザー名またはパスワードが間違っている

**解決方法**: `.env`ファイルの `DB_USER` と `DB_PASSWORD` を確認してください

---

**エラー**: `ER_BAD_DB_ERROR`

**原因**: データベース `teamspirit_db` が存在しない

**解決方法**: `mysql_table_design.sql` を実行してください
```bash
mysql -u root -p < ../docs/entities/mysql_table_design.sql
```

### ポート競合エラー

**エラー**: `EADDRINUSE`

**原因**: ポート3000が既に使用されている

**解決方法**: `.env`ファイルで別のポートを指定してください
```env
PORT=3001
```

## セキュリティ

### 本番環境での注意事項

1. **パスワードのハッシュ化**
   - 現在はパスワードを平文で保存していますが、本番環境では必ずハッシュ化してください
   - bcryptなどのライブラリを使用することを推奨します

2. **環境変数の管理**
   - `.env`ファイルは絶対にGitにコミットしないでください
   - 本番環境では環境変数を安全に管理してください

3. **CORS設定**
   - 現在は全てのオリジンを許可していますが、本番環境では特定のオリジンのみを許可してください
   ```javascript
   app.use(cors({
     origin: 'https://your-frontend-domain.com'
   }));
   ```

4. **SQLインジェクション対策**
   - 全てのクエリでパラメータ化クエリを使用しています
   - 直接SQL文字列を連結しないでください

## ライセンス

本プロジェクトは社内プロジェクトです。

## 変更履歴

| 日付 | 変更内容 | 変更者 |
|------|----------|--------|
| 2025-12-08 | 初版作成 | AI Assistant |













