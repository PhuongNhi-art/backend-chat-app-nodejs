const UserRepository = require('../repositories/UserRepository');
const MessageRepository = require('../repositories/MessageRepository');
const RoomRepository = require('../repositories/RoomRepository');
const {Message} = require('../models/MessageModel');
const constants = require('../utils/constants');
const RoomController = require('./RoomController');
class MessageController {
    async sendMessage(data, io, clients){
        try {
            console.log(data);
            const { from, room, type, eventType, content } = data;
           let roomFind = await RoomRepository.findById(room);
           if (!roomFind) {}
           console.log("day1");
           let sendMessage = new Message({from, room, type, eventType,  content});
           console.log("day2");
           const newMessage =  await MessageRepository.create(sendMessage);
           //update room (lastMessage, updatedAt);
        //    console.log(newMessage._id);
           console.log("day3");
           await RoomRepository.updateLastMessage(sendMessage.room, newMessage._id);
        //    console.log(sendMessage._id)
        //    const id = sendMessage._id;
        //    let message = await Message.findOne({id}).select({'_id':1, 'username': 1});
        //    console.log(message._id);
        // console.log(sendMessage);
        //get userid in room
        
        let userIdInRoom = await RoomRepository.findById(room);
        console.log("user in room",userIdInRoom.users);
            await io.sockets.in(room).emit(constants.MESSAGE, sendMessage);
            userIdInRoom.users.forEach(element => {
                if (clients[element]) {
                clients[element].emit(constants.NEW_MESSAGE, sendMessage);
                console.log(clients);
                console.log("success");
                
            }
            });
            console.log("day4");
        } catch (error) {
            
        }
    }
    async getMessage(req, res){
        try {
            const {roomId} = req.body;
            let roomFind = await RoomRepository.findById(roomId);
            if (!roomFind) {
                return res.json({
                    success: false,
                    errorMessage: "Undefinded room",
                })
            }
            let rooms = await MessageRepository.findByRoomId(roomId);
            return res.json({
                success: true,
                message: rooms
            });
        } catch (error) {
            return res.json({
                success: false,
                message: error.message,
                
            })
        }
    }
    async create(req, res) {
        try {
            const { from, room, type, eventType, content } = req.body;
        
            console.log(req.body);
            
            if (!from|| !room || !type || !eventType|| !content) {
                return res.json({
                    success: false,
                    message: "Invalid fields.",
                })
            }
            
            const sendUser = (await UserRepository.findById(from)) != null;
            
            if (!sendUser) {
                return res.json({
                    success: false,
                    errorMessage: "User send is not defined",
                })
            }

            const receiveRoom = (await RoomRepository.findById(room)) != null;
            if (!receiveRoom) {
                return res.json({
                    success: false,
                    errorMessage: "Room is not defined",
                })
            }
            let sendMessage = new Message({
                from, room, type, eventType,  content
            });
            await MessageRepository.create(sendMessage);
            // await sendMessage.save();
            return res.json({
                success: true,
                message: sendMessage
            })

        } catch (err) {
            console.log(err.message)
            return res.json({
                success: false,
                message: err.message,
                
            })
        }
    }




}

module.exports = new MessageController();