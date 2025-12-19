/**
 * 認証コントローラー
 */
const authService = require('../services/authService');
const { validateEmployeeId } = require('../middleware/validator');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * ログイン
 */
const login = async (req, res, next) => {
  try {
    let employeeIdInput = '';

    if (typeof req.body.employeeId === 'string') {
      employeeIdInput = req.body.employeeId;
    }

    let passwordInput = '';

    if (typeof req.body.password === 'string') {
      passwordInput = req.body.password;
    }
    
    const employeeIdResult = validateEmployeeId(employeeIdInput);
    if (!employeeIdResult.valid) {
      return sendError(res, employeeIdResult.message);
    }
    
    const password = passwordInput.trim();
    if (!password) {
      return sendError(res, 'パスワードを入力してください。');
    }
    
    const result = await authService.login(employeeIdResult.value, password);
    
    return sendSuccess(res, {
      employeeId: result.employeeId,
      employeeName: result.employeeName
    }, 'ログインに成功しました。');
  } catch (error) {
    if (error.message === '社員コードまたはパスワードが違います。') {
      return sendError(res, error.message, 401);
    }
    next(error);
  }
};

/**
 * 従業員情報取得
 */
const getEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    
    if (!employeeId) {
      return sendError(res, '従業員IDが必要です。');
    }
    
    const employee = await authService.getEmployee(employeeId);
    
    return sendSuccess(res, { employee });
  } catch (error) {
    if (error.message === '従業員が見つかりません。') {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
};

module.exports = {
  login,
  getEmployee
};


