const RoomRepository = require('../repositories/RoomRepository');
const Room = require('../models/RoomModel');

const UserController = require('./UserController');
const UserRepository = require('../repositories/UserRepository');
class RoomController {
    async createRoom(req, res) {
        try {
            let users = req.body.users;
            const name = req.body.name;
            const type = req.body.type;
            const admin = req.body.admin;
            users.push(req.body.admin);
            let room = new Room({users: users, admin: admin, name: name, type: type});
            
            const roomExists = (await RoomRepository.findByNameAndAdmin(room.name, room.admin)) != null;
            
            if (roomExists) {
                return res.json({
                    success: false,
                    errorMessage: "Room already registered",
                })
            }
            await RoomRepository.create(room);
            const newRoom = await RoomRepository.findByNameAndAdmin(name, admin);
            return res.json({
                success: true,
                message: newRoom
            })

        } catch (err) {
            console.log(err.message)
            return res.json({
                success: false,
                message: err,
                
            });
        }
    }
    // async getRoom(req,res){
    //     try {
    //         const {userId} = req.body;
    //     let rooms = await RoomRepository.findByUserId(userId);
    //     // let room;
        
       
    //     // console.log(rooms[0].name);
    //     return res.json({
    //         success: true,
    //         message: rooms
    //     });
    //     } catch (error) {
            
    //     }
    // }
    async getRoom(req,res) {
        try {
            //get room from database
            const {userId} = req.body;
            let foundedRoom = await Room.find({"users": {"$in": userId}})
            .populate('users', '_id username email', {
                _id: {
                    $ne: userId //except the current user
                }
            }).populate("lastMessage").populate({
                path: 'last_msg_id',
                populate: {path: 'from'}
            }).populate("admin", '_id username email');
            return res.json({
                        success: true,
                        message: foundedRoom
                    });
        } catch (e) {
            return res.json({
                        success: false,
                        message: e
                    });
        }
    }
    // async updateLastMessageRoom(roomId, messageId){
        
    //     console.log('roomId', roomId);
    //     console.log('messageId', messageId);
    //     const roomUpdate = await RoomRepository.updateLastMessage(roomId, messageId);
    //     print("roomUpdate")
    // }
     
}
module.exports = new RoomController();