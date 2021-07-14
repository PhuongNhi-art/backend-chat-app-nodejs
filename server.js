require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoDB = require('./src/databases/mongodb/index');
// const shared = require('./src/shared');
var bodyParser = require('body-parser')

const app = express();

app.use(express.json());
app.use(cors());
const server = require('http').createServer(app);
var io = require("socket.io")(server);

var jsonParser = bodyParser.json()
app.use(jsonParser)
app.use('/', require('./src/routes'));

var clients = {};
io.on("connection", (socket)=>{
    console.log("connected");
    console.log(socket.id, "has joined");
    socket.on("signin",(id)=>{
        clients[id] = socket;
        // console.log("signin ", id);
        // console.log(clients[id]);
    });
    socket.on("texting", (msg)=>{
        console.log(msg);
        let targetId = msg.targetId;
        if (clients[targetId]) {
            console.log("have client");
            
            clients[targetId].emit("texting",msg["texting"]);
        }
    });
    socket.on("message", (msg)=>{
        console.log(msg);
        let targetId = msg.targetId;
        // console.log(targetId);
        // console.log(msg["message"]);
        // console.log(clients[targetId]);
        // clients[targetId].emit("message",msg["message"]);
        if (clients[targetId]) {
            console.log("have client");
            clients[targetId].emit("message",msg["message"]);
        }
    });
});
server.listen('8081', () => {
    console.log("Listening on port 8081");
    mongoDB.connect();
});