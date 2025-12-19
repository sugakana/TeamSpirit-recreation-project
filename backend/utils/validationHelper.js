/**
 * バリデーションヘルパー
 * コントローラーでのバリデーション処理を共通化する。
 */

/**
 * 必須パラメータをチェックする。
 *
 * @param {Object} params チェック対象のパラメータオブジェクト
 * @param {Array<string>} requiredFields 必須フィールド名の配列
 * @returns {Object|null} エラー情報（エラーがない場合はnull）
 */
const validateRequired = (params, requiredFields) => {
  const missingFields = requiredFields.filter(field => {
    const value = params[field];
    return value === undefined || value === null || value === '';
  });
  
  if (missingFields.length > 0) {
    const fieldNames = missingFields.join('、');
    return {
      message: `${fieldNames}が必要です。`
    };
  }
  
  return null;
};

/**
 * クエリパラメータから必須フィールドをチェックする。
 *
 * @param {Object} query クエリパラメータ
 * @param {Array<string>} requiredFields 必須フィールド名の配列
 * @returns {Object|null} エラー情報（エラーがない場合はnull）
 */
const validateQuery = (query, requiredFields) => {
  return validateRequired(query, requiredFields);
};

/**
 * リクエストボディから必須フィールドをチェックする。
 *
 * @param {Object} body リクエストボディ
 * @param {Array<string>} requiredFields 必須フィールド名の配列
 * @returns {Object|null} エラー情報（エラーがない場合はnull）
 */
const validateBody = (body, requiredFields) => {
  return validateRequired(body, requiredFields);
};

module.exports = {
  validateRequired,
  validateQuery,
  validateBody
};
