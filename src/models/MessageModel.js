const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const MessageSchema = mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    from: {
        type: ObjectId,
        required: true,
    },
    to: {
        type: ObjectId,
        required: true,
        select: false,
    },
    time: {
        type: Number,
        default: Date.now
    }
});

MessageSchema.pre('save', async function(next) {
    
    next();
});

module.exports = mongoose.model('Message',MessageSchema);
