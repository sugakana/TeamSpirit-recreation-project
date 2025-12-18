-- ====================================================================
-- TeamSpirit勤怠管理システム
-- ORIGINAL_CLOCK_IN_TIMEとORIGINAL_CLOCK_OUT_TIMEの状態確認スクリプト
-- 作成日: 2025-12-09
-- 
-- データベース内の打刻時刻データの状態を確認するためのスクリプト
-- ====================================================================

USE teamspirit_db;

-- 出社時刻の状態を確認
SELECT 
    ATTENDANCE_ID,
    EMPLOYEE_ID,
    WORK_DATE,
    CLOCK_IN_TIME,
    CLOCK_IN_TYPE,
    ORIGINAL_CLOCK_IN_TIME,
    CASE 
        WHEN CLOCK_IN_TYPE = 'MANUAL' AND ORIGINAL_CLOCK_IN_TIME IS NOT NULL THEN '手入力（元の打刻時刻あり）'
        WHEN CLOCK_IN_TYPE = 'MANUAL' AND ORIGINAL_CLOCK_IN_TIME IS NULL THEN '手入力（元の打刻時刻なし）'
        WHEN CLOCK_IN_TYPE = 'STAMP' THEN '打刻'
        ELSE 'その他'
    END AS STATUS_IN
FROM ATTENDANCE_RECORD
WHERE CLOCK_IN_TIME IS NOT NULL
ORDER BY WORK_DATE DESC
LIMIT 10;

-- 退社時刻の状態を確認
SELECT 
    ATTENDANCE_ID,
    EMPLOYEE_ID,
    WORK_DATE,
    CLOCK_OUT_TIME,
    CLOCK_OUT_TYPE,
    ORIGINAL_CLOCK_OUT_TIME,
    CASE 
        WHEN CLOCK_OUT_TYPE = 'MANUAL' AND ORIGINAL_CLOCK_OUT_TIME IS NOT NULL THEN '手入力（元の打刻時刻あり）'
        WHEN CLOCK_OUT_TYPE = 'MANUAL' AND ORIGINAL_CLOCK_OUT_TIME IS NULL THEN '手入力（元の打刻時刻なし）'
        WHEN CLOCK_OUT_TYPE = 'STAMP' THEN '打刻'
        ELSE 'その他'
    END AS STATUS_OUT
FROM ATTENDANCE_RECORD
WHERE CLOCK_OUT_TIME IS NOT NULL
ORDER BY WORK_DATE DESC
LIMIT 10;

