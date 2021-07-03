const User = require('../models/UserModel');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
class UserRepository {

    async create({ email, username, password }) {
        await User.create({
            email,
            username,
            password,
        });
    }

    async findByEmail(email) {
        return await User.findOne({email }).select({ 'email': 1, 'username': 1, 'password': 1 });
    }
    async findById(_id) {
        return await User.findOne({_id}).select({ 'email': 1, 'username': 1, 'password': 1 });
    }
    async getUsersWhereNot(userId) {
        return await User.find({ _id: { $ne: ObjectId(userId) } });
    }

    async getUserByName(myId, username) {
        return await User.find({
            _id: { $ne: ObjectId(myId), username }
        });
    }

    async saveUserFcmToken(userId, fcmToken) {
        return await User.updateOne({ _id: ObjectId(userId) }, {
            fcmToken
        });
    }
    async saveNewpassword(email, password) {
        const hash = await bcrypt.hash(password, 10);
        password = hash;
        return await User.updateOne({email: String(email) }, {
            password
        });
    }

}

module.exports = new UserRepository();