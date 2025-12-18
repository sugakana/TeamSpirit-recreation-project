const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * ログイン認証API
 * POST /api/auth/login
 */
router.post('/login', authController.login);

/**
 * 従業員情報取得API
 * GET /api/auth/employee/:employeeId
 */
router.get('/employee/:employeeId', authController.getEmployee);

module.exports = router;
