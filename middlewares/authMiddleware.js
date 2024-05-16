const tokenService = require('../services/tokenService');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401); // Unauthorized

    try {
        const userData = tokenService.validateAccessToken(token);
        if (!userData) return res.sendStatus(403); // Forbidden

        req.user = userData;
        next();
    } catch (error) {
        res.sendStatus(403); // Forbidden
    }
};

module.exports = { authenticateToken };
