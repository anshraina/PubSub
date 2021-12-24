const express = require("express");
const sampleRouter = require("./routes/sample")
const registerRouter = require("./routes/register")
const signInRouter = require("./routes/signin")
const groupRouter = require("./routes/groups")
const logoutRouter = require("./routes/logout")
const myChannelRouter = require("./routes/myChannels")
const helmet = require("helmet");
const compression = require("compression");
const Group = require("./models/Group")
const mongoose = require("mongoose")
require("dotenv").config();
const app = express();
app.use(helmet());
app.use(compression());


app.use(express.urlencoded({ extended: false }))

const io = require("socket.io")(3000)


io.on('connection', socket => {
    socket.broadcast.emit("connected", 'Connection established succesfully')
    socket.on('new-user', name => {
        socket.broadcast.emit('user-connected', name)
    })

    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message })
    })

})
app.set('view engine', 'ejs')
app.use(express.json()); 
app.use('/sample', sampleRouter)
app.use('/register', registerRouter)
app.use('/signin', signInRouter)
app.use('/groups', groupRouter)
app.use('/logout', logoutRouter)
    app.use('/myChannels', myChannelRouter)



app.get('/', (req, res) => {

    res.render("index")
})

const url = process.env.MONGO_URL || "mongodb://localhost/PubSub";

mongoose.connect(process.env.MONGO_URL || "mongodb://localhost/PubSub", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log("connected to MongoDB successfully"))
    .catch(err => console.log(err))

const port = process.env.PORT || 5000
app.listen(port);