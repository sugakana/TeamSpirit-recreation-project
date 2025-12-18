const express = require('express');
const router = express.Router();
const workHoursController = require('../controllers/workHoursController');

/**
 * 工数実績取得API
 * GET /api/work-hours
 */
router.get('/', workHoursController.getWorkHours);

/**
 * 工数実績登録・更新API
 * POST /api/work-hours
 */
router.post('/', workHoursController.saveWorkHours);

/**
 * 工数実績削除API
 * DELETE /api/work-hours/:workHoursId
 */
router.delete('/:workHoursId', workHoursController.deleteWorkHours);

module.exports = router;

