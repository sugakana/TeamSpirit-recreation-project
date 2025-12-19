/**
 * レスポンスヘルパー
 * コントローラーでのレスポンス生成を共通化する。
 */

/**
 * 成功レスポンスを返す。
 *
 * @param {Object} res Expressレスポンスオブジェクト
 * @param {Object} data レスポンスデータ
 * @param {string} message メッセージ（オプション）
 * @param {number} statusCode HTTPステータスコード（デフォルト: 200）
 */
const sendSuccess = (res, data = {}, message = null, statusCode = 200) => {
  const response = {
    success: true,
    ...data
  };
  
  if (message) {
    response.message = message;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * エラーレスポンスを返す。
 *
 * @param {Object} res Expressレスポンスオブジェクト
 * @param {string} message エラーメッセージ
 * @param {number} statusCode HTTPステータスコード（デフォルト: 400）
 */
const sendError = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = {
  sendSuccess,
  sendError
};
