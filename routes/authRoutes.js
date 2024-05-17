const express = require('express');
const { signup, signin, refreshToken, logout, logoutAll } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/refresh-token', refreshToken);
router.get('/logout', logout);
router.get('/logout-all', logoutAll);

module.exports = router;
