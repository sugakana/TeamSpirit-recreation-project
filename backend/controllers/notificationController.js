/**
 * お知らせコントローラー
 */
const notificationService = require('../services/notificationService');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { validateQuery } = require('../utils/validationHelper');

/**
 * お知らせ情報取得
 */
const getNotifications = async (req, res, next) => {
  try {
    const { employeeId } = req.query;
    
    const validationError = validateQuery(req.query, ['employeeId']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    const notifications = await notificationService.getNotifications(employeeId);
    
    return sendSuccess(res, { notifications });
  } catch (error) {
    if (error.message === '従業員が見つかりません。') {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
};

module.exports = {
  getNotifications
};


