# TeamSpirit ホーム画面 API仕様書

## 概要

本ドキュメントは、TeamSpirit勤怠管理システムのホーム画面で使用するバックエンドAPIの仕様を定義します。

詳細設計書: `docs/detailed-design/ui/home-screen.md`  
機能一覧: `feture_list/TeamSpirit機能一覧.md`

---

## 認証

### POST /api/auth/login

**機能一覧**: API_TS_0001  
**説明**: 社員コードとパスワードによる認証を行う

#### リクエスト

```json
{
  "employeeId": "000001",
  "password": "Password@1234"
}
```

#### レスポンス（成功）

```json
{
  "success": true,
  "employeeId": "000001",
  "employeeName": "山田 太郎",
  "message": "ログインに成功しました。"
}
```

#### レスポンス（失敗）

```json
{
  "success": false,
  "message": "社員コードまたはパスワードが違います。"
}
```

---

## お知らせ

### GET /api/notifications

**機能一覧**: API_TS_0106  
**詳細設計書**: テーブル取得仕様 No.1（お知らせ情報取得）、編集仕様 No.1（お知らせ情報編集）  
**説明**: ログインユーザーに対するお知らせ情報を取得する（最大4件）

#### リクエストパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| employeeId | string | ○ | 従業員ID（6桁の数字） |

#### レスポンス（成功）

```json
{
  "success": true,
  "notifications": [
    "12月・1月の年休取得推奨日は、12/12(金)、12/25(木)、1/23(金)です。推奨日を中心にチームで調整し合うなどして、年休を取得しましょう。",
    "【経企からのお知らせ】毎日KOUKAヘログインして(連続ログインでボーナスKoinゲット)、日々の感謝・称賛の気持ちを伝えましょう! [https://cac.kouka-bc.com/]",
    "【情シより】不明点はまずはFAQでご確認ください。<C-FAQ (okbiz.jp)>。また、操作マニュアルは「勤務表」、「工数実績」の「? HELP」 タブから取得できます。",
    "日次承認済みの工数実績をデータとして取得可能となりました。レポートから「07_工数実績出力レポート」を選択してください。詳細な手順はHelpサイトにあります。"
  ]
}
```

---

## 勤怠記録

### GET /api/attendance/today

**詳細設計書**: テーブル取得仕様 No.2（当日勤怠情報取得）、編集仕様 No.2（当日勤怠情報編集）  
**説明**: 当日の勤怠情報を取得する

#### リクエストパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| employeeId | string | ○ | 従業員ID（6桁の数字） |

#### レスポンス（成功 - 勤怠記録あり）

```json
{
  "success": true,
  "attendance": {
    "attendanceId": 1,
    "clockInTime": "2025-12-08T09:00:00.000Z",
    "clockOutTime": null,
    "workLocationCode": "COMMUTE",
    "isClockInDone": true,
    "isClockOutDone": false,
    "isOnBreak": false
  }
}
```

#### レスポンス（成功 - 勤怠記録なし）

```json
{
  "success": true,
  "attendance": null
}
```

---

### POST /api/attendance/clock-in

**機能一覧**: API_TS_0101  
**詳細設計書**: テーブル更新仕様 No.1（出勤打刻登録）、イベント処理: 出勤打刻処理（clockIn）  
**説明**: 出勤時刻を現在時刻で記録する。中断後の再開にも使用される。

#### リクエスト

```json
{
  "employeeId": "000001",
  "workLocationCode": "COMMUTE"
}
```

**注意**: 
- 初回出勤打刻時は新規レコードを作成
- 中断後の再開時は休憩終了時刻を記録
- `workLocationCode`は省略可能（出勤打刻時は選択されていない場合がある）

#### レスポンス（成功）

```json
{
  "success": true,
  "message": "出勤打刻が完了しました。",
  "attendanceId": 1
}
```

---

### POST /api/attendance/clock-in-scheduled

**機能一覧**: API_TS_0103  
**詳細設計書**: テーブル更新仕様 No.2（定時出勤打刻登録）、イベント処理: 定時出勤打刻処理（clockInScheduled）  
**説明**: 定時出勤時刻（9:00）を記録する

#### リクエスト

```json
{
  "employeeId": "000001",
  "workLocationCode": "COMMUTE"
}
```

**注意**: 
- 現在時刻が9:00以前の場合のみ使用可能
- 9:00以降は通常の出勤打刻を使用
- `workLocationCode`は省略可能

#### レスポンス（成功）

```json
{
  "success": true,
  "message": "定時出勤打刻が完了しました。",
  "attendanceId": 1
}
```

---

### POST /api/attendance/clock-out

**機能一覧**: API_TS_0102  
**詳細設計書**: 
- テーブル更新仕様 No.3（退勤打刻登録）
- テーブル更新仕様 No.5（休憩開始登録）
- イベント処理: 退勤打刻処理（clockOut）、中断打刻処理（breakStart）

**説明**: 退勤時刻を記録する。中断開始（休憩開始）にも使用される。

#### リクエスト

```json
{
  "employeeId": "000001",
  "workLocationCode": "COMMUTE"
}
```

**注意**: 
- 中断中でない場合：休憩開始を記録（中断開始）
- 中断中の場合：休憩終了 + 退勤時刻を記録
- **重要**: 退勤打刻時に選択されている`workLocationCode`が確定値として保存される

#### レスポンス（成功 - 中断開始）

```json
{
  "success": true,
  "message": "休憩開始を記録しました。",
  "isOnBreak": true
}
```

#### レスポンス（成功 - 退勤打刻）

```json
{
  "success": true,
  "message": "退勤打刻が完了しました。",
  "isOnBreak": false
}
```

---

### POST /api/attendance/clock-out-scheduled

**機能一覧**: API_TS_0104  
**詳細設計書**: テーブル更新仕様 No.4（定時退勤打刻登録）、イベント処理: 定時退勤打刻処理（clockOutScheduled）  
**説明**: 定時退勤時刻（17:30）を記録する

#### リクエスト

```json
{
  "employeeId": "000001",
  "workLocationCode": "COMMUTE"
}
```

**注意**: 
- 現在時刻が17:30以降の場合のみ使用可能
- 17:30以前は通常の退勤打刻を使用
- **重要**: 定時退勤打刻時に選択されている`workLocationCode`が確定値として保存される

#### レスポンス（成功）

```json
{
  "success": true,
  "message": "定時退勤打刻が完了しました。"
}
```

---

### PUT /api/attendance/work-location

**機能一覧**: API_TS_0105  
**説明**: 勤務場所を設定する

#### リクエスト

```json
{
  "employeeId": "000001",
  "workLocationCode": "REMOTE"
}
```

**注意**: 
- 当日の勤怠記録が存在する必要がある
- 業務開始時（出勤打刻時）と業務終了時（退勤打刻時）に勤務場所を選択する
- **重要**: 退勤打刻時に選択されている勤務場所が確定値として保存される

#### レスポンス（成功）

```json
{
  "success": true,
  "message": "勤務場所を設定しました。"
}
```

---

## マスタデータ

### GET /api/master/work-locations

**機能一覧**: API_TS_0301  
**説明**: 勤務場所マスタを取得する

#### レスポンス（成功）

```json
{
  "success": true,
  "workLocations": [
    {
      "LOCATION_CODE": "COMMUTE",
      "LOCATION_NAME": "通勤",
      "DISPLAY_ORDER": 1
    },
    {
      "LOCATION_CODE": "REMOTE",
      "LOCATION_NAME": "在宅",
      "DISPLAY_ORDER": 2
    },
    {
      "LOCATION_CODE": "DIRECT_BOTH",
      "LOCATION_NAME": "直行直帰",
      "DISPLAY_ORDER": 3
    },
    {
      "LOCATION_CODE": "BUSINESS_TRIP",
      "LOCATION_NAME": "出張",
      "DISPLAY_ORDER": 4
    }
  ]
}
```

---

### GET /api/master/jobs

**機能一覧**: API_TS_0302  
**説明**: ジョブマスタを取得する

#### レスポンス（成功）

```json
{
  "success": true,
  "jobs": [
    {
      "JOB_CODE": "ZXXXA2506B",
      "JOB_NAME": "ZXXXA2506B 人推_育成活動実施25152025-300／00X100 00X収益",
      "JOB_CATEGORY": "プロジェクト",
      "PROJECT_CODE": "25152025-300",
      "START_DATE": "2025-01-01",
      "END_DATE": "2025-12-31"
    }
  ]
}
```

---

### GET /api/master/vacation-types

**機能一覧**: API_TS_0303  
**説明**: 休暇種別マスタを取得する

#### レスポンス（成功）

```json
{
  "success": true,
  "vacationTypes": [
    {
      "VACATION_TYPE_CODE": "PAID_LEAVE",
      "VACATION_TYPE_NAME": "有給休暇",
      "VACATION_CATEGORY": "有給",
      "IS_PAID": 1,
      "ANNUAL_GRANT_DAYS": 20.0,
      "DISPLAY_ORDER": 1
    }
  ]
}
```

---

## エラーレスポンス

すべてのAPIで共通のエラーレスポンス形式を使用します。

### バリデーションエラー（400 Bad Request）

```json
{
  "success": false,
  "message": "従業員IDが必要です。"
}
```

### 認証エラー（401 Unauthorized）

```json
{
  "success": false,
  "message": "社員コードまたはパスワードが違います。"
}
```

### リソースが見つからない（404 Not Found）

```json
{
  "success": false,
  "message": "従業員が見つかりません。"
}
```

### サーバーエラー（500 Internal Server Error）

```json
{
  "success": false,
  "message": "サーバーエラーが発生しました。"
}
```

---

## 業務ルール

### 勤務場所の選択

1. 勤務場所は日ごとに「通勤」「在宅」「直行直帰」「出張」のいずれか1つを選択可能
2. 業務開始時（出勤打刻時）と業務終了時（退勤打刻時）にそれぞれ勤務場所を選択する必要がある
3. **重要**: 当日の勤務場所は、業務終了時（退勤打刻時）に選択されていた勤務場所が確定値として保存される
4. 同日内で通勤と在宅が混在した場合は「通勤」として入力する
5. 「在宅」を選択すると通勤手当は支給されない

### 定時出勤・定時退勤ボタン

1. 定時出勤ボタンは9:00より前のみ活性化される。押下すると9:00出勤として記録
2. 定時退勤ボタンは17:30以降のみ活性化される。押下すると17:30退勤として記録

### 中断・再開機能

1. 勤務を中断する際は「退勤」ボタンから打刻する。打刻した時刻が休憩時間の開始時刻となる
2. 勤務を再開する際は「出勤」ボタンから打刻する。打刻した時刻が休憩時間の終了時刻となる
3. 退勤打刻から出勤打刻までの時間は休憩時間として自動的に記録される

### 打刻の区別

- 打刻：`CLOCK_IN_TYPE = 'STAMP'` または `CLOCK_OUT_TYPE = 'STAMP'`
- 手入力：`CLOCK_IN_TYPE = 'MANUAL'` または `CLOCK_OUT_TYPE = 'MANUAL'`
- 定時：`CLOCK_IN_TYPE = 'SCHEDULED'` または `CLOCK_OUT_TYPE = 'SCHEDULED'`

---

## データベーステーブル

### 使用テーブル

1. **EMPLOYEE（従業員マスタ）**
   - ログイン認証後の従業員情報取得に使用
   - `EMPLOYEE_ID`、`EMPLOYEE_NAME`、`DEPARTMENT`を参照

2. **NOTIFICATION（お知らせマスタ）**
   - お知らせ情報の表示に使用
   - `TARGET_TYPE`（対象種別）、`TARGET_ID`（対象ID）で絞り込み
   - `DISPLAY_START_DATE`、`DISPLAY_END_DATE`で表示期間を制御

3. **ATTENDANCE_RECORD（勤怠記録）**
   - 出退勤打刻の記録に使用
   - `EMPLOYEE_ID` + `WORK_DATE`でユニーク制約
   - `CLOCK_IN_TIME`、`CLOCK_OUT_TIME`、`CLOCK_IN_TYPE`、`CLOCK_OUT_TYPE`、`WORK_LOCATION_CODE`を更新

4. **WORK_LOCATION（勤務場所マスタ）**
   - 勤務場所の選択肢表示に使用
   - `LOCATION_CODE`、`LOCATION_NAME`を参照

5. **BREAK_TIME（休憩時間）**
   - 中断・再開時の休憩時間記録に使用
   - `ATTENDANCE_ID`で勤怠記録と紐付け
   - `BREAK_SEQ`で複数の休憩時間帯に対応

---

## セキュリティ要件

1. **認証チェック**
   - 画面表示前にログイン状態を確認
   - セッションタイムアウト時はログイン画面にリダイレクト

2. **権限チェック**
   - ログインユーザーの従業員IDと一致する勤怠記録のみ操作可能
   - 他ユーザーの勤怠記録は参照・更新不可

3. **入力値検証**
   - クライアント側とサーバー側の両方で入力値を検証
   - SQLインジェクション対策を実施（パラメータ化クエリ使用）

---

## 非機能要件

1. **パフォーマンス**
   - 初期表示は3秒以内に完了
   - 打刻ボタン押下後、1秒以内にレスポンス

2. **可用性**
   - システム稼働率99.9%以上
   - 打刻データのバックアップを1日1回実施

3. **トランザクション管理**
   - 打刻処理はトランザクションで保護
   - エラー時は自動的にロールバック

---

## 変更履歴

| 日付 | 変更内容 | 変更者 |
|------|----------|--------|
| 2025-12-08 | 初版作成 | AI Assistant |















