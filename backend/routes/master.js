const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');

/**
 * 勤務場所マスタ取得API
 * GET /api/master/work-locations
 */
router.get('/work-locations', masterController.getWorkLocations);

/**
 * ジョブマスタ取得API
 * GET /api/master/jobs
 */
router.get('/jobs', masterController.getJobs);

/**
 * 休暇種別マスタ取得API
 * GET /api/master/vacation-types
 */
router.get('/vacation-types', masterController.getVacationTypes);

module.exports = router;
