require('dotenv').config()
const express = require('express');
const cors = require('cors');
const constants = require('./src/utils/constants');
const mongoDB = require('./src/databases/mongodb/index');
// const shared = require('./src/shared');
var bodyParser = require('body-parser');
const MessageController = require('./src/controllers/MessageController');

const app = express();

app.use(express.json());
app.use(cors());
const server = require('http').createServer(app);
var io = require("socket.io")(server);

var jsonParser = bodyParser.json()
app.use(jsonParser)
app.use('/', require('./src/routes'));

var clients = {};
// io.use(async (socket, next) =>{
//     try {
//     clients.set(socket.id, (user._id).toString());
//     console.log(clients);
//     return next();
//     } catch (error) {
//         console.log(error);
//     }
    
// });
// console.log(constanst.CONNECTION);
io.on(constants.CONNECTION, function(socket){
    console.log("connected");
    socket.on(constants.SIGN_IN,(id)=>{
                clients[id] = socket;
                console.log("signin ", id);
                // console.log(clients[id]);
            });
    socket.on(constants.JOIN_ROOM, async function(room){
        socket.join(room);
        console.log("join ",room);
    });
    socket.on(constants.MESSAGE, async function(data){
        // console.log(data);
        await MessageController.sendMessage(data, io, clients);
        // let userIdInRoom = await RoomRepository.findById(room);
    });
    socket.on(constants.ON_TYPING, async function(data){
        console.log(data);
        await io.sockets.in(data.room).emit(constants.ON_TYPING, data);
    });

});
// io.on("connection", (socket)=>{
//     console.log("connected");
//     console.log(socket.id, "has joined");
//     socket.on("signin",(id)=>{
//         clients[id] = socket;
//         // console.log("signin ", id);
//         // console.log(clients[id]);
//     });
//     socket.on("texting", (msg)=>{
//         console.log(msg);
//         let targetId = msg.targetId;
//         if (clients[targetId]) {
//             console.log("have client");
            
//             clients[targetId].emit("texting",msg["texting"]);
//         }
//     });
//     socket.on("message", (msg)=>{
//         console.log(msg);
//         let targetId = msg.targetId;
        
//         if (clients[targetId]) {
//             console.log("have client");
//             clients[targetId].emit("message",msg["message"]);
//         }
//     });
// });
server.listen('8081', () => {
    console.log("Listening on port 8081");
    mongoDB.connect();
});