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

    async findByIdSelectName(_id) {
        return await User.findOne({_id}).select({ 'username': 1});
    }
    async getUsersWhereNot(userId) {
        return await User.find({ _id: { $ne: ObjectId(userId) } });
    }
    
    async getUserByName(myId, username) {
        return await User.find({
            _id: { $ne: ObjectId(myId), username }
        });
    }
    async getAllUsers(){
        console.log("get user");
        await User.find()
        .then(data => {
            console.log(data);
          return data
        })
    }
    async saveUserFcmToken(userId, fcmToken) {
        return await User.updateOne({ _id: ObjectId(userId) }, {
            fcmToken
        });
    }
    async saveNewpassword(id, password) {
        const hash = await bcrypt.hash(password, 10);
        password = hash;
        return await User.updateOne({_id: ObjectId(id) }, {
            password
        });
    }

}

module.exports = new UserRepository();