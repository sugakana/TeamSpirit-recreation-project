# TeamSpirit 勤怠管理システム - クイックスタートガイド

## 📋 必要なもの

- Node.js (v14以上)
- MySQL (v8.0以上)
- npm または yarn

## 🚀 5分でセットアップ

### ステップ1: データベースのセットアップ

```bash
# MySQLに接続してデータベースとテーブルを作成
mysql -u root -p < docs/entities/mysql_table_design.sql
```

### ステップ2: バックエンドのセットアップ

```bash
# バックエンドディレクトリに移動
cd backend

# 依存関係をインストール
npm install

# .envファイルを作成（env_template.txtをコピー）
# Windowsの場合:
copy env_template.txt .env

# Mac/Linuxの場合:
cp env_template.txt .env

# .envファイルを編集してMySQLパスワードを設定
# DB_PASSWORD=your_password ← 実際のパスワードに変更
```

### ステップ3: フロントエンドのセットアップ

```bash
# フロントエンドディレクトリに移動
cd ../frontend

# 依存関係をインストール
npm install
```

## ▶️ 起動方法

### 2つのターミナルを開いて、それぞれで以下を実行：

**ターミナル1 - バックエンド:**
```bash
cd backend
npm start
```

✅ 成功すると以下のメッセージが表示されます：
```
Server is running on port 3000
MySQL接続成功
```

**ターミナル2 - フロントエンド:**
```bash
cd frontend
npm run dev
```

✅ 成功すると以下のメッセージが表示されます：
```
➜  Local:   http://localhost:3002/
```

## 🌐 アクセス

ブラウザで以下にアクセス：
- **フロントエンド**: http://localhost:3002
- **バックエンドAPI**: http://localhost:3000/api/health

## 🔐 ログイン情報

テストアカウント：
- **社員コード**: `000001`
- **パスワード**: `Password@1234`

その他のアカウント：
- `000002` / `Password@1234` (佐藤 花子)
- `000003` / `Password@1234` (鈴木 次郎)

## 🎯 システム構成

```
┌─────────────────────────────────────────────┐
│  フロントエンド (Vue.js)                      │
│  http://localhost:3002                      │
│  - ログイン画面                               │
│  - ホーム画面（勤怠打刻）                      │
│  - 勤務表                                    │
└─────────────────┬───────────────────────────┘
                  │ /api/* (プロキシ)
                  ↓
┌─────────────────────────────────────────────┐
│  バックエンド (Node.js + Express)            │
│  http://localhost:3000                      │
│  - 認証API                                   │
│  - 勤怠API                                   │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│  データベース (MySQL)                         │
│  teamspirit_db                              │
│  - EMPLOYEE (従業員)                         │
│  - ATTENDANCE (勤怠記録)                     │
└─────────────────────────────────────────────┘
```

## ❗ よくあるエラーと解決方法

### エラー: `ECONNREFUSED ::1:3001`

**原因**: バックエンドサーバーが起動していない

**解決方法**:
```bash
# 別のターミナルでバックエンドを起動
cd backend
npm start
```

### エラー: `MySQL接続エラー`

**原因**: MySQLサーバーが起動していない、または接続情報が間違っている

**解決方法**:
```bash
# MySQLサーバーを起動
# Windowsの場合:
net start MySQL80

# Macの場合:
brew services start mysql

# .envファイルのDB_PASSWORDを確認
```

### エラー: `Port 3000 is already in use`

**原因**: ポート3000が既に使用されている

**解決方法**:
```bash
# backend/.envファイルでポート番号を変更
PORT=3001

# frontend/vite.config.jsのプロキシ設定も変更
proxy: {
  '/api': {
    target: 'http://localhost:3001',  // 変更したポート番号
    changeOrigin: true
  }
}
```

## 📚 詳細ドキュメント

- **バックエンド詳細**: `backend/README_SETUP.md`
- **実装ガイド**: `README_IMPLEMENTATION.md`
- **トラブルシューティング**: `TROUBLESHOOTING.md`

## 🔧 開発モード

自動リロード機能を使用する場合：

```bash
# バックエンド（nodemon使用）
cd backend
npm run dev

# フロントエンド（Vite使用）
cd frontend
npm run dev
```

## 📝 次のステップ

1. ログイン画面でテストアカウントを使用してログイン
2. ホーム画面で勤怠打刻を試す
3. 勤務表画面で月次データを確認
4. APIドキュメントを確認（`backend/README_SETUP.md`）

## 🆘 サポート

問題が解決しない場合は、以下を確認してください：

1. Node.jsのバージョン: `node --version`
2. MySQLのバージョン: `mysql --version`
3. バックエンドのログを確認
4. フロントエンドのブラウザコンソールを確認

---

**Happy Coding! 🎉**















