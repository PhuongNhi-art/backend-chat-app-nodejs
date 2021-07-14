const UserRepository = require('../repositories/UserRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtConfig = require('../config/jwt');
const hash = require('../utils/hash');
require('dotenv').config();
const mailgun = require("mailgun-js");
const DOMAIN = process.env.DOMAIN_MAILGUN;
const mg = mailgun({apiKey:process.env.API_KEY, domain: DOMAIN});
const User = require('../models/UserModel');
function generateJwtToken(user){
    const { _id } = user;
    return jwt.sign({
        _id,
    }, jwtConfig.secret);
}


class UserController {

    async create(req, res) {
        try {
            const { email, username, password } = req.body;
        
            console.log(req.body);
            if (!email || !username || !password) {
                return res.json({
                    success: false,
                    message: "Invalid fields.",
                })
            }
            const user = {
                email,
                username,
                password,
            }
            const userExists = (await UserRepository.findByEmail(user.email)) != null;
            
            if (userExists) {
                return res.json({
                    success: false,
                    errorMessage: "Email already registered",
                })
            }
            await UserRepository.create(user);
            const newUser = await UserRepository.findByEmail(user.email);
            const token = generateJwtToken(newUser);
            user.password = undefined;
            return res.json({
                success: true,
                message: newUser,token,
            })

        } catch (err) {
            console.log(err.message)
            return res.json({
                success: false,
                message: err,
                
            })
        }
    }

    async login(req, res){
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.json({ 
                    success: false, 
                    message: "Invalid fields." })
            }
            const user = await UserRepository.findByEmail(email);
            if (!user){
                return res.json({ success: false, message: "Invalid email" });
            }
            if (!await bcrypt.compare(password, user.password)){
                console.log(password);
                console.log(user.password);
                return res.json({ success: false, message: "Invalid password" });
            }
            const token = generateJwtToken(user);
            user.password = undefined;
            return res.json({
                success: true,
                message: user,token
            });
        } catch (err){
            return res.json({
                success: false,
                message: err
            })
        }
    }
    // async getUsers(req, res) {
    //     try {
    //         const myId = req._id;
    //         // const { myId} = req.body;
    //         // console.log("myId"+myId);
    //         const username = req.query.username;
    //         if (username) {
    //             let user = await UserRepository.getUserByName(myId, username);
    //             const lowerUserId = myId < user._id ? myId : user._id;
    //             const higherUserId = myId > user._id ? myId : user._id;
    //             user.chatId = hash(lowerUserId, higherUserId);
    //             return res.json({
    //                 success: true, message: user
    //             })
    //         }
    //         let users = await UserRepository.getUsersWhereNot(myId);
    //         users = users.map((user) => {
    //             const lowerUserId = myId < user._id ? myId : user._id;
    //             const higherUserId = myId > user._id ? myId : user._id;
    //             user.chatId = hash(lowerUserId, higherUserId);
    //             return user;
    //         });
    //         return res.json({
    //             success: success, message:  users,
    //         });
    //     } catch (err) {
    //         return res.json({
    //             success: false,
    //             message: err,
                
    //         })
    //     }
    // }
    async getUsers(req, res){
        // try {
        //     const users = await UserRepository.getAllUsers();
        //     return res.json({
        //         success: message, user: users
        //     })
        // } catch (err) {
        //     return res.json({
        //         success: false,
        //         message: err
        //     })
        // }
    //     User.find()
    // .then(data => {
    //   res.send(data);
    // })
    // .catch(err => {
    //   res.status(500).send({
    //     message:
    //       err.message || "Some error occurred while retrieving tutorials."
    //   });
    // });t
    try {
        const {userId} = req.body;
    let users = await UserRepository.getUsersWhereNot(userId);
    return res.json({
        success: true,
        message: users
    });
    } catch (error) {
        
    }
    
    }
    async saveFcmToken(req, res) {
        try {
            const { fcmToken } = req.body;
            console.log("fcmToken = ", fcmToken);
            const myId = req._id;
            console.log("myId", myId);
            const myUser = await UserRepository.saveUserFcmToken(myId, fcmToken);
            return res.json({
                success: message, user: myUser
            })
        } catch (err) {
            return res.json({
                success: false,
                message: err
            })
        }
    }
    async forgotPassword (req,res){
        try {
            const {email} = req.body;
        if (!email) {
            return res.json({ 
                success: false, 
                message: "Invalid fields." })
        }
        const user = await UserRepository.findByEmail(email);
        if (!user){
            return res.json({ success: false, message: "Invalid email" });
        }
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var string_length = 8;
        var randomstring = '';
        for (var i=0; i<string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
        }
        console.log(randomstring);
        // user.password = randomstring;
        const userId = user._id;
        const userUpdate = await UserRepository.saveNewpassword(userId,randomstring);
        const data = {
            from : 'ChatApp <nhi10800@gmail.com>',
            to: email,
            subject: 'Reset your ChatApp password',
            html: 
            `<h2>ChatApp</h2>
            <p>You has requested a password reset for your ChatApp account. 
            This is new password: <b>${randomstring}</b></p>
            <p>After logging in, please change your password</p>`
        }
        
        mg.messages().send(data,function(error,body){
            if (error){
                console.log(error);
            }
            console.log(body);
        });
        return res.json({
            success: true, message: 'New password has been sent to your email', user: user
        })
        } catch (err) {
            return res.json({
                success: false,
                message: err
            })
        }
        
    }
    async changePassword(req, res){
        try {
            const {_id, newPassword} = req.body;
            if (!newPassword||!_id) {
                return res.json({ 
                    success: false, 
                    message: "Invalid fields." })
            }
            const user = await UserRepository.findById(_id);
            if (!user){
                return res.json({ success: false, message: "Invalid user" });
            }
            const userUpdate = await UserRepository.saveNewpassword(_id,newPassword);
            return res.json({
                success: true, message: 'Password update successful'
            })

        } catch (err) {
            return res.json({
                success: false,
                message: err
            })
        }
    }

}

module.exports = new UserController();