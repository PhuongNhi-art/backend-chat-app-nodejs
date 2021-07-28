const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
let ChatType = {
    PERSONAL: 0,
    GROUP: 1,
};
let isActive = 0;//isActive
const RoomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    admin: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    lastMessage: {
        type: ObjectId,
        default: null,
        ref : 'Message'

    },
    type:{
        type: Number,
        // default: ChatType.PERSONAL,
    },
    unread:{
        type: Number,
        default:0,
    },
    users: [{
        type: ObjectId,
        ref : 'User',
    }],
    isActive : {
        type: Number,
        required: true,
        default: isActive,
    },
    createdAt: {
        type: Number,
        default: Date.now
    },
    updatedAt: {
        type: Number,
        default: Date.now
    }
});

RoomSchema.pre('save', async function(next) {
    
    // const salt = await bcrypt.genSalt()
    this.updatedAt = new Date().getTime();
    this.createdAt = new Date().getTime();
    // this.updatedAt = null;
    next();
});
RoomSchema.pre('update', async function (next) {
    console.log(this.updatedAt);
    this.updatedAt = new Date().getTime();
    next();
});

module.exports = mongoose.model('Room', RoomSchema);
