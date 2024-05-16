const express = require('express');
const { getUserInfo } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/info', authenticateToken, getUserInfo);

module.exports = router;
