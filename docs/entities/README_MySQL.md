# TeamSpirit勤怠管理システム - MySQLテーブル設計

## 概要

このドキュメントは、TeamSpirit勤怠管理システムのMySQLデータベース設計についての説明です。

## ファイル構成

```
.
├── mysql_table_design.sql          # テーブル作成・初期データ投入SQLスクリプト
├── docs/
│   └── entities/
│       ├── entity-list.md          # エンティティ一覧
│       └── er-diagram.md           # ER図（Mermaid形式）
└── README_MySQL.md                 # このファイル
```

## MySQLワークベンチでの使用方法

### 1. データベースの作成と初期化

1. MySQLワークベンチを起動します
2. MySQL接続を開きます（localhost:3306など）
3. `mysql_table_design.sql`ファイルを開きます
   - メニューバー: File → Open SQL Script
   - または Ctrl+Shift+O（Windows）/ Cmd+Shift+O（Mac）
4. スクリプト全体を実行します
   - メニューバー: Query → Execute (All or Selection)
   - またはツールバーの⚡アイコンをクリック
   - ショートカットキー: Ctrl+Shift+Enter（Windows）/ Cmd+Shift+Enter（Mac）

### 2. 実行確認

スクリプト実行後、以下を確認してください：

1. データベース`teamspirit_db`が作成されていること
2. 13個のテーブルが作成されていること
3. 初期データが投入されていること

確認用クエリ：

```sql
-- データベースの確認
SHOW DATABASES LIKE 'teamspirit_db';

-- テーブル一覧の確認
USE teamspirit_db;
SHOW TABLES;

-- テーブルのレコード数確認
SELECT 'EMPLOYEE' AS TABLE_NAME, COUNT(*) AS ROW_COUNT FROM EMPLOYEE
UNION ALL
SELECT 'WORK_LOCATION', COUNT(*) FROM WORK_LOCATION
UNION ALL
SELECT 'JOB_MASTER', COUNT(*) FROM JOB_MASTER
UNION ALL
SELECT 'VACATION_TYPE', COUNT(*) FROM VACATION_TYPE;
```

## テーブル構成

### マスタテーブル（5テーブル）

| No | テーブル名 | 英名 | 説明 |
|----|-----------|------|------|
| 1 | 従業員マスタ | EMPLOYEE | 従業員の基本情報 |
| 2 | 勤務場所マスタ | WORK_LOCATION | 勤務場所（通勤、在宅など） |
| 3 | ジョブマスタ | JOB_MASTER | プロジェクト・タスク情報 |
| 4 | 休暇種別マスタ | VACATION_TYPE | 休暇種別（有給、夏季など） |
| 5 | お知らせマスタ | NOTIFICATION | システムお知らせ情報 |

### トランザクションテーブル（8テーブル）

| No | テーブル名 | 英名 | 説明 |
|----|-----------|------|------|
| 6 | 勤怠記録 | ATTENDANCE_RECORD | 日次の出退勤記録 |
| 7 | 休憩時間 | BREAK_TIME | 複数の休憩時間帯 |
| 8 | 公用外出 | OFFICIAL_OUTING | 公用外出の記録 |
| 9 | 工数実績 | WORK_HOURS | ジョブに対する工数入力 |
| 10 | 休暇残日数 | VACATION_BALANCE | 休暇の残日数管理 |
| 11 | 休暇取得履歴 | VACATION_HISTORY | 休暇取得の履歴 |
| 12 | 月次勤怠 | MONTHLY_ATTENDANCE | 月次の勤怠集計と承認状態 |
| 13 | 月次承認履歴 | MONTHLY_APPROVAL_HISTORY | 月次確定の承認履歴 |

---

## テーブル詳細（全カラム説明）

### 1. 従業員マスタ (EMPLOYEE)

従業員の基本情報とログイン認証情報を管理するテーブルです。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| **EMPLOYEE_ID** | CHAR(6) | NOT NULL | - | **主キー**。従業員を一意に識別するID（社員コード）。数字6桁で管理します。例: `000001` |
| **EMPLOYEE_NAME** | VARCHAR(100) | NOT NULL | - | 従業員の氏名。画面表示やレポートで使用します。例: `山田 太郎` |
| **PASSWORD** | VARCHAR(255) | NOT NULL | - | ログイン用パスワード。本番環境ではハッシュ化（bcrypt等）を推奨します。テスト用: `Password@1234`（平文）または `$2b$10$...`（ハッシュ） |
| **EMAIL_ADDRESS** | VARCHAR(256) | NOT NULL | - | メールアドレス。ユニーク制約あり。通知や連絡先として使用します。例: `yamada.taro@example.com` |
| **DEPARTMENT** | VARCHAR(100) | NULL | - | 所属部署名。組織管理や集計に使用します。例: `開発部`、`営業部` |
| **POSITION** | VARCHAR(100) | NULL | - | 役職名。権限管理や表示に使用します。例: `一般社員`、`主任`、`部長` |
| **HIRE_DATE** | DATE | NULL | - | 入社日。勤続年数の計算や有給付与日数の計算に使用します。形式: `YYYY-MM-DD` 例: `2020-04-01` |
| **STANDARD_WORK_START_TIME** | TIME | NULL | `09:00:00` | 定時出勤時刻。定時出勤ボタンや遅刻判定に使用します。形式: `HH:MM:SS` 例: `09:00:00` |
| **STANDARD_WORK_END_TIME** | TIME | NULL | `17:30:00` | 定時退勤時刻。定時退勤ボタンや早退判定に使用します。形式: `HH:MM:SS` 例: `17:30:00` |
| **IS_ACTIVE** | BOOLEAN | NULL | `TRUE` | 有効フラグ。`TRUE`=有効（ログイン可能）、`FALSE`=無効（退職者など）。ログイン認証時にチェックします。 |
| **CREATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード作成日時。自動設定されます。 |
| **UPDATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード更新日時。更新時に自動更新されます。 |

**使用例:**
```sql
-- ログイン認証（テスト用パスワード: Password@1234）
SELECT * FROM EMPLOYEE 
WHERE EMPLOYEE_ID = '000001' AND PASSWORD = 'Password@1234' AND IS_ACTIVE = TRUE;
```

---

### 2. 勤務場所マスタ (WORK_LOCATION)

勤務場所の種類を管理するマスタテーブルです。ドロップダウン選択肢として使用します。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| **LOCATION_CODE** | VARCHAR(20) | NOT NULL | - | **主キー**。勤務場所を識別するコード。例: `COMMUTE`（通勤）、`REMOTE`（在宅） |
| **LOCATION_NAME** | VARCHAR(50) | NOT NULL | - | 勤務場所の表示名。画面に表示されます。例: `通勤`、`在宅`、`出張` |
| **DISPLAY_ORDER** | INT | NOT NULL | - | 表示順序。小さい順に表示されます。例: `1`=最初に表示、`2`=2番目に表示 |
| **IS_ACTIVE** | BOOLEAN | NULL | `TRUE` | 有効フラグ。`FALSE`にすると選択肢から非表示になります。 |
| **CREATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード作成日時。 |
| **UPDATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード更新日時。 |

**登録済みデータ:**
- `COMMUTE` - 通勤（表示順: 1）
- `REMOTE` - 在宅（表示順: 2）
- `DIRECT_BOTH` - 直行直帰（表示順: 3）
- `BUSINESS_TRIP` - 出張（表示順: 4）

---

### 3. ジョブマスタ (JOB_MASTER)

工数入力で使用するプロジェクトやタスクの情報を管理するマスタテーブルです。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| **JOB_CODE** | VARCHAR(50) | NOT NULL | - | **主キー**。ジョブ（プロジェクト・タスク）を識別するコード。工数入力時に選択します。例: `ZXXXA2506B` |
| **JOB_NAME** | VARCHAR(200) | NOT NULL | - | ジョブの正式名称。画面に表示されます。例: `ZXXXA2506B 人推_育成活動実施25152025-300／00X100 00X収益` |
| **JOB_CATEGORY** | VARCHAR(50) | NULL | - | ジョブのカテゴリ。分類に使用します。例: `プロジェクト`、`間接作業` |
| **PROJECT_CODE** | VARCHAR(50) | NULL | - | プロジェクトコード。関連プロジェクトを識別します。例: `25152025-300` |
| **IS_ACTIVE** | BOOLEAN | NULL | `TRUE` | 有効フラグ。`FALSE`にすると工数入力の選択肢から除外されます。 |
| **START_DATE** | DATE | NULL | - | ジョブの開始日。有効期間の判定に使用します。形式: `YYYY-MM-DD` |
| **END_DATE** | DATE | NULL | - | ジョブの終了日。有効期間の判定に使用します。形式: `YYYY-MM-DD` |
| **CREATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード作成日時。 |
| **UPDATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード更新日時。 |

---

### 4. 休暇種別マスタ (VACATION_TYPE)

休暇の種類と付与ルールを管理するマスタテーブルです。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| **VACATION_TYPE_CODE** | VARCHAR(20) | NOT NULL | - | **主キー**。休暇種別を識別するコード。例: `PAID_LEAVE`（有給休暇）、`SUMMER_LEAVE`（夏季休暇） |
| **VACATION_TYPE_NAME** | VARCHAR(50) | NOT NULL | - | 休暇種別の表示名。画面に表示されます。例: `有給休暇`、`夏季休暇` |
| **VACATION_CATEGORY** | VARCHAR(20) | NOT NULL | - | 休暇のカテゴリ。分類に使用します。例: `有給`、`特別` |
| **IS_PAID** | BOOLEAN | NULL | `FALSE` | 有給フラグ。`TRUE`=有給（給与支給あり）、`FALSE`=無給。 |
| **ANNUAL_GRANT_DAYS** | DECIMAL(4,1) | NULL | `0` | 年間付与日数。例: `20.0`=年間20日付与、`3.0`=年間3日付与 |
| **DISPLAY_ORDER** | INT | NOT NULL | - | 表示順序。小さい順に表示されます。 |
| **IS_ACTIVE** | BOOLEAN | NULL | `TRUE` | 有効フラグ。`FALSE`にすると選択肢から非表示になります。 |
| **CREATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード作成日時。 |
| **UPDATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード更新日時。 |

---

### 5. お知らせマスタ (NOTIFICATION)

システムからユーザーへのお知らせ情報を管理するテーブルです。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| **NOTIFICATION_ID** | BIGINT | NOT NULL | AUTO_INCREMENT | **主キー**。お知らせを一意に識別するID。自動採番されます。 |
| **NOTIFICATION_TYPE** | VARCHAR(20) | NOT NULL | - | お知らせ種別。`USER`=ユーザー向け、`GROUP`=グループ向け。 |
| **TARGET_TYPE** | VARCHAR(20) | NOT NULL | - | 対象種別。`ALL`=全体、`DEPT`=部署、`INDIVIDUAL`=個人。 |
| **TARGET_ID** | VARCHAR(50) | NULL | - | 対象ID。`TARGET_TYPE`が`DEPT`の場合は部署コード、`INDIVIDUAL`の場合は従業員ID。`ALL`の場合は`NULL`。 |
| **TITLE** | VARCHAR(200) | NOT NULL | - | お知らせのタイトル。画面に表示されます。例: `システムメンテナンスのお知らせ` |
| **CONTENT** | TEXT | NOT NULL | - | お知らせの本文内容。画面に表示されます。 |
| **DISPLAY_START_DATE** | DATETIME | NOT NULL | - | 表示開始日時。この日時以降に表示されます。形式: `YYYY-MM-DD HH:MM:SS` |
| **DISPLAY_END_DATE** | DATETIME | NULL | - | 表示終了日時。この日時以降は非表示になります。`NULL`の場合は無期限表示。形式: `YYYY-MM-DD HH:MM:SS` |
| **IS_IMPORTANT** | BOOLEAN | NULL | `FALSE` | 重要フラグ。`TRUE`=重要なお知らせ（目立つ表示）。 |
| **IS_ACTIVE** | BOOLEAN | NULL | `TRUE` | 有効フラグ。`FALSE`にすると非表示になります。 |
| **CREATED_BY** | VARCHAR(50) | NULL | - | 作成者。誰がお知らせを作成したか。例: `SYSTEM`、`ADMIN` |
| **CREATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード作成日時。 |
| **UPDATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード更新日時。 |

---

### 6. 勤怠記録 (ATTENDANCE_RECORD)

日次の出退勤時刻、勤務時間、承認状態などを記録するメインテーブルです。1日1レコードです。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| **ATTENDANCE_ID** | BIGINT | NOT NULL | AUTO_INCREMENT | **主キー**。勤怠記録を一意に識別するID。自動採番されます。 |
| **EMPLOYEE_ID** | VARCHAR(50) | NOT NULL | - | **外部キー**。従業員ID。どの従業員の勤怠記録か。`EMPLOYEE`テーブルを参照。 |
| **WORK_DATE** | DATE | NOT NULL | - | 勤務日。どの日の勤怠記録か。形式: `YYYY-MM-DD` 例: `2025-11-25`。従業員IDと勤務日の組み合わせでユニーク。 |
| **CLOCK_IN_TIME** | DATETIME | NULL | - | 出勤時刻。WEBタイムレコーダーで打刻した時刻、または手入力した時刻。形式: `YYYY-MM-DD HH:MM:SS` 例: `2025-11-25 09:00:00` |
| **CLOCK_OUT_TIME** | DATETIME | NULL | - | 退勤時刻。WEBタイムレコーダーで打刻した時刻、または手入力した時刻。形式: `YYYY-MM-DD HH:MM:SS` 例: `2025-11-25 18:30:00` |
| **CLOCK_IN_TYPE** | VARCHAR(20) | NULL | - | 出勤打刻種別。`STAMP`=打刻、`MANUAL`=手入力、`SCHEDULED`=定時出勤。画面で背景色を変えるために使用。 |
| **CLOCK_OUT_TYPE** | VARCHAR(20) | NULL | - | 退勤打刻種別。`STAMP`=打刻、`MANUAL`=手入力、`SCHEDULED`=定時退勤。画面で背景色を変えるために使用。 |
| **WORK_LOCATION_CODE** | VARCHAR(20) | NULL | - | **外部キー**。勤務場所コード。`WORK_LOCATION`テーブルを参照。例: `COMMUTE`、`REMOTE` |
| **ACTUAL_WORK_HOURS** | DECIMAL(5,2) | NULL | - | 実労働時間（時間単位）。出退勤時刻と休憩時間から自動計算されます。例: `8.50`=8時間30分 |
| **SCHEDULED_WORK_HOURS** | DECIMAL(5,2) | NULL | `8.00` | 所定労働時間（時間単位）。通常は8時間。例: `8.00`=8時間 |
| **OVERTIME_HOURS** | DECIMAL(5,2) | NULL | `0` | 残業時間（時間単位）。実労働時間が所定労働時間を超えた分。例: `0.50`=30分残業 |
| **NIGHT_WORK_HOURS** | DECIMAL(5,2) | NULL | `0` | 深夜労働時間（時間単位）。22時〜5時の労働時間。例: `2.00`=2時間 |
| **HOLIDAY_WORK_HOURS** | DECIMAL(5,2) | NULL | `0` | 休日労働時間（時間単位）。法定休日に働いた時間。例: `8.00`=8時間 |
| **IS_DAILY_CONFIRMED** | BOOLEAN | NULL | `FALSE` | 日次確定フラグ。`TRUE`=その日の勤怠を確定申請済み。日次確定ボタンで変更されます。 |
| **DAILY_CONFIRMED_AT** | DATETIME | NULL | - | 日次確定日時。いつ確定申請したか。形式: `YYYY-MM-DD HH:MM:SS` |
| **IS_MONTHLY_CONFIRMED** | BOOLEAN | NULL | `FALSE` | 月次確定フラグ。`TRUE`=月次の勤怠を確定申請済み。 |
| **MONTHLY_CONFIRMED_AT** | DATETIME | NULL | - | 月次確定日時。いつ月次確定申請したか。形式: `YYYY-MM-DD HH:MM:SS` |
| **APPROVAL_STATUS** | VARCHAR(20) | NULL | `NOT_SUBMITTED` | 承認状態。`NOT_SUBMITTED`=未申請、`PENDING`=申請中、`APPROVED`=承認済、`REJECTED`=却下 |
| **REMARK_TEXT** | TEXT | NULL | - | 備考内容。打刻できなかった理由やその他の備考を記入します。手入力の場合は必須入力。 |
| **CREATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード作成日時。 |
| **UPDATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード更新日時。 |

**重要な制約:**
- 1人の従業員は1日1レコードのみ（`EMPLOYEE_ID` + `WORK_DATE`でユニーク）
- 日次確定申請には勤務場所の入力が必須

---

### 7. 休憩時間 (BREAK_TIME)

1日の勤怠記録に紐づく複数の休憩時間帯を記録するテーブルです。1つの勤怠記録に対して複数レコード（休憩1、休憩2、休憩3など）が存在します。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| **BREAK_ID** | BIGINT | NOT NULL | AUTO_INCREMENT | **主キー**。休憩時間を一意に識別するID。自動採番されます。 |
| **ATTENDANCE_ID** | BIGINT | NOT NULL | - | **外部キー**。どの勤怠記録の休憩か。`ATTENDANCE_RECORD`テーブルを参照。 |
| **BREAK_SEQ** | INT | NOT NULL | - | 休憩順序。`1`=休憩1、`2`=休憩2、`3`=休憩3。`ATTENDANCE_ID`と`BREAK_SEQ`の組み合わせでユニーク。 |
| **BREAK_START_TIME** | DATETIME | NOT NULL | - | 休憩開始時刻。形式: `YYYY-MM-DD HH:MM:SS` 例: `2025-11-25 12:00:00` |
| **BREAK_END_TIME** | DATETIME | NULL | - | 休憩終了時刻。形式: `YYYY-MM-DD HH:MM:SS` 例: `2025-11-25 13:00:00` |
| **BREAK_DURATION_MINUTES** | INT | NULL | - | 休憩時間（分単位）。開始時刻と終了時刻から自動計算されます。例: `60`=60分（1時間） |
| **BREAK_TYPE** | VARCHAR(20) | NULL | `REGULAR` | 休憩種別。`REGULAR`=通常の休憩、`INTERRUPTION`=中断（勤務場所変更などによる中抜け時間）。 |
| **CREATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード作成日時。 |
| **UPDATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード更新日時。 |

**使用例:**
- 休憩1: 12:00〜13:00（60分）
- 休憩2: 15:00〜15:30（30分）
- 休憩3: 17:00〜17:15（15分）

---

### 8. 公用外出 (OFFICIAL_OUTING)

1日の勤怠記録に紐づく複数の公用外出時間帯を記録するテーブルです。顧客訪問など、業務上の外出を記録します。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| **OUTING_ID** | BIGINT | NOT NULL | AUTO_INCREMENT | **主キー**。公用外出を一意に識別するID。自動採番されます。 |
| **ATTENDANCE_ID** | BIGINT | NOT NULL | - | **外部キー**。どの勤怠記録の公用外出か。`ATTENDANCE_RECORD`テーブルを参照。 |
| **OUTING_SEQ** | INT | NOT NULL | - | 公用外出順序。`1`=公用外出1、`2`=公用外出2、`3`=公用外出3。`ATTENDANCE_ID`と`OUTING_SEQ`の組み合わせでユニーク。 |
| **OUTING_START_TIME** | DATETIME | NOT NULL | - | 外出開始時刻。形式: `YYYY-MM-DD HH:MM:SS` 例: `2025-11-25 15:00:00` |
| **OUTING_END_TIME** | DATETIME | NULL | - | 外出終了時刻。形式: `YYYY-MM-DD HH:MM:SS` 例: `2025-11-25 16:00:00` |
| **OUTING_DURATION_MINUTES** | INT | NULL | - | 外出時間（分単位）。開始時刻と終了時刻から自動計算されます。例: `60`=60分（1時間） |
| **OUTING_PURPOSE** | VARCHAR(200) | NULL | - | 外出目的。何のために外出したか。例: `顧客訪問`、`打ち合わせ` |
| **CREATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード作成日時。 |
| **UPDATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード更新日時。 |

---

### 9. 工数実績 (WORK_HOURS)

従業員が各ジョブ（プロジェクト・タスク）に対して投入した工数の実績を記録するテーブルです。1日の勤怠記録に対して複数のジョブに工数を振り分けることができます。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| **WORK_HOURS_ID** | BIGINT | NOT NULL | AUTO_INCREMENT | **主キー**。工数実績を一意に識別するID。自動採番されます。 |
| **ATTENDANCE_ID** | BIGINT | NOT NULL | - | **外部キー**。どの勤怠記録の工数か。`ATTENDANCE_RECORD`テーブルを参照。 |
| **EMPLOYEE_ID** | VARCHAR(50) | NOT NULL | - | **外部キー**。どの従業員の工数か。`EMPLOYEE`テーブルを参照。集計時に使用します。 |
| **WORK_DATE** | DATE | NOT NULL | - | 作業日。どの日に作業したか。形式: `YYYY-MM-DD` 例: `2025-11-25` |
| **JOB_CODE** | VARCHAR(50) | NOT NULL | - | **外部キー**。どのジョブ（プロジェクト・タスク）に工数を投入したか。`JOB_MASTER`テーブルを参照。 |
| **WORK_CODE** | VARCHAR(50) | NULL | - | 作業コード。具体的な作業内容を識別するコード。例: `DEV001`、`TRN001` |
| **WORK_HOURS_VALUE** | DECIMAL(5,2) | NOT NULL | - | 工数時間（時間単位）。スライダーまたは数値入力で入力します。例: `5.00`=5時間、`3.50`=3時間30分 |
| **WORK_VOLUME** | INT | NULL | - | 作業ボリューム（0-10の段階）。時間入力の代わりにボリューム入力も可能。例: `5`=中程度の作業量 |
| **INPUT_TYPE** | VARCHAR(20) | NULL | `TIME` | 入力種別。`TIME`=時間入力、`VOLUME`=ボリューム入力。 |
| **REMARKS** | TEXT | NULL | - | 備考。工数に関する補足情報。 |
| **CREATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード作成日時。 |
| **UPDATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード更新日時。 |

**重要な制約:**
- 1日の工数の合計が実労働時間と一致する必要があります（日次確定申請の条件）

**使用例:**
- ジョブAに5時間、ジョブBに3時間 → 合計8時間（実労働時間と一致）

---

### 10. 休暇残日数 (VACATION_BALANCE)

従業員ごとの休暇種別別の付与日数、使用日数、残日数を管理するテーブルです。年度ごとに管理されます。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| **BALANCE_ID** | BIGINT | NOT NULL | AUTO_INCREMENT | **主キー**。休暇残日数を一意に識別するID。自動採番されます。 |
| **EMPLOYEE_ID** | VARCHAR(50) | NOT NULL | - | **外部キー**。どの従業員の休暇残日数か。`EMPLOYEE`テーブルを参照。 |
| **VACATION_TYPE_CODE** | VARCHAR(20) | NOT NULL | - | **外部キー**。どの休暇種別か。`VACATION_TYPE`テーブルを参照。例: `PAID_LEAVE`、`SUMMER_LEAVE` |
| **FISCAL_YEAR** | INT | NOT NULL | - | 年度。どの年度の休暇残日数か。例: `2025`=2025年度（2025年4月〜2026年3月） |
| **GRANTED_DAYS** | DECIMAL(4,1) | NOT NULL | - | 付与日数。その年度に付与された休暇日数。例: `20.0`=20日、`15.0`=15日 |
| **USED_DAYS** | DECIMAL(4,1) | NULL | `0` | 使用日数。その年度に使用した休暇日数。例: `5.0`=5日使用済み |
| **REMAINING_DAYS** | DECIMAL(4,1) | NOT NULL | - | 残日数。付与日数から使用日数を引いた残り。例: `15.0`=15日残り（`GRANTED_DAYS - USED_DAYS`） |
| **GRANT_DATE** | DATE | NOT NULL | - | 付与日。いつ休暇が付与されたか。形式: `YYYY-MM-DD` 例: `2025-04-01`（年度初め） |
| **EXPIRATION_DATE** | DATE | NULL | - | 有効期限。いつまで有効か。形式: `YYYY-MM-DD` 例: `2026-03-31`（年度末） |
| **CREATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード作成日時。 |
| **UPDATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード更新日時。 |

**重要な制約:**
- 1人の従業員は1つの休暇種別につき1年度1レコードのみ（`EMPLOYEE_ID` + `VACATION_TYPE_CODE` + `FISCAL_YEAR`でユニーク）

**使用例:**
- 2025年度の有給休暇: 付与20日、使用5日、残り15日

---

### 11. 休暇取得履歴 (VACATION_HISTORY)

従業員が休暇を取得した履歴と承認状態を記録するテーブルです。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| **VACATION_ID** | BIGINT | NOT NULL | AUTO_INCREMENT | **主キー**。休暇取得を一意に識別するID。自動採番されます。 |
| **EMPLOYEE_ID** | VARCHAR(50) | NOT NULL | - | **外部キー**。どの従業員が休暇を取得したか。`EMPLOYEE`テーブルを参照。 |
| **VACATION_TYPE_CODE** | VARCHAR(20) | NOT NULL | - | **外部キー**。どの休暇種別か。`VACATION_TYPE`テーブルを参照。例: `PAID_LEAVE`、`SUMMER_LEAVE` |
| **START_DATE** | DATE | NOT NULL | - | 開始日。休暇の開始日。形式: `YYYY-MM-DD` 例: `2025-11-20` |
| **END_DATE** | DATE | NOT NULL | - | 終了日。休暇の終了日。形式: `YYYY-MM-DD` 例: `2025-11-22`（3日間の休暇） |
| **VACATION_DAYS** | DECIMAL(4,1) | NOT NULL | - | 取得日数。何日間の休暇か。例: `3.0`=3日、`0.5`=半日 |
| **HALF_DAY_TYPE** | VARCHAR(20) | NULL | - | 半休種別。`AM`=午前休、`PM`=午後休。全日の場合は`NULL`。 |
| **REASON** | TEXT | NULL | - | 取得理由。なぜ休暇を取得したか。例: `私用`、`夏季休暇` |
| **APPROVAL_STATUS** | VARCHAR(20) | NULL | `PENDING` | 承認状態。`PENDING`=申請中、`APPROVED`=承認済、`REJECTED`=却下 |
| **APPROVED_BY** | VARCHAR(50) | NULL | - | 承認者。誰が承認したか。例: `MGR001`（管理者ID） |
| **APPROVED_AT** | DATETIME | NULL | - | 承認日時。いつ承認されたか。形式: `YYYY-MM-DD HH:MM:SS` |
| **CREATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード作成日時。 |
| **UPDATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード更新日時。 |

**使用例:**
- 2025年11月20日〜22日の3日間の有給休暇（承認済み）

---

### 12. 月次勤怠 (MONTHLY_ATTENDANCE)

月次の勤怠集計と承認状態を管理するテーブルです。従業員ごと、年月ごとに1レコードです。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| **MONTHLY_ATTENDANCE_ID** | BIGINT | NOT NULL | AUTO_INCREMENT | **主キー**。月次勤怠を一意に識別するID。自動採番されます。 |
| **EMPLOYEE_ID** | VARCHAR(50) | NOT NULL | - | **外部キー**。どの従業員の月次勤怠か。`EMPLOYEE`テーブルを参照。 |
| **TARGET_YEAR_MONTH** | CHAR(7) | NOT NULL | - | 対象年月。どの年月の月次勤怠か。形式: `YYYY-MM` 例: `2025-11`。従業員IDと対象年月の組み合わせでユニーク。 |
| **MONTHLY_APPROVAL_STATUS** | VARCHAR(20) | NULL | `NOT_SUBMITTED` | 月次承認状態。`NOT_SUBMITTED`=未確定、`PENDING`=承認中、`APPROVED`=承認済み、`REJECTED`=却下 |
| **SUBMITTED_AT** | DATETIME | NULL | - | 申請日時。いつ月次確定申請したか。形式: `YYYY-MM-DD HH:MM:SS` |
| **APPROVED_AT** | DATETIME | NULL | - | 承認日時。いつ承認されたか。形式: `YYYY-MM-DD HH:MM:SS` |
| **APPROVED_BY** | VARCHAR(50) | NULL | - | 承認者ID。誰が承認したか。`EMPLOYEE`テーブルの従業員ID。 |
| **CREATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード作成日時。 |
| **UPDATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード更新日時。 |

**重要な制約:**
- 1人の従業員は1年月1レコードのみ（`EMPLOYEE_ID` + `TARGET_YEAR_MONTH`でユニーク）

**使用例:**
- 2025年11月: 承認中（PENDING）
- 2025年10月: 承認済み（APPROVED）

---

### 13. 月次承認履歴 (MONTHLY_APPROVAL_HISTORY)

月次確定の承認履歴（申請、承認、却下、取消）を記録するテーブルです。ステータスダイアログで表示されます。

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| **HISTORY_ID** | BIGINT | NOT NULL | AUTO_INCREMENT | **主キー**。承認履歴を一意に識別するID。自動採番されます。 |
| **EMPLOYEE_ID** | VARCHAR(50) | NOT NULL | - | **外部キー**。どの従業員の承認履歴か。`EMPLOYEE`テーブルを参照。 |
| **TARGET_YEAR_MONTH** | CHAR(7) | NOT NULL | - | 対象年月。どの年月の承認履歴か。形式: `YYYY-MM` 例: `2025-11` |
| **SEQ_NO** | INT | NOT NULL | - | 順序番号。同一年月内での履歴の連番（1から始まる）。従業員ID、対象年月、順序番号の組み合わせでユニーク。 |
| **ACTION_DATETIME** | DATETIME | NOT NULL | - | アクション日時。いつアクションが行われたか。形式: `YYYY-MM-DD HH:MM:SS` |
| **ACTION_TYPE** | VARCHAR(20) | NOT NULL | - | アクション種別。`SUBMIT`=申請、`APPROVE`=承認、`REJECT`=却下、`CANCEL`=取消 |
| **ACTOR_ID** | VARCHAR(50) | NOT NULL | - | **外部キー**。実行者ID。誰がアクションを実行したか。`EMPLOYEE`テーブルの従業員ID。 |
| **COMMENT** | TEXT | NULL | - | コメント。承認/却下時のコメント。 |
| **CREATED_AT** | TIMESTAMP | NULL | CURRENT_TIMESTAMP | レコード作成日時。 |

**重要な制約:**
- 同一年月内での履歴は順序番号で管理（1, 2, 3...）
- 従業員ID、対象年月、順序番号の組み合わせでユニーク

**使用例:**
- 2025年11月: 1. 申請（2025-11-30 18:00:00）
- 2025年10月: 1. 申請（2025-10-31 18:00:00）、2. 承認（2025-11-01 10:00:00）

## 投入済みサンプルデータ

### 勤務場所（4件）
- 通勤（COMMUTE）
- 在宅（REMOTE）
- 直行直帰（DIRECT_BOTH）
- 出張（BUSINESS_TRIP）

### 休暇種別（6件）
- **有給休暇（PAID_LEAVE）** - 年間20日付与
- **夏季休暇（SUMMER_LEAVE）** - 年間3日付与
- 病気休暇（SICK_LEAVE）- 年間5日付与
- 忌引休暇（CONDOLENCE_LEAVE）- 年間3日付与
- 産前産後休暇（MATERNITY_LEAVE）
- 育児休暇（CHILDCARE_LEAVE）

### ジョブ（3件）※指定されたサンプル
1. **ZXXXA2506B** - 人推_育成活動実施25152025-300／00X100 00X収益
2. **ZXXXA2503F** - S一般開発:自社サービス/ソリューション プロダクト開発2025-611／00X100 00X収益
3. **ZZW04** - 間接作業　研修（全社扱い）／00X100 00X収益

### 従業員（3名）
- 000001: 山田 太郎（開発部・一般社員）
- 000002: 佐藤 花子（開発部・主任）
- 000003: 鈴木 次郎（営業部・一般社員）

### その他
- 勤怠記録: 2025年11月のサンプルデータ
- 休憩時間: 各勤怠記録に紐づく休憩データ
- 工数実績: 各従業員のジョブ別工数データ
- 休暇残日数: 2025年度の各従業員の休暇残
- 月次サマリー: 2025年11月の集計データ

## 動作確認用クエリ

スクリプトの末尾にコメントアウトされた動作確認用クエリが含まれています。

```sql
-- 1. 従業員一覧
SELECT * FROM EMPLOYEE;

-- 2. 勤務場所一覧
SELECT * FROM WORK_LOCATION;

-- 3. ジョブ一覧
SELECT * FROM JOB_MASTER;

-- 4. 休暇種別一覧
SELECT * FROM VACATION_TYPE;

-- 5. 2025年11月の勤怠記録
SELECT * FROM ATTENDANCE_RECORD 
WHERE WORK_DATE BETWEEN '2025-11-01' AND '2025-11-30';

-- 6. 従業員別の月次勤怠集計
SELECT * FROM V_MONTHLY_ATTENDANCE 
WHERE YEAR_MONTH = '2025-11';

-- 7. 従業員別の工数集計
SELECT * FROM V_WORK_HOURS_SUMMARY 
WHERE YEAR_MONTH = '2025-11';

-- 8. 従業員別の休暇残日数
SELECT * FROM V_VACATION_BALANCE_SUMMARY;
```

## ビュー（4つ）

スクリプトには便利な集計ビューも含まれています：

1. **V_MONTHLY_ATTENDANCE** - 月次勤怠集計ビュー
2. **V_WORK_HOURS_SUMMARY** - 工数実績集計ビュー
3. **V_VACATION_BALANCE_SUMMARY** - 休暇残日数集計ビュー
4. **V_MONTHLY_APPROVAL_HISTORY** - 月次承認履歴ビュー（実行者名を含む）

## ER図

詳細なER図は`docs/entities/er-diagram.md`を参照してください。
Mermaid形式で記述されており、GitHub、GitLab、VSCodeなどで表示できます。

## 休暇残日数の管理方法

休暇残日数は**年度ごと**に管理されます。以下の2つのテーブルで管理しています：

### 1. VACATION_BALANCE（休暇残日数テーブル）

**管理単位:** 従業員 × 休暇種別 × 年度

**主要なカラム:**
- `GRANTED_DAYS`（付与日数）: 年度初めに付与される日数。例: 有給休暇20日
- `USED_DAYS`（使用日数）: その年度に使用した日数。**VACATION_HISTORYから自動計算推奨**
- `REMAINING_DAYS`（残日数）: 付与日数 - 使用日数。**自動計算推奨**

**管理の流れ:**

1. **年度初め（4月1日）**: 各従業員に休暇を付与
   ```sql
   -- 例: 2025年度の有給休暇を20日付与
   INSERT INTO VACATION_BALANCE 
   (EMPLOYEE_ID, VACATION_TYPE_CODE, FISCAL_YEAR, GRANTED_DAYS, USED_DAYS, REMAINING_DAYS, GRANT_DATE, EXPIRATION_DATE)
   VALUES 
   ('000001', 'PAID_LEAVE', 2025, 20.0, 0.0, 20.0, '2025-04-01', '2026-03-31');
   ```

2. **休暇申請時**: VACATION_HISTORYに記録し、有給休暇の場合はVACATION_BALANCEのUSED_DAYSとREMAINING_DAYSを更新
   ```sql
   -- 休暇申請履歴を登録（申請時はAPPROVAL_STATUS='PENDING'）
   INSERT INTO VACATION_HISTORY 
   (EMPLOYEE_ID, VACATION_TYPE_CODE, START_DATE, END_DATE, VACATION_DAYS, APPROVAL_STATUS)
   VALUES 
   ('000001', 'PAID_LEAVE', '2025-11-20', '2025-11-22', 3, 'PENDING');
   
   -- 有給休暇の場合、申請時に残日数を更新
   -- 注意: MySQLのSET句で同じカラムを参照する場合、更新前の値を使用するため、
   -- まず現在の値を取得してから更新する方法を使用する
   -- 日数は整数として処理される（DECIMAL型から取得した値も整数に丸める）
   UPDATE VACATION_BALANCE 
   SET USED_DAYS = ROUND(USED_DAYS) + 3,
       REMAINING_DAYS = ROUND(GRANTED_DAYS) - (ROUND(USED_DAYS) + 3)
   WHERE EMPLOYEE_ID = '000001' 
     AND VACATION_TYPE_CODE = 'PAID_LEAVE' 
     AND FISCAL_YEAR = 2025;
   ```
   
   **注意**: 
   - 有給休暇（PAID_LEAVE）の場合、申請時（APPROVAL_STATUS='PENDING'）に残日数が減算されます。申請取り消し時は残日数が戻されます。
   - **日数は整数として処理されます**。データベースのDECIMAL型から取得した値や計算結果が小数になる場合でも、整数に丸めて処理します。
   - 更新処理では、現在のUSED_DAYSとGRANTED_DAYSを取得してから、新しい値を計算して更新します（MySQLのSET句で同じカラムを参照する際の問題を回避するため）。

### 2. VACATION_HISTORY（休暇取得履歴テーブル）

**管理単位:** 1回の休暇取得ごとに1レコード

**役割:**
- 休暇取得の詳細履歴を記録
- 承認状態を管理
- VACATION_BALANCEのUSED_DAYSを計算するための元データ

**重要なポイント:**

1. **残日数の自動計算**: 
   - `REMAINING_DAYS = GRANTED_DAYS - USED_DAYS` の計算式で自動計算できます
   - アプリケーション側で計算するか、トリガーで自動更新することを推奨

2. **使用日数の自動計算**:
   ```sql
   -- VACATION_HISTORYから使用日数を集計して更新
   -- 注意: 日数は整数として処理される（ROUND関数で整数に丸める）
   UPDATE VACATION_BALANCE vb
   SET USED_DAYS = ROUND((
       SELECT COALESCE(SUM(VACATION_DAYS), 0)
       FROM VACATION_HISTORY vh
       WHERE vh.EMPLOYEE_ID = vb.EMPLOYEE_ID
         AND vh.VACATION_TYPE_CODE = vb.VACATION_TYPE_CODE
         AND vh.APPROVAL_STATUS = 'APPROVED'
         AND YEAR(vh.START_DATE) = vb.FISCAL_YEAR
   )),
   REMAINING_DAYS = ROUND(GRANTED_DAYS) - ROUND((
       SELECT COALESCE(SUM(VACATION_DAYS), 0)
       FROM VACATION_HISTORY vh
       WHERE vh.EMPLOYEE_ID = vb.EMPLOYEE_ID
         AND vh.VACATION_TYPE_CODE = vb.VACATION_TYPE_CODE
         AND vh.APPROVAL_STATUS = 'APPROVED'
         AND YEAR(vh.START_DATE) = vb.FISCAL_YEAR
   ));
   ```

3. **年度の管理**:
   - `FISCAL_YEAR`で年度を管理（例: 2025 = 2025年4月〜2026年3月）
   - 年度ごとに新しいレコードを作成

4. **ユニーク制約**:
   - `EMPLOYEE_ID + VACATION_TYPE_CODE + FISCAL_YEAR`でユニーク
   - 1人の従業員は1つの休暇種別につき1年度1レコードのみ

**現在のサンプルデータ例:**
- 000001: 有給休暇 付与20日、使用5日、残り15日（2025年度）
- 000001: 夏季休暇 付与3日、使用0日、残り3日（2025年度）

## 主要な機能とテーブルの対応

| 機能 | 関連テーブル |
|------|-------------|
| ホーム画面（WEBタイムレコーダー） | ATTENDANCE_RECORD, WORK_LOCATION |
| 勤務表 | ATTENDANCE_RECORD, BREAK_TIME, OFFICIAL_OUTING |
| 工数実績入力 | WORK_HOURS, JOB_MASTER |
| 休暇管理 | VACATION_TYPE, VACATION_BALANCE, VACATION_HISTORY |
| 月次サマリー | V_MONTHLY_ATTENDANCE（ビュー） |
| 月次確定・ステータス表示 | MONTHLY_ATTENDANCE, MONTHLY_APPROVAL_HISTORY, V_MONTHLY_APPROVAL_HISTORY（ビュー） |
| お知らせ表示 | NOTIFICATION |

## データベース再作成

データベースを再作成する場合は、スクリプトの先頭で`DROP DATABASE`を実行しているため、再度スクリプトを実行するだけで初期化されます。

```sql
DROP DATABASE IF EXISTS teamspirit_db;
CREATE DATABASE teamspirit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 注意事項

1. **文字コード**: UTF8MB4を使用しているため、絵文字も保存可能です
2. **タイムゾーン**: TIMESTAMP型はシステムのタイムゾーンを使用します
3. **外部キー制約**: CASCADE削除が設定されているため、親レコード削除時は関連データも削除されます
4. **AUTO_INCREMENT**: 各テーブルのIDは自動採番されます

## トラブルシューティング

### エラー: "Can't connect to MySQL server"
- MySQL Serverが起動していることを確認してください
- 接続情報（ホスト、ポート、ユーザー名、パスワード）が正しいか確認してください

### エラー: "Access denied for user"
- ユーザーにデータベース作成権限があるか確認してください
- 必要に応じて管理者権限で実行してください

### エラー: "Table already exists"
- スクリプトの先頭で`DROP DATABASE IF EXISTS`を実行しているため、通常は発生しません
- 手動で削除する場合: `DROP DATABASE teamspirit_db;`

## 参考資料

- [TeamSpirit機能一覧](feture_list/TeamSpirit機能一覧.md)
- [エンティティ一覧](docs/entities/entity-list.md)
- [ER図](docs/entities/er-diagram.md)

## バージョン情報

- 作成日: 2025-11-27
- データベースエンジン: MySQL 8.0以上推奨
- 文字コード: UTF8MB4
- 照合順序: utf8mb4_unicode_ci

## ライセンス

社内プロジェクト用

---

## コマンド文の意味解説

このREADMEに記載されているすべてのSQLコマンドの意味を1つ1つ説明します。

### 1. データベース確認コマンド

```sql
SHOW DATABASES LIKE 'teamspirit_db';
```
**意味**: `teamspirit_db`という名前のデータベースが存在するか確認するコマンドです。
- `SHOW DATABASES`: MySQLサーバー内のすべてのデータベース一覧を表示します
- `LIKE 'teamspirit_db'`: データベース名が`teamspirit_db`に一致するものだけをフィルタリングして表示します
- 結果: データベースが存在する場合は`teamspirit_db`が表示され、存在しない場合は何も表示されません

### 2. データベース選択コマンド

```sql
USE teamspirit_db;
```
**意味**: これから操作するデータベースを`teamspirit_db`に切り替えるコマンドです。
- `USE`: データベースを選択（切り替え）するコマンドです
- `teamspirit_db`: 選択するデータベース名です
- このコマンドを実行すると、以降のSQLコマンドは`teamspirit_db`データベースに対して実行されます
- 例: `SELECT * FROM EMPLOYEE;`を実行すると、`teamspirit_db`データベースの`EMPLOYEE`テーブルからデータを取得します

### 3. テーブル一覧表示コマンド

```sql
SHOW TABLES;
```
**意味**: 現在選択しているデータベース内のすべてのテーブル名の一覧を表示するコマンドです。
- `SHOW TABLES`: データベース内のテーブル一覧を表示します
- 結果: `EMPLOYEE`、`WORK_LOCATION`、`ATTENDANCE_RECORD`などのテーブル名が一覧で表示されます
- 注意: このコマンドを実行する前に`USE teamspirit_db;`でデータベースを選択しておく必要があります

### 4. テーブルのレコード数確認コマンド

```sql
SELECT 'EMPLOYEE' AS TABLE_NAME, COUNT(*) AS ROW_COUNT FROM EMPLOYEE
UNION ALL
SELECT 'WORK_LOCATION', COUNT(*) FROM WORK_LOCATION
UNION ALL
SELECT 'JOB_MASTER', COUNT(*) FROM JOB_MASTER
UNION ALL
SELECT 'VACATION_TYPE', COUNT(*) FROM VACATION_TYPE;
```
**意味**: 複数のテーブルのレコード数を一度に確認するコマンドです。各テーブルに何件のデータが入っているかを表示します。

**各部分の説明**:
- `SELECT 'EMPLOYEE' AS TABLE_NAME, COUNT(*) AS ROW_COUNT FROM EMPLOYEE`
  - `'EMPLOYEE'`: 文字列リテラル（固定の文字列）で、結果に「EMPLOYEE」という値を表示します
  - `AS TABLE_NAME`: この列の見出しを`TABLE_NAME`にします（結果の列名が`TABLE_NAME`になります）
  - `COUNT(*)`: `EMPLOYEE`テーブルの全レコード数を数えます（`*`はすべての行を意味します）
  - `AS ROW_COUNT`: この列の見出しを`ROW_COUNT`にします（結果の列名が`ROW_COUNT`になります）
  - `FROM EMPLOYEE`: `EMPLOYEE`テーブルからデータを取得します

- `UNION ALL`: 複数のSELECT文の結果を縦に結合します（`UNION`は重複を削除しますが、`UNION ALL`は重複も含めてすべての結果を表示します）

- 同様に、`WORK_LOCATION`、`JOB_MASTER`、`VACATION_TYPE`テーブルについてもレコード数を取得します

**結果の例**:
```
TABLE_NAME      | ROW_COUNT
----------------|----------
EMPLOYEE        | 3
WORK_LOCATION   | 4
JOB_MASTER      | 3
VACATION_TYPE   | 6
```

### 5. 動作確認用クエリ（従業員一覧）

```sql
SELECT * FROM EMPLOYEE;
```
**意味**: `EMPLOYEE`テーブルのすべての列とすべての行を取得するコマンドです。
- `SELECT *`: すべての列を取得します（`*`はすべての列を意味します）
- `FROM EMPLOYEE`: `EMPLOYEE`テーブルからデータを取得します
- 結果: 従業員のID、名前、メールアドレス、部署、役職などの情報がすべて表示されます

### 6. 動作確認用クエリ（勤務場所一覧）

```sql
SELECT * FROM WORK_LOCATION;
```
**意味**: `WORK_LOCATION`テーブルのすべてのデータを取得するコマンドです。
- 結果: 勤務場所コード（COMMUTE、REMOTEなど）、勤務場所名、表示順序などの情報が表示されます

### 7. 動作確認用クエリ（ジョブ一覧）

```sql
SELECT * FROM JOB_MASTER;
```
**意味**: `JOB_MASTER`テーブルのすべてのデータを取得するコマンドです。
- 結果: ジョブコード、ジョブ名、カテゴリ、プロジェクトコードなどの情報が表示されます

### 8. 動作確認用クエリ（休暇種別一覧）

```sql
SELECT * FROM VACATION_TYPE;
```
**意味**: `VACATION_TYPE`テーブルのすべてのデータを取得するコマンドです。
- 結果: 休暇種別コード（PAID_LEAVE、SUMMER_LEAVEなど）、休暇種別名、年間付与日数などの情報が表示されます

### 9. 動作確認用クエリ（期間指定の勤怠記録）

```sql
SELECT * FROM ATTENDANCE_RECORD 
WHERE WORK_DATE BETWEEN '2025-11-01' AND '2025-11-30';
```
**意味**: 2025年11月の勤怠記録を取得するコマンドです。

**各部分の説明**:
- `SELECT * FROM ATTENDANCE_RECORD`: `ATTENDANCE_RECORD`テーブルからすべての列を取得します
- `WHERE`: 条件を指定して、条件に合う行だけを取得します
- `WORK_DATE BETWEEN '2025-11-01' AND '2025-11-30'`: `WORK_DATE`（勤務日）が2025年11月1日から2025年11月30日までの範囲内のレコードを取得します
  - `BETWEEN`: 範囲を指定する演算子です（開始値と終了値を含みます）
  - `'2025-11-01'`: 開始日（2025年11月1日）
  - `'2025-11-30'`: 終了日（2025年11月30日）

**結果**: 2025年11月のすべての勤怠記録（出退勤時刻、勤務時間など）が表示されます

### 10. 動作確認用クエリ（月次勤怠集計ビュー）

```sql
SELECT * FROM V_MONTHLY_ATTENDANCE 
WHERE YEAR_MONTH = '2025-11';
```
**意味**: 2025年11月の月次勤怠集計データを取得するコマンドです。

**各部分の説明**:
- `SELECT * FROM V_MONTHLY_ATTENDANCE`: `V_MONTHLY_ATTENDANCE`というビュー（VIEW）からすべての列を取得します
  - ビュー: 複数のテーブルを結合したり集計したりした結果を、あたかも1つのテーブルのように見せる機能です
- `WHERE YEAR_MONTH = '2025-11'`: `YEAR_MONTH`（年月）が`'2025-11'`（2025年11月）のレコードだけを取得します
  - `=`: 等しいことを表す演算子です

**結果**: 2025年11月の従業員ごとの月次勤怠集計（総労働時間、残業時間など）が表示されます

### 11. 動作確認用クエリ（工数集計ビュー）

```sql
SELECT * FROM V_WORK_HOURS_SUMMARY 
WHERE YEAR_MONTH = '2025-11';
```
**意味**: 2025年11月の工数実績の集計データを取得するコマンドです。

**各部分の説明**:
- `SELECT * FROM V_WORK_HOURS_SUMMARY`: `V_WORK_HOURS_SUMMARY`ビューからすべての列を取得します
- `WHERE YEAR_MONTH = '2025-11'`: 2025年11月のデータだけを取得します

**結果**: 2025年11月の従業員ごと、ジョブごとの工数集計が表示されます

### 12. 動作確認用クエリ（休暇残日数集計ビュー）

```sql
SELECT * FROM V_VACATION_BALANCE_SUMMARY;
```
**意味**: すべての従業員の休暇残日数の集計データを取得するコマンドです。

**各部分の説明**:
- `SELECT * FROM V_VACATION_BALANCE_SUMMARY`: `V_VACATION_BALANCE_SUMMARY`ビューからすべての列を取得します
- `WHERE`句がないため、すべてのデータが取得されます

**結果**: 従業員ごと、休暇種別ごとの休暇残日数（付与日数、使用日数、残日数）が表示されます

### 13. データベース削除コマンド

```sql
DROP DATABASE IF EXISTS teamspirit_db;
```
**意味**: `teamspirit_db`データベースを削除するコマンドです（存在する場合のみ）。

**各部分の説明**:
- `DROP DATABASE`: データベースを削除するコマンドです
- `teamspirit_db`: 削除するデータベース名です
- `IF EXISTS`: データベースが存在する場合のみ削除を実行します。存在しない場合はエラーにならず、何も実行されません
  - このオプションがない場合、データベースが存在しないとエラーになります

**注意**: このコマンドを実行すると、データベース内のすべてのテーブルとデータが完全に削除されます。実行前によく確認してください。

### 14. データベース作成コマンド

```sql
CREATE DATABASE teamspirit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
**意味**: `teamspirit_db`という名前の新しいデータベースを作成するコマンドです。

**各部分の説明**:
- `CREATE DATABASE`: 新しいデータベースを作成するコマンドです
- `teamspirit_db`: 作成するデータベース名です
- `CHARACTER SET utf8mb4`: 文字コードを`utf8mb4`に設定します
  - `utf8mb4`: UTF-8の4バイト版で、絵文字や特殊文字も保存できます
  - 通常の`utf8`は3バイトまでしか対応していないため、絵文字が保存できない場合があります
- `COLLATE utf8mb4_unicode_ci`: 照合順序（文字の比較方法）を`utf8mb4_unicode_ci`に設定します
  - `unicode`: Unicode標準に基づいた照合順序です
  - `ci`: Case Insensitive（大文字小文字を区別しない）の意味です
  - 例: `'ABC'`と`'abc'`は同じものとして扱われます

**結果**: 空の`teamspirit_db`データベースが作成されます。この後にテーブルを作成する必要があります。

---

## コマンド実行の流れ（まとめ）

1. **データベースの確認**: `SHOW DATABASES LIKE 'teamspirit_db';`でデータベースが存在するか確認
2. **データベースの選択**: `USE teamspirit_db;`で操作対象のデータベースを選択
3. **テーブルの確認**: `SHOW TABLES;`でテーブル一覧を確認
4. **データの確認**: `SELECT * FROM テーブル名;`でテーブルのデータを確認
5. **レコード数の確認**: `SELECT COUNT(*) FROM テーブル名;`でレコード数を確認

**データベースを再作成する場合**:
1. `DROP DATABASE IF EXISTS teamspirit_db;`で既存のデータベースを削除
2. `CREATE DATABASE teamspirit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`で新しいデータベースを作成
3. `mysql_table_design.sql`を実行してテーブルとデータを作成

