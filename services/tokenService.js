const jwt = require('jsonwebtoken');
const Token = require('../models/token');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '30d' }
        );

        return {
            accessToken,
            refreshToken
        };
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

    async saveToken(userId, refreshToken, deviceId) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // 30 дней

        const tokenData = await Token.findOne({ where: { userId, deviceId } });
        if (tokenData) {
            tokenData.token = refreshToken;
            tokenData.expiryDate = expiryDate;
            return tokenData.save();
        }

        const token = await Token.create({ userId, token: refreshToken, deviceId, expiryDate });
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.destroy({ where: { token: refreshToken } });
        return tokenData;
    }

    async removeTokensForUser(userId) {
        const tokenData = await Token.destroy({ where: { userId } });
        return tokenData;
    }

    async findToken(refreshToken) {
        const token = await Token.findOne({ where: { token: refreshToken } });
        return token;
    }
}

module.exports = new TokenService();
