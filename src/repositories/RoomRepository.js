const { Message } = require('../models/MessageModel');
const Room = require('../models/RoomModel');
// const mongoose = require('mongoose')
// let Schema = mongoose.Schema;
// let ObjectId = Schema.ObjectId;
const ObjectId = require('mongoose').Types.ObjectId;
class RoomRepository {

    async create({ name, admin, lastMessage, type, users, isActive}) {
        await Room.create({
            name, admin, lastMessage, type, users, isActive
        });
    }
    async findByNameAndAdmin(name, admin) {
        return await Room.findOne({name}, {admin}).select({ 'name': 1, 'admin': 1, 
        'isActive':1});
    }
    async findByUserId(id){
        return await Room.find({"users": {"$in": id}}).select();
    }
    async findById(_id) {
        return await Room.findOne({_id}).select({ 'users': 1});
    }
    async updateLastMessage(id, lastMessage) {
        console.log("id", id);
        console.log("lastMessage", lastMessage);
        return await Room.updateOne({_id: ObjectId(id) }, {
            lastMessage,"updatedAt": new Date().getTime()
            
        });
          
    }

}

module.exports = new RoomRepository();