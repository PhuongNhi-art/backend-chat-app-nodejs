const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
let MessageType = {
    TEXT: 0,
    PICTURE: 1,
    AUDIO: 2,
    VIDEO : 3,
};
let EventType = {
    MESSAGE: 0,
    // JOIN: 1,
    SERVER: 2,
    // TYPING: 3
}
// let readStatus = {

// }
const MessageSchema = mongoose.Schema({
    index:{
        type: Number,
        unique: true,
    },
    from: {
        type: ObjectId,
        required: true,
        ref : 'User',
    },
    room: {
        type: ObjectId,
        required: true,
        ref : 'Room',
    },
    type: {
        type: Number,
        required: true,
    },
    eventType:{
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    // readStatus: {
    //     type: Number,
    //     required: true,
    // },
    createdAt: {
        type: Number,
        default: Date.now
    },
    updatedAt: {
        type: Number,
        default: Date.now
    }

    
});

MessageSchema.pre('save', async function(next) {
    let count = await Message.countDocuments({});
    this.index = count + 1;
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
    next();
});

let Message = mongoose.model('Message', MessageSchema);
module.exports= {Message, MessageType, EventType};
