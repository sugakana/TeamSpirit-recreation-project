# トラブルシューティングガイド

## 問題: 「サーバーエラーが発生しました。」が表示される

### 確認事項

#### 1. バックエンドサーバーが起動しているか確認

```bash
# バックエンドディレクトリに移動
cd backend

# サーバーを起動
npm start
```

**正常な起動時のログ:**
```
MySQL接続成功
接続情報: { host: 'localhost', port: 3306, database: 'teamspirit_db', user: 'root' }
Server is running on port 3000
Health check: http://localhost:3000/api/health
```

**エラー時のログ例:**
```
MySQL接続エラー: Error: connect ECONNREFUSED 127.0.0.1:3306
エラー詳細: { code: 'ECONNREFUSED', errno: -4078, ... }
接続設定: { host: 'localhost', port: 3306, database: 'teamspirit_db', user: 'root', password: '***未設定***' }
```

#### 2. .envファイルの確認

`backend/.env`ファイルが存在し、正しく設定されているか確認：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password  # ← 実際のMySQLパスワードに変更
DB_NAME=teamspirit_db
PORT=3000
```

#### 3. MySQLサーバーの起動確認

```bash
# Windowsの場合
net start MySQL80

# または MySQLサービスが起動しているか確認
sc query MySQL80
```

#### 4. データベースの存在確認

```bash
# MySQLに接続
mysql -u root -p

# データベース一覧を確認
SHOW DATABASES;

# teamspirit_dbが存在するか確認
# 存在しない場合は、以下を実行
# source docs/entities/mysql_table_design.sql
```

#### 5. バックエンドサーバーのログ確認

ログインを試行した際に、バックエンドサーバーのコンソールに以下のようなエラーログが表示されます：

```
ログイン処理エラー: Error: ...
エラー詳細: {
  message: '...',
  code: 'ECONNREFUSED',  // または 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR' など
  errno: ...,
  sqlState: ...,
  sqlMessage: ...
}
```

### よくあるエラーと対処法

#### エラー: `ECONNREFUSED`
- **原因**: MySQLサーバーが起動していない
- **対処**: MySQLサーバーを起動してください

#### エラー: `ER_ACCESS_DENIED_ERROR`
- **原因**: ユーザー名またはパスワードが間違っている
- **対処**: `.env`ファイルの`DB_USER`と`DB_PASSWORD`を確認してください

#### エラー: `ER_BAD_DB_ERROR`
- **原因**: データベース`teamspirit_db`が存在しない
- **対処**: `mysql_table_design.sql`を実行してデータベースを作成してください

#### エラー: `password: '***未設定***'`
- **原因**: `.env`ファイルが存在しない、または`DB_PASSWORD`が設定されていない
- **対処**: `backend/.env`ファイルを作成して、MySQLパスワードを設定してください

### デバッグ手順

1. **バックエンドサーバーを再起動**
   ```bash
   cd backend
   npm start
   ```

2. **ブラウザでヘルスチェック**
   - http://localhost:3000/api/health
   - 正常な場合: `{"status":"OK","message":"Server is running"}`

3. **ログインを試行**
   - ブラウザで http://localhost:3000 にアクセス
- 社員コード: `000001`、パスワード: `yamada` でログインを試行
   - バックエンドサーバーのコンソールログを確認

4. **エラーメッセージの確認**
   - ブラウザのコンソール（F12）でエラーを確認
   - バックエンドサーバーのコンソールでエラーログを確認

### 修正後の確認

エラーハンドリングを改善した後は、以下のような詳細なエラーメッセージが表示されるはずです：

- `データベース接続エラー: MySQLサーバーに接続できません。MySQLサーバーが起動しているか確認してください。`
- `データベース接続エラー: ユーザー名またはパスワードが間違っています。.envファイルの設定を確認してください。`
- `データベース接続エラー: データベース「teamspirit_db」が存在しません。mysql_table_design.sqlを実行してください。`

これらのメッセージが表示されない場合は、バックエンドサーバーを再起動してください。

