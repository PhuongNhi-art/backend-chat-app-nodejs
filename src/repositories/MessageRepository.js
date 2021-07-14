const Message = require('../models/MessageModel');
class MessageRepository {

    async create({ message, from, to}) {
        await Message.create({
            message,
            from,
            to,
            
        });
    }

}

module.exports = new MessageRepository();