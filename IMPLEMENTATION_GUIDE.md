# 勤務表画面 実装ガイド

## 実装完了内容

### 1. データベースサンプルデータ

`docs/entities/mysql_table_design.sql`にサンプルデータを追加しました：

- **社員マスタ**
  - 社員コード: 000001
  - 社員名: 須賀 哉斗
  - 部署: 310 TechE
  - メール: suga.kanato@example.com
  - パスワード: Password@1234

- **勤務場所マスタ**
  - 通勤、在宅、直行直帰、出張

- **2024年12月の勤怠記録**
  - 12/5: 出社8:50、退社18:00、承認済み（APPROVED）
  - 休憩時間: 12:00-13:00
  - 工数実績: 開発作業6時間、設計作業2時間
  - その他の日: 未申請状態

### 2. バックエンドAPI

既存のAPIが完全に実装されていることを確認し、以下を追加：

- `backend/routes/auth.js`
  - `GET /api/auth/employee/:employeeId` - 従業員情報取得API（新規追加）

- `backend/routes/attendance.js`（既存、完全実装済み）
  - `GET /api/attendance/monthly` - 月間勤務表取得
  - `GET /api/attendance/daily` - 日次勤怠記録取得
  - `PUT /api/attendance/record` - 勤怠記録更新
  - `POST /api/attendance/daily-confirmation` - 日次確定申請
  - `GET /api/attendance/monthly-summary` - 月次サマリー取得
  - その他多数のAPI

### 3. フロントエンド実装

- **APIサービス**: `frontend/src/services/api.js`
  - 全APIエンドポイントの呼び出し関数を実装
  - エラーハンドリング付き

- **勤務表画面**: `frontend/src/views/TimesheetScreen.vue`
  - API連携実装（サンプルデータから実APIへ移行）
  - ローディング表示
  - エラーハンドリングと再読み込み機能
  - 従業員情報の動的表示（社員名、部署）
  - 月次サマリーの動的表示
  - 日次確定申請機能

## セットアップ手順

### 1. データベースのセットアップ

```bash
# MySQLにログイン
mysql -u root -p

# データベースとテーブルを作成
source docs/entities/mysql_table_design.sql
```

### 2. バックエンドの起動

```bash
cd backend

# 環境変数の設定（.envファイルを作成）
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=teamspirit_db
# PORT=3000

# 依存関係のインストール（初回のみ）
npm install

# サーバー起動
npm start
```

### 3. フロントエンドの起動

```bash
cd frontend

# 環境変数の設定（.envファイルを作成）
# VITE_API_BASE_URL=http://localhost:3000/api

# 依存関係のインストール（初回のみ）
npm install

# 開発サーバー起動
npm run dev
```

## 動作確認手順

### 1. ログイン

1. ブラウザで`http://localhost:5173`にアクセス
2. ログイン画面で以下の情報を入力：
   - 社員コード: `000001`
   - パスワード: `Password@1234`

### 2. 勤務表画面の確認

1. ログイン後、メニューから「勤務表」を選択
2. 以下の項目を確認：

   **ヘッダー部分：**
   - 社員名が「須賀 哉斗」と表示されること
   - 部署が「310 TechE」と表示されること

   **勤務表テーブル：**
   - 2024年12月のカレンダーが表示されること
   - 12/5に出社8:50、退社18:00のデータが表示されること
   - 12/5の承認ステータスが「承認済み」（青い✓）になっていること
   - 12/5の工数が「8.0」と表示されること
   - 他の日は未申請状態（+マーク）であること
   - 祝日が土曜日と同じ配色（背景: 薄い青、文字: 青）で表示されること
   - 日曜日が赤色の背景と文字で表示されること

   **月次サマリー：**
   - 所定出勤日数、実出勤日数が表示されること
   - 所定労働時間、総労働時間が表示されること
   - 過不足時間が表示されること

### 3. 機能テスト

#### 年月切り替え
- 年月選択ドロップダウンで別の月を選択
- 前月/今月/次月リンクをクリック
- データが切り替わることを確認

#### 日次確定申請
- 未申請の日（+マーク）をクリック
- 確認ダイアログが表示されること
- ただし、出社・退社時刻が未入力の場合はエラーメッセージが表示されること

#### ローディング表示
- 年月を切り替えた際にローディングスピナーが表示されること
- データ取得後にローディングが消えること

#### エラーハンドリング
- バックエンドを停止した状態で年月を切り替え
- エラーメッセージと「再読み込み」ボタンが表示されること

## APIエンドポイント一覧

### 認証関連
- `POST /api/auth/login` - ログイン
- `GET /api/auth/employee/:employeeId` - 従業員情報取得

### 勤怠関連
- `GET /api/attendance/monthly` - 月間勤務表取得
- `GET /api/attendance/daily` - 日次勤怠記録取得
- `PUT /api/attendance/record` - 勤怠記録更新
- `POST /api/attendance/daily-confirmation` - 日次確定申請
- `GET /api/attendance/monthly-summary` - 月次サマリー取得
- `POST /api/attendance/clock-in` - 出勤打刻
- `POST /api/attendance/clock-out` - 退勤打刻
- `GET /api/attendance/work-hours` - 工数実績取得
- `POST /api/attendance/work-hours` - 工数実績登録

### マスタ関連
- `GET /api/master/work-locations` - 勤務場所マスタ取得

## トラブルシューティング

### データベース接続エラー

```
Error: connect ECONNREFUSED
```

**解決策:**
1. MySQLサーバーが起動しているか確認
2. `.env`ファイルのDB設定を確認
3. データベース`teamspirit_db`が作成されているか確認

### API呼び出しエラー

```
Failed to fetch
```

**解決策:**
1. バックエンドサーバーが起動しているか確認（http://localhost:3000）
2. CORSエラーの場合、`backend/server.js`のCORS設定を確認
3. フロントエンドの`.env`ファイルで`VITE_API_BASE_URL`が正しく設定されているか確認

### ローディングが終わらない

**解決策:**
1. ブラウザの開発者ツールでネットワークタブを確認
2. APIレスポンスのステータスコードとエラーメッセージを確認
3. バックエンドのコンソールログを確認

## 今後の実装課題

以下の機能はプレースホルダーとして実装されており、今後の実装が必要です：

1. **勤怠情報入力画面**
   - 出社・退社時刻の編集画面
   - 休憩時間・公用外出の入力

2. **工数実績入力画面**
   - ジョブコード選択
   - 工数時間入力

3. **備考入力ダイアログ**
   - 備考の表示・編集
   - 承認状態による編集可否制御

4. **勤務グラフツールチップ**
   - マウスホバー時の詳細情報表示

5. **休暇申請機能**
   - 休暇申請済み日の表示（オレンジ色の行）
   - 休暇情報画面

6. **承認ワークフロー**
   - 承認申請画面
   - 承認履歴画面
   - ステータス画面

## 参照ドキュメント

- 詳細設計書: `docs/detailed-design/ui/attendance-table-screen.md`
- データベース設計: `docs/entities/mysql_table_design.sql`
- ER図: `docs/entities/er-diagram.md`













