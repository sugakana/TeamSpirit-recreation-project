/**
 * ORIGINAL_CLOCK_IN_TIMEとORIGINAL_CLOCK_OUT_TIMEカラム追加スクリプト
 */
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function addColumns() {
  let connection;
  
  try {
    // データベース接続
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'teamspirit_db',
      multipleStatements: true
    });
    
    console.log('データベースに接続しました');
    
    // カラムが存在するかチェック
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'ATTENDANCE_RECORD' 
        AND COLUMN_NAME IN ('ORIGINAL_CLOCK_IN_TIME', 'ORIGINAL_CLOCK_OUT_TIME')
    `, [process.env.DB_NAME || 'teamspirit_db']);
    
    const existingColumns = columns.map(c => c.COLUMN_NAME);
    
    // ORIGINAL_CLOCK_IN_TIMEカラムを追加
    if (!existingColumns.includes('ORIGINAL_CLOCK_IN_TIME')) {
      await connection.execute(`
        ALTER TABLE ATTENDANCE_RECORD 
        ADD COLUMN ORIGINAL_CLOCK_IN_TIME DATETIME COMMENT '出勤打刻時刻: 打刻機による元の時刻。手入力で変更されても保持される。形式YYYY-MM-DD HH:MM:SS' AFTER CLOCK_OUT_TYPE
      `);
      console.log('✓ ORIGINAL_CLOCK_IN_TIMEカラムを追加しました');
    } else {
      console.log('✓ ORIGINAL_CLOCK_IN_TIMEカラムは既に存在します');
    }
    
    // ORIGINAL_CLOCK_OUT_TIMEカラムを追加
    if (!existingColumns.includes('ORIGINAL_CLOCK_OUT_TIME')) {
      await connection.execute(`
        ALTER TABLE ATTENDANCE_RECORD 
        ADD COLUMN ORIGINAL_CLOCK_OUT_TIME DATETIME COMMENT '退勤打刻時刻: 打刻機による元の時刻。手入力で変更されても保持される。形式YYYY-MM-DD HH:MM:SS' AFTER ORIGINAL_CLOCK_IN_TIME
      `);
      console.log('✓ ORIGINAL_CLOCK_OUT_TIMEカラムを追加しました');
    } else {
      console.log('✓ ORIGINAL_CLOCK_OUT_TIMEカラムは既に存在します');
    }
    
    // 既存データの移行（CLOCK_IN_TYPEがSTAMPの場合はCLOCK_IN_TIMEをORIGINAL_CLOCK_IN_TIMEに設定）
    const [result1] = await connection.execute(`
      UPDATE ATTENDANCE_RECORD 
      SET ORIGINAL_CLOCK_IN_TIME = CLOCK_IN_TIME 
      WHERE ATTENDANCE_ID > 0 
        AND CLOCK_IN_TYPE = 'STAMP' 
        AND (ORIGINAL_CLOCK_IN_TIME IS NULL OR ORIGINAL_CLOCK_IN_TIME = '0000-00-00 00:00:00')
    `);
    console.log(`✓ 出社時刻の移行: ${result1.affectedRows}件のレコードを更新しました`);
    
    // 既存データの移行（CLOCK_OUT_TYPEがSTAMPの場合はCLOCK_OUT_TIMEをORIGINAL_CLOCK_OUT_TIMEに設定）
    const [result2] = await connection.execute(`
      UPDATE ATTENDANCE_RECORD 
      SET ORIGINAL_CLOCK_OUT_TIME = CLOCK_OUT_TIME 
      WHERE ATTENDANCE_ID > 0 
        AND CLOCK_OUT_TYPE = 'STAMP' 
        AND (ORIGINAL_CLOCK_OUT_TIME IS NULL OR ORIGINAL_CLOCK_OUT_TIME = '0000-00-00 00:00:00')
    `);
    console.log(`✓ 退社時刻の移行: ${result2.affectedRows}件のレコードを更新しました`);
    
    console.log('\n✓ カラム追加が完了しました！');
    
  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    console.error('エラー詳細:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('データベース接続を閉じました');
    }
  }
}

// スクリプト実行
addColumns();








