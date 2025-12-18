/**
 * エラーハンドリングミドルウェア
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // データベース接続エラーの処理
  if (err.code === 'ECONNREFUSED') {
    return res.status(500).json({
      success: false,
      message: 'データベース接続エラー: MySQLサーバーに接続できません。MySQLサーバーが起動しているか確認してください。'
    });
  }
  
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(500).json({
      success: false,
      message: 'データベース接続エラー: ユーザー名またはパスワードが間違っています。.envファイルの設定を確認してください。'
    });
  }
  
  if (err.code === 'ER_BAD_DB_ERROR') {
    return res.status(500).json({
      success: false,
      message: 'データベース接続エラー: データベース「teamspirit_db」が存在しません。mysql_table_design.sqlを実行してください。'
    });
  }
  
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ETIMEDOUT') {
    return res.status(500).json({
      success: false,
      message: 'データベース接続エラー: データベースへの接続がタイムアウトしました。接続設定を確認してください。'
    });
  }
  
  // その他のデータベースエラー
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(500).json({
      success: false,
      message: `データベースエラー: ${err.sqlMessage || err.message}`
    });
  }
  
  // その他のエラー
  let errorMessage = undefined;

  if (process.env.NODE_ENV === 'development') {
    errorMessage = err.message;
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'サーバーエラーが発生しました。',
    error: errorMessage
  });
};

/**
 * 404ハンドリングミドルウェア
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'リクエストされたリソースが見つかりません。'
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};



