# TeamSpirit 勤怠管理システム

TeamSpiritの勤怠管理機能を再現したWebアプリケーションです。

## 📖 概要

このプロジェクトは、TeamSpiritの主要な勤怠管理機能を再現した学習・デモ用のWebアプリケーションです。

### 主な機能

- ✅ ログイン認証
- ✅ 勤怠打刻（出勤・退勤）
- ✅ 勤務表の表示・編集
- ✅ 月次勤怠サマリー
- ✅ 工数実績入力
- ✅ レポート機能

## 🛠️ 技術スタック

### フロントエンド
- Vue.js 3
- Vue Router
- Vite
- CSS3

### バックエンド
- Node.js
- Express.js
- MySQL2

### データベース
- MySQL 8.0

## 🚀 クイックスタート

詳細な手順は [QUICKSTART.md](QUICKSTART.md) を参照してください。

### 前提条件

- Node.js (v14以上)
- MySQL (v8.0以上)
- npm または yarn

### インストール

```bash
# 1. データベースのセットアップ
mysql -u root -p < docs/entities/mysql_table_design.sql

# 2. バックエンドのセットアップ
cd backend
npm install
cp env_template.txt .env
# .envファイルを編集してMySQLパスワードを設定

# 3. フロントエンドのセットアップ
cd ../frontend
npm install
```

### 起動

**ターミナル1 - バックエンド:**
```bash
cd backend
npm start
```

**ターミナル2 - フロントエンド:**
```bash
cd frontend
npm run dev
```

### アクセス

- フロントエンド: http://localhost:3002
- バックエンドAPI: http://localhost:3000

### ログイン

- **社員コード**: `000001`
- **パスワード**: `Password@1234`

## 📁 プロジェクト構造

```
TeamSpirit再現企画/
├── frontend/              # Vue.js フロントエンド
│   ├── src/
│   │   ├── views/        # ページコンポーネント
│   │   ├── components/   # 再利用可能なコンポーネント
│   │   ├── router/       # ルーティング設定
│   │   └── assets/       # 静的ファイル
│   ├── package.json
│   └── vite.config.js
│
├── backend/              # Node.js バックエンド
│   ├── config/          # 設定ファイル
│   ├── routes/          # APIルート
│   ├── server.js        # サーバーエントリーポイント
│   ├── package.json
│   └── .env             # 環境変数（要作成）
│
├── docs/                # ドキュメント
│   ├── entities/        # データベース設計
│   └── detailed-design/ # 詳細設計書
│
├── rules/               # 開発ルール・ガイドライン
│
└── README.md           # このファイル
```

## 📚 ドキュメント

- [クイックスタートガイド](QUICKSTART.md) - 5分でセットアップ
- [実装ガイド](README_IMPLEMENTATION.md) - 詳細な実装内容
- [バックエンドセットアップ](backend/README_SETUP.md) - バックエンドの詳細設定
- [トラブルシューティング](TROUBLESHOOTING.md) - よくある問題と解決方法

## 🎯 API エンドポイント

### 認証
- `POST /api/auth/login` - ログイン認証

### 勤怠
- `GET /api/attendance/monthly/:employeeId/:yearMonth` - 月次勤怠データ取得
- `POST /api/attendance/clock-in` - 出勤打刻
- `POST /api/attendance/clock-out` - 退勤打刻
- `PUT /api/attendance/:attendanceId` - 勤怠データ更新

詳細は [backend/README_SETUP.md](backend/README_SETUP.md) を参照してください。

## 🔧 開発

### 開発モード（自動リロード）

```bash
# バックエンド
cd backend
npm run dev

# フロントエンド
cd frontend
npm run dev
```

### コーディング規約

プロジェクトのコーディング規約は `rules/` ディレクトリを参照してください。

## ❗ トラブルシューティング

### よくある問題

#### バックエンドに接続できない

```bash
# エラー: ECONNREFUSED ::1:3001
# 解決: バックエンドサーバーを起動
cd backend
npm start
```

#### MySQLに接続できない

```bash
# エラー: MySQL接続エラー
# 解決: MySQLサーバーを起動
# Windowsの場合:
net start MySQL80

# Macの場合:
brew services start mysql
```

#### ポートが既に使用されている

```bash
# エラー: Port 3000 is already in use
# 解決: .envファイルでポート番号を変更
# backend/.env
PORT=3001
```

詳細は [TROUBLESHOOTING.md](TROUBLESHOOTING.md) を参照してください。

## 🧪 テスト

### テストアカウント

| 社員コード | パスワード | 氏名 | 役職 |
|-----------|-----------|------|------|
| 000001 | Password@1234 | 山田 太郎 | 一般社員 |
| 000002 | Password@1234 | 佐藤 花子 | マネージャー |
| 000003 | Password@1234 | 鈴木 次郎 | 一般社員 |

## 📝 ライセンス

このプロジェクトは学習・デモ目的で作成されています。

## 🤝 コントリビューション

このプロジェクトは学習目的のため、現在コントリビューションは受け付けていません。

## 📧 サポート

問題が発生した場合は、以下を確認してください：

1. [QUICKSTART.md](QUICKSTART.md) - セットアップ手順
2. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - トラブルシューティング
3. バックエンドのログを確認
4. ブラウザのコンソールを確認

## 🎓 参考資料

- [TeamSpirit操作マニュアル](OperationManual/)
- [就業規則・勤務規程](Internal%20regulations/)
- [機能一覧](feture_list/TeamSpirit機能一覧.md)

---

**開発開始日**: 2025年12月  
**最終更新**: 2025年12月6日

















