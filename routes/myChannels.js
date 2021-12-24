const express = require("express")
const auth = require("../middleware/auth")
const { User } = require("../models/User")
const Group = require("../models/Group")
const router = express.Router()

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('groups.groupId')
        const groups = await Group.find({ "subscribers": user._id }).populate('createdBy')
        res.render("myChannel", { groups: groups, user: user })

    } catch (ex) {
        console.log(ex.message)
    }

})

router.get('/unsubscribe/:id', auth, async (req, res) => {
    const user = await User.findById(req.user._id)
    const group = await Group.findByIdAndUpdate(req.params.id, { $pull: { 'subscribers': user._id } }, { safe: true, upsert: true })
    res.redirect('/myChannels')
})

module.exports = router