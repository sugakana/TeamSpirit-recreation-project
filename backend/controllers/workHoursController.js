/**
 * 工数実績コントローラー
 */
const workHoursService = require('../services/workHoursService');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { validateQuery, validateBody } = require('../utils/validationHelper');

/**
 * 工数実績取得
 */
const getWorkHours = async (req, res, next) => {
  try {
    const { employeeId, workDate } = req.query;
    
    const validationError = validateQuery(req.query, ['employeeId', 'workDate']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    const workHours = await workHoursService.getWorkHours(employeeId, workDate);
    
    return sendSuccess(res, { workHours });
  } catch (error) {
    next(error);
  }
};

/**
 * 工数実績登録・更新
 */
const saveWorkHours = async (req, res, next) => {
  try {
    const workHoursData = req.body;
    
    const validationError = validateBody(req.body, ['employeeId', 'workDate', 'jobCode']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    await workHoursService.saveWorkHours(workHoursData);
    
    return sendSuccess(res, {}, '工数実績を登録しました。');
  } catch (error) {
    next(error);
  }
};

/**
 * 工数実績削除
 */
const deleteWorkHours = async (req, res, next) => {
  try {
    const { workHoursId } = req.params;
    
    if (!workHoursId) {
      return sendError(res, '工数実績IDが必要です。');
    }
    
    await workHoursService.deleteWorkHours(workHoursId);
    
    return sendSuccess(res, {}, '工数実績を削除しました。');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkHours,
  saveWorkHours,
  deleteWorkHours
};


