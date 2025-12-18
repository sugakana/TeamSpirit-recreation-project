-- ====================================================================
-- 000001の2025年10月分勤怠サンプルデータ削除
-- ====================================================================

-- 休憩時間データの削除（ATTENDANCE_RECORD削除前に削除）
-- BREAK_TIMEテーブルはATTENDANCE_RECORDの外部キーでCASCADE DELETEが設定されているため、
-- ATTENDANCE_RECORDを削除すれば自動的に削除されますが、明示的に削除します
DELETE bt FROM BREAK_TIME bt
INNER JOIN ATTENDANCE_RECORD ar ON bt.ATTENDANCE_ID = ar.ATTENDANCE_ID
WHERE ar.EMPLOYEE_ID = '000001' 
  AND ar.WORK_DATE BETWEEN '2025-10-01' AND '2025-10-31';

-- 勤怠記録データの削除
DELETE FROM ATTENDANCE_RECORD
WHERE EMPLOYEE_ID = '000001' 
  AND WORK_DATE BETWEEN '2025-10-01' AND '2025-10-31';

