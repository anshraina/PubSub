const joi = require("joi")
const express = require("express")
const router = express.Router()
const Group = require("../models/Group")
const { User } = require("../models/User")
const auth = require("../middleware/auth")


router.get('/new', auth, (req, res) => {
    res.render("newGroup")
})


router.get('/:id', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        const group = await Group.findById(req.params.id).populate('messages.sentBy')


        res.render("individualGroup", { group: group, user: user })
        next()

    } catch (ex) {
        console.log(ex.message)
    }

})

router.get('/subscribe/:id', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        const group = await Group.findById(req.params.id)

        group.subscribers.push(user._id);
        await group.save()

        res.redirect("/myChannels")
        next()

    } catch (ex) {
        console.log(ex)
    }

})
router.get('/delete/:id', auth, async (req, res) => {
    try {

        await Group.findOneAndDelete(req.params.id)
        res.redirect("/groups")


    } catch (ex) {
        console.log(ex)
    }

})

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const groups = await Group
            .find()
            .populate('createdBy')

        res.render("groups", { groups: groups, user: user })

    } catch (ex) {
        console.log(ex.message)
    }

})


router.post('/new', auth, async (req, res) => {
    console.log(req.user._id)
    let group = new Group({
        title: req.body.title,
        description: req.body.description,
        createdBy: req.user._id
    })
    try {
        group = await group.save();
        res.redirect("/groups")
    }
    catch (ex) {
        console.log(ex.message)
    }

})

router.post('/:id/messages', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
        const message = {
            text: req.body.chat,
            sentBy: req.user._id,
        }
        group.messages.push(message)
        group.save()
        res.redirect(`/groups/${req.params.id}`)
    }
    catch (ex) {
        res.status(400).send(ex.message)
    }

})

module.exports = router