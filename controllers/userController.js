const userService = require('../services/userService');

// Получение информации о пользователе
const getUserInfo = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ id: user.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserInfo };
