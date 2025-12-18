/**
 * お知らせコントローラー
 */
const notificationService = require('../services/notificationService');

/**
 * お知らせ情報取得
 */
const getNotifications = async (req, res, next) => {
  try {
    const { employeeId } = req.query;
    
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: '従業員IDが必要です。'
      });
    }
    
    const notifications = await notificationService.getNotifications(employeeId);
    
    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    if (error.message === '従業員が見つかりません。') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

module.exports = {
  getNotifications
};


