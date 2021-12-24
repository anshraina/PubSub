const express = require("express")
const mongoose = require("mongoose")
const { User } = require("../models/User")
var passwordValidator = require('password-validator');
const bcrypt = require("bcrypt");
const router = express.Router()
const joi = require("joi")
let passwordSchema = new passwordValidator();
passwordSchema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits(2)
    .has().not().spaces()

const schema = joi.object({
    name: joi.string().min(2).max(255).required(),
    email: joi.string().min(5).max(255).required().email(),
    password: joi.string().min(5).max(1024).required()
})

router.get('/', (req, res) => {
    res.render("register")
});

router.post('/', async (req, res) => {

    const { error } = schema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const result = passwordSchema.validate(req.body.password, { list: true });
    if (result.length != 0) {

        return res.send("Not a safe password")
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already exists');

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,

    })
    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user = await user.save();
        res.redirect("/signin");
    }
    catch (ex) {
        res.status(400).send(ex.message)
    }
})

module.exports = router;
