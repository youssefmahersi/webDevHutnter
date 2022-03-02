require('dotenv').config()
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Chat = require("./models/chat");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.JSONSECRET);
const authRoutes = require('./routes/auth');
const devRoutes = require("./routes/developer");
const employerRoutes = require("./routes/employer");
const sameRoute = require("./routes/same");
const app = express();


app.use(bodyParser.json()); // application/json
//middleware that handels file upload 



//serve images statisticly
app.use('/images', express.static(path.join(__dirname, 'images')));

//cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//routes

app.use('/auth', authRoutes);
app.use("/dev",devRoutes)
app.use("/employer",employerRoutes);
app.use(sameRoute)
// app.use(dbupdate);

//error handler
app.use((error, req, res, next) => {
  
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
//database connection
mongoose
  .connect(
    `mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@cluster0.zabr4.mongodb.net/dev-hunter?retryWrites=true&w=majority`,
    {useNewUrlParser: true, useUnifiedTopology: true}
  )
  .then(result => {
    console.log("database connected!");
    const server = app.listen(process.env.PORT,()=>{
      console.log("server listenning on port:",process.env.PORT);
  })
  const io = require("socket.io")(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
      io.on("connection",(socket)=>{
        socket.on('join', (data) => {
          socket.join(data.channelId, () => {
            
            socket.to(data.channelId).broadcast.emit('user-connected', data.un)
            socket.on('disconnect',()=>{
              socket.to(data.channelId).broadcast.emit('user-disconnected', data.un)
            })

          });
      
          socket.on('send message', (data) => {
            
              Chat.findOne({_id : data.chatId}).then(channel=>{
                const msg = {
                  senderId: data.senderId.toString(),
                  senderUsername: data.username,
                  profilePicture:data.profilePicture,
                  username:data.username,
                  message: cryptr.encrypt(data.message),
                  date : new Date()
                }
                
                channel.chat.push(msg);
                io.to(data.chatId).emit('new message',{
                  ...msg,
                  message: cryptr.decrypt(msg.message)
                })
                return channel.save();

              })
              
          });
          
          

      });
      })
    
  })
  .catch(err => console.log(err));