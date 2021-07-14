const UserRepository = require('../repositories/UserRepository');
const MessageRepository = require('../repositories/MessageRepository');
class MessageController {

    async create(req, res) {
        try {
            const { message, from, to } = req.body;
        
            console.log(req.body);
            if (!message|| !from|| !to) {
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

            const receiveUser = (await UserRepository.findById(to)) != null;
            if (!receiveUser) {
                return res.json({
                    success: false,
                    errorMessage: "User receive is not defined",
                })
            }
            const sendMessage = {
                message,
                from,
                to,
            }
            await MessageRepository.create(sendMessage);
            return res.json({
                success: true,
                message: sendMessage
            })

        } catch (err) {
            console.log(err.message)
            return res.json({
                success: false,
                message: err,
                
            })
        }
    }
    async getMessage(req, res) {
        try {
            const {id} = req._id;
            const username = req.query.username;
            if (username) {
                let user = await UserRepository.getUserByName(myId, username);
                const lowerUserId = myId < user._id ? myId : user._id;
                const higherUserId = myId > user._id ? myId : user._id;
                user.chatId = hash(lowerUserId, higherUserId);
                return res.json({
                    success: true, message: user
                })
            }
            let users = await UserRepository.getUsersWhereNot(myId);
            users = users.map((user) => {
                const lowerUserId = myId < user._id ? myId : user._id;
                const higherUserId = myId > user._id ? myId : user._id;
                user.chatId = hash(lowerUserId, higherUserId);
                return user;
            });
            return res.json({
                success: success, message:  users,
            });
        } catch (err) {
            return res.json({
                success: false,
                message: err
            })
        }
    }


}

module.exports = new MessageController();