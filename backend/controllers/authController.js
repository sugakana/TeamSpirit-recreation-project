/**
 * 認証コントローラー
 */
const authService = require('../services/authService');
const { validateEmployeeId } = require('../middleware/validator');

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
      return res.status(400).json({
        success: false,
        message: employeeIdResult.message
      });
    }
    
    const password = passwordInput.trim();
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'パスワードを入力してください。'
      });
    }
    
    const result = await authService.login(employeeIdResult.value, password);
    
    res.json({
      success: true,
      employeeId: result.employeeId,
      employeeName: result.employeeName,
      message: 'ログインに成功しました。'
    });
  } catch (error) {
    if (error.message === '社員コードまたはパスワードが違います。') {
      return res.status(401).json({
        success: false,
        message: error.message
      });
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
      return res.status(400).json({
        success: false,
        message: '従業員IDが必要です。'
      });
    }
    
    const employee = await authService.getEmployee(employeeId);
    
    res.json({
      success: true,
      employee
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
  login,
  getEmployee
};


