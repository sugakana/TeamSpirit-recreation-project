# TeamSpirit ログイン画面 実装ガイド

## プロジェクト構成

```
.
├── frontend/          # Vue.js フロントエンド
│   ├── src/
│   │   ├── views/
│   │   │   ├── LoginScreen.vue    # ログイン画面
│   │   │   └── HomeView.vue       # ホーム画面（認証成功後）
│   │   ├── router/
│   │   │   └── index.js           # ルーティング設定
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── vite.config.js
│
└── backend/           # Node.js バックエンド
    ├── config/
    │   └── database.js            # MySQL接続設定
    ├── routes/
    │   └── auth.js                # 認証API
    ├── server.js                   # Expressサーバー
    └── package.json
```

## セットアップ手順

### 1. MySQLデータベースの準備

```bash
# MySQLに接続してデータベースとテーブルを作成
mysql -u root -p < docs/entities/mysql_table_design.sql
```

### 2. バックエンドのセットアップ

```bash
cd backend

# 依存関係のインストール
npm install

# 環境変数ファイルの作成
# backend/.env ファイルを作成して以下の内容を設定
```

`backend/.env`ファイルの内容：
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=teamspirit_db
PORT=3000
```

**重要**: `DB_PASSWORD`を実際のMySQLパスワードに変更してください。

```bash
# サーバー起動
npm start
# または開発モード（自動リロード）
npm run dev
```

### 3. フロントエンドのセットアップ

```bash
cd frontend

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

**注意**: フロントエンドはポート3002で起動します（バックエンドの3000と競合しないため）。

## 使用方法

### 1. サーバー起動

**重要**: バックエンドとフロントエンドは別々のターミナルで起動する必要があります。

**ターミナル1（バックエンド）:**
```bash
cd backend
npm start
```

バックエンドサーバーが起動すると、以下のメッセージが表示されます：
```
Server is running on port 3000
Health check: http://localhost:3000/api/health
MySQL接続成功
```

**ターミナル2（フロントエンド）:**
```bash
cd frontend
npm run dev
```

フロントエンドサーバーが起動すると、以下のメッセージが表示されます：
```
VITE v5.4.21  ready in 840 ms

➜  Local:   http://localhost:3002/
➜  Network: use --host to expose
```

### 2. ブラウザでアクセス

- **フロントエンド**: http://localhost:3002
- **バックエンドAPI**: http://localhost:3000
- **ヘルスチェック**: http://localhost:3000/api/health

### 3. ログイン

サンプルログイン情報：
- **社員コード**: 000001
- **パスワード**: Password@1234

その他のテストアカウント：
- 000002 / Password@1234（佐藤 花子）
- 000003 / Password@1234（鈴木 次郎）

**注意**: 初期データベースのセットアップ時に、すべてのユーザーのパスワードが`Password@1234`に設定されています。

## API仕様

### POST /api/auth/login

**リクエスト:**
```json
{
  "employeeId": "000001",
  "password": "yamada"
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

## 実装内容

### フロントエンド（Vue.js）

- **LoginScreen.vue**: ログイン画面コンポーネント
  - 社員コードとパスワードの入力欄
  - 入力チェック（必須チェック）
  - エラーメッセージ表示
  - API呼び出しとレスポンス処理
  - 認証成功時のホーム画面への遷移

- **ルーティング**: Vue Routerを使用
  - `/`: ログイン画面
  - `/home`: ホーム画面（認証成功後）

### バックエンド（Node.js + Express + MySQL）

- **認証API**: `/api/auth/login`
  - パラメータ化クエリでSQLインジェクション対策
  - EMPLOYEEテーブルから認証情報を取得
  - IS_ACTIVE=TRUEの従業員のみログイン可能
  - 認証失敗時のエラーメッセージ返却

- **データベース接続**: MySQL2のコネクションプールを使用

## セキュリティ対策

1. **SQLインジェクション対策**: パラメータ化クエリ（プレースホルダー）を使用
2. **CORS設定**: Expressのcorsミドルウェアで適切な設定
3. **入力検証**: フロントエンドとバックエンドの両方で入力チェック

## トラブルシューティング

### エラー: `http proxy error: /api/auth/login` `ECONNREFUSED`

**原因**: バックエンドサーバーが起動していない、またはポート番号が間違っている

**対処法**:
1. バックエンドサーバーが起動しているか確認
   ```bash
   # 別のターミナルで
   cd backend
   npm start
   ```
2. ポート3000でバックエンドが起動しているか確認
   - ブラウザで http://localhost:3000/api/health にアクセス
3. フロントエンドの`vite.config.js`のプロキシ設定を確認
   ```javascript
   proxy: {
     '/api': {
       target: 'http://localhost:3000',  // バックエンドのポート
       changeOrigin: true
     }
   }
   ```

### MySQL接続エラー

**エラー**: `MySQL接続エラー: ECONNREFUSED`

**対処法**:
1. MySQLサーバーが起動しているか確認
   ```bash
   # Windowsの場合
   net start MySQL80
   
   # Macの場合
   brew services start mysql
   ```
2. `.env`ファイルの接続情報を確認
3. データベース`teamspirit_db`が作成されているか確認
   ```bash
   mysql -u root -p
   SHOW DATABASES;
   ```

### ポートが既に使用されている

**エラー**: `Port 3000 is already in use`

**対処法**:
- バックエンド: `.env`ファイルの`PORT`を変更（例: 3001）
- フロントエンド: `vite.config.js`の`server.port`を変更（例: 3003）
  - **注意**: フロントエンドのポートを変更した場合、プロキシ設定も確認してください

### ログインできない

**症状**: 「社員コードまたはパスワードが違います」と表示される

**対処法**:
1. 正しい認証情報を使用しているか確認
   - 社員コード: `000001`
   - パスワード: `Password@1234`
2. データベースにユーザーデータが登録されているか確認
   ```bash
   mysql -u root -p teamspirit_db
   SELECT EMPLOYEE_ID, EMPLOYEE_NAME, IS_ACTIVE FROM EMPLOYEE;
   ```
3. `IS_ACTIVE`が`TRUE`になっているか確認

### フロントエンドが表示されない

**エラー**: `ERR_CONNECTION_REFUSED`

**対処法**:
1. フロントエンドサーバーが起動しているか確認
2. 正しいURLにアクセスしているか確認（http://localhost:3002）
3. ブラウザのキャッシュをクリア（Ctrl+Shift+R または Cmd+Shift+R）

## 次のステップ

- セッション管理の実装
- JWT認証の導入
- パスワードのハッシュ化
- ログアウト機能の実装

