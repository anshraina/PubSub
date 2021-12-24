const joi = require("joi")
const express = require("express")
const router = express.Router()
const { User } = require("../models/User")
const jwt = require("jsonwebtoken")
const config = require("config")
const bcrypt = require("bcrypt");

const schema = joi.object({
    email: joi.string().min(5).max(255).required().email(),
    password: joi.string().min(1).max(1024).required()
})

router.get("/", (req, res) => {
    res.render("signin")
})

router.post("/", async (req, res) => {

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    try {
        let user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).send('Invalid email or password')

        const validPasword = await bcrypt.compare(req.body.password, user.password);
        if (!validPasword) return res.status(400).send('Invalid emial or password');

        const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'))


        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 3000000)

        })

        res.redirect("/groups")

    }
    catch (ex) {
        console.log(ex.message)
    }

})

module.exports = router