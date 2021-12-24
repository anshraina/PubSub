const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
    let jwtToken = req.header('Cookie')

    if (!jwtToken) return res.status(401).send('Access denied no token provided');
    jwtToken = jwtToken.split("=")
    const token = jwtToken[1]

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(404).send("Not a valid user");
    }

}