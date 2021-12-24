const express = require("express")

const router = express.Router()

router.get("/", (req, res) => {
    res.cookie('jwt', '', { expires: new Date(Date.now() + 1) })
    res.redirect("/")
})

module.exports = router