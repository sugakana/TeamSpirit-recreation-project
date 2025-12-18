/**
 * 月次サマリーコントローラー
 */
const monthlySummaryService = require('../services/monthlySummaryService');

/**
 * 月次サマリー情報取得
 */
const getMonthlySummary = async (req, res, next) => {
  try {
    const { employeeId, yearMonth } = req.query;
    
    if (!employeeId || !yearMonth) {
      return res.status(400).json({
        success: false,
        message: '従業員IDと対象年月が必要です。'
      });
    }
    
    // 対象年月の形式チェック（YYYY-MM形式）
    if (!/^\d{4}-\d{2}$/.test(yearMonth)) {
      return res.status(400).json({
        success: false,
        message: '対象年月の形式が正しくありません。YYYY-MM形式で指定してください。'
      });
    }
    
    const result = await monthlySummaryService.getMonthlySummary(employeeId, yearMonth);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMonthlySummary
};

