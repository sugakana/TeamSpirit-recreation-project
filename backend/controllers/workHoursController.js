/**
 * 工数実績コントローラー
 */
const workHoursService = require('../services/workHoursService');

/**
 * 工数実績取得
 */
const getWorkHours = async (req, res, next) => {
  try {
    const { employeeId, workDate } = req.query;
    
    if (!employeeId || !workDate) {
      return res.status(400).json({
        success: false,
        message: '従業員IDと作業日が必要です。'
      });
    }
    
    const workHours = await workHoursService.getWorkHours(employeeId, workDate);
    
    res.json({
      success: true,
      workHours
    });
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
    
    if (!workHoursData.employeeId || !workHoursData.workDate || !workHoursData.jobCode) {
      return res.status(400).json({
        success: false,
        message: '従業員ID、作業日、ジョブコードが必要です。'
      });
    }
    
    await workHoursService.saveWorkHours(workHoursData);
    
    res.json({
      success: true,
      message: '工数実績を登録しました。'
    });
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
      return res.status(400).json({
        success: false,
        message: '工数実績IDが必要です。'
      });
    }
    
    await workHoursService.deleteWorkHours(workHoursId);
    
    res.json({
      success: true,
      message: '工数実績を削除しました。'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkHours,
  saveWorkHours,
  deleteWorkHours
};


