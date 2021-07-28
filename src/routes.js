const express = require('express');
const router = express.Router();

const UserController = require('./controllers/UserController');
const MessageController = require('./controllers/MessageController');
const RoomController = require('./controllers/RoomController');
// const userMiddleware = require('./middlewares/auths/user');

// const middlewares = {
//     user: userMiddleware
// }

router.get('/', (req, res) => {
    return res.json({
        warn: "me",
    })
});
//login user
router.post('/auth', UserController.login);
//register user
router.post('/user', UserController.create);
//forgot Password and change
router.post('/forgotpassword', UserController.forgotPassword);
router.post('/changepassword', UserController.changePassword);

//send Mesage
router.post('/sendmessage', MessageController.create);
//get all user
router.post('/allusers', UserController.getUsers);
//find username by id
router.post('/finduser', UserController.findUsernameById);

//create room(userId = admin)
router.post('/createroom', RoomController.createRoom);
//find room by user(userId)
router.post('/room', RoomController.getRoom);
//get message in room(roomId)
router.post('/getmessage', MessageController.getMessage);


module.exports = router;