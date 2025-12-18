# TeamSpirit 機能一覧

| # | 分類 | 種別 | 機能ID | 機能和名 | 機能英名 | サブ機能和名 | サブ機能英名 | 画面ID | 画面和名 | 画面英名 | 利用者 | 機能概要 | 処理概要(画面アクション) | 処理概要 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | ログイン | 画面 | SCR_TS_0001 | ログイン | Login | N/A | N/A | SCR_TS_000101 | ログイン画面 | LoginScreen | 従業員 | システムへのログイン認証を行う | 初期表示 | 社員コードとパスワードの入力欄を表示する |
| 2 | ログイン | 画面 | SCR_TS_0001 | ログイン | Login | N/A | N/A | SCR_TS_000101 | ログイン画面 | LoginScreen | 従業員 | システムへのログイン認証を行う | 社員コード_入力 | 社員コード（EMPLOYEE_ID）を入力する |
| 3 | ログイン | 画面 | SCR_TS_0001 | ログイン | Login | N/A | N/A | SCR_TS_000101 | ログイン画面 | LoginScreen | 従業員 | システムへのログイン認証を行う | パスワード_入力 | パスワードを入力する（マスク表示） |
| 4 | ログイン | 画面 | SCR_TS_0001 | ログイン | Login | N/A | N/A | SCR_TS_000101 | ログイン画面 | LoginScreen | 従業員 | システムへのログイン認証を行う | ログインボタン_押下 | 社員コードとパスワードで認証を行う。認証成功時はホーム画面へ遷移、認証失敗時はエラーメッセージを表示 |
| 5 | ログイン | 画面 | SCR_TS_0001 | ログイン | Login | N/A | N/A | SCR_TS_000101 | ログイン画面 | LoginScreen | 従業員 | システムへのログイン認証を行う | 認証処理_実行 | EMPLOYEEテーブルでEMPLOYEE_IDとPASSWORDが一致し、IS_ACTIVE=TRUEの従業員のみログイン可能 |
| 6 | ホーム | 画面 | SCR_TS_0101 | ホーム | Home | N/A | N/A | SCR_TS_010101 | メイン | Main | 従業員 | ホーム画面のメイン表示。勤怠入力、お知らせ表示を含む | 初期表示 | ホーム画面を表示する。勤怠入力エリアとお知らせ表示エリアを含む |
| 7 | ホーム | 画面 | SCR_TS_0102 | 勤怠入力 | AttendanceInput | N/A | N/A | SCR_TS_010201 | 勤怠入力 | AttendanceInput | 従業員 | ホーム画面での勤怠情報の入力（WEBタイムレコーダー） | 出勤ボタン_押下 | 出勤時刻を現在時刻で記録する |
| 8 | ホーム | 画面 | SCR_TS_0102 | 勤怠入力 | AttendanceInput | N/A | N/A | SCR_TS_010201 | 勤怠入力 | AttendanceInput | 従業員 | ホーム画面での勤怠情報の入力（WEBタイムレコーダー） | 退勤ボタン_押下 | 退勤時刻を現在時刻で記録する |
| 9 | ホーム | 画面 | SCR_TS_0102 | 勤怠入力 | AttendanceInput | N/A | N/A | SCR_TS_010201 | 勤怠入力 | AttendanceInput | 従業員 | ホーム画面での勤怠情報の入力（WEBタイムレコーダー） | 定時出勤ボタン_押下 | 定時出勤時刻（9:00）を記録する。定時出勤時刻（9:00）より前に押下した場合は自動的に9:00出勤として記録する。定時後は使用不可 |
| 10 | ホーム | 画面 | SCR_TS_0102 | 勤怠入力 | AttendanceInput | N/A | N/A | SCR_TS_010201 | 勤怠入力 | AttendanceInput | 従業員 | ホーム画面での勤怠情報の入力（WEBタイムレコーダー） | 定時退勤ボタン_押下 | 定時退勤時刻（17:30）を記録する。定時退勤時刻（17:30）より後に押下した場合は自動的に17:30退勤として記録する。定時前は使用不可 |
| 11 | ホーム | 画面 | SCR_TS_0102 | 勤怠入力 | AttendanceInput | N/A | N/A | SCR_TS_010201 | 勤怠入力 | AttendanceInput | 従業員 | ホーム画面での勤怠情報の入力（WEBタイムレコーダー） | 中断_退勤ボタン押下 | 勤務を中断する際に退勤ボタンから打刻する。打刻時刻が休憩時間の開始時刻となる |
| 12 | ホーム | 画面 | SCR_TS_0102 | 勤怠入力 | AttendanceInput | N/A | N/A | SCR_TS_010201 | 勤怠入力 | AttendanceInput | 従業員 | ホーム画面での勤怠情報の入力（WEBタイムレコーダー） | 再開_出勤ボタン押下 | 勤務を再開する際に出勤ボタンから打刻する。打刻時刻が休憩時間の終了時刻となる。退勤打刻から出勤打刻までの時間は休憩時間として自動的に記録される |
| 13 | ホーム | 画面 | SCR_TS_0102 | 勤怠入力 | AttendanceInput | N/A | N/A | SCR_TS_010201 | 勤怠入力 | AttendanceInput | 従業員 | ホーム画面での勤怠情報の入力（WEBタイムレコーダー） | 勤務場所ボタン_選択 | 業務開始時と業務終了時に勤務場所（通勤、在宅、直行、直帰、直行直帰、出張）を選択する |
| 14 | ホーム | 画面 | SCR_TS_0102 | 勤怠入力 | AttendanceInput | N/A | N/A | SCR_TS_010201 | 勤怠入力 | AttendanceInput | 従業員 | ホーム画面での勤怠情報の入力（WEBタイムレコーダー） | 通勤ボタン_押下 | 勤務場所を「通勤」として設定する |
| 15 | ホーム | 画面 | SCR_TS_0102 | 勤怠入力 | AttendanceInput | N/A | N/A | SCR_TS_010201 | 勤怠入力 | AttendanceInput | 従業員 | ホーム画面での勤怠情報の入力（WEBタイムレコーダー） | 在宅ボタン_押下 | 勤務場所を「在宅」として設定する |
| 16 | ホーム | 画面 | SCR_TS_0102 | 勤怠入力 | AttendanceInput | N/A | N/A | SCR_TS_010201 | 勤怠入力 | AttendanceInput | 従業員 | ホーム画面での勤怠情報の入力（WEBタイムレコーダー） | 直行・直帰・直行直帰ボタン_押下 | 勤務場所を「直行」「直帰」「直行直帰」として設定する |
| 17 | ホーム | 画面 | SCR_TS_0102 | 勤怠入力 | AttendanceInput | N/A | N/A | SCR_TS_010201 | 勤怠入力 | AttendanceInput | 従業員 | ホーム画面での勤怠情報の入力（WEBタイムレコーダー） | 出張ボタン_押下 | 勤務場所を「出張」として設定する |
| 18 | ホーム | 画面 | SCR_TS_0103 | お知らせ表示 | NotificationDisplay | N/A | N/A | SCR_TS_010301 | お知らせ | Notification | 従業員 | システムからのお知らせを表示する | 初期表示 | 固定文言（ユーザー、グループ）でのお知らせを表示。切り替え大差異は不要 |
| 19 | 勤務表 | 画面 | SCR_TS_0201 | 勤務表 | AttendanceTable | N/A | N/A | SCR_TS_020101 | メイン | Main |従業員 | 月間の勤務表を表示し、各種勤務情報の入力・確認を行う | 初期表示 | 月間カレンダー形式で勤務表を表示。出退勤時刻、休憩時間、工数などを表示。出退勤時刻は背景色で手入力と打刻を区別（打刻は黄色、手入力は白色） |
| 20 | 勤務表 | 画面 | SCR_TS_0201 | 勤務表 | AttendanceTable | N/A | N/A | SCR_TS_020101 | メイン | Main |従業員 | 月間の勤務表を表示し、各種勤務情報の入力・確認を行う | 勤務状況グラフ_表示 | 勤務状況に応じてグラフの色を表示（本来勤務時間、実際の勤務時間、法定休日の勤務時間、休憩時間など） |
| 21 | 勤務表 | 画面 | SCR_TS_0201 | 勤務表 | AttendanceTable | N/A | N/A | SCR_TS_020101 | メイン | Main |従業員 | 月間の勤務表を表示し、各種勤務情報の入力・確認を行う | 出勤欄_押下 | 出勤欄（左側）をクリックすると動意情報入力ダイアログが表示される |
| 22 | 勤務表 | 画面 | SCR_TS_0201 | 勤務表 | AttendanceTable | N/A | N/A | SCR_TS_020101 | メイン | Main |従業員 | 月間の勤務表を表示し、各種勤務情報の入力・確認を行う | 退勤欄_押下 | 退勤欄（右側）をクリックすると動意情報入力ダイアログが表示される |
| 23 | 勤務表 | 画面 | SCR_TS_0201 | 勤務表 | AttendanceTable | N/A | N/A | SCR_TS_020101 | メイン | Main |従業員 | 月間の勤務表を表示し、各種勤務情報の入力・確認を行う | 工数欄_押下 | 工数欄の+アイコンをクリックすると工数実績入力ダイアログが表示される |
| 24 | 勤務表 | 画面 | SCR_TS_0201 | 勤務表 | AttendanceTable | N/A | N/A | SCR_TS_020101 | メイン | Main |従業員 | 月間の勤務表を表示し、各種勤務情報の入力・確認を行う | 備考欄_押下 | 備考欄をクリックすると備考ダイアログが表示される |
| 25 | 勤務表 | 画面 | SCR_TS_0202 | 勤務情報入力 | AttendanceInfoInput | 出退勤時刻入力 | ClockInOutInput | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 出社時刻、退勤時刻の入力を行う | 出社列テキストボックス_押下 | 出社列のテキストボックスを押下すると勤怠情報入力画面が表示される |
| 26 | 勤務表 | 画面 | SCR_TS_0202 | 勤務情報入力 | AttendanceInfoInput | 出退勤時刻入力 | ClockInOutInput | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 出社時刻、退勤時刻の入力を行う | 退社列テキストボックス_押下 | 退社列のテキストボックスを押下すると勤怠情報入力画面が表示される |
| 27 | 勤務表 | 画面 | SCR_TS_0202 | 勤務情報入力 | AttendanceInfoInput | 出退勤時刻入力 | ClockInOutInput | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 出社時刻、退勤時刻の入力を行う | 出社時刻_入力 | 出社時刻を入力する |
| 28 | 勤務表 | 画面 | SCR_TS_0202 | 勤務情報入力 | AttendanceInfoInput | 出退勤時刻入力 | ClockInOutInput | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 出社時刻、退勤時刻の入力を行う | 退社時刻_入力 | 退社時刻を入力する |
| 29 | 勤務表 | 画面 | SCR_TS_0203 | 勤務情報入力 | AttendanceInfoInput | 休憩入力 | BreakInput | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 休憩時間の入力を行う（複数の休憩時間帯に対応） | 休憩1開始時刻_入力 | 休憩1の開始時刻を入力する |
| 30 | 勤務表 | 画面 | SCR_TS_0203 | 勤務情報入力 | AttendanceInfoInput | 休憩入力 | BreakInput | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 休憩時間の入力を行う（複数の休憩時間帯に対応） | 休憩1終了時刻_入力 | 休憩1の終了時刻を入力する |
| 31 | 勤務表 | 画面 | SCR_TS_0203 | 勤務情報入力 | AttendanceInfoInput | 休憩入力 | BreakInput | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 休憩時間の入力を行う（複数の休憩時間帯に対応） | 休憩2開始時刻_入力 | 休憩2の開始時刻を入力する |
| 32 | 勤務表 | 画面 | SCR_TS_0203 | 勤務情報入力 | AttendanceInfoInput | 休憩入力 | BreakInput | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 休憩時間の入力を行う（複数の休憩時間帯に対応） | 休憩2終了時刻_入力 | 休憩2の終了時刻を入力する |
| 33 | 勤務表 | 画面 | SCR_TS_0203 | 勤務情報入力 | AttendanceInfoInput | 休憩入力 | BreakInput | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 休憩時間の入力を行う（複数の休憩時間帯に対応） | 休憩追加_押下 | 休憩2の+ボタンを押して休憩3の入力欄を追加表示する |
| 34 | 勤務表 | 画面 | SCR_TS_0204 | 勤務情報入力 | AttendanceInfoInput | 公用外出入力 | OfficialOuting | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 公用外出時間の入力を行う（複数の公用外出時間帯に対応） | 公用外出1開始時刻_入力 | 公用外出1の開始時刻を入力する |
| 35 | 勤務表 | 画面 | SCR_TS_0204 | 勤務情報入力 | AttendanceInfoInput | 公用外出入力 | OfficialOuting | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 公用外出時間の入力を行う（複数の公用外出時間帯に対応） | 公用外出1終了時刻_入力 | 公用外出1の終了時刻を入力する |
| 36 | 勤務表 | 画面 | SCR_TS_0204 | 勤務情報入力 | AttendanceInfoInput | 公用外出入力 | OfficialOuting | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 公用外出時間の入力を行う（複数の公用外出時間帯に対応） | 公用外出2開始時刻_入力 | 公用外出2の開始時刻を入力する |
| 37 | 勤務表 | 画面 | SCR_TS_0204 | 勤務情報入力 | AttendanceInfoInput | 公用外出入力 | OfficialOuting | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 公用外出時間の入力を行う（複数の公用外出時間帯に対応） | 公用外出2終了時刻_入力 | 公用外出2の終了時刻を入力する |
| 38 | 勤務表 | 画面 | SCR_TS_0204 | 勤務情報入力 | AttendanceInfoInput | 公用外出入力 | OfficialOuting | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 公用外出時間の入力を行う（複数の公用外出時間帯に対応） | 公用外出追加_押下 | 公用外出2の+ボタンを押して公用外出3の入力欄を追加表示する |
| 39 | 勤務表 | 画面 | SCR_TS_0205 | 勤務情報入力 | AttendanceInfoInput | 勤務場所選択 | WorkLocationSelection | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤務場所の選択を行う | 勤務場所列テキストボックス_押下 | 勤務場所列のテキストボックスを押下すると勤怠情報入力画面が表示される |
| 40 | 勤務表 | 画面 | SCR_TS_0205 | 勤務情報入力 | AttendanceInfoInput | 勤務場所選択 | WorkLocationSelection | SCR_TS_020201 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤務場所の選択を行う | 勤務場所_選択 | ドロップダウンから勤務場所（通勤、在宅、直行、直帰、直行直帰、出張）を選択する |
| 41 | 勤務表 | 画面 | SCR_TS_0206 | UI表示ヘッダー | DisplayHeader | N/A | N/A | SCR_TS_020401 | ヘッダー | Header | 従業員 | 勤務表のヘッダー部分の表示 | 初期表示 | 年月選択、各種ボタンなどのヘッダー情報を表示 |
| 42 | 勤務表 | 画面 | SCR_TS_0207 | UI表示勤務表 | DisplayAttendanceTable | N/A | N/A | SCR_TS_020501 | 勤務表 | AttendanceTable | 従業員 | 月間勤務表の表示（カレンダー形式） | 初期表示 | カレンダー形式で勤務状況を可視化。日別の勤務時間、休憩時間をグラフィカルに表示 |
| 43 | 勤務表 | 画面 | SCR_TS_0208 | UI表示サマリー | DisplaySummary | N/A | N/A | SCR_TS_020601 | サマリー（下部） | Summary | 従業員 | 勤務表下部に表示される集計情報 | 初期表示 | 月間の勤務時間集計、残業時間、休暇日数などを表示 |
| 44 | 勤務表 | 画面 | SCR_TS_0209 | 勤務関連申請 | AttendanceApplication | N/A | N/A | SCR_TS_020701 | 申請 | Application | 従業員 | 各種勤務に関する申請機能 | 申請_押下 | 残業申請、振替休日申請などの申請処理を行う |
| 45 | 勤務表 | 画面 | SCR_TS_0210 | 動意情報入力 | ManualAttendanceInput | N/A | N/A | SCR_TS_021001 | 動意情報入力画面 | ManualAttendanceInputDialog | 従業員 | WEBタイムレコーダーで打刻できなかった場合に手動で勤務時間を入力する機能 | 出勤退勤欄_押下 | 勤務表画面の出勤または退勤欄をクリックして動意情報入力画面を表示 |
| 46 | 勤務表 | 画面 | SCR_TS_0210 | 動意情報入力 | ManualAttendanceInput | N/A | N/A | SCR_TS_021001 | 動意情報入力画面 | ManualAttendanceInputDialog | 従業員 | WEBタイムレコーダーで打刻できなかった場合に手動で勤務時間を入力する機能 | 初期表示 | 日付、出社時刻、退社時刻、休憩1、休憩2、公用外出1、公用外出2、勤務場所（ドロップダウン）の入力欄を表示 |
| 47 | 勤務表 | 画面 | SCR_TS_0210 | 動意情報入力 | ManualAttendanceInput | N/A | N/A | SCR_TS_021001 | 動意情報入力画面 | ManualAttendanceInputDialog | 従業員 | WEBタイムレコーダーで打刻できなかった場合に手動で勤務時間を入力する機能 | 出社時刻_入力 | 出社時刻を手動で入力する |
| 48 | 勤務表 | 画面 | SCR_TS_0210 | 動意情報入力 | ManualAttendanceInput | N/A | N/A | SCR_TS_021001 | 動意情報入力画面 | ManualAttendanceInputDialog | 従業員 | WEBタイムレコーダーで打刻できなかった場合に手動で勤務時間を入力する機能 | 退社時刻_入力 | 退社時刻を手動で入力する |
| 49 | 勤務表 | 画面 | SCR_TS_0210 | 動意情報入力 | ManualAttendanceInput | N/A | N/A | SCR_TS_021001 | 動意情報入力画面 | ManualAttendanceInputDialog | 従業員 | WEBタイムレコーダーで打刻できなかった場合に手動で勤務時間を入力する機能 | 勤務場所_選択 | ドロップダウンから勤務場所（在宅、通勤など）を選択する |
| 50 | 勤務表 | 画面 | SCR_TS_0210 | 動意情報入力 | ManualAttendanceInput | N/A | N/A | SCR_TS_021001 | 動意情報入力画面 | ManualAttendanceInputDialog | 従業員 | WEBタイムレコーダーで打刻できなかった場合に手動で勤務時間を入力する機能 | 登録_押下 | 動意情報を登録する |
| 51 | 勤務表 | 画面 | SCR_TS_0210 | 動意情報入力 | ManualAttendanceInput | N/A | N/A | SCR_TS_021001 | 動意情報入力画面 | ManualAttendanceInputDialog | 従業員 | WEBタイムレコーダーで打刻できなかった場合に手動で勤務時間を入力する機能 | キャンセル_押下 | 入力内容を破棄して画面を閉じる |
| 52 | 勤務表 | 画面 | SCR_TS_0210 | 動意情報入力 | ManualAttendanceInput | N/A | N/A | SCR_TS_021001 | 動意情報入力画面 | ManualAttendanceInputDialog | 従業員 | WEBタイムレコーダーで打刻できなかった場合に手動で勤務時間を入力する機能 | リセット_押下 | 入力内容をクリアする |
| 53 | 勤務表 | 画面 | SCR_TS_0210 | 動意情報入力 | ManualAttendanceInput | N/A | N/A | SCR_TS_021001 | 動意情報入力画面 | ManualAttendanceInputDialog | 従業員 | WEBタイムレコーダーで打刻できなかった場合に手動で勤務時間を入力する機能 | 備考欄_押下 | 勤務表画面の備考欄(＋マーク)を押下して備考ダイアログを表示 |
| 54 | 勤務表 | 画面 | SCR_TS_0210 | 動意情報入力 | ManualAttendanceInput | N/A | N/A | SCR_TS_021001 | 動意情報入力画面 | ManualAttendanceInputDialog | 従業員 | WEBタイムレコーダーで打刻できなかった場合に手動で勤務時間を入力する機能 | 備考理由_入力 | 打刻できなかった理由を備考欄に入力する（手入力の場合は理由入力必須） |
| 55 | 勤務表 | 画面 | SCR_TS_0211 | 日次確定 | DailyConfirmation | N/A | N/A | SCR_TS_020801 | 日次確定 | DailyConfirmation | 従業員 | 日々の勤務内容を確定する機能（日次申請のチェック処理は実施対象） | 日付欄_押下 | 勤務表画面の日付欄をクリックして日次確定申請を行う |
| 56 | 勤務表 | 画面 | SCR_TS_0211 | 日次確定 | DailyConfirmation | N/A | N/A | SCR_TS_020801 | 日次確定 | DailyConfirmation | 従業員 | 日々の勤務内容を確定する機能（日次申請のチェック処理は実施対象） | 日次確定申請_実行 | 日次の勤務内容を確定申請する。申請ボタンのアイコンが変わる |
| 57 | 勤務表 | 画面 | SCR_TS_0211 | 日次確定 | DailyConfirmation | N/A | N/A | SCR_TS_020801 | 日次確定 | DailyConfirmation | 従業員 | 日々の勤務内容を確定する機能（日次申請のチェック処理は実施対象） | 申請状態_表示 | 日次確定申請が行われると、申請ボタンのアイコンが↑（未申請）から別のアイコンに変わる |
| 58 | 勤務表 | 画面 | SCR_TS_0211 | 日次確定 | DailyConfirmation | N/A | N/A | SCR_TS_020801 | 日次確定 | DailyConfirmation | 従業員 | 日々の勤務内容を確定する機能（日次申請のチェック処理は実施対象） | 日次確定申請取消_押下 | 日付欄を押下して「動意関連申請」ダイアログを表示し、申請取消ボタンをクリックする |
| 59 | 勤務表 | 画面 | SCR_TS_0211 | 日次確定 | DailyConfirmation | N/A | N/A | SCR_TS_020801 | 日次確定 | DailyConfirmation | 従業員 | 日々の勤務内容を確定する機能（日次申請のチェック処理は実施対象） | 申請取消確認_実行 | 申請取消の確認ダイアログでOKボタンをクリックして申請を取り消す |
| 60 | 勤務表 | 画面 | SCR_TS_0212 | 備考入力 | RemarksInput | N/A | N/A | SCR_TS_020901 | 備考入力画面 | RemarksInputDialog | 従業員 | 勤務に関する備考を入力する機能 | 備考_押下 | 備考入力画面を表示 |
| 61 | 勤務表 | 画面 | SCR_TS_0212 | 備考入力 | RemarksInput | N/A | N/A | SCR_TS_020901 | 備考入力画面 | RemarksInputDialog | 従業員 | 勤務に関する備考を入力する機能 | 初期表示 | 選択した日付と既存の備考内容を表示 |
| 62 | 勤務表 | 画面 | SCR_TS_0212 | 備考入力 | RemarksInput | N/A | N/A | SCR_TS_020901 | 備考入力画面 | RemarksInputDialog | 従業員 | 勤務に関する備考を入力する機能 | 備考テキスト_入力 | 日付ごとにテキスト形式で備考を入力（出退打刻なしの場合は理由入力が必須） |
| 63 | 勤務表 | 画面 | SCR_TS_0212 | 備考入力 | RemarksInput | N/A | N/A | SCR_TS_020901 | 備考入力画面 | RemarksInputDialog | 従業員 | 勤務に関する備考を入力する機能 | 登録_押下 | 入力した備考を登録 |
| 64 | 勤務表 | 画面 | SCR_TS_0212 | 備考入力 | RemarksInput | N/A | N/A | SCR_TS_020901 | 備考入力画面 | RemarksInputDialog | 従業員 | 勤務に関する備考を入力する機能 | キャンセル_押下 | 入力内容を破棄して画面を閉じる |
| 65 | 勤務表 | 画面 | SCR_TS_0213 | 工数実績入力 | WorkHoursInput | N/A | N/A | SCR_TS_021301 | 工数実績入力画面 | WorkHoursInputDialog | 従業員 | プロジェクトやタスクに対する工数を入力する機能 | 工数欄_押下 | 勤務表画面の工数欄にある+アイコンをクリックして工数実績入力画面を表示 |
| 66 | 勤務表 | 画面 | SCR_TS_0213 | 工数実績入力 | WorkHoursInput | N/A | N/A | SCR_TS_021301 | 工数実績入力画面 | WorkHoursInputDialog | 従業員 | プロジェクトやタスクに対する工数を入力する機能 | 初期表示 | 選択した日付、アサインされたジョブ（プロジェクト・固定値）、既存の工数情報を表示 |
| 67 | 勤務表 | 画面 | SCR_TS_0213 | 工数実績入力 | WorkHoursInput | N/A | N/A | SCR_TS_021301 | 工数実績入力画面 | WorkHoursInputDialog | 従業員 | プロジェクトやタスクに対する工数を入力する機能 | ジョブ_表示 | 固定値として設定されたジョブ（プロジェクト）を表示。タスク検索も可能 |
| 68 | 勤務表 | 画面 | SCR_TS_0213 | 工数実績入力 | WorkHoursInput | N/A | N/A | SCR_TS_021301 | 工数実績入力画面 | WorkHoursInputDialog | 従業員 | プロジェクトやタスクに対する工数を入力する機能 | 工数時間_スライダー入力 | スライダーを動かして工数時間を入力（0〜10時間、または0〜10段階のボリューム） |
| 69 | 勤務表 | 画面 | SCR_TS_0213 | 工数実績入力 | WorkHoursInput | N/A | N/A | SCR_TS_021301 | 工数実績入力画面 | WorkHoursInputDialog | 従業員 | プロジェクトやタスクに対する工数を入力する機能 | 工数時間_数値入力 | 工数時間を数値で直接入力 |
| 70 | 勤務表 | 画面 | SCR_TS_0213 | 工数実績入力 | WorkHoursInput | N/A | N/A | SCR_TS_021301 | 工数実績入力画面 | WorkHoursInputDialog | 従業員 | プロジェクトやタスクに対する工数を入力する機能 | 作業コード_入力 | 作業コードを入力 |
| 71 | 勤務表 | 画面 | SCR_TS_0213 | 工数実績入力 | WorkHoursInput | N/A | N/A | SCR_TS_021301 | 工数実績入力画面 | WorkHoursInputDialog | 従業員 | プロジェクトやタスクに対する工数を入力する機能 | 時計マーク_押下 | タスクが複数ある場合、時計マークをクリックすると1日の実労働時間を作業時間として設定 |
| 72 | 勤務表 | 画面 | SCR_TS_0213 | 工数実績入力 | WorkHoursInput | N/A | N/A | SCR_TS_021301 | 工数実績入力画面 | WorkHoursInputDialog | 従業員 | プロジェクトやタスクに対する工数を入力する機能 | 合計時間_表示 | 入力した工数の合計時間を表示し、実労働時間と一致するように設定 |
| 73 | 勤務表 | 画面 | SCR_TS_0213 | 工数実績入力 | WorkHoursInput | N/A | N/A | SCR_TS_021301 | 工数実績入力画面 | WorkHoursInputDialog | 従業員 | プロジェクトやタスクに対する工数を入力する機能 | 登録_押下 | 入力した工数情報を登録 |
| 74 | 勤務表 | 画面 | SCR_TS_0213 | 工数実績入力 | WorkHoursInput | N/A | N/A | SCR_TS_021301 | 工数実績入力画面 | WorkHoursInputDialog | 従業員 | プロジェクトやタスクに対する工数を入力する機能 | キャンセル_押下 | 入力内容を破棄して画面を閉じる |
| 75 | 勤務表 | 画面 | SCR_TS_0214 | 月次サマリー表示 | MonthlySummaryDisplay | N/A | N/A | SCR_TS_021101 | 月次サマリー画面 | MonthlySummaryDialog | 従業員 | 月間の勤務情報の集計表示 | 月次サマリー_押下 | 月次サマリー画面を表示 |
| 76 | 勤務表 | 画面 | SCR_TS_0214 | 月次サマリー表示 | MonthlySummaryDisplay | N/A | N/A | SCR_TS_021101 | 月次サマリー画面 | MonthlySummaryDialog | 従業員 | 月間の勤務情報の集計表示 | 初期表示 | 月間勤務時間、残業時間、深夜時間などの詳細集計を表示 |
| 77 | 勤務表 | 画面 | SCR_TS_0214 | 月次サマリー表示 | MonthlySummaryDisplay | N/A | N/A | SCR_TS_021101 | 月次サマリー画面 | MonthlySummaryDialog | 従業員 | 月間の勤務情報の集計表示 | 勤務日数_表示 | 実働日数、休暇日数などを表示 |
| 78 | 勤務表 | 画面 | SCR_TS_0214 | 月次サマリー表示 | MonthlySummaryDisplay | N/A | N/A | SCR_TS_021101 | 月次サマリー画面 | MonthlySummaryDialog | 従業員 | 月間の勤務情報の集計表示 | 勤務時間集計_表示 | 総勤務時間、所定勤務時間、実勤務時間などを表示 |
| 79 | 勤務表 | 画面 | SCR_TS_0214 | 月次サマリー表示 | MonthlySummaryDisplay | N/A | N/A | SCR_TS_021101 | 月次サマリー画面 | MonthlySummaryDialog | 従業員 | 月間の勤務情報の集計表示 | 残業時間集計_表示 | 残業時間、深夜残業時間、休日勤務時間などを表示 |
| 80 | 勤務表 | 画面 | SCR_TS_0214 | 月次サマリー表示 | MonthlySummaryDisplay | N/A | N/A | SCR_TS_021101 | 月次サマリー画面 | MonthlySummaryDialog | 従業員 | 月間の勤務情報の集計表示 | 閉じる_押下 | 月次サマリー画面を閉じる |
| 81 | 勤務表 | 画面 | SCR_TS_0215 | 休暇情報 | VacationInfo | N/A | N/A | SCR_TS_021201 | 個人休暇表示画面 | PersonalVacationDialog | 従業員 | 有給休暇などの休暇情報の表示 | 休暇情報_押下 | 個人休暇表示画面を表示 |
| 82 | 勤務表 | 画面 | SCR_TS_0215 | 休暇情報 | VacationInfo | N/A | N/A | SCR_TS_021201 | 個人休暇表示画面 | PersonalVacationDialog | 従業員 | 有給休暇などの休暇情報の表示 | 初期表示 | 休暇残日数、取得履歴、休暇種別ごとの情報を表示 |
| 83 | 勤務表 | 画面 | SCR_TS_0215 | 休暇情報 | VacationInfo | N/A | N/A | SCR_TS_021201 | 個人休暇表示画面 | PersonalVacationDialog | 従業員 | 有給休暇などの休暇情報の表示 | 休暇種別_表示 | 有給休暇、特別休暇などの休暇種別を表示 |
| 84 | 勤務表 | 画面 | SCR_TS_0215 | 休暇情報 | VacationInfo | N/A | N/A | SCR_TS_021201 | 個人休暇表示画面 | PersonalVacationDialog | 従業員 | 有給休暇などの休暇情報の表示 | 休暇残日数_表示 | 各休暇種別の残日数と付与日数を表示 |
| 85 | 勤務表 | 画面 | SCR_TS_0215 | 休暇情報 | VacationInfo | N/A | N/A | SCR_TS_021201 | 個人休暇表示画面 | PersonalVacationDialog | 従業員 | 有給休暇などの休暇情報の表示 | 休暇取得履歴_表示 | 過去の休暇取得履歴（日付、種別、日数）を表示 |
| 86 | 勤務表 | 画面 | SCR_TS_0215 | 休暇情報 | VacationInfo | N/A | N/A | SCR_TS_021201 | 個人休暇表示画面 | PersonalVacationDialog | 従業員 | 有給休暇などの休暇情報の表示 | 閉じる_押下 | 個人休暇表示画面を閉じる |
| 87 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 初期表示 | 日付選択、出社時刻、退社時刻、休憩時間1・2の開始終了時刻、公用外出1・2の開始終了時刻、勤務場所（ドロップダウン）、日次確定するチェックボックスなどの入力欄を表示 |
| 88 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 出社時刻_入力 | 出社時刻を入力する（例：8:46） |
| 89 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 退社時刻_入力 | 退社時刻を入力する |
| 90 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 休憩1開始時刻_入力 | 休憩1の開始時刻を入力する（例：12:00） |
| 91 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 休憩1終了時刻_入力 | 休憩1の終了時刻を入力する（例：13:00） |
| 92 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 休憩2開始時刻_入力 | 休憩2の開始時刻を入力する |
| 93 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 休憩2終了時刻_入力 | 休憩2の終了時刻を入力する |
| 94 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 休憩追加_押下 | 休憩2の+ボタンを押して休憩3の入力欄を追加表示する |
| 95 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 休憩3開始時刻_入力 | 休憩3の開始時刻を入力する（追加表示後） |
| 96 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 休憩3終了時刻_入力 | 休憩3の終了時刻を入力する（追加表示後） |
| 97 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 公用外出1開始時刻_入力 | 公用外出1の開始時刻を入力する |
| 98 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 公用外出1終了時刻_入力 | 公用外出1の終了時刻を入力する |
| 99 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 公用外出2開始時刻_入力 | 公用外出2の開始時刻を入力する |
| 100 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 公用外出2終了時刻_入力 | 公用外出2の終了時刻を入力する |
| 101 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 公用外出追加_押下 | 公用外出2の+ボタンを押して公用外出3の入力欄を追加表示する |
| 102 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 公用外出3開始時刻_入力 | 公用外出3の開始時刻を入力する（追加表示後） |
| 103 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 公用外出3終了時刻_入力 | 公用外出3の終了時刻を入力する（追加表示後） |
| 104 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 勤務場所_選択 | ドロップダウンから勤務場所（通勤、在宅、直行、直帰、直行直帰、出張）を選択する |
| 105 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 日次確定する_チェック | 日次確定するチェックボックスをオン/オフする |
| 106 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | 登録_押下 | 入力内容を登録する |
| 107 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | キャンセル_押下 | 入力内容を破棄して画面を閉じる |
| 108 | 勤務表 | 画面 | SCR_TS_0216 | 勤怠情報入力画面 | AttendanceInputDialog | N/A | N/A | SCR_TS_021401 | 勤怠情報入力画面 | AttendanceInputDialog | 従業員 | 勤怠情報の詳細入力を行う画面 | リセット_押下 | 入力内容をクリアする |
| 109 | ログイン | API | API_TS_0001 | ログイン認証 | LoginAuth | N/A | N/A | N/A | N/A | N/A | 従業員 | 社員コードとパスワードによる認証を行う | POST /api/auth/login | リクエストボディにEMPLOYEE_IDとPASSWORDを受け取り、EMPLOYEEテーブルで認証。認証成功時はJWTトークンまたはセッション情報を返却。IS_ACTIVE=TRUEの従業員のみ認証可能 |
| 110 | ログイン | API | API_TS_0002 | ログアウト | Logout | N/A | N/A | N/A | N/A | N/A | 従業員 | ログアウト処理を行う | POST /api/auth/logout | 【未実装】セッションを無効化またはトークンを無効化する |
| 111 | ホーム | API | API_TS_0101 | 出勤打刻 | ClockIn | N/A | N/A | N/A | N/A | N/A | 従業員 | 出勤時刻を現在時刻で記録する | POST /api/clock/clock-in | リクエストにEMPLOYEE_IDとWORK_LOCATION_CODEを受け取り、CLOCK_IN_TIMEを現在時刻で記録。CLOCK_IN_TYPE='STAMP'としてATTENDANCE_RECORDに登録または更新。中断後の再開時にも使用可能 |
| 112 | ホーム | API | API_TS_0102 | 退勤打刻 | ClockOut | N/A | N/A | N/A | N/A | N/A | 従業員 | 退勤時刻を現在時刻で記録する | POST /api/clock/clock-out | リクエストにEMPLOYEE_IDとWORK_LOCATION_CODEを受け取り、CLOCK_OUT_TIMEを現在時刻で記録。CLOCK_OUT_TYPE='STAMP'としてATTENDANCE_RECORDを更新。実労働時間を自動計算。中断開始時にも使用可能 |
| 113 | ホーム | API | API_TS_0103 | 定時出勤打刻 | ScheduledClockIn | N/A | N/A | N/A | N/A | N/A | 従業員 | 定時出勤時刻（9:00）を記録する | POST /api/clock/clock-in-scheduled | リクエストにEMPLOYEE_IDとWORK_LOCATION_CODEを受け取り、定時出勤時刻（9:00）を記録。現在時刻が9:00より前の場合は9:00、9:00以降はエラー。CLOCK_IN_TYPE='SCHEDULED'として記録 |
| 114 | ホーム | API | API_TS_0104 | 定時退勤打刻 | ScheduledClockOut | N/A | N/A | N/A | N/A | N/A | 従業員 | 定時退勤時刻（17:30）を記録する | POST /api/clock/clock-out-scheduled | リクエストにEMPLOYEE_IDとWORK_LOCATION_CODEを受け取り、定時退勤時刻（17:30）を記録。現在時刻が17:30より後の場合は17:30、17:30以前はエラー。CLOCK_OUT_TYPE='SCHEDULED'として記録 |
| 115 | ホーム | API | API_TS_0105 | 勤務場所設定 | SetWorkLocation | N/A | N/A | N/A | N/A | N/A | 従業員 | 勤務場所を設定する | PUT /api/attendance/record | リクエストにEMPLOYEE_ID、WORK_DATE、WORK_LOCATION_CODEを受け取り、ATTENDANCE_RECORDのWORK_LOCATION_CODEを更新。勤務場所は打刻時（clock-in/clock-out）にも設定可能 |
| 115-1 | ホーム | API | API_TS_0107 | 当日勤怠情報取得 | GetTodayAttendance | N/A | N/A | N/A | N/A | N/A | 従業員 | 当日の勤怠情報を取得する | GET /api/clock/today | リクエストにEMPLOYEE_IDを受け取り、当日の勤怠記録（出退勤時刻、勤務場所、中断状態など）を取得 |
| 116 | ホーム | API | API_TS_0106 | お知らせ取得 | GetNotifications | N/A | N/A | N/A | N/A | N/A | 従業員 | お知らせ情報を取得する | GET /api/notifications | リクエストにEMPLOYEE_IDまたはDEPARTMENTを受け取り、NOTIFICATIONテーブルから表示期間内のお知らせを取得。NOTIFICATION_TYPE（USER/GROUP）でフィルタリング |
| 117 | 勤務表 | API | API_TS_0201 | 月間勤務表取得 | GetMonthlyAttendance | N/A | N/A | N/A | N/A | N/A | 従業員 | 指定年月の勤務表データを取得する | GET /api/attendance/monthly | リクエストにEMPLOYEE_ID、YEAR、MONTHを受け取り、ATTENDANCE_RECORD、BREAK_TIME、OFFICIAL_OUTING、WORK_HOURSを結合して月間の勤務データを返却 |
| 118 | 勤務表 | API | API_TS_0202 | 日次勤怠記録取得 | GetDailyAttendance | N/A | N/A | N/A | N/A | N/A | 従業員 | 指定日の勤怠記録を取得する | GET /api/attendance/daily | リクエストにEMPLOYEE_ID、WORK_DATE（YYYY-MM-DD）を受け取り、ATTENDANCE_RECORD、BREAK_TIME、OFFICIAL_OUTING、WORK_HOURSを結合して日次の勤務データを返却 |
| 119 | 勤務表 | API | API_TS_0203 | 勤怠記録登録・更新 | UpsertAttendanceRecord | N/A | N/A | N/A | N/A | N/A | 従業員 | 勤怠記録を登録または更新する | PUT /api/attendance/record | リクエストにEMPLOYEE_ID、WORK_DATE、CLOCK_IN_TIME、CLOCK_OUT_TIME、CLOCK_IN_TYPE、CLOCK_OUT_TYPE、WORK_LOCATION_CODE、REMARK_TEXT、breakTimesを受け取り、ATTENDANCE_RECORDに登録または更新。実労働時間を自動計算。部分更新対応（指定されていないフィールドは既存値を保持） |
| 120 | 勤務表 | API | API_TS_0204 | 休憩時間登録・更新 | UpsertBreakTime | N/A | N/A | N/A | N/A | N/A | 従業員 | 休憩時間を登録または更新する | POST /api/attendance/break-time | 【未実装（501エラー）】リクエストにATTENDANCE_ID、BREAK_SEQ、BREAK_START_TIME、BREAK_END_TIMEを受け取り、BREAK_TIMEテーブルに登録または更新。BREAK_DURATION_MINUTESを自動計算。現在はPUT /api/attendance/recordのbreakTimesパラメータで対応 |
| 121 | 勤務表 | API | API_TS_0205 | 公用外出登録・更新 | UpsertOfficialOuting | N/A | N/A | N/A | N/A | N/A | 従業員 | 公用外出を登録または更新する | POST /api/attendance/official-outing | 【未実装（501エラー）】リクエストにATTENDANCE_ID、OUTING_SEQ、OUTING_START_TIME、OUTING_END_TIME、OUTING_PURPOSEを受け取り、OFFICIAL_OUTINGテーブルに登録または更新。OUTING_DURATION_MINUTESを自動計算。現在はPUT /api/attendance/recordで対応予定 |
| 122 | 勤務表 | API | API_TS_0206 | 備考登録・更新 | UpsertRemarks | N/A | N/A | N/A | N/A | N/A | 従業員 | 備考を登録または更新する | PUT /api/attendance/record | リクエストにATTENDANCE_ID、REMARK_TEXTを受け取り、ATTENDANCE_RECORDのREMARK_TEXTを更新。手入力の場合は必須。独立したAPIではなくPUT /api/attendance/recordのREMARK_TEXTパラメータで対応 |
| 123 | 勤務表 | API | API_TS_0207 | 工数実績取得 | GetWorkHours | N/A | N/A | N/A | N/A | N/A | 従業員 | 指定日の工数実績を取得する | GET /api/work-hours | リクエストにEMPLOYEE_ID、WORK_DATE（YYYY-MM-DD）を受け取り、WORK_HOURSテーブルから該当日の工数実績を取得 |
| 119-1 | 勤務表 | API | API_TS_0203-1 | 当月時間外残業取得 | GetMonthlyOvertime | N/A | N/A | N/A | N/A | N/A | 従業員 | 指定年月の時間外残業時間を取得する | GET /api/attendance/monthly-overtime | リクエストにEMPLOYEE_ID、YEAR、MONTHを受け取り、当月の時間外残業時間を返却 |
| 124 | 勤務表 | API | API_TS_0208 | 工数実績登録・更新 | UpsertWorkHours | N/A | N/A | N/A | N/A | N/A | 従業員 | 工数実績を登録または更新する | POST /api/work-hours | リクエストにATTENDANCE_ID、EMPLOYEE_ID、WORK_DATE、JOB_CODE、WORK_CODE、WORK_HOURS_VALUE、WORK_VOLUME、INPUT_TYPEを受け取り、WORK_HOURSテーブルに登録または更新。工数合計と実労働時間の整合性チェック |
| 125 | 勤務表 | API | API_TS_0209 | 工数実績削除 | DeleteWorkHours | N/A | N/A | N/A | N/A | N/A | 従業員 | 工数実績を削除する | DELETE /api/work-hours/{workHoursId} | リクエストにWORK_HOURS_IDを受け取り、WORK_HOURSテーブルから該当レコードを削除 |
| 126 | 勤務表 | API | API_TS_0210 | 日次確定申請 | SubmitDailyConfirmation | N/A | N/A | N/A | N/A | N/A | 従業員 | 日次確定申請を行う | POST /api/attendance/daily-confirmation | リクエストにEMPLOYEE_ID、WORK_DATEを受け取り、勤務場所が設定されているか、工数合計と実労働時間が一致するかをチェック。問題なければIS_DAILY_CONFIRMED=TRUE、DAILY_CONFIRMED_ATを現在時刻で更新 |
| 127 | 勤務表 | API | API_TS_0211 | 日次確定申請取消 | CancelDailyConfirmation | N/A | N/A | N/A | N/A | N/A | 従業員 | 日次確定申請を取り消す | DELETE /api/attendance/daily-confirmation | リクエストにEMPLOYEE_ID、WORK_DATEを受け取り、IS_DAILY_CONFIRMED=FALSE、DAILY_CONFIRMED_AT=NULLに更新 |
| 128 | 勤務表 | API | API_TS_0212 | 月次サマリー取得 | GetMonthlySummary | N/A | N/A | N/A | N/A | N/A | 従業員 | 指定年月の月次サマリーを取得する | GET /api/monthly-summary/detail | リクエストにEMPLOYEE_ID、YEAR、MONTHを受け取り、V_MONTHLY_ATTENDANCEビューから月間の勤務時間集計、残業時間、深夜時間、休日勤務時間などを取得 |
| 129 | 勤務表 | API | API_TS_0213 | 休暇情報取得 | GetVacationInfo | N/A | N/A | N/A | N/A | N/A | 従業員 | 休暇残日数と取得履歴を取得する | GET /api/application/vacation-info | リクエストにEMPLOYEE_IDを受け取り、V_VACATION_BALANCE_SUMMARYビューから休暇残日数、VACATION_HISTORYテーブルから取得履歴を取得 |
| 129-1 | 勤務表 | API | API_TS_0213-1 | 有給残日数取得 | GetVacationBalance | N/A | N/A | N/A | N/A | N/A | 従業員 | 指定休暇種別の残日数を取得する | GET /api/application/vacation/balance | リクエストにEMPLOYEE_ID、vacationTypeCodeを受け取り、指定休暇種別の残日数を取得 |
| 109-1 | ログイン | API | API_TS_0001-1 | 従業員情報取得 | GetEmployee | N/A | N/A | N/A | N/A | N/A | 従業員 | 従業員情報を取得する | GET /api/auth/employee/:employeeId | リクエストパラメータにEMPLOYEE_IDを受け取り、EMPLOYEEテーブルから従業員情報を取得 |
| 130 | マスタ | API | API_TS_0301 | 勤務場所マスタ取得 | GetWorkLocations | N/A | N/A | N/A | N/A | N/A | 従業員 | 勤務場所マスタを取得する | GET /api/master/work-locations | WORK_LOCATIONテーブルからIS_ACTIVE=TRUEの勤務場所をDISPLAY_ORDER順で取得 |
| 131 | マスタ | API | API_TS_0302 | ジョブマスタ取得 | GetJobMaster | N/A | N/A | N/A | N/A | N/A | 従業員 | ジョブマスタを取得する | GET /api/master/jobs | JOB_MASTERテーブルからIS_ACTIVE=TRUEのジョブを取得。工数入力画面で使用 |
| 132 | マスタ | API | API_TS_0303 | 休暇種別マスタ取得 | GetVacationTypes | N/A | N/A | N/A | N/A | N/A | 従業員 | 休暇種別マスタを取得する | GET /api/master/vacation-types | VACATION_TYPEテーブルからIS_ACTIVE=TRUEの休暇種別をDISPLAY_ORDER順で取得 |

## 備考

### 対象機能
- ログイン画面: 社員コードとパスワードによる認証機能
- ホーム画面: WEBタイムレコーダーでの勤怠入力（出勤・退勤・定時出勤・定時退勤・中断再開）、勤務場所選択（通勤・在宅・直行直帰・出張）、お知らせ表示
- 勤務表画面: 出退勤時刻表示・入力、休憩入力、公用外出入力、勤務場所選択、備考入力、工数実績入力、動意情報入力（手入力）、月次サマリー表示、休暇情報、日次確定申請など
- 各種入力画面: 勤怠情報入力画面、動意情報入力画面、備考入力画面、工数実績入力画面、月次サマリー画面、個人休暇表示画面
- API機能: ログイン認証、従業員情報取得、ログアウト（未実装）、勤怠打刻（出勤・退勤・定時出勤・定時退勤）、当日勤怠情報取得、勤務場所設定、お知らせ取得、月間勤務表取得、日次勤怠記録取得、勤怠記録登録・更新、当月時間外残業取得、休憩時間登録・更新（未実装、PUT /api/attendance/recordで対応）、公用外出登録・更新（未実装）、備考登録・更新（PUT /api/attendance/recordで対応）、工数実績取得・登録・更新・削除、日次確定申請・取消、月次サマリー取得、休暇情報取得、有給残日数取得、マスタデータ取得（勤務場所・ジョブ・休暇種別）など

### 対象外機能（透明紫で囲っている範囲）
- **月次確定申請**: 月間の勤務内容を確定申請する機能
- **ジョブ追加画面**: 工数実績入力のジョブ追加画面（プロジェクトは固定値を使用）

### 特記事項
1. ログイン機能は社員コード（EMPLOYEE_ID）とパスワード（PASSWORD）で認証を行う
2. 認証時はEMPLOYEEテーブルのIS_ACTIVE=TRUEの従業員のみがログイン可能
3. サンプルログイン情報（テスト用）：
   - 社員コード: 000001、000002、000003
   - パスワード: **Password@1234**（全従業員共通）
   - 従業員: 山田 太郎、佐藤 花子、鈴木 次郎
4. パスワードは本番環境ではハッシュ化して保存することを推奨
5. お知らせ表示機能は固定文言（ユーザー、グループ）での切り替え。大差異は不要
6. 日次申請のチェック処理は実施対象
7. 勤務表は月間カレンダー形式で表示し、グラフィカルに勤務状況を可視化
8. 複数の休憩時間帯に対応（休憩時間1、2、3）
   - 初期表示は休憩1と休憩2のみ
   - 休憩3は+ボタンで追加表示
9. 複数の公用外出時間帯に対応（公用外出1、2、3）
   - 初期表示は公用外出1と公用外出2のみ
   - 公用外出3は+ボタンで追加表示
10. 工数入力はプロジェクト（ジョブ）を固定値として使用
11. 定時出勤時刻は9:00、定時退勤時刻は17:30として設定
12. 定時出勤ボタンは9:00より前に押下すると9:00出勤として記録。定時後は使用不可
13. 定時退勤ボタンは17:30より後に押下すると17:30退勤として記録。定時前は使用不可
14. 勤務場所は「通勤」「在宅」「直行」「直帰」「直行直帰」「出張」から選択可能
15. 同日内で通勤と在宅が混在した場合は「通勤」として入力する。在宅を選択すると通勤手当は支給されない
16. 勤務場所の変更で発生する中抜け時間は、退勤ボタン→出勤ボタンで打刻し、休憩時間として自動記録される
17. 勤怠情報入力画面では勤務場所をドロップダウンで選択
18. 勤怠情報入力画面は、出社列、退社列、勤務場所列のテキストボックスを押下することで表示される
19. 勤怠情報入力画面には「日次確定する」チェックボックスがあり、チェックすることで日次確定も同時に行える
20. 勤怠情報入力画面のボタンは「登録」「キャンセル」「リセット」の3つ
21. 出退勤の打刻と手入力は背景色で区別される（打刻：黄色、手入力：白色）
22. 動意情報入力（手入力）の場合は、備考欄に打刻できなかった理由を入力する必要がある
23. 勤務場所を入力しないと日次確定申請を行えない
24. 日次確定申請後は申請ボタンのアイコンが変わる
25. 日次確定申請の取消は、日付欄から「動意関連申請」ダイアログを開いて申請取消ボタンをクリックする
26. 工数実績入力は時間入力またはボリューム入力で行う（スライダーまたは数値入力）
27. 工数実績入力時に作業コードを入力する
28. 勤務時間と工数登録された作業時間に差異がある場合は日次確定申請が行えない（赤い!マークが表示される）
29. APIエンドポイントはRESTfulな設計に従う
30. API認証はJWTトークンまたはセッション管理で実装する
31. 日付フォーマットはYYYY-MM-DD、時刻フォーマットはHH:MM（APIリクエスト・レスポンス共通）
32. 実労働時間は出退勤時刻と休憩時間から自動計算される（ACTUAL_WORK_HOURS）
33. 日次確定申請時は勤務場所の設定が必須。工数合計と実労働時間の整合性チェックも実施
34. 休憩時間と公用外出時間は複数登録可能（BREAK_SEQ、OUTING_SEQで管理）
35. マスタデータ取得APIは画面のドロップダウンや選択肢の表示に使用
36. 打刻関連APIは `/api/clock/` 配下に実装されている
37. 勤務場所設定と備考登録・更新は独立したAPIではなく、PUT /api/attendance/recordで対応している
38. 休憩時間登録・更新API（POST /api/attendance/break-time）と公用外出登録・更新API（POST /api/attendance/official-outing）は未実装（501エラー）。現在はPUT /api/attendance/recordのbreakTimesパラメータで休憩時間を対応
39. 工数実績取得APIは `/api/work-hours` に実装されている（`/daily` パスは使用しない）
40. 月次サマリー取得APIは `/api/monthly-summary/detail` に実装されている
41. 休暇情報取得APIは `/api/application/vacation-info` に実装されている
42. 出勤打刻と退勤打刻は中断・再開機能にも対応しており、中断開始時は退勤打刻、再開時は出勤打刻を使用する
43. 打刻時に勤務場所（WORK_LOCATION_CODE）を設定可能で、退勤打刻時に選択されている勤務場所が確定値として保存される

