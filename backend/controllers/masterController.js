/**
 * マスタコントローラー
 */
const masterService = require('../services/masterService');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { validateQuery } = require('../utils/validationHelper');

/**
 * 勤務場所マスタ取得
 */
const getWorkLocations = async (req, res, next) => {
  try {
    const workLocations = await masterService.getWorkLocations();
    
    return sendSuccess(res, { workLocations });
  } catch (error) {
    next(error);
  }
};

/**
 * ジョブマスタ取得
 */
const getJobs = async (req, res, next) => {
  try {
    const { workDate } = req.query;
    const jobs = await masterService.getJobs(workDate);
    
    return sendSuccess(res, { jobs });
  } catch (error) {
    next(error);
  }
};

/**
 * 休暇種別マスタ取得
 */
const getVacationTypes = async (req, res, next) => {
  try {
    const vacationTypes = await masterService.getVacationTypes();
    
    return sendSuccess(res, { vacationTypes });
  } catch (error) {
    next(error);
  }
};

/**
 * 月次サマリー取得
 */
const getMonthlySummary = async (req, res, next) => {
  try {
    const { employeeId, year, month } = req.query;
    
    const validationError = validateQuery(req.query, ['employeeId', 'year', 'month']);
    if (validationError) {
      return sendError(res, validationError.message);
    }
    
    const summary = await masterService.getMonthlySummary(
      employeeId,
      parseInt(year),
      parseInt(month)
    );
    
    return sendSuccess(res, { summary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkLocations,
  getJobs,
  getVacationTypes,
  getMonthlySummary
};












