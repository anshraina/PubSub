const mongoose = require("mongoose")

const groupCollectionSchema = new mongoose.Schema({
    groups: [{
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        }
    }]
})

const GroupCollection = mongoose.model("GroupCollection", groupCollectionSchema)
module.exports = GroupCollection