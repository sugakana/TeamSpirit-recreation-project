# .envファイルの作成手順

## 重要: .envファイルがまだ作成されていません

現在、`backend/.env`ファイルが存在しないため、データベース接続エラーが発生しています。

## 作成方法

### 方法1: env_template.txtからコピー（推奨）

1. `backend/env_template.txt` ファイルを開く
2. 内容をすべてコピー（Ctrl+A → Ctrl+C）
3. `backend` ディレクトリに `.env` という名前で新規ファイルを作成
   - Windowsの場合: エクスプローラーで `backend` フォルダを開き、右クリック → 新規作成 → テキストドキュメント
   - ファイル名を `.env` に変更（拡張子なし）
4. コピーした内容を貼り付け（Ctrl+V）
5. 保存（Ctrl+S）

### 方法2: 手動で作成

`backend` ディレクトリに `.env` という名前で新規ファイルを作成し、以下の内容を貼り付けてください：

```env
# MySQL接続設定
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Kanato0819#28
DB_NAME=teamspirit_db

# サーバー設定
PORT=3000
```

## 確認方法

`.env`ファイルを作成したら、**バックエンドサーバーを再起動**してください：

```bash
cd backend
npm start
```

サーバー起動時に、以下のようなログが表示されれば成功です：

```
環境変数の読み込み確認:
  DB_HOST: localhost
  DB_PORT: 3306
  DB_USER: root
  DB_PASSWORD: ***設定済み***  ← これが表示されればOK
  DB_NAME: teamspirit_db
MySQL接続成功
接続情報: { host: 'localhost', port: 3306, database: 'teamspirit_db', user: 'root' }
```

もし `DB_PASSWORD: ***未設定***` と表示される場合は、`.env`ファイルが正しく読み込まれていません。

## トラブルシューティング

### .envファイルが読み込まれない場合

1. ファイル名が正確に `.env` であることを確認（`.env.txt` ではない）
2. `backend` ディレクトリに配置されていることを確認
3. ファイルのエンコーディングがUTF-8であることを確認
4. バックエンドサーバーを再起動

## 次のステップ

`.env`ファイルを作成してサーバーを再起動したら、ブラウザで再度ログインを試してください。




