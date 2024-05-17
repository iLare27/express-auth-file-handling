const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refreshToken');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

        return { accessToken, refreshToken };
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken, userAgent) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // 30 дней

        const tokenData = await RefreshToken.findOne({ where: { userId, userAgent } });
        if (tokenData) {
            tokenData.token = refreshToken;
            tokenData.expiryDate = expiryDate;
            return tokenData.save();
        }

        const token = await RefreshToken.create({ userId, token: refreshToken, userAgent, expiryDate });
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await RefreshToken.destroy({ where: { token: refreshToken } });
        return tokenData;
    }

    async removeTokensForUser(userId) {
        const tokenData = await RefreshToken.destroy({ where: { userId } });
        return tokenData;
    }

    async findToken(refreshToken) {
        const token = await RefreshToken.findOne({ where: { token: refreshToken } });
        return token;
    }
}

module.exports = new TokenService();
