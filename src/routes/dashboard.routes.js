const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Analytics API
 */

router.use(authMiddleware);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get system analytics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/', getDashboardStats);

module.exports = router;
