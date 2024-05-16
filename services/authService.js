const bcrypt = require('bcryptjs');
const User = require('../models/user');
const tokenService = require('./tokenService');

class AuthService {
    async signup(email, password) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });
        return user;
    }

    async signin(email, password, deviceId) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const tokens = tokenService.generateTokens({ id: user.id });
        await tokenService.saveToken(user.id, tokens.refreshToken, deviceId);
        return tokens;
    }

    async refreshToken(refreshToken, deviceId) {
        const tokenRecord = await tokenService.findToken(refreshToken);
        if (!tokenRecord) {
            throw new Error('Invalid refresh token');
        }

        const user = tokenService.validateRefreshToken(refreshToken);
        if (!user) {
            throw new Error('Invalid refresh token');
        }

        const tokens = tokenService.generateTokens({ id: user.id });
        await tokenService.saveToken(user.id, tokens.refreshToken, deviceId);
        return tokens;
    }

    async logout(refreshToken) {
        await tokenService.removeToken(refreshToken);
    }

    async logoutAll(email) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }
        await tokenService.removeTokensForUser(user.id);
    }
}

module.exports = new AuthService();
