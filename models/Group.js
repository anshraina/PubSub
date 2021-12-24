const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    messages: [{
        text: {
            type: String,
            minlength: 1,
            maxlength: 255,

        },
        sentDate: {
            type: Date,
            default: Date.now
        },
        sentBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'

        }
    }],
    subscribers:
    {
        type: Array,
        default: []
    }

    ,
    description: {
        type: String,
        minlength: 1,
        maxlength: 1024,

    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})

const Group = mongoose.model("Group", groupSchema)
module.exports = Group