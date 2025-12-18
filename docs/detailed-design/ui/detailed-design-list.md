# TeamSpirit勤怠管理システム - UI詳細設計書一覧

## 概要

本ドキュメントは、TeamSpirit勤怠管理システムのUI詳細設計書の一覧です。各画面の詳細設計書へのリンクと、画面の概要を記載しています。

## 詳細設計書一覧

| No | 画面ID | 画面名 | 機能概要 | ファイル名 | ステータス | 最終更新日 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SCR_TS_000101 | ログイン画面 | 社員コードとパスワードによる認証機能 | [login-screen.md](./login-screen.md) | 作成済み | 2025-11-27 |
| 2 | SCR_TS_010101 | ホーム画面 | WEBタイムレコーダーによる出退勤打刻、勤務場所選択、お知らせ表示 | [home-screen.md](./home-screen.md) | 作成済み | 2025-12-01 |
| 3 | SCR_TS_020101 | 勤務表画面 | 月次の勤怠データ一覧表示、各種申請への導線 | [attendance-table-screen.md](./attendance-table-screen.md) | 作成済み | 2025-12-08 |
| 4 | SCR_TS_020201 | 勤怠関連申請画面 | 日次確定、休暇申請、休日出勤申請、残業申請、早朝勤務申請、振替申請 | [attendance-application-screen.md](./attendance-application-screen.md) | 作成済み | 2025-12-08 |
| 5 | SCR_TS_020301 | 勤怠情報入力画面 | 出社・退社時刻、休憩時間、公用外出、勤務場所の手入力 | [attendance-input-dialog.md](./attendance-input-dialog.md) | 作成済み | 2025-12-09 |
| 6 | SCR_TS_020401 | 工数実績入力画面 | タスクごとの作業時間入力（スライダー/手入力）、合計時間表示 | [job-input-dialog.md](./job-input-dialog.md) | 作成済み | 2025-12-09 |
| 7 | SCR_TS_020501 | 月次サマリー情報画面 | 月間の勤務表データ一覧表示と月次勤怠サマリー情報の表示 | [monthly-summary-screen.md](./monthly-summary-screen.md) | 作成済み | 2025-12-08 |

## ステータス定義

- **作成済み**: 詳細設計書が完成し、レビュー待ちまたはレビュー完了
- **作成中**: 詳細設計書を作成中
- **未着手**: 詳細設計書の作成が未着手

## 作成ルール

詳細設計書の作成ルールについては、[R030201_ui_detailed_design.mdc](../../../rules/R03_Detailed_Design/R0302_Ui_Detailed_Design/R030201_ui_detailed_design.mdc) を参照してください。

## 変更履歴

| 日付 | 変更内容 | 変更者 |
|------|----------|--------|
| 2025-11-27 | 初版作成（ログイン画面追加） | AI Assistant |
| 2025-12-01 | ホーム画面追加 | AI Assistant |
| 2025-12-08 | 勤務表画面、勤怠関連申請画面追加 | AI Assistant |
| 2025-12-08 | 月次サマリー情報画面追加 | AI Assistant |
| 2025-12-09 | 勤怠情報入力画面追加 | AI Assistant |
| 2025-12-09 | 工数実績入力画面追加 | AI Assistant |




