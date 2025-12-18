const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'teamspirit_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// デバッグ用: 環境変数の読み込み確認（パスワードは表示しない）
console.log('環境変数の読み込み確認:');
console.log('  DB_HOST:', process.env.DB_HOST || '未設定（デフォルト: localhost）');
console.log('  DB_PORT:', process.env.DB_PORT || '未設定（デフォルト: 3306）');
console.log('  DB_USER:', process.env.DB_USER || '未設定（デフォルト: root）');
console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? '***設定済み***' : '***未設定***');
console.log('  DB_NAME:', process.env.DB_NAME || '未設定（デフォルト: teamspirit_db）');

// コネクションプールを作成
const pool = mysql.createPool(dbConfig);

// 接続テスト
pool.getConnection()
  .then(connection => {
    console.log('MySQL接続成功');
    console.log('接続情報:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user
    });
    connection.release();
  })
  .catch(err => {
    console.error('MySQL接続エラー:', err);
    console.error('エラー詳細:', {
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage
    });
    console.error('接続設定:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      password: dbConfig.password ? '***設定済み***' : '***未設定***'
    });
  });

module.exports = pool;

