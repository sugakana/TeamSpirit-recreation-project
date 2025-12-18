-- ====================================================================
-- TeamSpirit勤怠管理システム
-- ORIGINAL_CLOCK_IN_TIMEとORIGINAL_CLOCK_OUT_TIMEの既存データ移行スクリプト
-- 作成日: 2025-12-09
-- 
-- カラムが既に追加されている場合に、既存データを移行するためのスクリプト
-- ====================================================================

USE teamspirit_db;

-- 既存データの移行（CLOCK_IN_TYPEがSTAMPの場合はCLOCK_IN_TIMEをORIGINAL_CLOCK_IN_TIMEに設定）
-- MySQLのsafe update modeに対応するため、WHERE句に主キー（ATTENDANCE_ID）を含める
UPDATE ATTENDANCE_RECORD 
SET ORIGINAL_CLOCK_IN_TIME = CLOCK_IN_TIME 
WHERE ATTENDANCE_ID > 0 
  AND CLOCK_IN_TYPE = 'STAMP' 
  AND ORIGINAL_CLOCK_IN_TIME IS NULL;

-- 既存データの移行（CLOCK_OUT_TYPEがSTAMPの場合はCLOCK_OUT_TIMEをORIGINAL_CLOCK_OUT_TIMEに設定）
-- MySQLのsafe update modeに対応するため、WHERE句に主キー（ATTENDANCE_ID）を含める
UPDATE ATTENDANCE_RECORD 
SET ORIGINAL_CLOCK_OUT_TIME = CLOCK_OUT_TIME 
WHERE ATTENDANCE_ID > 0 
  AND CLOCK_OUT_TYPE = 'STAMP' 
  AND ORIGINAL_CLOCK_OUT_TIME IS NULL;

