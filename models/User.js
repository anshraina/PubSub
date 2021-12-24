const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        required: true,

    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024
    },

})

const User = mongoose.model("User", userSchema);
exports.User = User
