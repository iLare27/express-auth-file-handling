const authService = require('../services/authService');

const signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authService.signup(email, password);
        const tokens = await authService.signin(email, password, req.headers['user-agent']);

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false, // используйте true, если у вас HTTPS
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 дней
        });

        res.status(201).json({ accessToken: tokens.accessToken, message: 'User created' });
    } catch (error) {
        if (error.message === 'User already exists') {
            res.status(400).json({ message: 'User already exists' });
        } else {
            res.status(400).send(error.message);
        }
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const tokens = await authService.signin(email, password, req.headers['user-agent']);
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false, // используйте true, если у вас HTTPS
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 дней
        });
        res.json({ accessToken: tokens.accessToken });
    } catch (error) {
        res.status(401).send(error.message);
    }
};

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    try {
        const tokens = await authService.refreshToken(refreshToken, req.headers['user-agent']);
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        res.json({ accessToken: tokens.accessToken });
    } catch (error) {
        res.status(403).send(error.message);
    }
};

const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    try {
        await authService.logout(refreshToken);
        res.clearCookie('refreshToken');
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const logoutAll = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    try {
        await authService.logoutAll(refreshToken);
        res.clearCookie('refreshToken');
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { signup, signin, refreshToken, logout, logoutAll };
