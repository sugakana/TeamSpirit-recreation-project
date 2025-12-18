/**
 * バリデーションミドルウェア
 */

/**
 * 従業員IDのバリデーション
 */
const validateEmployeeId = (employeeId) => {
  if (!employeeId || typeof employeeId !== 'string') {
    return { valid: false, message: '社員コードを入力してください。' };
  }
  
  const trimmed = employeeId.trim().toUpperCase();
  if (!trimmed) {
    return { valid: false, message: '社員コードを入力してください。' };
  }
  
  if (!/^\d{6}$/.test(trimmed)) {
    return { valid: false, message: '社員コードの桁数は数字6桁で入力してください。' };
  }
  
  return { valid: true, value: trimmed };
};

/**
 * 日付のバリデーション（YYYY-MM-DD形式）
 */
const validateDate = (date) => {
  if (!date) {
    return { valid: false, message: '日付が必要です。' };
  }
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return { valid: false, message: '日付はYYYY-MM-DD形式で入力してください。' };
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, message: '有効な日付を入力してください。' };
  }
  
  return { valid: true, value: date };
};

/**
 * 年月のバリデーション
 */
const validateYearMonth = (year, month) => {
  if (!year || !month) {
    return { valid: false, message: '年と月が必要です。' };
  }
  
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  
  if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
    return { valid: false, message: '有効な年を入力してください。' };
  }
  
  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return { valid: false, message: '有効な月を入力してください。' };
  }
  
  return { valid: true, year: yearNum, month: monthNum };
};

/**
 * リクエストボディのバリデーションミドルウェア
 */
const validateRequest = (rules) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const [field, validator] of Object.entries(rules)) {
      const value = req.body[field] || req.query[field] || req.params[field];
      const result = validator(value);
      
      if (!result.valid) {
        errors.push(result.message);
      } else if (result.value !== undefined) {
        // バリデーション済みの値を設定
        if (req.body[field]) req.body[field] = result.value;
        if (req.query[field]) req.query[field] = result.value;
        if (req.params[field]) req.params[field] = result.value;
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join('\n')
      });
    }
    
    next();
  };
};

module.exports = {
  validateEmployeeId,
  validateDate,
  validateYearMonth,
  validateRequest
};










