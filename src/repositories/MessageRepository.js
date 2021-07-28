const {Message} = require('../models/MessageModel');
class MessageRepository {

    async create({from, room, type, eventType, content}) {
        const message = await Message.create({
            from, room, type, eventType, content
            
        });
        console.log(message);
        return message;
    }
    async findByRoomId(room) {
        return await Message.find({room});
    }

}

module.exports = new MessageRepository();