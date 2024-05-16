const User = require('../models/user');

class UserService {
    async getUserById(userId) {
        const user = await User.findByPk(userId);
        return user;
    }

}

module.exports = new UserService();
