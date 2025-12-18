const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

/**
 * お知らせ情報取得API
 * GET /api/notifications
 */
router.get('/', notificationController.getNotifications);

module.exports = router;
