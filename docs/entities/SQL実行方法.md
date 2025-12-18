# SQLファイル実行方法ガイド

## 概要

このドキュメントでは、TeamSpirit勤怠管理システムのSQLファイルの実行方法を説明します。

## SQLファイル一覧

| ファイル名 | 用途 | 実行タイミング |
|-----------|------|--------------|
| `mysql_table_design.sql` | **全体のデータベースとテーブルを作成**（初期セットアップ用） | 初回セットアップ時、データベースを完全に再作成する場合 |
| `create_application_history_table.sql` | **APPLICATION_HISTORYテーブルのみ作成** | 既存のデータベースにテーブルを追加する場合 |
| `add_original_clock_time_columns.sql` | ORIGINAL_CLOCK_IN_TIME/OUT_TIMEカラムを追加 | 既存テーブルにカラムを追加する場合 |
| `insert_october_attendance_sample.sql` | 10月のサンプルデータを投入 | テストデータを追加する場合 |
| `delete_october_attendance_sample.sql` | 10月のサンプルデータを削除 | テストデータを削除する場合 |

## 現在の状況に応じた実行方法

### ケース1: APPLICATION_HISTORYテーブルが存在しない（現在のエラー）

**推奨方法**: `create_application_history_table.sql`を実行

#### 方法A: MySQLコマンドラインから実行（推奨）

```bash
# プロジェクトのルートディレクトリで実行
cd "c:\TeamSpirit\CodeCommit\TeamSpirit再現企画"

# MySQLに接続してSQLファイルを実行
mysql -u root -p teamspirit_db < docs\entities\create_application_history_table.sql
```

パスワードを入力すると、テーブルが作成されます。

#### 方法B: MySQLクライアントで直接実行

1. MySQLコマンドラインまたはMySQL Workbenchに接続
2. データベースを選択:
   ```sql
   USE teamspirit_db;
   ```
3. SQLファイルの内容をコピー＆ペーストして実行

または、MySQL Workbenchの場合:
- File → Open SQL Script → `create_application_history_table.sql`を選択
- 実行ボタン（⚡）をクリック

#### 方法C: MySQL Workbenchで実行

1. MySQL Workbenchを起動
2. 接続を開く（localhost:3306など）
3. メニュー: **File → Open SQL Script**
4. `docs\entities\create_application_history_table.sql`を選択
5. 実行ボタン（⚡）をクリック、または **Ctrl+Shift+Enter**（Windows）/ **Cmd+Shift+Enter**（Mac）

### ケース2: データベースを完全に再作成したい場合

**注意**: この方法は**既存のデータをすべて削除**します。

```bash
# MySQLに接続して全体のSQLスクリプトを実行
mysql -u root -p < docs\entities\mysql_table_design.sql
```

または、MySQL Workbenchで:
1. File → Open SQL Script → `mysql_table_design.sql`を選択
2. 実行ボタンをクリック

## 実行前の確認事項

### 1. MySQLサーバーが起動しているか確認

```bash
# Windowsの場合（サービス確認）
sc query MySQL80

# または、MySQLに接続を試みる
mysql -u root -p
```

### 2. データベース接続情報の確認

`backend\.env`ファイルまたは`backend\env_template.txt`を確認:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=teamspirit_db
```

### 3. 実行権限の確認

- `root`ユーザーで実行する場合: 通常は問題なし
- 他のユーザーの場合: `CREATE TABLE`権限が必要

## 実行後の確認

### APPLICATION_HISTORYテーブルが作成されたか確認

```sql
USE teamspirit_db;

-- テーブル一覧を確認
SHOW TABLES LIKE 'APPLICATION_HISTORY';

-- テーブル構造を確認
DESCRIBE APPLICATION_HISTORY;

-- または
SHOW CREATE TABLE APPLICATION_HISTORY;
```

### エラーが解消されたか確認

バックエンドサーバーを再起動して、エラーが発生しないか確認:

```bash
cd backend
npm start
```

## トラブルシューティング

### エラー: "Access denied for user"

**原因**: ユーザーに権限がない

**解決方法**:
```sql
-- rootユーザーで実行するか、権限を付与
GRANT ALL PRIVILEGES ON teamspirit_db.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### エラー: "Table 'teamspirit_db.application_history' doesn't exist"

**原因**: テーブルがまだ作成されていない

**解決方法**: `create_application_history_table.sql`を実行

### エラー: "Table 'application_history' already exists"

**原因**: テーブルが既に存在する

**解決方法**: 
- テーブルを削除して再作成:
  ```sql
  DROP TABLE IF EXISTS APPLICATION_HISTORY;
  ```
  その後、`create_application_history_table.sql`を実行

### エラー: "Can't connect to MySQL server"

**原因**: MySQLサーバーが起動していない

**解決方法**:
- Windows: サービスからMySQLを起動
- または、MySQLサーバーを手動で起動

## 各SQLファイルの詳細

### mysql_table_design.sql

**用途**: データベース全体の初期セットアップ

**内容**:
- データベースの作成（DROP DATABASE IF EXISTS）
- 全テーブルの作成（13テーブル + ビュー）
- マスタデータの投入
- サンプルデータの投入

**実行時間**: 約10-30秒（データ量による）

**注意**: 既存のデータベースを削除して再作成します

### create_application_history_table.sql

**用途**: APPLICATION_HISTORYテーブルのみを作成

**内容**:
- APPLICATION_HISTORYテーブルの作成
- インデックスの作成
- 外部キー制約の設定

**実行時間**: 約1秒

**注意**: 既存のデータベースに追加するだけなので、既存データは保持されます

## 推奨実行順序

### 初回セットアップ時

1. `mysql_table_design.sql`を実行（全体のデータベースを作成）
2. バックエンドサーバーを起動して動作確認

### 既存データベースにテーブルを追加する場合

1. `create_application_history_table.sql`を実行
2. テーブルが作成されたか確認
3. バックエンドサーバーを再起動して動作確認

## 参考資料

- [README_MySQL.md](README_MySQL.md) - MySQLテーブル設計の詳細
- [entity-list.md](entity-list.md) - エンティティ一覧
- [er-diagram.md](er-diagram.md) - ER図
