/**
 * 月次サマリーコントローラー
 */
const monthlySummaryService = require('../services/monthlySummaryService');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { validateQuery } = require('../utils/validationHelper');

/**
 * 月次サマリー情報取得
 */
const getMonthlySummary = async (req, res, next) => {
  try {
    const { employeeId, yearMonth } = req.query;
    
    const validationError = validateQuery(req.query, ['employeeId', 'yearMonth']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    // 対象年月の形式チェック（YYYY-MM形式）
    if (!/^\d{4}-\d{2}$/.test(yearMonth)) {
      return sendError(res, '対象年月の形式が正しくありません。YYYY-MM形式で指定してください。');
    }
    
    const result = await monthlySummaryService.getMonthlySummary(employeeId, yearMonth);
    
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMonthlySummary
};

