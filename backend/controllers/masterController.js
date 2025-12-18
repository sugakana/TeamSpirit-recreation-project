/**
 * マスタコントローラー
 */
const masterService = require('../services/masterService');

/**
 * 勤務場所マスタ取得
 */
const getWorkLocations = async (req, res, next) => {
  try {
    const workLocations = await masterService.getWorkLocations();
    
    res.json({
      success: true,
      workLocations
    });
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
    
    res.json({
      success: true,
      jobs
    });
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
    
    res.json({
      success: true,
      vacationTypes
    });
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
    
    if (!employeeId || !year || !month) {
      return res.status(400).json({
        success: false,
        message: '従業員ID、年、月が必要です。'
      });
    }
    
    const summary = await masterService.getMonthlySummary(
      employeeId,
      parseInt(year),
      parseInt(month)
    );
    
    res.json({
      success: true,
      summary
    });
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










